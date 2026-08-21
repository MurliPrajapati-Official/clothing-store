import SEO from '../components/layout/SEO';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../lib/utils';
import { STORE_NAME } from '../constants';

export default function Wishlist() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);

  const handleAddToCart = (product: typeof items[0]) => {
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors?.[0]?.name;
    addToCart(product, defaultSize, 1, defaultColor);
    setDrawerOpen(true);
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-canvas text-body-text">
      <SEO
        title={`My Wishlist | ${STORE_NAME}`}
        description="View and manage your saved clothing items."
      />

      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-muted block">Saved Pieces</span>
          <h1 className="text-3xl sm:text-4xl font-black text-ink uppercase tracking-tight">My Wishlist</h1>
          <p className="text-xs text-muted font-medium">
            {items.length > 0
              ? `You have ${items.length} item${items.length > 1 ? 's' : ''} saved in your wardrobe wishlist.`
              : 'Your wishlist is currently empty.'}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 bg-white border border-hairline p-8">
            <div className="w-16 h-16 bg-surface-soft flex items-center justify-center mx-auto mb-4 text-muted border border-hairline">
              <Heart size={28} />
            </div>
            <h2 className="text-xl font-bold text-ink uppercase tracking-tight mb-2">No Saved Items</h2>
            <p className="text-xs text-muted mb-6 leading-relaxed">
              Explore our contemporary collection and tap the heart icon on any piece to save it here for later.
            </p>
            <Link to="/shop" className="btn-primary py-3.5 px-8 text-xs inline-flex items-center gap-2">
              <span>Explore Collection</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-hairline flex flex-col justify-between group hover:border-ink/40 transition-colors"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-surface-soft border-b border-hairline">
                  <Link to={`/product/${product.slug}`} className="block w-full h-full">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </Link>

                  <button
                    onClick={() => removeItem(product.id)}
                    aria-label="Remove from wishlist"
                    className="absolute top-3 right-3 p-2 bg-white border border-hairline text-muted hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted block mb-1">{product.category}</span>
                    <Link to={`/product/${product.slug}`}>
                      <h3 className="font-bold text-sm text-ink hover:underline line-clamp-1 mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-black text-sm text-ink">{formatCurrency(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-muted line-through">{formatCurrency(product.originalPrice)}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full btn-primary py-3 text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={14} />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
