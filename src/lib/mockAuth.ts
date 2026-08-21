import { useState, useEffect } from 'react';
import { UserProfile } from '../types';

const AUTH_USER_KEY = 'clothing_store_mock_user';

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'usr-demo-1',
  email: 'demo@clothingstore.com',
  full_name: 'Alex Morgan',
  phone: '+91 XXXXX XXXXX',
  organization: 'Studio Atelier',
  created_at: '2026-01-15T08:00:00Z',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
};

const listeners = new Set<(user: UserProfile | null) => void>();

export const getStoredUser = (): UserProfile | null => {
  try {
    if (typeof window === 'undefined') return DEFAULT_DEMO_USER;
    const item = localStorage.getItem(AUTH_USER_KEY);
    if (!item) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(DEFAULT_DEMO_USER));
      return DEFAULT_DEMO_USER;
    }
    return JSON.parse(item);
  } catch (e) {
    return DEFAULT_DEMO_USER;
  }
};

const setStoredUser = (user: UserProfile | null) => {
  try {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }
    listeners.forEach((cb) => cb(user));
  } catch (e) {
    console.warn('Error persisting user:', e);
  }
};

export const mockAuthService = {
  getSession: async () => {
    const user = getStoredUser();
    return {
      data: {
        session: user
          ? {
              user: {
                id: user.id,
                email: user.email,
                user_metadata: { full_name: user.full_name, phone: user.phone },
                created_at: user.created_at
              },
              access_token: 'mock-jwt-token-demo'
            }
          : null
      }
    };
  },

  signInWithPassword: async ({ email }: { email: string; password?: string }) => {
    const name = email.split('@')[0] || 'Customer';
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    const user: UserProfile = {
      id: 'usr-' + Math.random().toString(36).substring(2, 8),
      email,
      full_name: capitalized,
      created_at: new Date().toISOString()
    };
    setStoredUser(user);
    return { data: { user }, error: null };
  },

  signUp: async ({ email, options }: { email: string; password?: string; options?: { data?: { full_name?: string } } }) => {
    const user: UserProfile = {
      id: 'usr-' + Math.random().toString(36).substring(2, 8),
      email,
      full_name: options?.data?.full_name || email.split('@')[0] || 'Customer',
      created_at: new Date().toISOString()
    };
    setStoredUser(user);
    return { data: { user }, error: null };
  },

  signOut: async () => {
    setStoredUser(null);
    return { error: null };
  },

  resetPasswordForEmail: async (_email: string) => {
    return { data: {}, error: null };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    const listener = (user: UserProfile | null) => {
      const session = user
        ? {
            user: {
              id: user.id,
              email: user.email,
              user_metadata: { full_name: user.full_name, phone: user.phone },
              created_at: user.created_at
            },
            access_token: 'mock-jwt-token-demo'
          }
        : null;
      callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', session);
    };

    listeners.add(listener);
    return {
      data: {
        subscription: {
          unsubscribe: () => listeners.delete(listener)
        }
      }
    };
  }
};

export function useAuth() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    mockAuthService.getSession().then(({ data: { session: s } }) => {
      if (isMounted) {
        setSession(s);
        setLoading(false);
      }
    });

    const { data: { subscription } } = mockAuthService.onAuthStateChange((_event, s) => {
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
