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
    const colors = formData.get('colors') as string;
    
    // Parse colors list
    const parsedColors = colors ? colors.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
    
    // Support multi-image files
    const files = formData.getAll('images') as File[];
    const singleFile = formData.get('image') as File | null;
    const finalFiles = files.length > 0 ? files : (singleFile && singleFile.size > 0 ? [singleFile] : []);

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

    if (finalFiles.length > 5) {
      return c.json({ error: 'Maximum of 5 default images are allowed' }, 400);
    }

    let imageUrls: string[] = [];

    // Helper function to validate and upload a single file to Supabase Storage
    const uploadProductImage = async (file: File): Promise<string> => {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`Image ${file.name} exceeds 5MB limit`);
      }
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
      let contentType = file.type;
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];

      if (!allowedMimeTypes.includes(contentType)) {
        if (fileExt && validExtensions.includes(fileExt)) {
          contentType = fileExt === 'png' ? 'image/png' : (fileExt === 'webp' ? 'image/webp' : 'image/jpeg');
        } else {
          throw new Error(`Invalid file type for ${file.name}. Only JPEG, PNG, and WebP are allowed.`);
        }
      }

      const fileName = `${Date.now()}_${file.name}`;
      const fileBuffer = await file.arrayBuffer();
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, fileBuffer, {
          contentType: contentType,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      if (!publicUrlData) {
        throw new Error(`Failed to retrieve public URL for ${file.name}`);
      }

      return publicUrlData.publicUrl;
    };

    // 1. Upload default images
    for (const file of finalFiles) {
      if (file && file.size > 0) {
        const url = await uploadProductImage(file);
        imageUrls.push(url);
      }
    }

    // 2. Upload color-specific images
    const colorImagesMap: Record<string, string[]> = {};
    for (const color of parsedColors) {
      const colorFiles = formData.getAll(`color_images_${color}`) as File[];
      if (colorFiles.length > 5) {
        return c.json({ error: `Maximum of 5 images are allowed for color: ${color}` }, 400);
      }
      
      const urlsForColor: string[] = [];
      for (const file of colorFiles) {
        if (file && file.size > 0) {
          const url = await uploadProductImage(file);
          urlsForColor.push(url);
        }
      }
      colorImagesMap[color] = urlsForColor;
    }

    // 3. Insert product into database
    const insertPayload: any = {
      name, 
      slug, 
      price: Number(price), 
      original_price: original_price ? Number(original_price) : null, 
      description,
      category, 
      school_id: school_id || null, 
      sizes: sizes ? sizes.split(',') : [],
      gender, 
      grade, 
      in_stock: in_stock === 'true' || in_stock === '1', 
      is_featured: is_featured === 'true' || is_featured === '1',
      images: imageUrls
    };

    if (parsedColors && parsedColors.length > 0) {
      insertPayload.colors = parsedColors;
      insertPayload.color_images = colorImagesMap;
    }

    const { data: productData, error: dbError } = await supabase
      .from('products')
      .insert([insertPayload])
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
    const colors = formData.get('colors') as string;
    const existing_color_images = formData.get('existing_color_images') as string;

    const parsedColors = colors ? (Array.isArray(colors) ? colors : colors.split(',').map((s: string) => s.trim()).filter(Boolean)) : [];
    let colorImagesMap: Record<string, string[]> = existing_color_images ? JSON.parse(existing_color_images) : {};
    
    const files = formData.getAll('images') as File[];
    const singleFile = formData.get('image') as File | null;
    const finalFiles = files.length > 0 ? files : (singleFile && singleFile.size > 0 ? [singleFile] : []);

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

    if (imageUrls.length + finalFiles.length > 5) {
      return c.json({ error: 'Maximum of 5 default images are allowed in total' }, 400);
    }

    // Helper function to validate and upload a single file to Supabase Storage
    const uploadProductImage = async (file: File): Promise<string> => {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`Image ${file.name} exceeds 5MB limit`);
      }
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
      let contentType = file.type;
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];

      if (!allowedMimeTypes.includes(contentType)) {
        if (fileExt && validExtensions.includes(fileExt)) {
          contentType = fileExt === 'png' ? 'image/png' : (fileExt === 'webp' ? 'image/webp' : 'image/jpeg');
        } else {
          throw new Error(`Invalid file type for ${file.name}. Only JPEG, PNG, and WebP are allowed.`);
        }
      }

      const fileName = `${Date.now()}_${file.name}`;
      const fileBuffer = await file.arrayBuffer();
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, fileBuffer, {
          contentType: contentType,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      if (!publicUrlData) {
        throw new Error(`Failed to retrieve public URL for ${file.name}`);
      }

      return publicUrlData.publicUrl;
    };

    // 1. Upload new default images if present
    for (const file of finalFiles) {
      if (file && file.size > 0) {
        const url = await uploadProductImage(file);
        imageUrls.push(url);
      }
    }

    // 2. Upload new color-specific images
    const finalColorImagesMap: Record<string, string[]> = {};
    for (const color of parsedColors) {
      const existingUrls = colorImagesMap[color] || [];
      const newFilesForColor = formData.getAll(`color_images_${color}`) as File[];
      
      if (existingUrls.length + newFilesForColor.length > 5) {
        return c.json({ error: `Maximum of 5 images are allowed in total for color: ${color}` }, 400);
      }

      const urlsForColor: string[] = [...existingUrls];
      for (const file of newFilesForColor) {
        if (file && file.size > 0) {
          const url = await uploadProductImage(file);
          urlsForColor.push(url);
        }
      }
      finalColorImagesMap[color] = urlsForColor;
    }

    // 3. Update product in database
    const updatePayload: any = {
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
    };

    if (parsedColors && parsedColors.length > 0) {
      updatePayload.colors = parsedColors;
      updatePayload.color_images = finalColorImagesMap;
    }

    const { data: productData, error: dbError } = await supabase
      .from('products')
      .update(updatePayload)
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
