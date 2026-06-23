import SEO from '../components/layout/SEO';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../lib/utils';
import { useAuth } from '../lib/supabase';
import { useEffect } from 'react';

export default function Wishlist() {
  const { isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/account?redirect=wishlist');
    }
  }, [isLoggedIn, loading, navigate]);

  const handleAddToCart = (product: typeof items[0]) => {
    const defaultSize = product.sizes[0] || 'M';
    addToCart(product, defaultSize, 1);
    setDrawerOpen(true);
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-canvas flex items-center justify-center">
        <SEO title="My Wishlist | Uniform Trends" description="View and manage your saved uniform items." />
        <div className="text-center font-bold text-ink">Loading wishlist...</div>
      </div>
    );
  }


  return (
    <div className="pt-32 pb-24 min-h-screen bg-canvas text-body-text">
      <SEO
        title="My Wishlist | Uniform Trends"
        description="View and manage your saved uniform items. Add them to cart when you're ready to buy."
      />

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-ink mb-4 tracking-tight">My Wishlist</h1>
          <p className="text-lg text-muted font-medium">
            {items.length > 0
              ? `You have ${items.length} item${items.length > 1 ? 's' : ''} saved.`
              : 'Your wishlist is empty.'}
          </p>
        </motion.div>

        {items.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-md mx-auto text-center py-16"
          >
            <div className="w-24 h-24 bg-surface-elevated rounded-none flex items-center justify-center mx-auto mb-8 text-muted border border-hairline">
              <Heart size={40} />
            </div>
            <h2 className="text-2xl font-bold text-ink mb-3">Nothing saved yet</h2>
            <p className="text-muted mb-8 leading-relaxed">
              Browse our collection and tap the heart icon on any product to save it here for later.
            </p>
            <Link to="/shop" className="btn-primary inline-flex">
              Explore Products <ArrowRight size={18} className="ml-2" />
            </Link>
          </motion.div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="bg-white rounded-none overflow-hidden border border-hairline shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <Link to={`/product/${product.slug}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-surface-elevated">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl font-bold text-muted/30 uppercase">{product.name.charAt(0)}</span>
                      </div>
                    )}
                    {product.originalPrice && (
                      <span className="absolute top-3 left-3 bg-[#ef4444] text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-widest rounded-none">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off
                      </span>
                    )}
                  </div>
                </Link>

                <div className="p-5">
                  <Link to={`/product/${product.slug}`}>
                    <h3 className="font-bold text-ink text-base leading-tight mb-2 line-clamp-2 transition-colors hover:underline">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xl font-bold text-ink">{formatCurrency(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted line-through">{formatCurrency(product.originalPrice)}</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 h-11 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs rounded-none flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
                    >
                      <ShoppingBag size={14} /> Add to Cart
                    </button>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="w-11 h-11 border border-hairline rounded-none flex items-center justify-center text-muted hover:text-m-red hover:border-m-red active:scale-95 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
