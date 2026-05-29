import React, { useState, useEffect } from 'react';
import SEO from '../components/layout/SEO';
import { motion } from 'motion/react';
import { PlusCircle, Image as ImageIcon, Loader2, ShieldAlert, LayoutDashboard, Package, Users, Trash2, Edit, ExternalLink, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Product } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { getApiUrl } from '../config';
import { CATEGORIES } from '../constants';
interface FilePreviewProps {
  file: File;
}

function FilePreview({ file }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = React.useState<string>('');

  React.useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!previewUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-canvas">
        <Loader2 className="animate-spin text-primary" size={16} />
      </div>
    );
  }

  return (
    <img 
      src={previewUrl} 
      alt="" 
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
    />
  );
}

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
  const [hasInitialData, setHasInitialData] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'all' | 'standard' | 'bulk'>('all');
  const [colorsInput, setColorsInput] = useState<string>('');
  const [colors, setColors] = useState<string[]>([]);
  const [sizesInput, setSizesInput] = useState<string>('');
  const [activeColorTab, setActiveColorTab] = useState<string>('default');
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [existingColorImages, setExistingColorImages] = useState<Record<string, string[]>>({});
  const [newColorFiles, setNewColorFiles] = useState<Record<string, File[]>>({});
  
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
      const apiUrl = getApiUrl();
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
      const apiUrl = getApiUrl();
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
      const apiUrl = getApiUrl();
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
      const apiUrl = getApiUrl();
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
      const apiUrl = getApiUrl();
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
      const apiUrl = getApiUrl();
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
    setExistingImages(product.images || []);
    setNewFiles([]);
    setColors(product.colors || []);
    setColorsInput(product.colors?.join(', ') || '');
    setSizesInput(product.sizes?.join(', ') || '');
    setActiveColorTab('default');
    setExistingColorImages(product.color_images || product.colorImages || {});
    setNewColorFiles({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setExistingImages([]);
    setNewFiles([]);
    setColors([]);
    setColorsInput('');
    setSizesInput('');
    setActiveColorTab('default');
    setExistingColorImages({});
    setNewColorFiles({});
    setActiveTab('manage');
  };

  const lastProcessedTokenRef = React.useRef<string | undefined>(undefined);

  // 1. Auth & Admin Verification Effect
  useEffect(() => {
    let isMounted = true;

    const verifyAdminStatus = async (session: any) => {
      if (!session) {
        if (isMounted) {
          setIsAdmin(false);
          setTimeout(() => isMounted && navigate('/account'), 3000);
        }
        return;
      }

      const token = session.access_token;
      // Skip duplicate checks to avoid infinite verification requests/token loops
      if (token === lastProcessedTokenRef.current) {
        return;
      }

      lastProcessedTokenRef.current = token;

      if (isMounted) {
        setUserEmail(session.user.email || '');
      }

      try {
        const apiUrl = getApiUrl();
        const res = await adminFetch(`${apiUrl}/api/admin/check`);
        
        if (isMounted) {
          if (res.ok) {
            setIsAdmin(true);
          } else {
            const errorData = await res.json();
            console.error('Admin Access Denied:', errorData.error);
            setErrorMsg(`Admin Verification Failed: ${errorData.error}`);
            setIsAdmin(false);
            setTimeout(() => isMounted && navigate('/'), 5000);
          }
        }
      } catch (err: any) {
        console.error('Admin verification connection failed', err);
        if (isMounted) {
          setErrorMsg(`Server Connection Error: ${err.message}`);
          setIsAdmin(false);
        }
      }
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) verifyAdminStatus(session);
    });

    // Listen for auth changes
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((event, session) => {
      // Only re-verify on major auth events to avoid loops
      if (isMounted && (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED')) {
        verifyAdminStatus(session);
      }
    });

    return () => {
      isMounted = false;
      authSub.unsubscribe();
    };
  }, [navigate]);

  // 2. Data Fetching Effect (Depends on Admin Status)
  useEffect(() => {
    let isMounted = true;
    let interval: any;

    if (isAdmin === true && !hasInitialData) {
      const loadData = async () => {
        await Promise.all([
          fetchStats(),
          fetchProducts(),
          fetchOrders()
        ]);
        if (isMounted) setHasInitialData(true);
      };
      
      loadData();

      // Setup background refresh
      interval = setInterval(() => {
        if (isMounted) {
          fetchStats();
          fetchOrders();
        }
      }, 60000); // Refresh every minute instead of 30s to be more stable
    }

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [isAdmin, hasInitialData]);

  // 3. Realtime Listener Effect
  useEffect(() => {
    if (isAdmin !== true) return;

    const ordersChannel = supabase
      .channel('admin-orders-live-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders();
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, [isAdmin]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files) as File[];
      
      const validFiles = filesArray.filter(file => {
        if (file.size > 5 * 1024 * 1024) {
          alert(`Image ${file.name} is too large (max 5MB)`);
          return false;
        }
        if (!file.type.startsWith('image/')) {
          alert(`File ${file.name} is not a valid image format. Please use JPEG, PNG, or WebP.`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      const total = existingImages.length + newFiles.length;
      const allowedCount = 5 - total;

      if (allowedCount <= 0) {
        alert("Maximum of 5 default images are allowed.");
        return;
      }

      const filesToAdd = validFiles.slice(0, allowedCount);
      if (validFiles.length > allowedCount) {
        alert(`You can only add up to 5 default images. Only the first ${allowedCount} images were selected.`);
      }

      setNewFiles(prev => [...prev, ...filesToAdd]);
    }
  };

  const handleColorFileChange = (color: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files) as File[];

      const validFiles = filesArray.filter(file => {
        if (file.size > 5 * 1024 * 1024) {
          alert(`Image ${file.name} is too large (max 5MB)`);
          return false;
        }
        if (!file.type.startsWith('image/')) {
          alert(`File ${file.name} is not a valid image format. Please use JPEG, PNG, or WebP.`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      const matchedColorKey = Object.keys(existingColorImages).find(
        k => k.trim().toLowerCase() === color.trim().toLowerCase()
      ) || Object.keys(newColorFiles).find(
        k => k.trim().toLowerCase() === color.trim().toLowerCase()
      ) || color;

      const existingUrls = existingColorImages[matchedColorKey] || [];
      const newFilesForColor = newColorFiles[matchedColorKey] || [];
      const total = existingUrls.length + newFilesForColor.length;
      const allowedCount = 5 - total;

      if (allowedCount <= 0) {
        alert(`Maximum of 5 images are allowed for ${color}.`);
        return;
      }

      const filesToAdd = validFiles.slice(0, allowedCount);
      if (validFiles.length > allowedCount) {
        alert(`You can only add up to 5 images for ${color}. Only the first ${allowedCount} images were selected.`);
      }

      setNewColorFiles(prev => ({
        ...prev,
        [matchedColorKey]: [...newFilesForColor, ...filesToAdd]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const formData = new FormData(e.currentTarget);
    const apiUrl = getApiUrl();

    // Clean up default image fields
    formData.delete('image');
    formData.delete('images');

    if (existingImages.length + newFiles.length > 5) {
      setErrorMsg("Maximum of 5 default images are allowed.");
      setIsSubmitting(false);
      return;
    }

    // Append default images
    formData.append('existing_images', JSON.stringify(existingImages));
    newFiles.forEach(file => {
      formData.append('images', file);
    });

    // Append colors
    formData.set('colors', colors.join(','));

    // Clean, synchronize and sanitize color maps matching the current colors array
    const cleanedExistingColorImages: Record<string, string[]> = {};
    const cleanedNewColorFiles: Record<string, File[]> = {};

    colors.forEach(color => {
      const existingMatch = Object.keys(existingColorImages).find(
        k => k.trim().toLowerCase() === color.trim().toLowerCase()
      );
      if (existingMatch) {
        cleanedExistingColorImages[color] = existingColorImages[existingMatch];
      }

      const newFilesMatch = Object.keys(newColorFiles).find(
        k => k.trim().toLowerCase() === color.trim().toLowerCase()
      );
      if (newFilesMatch) {
        cleanedNewColorFiles[color] = newColorFiles[newFilesMatch];
      }
    });

    // Append color-specific images
    formData.append('existing_color_images', JSON.stringify(cleanedExistingColorImages));
    Object.keys(cleanedNewColorFiles).forEach(color => {
      const filesForColor = cleanedNewColorFiles[color] || [];
      const sanitizedColorKey = `color_images_${color.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      filesForColor.forEach(file => {
        formData.append(sanitizedColorKey, file);
      });
    });

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
      (e.target as HTMLFormElement).reset(); // Always reset the form to prevent stale data
      setEditingProduct(null);
      setExistingImages([]);
      setNewFiles([]);
      setColors([]);
      setColorsInput('');
      setSizesInput('');
      setExistingColorImages({});
      setNewColorFiles({});
      setActiveColorTab('default');
      fetchProducts();
      fetchStats();
      
      // Navigate to the manage tab smoothly after success
      setTimeout(() => setActiveTab('manage'), 1500);
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
        <p className="text-m-red font-bold mb-4 bg-m-red/5 p-3 rounded-lg border border-m-red/10">
          Error: {errorMsg || 'Your account does not have administrator privileges.'}
        </p>
        <p className="text-muted max-w-md mx-auto mb-8">
          Logged in as: <span className="font-bold text-ink">{userEmail}</span>
        </p>
        <div className="flex gap-4">
          <button onClick={() => navigate('/account')} className="btn-primary px-8">Sign In</button>
          <button onClick={() => navigate('/')} className="px-8 py-3 bg-surface-elevated text-ink font-bold rounded-xl border border-hairline hover:bg-hairline transition-all">Go Home</button>
        </div>
      </div>
    );
  }

  const bulkOrdersCount = orders.filter(o => 
    o.shipping_address?.includes('--- ORDER TYPE ---\nbulk') ||
    o.order_items?.some((oi: any) => oi.quantity >= 100)
  ).length;

  const filteredOrders = orders.filter(order => {
    const isBulk = order.shipping_address?.includes('--- ORDER TYPE ---\nbulk') ||
                   order.order_items?.some((oi: any) => oi.quantity >= 100);
    
    if (orderFilter === 'bulk') return isBulk;
    if (orderFilter === 'standard') return !isBulk;
    return true;
  });

  return (
    <div className="pt-32 pb-24 min-h-screen bg-canvas text-body-text">
      <SEO
        title="Admin Panel"
        description="Administrative panel for store inventory and order management."
        robots="noindex, nofollow"
      />

      <div className="container mx-auto px-4 max-w-[1600px] overflow-hidden">
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
                setExistingImages([]);
                setNewFiles([]);
                setColors([]);
                setColorsInput('');
                setSizesInput('');
                setActiveColorTab('default');
                setExistingColorImages({});
                setNewColorFiles({});
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

            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.3}} className="bg-surface-card p-8 rounded-3xl border border-hairline shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <Package size={24} className="text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-muted mb-1">Bulk Orders 📦</p>
              <h3 className="text-4xl font-bold text-success">{bulkOrdersCount}</h3>
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
             <div className="p-6 border-b border-hairline flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                <div>
                  <h2 className="text-xl font-bold text-ink">Recent Orders</h2>
                  <span className="text-sm text-muted font-medium">{filteredOrders.length} Orders Found</span>
                </div>

                <div className="flex bg-canvas p-1 rounded-xl border border-hairline-strong self-start sm:self-auto">
                  <button
                    onClick={() => setOrderFilter('all')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                      orderFilter === 'all' ? "bg-surface-card text-ink shadow-sm border border-hairline" : "text-muted hover:text-ink"
                    )}
                  >
                    All Orders
                  </button>
                  <button
                    onClick={() => setOrderFilter('standard')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                      orderFilter === 'standard' ? "bg-surface-card text-ink shadow-sm border border-hairline" : "text-muted hover:text-ink"
                    )}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setOrderFilter('bulk')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                      orderFilter === 'bulk' ? "bg-emerald-500/10 text-emerald-400 shadow-sm border border-emerald-500/20" : "text-muted hover:text-emerald-400"
                    )}
                  >
                    📦 Bulk Orders
                  </button>
                </div>
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
                    ) : filteredOrders.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-muted">No orders found matching the filter.</td></tr>
                    ) : filteredOrders.map(order => {
                      const isBulk = order.shipping_address?.includes('--- ORDER TYPE ---\nbulk') ||
                                     order.order_items?.some((oi: any) => oi.quantity >= 100);
                      
                      const cleanedAddr = order.shipping_address
                        ?.split('\n\n--- ORDER TYPE ---')[0]
                        ?.split('\n\n--- CANCELLATION REASON ---')[0] || '';

                      const customerName = cleanedAddr.split(',')[0] || 'Guest';
                      
                      const deliveryAddress = cleanedAddr.replace(/\((.*?)\)/g, '').split(',').slice(1).join(', ').trim();
                      
                      const customerEmail = order.shipping_address.match(/\((.*?)\)/)?.[1] || 'No Email Provided';

                      return (
                        <React.Fragment key={order.id}>
                          <tr className="hover:bg-canvas/50 transition-colors">
                            <td className="px-4 md:px-6 py-4">
                              <span className="font-mono text-[10px] md:text-xs text-ink">#{order.id.substring(0, 8)}</span>
                            </td>
                            <td className="px-4 md:px-6 py-4">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-xs md:text-sm font-bold text-ink">{customerName}</p>
                                {isBulk && (
                                  <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-md animate-pulse">
                                    📦 BULK
                                  </span>
                                )}
                              </div>
                              <p className="hidden md:block text-[10px] text-muted truncate max-w-[180px] mt-0.5">
                                {cleanedAddr}
                              </p>
                              {order.shipping_address.includes('\n\n--- CANCELLATION REASON ---') && (
                                <p className="mt-2 text-[10px] bg-m-red/10 text-m-red p-1.5 rounded-lg border border-m-red/20 italic">
                                  Reason: {order.shipping_address.split('--- CANCELLATION REASON ---\n')[1] || order.shipping_address.split('\n\n--- CANCELLATION REASON ---')[1]}
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
                            <td className="px-6 py-4 text-xs text-muted hidden md:table-cell">
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
                                 <div className="bg-surface-card p-6 rounded-2xl border border-hairline shadow-sm">
                                   
                                   {isBulk && (
                                     <div className="mb-6 bg-emerald-500/5 p-5 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)] relative overflow-hidden">
                                       <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
                                       <div className="flex items-start gap-4">
                                         <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
                                           📦
                                         </div>
                                         <div>
                                           <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">B2B Institutional Order Details</h4>
                                           <p className="text-xs text-muted mt-1 leading-relaxed max-w-3xl">
                                             This high-volume purchase includes a 10% volume discount applied directly to item unit prices. The order is cleared for priority manufacturing scheduling, multi-step quality audit validation, and dedicated transport container dispatch.
                                           </p>
                                           <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] font-mono font-bold">
                                             <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                                               ✓ 10% VOLUME DISCOUNT APPLIED
                                             </span>
                                             <span className="text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
                                               ✓ B2B NET 30 INVOICING ACCOUNTING SCHEDULE
                                             </span>
                                             <span className="text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                                               ✓ PRIORITY MANUFACTURING LOGISTICS
                                             </span>
                                           </div>
                                         </div>
                                       </div>
                                     </div>
                                   )}

                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <div>
                                       <h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Customer Details</h4>
                                       <div className="space-y-4">
                                         <div className="bg-canvas p-4 rounded-lg border border-hairline">
                                           <p className="text-[10px] uppercase text-muted font-bold tracking-widest mb-1">Name & Contact</p>
                                           <p className="text-sm font-bold text-ink">{customerName}</p>
                                           <p className="text-xs text-muted mt-0.5">{customerEmail}</p>
                                         </div>
                                         <div className="bg-canvas p-4 rounded-lg border border-hairline">
                                           <p className="text-[10px] uppercase text-muted font-bold tracking-widest mb-1">Delivery Address</p>
                                           <p className="text-sm text-ink leading-relaxed">
                                             {deliveryAddress || 'Local Pickup / Handover'}
                                           </p>
                                         </div>
                                         <div className="bg-canvas p-4 rounded-lg border border-hairline">
                                           <p className="text-[10px] uppercase text-muted font-bold tracking-widest mb-1">Payment Method</p>
                                           <p className="text-sm font-bold text-ink">
                                             {isBulk ? "B2B Net 30 Commercial Invoice (Priority Dispatch)" : "Cash on Delivery (COD) / Instant UPI"}
                                           </p>
                                         </div>
                                       </div>
                                     </div>
                                     <div>
                                       <h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Order Items</h4>
                                       {order.order_items && order.order_items.length > 0 ? (
                                          <div className="space-y-3">
                                            {order.order_items.map((item: any) => {
                                              const isItemBulk = item.quantity >= 100;
                                              const originalUnitPrice = isItemBulk ? item.price_at_time / 0.9 : item.price_at_time;
                                              const calculatedTotal = item.price_at_time * item.quantity;
                                              const discountAmt = isItemBulk ? (originalUnitPrice * 0.1 * item.quantity) : 0;
                                              
                                              return (
                                                <div key={item.id} className="flex justify-between items-center bg-canvas p-4 rounded-xl border border-hairline hover:border-hairline-strong transition-all">
                                                  <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-surface-elevated rounded-lg flex items-center justify-center overflow-hidden border border-hairline shrink-0">
                                                      {item.products?.images?.[0] ? (
                                                        <img src={item.products.images[0]} alt="" className="w-full h-full object-cover" />
                                                      ) : (
                                                        <Package size={18} className="text-muted" />
                                                      )}
                                                    </div>
                                                    <div>
                                                      <p className="text-xs md:text-sm font-bold text-ink flex items-center gap-2 flex-wrap">
                                                        {item.products?.name || 'Unknown Product'}
                                                        {isItemBulk && (
                                                          <span className="px-1.5 py-0.5 text-[8px] font-bold bg-emerald-500/10 text-emerald-400 rounded">
                                                            10% BULK OFF
                                                          </span>
                                                        )}
                                                      </p>
                                                      <p className="text-[10px] text-muted font-mono mt-0.5 flex flex-wrap gap-1.5 items-center">
                                                        <span>{formatCurrency(item.price_at_time)} × {item.quantity} units</span>
                                                        {(item.size || item.color) && (
                                                          <span className="text-[9px] font-bold text-muted bg-surface-elevated border border-hairline px-1.5 py-0.5 rounded uppercase shrink-0">
                                                            {item.size ? `Size: ${item.size}` : ''}
                                                            {item.size && item.color ? ' | ' : ''}
                                                            {item.color ? `Color: ${item.color}` : ''}
                                                          </span>
                                                        )}
                                                      </p>
                                                    </div>
                                                  </div>
                                                  <div className="text-right shrink-0">
                                                    <p className="font-bold text-ink text-sm">{formatCurrency(calculatedTotal)}</p>
                                                    {isItemBulk && (
                                                      <p className="text-[9px] text-emerald-400 font-mono font-medium mt-0.5">
                                                        Saved {formatCurrency(discountAmt)}
                                                      </p>
                                                    )}
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                       ) : (
                                         <p className="text-sm text-muted">No items found for this order.</p>
                                       )}
                                     </div>
                                   </div>
                                 </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                  <label className="block text-sm font-bold text-ink mb-2">Sizes (Comma separated)</label>
                  <input 
                    name="sizes" 
                    type="text" 
                    value={sizesInput} 
                    onChange={(e) => setSizesInput(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl bg-canvas border border-hairline focus:border-primary outline-none transition-colors" 
                    placeholder="S, M, L, XL" 
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() => setSizesInput('S, M, L, XL, 2XL, 3XL, 4XL, 5XL')}
                      className="px-2.5 py-1 text-[10px] font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all"
                    >
                      Adult (S-5XL)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSizesInput('24, 26, 28, 30, 32, 34')}
                      className="px-2.5 py-1 text-[10px] font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all"
                    >
                      Junior (24-34)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSizesInput('S, M, L, XL')}
                      className="px-2.5 py-1 text-[10px] font-bold bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all"
                    >
                      Adult (S-XL)
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink mb-2">Colors (Comma separated)</label>
                  <input 
                    name="colors" 
                    type="text" 
                    value={colorsInput}
                    onChange={(e) => {
                      setColorsInput(e.target.value);
                      const parsed = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      setColors(parsed);
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-canvas border border-hairline focus:border-primary outline-none transition-colors" 
                    placeholder="Navy Blue, Royal Blue, White" 
                  />
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
                <label className="block text-sm font-bold text-ink mb-3">Product Image & Color Galleries</label>
                
                {/* Visual Color Tabs */}
                {colors.length > 0 && (
                  <div className="flex bg-surface-elevated p-1 rounded-2xl border border-hairline mb-6 overflow-x-auto scrollbar-hide max-w-full">
                    <button 
                      type="button"
                      onClick={() => setActiveColorTab('default')}
                      className={cn(
                        "px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap",
                        activeColorTab === 'default' ? "bg-primary text-on-primary shadow-sm" : "text-muted hover:text-ink"
                      )}
                    >
                      Default Images
                    </button>
                    {colors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setActiveColorTab(color)}
                        className={cn(
                          "px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2",
                          activeColorTab === color ? "bg-primary text-on-primary shadow-sm" : "text-muted hover:text-ink"
                        )}
                      >
                        <span className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: color.toLowerCase().replace(/\s+/g, '') }} />
                        {color}
                      </button>
                    ))}
                  </div>
                )}

                {/* Grid Gallery for active tab */}
                {(activeColorTab === 'default' || !colors.includes(activeColorTab)) ? (
                  <div>
                    <p className="text-xs text-muted font-medium mb-3">Default images displayed on cards and catalogs (Up to 5 max).</p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      {/* Default Existing Images */}
                      {existingImages.map((url, index) => (
                        <div key={`exist-def-${index}`} className="relative aspect-[4/5] rounded-xl border border-hairline overflow-hidden group bg-canvas flex items-center justify-center">
                          <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              type="button" 
                              onClick={() => setExistingImages(prev => prev.filter((_, idx) => idx !== index))}
                              className="p-2.5 bg-m-red/90 text-white rounded-full hover:bg-m-red transition-colors duration-200 shadow-md"
                              title="Delete Image"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider bg-black/60 text-white rounded">
                            Exist {index + 1}
                          </span>
                        </div>
                      ))}

                      {/* Default New Files */}
                      {newFiles.map((file, index) => (
                        <div key={`new-def-${index}`} className="relative aspect-[4/5] rounded-xl border border-hairline overflow-hidden group bg-canvas flex items-center justify-center">
                          <FilePreview file={file} />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              type="button" 
                              onClick={() => {
                                setNewFiles(prev => prev.filter((_, idx) => idx !== index));
                              }}
                              className="p-2.5 bg-m-red/90 text-white rounded-full hover:bg-m-red transition-colors duration-200 shadow-md"
                              title="Remove File"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider bg-emerald-500 text-white rounded">
                            New {index + 1}
                          </span>
                        </div>
                      ))}

                      {/* Default Add Slot */}
                      {existingImages.length + newFiles.length < 5 && (
                        <div className="relative aspect-[4/5] rounded-xl border-2 border-dashed border-hairline hover:border-primary transition-colors bg-canvas flex flex-col items-center justify-center group cursor-pointer text-muted hover:text-primary">
                          <input 
                            type="file" 
                            multiple
                            accept="image/*" 
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                          />
                          <PlusCircle size={24} className="mb-1.5 transition-colors" />
                          <span className="text-[10px] font-bold tracking-wider uppercase text-center px-1">Upload</span>
                          <span className="text-[8px] opacity-60 mt-0.5">({5 - (existingImages.length + newFiles.length)} slots left)</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // Color tab active
                  (() => {
                    const matchedColorKey = Object.keys(existingColorImages).find(
                      k => k.trim().toLowerCase() === activeColorTab.trim().toLowerCase()
                    ) || Object.keys(newColorFiles).find(
                      k => k.trim().toLowerCase() === activeColorTab.trim().toLowerCase()
                    ) || activeColorTab;

                    const colorExistingList = existingColorImages[matchedColorKey] || [];
                    const colorNewList = newColorFiles[matchedColorKey] || [];

                    return (
                      <div>
                        <p className="text-xs text-muted font-medium mb-3">Images displayed when the color variant <strong>{activeColorTab}</strong> is selected by the user (Up to 5 max).</p>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                          {/* Color Existing Images */}
                          {colorExistingList.map((url, index) => (
                            <div key={`exist-${matchedColorKey}-${index}`} className="relative aspect-[4/5] rounded-xl border border-hairline overflow-hidden group bg-canvas flex items-center justify-center">
                              <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    setExistingColorImages(prev => ({
                                      ...prev,
                                      [matchedColorKey]: colorExistingList.filter((_, idx) => idx !== index)
                                    }));
                                  }}
                                  className="p-2.5 bg-m-red/90 text-white rounded-full hover:bg-m-red transition-colors duration-200 shadow-md"
                                  title="Delete Image"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider bg-black/60 text-white rounded">
                                Exist {index + 1}
                              </span>
                            </div>
                          ))}

                          {/* Color New Files */}
                          {colorNewList.map((file, index) => (
                            <div key={`new-${matchedColorKey}-${index}`} className="relative aspect-[4/5] rounded-xl border border-hairline overflow-hidden group bg-canvas flex items-center justify-center">
                              <FilePreview file={file} />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    setNewColorFiles(prev => ({
                                      ...prev,
                                      [matchedColorKey]: colorNewList.filter((_, idx) => idx !== index)
                                    }));
                                  }}
                                  className="p-2.5 bg-m-red/90 text-white rounded-full hover:bg-m-red transition-colors duration-200 shadow-md"
                                  title="Remove File"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider bg-emerald-500 text-white rounded">
                                New {index + 1}
                              </span>
                            </div>
                          ))}

                          {/* Color Add Slot */}
                          {(colorExistingList.length + colorNewList.length) < 5 && (
                            <div className="relative aspect-[4/5] rounded-xl border-2 border-dashed border-hairline hover:border-primary transition-colors bg-canvas flex flex-col items-center justify-center group cursor-pointer text-muted hover:text-primary">
                              <input 
                                type="file" 
                                multiple
                                accept="image/*" 
                                onChange={(e) => handleColorFileChange(matchedColorKey, e)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                              />
                              <PlusCircle size={24} className="mb-1.5 transition-colors" />
                              <span className="text-[10px] font-bold tracking-wider uppercase text-center px-1">Upload ({activeColorTab})</span>
                              <span className="text-[8px] opacity-60 mt-0.5">({5 - (colorExistingList.length + colorNewList.length)} slots left)</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()
                )}
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
