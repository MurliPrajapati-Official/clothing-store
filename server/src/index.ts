import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { getSupabase, verifyAdmin, rateLimiter } from './supabase';

// Routes
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import reviewRoutes from './routes/reviews';

const app = new Hono<{ Bindings: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; FRONTEND_URL: string } }>();

// Security Headers
app.use('*', secureHeaders());

// CORS Dynamic Handler
app.use('*', async (c, next) => {
  const allowedOrigins = [
    c.env.FRONTEND_URL, 
    'http://localhost:3000', 
    'https://uniformtrends.in',
    'https://www.uniformtrends.in'
  ].filter(Boolean) as string[];

  const isOriginAllowed = (origin: string): boolean => {
    if (allowedOrigins.includes(origin)) return true;
    try {
      const parsedUrl = new URL(origin);
      const hostname = parsedUrl.hostname;
      return hostname === 'uniformtrends.in' || hostname.endsWith('.uniformtrends.in');
    } catch (e) {
      return false;
    }
  };

  const path = c.req.path;
  const method = c.req.method;
  const isPublicGet = (method === 'GET' || method === 'OPTIONS') && (
    path === '/' ||
    path === '/api/health' ||
    path.startsWith('/api/products') ||
    path.startsWith('/api/reviews')
  );

  const corsMiddleware = cors({
    origin: (origin) => {
      if (!origin) return 'https://uniformtrends.in';
      if (isPublicGet || isOriginAllowed(origin)) {
        return origin;
      }
      // Strictly block access from foreign, non-whitelisted domains
      return 'https://uniformtrends.in';
    },
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-Forwarded-For'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    maxAge: 86400,
  });

  return corsMiddleware(c, next);
});

// Apply global edge rate limiting on all dynamic API endpoints (60 requests per minute per IP)
app.use('/api/*', rateLimiter(60, 60000));

// Root route
app.get('/', (c) => {
  return c.html('<h1>Uniform Trends API is Running</h1><p>The server is connected and ready for requests.</p>');
});

// Dynamic sitemap.xml endpoint (Real-time SEO)
app.get('/sitemap.xml', async (c) => {
  try {
    const supabase = getSupabase(c.env);
    
    // Fetch products
    const { data: products, error } = await supabase
      .from('products')
      .select('slug, category, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const baseUrl = 'https://uniformtrends.in';
    const currentDate = new Date().toISOString().split('T')[0];

    // Core Static Pages
    const staticPages = [
      { loc: '', changefreq: 'weekly', priority: '1.0' },
      { loc: 'shop', changefreq: 'weekly', priority: '0.9' },
      { loc: 'about', changefreq: 'monthly', priority: '0.6' },
      { loc: 'blog', changefreq: 'weekly', priority: '0.7' },
      { loc: 'contact', changefreq: 'monthly', priority: '0.6' },
      { loc: 'collections', changefreq: 'monthly', priority: '0.5' },
      { loc: 'size-guide', changefreq: 'monthly', priority: '0.5' },
      { loc: 'return-policy', changefreq: 'monthly', priority: '0.4' },
      { loc: 'terms', changefreq: 'monthly', priority: '0.4' },
      { loc: 'privacy', changefreq: 'monthly', priority: '0.4' },
      { loc: 'cookies', changefreq: 'monthly', priority: '0.4' }
    ];

    // Extract unique categories dynamically from products
    const categoriesSet = new Set(['School', 'Corporate', 'Hospital']);
    products.forEach((prod: any) => {
      if (prod.category) {
        categoriesSet.add(prod.category);
      }
    });

    const categoryPages = Array.from(categoriesSet).map(cat => ({
      loc: `shop?category=${encodeURIComponent(cat)}`,
      changefreq: 'weekly',
      priority: '0.8'
    }));

    const productPages = products.map((prod: any) => ({
      loc: `product/${prod.slug}`,
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: prod.created_at ? prod.created_at.split('T')[0] : currentDate
    }));

    const allPages = [...staticPages, ...categoryPages, ...productPages];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    allPages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/${page.loc}</loc>\n`;
      xml += `    <lastmod>${page.lastmod || currentDate}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>\n';

    c.header('Content-Type', 'application/xml');
    c.header('Cache-Control', 'public, max-age=3600'); // Cache on Edge for 1 hour to prevent DB spam
    return c.text(xml);
  } catch (error: any) {
    console.error("Sitemap generation error:", error);
    c.header('Content-Type', 'application/xml');
    return c.text('<?xml version="1.0" encoding="UTF-8"?><error>Failed to generate sitemap</error>', 500);
  }
});

// Basic health check route
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', message: 'Uniform Trends Backend is running!' });
});

// Admin check route for frontend UI
app.get('/api/admin/check', verifyAdmin, (c) => {
  return c.json({ isAdmin: true });
});

// Admin Stats route
app.get('/api/stats', verifyAdmin, async (c) => {
  try {
    const supabase = getSupabase(c.env);
    
    const { count: productCount, error: pError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    const { data: { users }, error: uError } = await supabase.auth.admin.listUsers();

    const { count: orderCount, error: oError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (pError || uError || oError) throw pError || uError || oError;

    return c.json({
      totalProducts: productCount || 0,
      totalUsers: users.length || 0,
      totalOrders: orderCount || 0
    });
  } catch (error: any) {
    console.error("Stats fetch error:", error);
    return c.json({ error: 'Failed to retrieve stats' }, 500);
  }
});

// Mount Routes
app.route('/api/products', productRoutes);
app.route('/api/orders', orderRoutes);
app.route('/api/reviews', reviewRoutes);

// Hono global error boundary (replaces uncaughtException / unhandledRejection)
app.onError((err, c) => {
  console.error('Unhandled Server Error:', err);
  return c.json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred. Please try again later.',
  }, 500);
});

export default app;
