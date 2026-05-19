import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../../types';
import { formatCurrency, cn } from '../../lib/utils';
import { useWishlistStore } from '../../store/wishlistStore';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  compact?: boolean;
}

export default function ProductCard({ product, onQuickView, compact }: ProductCardProps) {
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const exists = isInWishlist(product.id);

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

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
      }}
      initial={false}
      animate="visible"
      className={cn(
        "group bg-surface-card rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-hairline h-full flex flex-col relative",
        compact 
          ? "rounded-xl shadow-[0_1px_5px_rgba(0,0,0,0.3)]" 
          : "hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:-translate-y-2 transition-all duration-500"
      )}
    >
      <Link to={`/product/${product.slug}`} className="flex flex-col h-full">
        <div className="relative aspect-[4/5] overflow-hidden bg-canvas">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-[800ms] group-hover:scale-110"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-surface-card transition-transform duration-[800ms] group-hover:scale-110 border-b border-hairline">
               <span className="text-4xl font-bold text-muted/30 uppercase tracking-widest">{product.name.charAt(0)}</span>
            </div>
          )}

          <div className={cn("absolute top-4 left-4 flex flex-col gap-2", compact && "top-2 left-2 gap-1")}>
            {product.originalPrice && (
              <span className={cn("bg-m-red text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_2px_10px_rgba(0,0,0,0.5)]", compact && "text-[8px] px-2 py-0.5")}>
                Sale
              </span>
            )}
            {product.isFeatured && (
              <span className={cn("bg-primary text-on-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_2px_10px_rgba(255,255,255,0.1)]", compact && "text-[8px] px-2 py-0.5")}>
                Bestseller
              </span>
            )}
          </div>

          <button
            onClick={toggleWishlist}
            className={cn(
              "absolute top-4 right-4 w-9 h-9 rounded-full transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.5)] z-20 flex items-center justify-center",
              exists ? 'bg-m-red text-white' : 'bg-surface-card/80 backdrop-blur-md text-ink hover:bg-surface-card hover:text-m-red',
              compact && "top-2 right-2 w-7 h-7"
            )}
          >
            <Heart size={compact ? 12 : 16} fill={exists ? "currentColor" : "none"} />
          </button>
        </div>

        <div className={cn("p-5 flex-1 flex flex-col text-left", compact && "p-3")}>
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={compact ? 10 : 12} className={i < Math.floor(product.rating) ? "text-warning fill-gold" : "text-gray-300"} />
              ))}
            </div>
            <span className={cn("text-[11px] font-medium text-muted ml-1", compact && "text-[9px]")}>({product.reviewsCount})</span>
          </div>
          <h3 className={cn("font-bold text-ink text-[16px] group-hover:text-m-red transition-colors line-clamp-2 mb-2 leading-tight tracking-tight break-words", compact && "text-[13px] mb-1")}>
            {product.name}
          </h3>
          <div className="flex items-baseline gap-3 mt-auto pt-2">
            <span className={cn("text-xl font-bold text-ink", compact && "text-base")}>
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className={cn("text-sm text-muted line-through", compact && "text-[11px]")}>
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Quick View Button - Hide on mobile/compact */}
      {!compact && (
        <div className="absolute inset-x-4 top-[calc(50%-28px)] md:top-auto md:bottom-[130px] translate-y-8 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-30 pointer-events-none group-hover:pointer-events-auto">
          <button 
            onClick={handleQuickView}
            className="w-full bg-surface-card/95 backdrop-blur-md text-ink font-bold py-3 rounded-xl uppercase tracking-widest text-[11px] shadow-2xl hover:bg-primary hover:text-on-primary flex items-center justify-center gap-2 transition-all border border-hairline"
          >
            <ShoppingBag size={14} /> Quick View
          </button>
        </div>
      )}
    </motion.div>
  );
}
