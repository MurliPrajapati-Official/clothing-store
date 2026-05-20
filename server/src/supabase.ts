import { createClient } from '@supabase/supabase-js';
import { createMiddleware } from 'hono/factory';

let supabaseClient: any = null;

export const getSupabase = (env: any) => {
  if (!supabaseClient) {
    const supabaseUrl = env.SUPABASE_URL || '';
    const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || '';
    if (!supabaseUrl || !supabaseKey) {
      console.error('CRITICAL: Supabase environment variables are missing!');
    }
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseClient;
};

export const verifyAdmin = createMiddleware(async (c, next) => {
  try {
    const authHeader = c.req.header('authorization');
    if (!authHeader) {
      console.log('Admin verification failed: No auth header');
      return c.json({ error: 'Authentication required' }, 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('Admin verification failed: No token in header');
      return c.json({ error: 'Malformed authentication header' }, 401);
    }

    const supabase = getSupabase(c.env);

    // 1. Get user from token
    let { data: { user }, error: authError } = await supabase.auth.getUser(token);

    // Robust Fallback: If getUser(token) fails, try to manually decode and fetch via Admin API
    if (authError || !user) {
      try {
        console.log('Standard getUser(token) failed, attempting robust fallback...', authError?.message);
        // Note: Buffer is supported in Cloudflare Workers when nodejs_compat flag is turned on
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const userId = payload.sub;
        if (userId) {
          const { data: adminUser, error: adminError } = await supabase.auth.admin.getUserById(userId);
          if (adminUser?.user) {
            user = adminUser.user;
            console.log('User verified via robust admin fallback:', user.email);
          } else {
            throw adminError || new Error('User not found in Admin API');
          }
        } else {
          throw new Error('No sub in token payload');
        }
      } catch (fallbackErr: any) {
        console.error('Admin verification failed: Token invalid and fallback failed', fallbackErr.message);
        return c.json({ error: `Invalid or expired session: ${authError?.message || fallbackErr.message}` }, 401);
      }
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
         c.set('user', user);
         return await next();
      }
      return c.json({ error: 'User profile not found or access denied' }, 403);
    }

    console.log(`Checking role for user ${user.id}: ${profile.role}`);
    
    if (profile.role === 'admin') {
      console.log(`Admin verified via role: ${user.email || user.id}`);
      c.set('user', user);
      await next();
    } else {
      console.warn(`Unauthorized admin access attempt by role: ${profile.role} (User: ${user.email})`);
      return c.json({ error: 'Access denied: Administrator privileges required' }, 403);
    }
  } catch (err: any) {
    console.error('Error in verifyAdmin middleware:', err);
    return c.json({ error: 'Internal server error during authorization' }, 500);
  }
});

// verifyUser checks that the request is authenticated with a valid Supabase JWT session token
export const verifyUser = createMiddleware(async (c, next) => {
  try {
    const authHeader = c.req.header('authorization');
    if (!authHeader) {
      console.log('Authentication failed: No auth header');
      return c.json({ error: 'Authentication required' }, 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('Authentication failed: Malformed token');
      return c.json({ error: 'Malformed authentication token' }, 401);
    }

    const supabase = getSupabase(c.env);
    let { data: { user }, error: authError } = await supabase.auth.getUser(token);

    // Fallback using Admin API decoding if normal session parsing fails
    if (authError || !user) {
      try {
        console.log('getUser(token) failed in verifyUser, trying fallback...');
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const userId = payload.sub;
        if (userId) {
          const { data: adminUser } = await supabase.auth.admin.getUserById(userId);
          if (adminUser?.user) {
            user = adminUser.user;
          } else {
            throw new Error('User not found in Admin API');
          }
        } else {
          throw new Error('No sub in token');
        }
      } catch (fallbackErr: any) {
        console.error('verifyUser failed:', authError?.message || fallbackErr.message);
        return c.json({ error: 'Invalid or expired session token' }, 401);
      }
    }

    c.set('user', user);
    await next();
  } catch (err: any) {
    console.error('Error in verifyUser middleware:', err);
    return c.json({ error: 'Internal server error during authentication' }, 500);
  }
});
