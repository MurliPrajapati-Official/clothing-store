import express, { Request, Response } from 'express';
import { supabase } from '../index';

const router = express.Router();

// GET reviews for a specific product with pagination
router.get('/:productId', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const limit = parseInt(req.query.limit as string) || 5;
    const page = parseInt(req.query.page as string) || 1;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('reviews')
      .select('*', { count: 'exact' })
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    res.json({
      reviews: data,
      total: count || 0,
      hasMore: (count || 0) > offset + (data?.length || 0)
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new review
router.post('/', async (req: Request, res: Response) => {
  try {
    const { product_id, user_id, user_name, rating, comment } = req.body;

    if (!product_id || !user_name || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

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
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;

    // Update the product table
    const { error: updateError } = await supabase
      .from('products')
      .update({
        rating: avgRating.toFixed(1),
        reviews_count: reviewCount
      })
      .eq('id', product_id);

    if (updateError) throw updateError;

    res.status(201).json(reviewData);
  } catch (error: any) {
    console.error("Error submitting review:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE a review
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Get the product_id before deleting
    const { data: review, error: getError } = await supabase
      .from('reviews')
      .select('product_id')
      .eq('id', id)
      .single();

    if (getError) throw getError;
    const productId = review.product_id;

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
      ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
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

    res.json({ success: true, message: 'Review deleted and product stats updated' });
  } catch (error: any) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
