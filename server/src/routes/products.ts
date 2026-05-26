import { Hono } from 'hono';
import { getSupabase, verifyAdmin } from '../supabase'; 
import { z } from 'zod'; 

const router = new Hono();

// GET all products
router.get('/', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return c.json(data);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// GET single product by slug
router.get('/:slug', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const slug = c.req.param('slug');
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return c.json(data);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// POST a new product (Admin Only)
router.post('/', verifyAdmin, async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const formData = await c.req.formData();
    
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const price = formData.get('price') as string;
    const original_price = formData.get('original_price') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const school_id = formData.get('school_id') as string;
    const sizes = formData.get('sizes') as string;
    const gender = formData.get('gender') as string;
    const grade = formData.get('grade') as string;
    const in_stock = formData.get('in_stock');
    const is_featured = formData.get('is_featured');
    
    const file = formData.get('image') as File | null;

    // Server-side validation
    const productSchema = z.object({
      name: z.string().min(3, 'Valid product name is required'),
      price: z.number().positive('A valid numeric price is required'),
      category: z.string().min(1, 'Category is required')
    });
    
    const parseResult = productSchema.safeParse({ name, price: Number(price), category });
    if (!parseResult.success) {
      return c.json({ error: parseResult.error.issues[0].message }, 400);
    }

    if (!file || file.size === 0) return c.json({ error: 'Product image is required' }, 400);

    let imageUrls: string[] = [];

    // 1. Upload image to Supabase Storage if present
    if (file && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) {
        return c.json({ error: 'Image size exceeds 5MB limit' }, 400);
      }
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedMimeTypes.includes(file.type)) {
        return c.json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' }, 400);
      }

      const fileName = `${Date.now()}_${file.name}`;
      const fileBuffer = await file.arrayBuffer();
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, fileBuffer, {
          contentType: file.type,
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
          name, 
          slug, 
          price: Number(price), 
          original_price: original_price ? Number(original_price) : null, 
          description,
          category, 
          school_id: school_id || null, 
          sizes: sizes ? sizes.split(',') : [], // Basic parsing
          gender, 
          grade, 
          in_stock: in_stock === 'true' || in_stock === '1', 
          is_featured: is_featured === 'true' || is_featured === '1',
          images: imageUrls
        }
      ])
      .select();

    if (dbError) throw dbError;

    return c.json(productData[0], 201);
  } catch (error: any) {
    console.error("Error adding product:", error);
    return c.json({ error: error.message }, 500);
  }
});

// UPDATE a product
router.put('/:id', verifyAdmin, async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const id = c.req.param('id');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return c.json({ error: 'Invalid product ID format' }, 400);
    }
    
    const formData = await c.req.formData();
    
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const price = formData.get('price') as string;
    const original_price = formData.get('original_price') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const school_id = formData.get('school_id') as string;
    const sizes = formData.get('sizes') as string;
    const gender = formData.get('gender') as string;
    const grade = formData.get('grade') as string;
    const in_stock = formData.get('in_stock');
    const is_featured = formData.get('is_featured');
    const existing_images = formData.get('existing_images') as string;
    
    const file = formData.get('image') as File | null;

    const productSchema = z.object({
      name: z.string().min(3, 'Valid product name is required'),
      price: z.number().positive('A valid numeric price is required'),
      category: z.string().min(1, 'Category is required')
    });
    
    const parseResult = productSchema.safeParse({ name, price: Number(price), category });
    if (!parseResult.success) {
      return c.json({ error: parseResult.error.issues[0].message }, 400);
    }

    let imageUrls: string[] = existing_images ? JSON.parse(existing_images) : [];

    // 1. Upload new image if present
    if (file && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) {
        return c.json({ error: 'Image size exceeds 5MB limit' }, 400);
      }
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedMimeTypes.includes(file.type)) {
        return c.json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' }, 400);
      }
      const fileName = `${Date.now()}_${file.name}`;
      const fileBuffer = await file.arrayBuffer();
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, fileBuffer, {
          contentType: file.type,
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
        name, 
        slug, 
        price: Number(price), 
        original_price: original_price ? Number(original_price) : null, 
        description,
        category, 
        school_id: school_id || null, 
        sizes: sizes ? (Array.isArray(sizes) ? sizes : sizes.split(',')) : [],
        gender, 
        grade, 
        in_stock: in_stock === 'true' || in_stock === '1',
        is_featured: is_featured === 'true' || is_featured === '1',
        images: imageUrls
      })
      .eq('id', id)
      .select();

    if (dbError) throw dbError;

    return c.json(productData[0]);
  } catch (error: any) {
    console.error("Error updating product:", error);
    return c.json({ error: error.message }, 500);
  }
});

// GET related products
router.get('/related/:id', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const id = c.req.param('id');
    
    // Validate UUID format before querying
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return c.json([]); // Return empty array for invalid IDs instead of crashing
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
      return c.json(fallbackProducts);
    }

    return c.json(relatedProducts);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// DELETE a product
router.delete('/:id', verifyAdmin, async (c) => {
  try {
    const supabase = getSupabase(c.env);
    const id = c.req.param('id');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return c.json({ error: 'Invalid product ID format' }, 400);
    }
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return c.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default router;
