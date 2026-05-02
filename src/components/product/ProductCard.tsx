import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../../types';
import { formatCurrency } from '../../lib/utils';
import { useWishlistStore } from '../../store/wishlistStore';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const exists = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (exists) removeItem(product.id);
    else addItem(product);
  };

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
      }}
      className="group bg-surface-card rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:-translate-y-2 transition-all duration-500 border border-hairline"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-canvas">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-[800ms] group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.originalPrice && (
              <span className="bg-m-red text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                Sale
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-primary text-on-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_2px_10px_rgba(255,255,255,0.1)]">
                Bestseller
              </span>
            )}
          </div>

          <button 
            onClick={toggleWishlist}
            className={
              `absolute top-4 right-4 p-2.5 rounded-full transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.5)]
              ${exists ? 'bg-m-red text-white' : 'bg-surface-card/80 backdrop-blur-md text-ink hover:bg-surface-card hover:text-m-red'}`
            }
          >
            <Heart size={18} fill={exists ? "currentColor" : "none"} />
          </button>

          <div className="absolute inset-x-4 bottom-4 translate-y-8 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button className="w-full bg-primary/90 backdrop-blur-md text-on-primary font-medium py-3 rounded-xl uppercase tracking-wider text-[12px] shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:bg-primary flex items-center justify-center gap-2 transition-colors">
               <ShoppingBag size={14} /> Quick View
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
               {[...Array(5)].map((_, i) => (
                 <Star key={i} size={12} className={i < Math.floor(product.rating) ? "text-warning fill-gold" : "text-gray-300"} />
               ))}
            </div>
            <span className="text-[11px] font-medium text-muted ml-1">({product.reviewsCount})</span>
          </div>
          <h3 className="font-semibold text-ink text-[15px] group-hover:text-m-red transition-colors line-clamp-2 mb-2 leading-tight">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-3">
            <span className="text-lg font-bold text-ink">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
