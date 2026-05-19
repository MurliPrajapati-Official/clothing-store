import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

import { rateLimit } from 'express-rate-limit';

const app = express();
const port = process.env.PORT || 5000;

// Trust Cloudflare and Render reverse proxies to enable correct client IP detection for rate-limiting
app.set('trust proxy', 1);

// Security Layer: Rate Limiting
// Prevents Brute Force attacks by limiting requests from the same IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Safe high limit for dynamic client page loads and admin dashboards
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

// Apply rate limiter to all requests
app.use(limiter);

// Configure CORS - Restricted to authorized domains and their subdomains
const allowedOrigins = [
  process.env.FRONTEND_URL, 
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
  
  // Custom check to allow any subdomain of uniformtrends.in under Cloudflare proxying
  try {
    const parsedUrl = new URL(origin);
    const hostname = parsedUrl.hostname;
    return hostname === 'uniformtrends.in' || hostname.endsWith('.uniformtrends.in');
  } catch (e) {
    return false;
  }
};

app.use(cors({
  origin: (origin, callback) => {
    // Allow if no origin (like server-to-server or curl) or if origin is allowed
    if (!origin || isOriginAllowed(origin) || !process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.warn('CORS Policy Denied request for origin:', origin);
      callback(new Error('Unauthorized by Security Policy (CORS)'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-Forwarded-For'],
  credentials: true,
  maxAge: 86400 // Cache preflight for 24 hours
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Uniform Trends API is Running</h1><p>The server is connected and ready for requests.</p>');
});

import { supabase, verifyAdmin } from './supabase';

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
