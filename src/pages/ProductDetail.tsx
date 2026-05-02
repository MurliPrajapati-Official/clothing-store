import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw, ChevronRight, Ruler, Plus, Minus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS, SCHOOLS } from '../constants';
import { formatCurrency, cn } from '../lib/utils';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import ProductCard from '../components/product/ProductCard';

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

export default function ProductDetail() {
  const { slug } = useParams();
  const product = PRODUCTS.find((p) => p.slug === slug);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  if (!product) return <div className="pt-32 text-center font-bold text-3xl text-ink bg-canvas min-h-screen">Product Not Found</div>;

  const school = SCHOOLS.find(s => s.id === product.schoolId);
  const exists = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addItem(product, selectedSize, quantity);
  };

  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id && p.schoolId === product.schoolId).slice(0, 4);

  return (
    <div className="pt-32 pb-24 bg-canvas text-body-text min-h-screen">
      <Helmet>
        <title>{product.name} | UniformKart</title>
        <meta name="description" content={product.description} />
      </Helmet>
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-sm font-medium text-muted mb-12"
        >
          <Link to="/" className="hover:text-ink transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop" className="hover:text-ink transition-colors">Shop</Link>
          <ChevronRight size={14} />
          <span className="text-ink">{product.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Gallery */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <div className="aspect-[4/5] overflow-hidden bg-surface-card rounded-2xl border border-hairline relative group shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  src={product.images[activeImage]} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
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
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
              {product.images.map((img, idx) => (
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

            <motion.h1 variants={fadeUpVariant} className="text-4xl md:text-5xl font-bold text-ink leading-tight mb-4 tracking-tight">
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

            <motion.p variants={fadeUpVariant} className="text-body-text text-lg leading-relaxed mb-10 font-light">
              {product.description}
            </motion.p>

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

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mt-32 pt-20 border-t border-hairline-strong"
          >
             <div className="flex items-end justify-between mb-12">
               <h2 className="text-3xl font-bold text-ink tracking-tight">You Might Also Like</h2>
               <Link to={`/schools/${school?.slug}`} className="text-ink font-semibold hover:text-m-red">View More</Link>
             </div>
             <motion.div 
               variants={staggerContainer}
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true }}
               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
             >
              {relatedProducts.map(p => (
                <motion.div key={p.id} variants={fadeUpVariant}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}
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
              
              <h2 className="text-2xl font-bold mb-8 text-ink tracking-tight">Size Guide</h2>
              
              <div className="overflow-x-auto rounded-xl border border-hairline-strong">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-surface-elevated border-b border-hairline-strong">
                          <th className="p-4 font-semibold text-sm text-ink">Size</th>
                          <th className="p-4 font-semibold text-sm text-ink">Chest (inches)</th>
                          <th className="p-4 font-semibold text-sm text-ink">Length (inches)</th>
                          <th className="p-4 font-semibold text-sm text-ink">Recommended Age</th>
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
                         <tr key={i} className="hover:bg-surface-elevated transition-colors">
                           <td className="p-4 font-semibold text-ink">{row.s}</td>
                           <td className="p-4 text-body-text">{row.c}</td>
                           <td className="p-4 text-body-text">{row.l}</td>
                           <td className="p-4 text-body-text">{row.a}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
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
    </div>
  );
}
