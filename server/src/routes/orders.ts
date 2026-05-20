import { Hono } from 'hono';
import { getSupabase, verifyAdmin } from '../supabase';

const router = new Hono();

// POST a new order (Checkout)
router.post('/', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const { user_id, total_amount, shipping_address, items } = await c.req.json();

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
    let finalUserId = user_id;
    const isUserValidUuid = user_id && uuidRegex.test(user_id);
    
    if (isUserValidUuid) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user_id)
        .single();
      
      if (!profile) {
        console.log(`User ${user_id} not found in profiles, attempting minimal auto-creation.`);
        // Try to get user data from auth
        const { data: { user } } = await supabase.auth.admin.getUserById(user_id);
        
        // Minimal insert to satisfy FK without guessing columns like 'email'
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: user_id, 
              full_name: user?.user_metadata?.full_name || 'Customer'
            }
          ]);
        
        if (insertError) {
          console.error("Profile creation failed, trying one more fallback...");
        }
      }
    }

    // 2. Create the Order - We try to use user_id if provided, even if profile check was uncertain
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
      // Final fallback to guest ONLY if the database absolutely rejects the user_id
      if (orderError.code === '23503') { // Foreign key violation
        const { data: guestOrder, error: guestError } = await supabase
          .from('orders')
          .insert([{ user_id: null, total_amount, shipping_address, status: 'pending' }])
          .select().single();
        if (guestError) throw guestError;
        return c.json({ ...guestOrder, warning: 'Order placed as guest due to profile sync issue' }, 201);
      }
      throw orderError;
    }

    // 2. Create Order Items
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

// GET orders for a specific user
router.get('/user/:userId', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const userId = c.req.param('userId');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return c.json([]); // Return empty array for invalid user ID
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
router.patch('/:id', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const id = c.req.param('id');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return c.json({ error: 'Invalid order ID format' }, 400);
    }
    const { status, cancellation_reason } = await c.req.json();
    const updateData: any = { status };

    if (cancellation_reason) {
      console.log(`Processing cancellation for order ${id}. Reason: ${cancellation_reason}`);
      const { data: order } = await supabase.from('orders').select('shipping_address').eq('id', id).single();
      if (order) {
        const baseAddress = order.shipping_address.split('\n\n--- CANCELLATION REASON ---')[0];
        updateData.shipping_address = `${baseAddress}\n\n--- CANCELLATION REASON ---\n${cancellation_reason}`;
      }
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
    
    if (!data || data.length === 0) {
      return c.json({ error: 'Order not found' }, 404);
    }
    return c.json(data[0]);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// DELETE an order
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
