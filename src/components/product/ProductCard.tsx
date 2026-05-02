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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-surface-card border border-hairline">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="h-full w-full object-cover grayscale brightness-75 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100"
            referrerPolicy="no-referrer"
          />
          
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.originalPrice && (
              <span className="bg-m-red text-white text-[9px] font-black px-2 py-1 uppercase tracking-widest">
                Special
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-primary text-on-primary text-[9px] font-black px-2 py-1 uppercase tracking-widest">
                Popular
              </span>
            )}
          </div>

          <button 
            onClick={toggleWishlist}
            className={
              `absolute top-4 right-4 p-2.5 rounded-full transition-all duration-300
              ${exists ? 'bg-m-red text-white' : 'bg-canvas/40 backdrop-blur-md text-white hover:bg-white hover:text-black border border-white/10'}`
            }
          >
            <Heart size={16} fill={exists ? "currentColor" : "none"} />
          </button>

          <div className="absolute inset-x-6 bottom-6 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button className="w-full bg-white text-black font-black py-4 uppercase tracking-[1.5px] text-[11px] shadow-2xl">
              EXPLORE MODEL
            </button>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-1 mb-2">
            <Star size={10} className="text-white fill-white" />
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{product.rating} / {product.reviewsCount} REVIEWS</span>
          </div>
          <h3 className="font-bold text-white text-lg uppercase tracking-tighter group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-xl font-black text-white italic">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted line-through font-bold">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
