import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Client Initialization
// NOTE: These should be added to a .env file later
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Routes
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Uniform Trends Backend is running!' });
});

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
