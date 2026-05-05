import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { PlusCircle, Image as ImageIcon, Loader2, ShieldAlert, LayoutDashboard, Package, Users, Trash2, Edit, ExternalLink, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Product } from '../types';
import { formatCurrency, cn } from '../lib/utils';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'stats' | 'add' | 'manage'>('stats');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
  const [stats, setStats] = useState({ totalProducts: 0, totalUsers: 0 });
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/stats`);
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
      const res = await fetch(`${apiUrl}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccessMsg('Product deleted successfully');
        fetchProducts();
        fetchStats();
      }
    } catch (err) {
      setErrorMsg('Failed to delete product');
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      
      if (!session) {
        setIsAdmin(false);
        setTimeout(() => navigate('/account'), 3000);
      } else if (adminEmail && session.user.email !== adminEmail) {
        setIsAdmin(false);
        setTimeout(() => navigate('/'), 3000);
      } else {
        setIsAdmin(true);
        fetchStats();
        fetchProducts();
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const formData = new FormData(e.currentTarget);
    
    // We are expecting the backend on localhost:5000 during dev
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: formData, // Automatically handles multipart/form-data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add product');
      }

      setSuccessMsg('Product added successfully!');
      (e.target as HTMLFormElement).reset(); // Clear the form
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-canvas text-body-text">
      <Helmet>
        <title>Admin Panel | Uniform Trends</title>
      </Helmet>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-ink tracking-tight">Admin Control Panel</h1>
            <p className="text-muted font-light">Manage your store products and view insights.</p>
          </div>
          
          <div className="flex bg-surface-card p-1 rounded-2xl border border-hairline shadow-sm">
            <button 
              onClick={() => setActiveTab('stats')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                activeTab === 'stats' ? "bg-primary text-on-primary shadow-md" : "text-muted hover:text-ink"
              )}
            >
              <LayoutDashboard size={18} /> Overview
            </button>
            <button 
              onClick={() => setActiveTab('manage')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                activeTab === 'manage' ? "bg-primary text-on-primary shadow-md" : "text-muted hover:text-ink"
              )}
            >
              <Package size={18} /> Manage
            </button>
            <button 
              onClick={() => setActiveTab('add')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                activeTab === 'add' ? "bg-primary text-on-primary shadow-md" : "text-muted hover:text-ink"
              )}
            >
              <PlusCircle size={18} /> Add New
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
              <p className="text-sm font-medium text-muted mb-1">Store Status</p>
              <h3 className="text-xl font-bold text-success">Online & Live</h3>
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
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">Product</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">Category</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">Price</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    {isLoading ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-muted">Loading inventory...</td></tr>
                    ) : products.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-muted">No products found in inventory.</td></tr>
                    ) : products.map(product => (
                      <tr key={product.id} className="hover:bg-canvas/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-canvas rounded-lg border border-hairline flex items-center justify-center shrink-0 overflow-hidden">
                              {product.images && product.images.length > 0 ? (
                                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="font-bold text-muted/30">{product.name.charAt(0)}</span>
                              )}
                            </div>
                            <div className="max-w-[200px]">
                              <p className="font-bold text-ink line-clamp-1">{product.name}</p>
                              <p className="text-xs text-muted font-mono">{product.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-surface-elevated text-ink text-xs font-bold rounded-full">{product.category}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-ink">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Link to={`/product/${product.slug}`} target="_blank" className="p-2 text-muted hover:text-primary transition-colors">
                              <ExternalLink size={18} />
                            </Link>
                            <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-muted hover:text-m-red transition-colors">
                              <Trash2 size={18} />
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

        {activeTab === 'add' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-card p-8 md:p-10 rounded-3xl border border-hairline shadow-sm"
          >
            {/* The existing form logic */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <PlusCircle size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-ink">Add New Product</h1>
                <p className="text-muted font-light">Add new uniforms to your catalog and cloud storage.</p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl">
                {errorMsg}
              </div>
            )
            /* ... rest of the form ... */}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form fields same as before but inside the Add tab */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-ink mb-2">Product Name</label>
                  <input name="name" type="text" required className="w-full px-4 py-3 rounded-xl bg-canvas border border-hairline focus:border-primary outline-none transition-colors" placeholder="e.g. Classic Boys Polo" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink mb-2">Slug (URL friendly)</label>
                  <input name="slug" type="text" required className="w-full px-4 py-3 rounded-xl bg-canvas border border-hairline focus:border-primary outline-none transition-colors" placeholder="e.g. classic-boys-polo" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink mb-2">Price (INR)</label>
                  <input name="price" type="number" required className="w-full px-4 py-3 rounded-xl bg-canvas border border-hairline focus:border-primary outline-none transition-colors" placeholder="650" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink mb-2">Category</label>
                  <select name="category" required className="w-full px-4 py-3 rounded-xl bg-canvas border border-hairline focus:border-primary outline-none transition-colors">
                    <option value="School">School</option>
                    <option value="College">College</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Hospital">Hospital</option>
                    <option value="Hotels">Hotels</option>
                    <option value="Factory">Factory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-2">Description</label>
                <textarea name="description" required rows={4} className="w-full px-4 py-3 rounded-xl bg-canvas border border-hairline focus:border-primary outline-none transition-colors resize-none" placeholder="Detailed product description..."></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                  <label className="block text-sm font-bold text-ink mb-2">Sizes (Comma separated)</label>
                  <input name="sizes" type="text" className="w-full px-4 py-3 rounded-xl bg-canvas border border-hairline focus:border-primary outline-none transition-colors" placeholder="S, M, L, XL" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink mb-2">Gender</label>
                  <select name="gender" className="w-full px-4 py-3 rounded-xl bg-canvas border border-hairline focus:border-primary outline-none transition-colors">
                    <option value="unisex">Unisex</option>
                    <option value="boys">Boys</option>
                    <option value="girls">Girls</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-ink mb-2">Product Image</label>
                <div className="relative w-full h-32 rounded-xl border-2 border-dashed border-hairline hover:border-primary transition-colors flex items-center justify-center bg-canvas group cursor-pointer overflow-hidden">
                  <input type="file" name="image" accept="image/*" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="flex flex-col items-center text-muted group-hover:text-primary transition-colors pointer-events-none">
                    <ImageIcon size={32} className="mb-2" />
                    <span className="text-sm font-medium">Click to upload image</span>
                  </div>
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
                    Processing Product...
                  </>
                ) : (
                  'Save Product to Store'
                )}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
