import express, { Request, Response } from 'express';
import multer from 'multer';
import { supabase } from '../index'; // Will need to ensure this works later

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

// POST a new product (Admin Only - Requires Auth later)
router.post('/', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const {
      name, slug, price, original_price, description,
      category, school_id, sizes, gender, grade,
      in_stock, is_featured
    } = req.body;

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

// DELETE a product
router.delete('/:id', async (req: Request, res: Response) => {
  try {
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
