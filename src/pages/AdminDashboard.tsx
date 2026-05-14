import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { PlusCircle, Image as ImageIcon, Loader2, ShieldAlert, LayoutDashboard, Package, Users, Trash2, Edit, ExternalLink, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Product } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { CATEGORIES } from '../constants';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'stats' | 'add' | 'manage' | 'orders'>('stats');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [stats, setStats] = useState({ totalProducts: 0, totalUsers: 0, totalOrders: 0 });
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const adminFetch = async (url: string, options: any = {}) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token || ''}`,
      }
    });
  };

  const fetchStats = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await adminFetch(`${apiUrl}/api/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await adminFetch(`${apiUrl}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await adminFetch(`${apiUrl}/api/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    if (status === 'completed') {
      const confirmed = window.confirm('Are you sure you want to mark this order as completed? This action cannot be undone.');
      if (!confirmed) return;
    }
    
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await adminFetch(`${apiUrl}/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setSuccessMsg(`Order marked as ${status}`);
        fetchOrders();
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        const errorData = await res.json();
        setErrorMsg(`Failed to update status: ${errorData.error}`);
        setTimeout(() => setErrorMsg(''), 5000);
      }
    } catch (err: any) {
      setErrorMsg(`Network error: ${err.message}`);
      setTimeout(() => setErrorMsg(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this cancelled order?')) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await adminFetch(`${apiUrl}/api/orders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMsg('Order deleted successfully');
        fetchOrders();
        fetchStats();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to delete order');
      }
    } catch (err) {
      setErrorMsg('Failed to delete order');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await adminFetch(`${apiUrl}/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMsg('Product deleted successfully');
        fetchProducts();
        fetchStats();
      }
    } catch (err) {
      setErrorMsg('Failed to delete product');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setActiveTab('manage');
  };

  useEffect(() => {
    let isMounted = true;
    let interval: any;

    const setupAdmin = async (currentSession?: any) => {
      const session = currentSession || (await supabase.auth.getSession()).data.session;
      
      if (!isMounted) return;

      if (!session) {
        setIsAdmin(false);
        setTimeout(() => isMounted && navigate('/account'), 3000);
      } else {
        // Verify admin status with backend
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const res = await adminFetch(`${apiUrl}/api/admin/check`);
          
          if (res.ok) {
            setIsAdmin(true);
            fetchStats();
            fetchProducts();
            fetchOrders();
            
            if (!interval) {
              interval = setInterval(() => {
                 fetchStats();
                 fetchOrders();
              }, 30000);
            }
          } else {
            console.log('Backend rejected admin status');
            setIsAdmin(false);
            setTimeout(() => isMounted && navigate('/'), 3000);
          }
        } catch (err) {
          console.error('Admin verification failed', err);
          setIsAdmin(false);
        }
      }
    };

    setupAdmin();

    // 1. Realtime Listener for instant updates
    const ordersChannel = supabase
      .channel('admin-orders-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          fetchOrders();
          fetchStats();
        }
      )
      .subscribe();

    // 2. Listen for auth changes to handle direct URL entries robustly
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setupAdmin(session);
      }
    });

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
      supabase.removeChannel(ordersChannel);
      authSub.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const formData = new FormData(e.currentTarget);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    if (editingProduct) {
      // Add existing images if no new image is uploaded
      formData.append('existing_images', JSON.stringify(editingProduct.images || []));
    }

    try {
      const url = editingProduct 
        ? `${apiUrl}/api/products/${editingProduct.id}`
        : `${apiUrl}/api/products`;
        
      const response = await adminFetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${editingProduct ? 'update' : 'add'} product`);
      }

      setSuccessMsg(`Product ${editingProduct ? 'updated' : 'added'} successfully!`);
      if (!editingProduct) (e.target as HTMLFormElement).reset();
      setEditingProduct(null);
      fetchProducts();
      fetchStats();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4">
        <Loader2 size={48} className="text-primary animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-ink">Verifying Admin Access...</h2>
        <p className="text-muted mt-2">Please wait while we secure your session.</p>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-m-red/10 text-m-red rounded-full flex items-center justify-center mb-6">
          <ShieldAlert size={40} />
        </div>
        <h2 className="text-3xl font-bold text-ink mb-4">Access Denied</h2>
        <p className="text-muted max-w-md mx-auto mb-8">
          You do not have administrative privileges to access this area. 
          You will be redirected shortly.
        </p>
        <div className="flex gap-4">
          <button onClick={() => navigate('/account')} className="btn-primary px-8">Sign In</button>
          <button onClick={() => navigate('/')} className="px-8 py-3 bg-surface-elevated text-ink font-bold rounded-xl border border-hairline hover:bg-hairline transition-all">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-canvas text-body-text">
      <Helmet>
        <title>Admin Panel | Uniform Trends</title>
      </Helmet>

      <div className="container mx-auto px-4 max-w-6xl overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-ink tracking-tight">Admin Control Panel</h1>
            <p className="text-muted font-light mt-2 text-sm md:text-base">Manage your store products and view insights.</p>
          </div>
          
          <div className="flex bg-surface-card p-1 rounded-2xl border border-hairline shadow-sm overflow-x-auto scrollbar-hide max-w-full self-center lg:self-auto">
            <button 
              onClick={() => setActiveTab('stats')}
              className={cn(
                "px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === 'stats' ? "bg-primary text-on-primary shadow-md" : "text-muted hover:text-ink"
              )}
            >
              <LayoutDashboard size={16} className="md:w-[18px]" /> Overview
            </button>
            <button 
              onClick={() => setActiveTab('manage')}
              className={cn(
                "px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === 'manage' ? "bg-primary text-on-primary shadow-md" : "text-muted hover:text-ink"
              )}
            >
              <Package size={16} className="md:w-[18px]" /> Inventory
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={cn(
                "px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === 'orders' ? "bg-primary text-on-primary shadow-md" : "text-muted hover:text-ink"
              )}
            >
              <ShoppingBag size={16} className="md:w-[18px]" /> Orders
            </button>
            <button 
              onClick={() => {
                setEditingProduct(null);
                setActiveTab('add');
              }}
              className={cn(
                "px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === 'add' ? "bg-primary text-on-primary shadow-md" : "text-muted hover:text-ink"
              )}
            >
              <PlusCircle size={16} className="md:w-[18px]" /> {editingProduct ? 'Editing' : 'Add New'}
            </button>
          </div>
        </div>

        {successMsg && (
          <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="mb-8 p-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded-2xl flex justify-between items-center">
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg('')} className="text-xs font-bold uppercase">Close</button>
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-surface-card p-8 rounded-3xl border border-hairline shadow-sm">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <Package size={24} />
              </div>
              <p className="text-sm font-medium text-muted mb-1">Total Products</p>
              <h3 className="text-4xl font-bold text-ink">{stats.totalProducts}</h3>
            </motion.div>

            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="bg-surface-card p-8 rounded-3xl border border-hairline shadow-sm">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <Users size={24} />
              </div>
              <p className="text-sm font-medium text-muted mb-1">Total Users</p>
              <h3 className="text-4xl font-bold text-ink">{stats.totalUsers}</h3>
            </motion.div>
            
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="bg-surface-card p-8 rounded-3xl border border-hairline shadow-sm">
              <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mb-6">
                <ShoppingBag size={24} />
              </div>
              <p className="text-sm font-medium text-muted mb-1">Total Orders</p>
              <h3 className="text-4xl font-bold text-ink">{stats.totalOrders}</h3>
            </motion.div>
          </div>
        )}

        {activeTab === 'manage' && (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-surface-card rounded-3xl border border-hairline shadow-sm overflow-hidden">
             <div className="p-6 border-b border-hairline flex justify-between items-center">
                <h2 className="text-xl font-bold text-ink">Products Inventory</h2>
                <span className="text-sm text-muted font-medium">{products.length} Products Found</span>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-canvas border-b border-hairline">
                      <th className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted">Product</th>
                      <th className="px-4 md:px-6 py-4 hidden sm:table-cell text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted">Category</th>
                      <th className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted text-right md:text-left">Price</th>
                      <th className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {isLoading ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-muted">Loading inventory...</td></tr>
                    ) : products.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-muted">No products found in inventory.</td></tr>
                    ) : products.map(product => (
                      <tr key={product.id} className="hover:bg-canvas/50 transition-colors">
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center gap-2 md:gap-4">
                            <div className="w-8 h-8 md:w-12 md:h-12 bg-canvas rounded-lg border border-hairline flex items-center justify-center shrink-0 overflow-hidden">
                              {product.images && product.images.length > 0 ? (
                                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-[10px] font-bold text-muted/30">{product.name.charAt(0)}</span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-ink text-xs md:text-sm truncate">{product.name}</p>
                              <p className="hidden md:block text-[10px] text-muted font-mono truncate">{product.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 hidden sm:table-cell">
                          <span className="px-3 py-1 bg-surface-elevated text-ink text-[10px] font-bold rounded-full">{product.category}</span>
                        </td>
                        <td className="px-4 md:px-6 py-4 font-bold text-ink text-xs md:text-base text-right md:text-left">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center justify-end gap-1 md:gap-3">
                        <Link to={`/product/${product.slug}`} target="_blank" className="p-1.5 md:p-2 text-muted hover:text-primary transition-colors">
                          <ExternalLink size={16} className="md:w-[18px]" />
                        </Link>
                        <button onClick={() => handleEditProduct(product)} className="p-1.5 md:p-2 text-muted hover:text-primary transition-colors">
                          <Edit size={16} className="md:w-[18px]" />
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="p-1.5 md:p-2 text-muted hover:text-m-red transition-colors">
                          <Trash2 size={16} className="md:w-[18px]" />
                        </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-surface-card rounded-3xl border border-hairline shadow-sm overflow-hidden">
             <div className="p-6 border-b border-hairline flex justify-between items-center">
                <h2 className="text-xl font-bold text-ink">Recent Orders</h2>
                <span className="text-sm text-muted font-medium">{orders.length} Orders Found</span>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-canvas border-b border-hairline">
                      <th className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted">Order ID</th>
                      <th className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted">Customer</th>
                      <th className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted">Total</th>
                      <th className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted">Status</th>
                      <th className="px-4 md:px-6 py-4 hidden md:table-cell text-xs font-bold uppercase tracking-wider text-muted">Date</th>
                      <th className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-bold uppercase tracking-wider text-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {isLoading ? (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-muted">Loading orders...</td></tr>
                    ) : orders.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-muted">No orders found.</td></tr>
                    ) : orders.map(order => (
                      <React.Fragment key={order.id}>
                        <tr className="hover:bg-canvas/50 transition-colors">
                          <td className="px-4 md:px-6 py-4">
                            <span className="font-mono text-[10px] md:text-xs text-ink">#{order.id.substring(0, 8)}</span>
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <p className="text-xs md:text-sm font-bold text-ink">{order.shipping_address.split(',')[0] || 'Guest'}</p>
                            <p className="hidden md:block text-[10px] text-muted truncate max-w-[150px]">
                              {order.shipping_address.includes('\n\n--- CANCELLATION REASON ---') 
                                ? order.shipping_address.split('\n\n--- CANCELLATION REASON ---')[0] 
                                : order.shipping_address}
                            </p>
                            {order.shipping_address.includes('\n\n--- CANCELLATION REASON ---') && (
                              <p className="mt-2 text-[10px] bg-m-red/10 text-m-red p-1.5 rounded-lg border border-m-red/20 italic">
                                Reason: {order.shipping_address.split('--- CANCELLATION REASON ---\n')[1]}
                              </p>
                            )}
                          </td>
                          <td className="px-4 md:px-6 py-4 font-bold text-ink text-xs md:text-base">
                            {formatCurrency(order.total_amount)}
                          </td>
                          <td className="px-4 md:px-6 py-4">
                            <div className="flex items-center gap-2">
                              <select 
                                disabled={isSubmitting || order.status === 'completed'}
                                value={order.status} 
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className={cn(
                                  "text-[8px] md:text-[10px] uppercase tracking-tighter md:tracking-widest font-bold px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl outline-none border transition-all cursor-pointer appearance-none text-center min-w-[80px] md:min-w-[120px]",
                                  order.status === 'pending' && "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20",
                                  order.status === 'completed' && "bg-success/10 text-success border-success/20 hover:bg-success/20",
                                  order.status === 'cancelled' && "bg-m-red/10 text-m-red border-m-red/20 hover:bg-m-red/20"
                                )}
                              >
                                <option value="pending" className="bg-surface-card text-ink">⏳ Pending</option>
                                <option value="completed" className="bg-surface-card text-ink">✅ Completed</option>
                                <option value="cancelled" className="bg-surface-card text-ink">❌ Cancelled</option>
                              </select>
                              {isSubmitting && <Loader2 size={12} className="animate-spin text-muted" />}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-muted">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-2">
                               <button 
                                 onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                 className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                               >
                                 {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                               </button>
                               {order.status === 'cancelled' && (
                                 <button 
                                   onClick={() => handleDeleteOrder(order.id)}
                                   className="p-1.5 bg-m-red/10 text-m-red rounded-lg border border-m-red/20 hover:bg-m-red hover:text-white transition-all shadow-sm"
                                   title="Delete Cancelled Order"
                                 >
                                   <Trash2 size={14} />
                                 </button>
                               )}
                             </div>
                          </td>
                        </tr>
                        {expandedOrder === order.id && (
                          <tr className="bg-canvas">
                            <td colSpan={6} className="px-6 py-6 border-b border-hairline">
                               <div className="bg-surface-card p-4 rounded-xl border border-hairline shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div>
                                   <h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Customer Details</h4>
                                   <div className="space-y-4">
                                     <div className="bg-canvas p-4 rounded-lg border border-hairline">
                                       <p className="text-[10px] uppercase text-muted font-bold tracking-widest mb-1">Name & Contact</p>
                                       <p className="text-sm font-bold text-ink">{order.shipping_address.split(',')[0] || 'N/A'}</p>
                                       <p className="text-xs text-muted">
                                         {order.shipping_address.match(/\((.*?)\)/)?.[1] || 'No Email Provided'}
                                       </p>
                                     </div>
                                     <div className="bg-canvas p-4 rounded-lg border border-hairline">
                                       <p className="text-[10px] uppercase text-muted font-bold tracking-widest mb-1">Delivery Address</p>
                                       <p className="text-sm text-ink leading-relaxed">
                                         {order.shipping_address.replace(/\((.*?)\)/g, '').split('\n\n---')[0].split(',').slice(1).join(', ').trim()}
                                       </p>
                                     </div>
                                     <div className="bg-canvas p-4 rounded-lg border border-hairline">
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
                                          <div key={item.id} className="flex justify-between items-center bg-canvas p-3 rounded-lg border border-hairline">
                                            <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 bg-surface-elevated rounded-md flex items-center justify-center overflow-hidden">
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
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
             </div>
          </motion.div>
        )}

        {activeTab === 'add' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-card p-8 md:p-10 rounded-3xl border border-hairline shadow-sm"
          >
            {/* The existing form logic */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  {editingProduct ? <Edit size={24} /> : <PlusCircle size={24} />}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-ink">{editingProduct ? 'Edit Product' : 'Add New Product'}</h1>
                  <p className="text-muted font-light">{editingProduct ? `Currently editing: ${editingProduct.name}` : 'Add new uniforms to your catalog and cloud storage.'}</p>
                </div>
              </div>
              {editingProduct && (
                <button 
                  onClick={handleCancelEdit}
                  className="px-6 py-2 bg-surface-elevated text-ink font-bold rounded-xl hover:bg-hairline transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-ink mb-2">Product Name</label>
                  <input name="name" type="text" required defaultValue={editingProduct?.name || ''} className="w-full px-4 py-3 rounded-xl bg-canvas border border-hairline focus:border-primary outline-none transition-colors" placeholder="e.g. Classic Boys Polo" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink mb-2">Slug (URL friendly)</label>
                  <input name="slug" type="text" required defaultValue={editingProduct?.slug || ''} className="w-full px-4 py-3 rounded-xl bg-canvas border border-hairline focus:border-primary outline-none transition-colors" placeholder="e.g. classic-boys-polo" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink mb-2">Price (INR)</label>
                  <input name="price" type="number" required defaultValue={editingProduct?.price || ''} className="w-full px-4 py-3 rounded-xl bg-canvas border border-hairline focus:border-primary outline-none transition-colors" placeholder="650" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink mb-2">Category</label>
                  <select name="category" required defaultValue={editingProduct?.category || 'School'} className="w-full px-4 py-3 rounded-xl bg-canvas border border-hairline focus:border-primary outline-none transition-colors">
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-ink">Description</label>
                  <span className="text-[10px] text-muted uppercase font-bold tracking-widest">Scrollable & Resizable</span>
                </div>
                <textarea 
                  name="description" 
                  required 
                  rows={8} 
                  defaultValue={editingProduct?.description || ''} 
                  data-lenis-prevent
                  className="w-full px-4 py-3 rounded-xl bg-canvas border border-hairline focus:border-primary outline-none transition-colors resize-y min-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-hairline scrollbar-track-transparent" 
                  placeholder="Detailed product description including material, fit, and care instructions..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                  <label className="block text-sm font-bold text-ink mb-2">Sizes (Comma separated)</label>
                  <input name="sizes" type="text" defaultValue={editingProduct?.sizes?.join(', ') || ''} className="w-full px-4 py-3 rounded-xl bg-canvas border border-hairline focus:border-primary outline-none transition-colors" placeholder="S, M, L, XL" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink mb-2">Gender</label>
                  <select name="gender" defaultValue={editingProduct?.gender || 'unisex'} className="w-full px-4 py-3 rounded-xl bg-canvas border border-hairline focus:border-primary outline-none transition-colors">
                    <option value="unisex">Unisex</option>
                    <option value="boys">Boys</option>
                    <option value="girls">Girls</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-2">Product Image {editingProduct && '(Leave blank to keep existing)'}</label>
                <div className="relative w-full h-32 rounded-xl border-2 border-dashed border-hairline hover:border-primary transition-colors flex items-center justify-center bg-canvas group cursor-pointer overflow-hidden">
                  <input type="file" name="image" accept="image/*" required={!editingProduct} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="flex flex-col items-center text-muted group-hover:text-primary transition-colors pointer-events-none">
                    <ImageIcon size={32} className="mb-2" />
                    <span className="text-sm font-medium">{editingProduct ? 'Change image (optional)' : 'Click to upload image'}</span>
                  </div>
                  {editingProduct && editingProduct.images && editingProduct.images[0] && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-20 h-20 rounded-lg border border-hairline overflow-hidden opacity-50">
                       <img src={editingProduct.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl hover:bg-m-red transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  editingProduct ? 'Update Product Information' : 'Save Product to Store'
                )}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
