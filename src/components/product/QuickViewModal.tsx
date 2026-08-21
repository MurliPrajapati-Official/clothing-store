import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Heart, Star, Check, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency, cn } from '../../lib/utils';
import { useState, useEffect } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { Link } from 'react-router-dom';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors?.[0]?.name || '');
      setActiveImage(product.images[0] || '');
      setQuantity(1);
      setAddedNotice(false);
    }
  }, [product?.id]);

  const exists = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    addItem(product, selectedSize, quantity, selectedColor || undefined);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
      setDrawerOpen(true);
    }, 600);
  };

  const toggleWishlist = () => {
    if (!product) return;
    if (exists) removeFromWishlist(product.id);
    else addToWishlist(product);
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-3xl bg-white shadow-2xl z-[130] overflow-hidden border border-hairline flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-2 bg-white border border-hairline text-ink hover:bg-neutral-100 transition-colors z-20"
            >
              <X size={18} />
            </button>

            {/* Left: Gallery */}
            <div className="md:w-1/2 bg-surface-soft p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-hairline">
              <div className="relative aspect-[3/4] overflow-hidden bg-white border border-hairline mb-4">
                <img
                  src={activeImage || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={cn(
                        "w-14 h-16 shrink-0 border overflow-hidden transition-all",
                        activeImage === img ? "border-ink scale-95" : "border-hairline opacity-70 hover:opacity-100"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Options */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between text-xs text-muted font-bold uppercase tracking-wider mb-2">
                  <span>{product.category}</span>
                  <div className="flex items-center gap-1 text-ink">
                    <Star size={12} className="fill-ink text-ink" />
                    <span>{product.rating.toFixed(1)} ({product.reviewsCount})</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-ink mb-2">{product.name}</h2>

                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl font-black text-ink">{formatCurrency(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted line-through">{formatCurrency(product.originalPrice)}</span>
                  )}
                </div>

                <p className="text-xs text-muted leading-relaxed mb-6 line-clamp-3">
                  {product.description}
                </p>

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-5">
                    <label className="block text-xs font-bold uppercase tracking-widest text-ink mb-2">
                      Color: <span className="font-normal text-muted">{selectedColor}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          title={c.name}
                          className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center transition-all border",
                            selectedColor === c.name ? "ring-2 ring-ink ring-offset-2 scale-110" : "border-black/20 hover:scale-105"
                          )}
                          style={{ backgroundColor: c.hex }}
                        >
                          {selectedColor === c.name && (
                            <Check size={12} className={c.hex === '#FFFFFF' || c.hex === '#F7F6F2' ? 'text-black' : 'text-white'} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-ink">Select Size</label>
                    <Link to="/size-guide" target="_blank" className="text-[11px] text-muted underline hover:text-ink">
                      Size Guide
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "min-w-[40px] h-10 px-3 text-xs font-bold uppercase transition-all border",
                          selectedSize === size
                            ? "bg-ink text-white border-ink"
                            : "bg-white text-ink border-hairline hover:border-ink"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-ink">Quantity</span>
                  <div className="flex items-center border border-hairline">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center hover:bg-surface-elevated text-ink"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-ink">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-surface-elevated text-ink"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-hairline">
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={16} />
                    <span>{addedNotice ? 'Added to Bag!' : 'Add to Bag'}</span>
                  </button>

                  <button
                    onClick={toggleWishlist}
                    aria-label="Toggle Wishlist"
                    className={cn(
                      "p-3 border border-hairline transition-colors flex items-center justify-center",
                      exists ? "text-ink bg-surface-elevated" : "text-muted hover:text-ink hover:bg-surface-elevated"
                    )}
                  >
                    <Heart size={18} className={exists ? "fill-ink text-ink" : ""} />
                  </button>
                </div>

                <Link
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="block text-center text-xs font-bold uppercase tracking-wider text-muted hover:text-ink transition-colors py-1"
                >
                  View Full Product Details →
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
