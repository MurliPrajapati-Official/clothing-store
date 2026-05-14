import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('CRITICAL: Supabase environment variables are missing!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_EMAILS = ['murliprajapati228@gmail.com', 'uniformtrends01@gmail.com'];

export const verifyAdmin = async (req: Request, res: Response, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('Admin verification failed: No auth header');
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log('Admin verification failed: No token in header');
        return res.status(401).json({ error: 'Malformed authentication header' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.log('Admin verification failed: Invalid token or user not found', error?.message);
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    console.log(`Checking admin status for email: ${user.email}`);
    
    if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      console.log(`Admin verified: ${user.email}`);
      (req as any).user = user;
      next();
    } else {
      console.warn(`Unauthorized admin access attempt by: ${user.email}`);
      res.status(403).json({ error: 'Access denied: Administrator privileges required' });
    }
  } catch (err: any) {
    console.error('Error in verifyAdmin middleware:', err);
    res.status(500).json({ error: 'Internal server error during authorization' });
  }
};
