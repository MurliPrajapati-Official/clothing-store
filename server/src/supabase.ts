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

    // 1. Get user from token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.log('Admin verification failed: Invalid token', authError?.message);
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    // 2. Check profile role in database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, email')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.log(`Admin verification failed: Profile not found for ${user.id}`, profileError?.message);
      // Fallback for safety: check email list if profile is missing (unlikely but possible)
      const ADMIN_EMAILS = ['murliprajapati228@gmail.com', 'uniformtrends01@gmail.com'];
      if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
         console.log(`Admin verified via email fallback: ${user.email}`);
         (req as any).user = user;
         return next();
      }
      return res.status(403).json({ error: 'User profile not found or access denied' });
    }

    console.log(`Checking role for user ${user.id}: ${profile.role}`);
    
    if (profile.role === 'admin') {
      console.log(`Admin verified via role: ${user.email || user.id}`);
      (req as any).user = user;
      next();
    } else {
      console.warn(`Unauthorized admin access attempt by role: ${profile.role} (User: ${user.email})`);
      res.status(403).json({ error: 'Access denied: Administrator privileges required' });
    }
  } catch (err: any) {
    console.error('Error in verifyAdmin middleware:', err);
    res.status(500).json({ error: 'Internal server error during authorization' });
  }
};
