import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log("Setting up database tables...");

  // Supabase doesn't support creating tables directly via the JS client easily without SQL execution
  // But we can check if it exists and prompt the user if it doesn't.
  // Most users prefer the SQL Editor in Supabase Dashboard.
  
  const sql = `
    -- Create Reviews Table
    CREATE TABLE IF NOT EXISTS reviews (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      product_id UUID REFERENCES products(id) ON DELETE CASCADE,
      user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
      user_name TEXT NOT NULL,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Ensure products table has rating columns
    -- ALTER TABLE products ADD COLUMN IF NOT EXISTS rating DECIMAL DEFAULT 0;
    -- ALTER TABLE products ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;
  `;

  console.log("Please run the following SQL in your Supabase SQL Editor:");
  console.log(sql);
}

setupDatabase();
