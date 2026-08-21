import React, { useState, useEffect } from 'react';
import SEO from '../components/layout/SEO';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { User, Package, MapPin, Settings, Lock, ShieldCheck, Mail, CheckCircle2, ChevronRight, X, Clock, Truck } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { useAuth, mockAuthService } from '../lib/mockAuth';
import { mockOrderService } from '../lib/mockService';
import { Order } from '../types';
import { STORE_NAME } from '../constants';

export default function Account() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { session, isLoggedIn } = useAuth();

  const tabParam = searchParams.get('tab') || 'orders';
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'address' | 'settings'>(
    (tabParam as any) || 'orders'
  );

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Address State
  const [addressData, setAddressData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    pin: '',
    phone: ''
  });

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  useEffect(() => {
    const loadAccountData = async () => {
      setOrdersLoading(true);
      try {
        const orderList = await mockOrderService.getOrders(
          session?.user?.id,
          session?.user?.email
        );
        setOrders(orderList);

        // Load saved address
        const saved = localStorage.getItem('uniformTrends_savedAddress');
        if (saved) {
          setAddressData(JSON.parse(saved));
        } else if (session?.user) {
          const parts = (session.user.user_metadata?.full_name || '').split(' ');
          setAddressData({
            firstName: parts[0] || 'Alex',
            lastName: parts.slice(1).join(' ') || 'Morgan',
            street: '402 Palm Residency, Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pin: '400050',
            phone: '+91 XXXXX XXXXX'
          });
        }
      } catch (e) {
        console.error('Error loading orders:', e);
      } finally {
        setOrdersLoading(false);
      }
    };

    loadAccountData();
  }, [session]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      if (authMode === 'register') {
        await mockAuthService.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
        });
        setSuccessMsg('Account created successfully!');
      } else {
        await mockAuthService.signInWithPassword({ email, password });
        setSuccessMsg('Logged in successfully!');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setAuthLoading(true);
    await mockAuthService.signInWithPassword({
      email: 'demo@clothingstore.com'
    });
    setSuccessMsg('Logged in with Demo Account!');
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await mockAuthService.signOut();
    navigate('/');
  };

  const handleCancelOrder = async (orderId: string) => {
    const reason = window.prompt('Please provide a reason for cancellation (e.g. ordered wrong size):');
    if (!reason) return;

    await mockOrderService.cancelOrder(orderId, reason);
    const updated = await mockOrderService.getOrders(session?.user?.id, session?.user?.email);
    setOrders(updated);
    setSuccessMsg('Order cancelled successfully.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('uniformTrends_savedAddress', JSON.stringify(addressData));
    setSuccessMsg('Shipping address updated successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // If not logged in, show Auth Gate
  if (!isLoggedIn || !session?.user) {
    return (
      <div className="pt-32 pb-24 min-h-[85vh] bg-canvas flex items-center justify-center">
        <SEO title={`Sign In | ${STORE_NAME}`} description="Sign in to your customer account." />

        <div className="bg-white border border-hairline p-8 sm:p-12 w-full max-w-md shadow-lg">
          <div className="text-center mb-8">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-1">Customer Portal</span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
          </div>

          {/* Quick Demo Login Pill */}
          <div className="mb-6 p-4 bg-surface-soft border border-hairline text-center">
            <p className="text-xs text-muted mb-2 font-medium">Testing this prototype? Log in with 1-click:</p>
            <button
              onClick={handleDemoLogin}
              className="w-full bg-ink text-white text-xs font-bold uppercase tracking-wider py-2.5 hover:bg-neutral-800 transition-colors"
            >
              1-Click Demo Login (Alex Morgan)
            </button>
          </div>

          <div className="relative flex py-2 items-center mb-4">
            <div className="flex-grow border-t border-hairline"></div>
            <span className="flex-shrink mx-4 text-[10px] uppercase tracking-wider font-bold text-muted">Or enter credentials</span>
            <div className="flex-grow border-t border-hairline"></div>
          </div>

          {authError && <div className="p-3 mb-4 bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-bold">{authError}</div>}
          {successMsg && <div className="p-3 mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-bold">{successMsg}</div>}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full bg-canvas border border-hairline px-4 py-3 text-xs text-ink outline-none focus:border-ink"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-canvas border border-hairline px-4 py-3 text-xs text-ink outline-none focus:border-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-canvas border border-hairline px-4 py-3 text-xs text-ink outline-none focus:border-ink"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full btn-primary py-3.5 text-xs font-bold uppercase tracking-wider"
            >
              {authLoading ? 'Signing in...' : authMode === 'login' ? 'Sign In' : 'Register Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-xs font-bold text-ink underline"
            >
              {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-canvas min-h-screen">
      <SEO title={`My Account | ${STORE_NAME}`} description="Manage your customer account and view past orders." />

      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar (4 cols) */}
          <aside className="lg:col-span-4">
            <div className="bg-white border border-hairline p-6 sticky top-28 space-y-6">
              {/* User Avatar Badge */}
              <div className="flex items-center gap-4 pb-6 border-b border-hairline">
                <div className="w-14 h-14 bg-ink text-white flex items-center justify-center font-black text-xl uppercase">
                  {session.user.user_metadata?.full_name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-ink truncate">
                    {session.user.user_metadata?.full_name || 'Valued Customer'}
                  </h3>
                  <p className="text-xs text-muted truncate">{session.user.email}</p>
                  <span className="inline-block mt-1 bg-surface-elevated text-ink text-[10px] font-bold px-2 py-0.5 border border-hairline">
                    Verified Customer
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-1">
                {[
                  { id: 'orders', label: 'Order History', icon: Package, count: orders.length },
                  { id: 'profile', label: 'Profile Details', icon: User },
                  { id: 'address', label: 'Saved Shipping Address', icon: MapPin },
                  { id: 'settings', label: 'Security & Preferences', icon: Settings },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 text-xs font-bold uppercase tracking-wider transition-colors",
                      activeTab === tab.id
                        ? "bg-ink text-white"
                        : "text-muted hover:bg-surface-elevated hover:text-ink"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon size={16} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.count !== undefined && (
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 font-bold",
                        activeTab === tab.id ? "bg-white text-ink" : "bg-canvas text-muted border border-hairline"
                      )}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 transition-colors pt-4 border-t border-hairline mt-4"
                >
                  <Lock size={16} />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content Area (8 cols) */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-hairline">
                    <h2 className="text-xl font-black uppercase tracking-tight text-ink">
                      Order History ({orders.length})
                    </h2>
                    <span className="text-xs text-muted">Mock System Persistence</span>
                  </div>

                  {ordersLoading ? (
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-32 bg-white border border-hairline animate-pulse" />
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-hairline">
                      <Package size={40} className="mx-auto text-muted mb-3 opacity-30" />
                      <h3 className="font-bold text-ink mb-1">No Orders Found</h3>
                      <p className="text-xs text-muted mb-6">You have not placed any orders yet.</p>
                      <Link to="/shop" className="btn-primary py-3 px-8 text-xs">Start Shopping</Link>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="bg-white border border-hairline p-6 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-hairline">
                          <div>
                            <span className="font-mono text-xs font-black text-ink">{order.id}</span>
                            <p className="text-[11px] text-muted">
                              Placed on {new Date(order.created_at).toLocaleDateString()} • {order.items?.length || 0} items
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-widest px-3 py-1 border",
                              order.status === 'delivered' || order.status === 'completed'
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : order.status === 'cancelled'
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-amber-50 text-amber-800 border-amber-200"
                            )}>
                              {order.status}
                            </span>
                            <span className="text-base font-black text-ink">
                              {formatCurrency(order.total_amount)}
                            </span>
                          </div>
                        </div>

                        {/* Items Preview */}
                        <div className="space-y-2">
                          {(order.items || order.order_items || []).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs py-1">
                              <div className="flex items-center gap-3">
                                {item.image && (
                                  <img src={item.image} alt="" className="w-10 h-12 object-cover bg-surface-soft border border-hairline" />
                                )}
                                <div>
                                  <p className="font-bold text-ink">{item.name || item.products?.name || 'Clothing Item'}</p>
                                  <p className="text-muted text-[11px]">Size: {item.size} {item.color ? `• ${item.color}` : ''} • Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <span className="font-bold text-ink">{formatCurrency((item.price || 0) * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Expandable Details */}
                        {expandedOrder === order.id && (
                          <div className="pt-4 border-t border-hairline text-xs space-y-3 bg-canvas p-4">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-muted block mb-0.5">Shipping Address</span>
                              <p className="text-ink font-medium">{order.shipping_address}</p>
                            </div>
                            {order.tracking_number && (
                              <div>
                                <span className="text-[10px] uppercase font-bold text-muted block mb-0.5">Tracking Number</span>
                                <p className="font-mono text-ink font-bold">{order.tracking_number} (Express Logistics)</p>
                              </div>
                            )}
                            {order.payment_method && (
                              <div>
                                <span className="text-[10px] uppercase font-bold text-muted block mb-0.5">Payment Method</span>
                                <p className="text-ink font-medium">{order.payment_method}</p>
                              </div>
                            )}
                            {order.cancellation_reason && (
                              <div className="p-3 bg-red-50 text-red-700 border border-red-200">
                                <span className="font-bold">Cancellation Reason:</span> {order.cancellation_reason}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <button
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            className="text-xs font-bold text-ink underline"
                          >
                            {expandedOrder === order.id ? 'Hide Details' : 'View Full Details'}
                          </button>

                          {order.status === 'processing' || order.status === 'pending' ? (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="text-xs font-bold text-red-600 hover:underline"
                            >
                              Cancel Order
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}

              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-hairline p-8 space-y-6"
                >
                  <h2 className="text-xl font-black uppercase tracking-tight text-ink pb-4 border-b border-hairline">
                    Customer Profile
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                    <div className="p-4 bg-canvas border border-hairline">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-1">Full Name</span>
                      <p className="text-sm font-bold text-ink">{session.user.user_metadata?.full_name || 'Alex Morgan'}</p>
                    </div>
                    <div className="p-4 bg-canvas border border-hairline">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-1">Email</span>
                      <p className="text-sm font-bold text-ink">{session.user.email}</p>
                    </div>
                    <div className="p-4 bg-canvas border border-hairline">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-1">Phone</span>
                      <p className="text-sm font-bold text-ink">{session.user.user_metadata?.phone || '+91 XXXXX XXXXX'}</p>
                    </div>
                    <div className="p-4 bg-canvas border border-hairline">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-1">Member Since</span>
                      <p className="text-sm font-bold text-ink">{new Date(session.user.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ADDRESS TAB */}
              {activeTab === 'address' && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-hairline p-8 space-y-6"
                >
                  <h2 className="text-xl font-black uppercase tracking-tight text-ink pb-4 border-b border-hairline">
                    Saved Shipping Address
                  </h2>

                  <form onSubmit={handleSaveAddress} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1">First Name</label>
                        <input
                          type="text"
                          required
                          value={addressData.firstName}
                          onChange={(e) => setAddressData({ ...addressData, firstName: e.target.value })}
                          className="w-full bg-canvas border border-hairline px-4 py-3 text-xs text-ink outline-none focus:border-ink"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1">Last Name</label>
                        <input
                          type="text"
                          required
                          value={addressData.lastName}
                          onChange={(e) => setAddressData({ ...addressData, lastName: e.target.value })}
                          className="w-full bg-canvas border border-hairline px-4 py-3 text-xs text-ink outline-none focus:border-ink"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1">Street Address</label>
                      <input
                        type="text"
                        required
                        value={addressData.street}
                        onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                        className="w-full bg-canvas border border-hairline px-4 py-3 text-xs text-ink outline-none focus:border-ink"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={addressData.city}
                          onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                          className="w-full bg-canvas border border-hairline px-4 py-3 text-xs text-ink outline-none focus:border-ink"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1">State</label>
                        <input
                          type="text"
                          required
                          value={addressData.state}
                          onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                          className="w-full bg-canvas border border-hairline px-4 py-3 text-xs text-ink outline-none focus:border-ink"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1">PIN Code</label>
                        <input
                          type="text"
                          required
                          value={addressData.pin}
                          onChange={(e) => setAddressData({ ...addressData, pin: e.target.value })}
                          className="w-full bg-canvas border border-hairline px-4 py-3 text-xs text-ink outline-none focus:border-ink"
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn-primary py-3.5 px-8 text-xs">
                      Save Shipping Address
                    </button>
                  </form>
                </motion.div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-hairline p-8 space-y-6"
                >
                  <h2 className="text-xl font-black uppercase tracking-tight text-ink pb-4 border-b border-hairline">
                    Security & Preferences
                  </h2>

                  <div className="space-y-4 text-xs">
                    <div className="p-6 bg-canvas border border-hairline">
                      <h4 className="font-bold text-sm text-ink mb-1">Password & Authentication</h4>
                      <p className="text-muted mb-4">You are currently using the mock system with instant authentication.</p>
                      <button
                        onClick={() => alert('Password reset link sent to registered email in mock mode.')}
                        className="btn-secondary py-2.5 px-6 text-xs"
                      >
                        Reset Password
                      </button>
                    </div>

                    <div className="p-6 bg-canvas border border-hairline">
                      <h4 className="font-bold text-sm text-ink mb-1">Local Mock Data Management</h4>
                      <p className="text-muted mb-4">Reset stored mock orders, reviews, and address data to factory defaults.</p>
                      <button
                        onClick={() => {
                          if (window.confirm('Reset all mock orders and data?')) {
                            localStorage.clear();
                            window.location.reload();
                          }
                        }}
                        className="text-xs font-bold text-red-600 border border-red-200 bg-red-50 py-2.5 px-6 hover:bg-red-100 transition-colors"
                      >
                        Reset Mock Storage
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
