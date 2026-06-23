import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../../types';
import { formatCurrency, cn } from '../../lib/utils';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuth } from '../../lib/supabase';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  compact?: boolean;
}

export default function ProductCard({ product, onQuickView, compact }: ProductCardProps) {
  const { isLoggedIn } = useAuth();
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const exists = isInWishlist(product.id);
  const [isHovered, setIsHovered] = useState(false);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (exists) removeItem(product.id);
    else addItem(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  // Check if product has secondary image for creative hover swap
  const hasSecondaryImage = product.images && product.images.length > 1;

  return (
    <div
      className="relative group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Creative Background Offset Panel (Midnight Navy) */}
      {!compact && (
        <div className="absolute inset-0 bg-sand translate-x-1.5 translate-y-1.5 transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0 z-0 rounded-none pointer-events-none" />
      )}

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 30, scale: 0.95 },
          visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
        }}
        initial={false}
        animate="visible"
        className={cn(
          "bg-white border border-hairline h-full flex flex-col relative z-10 transition-transform duration-500",
          compact 
            ? "rounded-none" 
            : "rounded-none group-hover:-translate-x-1 group-hover:-translate-y-1"
        )}
      >
        <Link to={`/product/${product.slug}`} className="flex flex-col h-full">
          {/* Creative Image Gallery Container - Portrait Aspect Ratio aspect-[3/4] */}
          <div className="relative aspect-[3/4] overflow-hidden bg-surface-soft border-b border-hairline">
            {product.images && product.images.length > 0 ? (
              <>
                {/* Primary Image */}
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className={cn(
                    "h-full w-full object-cover transition-all duration-700",
                    hasSecondaryImage && isHovered ? "opacity-0 scale-105" : "opacity-100 scale-100"
                  )}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                {/* Secondary Hover Image Flip */}
                {hasSecondaryImage && (
                  <img
                    src={product.images[1]}
                    alt={product.name}
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover transition-all duration-700",
                      isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    )}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                )}
              </>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-surface-soft">
                 <span className="text-3xl font-extrabold text-[#0f172a]/20 uppercase tracking-widest">{product.name.charAt(0)}</span>
              </div>
            )}

            {/* Badges - Minimal Square Tags */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
              {product.originalPrice && (
                <span className="bg-[#ef4444] text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-widest shadow-sm rounded-none">
                  Sale
                </span>
              )}
              {product.isFeatured && (
                <span className="bg-[#0f172a] text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-widest shadow-sm rounded-none">
                  Bestseller
                </span>
              )}
            </div>

            {/* Wishlist Button - Sharp Minimal */}
            {isLoggedIn && (
              <button
                onClick={toggleWishlist}
                className={cn(
                  "absolute top-3 right-3 w-8 h-8 rounded-none transition-all duration-300 shadow-sm z-20 flex items-center justify-center border border-hairline",
                  exists 
                    ? 'bg-[#ef4444] text-white border-[#ef4444]' 
                    : 'bg-white/90 backdrop-blur-md text-[#0f172a] hover:bg-[#0f172a] hover:text-white',
                  compact && "w-7 h-7 top-2 right-2"
                )}
              >
                <Heart size={compact ? 12 : 14} fill={exists ? "currentColor" : "none"} />
              </button>
            )}
          </div>

          {/* Info Section - Clean Grid Layout */}
          <div className={cn("p-4 flex-1 flex flex-col text-left justify-between", compact && "p-3")}>
            <div>
              {/* Rating Line */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <Star size={11} className="text-warning fill-warning" />
                  <span className="text-[10px] font-bold text-ink">{product.rating}</span>
                  <span className="text-[10px] text-muted">({product.reviewsCount})</span>
                </div>
                {product.sizes && product.sizes.length > 0 && (
                  <span className="text-[9px] text-muted uppercase font-bold tracking-wider">
                    {product.sizes.length} Sizes
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className={cn("font-extrabold text-[#0f172a] text-sm hover:underline transition-all line-clamp-2 leading-tight tracking-tight break-words mb-2", compact && "text-xs mb-1")}>
                {product.name}
              </h3>
            </div>

            {/* Pricing Panel */}
            <div className="flex items-baseline gap-2 pt-2 border-t border-hairline/50">
              <span className={cn("text-base font-black text-[#0f172a]", compact && "text-sm")}>
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className={cn("text-xs text-muted line-through", compact && "text-[10px]")}>
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Quick View Button - Clean Minimal Overlay */}
        {!compact && (
          <div className="absolute inset-x-3 bottom-[72px] translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-30 pointer-events-none group-hover:pointer-events-auto">
            <button 
              onClick={handleQuickView}
              className="w-full bg-[#0f172a] hover:bg-[#2ecc71] text-white font-extrabold py-2.5 rounded-none uppercase tracking-widest text-[9px] shadow-lg flex items-center justify-center gap-2 transition-all border border-transparent"
            >
              <ShoppingBag size={12} /> Quick View
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
