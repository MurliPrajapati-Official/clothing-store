import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

import { rateLimit } from 'express-rate-limit';

const app = express();
const port = process.env.PORT || 5000;

// Security Layer: Rate Limiting
// Prevents Brute Force attacks by limiting requests from the same IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

// Apply rate limiter to all requests
app.use(limiter);

// Configure CORS - Only allow your frontend domain to talk to this API
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Supabase Client Initialization
// NOTE: These should be added to a .env file later
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Routes
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import reviewRoutes from './routes/reviews';

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
app.use('/api/reviews', reviewRoutes);

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
