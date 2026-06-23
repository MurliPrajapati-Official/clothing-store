import { createClient, Session } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

// Safe localStorage detection to prevent crash on Safari/macOS strict cookie settings
const getSafeStorage = () => {
  try {
    if (typeof window === 'undefined') return undefined;
    const testKey = '__supabase_test_storage__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (e) {
    console.warn('localStorage is not available, falling back to in-memory storage. Error:', e);
    return undefined;
  }
};

// Robust in-memory storage fallback implementing SupportedStorage interface
class MemoryStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

let supabaseClient;
try {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storage: getSafeStorage() || new MemoryStorage(),
      detectSessionInUrl: true,
      autoRefreshToken: true,
    }
  });
} catch (e) {
  console.error('Failed to initialize Supabase client with custom options, falling back to basic client:', e);
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseClient;

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Get current session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (isMounted) {
        setSession(s);
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      if (isMounted) {
        setSession(s);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, isLoggedIn: !!session, loading };
}


