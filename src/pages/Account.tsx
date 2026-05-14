import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Lock, Settings, LogOut, Package, ChevronRight, Phone, MapPin, Loader2, ShieldCheck } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AccountSkeleton from '../components/layout/AccountSkeleton';
import { cn, formatCurrency } from '../lib/utils';

export default function Account() {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'address' | 'settings'>('profile');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authError, setAuthError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Local Address Cache State
  const [addressData, setAddressData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    pin: ''
  });

  useEffect(() => {
    // Load local address cache
    const savedAddress = localStorage.getItem('uniformTrends_savedAddress');
    if (savedAddress) {
      try {
        setAddressData(JSON.parse(savedAddress));
      } catch (e) { }
    }
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setIsLoading(false);
      if (s?.user) {
        fetchOrders(s.user.id, s.user.email || '');
        checkAdminStatus(s);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        fetchOrders(s.user.id, s.user.email || '');
        checkAdminStatus(s);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const getApiUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5000'
      : `https://${window.location.hostname.replace('www.', '')}/api`; 
  };

  const fetchOrders = async (userId: string, userEmail: string) => {
    try {
      setOrdersLoading(true);
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/orders/user/${userId}`);
      let data = [];
      if (response.ok) {
        data = await response.json();
      }

      // Email fallback
      if (data.length === 0 && userEmail) {
        const res = await fetch(`${apiUrl}/api/orders`);
        if (res.ok) {
          const all = await res.json();
          data = all.filter((o: any) =>
            o.shipping_address?.toLowerCase().includes(userEmail.toLowerCase())
          );
        }
      }
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const checkAdminStatus = async (s: any) => {
    if (!s) return;
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/admin/check`, {
        headers: {
          'Authorization': `Bearer ${s.access_token}`
        }
      });
      if (res.ok) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error('Failed to check admin status', err);
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
          options: { data: { full_name: fullName } }
        });
        if (error) throw error;
        setSuccessMsg('Registration successful! Please check your email.');
        setAuthMode('login');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (redirectTo) {
          navigate(`/${redirectTo}`);
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleCancelOrder = async (orderId: string) => {
    const reason = window.prompt('Please enter a reason for cancellation:');
    if (!reason) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled', cancellation_reason: reason })
      });
      if (res.ok) {
        setSuccessMsg('Order cancelled successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
        if (session?.user) fetchOrders(session.user.id, session.user.email || '');
      } else {
        const errData = await res.json();
        alert(`Failed to cancel: ${errData.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error("Failed to cancel order", err);
      alert(`Error cancelling order: ${err.message}`);
    }
  };

  if (isLoading) return <AccountSkeleton />;

  if (!session) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-canvas flex items-center justify-center">
        <Helmet>
          <title>Sign In & Register | Uniform trends</title>
        </Helmet>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-card p-8 sm:p-12 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-hairline w-full max-w-md"
        >
          <h1 className="text-3xl font-bold text-ink mb-2 text-center">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <form className="space-y-5 mt-8" onSubmit={handleAuth}>
            {redirectTo === 'checkout' && (
              <div className="p-4 mb-6 bg-primary/10 border border-primary/20 text-ink rounded-xl text-sm font-bold flex items-center gap-3">
                <ShieldCheck className="text-primary shrink-0" size={18} />
                <span>Please login or signup to complete your purchase.</span>
              </div>
            )}
            {authError && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs">{authError}</div>}
            {successMsg && <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-600 rounded-xl text-xs">{successMsg}</div>}

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

            <button type="submit" disabled={authLoading} className="btn-primary w-full mt-4 disabled:opacity-70">
              {authLoading ? 'Processing...' : (authMode === 'login' ? 'Sign In' : 'Register')}
            </button>
          </form>
          <div className="mt-8 text-center">
            <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-sm font-bold text-ink hover:text-m-red transition-colors">
              {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-canvas min-h-screen text-body-text">
      <Helmet>
        <title>My Account | Uniform trends</title>
      </Helmet>
      <div className="container mx-auto px-4 max-w-6xl">
        {successMsg && (
          <div className="mb-6 p-4 bg-success/10 border border-success/20 text-success rounded-xl text-sm font-bold text-center">
            {successMsg}
          </div>
        )}
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-surface-card rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-hairline p-4 md:p-6 sticky top-28">
              <div className="flex items-center gap-4 mb-4 md:mb-8 md:pb-6 md:border-b border-hairline">
                <div className="w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center text-xl font-bold uppercase">
                  {session.user.user_metadata?.full_name?.substring(0, 2) || session.user.email?.substring(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-ink">{session.user.user_metadata?.full_name || 'My Account'}</h3>
                  <p className="text-sm text-muted break-all">{session.user.email}</p>
                </div>
              </div>

              {isAdmin && (
                <Link 
                  to="/admin-8822"
                  className="flex items-center gap-3 w-full p-3 mb-6 bg-primary/10 text-primary rounded-xl font-bold hover:bg-primary hover:text-white transition-all shadow-sm border border-primary/20"
                >
                  <ShieldCheck size={18} /> Admin Dashboard
                </Link>
              )}


              <nav className="flex lg:flex-col gap-1 md:gap-2 overflow-x-auto lg:overflow-visible scrollbar-hide -mx-2 px-2 pb-2 lg:p-0 justify-between lg:justify-start">
                {[
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'orders', label: 'Orders', icon: Package },
                  { id: 'address', label: 'Address', icon: MapPin },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex flex-col sm:flex-row items-center gap-1 sm:gap-3 p-2 sm:p-3 rounded-xl transition-all min-w-0 flex-1 lg:flex-none lg:w-full",
                      activeTab === tab.id ? "bg-canvas text-ink font-bold shadow-sm" : "text-muted hover:bg-canvas hover:text-ink font-medium"
                    )}
                  >
                    <tab.icon size={20} className="sm:w-[18px]" />
                    <span className="text-[10px] sm:text-sm whitespace-nowrap">{tab.label}</span>
                  </button>
                ))}
                <div className="hidden lg:block h-px bg-hairline my-2" />
                <button onClick={handleLogout} className="flex lg:hidden flex-col sm:flex-row items-center gap-1 sm:gap-3 p-2 sm:p-3 rounded-xl text-m-red hover:bg-m-red/10 font-medium transition-colors min-w-0 flex-1">
                   <Lock size={20} className="sm:w-[18px]" />
                   <span className="text-[10px] sm:text-sm whitespace-nowrap">Logout</span>
                </button>
              </nav>
              <button onClick={handleLogout} className="hidden lg:flex items-center gap-3 w-full p-3 rounded-xl text-m-red hover:bg-m-red/10 font-medium transition-colors">
                <Lock size={18} /> Logout
              </button>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="bg-surface-card rounded-2xl border border-hairline p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-ink mb-6 flex items-center gap-2"><User className="text-primary" /> Profile Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-canvas rounded-xl border border-hairline">
                      <p className="text-xs text-muted uppercase font-bold tracking-widest mb-1">Full Name</p>
                      <p className="font-bold text-ink">{session.user.user_metadata?.full_name || 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-canvas rounded-xl border border-hairline">
                      <p className="text-xs text-muted uppercase font-bold tracking-widest mb-1">Email</p>
                      <p className="font-bold text-ink">{session.user.email}</p>
                    </div>
                    <div className="p-4 bg-canvas rounded-xl border border-hairline">
                      <p className="text-xs text-muted uppercase font-bold tracking-widest mb-1">Account Created</p>
                      <p className="font-bold text-ink">{new Date(session.user.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'address' && (
                <motion.div key="address" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="bg-surface-card rounded-2xl border border-hairline p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-ink mb-2 flex items-center gap-2"><MapPin className="text-primary" /> Saved Address</h2>
                  <p className="text-muted text-sm mb-6">Manage your primary shipping address for a faster checkout experience.</p>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    localStorage.setItem('uniformTrends_savedAddress', JSON.stringify(addressData));
                    setSuccessMsg('Address updated successfully!');
                    setTimeout(() => setSuccessMsg(''), 3000);
                  }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-1">First Name</label>
                        <input type="text" required value={addressData.firstName} onChange={(e) => setAddressData({ ...addressData, firstName: e.target.value })} className="w-full bg-canvas border border-hairline rounded-xl px-4 py-3 text-ink outline-none focus:border-primary transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-1">Last Name</label>
                        <input type="text" required value={addressData.lastName} onChange={(e) => setAddressData({ ...addressData, lastName: e.target.value })} className="w-full bg-canvas border border-hairline rounded-xl px-4 py-3 text-ink outline-none focus:border-primary transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-1">Street Address</label>
                      <input type="text" required value={addressData.street} onChange={(e) => setAddressData({ ...addressData, street: e.target.value })} className="w-full bg-canvas border border-hairline rounded-xl px-4 py-3 text-ink outline-none focus:border-primary transition-colors" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-1">City</label>
                        <input type="text" required value={addressData.city} onChange={(e) => setAddressData({ ...addressData, city: e.target.value })} className="w-full bg-canvas border border-hairline rounded-xl px-4 py-3 text-ink outline-none focus:border-primary transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-1">State</label>
                        <input type="text" required value={addressData.state} onChange={(e) => setAddressData({ ...addressData, state: e.target.value })} className="w-full bg-canvas border border-hairline rounded-xl px-4 py-3 text-ink outline-none focus:border-primary transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted uppercase tracking-widest mb-1">PIN Code</label>
                        <input type="text" required value={addressData.pin} onChange={(e) => setAddressData({ ...addressData, pin: e.target.value })} className="w-full bg-canvas border border-hairline rounded-xl px-4 py-3 text-ink outline-none focus:border-primary transition-colors" />
                      </div>
                    </div>
                    <div className="pt-4">
                      <button type="submit" className="btn-primary px-8">Save Address</button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div key="orders" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="bg-surface-card rounded-2xl border border-hairline p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-ink mb-6 flex items-center gap-2"><Package className="text-primary" /> Order History</h2>
                  {ordersLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-canvas animate-pulse rounded-xl" />)}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-canvas rounded-2xl border border-hairline">
                      <Package size={64} className="mx-auto text-muted mb-4 opacity-10" />
                      <p className="text-muted text-lg mb-6">No orders found in your account.</p>
                      <Link to="/shop" className="btn-primary inline-flex px-12">Start Shopping</Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="border border-hairline rounded-2xl overflow-hidden bg-canvas/30 transition-all hover:border-primary/30">
                          <div className="bg-canvas p-4 flex justify-between items-center border-b border-hairline">
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">UK-{order.id.substring(0, 8)}</p>
                              <p className="text-sm font-bold text-ink">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className={cn(
                              "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                              order.status === 'pending' ? "bg-warning/10 text-warning border-warning/20" :
                                order.status === 'completed' ? "bg-success/10 text-success border-success/20" :
                                  "bg-m-red/10 text-m-red border-m-red/20"
                            )}>
                              {order.status}
                            </div>
                          </div>
                          <div className="p-4 flex justify-between items-end">
                            <div className="space-y-1">
                              <p className="text-xs text-muted">Total Amount</p>
                              <p className="text-xl font-black text-ink">{formatCurrency(order.total_amount)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                className="text-[10px] bg-canvas text-ink px-3 py-1.5 rounded-lg border border-hairline font-bold uppercase hover:border-primary transition-all"
                              >
                                {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                              </button>
                              {order.status === 'pending' && (
                                <button onClick={() => handleCancelOrder(order.id)} className="text-[10px] bg-m-red/10 text-m-red px-3 py-1.5 rounded-lg border border-m-red/20 font-bold uppercase hover:bg-m-red hover:text-white transition-all">
                                  Cancel Order
                                </button>
                              )}
                            </div>
                          </div>
                          {expandedOrder === order.id && (
                            <div className="p-4 bg-canvas border-t border-hairline grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Delivery Details</h4>
                                <div className="space-y-4">
                                  <div className="bg-surface-card p-4 rounded-lg border border-hairline shadow-sm">
                                    <p className="text-[10px] uppercase text-muted font-bold tracking-widest mb-1">Contact Name</p>
                                    <p className="text-sm font-bold text-ink">{order.shipping_address.split(',')[0] || 'N/A'}</p>
                                  </div>
                                  <div className="bg-surface-card p-4 rounded-lg border border-hairline shadow-sm">
                                    <p className="text-[10px] uppercase text-muted font-bold tracking-widest mb-1">Shipping Address</p>
                                    <p className="text-sm text-ink leading-relaxed">
                                      {order.shipping_address.replace(/\((.*?)\)/g, '').split('\n\n---')[0].split(',').slice(1).join(', ').trim()}
                                    </p>
                                  </div>
                                  <div className="bg-surface-card p-4 rounded-lg border border-hairline shadow-sm">
                                    <p className="text-[10px] uppercase text-muted font-bold tracking-widest mb-1">Payment Method</p>
                                    <p className="text-sm font-bold text-ink">Cash on Delivery / Bulk Invoice</p>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Order Items</h4>
                                {order.order_items && order.order_items.length > 0 ? (
                                  <div className="space-y-3">
                                    {order.order_items.map((item: any) => (
                                      <div key={item.id} className="flex justify-between items-center bg-surface-card p-3 rounded-lg border border-hairline shadow-sm">
                                        <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 bg-canvas rounded-md flex items-center justify-center overflow-hidden border border-hairline">
                                            {item.products?.images?.[0] ? (
                                              <img src={item.products.images[0]} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                              <Package size={16} className="text-muted" />
                                            )}
                                          </div>
                                          <div>
                                            <p className="text-sm font-bold text-ink">{item.products?.name || 'Unknown Product'}</p>
                                            <p className="text-[10px] text-muted">Qty: {item.quantity}</p>
                                          </div>
                                        </div>
                                        <p className="font-bold text-ink">{formatCurrency(item.price_at_time)}</p>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted">No items found for this order.</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div key="settings" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="bg-surface-card rounded-2xl border border-hairline p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-ink mb-6 flex items-center gap-2"><Settings className="text-primary" /> Settings</h2>
                  <div className="space-y-6">
                    <div className="p-6 bg-canvas rounded-2xl border border-hairline group hover:border-primary transition-all">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><ShieldCheck /></div>
                        <h3 className="font-bold text-ink">Security</h3>
                      </div>
                      <p className="text-sm text-muted mb-6">Manage your account security and password settings.</p>
                      <button
                        onClick={async () => {
                          try {
                            const { error } = await supabase.auth.resetPasswordForEmail(session.user.email, {
                              redirectTo: `${window.location.origin}/account`,
                            });
                            if (error) throw error;
                            alert('Password reset email sent! Check your inbox.');
                          } catch (err: any) {
                            alert(`Error: ${err.message}`);
                          }
                        }}
                        className="text-xs font-bold uppercase tracking-widest text-primary hover:underline"
                      >
                        Send Password Reset Email →
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
