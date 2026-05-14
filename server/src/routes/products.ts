import express, { Request, Response } from 'express';
import multer from 'multer';
import { supabase, verifyAdmin } from '../index'; 

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory for direct upload to Supabase

// GET all products
router.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET single product by slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', req.params.slug)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new product (Admin Only)
router.post('/', verifyAdmin, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const {
      name, slug, price, original_price, description,
      category, school_id, sizes, gender, grade,
      in_stock, is_featured
    } = req.body;

    // Server-side validation
    if (!name || name.length < 3) return res.status(400).json({ error: 'Valid product name is required' });
    if (!price || isNaN(Number(price))) return res.status(400).json({ error: 'A valid numeric price is required' });
    if (!category) return res.status(400).json({ error: 'Category is required' });
    if (!req.file) return res.status(400).json({ error: 'Product image is required' });

    const file = req.file;
    let imageUrls: string[] = [];

    // 1. Upload image to Supabase Storage if present
    if (file) {
      const fileName = `${Date.now()}_${file.originalname}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      if (publicUrlData) {
         imageUrls.push(publicUrlData.publicUrl);
      }
    }

    // 2. Insert product into database
    const { data: productData, error: dbError } = await supabase
      .from('products')
      .insert([
        {
          name, slug, price, original_price, description,
          category, school_id, 
          sizes: sizes ? sizes.split(',') : [], // Basic parsing
          gender, grade, in_stock, is_featured,
          images: imageUrls
        }
      ])
      .select();

    if (dbError) throw dbError;

    res.status(201).json(productData[0]);
  } catch (error: any) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a product
router.put('/:id', verifyAdmin, upload.single('image'), async (req: Request, res: Response) => {
  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }
    const {
      name, slug, price, original_price, description,
      category, school_id, sizes, gender, grade,
      in_stock, is_featured, existing_images
    } = req.body;

    let imageUrls: string[] = existing_images ? JSON.parse(existing_images) : [];

    // 1. Upload new image if present
    if (req.file) {
      const file = req.file;
      const fileName = `${Date.now()}_${file.originalname}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      if (publicUrlData) {
         imageUrls = [publicUrlData.publicUrl]; // For now, replace images if a new one is uploaded
      }
    }

    // 2. Update product in database
    const { data: productData, error: dbError } = await supabase
      .from('products')
      .update({
        name, slug, price, original_price, description,
        category, school_id, 
        sizes: sizes ? (Array.isArray(sizes) ? sizes : sizes.split(',')) : [],
        gender, grade, 
        in_stock: in_stock === 'true' || in_stock === true,
        is_featured: is_featured === 'true' || is_featured === true,
        images: imageUrls
      })
      .eq('id', req.params.id)
      .select();

    if (dbError) throw dbError;

    res.json(productData[0]);
  } catch (error: any) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET related products
router.get('/related/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validate UUID format before querying
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.json([]); // Return empty array for invalid IDs instead of crashing
    }

    // 1. Get the current product's category
    const { data: currentProduct, error: fetchError } = await supabase
      .from('products')
      .select('category')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // 2. Find related products in the same category, excluding current product
    const { data: relatedProducts, error: relatedError } = await supabase
      .from('products')
      .select('*')
      .eq('category', currentProduct.category)
      .neq('id', id)
      .order('rating', { ascending: false })
      .limit(4);

    if (relatedError) throw relatedError;

    // 3. Fallback: If no related products in same category, get top rated products from any category
    if (relatedProducts.length === 0) {
      const { data: fallbackProducts, error: fallbackError } = await supabase
        .from('products')
        .select('*')
        .neq('id', id)
        .order('rating', { ascending: false })
        .limit(4);
      
      if (fallbackError) throw fallbackError;
      return res.json(fallbackProducts);
    }

    res.json(relatedProducts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a product
router.delete('/:id', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
