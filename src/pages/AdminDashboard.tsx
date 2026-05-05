import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { PlusCircle, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
    <div className="pt-32 pb-24 min-h-screen bg-canvas text-body-text container mx-auto px-4 max-w-4xl">
      <Helmet>
        <title>Admin Dashboard | Uniform Trends</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-card p-8 md:p-10 rounded-3xl border border-hairline shadow-sm"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <PlusCircle size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-ink">Add New Product</h1>
            <p className="text-muted font-light">Add uniforms to your Supabase database and storage.</p>
          </div>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-600 rounded-xl">
            {successMsg}
          </div>
        )}
        
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
                Saving to Database...
              </>
            ) : (
              'Save Product to Store'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
