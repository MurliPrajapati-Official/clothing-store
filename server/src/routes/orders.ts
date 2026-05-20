import { Hono } from 'hono';
import { getSupabase, verifyAdmin, verifyUser } from '../supabase';

const router = new Hono<{ Variables: { user: any } }>();

// POST a new order (Checkout - secure user-locked version)
router.post('/', verifyUser, async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const authenticatedUser = c.get('user');
    const user_id = authenticatedUser.id; // Securely pull user ID from JWT, preventing payload spoofing
    const { total_amount, shipping_address, items } = await c.req.json();

    // Validate items and product IDs to prevent UUID syntax errors
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const validItems = items.filter((item: any) => uuidRegex.test(item.productId));
    
    if (validItems.length === 0 && items.length > 0) {
      return c.json({ 
        error: 'Invalid Product IDs', 
        details: 'Some items in your cart are from demo data and cannot be ordered. Please remove items like "Classic Boys School Polo" from your cart and add them again from the shop.' 
      }, 400);
    }

    // 1. Ensure profile exists or create it to satisfy foreign key constraint
    const isUserValidUuid = user_id && uuidRegex.test(user_id);
    
    if (isUserValidUuid) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user_id)
        .single();
      
      if (!profile) {
        console.log(`User ${user_id} not found in profiles, attempting minimal auto-creation.`);
        const { data: { user } } = await supabase.auth.admin.getUserById(user_id);
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: user_id, 
              full_name: user?.user_metadata?.full_name || 'Customer'
            }
          ]);
        
        if (insertError) {
          console.error("Profile creation failed:", insertError.message);
        }
      }
    }

    // 2. Create the Order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user_id || null, 
          total_amount,
          shipping_address,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (orderError) {
      console.error("Order insertion failed:", orderError);
      throw orderError;
    }

    // 3. Create Order Items
    const orderItems = validItems.map((item: any) => ({
      order_id: orderData.id,
      product_id: item.productId,
      quantity: item.quantity,
      price_at_time: item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return c.json({ success: true, orderId: orderData.id }, 201);
  } catch (error: any) {
    console.error("Checkout Error Full:", error);
    return c.json({ 
      error: error.message || 'Internal Server Error',
      details: error.details || error.hint || 'No additional details available',
      code: error.code
    }, 500);
  }
});

// POST secure track order for guest lookup
router.post('/track', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const { orderId, email } = await c.req.json();
    if (!orderId || !email) {
      return c.json({ error: 'Order ID and email are required' }, 400);
    }
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(orderId)) {
      return c.json({ error: 'Invalid Order ID format' }, 400);
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    // Verify email is in the shipping address (case-insensitive check)
    const shippingAddressLower = (order.shipping_address || '').toLowerCase();
    if (!shippingAddressLower.includes(email.toLowerCase())) {
      return c.json({ error: 'Access denied: Email does not match this order' }, 403);
    }

    return c.json([order]); // Frontend expects an array of matching orders
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// GET secure linked guest orders matching the logged-in user's email address
router.get('/my-email-orders', verifyUser, async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const authenticatedUser = c.get('user');
    const email = authenticatedUser.email;
    if (!email) {
      return c.json([]);
    }

    const { data: allOrders, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const emailLower = email.toLowerCase();
    const matched = allOrders.filter((o: any) => 
      o.shipping_address?.toLowerCase().includes(emailLower)
    );

    return c.json(matched);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// GET orders for a specific user
router.get('/user/:userId', verifyUser, async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const userId = c.req.param('userId');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return c.json([]); // Return empty array for invalid user ID
    }

    // IDOR Protection: Ensure authenticated user owns these orders, or is an admin
    const authenticatedUser = c.get('user');
    if (authenticatedUser.id !== userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authenticatedUser.id)
        .single();
      
      if (!profile || profile.role !== 'admin') {
        return c.json({ error: 'Access denied: You can only view your own order history' }, 403);
      }
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return c.json(data);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// GET all orders (Admin only)
router.get('/', verifyAdmin, async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return c.json(data);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// PATCH update order status (Admin or User cancellation)
router.patch('/:id', verifyUser, async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const id = c.req.param('id');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return c.json({ error: 'Invalid order ID format' }, 400);
    }
    const { status, cancellation_reason } = await c.req.json();
    const authenticatedUser = c.get('user');

    // 1. Fetch the order to perform ownership and role checking
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    // 2. Fetch authenticated user's role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authenticatedUser.id)
      .single();

    const isAdmin = profile?.role === 'admin';

    // 3. Perform security verification check
    if (!isAdmin) {
      // Non-admin can ONLY change status to 'cancelled'
      if (status !== 'cancelled') {
        return c.json({ error: 'Access denied: Standard users can only cancel their own orders' }, 403);
      }
      // Non-admin can ONLY cancel their OWN orders
      if (order.user_id !== authenticatedUser.id) {
        return c.json({ error: 'Access denied: You can only cancel your own orders' }, 403);
      }
      // Non-admin can ONLY cancel orders if they are currently 'pending'
      if (order.status !== 'pending') {
        return c.json({ error: 'Access denied: Only pending orders can be cancelled' }, 403);
      }
    }

    const updateData: any = { status };

    if (cancellation_reason) {
      console.log(`Processing cancellation for order ${id}. Reason: ${cancellation_reason}`);
      const baseAddress = order.shipping_address.split('\n\n--- CANCELLATION REASON ---')[0];
      updateData.shipping_address = `${baseAddress}\n\n--- CANCELLATION REASON ---\n${cancellation_reason}`;
    }

    console.log(`Updating order ${id} with data:`, updateData);

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Update Error:', error);
      throw error;
    }
    
    return c.json(data[0]);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// DELETE an order (Admin only)
router.delete('/:id', verifyAdmin, async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const id = c.req.param('id');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return c.json({ error: 'Invalid order ID format' }, 400);
    }
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default router;
