import { Hono } from 'hono';
import { getSupabase, verifyUser } from '../supabase';

const router = new Hono<{ Variables: { user: any } }>();

// GET reviews for a specific product with pagination
router.get('/:productId', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const productId = c.req.param('productId');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(productId)) {
      return c.json({ reviews: [], total: 0, hasMore: false });
    }
    const limit = parseInt(c.req.query('limit') as string) || 5;
    const page = parseInt(c.req.query('page') as string) || 1;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return c.json({
      reviews: data,
      total: count || 0,
      hasMore: (count || 0) > offset + (data?.length || 0)
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// POST a new review
router.post('/', verifyUser, async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const { product_id, rating, comment } = await c.req.json();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!product_id || !uuidRegex.test(product_id)) {
      return c.json({ error: 'Valid product ID is required' }, 400);
    }

    if (!rating) {
      return c.json({ error: 'Rating is required' }, 400);
    }

    // Securely pull session information from validated user token
    const authenticatedUser = c.get('user');
    const user_id = authenticatedUser.id;

    // Securely retrieve name from user profile to prevent spoofing
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user_id)
      .single();

    const user_name = profile?.full_name || authenticatedUser.user_metadata?.full_name || authenticatedUser.email || 'Verified Customer';

    // 1. Insert the review
    const { data: reviewData, error: reviewError } = await supabase
      .from('reviews')
      .insert([
        { product_id, user_id, user_name, rating: Number(rating), comment }
      ])
      .select()
      .single();

    if (reviewError) throw reviewError;

    // 2. Calculate and update product stats (average rating and count)
    // First, get all reviews for this product
    const { data: allReviews, error: fetchError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', product_id);

    if (fetchError) throw fetchError;

    const reviewCount = allReviews.length;
    const avgRating = allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewCount;

    // Update the product table
    const { error: updateError } = await supabase
      .from('products')
      .update({
        rating: Number(avgRating.toFixed(1)),
        reviews_count: reviewCount
      })
      .eq('id', product_id);

    if (updateError) throw updateError;

    return c.json(reviewData, 201);
  } catch (error: any) {
    console.error("Error submitting review:", error);
    return c.json({ error: error.message }, 500);
  }
});

// DELETE a review
router.delete('/:id', verifyUser, async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const id = c.req.param('id');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return c.json({ error: 'Invalid review ID format' }, 400);
    }

    // 1. Get the review details to check authorization
    const { data: review, error: getError } = await supabase
      .from('reviews')
      .select('product_id, user_id')
      .eq('id', id)
      .single();

    if (getError) throw getError;
    const productId = review.product_id;

    // Ownership or Admin check: verify that they own the review or are an administrator
    const authenticatedUser = c.get('user');
    if (review.user_id !== authenticatedUser.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authenticatedUser.id)
        .single();
      
      if (!profile || profile.role !== 'admin') {
        return c.json({ error: 'Access denied: You can only delete your own reviews' }, 403);
      }
    }

    // 2. Delete the review
    const { error: deleteError } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    // 3. Recalculate stats for the product
    const { data: allReviews, error: fetchError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId);

    if (fetchError) throw fetchError;

    const reviewCount = allReviews.length;
    const avgRating = reviewCount > 0 
      ? Number((allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewCount).toFixed(1))
      : 0;

    // Update the product table
    const { error: updateError } = await supabase
      .from('products')
      .update({
        rating: avgRating,
        reviews_count: reviewCount
      })
      .eq('id', productId);

    if (updateError) throw updateError;

    return c.json({ success: true, message: 'Review deleted and product stats updated' });
  } catch (error: any) {
    console.error("Error deleting review:", error);
    return c.json({ error: error.message }, 500);
  }
});

export default router;
