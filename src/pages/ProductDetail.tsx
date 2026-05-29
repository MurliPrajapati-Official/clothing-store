import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SEO from '../components/layout/SEO';
import { ArrowLeft, Star, ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw, ChevronRight, Ruler, Plus, Minus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SCHOOLS } from '../constants';
import { formatCurrency, cn } from '../lib/utils';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import ProductCard from '../components/product/ProductCard';
import QuickViewModal from '../components/product/QuickViewModal';
import ProductDetailSkeleton from '../components/product/ProductDetailSkeleton';
import ProductReviews from '../components/product/ProductReviews';
import { Product } from '../types';
import { supabase } from '../lib/supabase';
import { getApiUrl } from '../config';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const parseDescription = (text: string) => {
  if (!text) return null;
  return text.split(/(\*\*[\s\S]*?\*\*|__[\s\S]*?__)/g).map((part, i) => {
    if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
      return (
        <strong key={i} className="font-bold text-ink" style={{ fontWeight: 800, display: 'inline' }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

const splitDescription = (text: string) => {
  if (!text) return { main: '', sub: '' };
  const parts = text.split('#description#');
  if (parts.length >= 3) {
    // Content between first two #description# tags is sub
    const sub = parts[1];
    const main = (parts[0] + parts.slice(2).join('')).trim();
    return { main, sub };
  }
  return { main: text, sub: '' };
};

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (quantity >= 100) {
      setIsBulkMode(true);
    } else {
      setIsBulkMode(false);
    }
  }, [quantity]);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        let apiUrl = getApiUrl();
        if (apiUrl.endsWith('/')) apiUrl = apiUrl.slice(0, -1);

        const response = await fetch(`${apiUrl}/api/products/${slug}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        
        setProduct({
          id: data.id,
          name: data.name,
          slug: data.slug,
          price: Number(data.price),
          originalPrice: data.original_price ? Number(data.original_price) : undefined,
          description: data.description,
          category: data.category,
          schoolId: data.school_id,
          images: data.images || [],
          sizes: data.sizes || [],
          colors: data.colors || [],
          colorImages: data.color_images || data.colorImages || {},
          gender: data.gender,
          grade: data.grade,
          inStock: data.in_stock,
          rating: Number(data.rating) || 0,
          reviewsCount: data.reviews_count || 0,
          isFeatured: data.is_featured
        });

        // Fetch related products dynamically
        const relatedRes = await fetch(`${apiUrl}/api/products/related/${data.id}`);
        if (relatedRes.ok) {
          const relatedData = await relatedRes.json();
          setRelatedProducts(relatedData.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: Number(p.price),
            originalPrice: p.original_price ? Number(p.original_price) : undefined,
            description: p.description,
            category: p.category,
            schoolId: p.school_id,
            images: p.images || [],
            sizes: p.sizes || [],
            gender: p.gender,
            grade: p.grade,
            inStock: p.in_stock,
            rating: Number(p.rating) || 0,
            reviewsCount: p.reviews_count || 0,
            isFeatured: p.is_featured
          })));
        }
      } catch (err: any) {
        console.error("Failed to load product", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  const refreshProduct = () => {
    if (slug) {
      // Small timeout to allow Supabase to propagate changes if needed
      setTimeout(() => {
        const fetchProduct = async () => {
          try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/api/products/${slug}`);
            if (response.ok) {
              const data = await response.json();
              setProduct(prev => prev ? {
                ...prev,
                rating: Number(data.rating) || 0,
                reviewsCount: data.reviews_count || 0,
              } : null);
            }
          } catch (err) {
            console.error("Failed to refresh product stats", err);
          }
        };
        fetchProduct();
      }, 500);
    }
  };

  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center bg-canvas min-h-screen">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto py-20 bg-surface-card rounded-3xl border border-hairline shadow-xl">
            <h1 className="text-4xl font-bold text-ink mb-6">Product Not Found</h1>
            <p className="text-muted mb-10 text-lg">We couldn't find the product you're looking for. It may have been removed or the link is incorrect.</p>
            <Link to="/shop" className="btn-primary inline-flex px-10">Return to Shop</Link>
          </div>
        </div>
      </div>
    );
  }

  const school = SCHOOLS.find(s => s.id === product.schoolId);
  const exists = isInWishlist(product.id);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/account?redirect=checkout');
      return;
    }

    addItem(product, selectedSize, quantity, selectedColor || undefined);
  };

  return (
    <div className="pt-32 pb-24 bg-canvas text-body-text min-h-screen">
      <SEO
        title={`${product.name} | Uniform Trends`}
        description={`Buy ${product.name} at Uniform Trends. High-quality ${product.category} uniform, durable fabric, and perfect fit. Available in various sizes.`}
        ogImage={product.images && product.images.length > 0 ? product.images[0] : undefined}
      >
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": product.images,
            "description": product.description,
            "brand": {
              "@type": "Brand",
              "name": "Uniform Trends"
            },
            "offers": {
              "@type": "Offer",
              "url": `https://uniformtrends.in/product/${product.slug}`,
              "priceCurrency": "INR",
              "price": product.price,
              "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "itemCondition": "https://schema.org/NewCondition"
            },
            "aggregateRating": product.reviewsCount > 0 ? {
              "@type": "AggregateRating",
              "ratingValue": product.rating,
              "reviewCount": product.reviewsCount
            } : undefined
          })}
        </script>
      </SEO>
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12 flex items-center gap-3 text-sm font-medium"
        >
          <Link to="/" className="text-muted hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} className="text-muted/40" />
          <Link to="/shop" className="text-muted hover:text-primary transition-colors">Shop</Link>
          <ChevronRight size={14} className="text-muted/40" />
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="text-muted hover:text-primary transition-colors">{product.category}</Link>
          <ChevronRight size={14} className="text-muted/40" />
          <span className="text-ink truncate max-w-[150px] sm:max-w-none">{product.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4 lg:sticky lg:top-32 self-start"
          >
            {(() => {
              const matchedColorKey = selectedColor ? (
                Object.keys(product.colorImages || {}).find(
                  k => k.trim().toLowerCase() === selectedColor.trim().toLowerCase()
                ) || Object.keys(product.color_images || {}).find(
                  k => k.trim().toLowerCase() === selectedColor.trim().toLowerCase()
                )
              ) : undefined;

              const activeImages = (matchedColorKey && (product.colorImages?.[matchedColorKey] || product.color_images?.[matchedColorKey]) && (product.colorImages?.[matchedColorKey] || product.color_images?.[matchedColorKey])!.length > 0)
                ? (product.colorImages?.[matchedColorKey] || product.color_images?.[matchedColorKey])!
                : product.images;

              return (
                <>
                  <div className="aspect-[4/5] overflow-hidden bg-surface-card rounded-2xl border border-hairline relative group shadow-[0_2px_10px_rgba(0,0,0,0.5)] flex items-center justify-center">
                    {activeImages && activeImages.length > 0 ? (
                      <motion.img
                        key={`${selectedColor}-${activeImage}`}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        src={activeImages[activeImage] || activeImages[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-6xl font-bold text-muted/30 uppercase tracking-widest">{product.name.charAt(0)}</span>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => exists ? removeFromWishlist(product.id) : addToWishlist(product)}
                      className={cn(
                        "absolute top-6 right-6 p-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300",
                        exists ? "bg-m-red text-white" : "bg-surface-card/80 backdrop-blur-md text-ink hover:bg-surface-card hover:text-m-red"
                      )}
                    >
                      <Heart size={20} fill={exists ? "currentColor" : "none"} />
                    </motion.button>
                  </div>
                  
                  {activeImages && activeImages.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                      {activeImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImage(idx)}
                          className={cn(
                            "w-20 h-20 overflow-hidden rounded-xl border-2 transition-all shrink-0",
                            activeImage === idx ? "border-ink shadow-[0_4px_20px_rgba(0,0,0,0.5)]" : "border-transparent opacity-70 hover:opacity-100"
                          )}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </motion.div>

          {/* Info */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col"
          >
            <motion.div variants={fadeUpVariant} className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating) ? "text-warning fill-gold" : "text-gray-300"} />
                ))}
                <span className="text-sm font-semibold text-ink ml-1">{product.rating}</span>
              </div>
              <span className="text-sm font-medium text-muted">({product.reviewsCount} Reviews)</span>
            </motion.div>

            <motion.h1 variants={fadeUpVariant} className="text-2xl sm:text-4xl md:text-5xl font-bold text-ink leading-tight mb-4 tracking-tight break-words">
              {product.name}
            </motion.h1>

            <motion.div variants={fadeUpVariant} className="flex flex-wrap items-center gap-3 mb-8">
              {school && (
                <Link to={`/schools/${school.slug}`} className="flex items-center gap-2 bg-surface-card px-3 py-1.5 rounded-full border border-hairline-strong hover:border-ink transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                  <div className="w-6 h-6 overflow-hidden aspect-square rounded-full">
                    <img src={school.logo} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <span className="text-sm font-semibold text-ink">{school.name}</span>
                </Link>
              )}
              <span className="text-sm font-medium border border-hairline-strong text-ink px-4 py-1.5 rounded-full bg-surface-card shadow-[0_2px_10px_rgba(0,0,0,0.5)]">Grade: {product.grade}</span>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="flex items-baseline gap-4 mb-8">
              <span className="text-3xl font-bold text-ink">{formatCurrency(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted line-through">{formatCurrency(product.originalPrice)}</span>
              )}
            </motion.div>

            {/* We will render the sub description here if it exists, otherwise the main one */}
            {splitDescription(product.description).sub ? (
              <motion.p variants={fadeUpVariant} className="text-body-text text-lg leading-relaxed mb-10 font-light whitespace-pre-line">
                {parseDescription(splitDescription(product.description).sub)}
              </motion.p>
            ) : (
              <motion.p variants={fadeUpVariant} className="text-body-text text-lg leading-relaxed mb-10 font-light whitespace-pre-line">
                {parseDescription(product.description)}
              </motion.p>
            )}

            {/* Size Selector */}
            <motion.div variants={fadeUpVariant} className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-ink">Select Size</h3>
                <button
                  onClick={() => setShowSizeChart(true)}
                  className="flex items-center gap-1.5 text-sm font-medium text-ink hover:text-m-red transition-colors"
                >
                  <Ruler size={16} /> Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map(size => (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "min-w-14 h-12 px-4 rounded-xl font-semibold text-sm transition-all border",
                      selectedSize === size ? "bg-primary border-primary text-on-primary shadow-[0_8px_30px_rgba(255,255,255,0.1)]" : "bg-surface-card border-hairline text-ink hover:border-body-text shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
                    )}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <motion.div variants={fadeUpVariant} className="mb-10 pt-6 border-t border-hairline/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-ink flex items-center gap-2">
                    Select Color {selectedColor && <span className="text-sm font-normal text-muted">— {selectedColor}</span>}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        setActiveImage(0);
                      }}
                      className={cn(
                        "px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border flex items-center gap-2.5",
                        selectedColor === color 
                          ? "bg-primary border-primary text-on-primary shadow-[0_8px_30px_rgba(255,255,255,0.1)]" 
                          : "bg-surface-card border-hairline text-ink hover:border-body-text shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
                      )}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: color.toLowerCase().replace(/\s+/g, '') }} />
                      {color}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Bulk & Institutional Ordering Panel */}
            <motion.div 
              variants={fadeUpVariant} 
              className="mb-8 p-6 rounded-2xl bg-surface-card border border-hairline shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all hover:border-hairline-strong"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl leading-none">📦</span>
                  <div>
                    <h3 className="font-bold text-ink text-base">Bulk & Institutional Orders</h3>
                    <p className="text-xs text-muted">Order 100+ units for exclusive benefits</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextMode = !isBulkMode;
                    setIsBulkMode(nextMode);
                    if (nextMode) {
                      setQuantity(100);
                    } else {
                      setQuantity(1);
                    }
                  }}
                  className={cn(
                    "text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all border",
                    isBulkMode 
                      ? "bg-primary border-primary text-on-primary shadow-lg shadow-primary/10" 
                      : "bg-canvas border-hairline text-ink hover:border-ink"
                  )}
                >
                  {isBulkMode ? 'Bulk Enabled' : 'Enable Bulk'}
                </button>
              </div>

              <AnimatePresence initial={false}>
                {isBulkMode && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-4 pt-2 overflow-hidden"
                  >
                    {/* Preset Packages */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { label: 'Bronze', qty: 100, bonus: '10% Off' },
                        { label: 'Silver', qty: 500, bonus: 'Embroidery' },
                        { label: 'Gold', qty: 1000, bonus: 'Fit Samples' },
                        { label: 'Platinum', qty: 2000, bonus: 'Custom Colors' },
                      ].map((tier) => (
                        <button
                          type="button"
                          key={tier.label}
                          onClick={() => setQuantity(tier.qty)}
                          className={cn(
                            "flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-center",
                            quantity === tier.qty 
                              ? "bg-primary/10 border-primary text-primary" 
                              : "bg-canvas/50 border-hairline text-body-text hover:border-body-text"
                          )}
                        >
                          <span className="text-[10px] uppercase font-bold tracking-widest text-muted">{tier.label}</span>
                          <span className="text-base font-extrabold text-ink my-0.5">{tier.qty}+</span>
                          <span className="text-[9px] font-medium leading-tight text-muted line-clamp-1">{tier.bonus}</span>
                        </button>
                      ))}
                    </div>

                    {/* Pricing info display */}
                    <div className="bg-canvas/80 rounded-xl p-4 border border-hairline-strong space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted">Standard Price:</span>
                        <span className="text-ink line-through">{formatCurrency(product.price)} / unit</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-success font-semibold flex items-center gap-1">
                          🎉 Bulk Discount Price:
                        </span>
                        <span className="text-success font-bold">{formatCurrency(product.price * 0.9)} / unit</span>
                      </div>
                      <hr className="border-hairline-strong my-2" />
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-muted">Est. Subtotal:</span>
                        <div className="text-right">
                          <span className="text-xl font-extrabold text-ink">{formatCurrency(product.price * 0.9 * quantity)}</span>
                          <p className="text-[10px] text-success font-bold mt-0.5">You Save: {formatCurrency(product.price * 0.1 * quantity)}!</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Dynamic Tier Message */}
                    <div className="text-[11px] text-muted flex items-center gap-2 bg-canvas/30 px-3 py-2.5 rounded-lg border border-hairline/30">
                      <span className="text-base">💡</span>
                      <span>
                        {quantity >= 2000 ? 'Platinum Tier: Dedicated institutional manager assigned + custom fabrics.' :
                         quantity >= 1000 ? 'Gold Tier: Free physical fit-samples shipped to your institution.' :
                         quantity >= 500 ? 'Silver Tier: Free high-definition computerized embroidery for your logo.' :
                         'Bronze Tier: Standard 10% volume discount applied.'}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Quantity and CTA */}
            <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row gap-4 mb-12">
              <div className="flex items-center bg-surface-card rounded-xl border border-hairline-strong overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-14 flex items-center justify-center text-muted hover:text-ink hover:bg-surface-elevated transition-colors active:bg-hairline"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-bold text-ink">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-12 h-14 flex items-center justify-center text-muted hover:text-ink hover:bg-surface-elevated transition-colors active:bg-hairline"
                >
                  <Plus size={18} />
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="flex-1 btn-primary py-6 rounded-xl shadow-[0_15px_40px_rgba(255,255,255,0.05)] w-full"
              >
                <ShoppingBag size={20} />
                Add to Cart
              </motion.button>
            </motion.div>

            {/* Main Description (the part outside #description# tags) */}
            {splitDescription(product.description).sub && splitDescription(product.description).main && (
              <motion.div variants={fadeUpVariant} className="mt-4 pt-6 border-t border-hairline-strong">
                <h3 className="text-sm font-bold text-ink uppercase tracking-widest mb-4">Product Details</h3>
                <p className="text-body-text text-base leading-relaxed whitespace-pre-line font-light">
                  {parseDescription(splitDescription(product.description).main)}
                </p>
              </motion.div>
            )}

            {/* Trust Badges */}
            <motion.div variants={fadeUpVariant} className="grid grid-cols-3 gap-4 pt-8 border-t border-hairline-strong">
              <div className="flex flex-col items-center text-center gap-3">
                <ShieldCheck className="text-warning" size={24} />
                <span className="text-xs font-semibold text-ink">Authentic Quality</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <Truck className="text-warning" size={24} />
                <span className="text-xs font-semibold text-ink">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <RefreshCw className="text-warning" size={24} />
                <span className="text-xs font-semibold text-ink">Easy Returns</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Product Reviews Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <ProductReviews productId={product.id} onReviewAdded={refreshProduct} />
        </motion.div>

        {/* Related Products Section (Static from constant for now) */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mt-32 pt-20 border-t border-hairline-strong"
        >
          <div className="flex items-end justify-between mb-12">
            <h2 className="text-3xl font-bold text-ink tracking-tight">You Might Also Like</h2>
            <Link to="/shop" className="text-ink font-semibold hover:text-m-red">View More</Link>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {relatedProducts.length > 0 ? (
              relatedProducts.map(p => (
                <motion.div key={p.id} variants={fadeUpVariant}>
                  <ProductCard product={p} onQuickView={setQuickViewProduct} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted font-light italic">
                No related products found in this category.
              </div>
            )}
          </motion.div>
        </motion.section>
      </div>

      {/* Size Chart Modal */}
      <AnimatePresence>
        {showSizeChart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSizeChart(false)}
              className="fixed inset-0 bg-canvas/90 z-[100] backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl bg-surface-card rounded-2xl shadow-xl z-[110] p-8 md:p-12 overflow-hidden border border-hairline"
            >
              <div className="absolute top-4 right-4 relative">
                <button onClick={() => setShowSizeChart(false)} className="absolute -top-4 -right-4 p-2 bg-surface-elevated rounded-full text-muted hover:text-ink transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                  <X size={20} />
                </button>
              </div>

              {(() => {
                const isAdultProduct = product.sizes.some(size => 
                  ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', 'XXL', 'XXXL'].includes(size.toUpperCase())
                );
                return (
                  <>
                    <h2 className="text-2xl font-bold mb-8 text-ink tracking-tight">
                      {isAdultProduct ? "Adult Sizing Guide" : "Junior Sizing Guide"}
                    </h2>

                    <div className="overflow-x-auto rounded-xl border border-hairline-strong max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-hairline pr-2">
                      {isAdultProduct ? (
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-surface-elevated border-b border-hairline-strong">
                              <th className="p-4 font-semibold text-xs md:text-sm text-ink">Size</th>
                              <th className="p-4 font-semibold text-xs md:text-sm text-ink">Equivalent Fit</th>
                              <th className="p-4 font-semibold text-xs md:text-sm text-ink">Chest (in)</th>
                              <th className="p-4 font-semibold text-xs md:text-sm text-ink">Waist (in)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-hairline-strong">
                            {[
                              { s: 'S', f: "Men's S / Women's M", c: '35" - 37"', w: '30" - 32"' },
                              { s: 'M', f: "Men's M / Women's L", c: '37" - 39"', w: '32" - 34"' },
                              { s: 'L', f: "Men's L / Women's XL", c: '39" - 41"', w: '34" - 36"' },
                              { s: 'XL', f: "Men's XL / Women's XXL", c: '41" - 43"', w: '36" - 38"' },
                              { s: '2XL', f: "Men's XXL / Women's 3XL", c: '43" - 46"', w: '38" - 41"' },
                              { s: '3XL', f: "Men's 3XL / Women's 4XL", c: '46" - 49"', w: '41" - 44"' },
                              { s: '4XL', f: "Men's 4XL / Women's 5XL", c: '49" - 52"', w: '44" - 47"' },
                              { s: '5XL', f: "Men's 5XL / Women's 6XL", c: '52" - 55"', w: '47" - 50"' },
                            ].map((row, i) => (
                              <tr key={i} className="hover:bg-surface-elevated/30 transition-colors">
                                <td className="p-4 font-semibold text-ink text-xs md:text-sm">{row.s}</td>
                                <td className="p-4 text-muted text-xs md:text-sm">{row.f}</td>
                                <td className="p-4 text-muted text-xs md:text-sm">{row.c}</td>
                                <td className="p-4 text-muted text-xs md:text-sm">{row.w}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-surface-elevated border-b border-hairline-strong">
                              <th className="p-4 font-semibold text-xs md:text-sm text-ink">Size</th>
                              <th className="p-4 font-semibold text-xs md:text-sm text-ink">Chest (in)</th>
                              <th className="p-4 font-semibold text-xs md:text-sm text-ink">Length (in)</th>
                              <th className="p-4 font-semibold text-xs md:text-sm text-ink">Age Range</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-hairline-strong">
                            {[
                              { s: '24', c: '26', l: '18', a: '4-5 Yrs' },
                              { s: '26', c: '28', l: '20', a: '6-7 Yrs' },
                              { s: '28', c: '30', l: '22', a: '8-9 Yrs' },
                              { s: '30', c: '32', l: '24', a: '10-11 Yrs' },
                              { s: '32', c: '34', l: '26', a: '12-13 Yrs' },
                            ].map((row, i) => (
                              <tr key={i} className="hover:bg-surface-elevated/30 transition-colors">
                                <td className="p-4 font-semibold text-ink text-xs md:text-sm">{row.s}</td>
                                <td className="p-4 text-muted text-xs md:text-sm">{row.c}</td>
                                <td className="p-4 text-muted text-xs md:text-sm">{row.l}</td>
                                <td className="p-4 text-muted text-xs md:text-sm">{row.a}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </>
                );
              })()}
              <button
                onClick={() => setShowSizeChart(false)}
                className="mt-8 w-full btn-primary py-6 rounded-xl shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
              >
                Close Guide
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
