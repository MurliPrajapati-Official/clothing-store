import express, { Request, Response } from 'express';
import { supabase, verifyAdmin } from '../supabase';

const router = express.Router();

// POST a new order (Checkout)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { user_id, total_amount, shipping_address, items } = req.body;

    // Validate items and product IDs to prevent UUID syntax errors
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const validItems = items.filter((item: any) => uuidRegex.test(item.productId));
    
    if (validItems.length === 0 && items.length > 0) {
      return res.status(400).json({ 
        error: 'Invalid Product IDs', 
        details: 'Some items in your cart are from demo data and cannot be ordered. Please remove items like "Classic Boys School Polo" from your cart and add them again from the shop.' 
      });
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
          // If it fails again, maybe it needs 'username'? Or it's already there?
          // We'll proceed and let the order insert attempt decide the fate
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
        return res.status(201).json({ ...guestOrder, warning: 'Order placed as guest due to profile sync issue' });
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

    res.status(201).json({ success: true, orderId: orderData.id });
  } catch (error: any) {
    console.error("Checkout Error Full:", error);
    try {
      const fs = require('fs');
      const path = require('path');
      const logMsg = `${new Date().toISOString()} - Error: ${error.message} - Details: ${JSON.stringify(error)}\n`;
      fs.appendFileSync(path.join(process.cwd(), 'checkout_errors.log'), logMsg);
    } catch (e) {}
    
    res.status(500).json({ 
      error: error.message || 'Internal Server Error',
      details: error.details || error.hint || 'No additional details available',
      code: error.code
    });
  }
});

// GET orders for a specific user
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(req.params.userId)) {
      return res.json([]); // Return empty array for invalid user ID
    }
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('user_id', req.params.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET all orders (Admin only)
router.get('/', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH update order status (Admin or User cancellation)
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(req.params.id)) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }
    const { status, cancellation_reason } = req.body;
    const updateData: any = { status };

    if (cancellation_reason) {
      console.log(`Processing cancellation for order ${req.params.id}. Reason: ${cancellation_reason}`);
      const { data: order } = await supabase.from('orders').select('shipping_address').eq('id', req.params.id).single();
      if (order) {
        const baseAddress = order.shipping_address.split('\n\n--- CANCELLATION REASON ---')[0];
        updateData.shipping_address = `${baseAddress}\n\n--- CANCELLATION REASON ---\n${cancellation_reason}`;
      }
    }

    console.log(`Updating order ${req.params.id} with data:`, updateData);

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', req.params.id)
      .select();

    if (error) {
      console.error('Update Error:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(data[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE an order
router.delete('/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(req.params.id)) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
