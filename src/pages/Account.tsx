import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { User, Mail, Lock, ShoppingBag, Settings, LogOut, ChevronRight, Package, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AccountSkeleton from '../components/layout/AccountSkeleton';

export default function Account() {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authError, setAuthError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
      if (session?.user) {
        fetchOrders(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchOrders(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchOrders = async (userId: string) => {
    try {
      setOrdersLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/orders/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      if (authMode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        if (error) throw error;
        setSuccessMsg('Registration successful! Please check your email to confirm your account.');
        setAuthMode('login');
        setEmail('');
        setPassword('');
        setFullName('');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      if (err.message.includes('Email not confirmed')) {
        setAuthError('Please check your email and click the confirmation link before logging in.');
      } else {
        setAuthError('Invalid email or password. Please try again.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (isLoading) {
    return <AccountSkeleton />;
  }

  if (!session) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-canvas flex items-center justify-center">
        <Helmet>
          <title>Sign In & Register | Uniform trends</title>
          <meta name="description" content="Log in to your account or create a new one to track orders and manage profile." />
        </Helmet>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-card p-8 sm:p-12 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-hairline w-full max-w-md"
        >
           <h1 className="text-3xl font-bold text-ink mb-2 text-center">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
           </h1>
           <p className="text-muted text-center mb-8">
              {authMode === 'login' ? 'Sign in to access your orders and profile.' : 'Join us for a premium shopping experience.'}
           </p>

           <form className="space-y-5" onSubmit={handleAuth}>
              {authError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-sm">
                  {authError}
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-600 rounded-xl text-sm">
                  {successMsg}
                </div>
              )}
              {authMode === 'register' && (
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input required value={fullName} onChange={e => setFullName(e.target.value)} type="text" placeholder="John Doe" className="w-full bg-canvas border border-hairline-strong rounded-xl py-3 pl-12 pr-4 text-ink focus:border-ink outline-none" />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                  <input required value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="w-full bg-canvas border border-hairline-strong rounded-xl py-3 pl-12 pr-4 text-ink focus:border-ink outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                  <input required value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••" minLength={6} className="w-full bg-canvas border border-hairline-strong rounded-xl py-3 pl-12 pr-4 text-ink focus:border-ink outline-none" />
                </div>
              </div>

              {authMode === 'login' && (
                <div className="flex justify-end">
                  <button type="button" className="text-sm font-medium text-ink hover:text-m-red transition-colors">Forgot Password?</button>
                </div>
              )}

              <button type="submit" disabled={authLoading} className="btn-primary w-full mt-4 disabled:opacity-70">
                 {authLoading ? 'Processing...' : (authMode === 'login' ? 'Sign In' : 'Register')}
              </button>
           </form>

           <div className="mt-8 text-center">
              <span className="text-muted text-sm">
                {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-sm font-bold text-ink hover:text-m-red transition-colors"
              >
                {authMode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
           </div>
        </motion.div>
      </div>
    );
  }

  // Dashboard for logged in state
  return (
    <div className="pt-32 pb-24 bg-canvas min-h-screen text-body-text">
      <Helmet>
        <title>My Account | Uniform trends</title>
      </Helmet>
      <div className="container mx-auto px-4 max-w-6xl">
         
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
               <div className="bg-surface-card rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-hairline p-6 sticky top-28">
                 <div className="flex items-center gap-4 mb-8 pb-6 border-b border-hairline">
                    <div className="w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center text-xl font-bold shadow-[0_2px_10px_rgba(255,255,255,0.1)] uppercase">
                       {session.user.user_metadata?.full_name?.substring(0, 2) || session.user.email?.substring(0, 2)}
                    </div>
                    <div>
                       <h3 className="font-bold text-ink">{session.user.user_metadata?.full_name || 'My Account'}</h3>
                       <p className="text-sm text-muted">{session.user.email}</p>
                    </div>
                 </div>

                 <nav className="flex flex-col gap-2">
                    <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-canvas text-ink font-semibold transition-colors">
                       <User size={18} />
                       My Profile
                    </button>
                    <button className="flex items-center gap-3 w-full p-3 rounded-xl text-muted hover:bg-canvas hover:text-ink font-medium transition-colors">
                       <Package size={18} />
                       Orders
                    </button>
                    <button className="flex items-center gap-3 w-full p-3 rounded-xl text-muted hover:bg-canvas hover:text-ink font-medium transition-colors">
                       <MapPin size={18} />
                       Addresses
                    </button>
                    <button className="flex items-center gap-3 w-full p-3 rounded-xl text-muted hover:bg-canvas hover:text-ink font-medium transition-colors">
                       <Settings size={18} />
                       Settings
                    </button>
                    <div className="h-px bg-surface-elevated my-2" />
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 rounded-xl text-m-red hover:bg-surface-card hover:bg-m-red/10 font-medium transition-colors">
                       <LogOut size={18} />
                       Logout
                    </button>
                 </nav>
               </div>
            </aside>

            <div className="lg:col-span-3 space-y-8">
               
               <div className="bg-surface-card rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-hairline p-8">
                  <h2 className="text-2xl font-bold text-ink mb-6">Personal Information</h2>
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-semibold text-ink mb-2">First Name</label>
                       <input type="text" defaultValue={session.user.user_metadata?.full_name?.split(' ')[0] || ''} className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 text-ink focus:border-ink outline-none" />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold text-ink mb-2">Last Name</label>
                       <input type="text" defaultValue={session.user.user_metadata?.full_name?.split(' ')[1] || ''} className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 text-ink focus:border-ink outline-none" />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold text-ink mb-2">Email Address</label>
                       <input type="email" disabled defaultValue={session.user.email} className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 text-ink focus:border-ink outline-none opacity-60" />
                     </div>
                     <div>
                       <label className="block text-sm font-semibold text-ink mb-2">Phone Number</label>
                       <input type="tel" defaultValue={session.user.phone || ''} placeholder="Add your phone number" className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 text-ink focus:border-ink outline-none" />
                     </div>
                     <div className="md:col-span-2 pt-4">
                       <button type="button" className="btn-primary">Save Changes</button>
                     </div>
                  </form>
               </div>

               <div className="bg-surface-card rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-hairline p-8">
                  <h2 className="text-2xl font-bold text-ink mb-6">Recent Orders</h2>
                  
                  {ordersLoading ? (
                    <div className="space-y-4">
                       {[...Array(2)].map((_, i) => (
                         <div key={i} className="h-24 bg-canvas animate-pulse rounded-xl" />
                       ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-canvas rounded-xl border border-hairline">
                       <p className="text-muted mb-6">You haven't placed any orders yet.</p>
                       <Link to="/shop" className="btn-primary px-8">Start Shopping</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <div key={order.id} className="border border-hairline rounded-xl overflow-hidden">
                           <div className="bg-canvas p-4 flex justify-between items-center border-b border-hairline">
                              <div>
                                 <p className="text-xs text-muted font-medium mb-1">Order #{order.id.substring(0,8)}</p>
                                 <p className="text-sm font-bold text-ink">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                              </div>
                              <div className="text-right">
                                 <span className="inline-block px-3 py-1 bg-primary/20 text-primary font-semibold text-xs rounded-full uppercase">
                                   {order.status}
                                 </span>
                              </div>
                           </div>
                           
                           {order.order_items && order.order_items.length > 0 && (
                             <div className="p-4 flex items-center justify-between">
                                <div className="flex gap-4 items-center">
                                   <div className="w-16 h-16 bg-canvas rounded-md overflow-hidden shrink-0 border border-hairline flex items-center justify-center">
                                      {order.order_items[0].products?.images?.length > 0 ? (
                                        <img src={order.order_items[0].products.images[0]} alt="Item" className="w-full h-full object-cover" />
                                      ) : (
                                        <span className="text-xl font-bold text-muted/30 uppercase">{order.order_items[0].products?.name?.charAt(0)}</span>
                                      )}
                                   </div>
                                   <div>
                                      <p className="font-semibold text-ink line-clamp-1">{order.order_items[0].products?.name || 'Product'}</p>
                                      <p className="text-sm text-muted mt-1">Qty: {order.order_items[0].quantity} {order.order_items.length > 1 ? `(+${order.order_items.length - 1} more items)` : ''}</p>
                                   </div>
                                </div>
                                <div className="font-bold text-ink">
                                   ₹{order.total_amount}
                                </div>
                             </div>
                           )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 text-center">
                    <button className="text-sm font-bold text-ink hover:text-m-red transition-colors inline-flex items-center gap-1">
                      View All Orders <ChevronRight size={16} />
                    </button>
                  </div>
               </div>

            </div>
         </div>

      </div>
    </div>
  );
}
