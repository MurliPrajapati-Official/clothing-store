import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Heart, Star, Ruler, Plus, Minus } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency, cn } from '../../lib/utils';
import { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

const parseDescription = (text: string) => {
  if (!text) return null;
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-ink">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const splitDescription = (text: string) => {
  if (!text) return { main: '', sub: '' };
  const parts = text.split('#description#');
  if (parts.length >= 3) {
    const sub = parts[1];
    const main = (parts[0] + parts.slice(2).join('')).trim();
    return { main, sub };
  }
  return { main: text, sub: '' };
};

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  if (!product) return null;

  const exists = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addItem(product, selectedSize, quantity);
    onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-canvas/80 backdrop-blur-md z-[120]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl bg-surface-card rounded-3xl shadow-2xl z-[130] overflow-hidden border border-hairline flex flex-col md:flex-row max-h-[90vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-surface-elevated/80 backdrop-blur-md rounded-full text-ink hover:text-m-red transition-colors z-10 shadow-lg"
            >
              <X size={20} />
            </button>

            {/* Gallery Section */}
            <div className="w-full md:w-1/2 bg-canvas aspect-[4/5] md:aspect-auto overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-hairline">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-6xl font-bold text-muted/30 uppercase tracking-widest">{product.name.charAt(0)}</span>
              )}
            </div>

            {/* Info Section */}
            <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating) ? "text-warning fill-gold" : "text-gray-300"} />
                ))}
                <span className="text-xs font-bold text-ink ml-1">{product.rating}</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-ink mb-4 leading-tight tracking-tight">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-2xl font-bold text-ink">{formatCurrency(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted line-through">{formatCurrency(product.originalPrice)}</span>
                )}
              </div>

              <p className="text-body-text text-sm leading-relaxed mb-8 line-clamp-3 whitespace-pre-line">
                {parseDescription(splitDescription(product.description).sub || product.description)}
              </p>

              {/* Size Selector */}
              <div className="mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Select Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "h-10 px-4 rounded-lg font-bold text-xs transition-all border",
                        selectedSize === size
                          ? "bg-primary border-primary text-on-primary shadow-lg"
                          : "bg-canvas border-hairline text-ink hover:border-ink"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-canvas rounded-xl border border-hairline-strong p-1">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-muted hover:text-ink transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold text-ink">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-10 h-10 flex items-center justify-center text-muted hover:text-ink transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => exists ? removeFromWishlist(product.id) : addToWishlist(product)}
                    className={cn(
                      "p-3.5 rounded-xl border transition-all",
                      exists ? "bg-m-red border-m-red text-white" : "border-hairline text-ink hover:text-m-red"
                    )}
                  >
                    <Heart size={20} fill={exists ? "currentColor" : "none"} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full btn-primary h-14 rounded-xl flex items-center justify-center gap-2 text-lg"
                >
                  <ShoppingBag size={20} />
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
