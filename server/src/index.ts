import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { getSupabase, verifyAdmin } from './supabase';

// Routes
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import reviewRoutes from './routes/reviews';

const app = new Hono<{ Bindings: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string; FRONTEND_URL: string } }>();

// CORS Dynamic Handler
app.use('*', async (c, next) => {
  const allowedOrigins = [
    c.env.FRONTEND_URL, 
    'http://localhost:3000', 
    'http://localhost:5173',
    'http://localhost:5174',
    'https://uniformtrends.in',
    'https://www.uniformtrends.in',
    'https://uniformtrends.onrender.com',
    'https://uniform-trends-backend.onrender.com'
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

  const corsMiddleware = cors({
    origin: (origin) => {
      if (!origin || isOriginAllowed(origin)) {
        return origin;
      }
      // If development, allow all
      return origin;
    },
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-Forwarded-For'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    maxAge: 86400,
  });

  return corsMiddleware(c, next);
});

// Root route
app.get('/', (c) => {
  return c.html('<h1>Uniform Trends API is Running</h1><p>The server is connected and ready for requests.</p>');
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
    return c.json({ error: error.message }, 500);
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
    message: err.message,
  }, 500);
});

export default app;
