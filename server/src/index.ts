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

// Configure CORS - Restricted to authorized domains only
const allowedOrigins = [
  process.env.FRONTEND_URL, 
  'http://localhost:3000', 
  'http://localhost:5173',
  'http://localhost:5174',
  'https://uniformtrends.in',
  'https://www.uniformtrends.in',
  'http://uniformtrends.in',
  'http://www.uniformtrends.in'
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Unauthorized by Security Policy (CORS)'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Uniform Trends API is Running</h1><p>The server is connected and ready for requests.</p>');
});

// Supabase Client Initialization
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin Verification Middleware
const ADMIN_EMAILS = ['murliprajapati228@gmail.com', 'uniformtrends01@gmail.com'];

export const verifyAdmin = async (req: Request, res: Response, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      // Add user to request for use in routes if needed
      (req as any).user = user;
      next();
    } else {
      console.warn(`Unauthorized admin access attempt by: ${user.email}`);
      res.status(403).json({ error: 'Access denied: Administrator privileges required' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error during authorization' });
  }
};

// Routes
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import reviewRoutes from './routes/reviews';

import { Request, Response } from 'express';

// Basic health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Uniform Trends Backend is running!' });
});

// Admin check route for frontend UI
app.get('/api/admin/check', verifyAdmin, (req: Request, res: Response) => {
  res.json({ isAdmin: true });
});

// Admin Stats route
app.get('/api/stats', verifyAdmin, async (req: Request, res: Response) => {
  try {
    const { count: productCount, error: pError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    const { data: { users }, error: uError } = await supabase.auth.admin.listUsers();

    const { count: orderCount, error: oError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (pError || uError || oError) throw pError || uError || oError;

    res.json({
      totalProducts: productCount || 0,
      totalUsers: users.length || 0,
      totalOrders: orderCount || 0
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

// Global Error Handlers for production stability
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Log to file for debugging
  try {
    const fs = require('fs');
    fs.appendFileSync('crash_logs.txt', `${new Date().toISOString()} - UNHANDLED REJECTION: ${reason}\n`);
  } catch (e) {}
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  try {
    const fs = require('fs');
    fs.appendFileSync('crash_logs.txt', `${new Date().toISOString()} - UNCAUGHT EXCEPTION: ${error.message}\n${error.stack}\n`);
  } catch (e) {}
  // Give time for logging before exiting
  setTimeout(() => process.exit(1), 1000);
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
