import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, Star } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency, cn } from '../../lib/utils';
import { useWishlistStore } from '../../store/wishlistStore';

export interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onQuickView?: (product: Product) => void;
  compact?: boolean;
}

export default function ProductCard({ product, onQuickView, compact }: ProductCardProps) {
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const exists = isInWishlist(product.id);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorImg, setSelectedColorImg] = useState<string | null>(null);

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

  const hasSecondaryImage = product.images && product.images.length > 1;
  const displayImage = selectedColorImg || (hasSecondaryImage && isHovered ? product.images[1] : product.images[0]);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="relative group h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setSelectedColorImg(null);
      }}
    >
      <div className="bg-white border border-hairline h-full flex flex-col transition-all duration-300 group-hover:border-ink/40 group-hover:shadow-lg">
        {/* Image Container with 3:4 portrait aspect ratio */}
        <div className="relative aspect-[3/4] overflow-hidden bg-surface-soft border-b border-hairline">
          <Link to={`/product/${product.slug}`} className="block w-full h-full">
            <img
              src={displayImage}
              alt={product.name}
              loading="lazy"
              className={cn(
                "h-full w-full object-cover transition-transform duration-700 ease-out",
                isHovered && "scale-105"
              )}
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {discountPercent > 0 && (
              <span className="bg-ink text-white text-[10px] font-black uppercase px-2 py-0.5 tracking-wider">
                -{discountPercent}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="bg-white text-ink border border-ink text-[10px] font-bold uppercase px-2 py-0.5 tracking-wider">
                New
              </span>
            )}
            {product.isBestSeller && !product.isNewArrival && (
              <span className="bg-sand text-ink text-[10px] font-bold uppercase px-2 py-0.5 tracking-wider">
                Bestseller
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            aria-label={exists ? 'Remove from wishlist' : 'Add to wishlist'}
            className={cn(
              "absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm border border-hairline transition-all duration-200 z-10 hover:scale-110",
              exists ? "text-ink fill-ink" : "text-muted hover:text-ink"
            )}
          >
            <Heart size={16} className={exists ? "fill-ink text-ink" : ""} />
          </button>

          {/* Quick View Button */}
          <div className="absolute inset-x-3 bottom-3 z-10 transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
            <button
              onClick={handleQuickView}
              className="w-full bg-white/95 backdrop-blur-md text-ink text-xs font-bold uppercase py-2.5 px-4 tracking-wider border border-hairline hover:bg-ink hover:text-white transition-colors flex items-center justify-center gap-1.5 shadow-md"
            >
              <Eye size={14} />
              <span>Quick View</span>
            </button>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4 flex flex-col flex-grow justify-between bg-white">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between mb-1 text-[11px] text-muted uppercase tracking-wider font-semibold">
              <span>{product.category}</span>
              <div className="flex items-center gap-1 text-ink font-bold">
                <Star size={11} className="fill-ink text-ink" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Product Title */}
            <Link to={`/product/${product.slug}`}>
              <h3 className="font-bold text-sm text-ink line-clamp-1 group-hover:text-neutral-600 transition-colors">
                {product.name}
              </h3>
            </Link>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2.5">
                {product.colors.slice(0, 4).map((c, i) => (
                  <button
                    key={i}
                    title={c.name}
                    aria-label={`Select color ${c.name}`}
                    style={{ backgroundColor: c.hex }}
                    className="w-3.5 h-3.5 rounded-full border border-black/20 hover:scale-125 transition-transform"
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-[10px] text-muted font-medium">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="mt-3 pt-3 border-t border-hairline flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-black text-sm text-ink">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-muted line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            <span className="text-[10px] uppercase font-bold tracking-widest text-muted">
              {product.sizes.length} Sizes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
