import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1 && process.env.NODE_ENV === 'production') {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
app.use(express.json());

// Supabase Client Initialization
// NOTE: These should be added to a .env file later
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Routes
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';

import { Request, Response } from 'express';

// Basic health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Uniform Trends Backend is running!' });
});

// Admin Stats route
app.get('/api/stats', async (req: Request, res: Response) => {
  try {
    const { count: productCount, error: pError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    // Note: auth.admin requires Service Role Key which we have on backend
    const { data: { users }, error: uError } = await supabase.auth.admin.listUsers();

    if (pError || uError) throw pError || uError;

    res.json({
      totalProducts: productCount || 0,
      totalUsers: users.length || 0
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
