import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Star, ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw, ChevronRight, Ruler, Plus, Minus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS, SCHOOLS } from '../constants';
import { formatCurrency, cn } from '../lib/utils';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import ProductCard from '../components/product/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = PRODUCTS.find((p) => p.slug === slug);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  if (!product) return <div className="pt-[140px] text-center font-bold text-[32px] text-white uppercase bg-canvas min-h-screen">UNIT NOT FOUND.</div>;

  const school = SCHOOLS.find(s => s.id === product.schoolId);
  const exists = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('PLEASE SELECT A SPEC (SIZE)');
      return;
    }
    addItem(product, selectedSize, quantity);
  };

  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id && p.schoolId === product.schoolId).slice(0, 4);

  return (
    <div className="pt-[140px] pb-[96px] bg-canvas text-body min-h-[100vh]">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[1.5px] text-muted mb-16">
          <Link to="/" className="hover:text-white transition-colors">HOME</Link>
          <ChevronRight size={14} className="text-hairline-strong" />
          <Link to="/shop" className="hover:text-white transition-colors">SHOP</Link>
          <ChevronRight size={14} className="text-hairline-strong" />
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
          {/* Gallery */}
          <div className="space-y-6">
            <div className="aspect-[4/5] overflow-hidden bg-surface-card border border-hairline relative group">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={product.images[activeImage]} 
                  alt={product.name}
                  className="w-full h-full object-cover grayscale brightness-75"
                  referrerPolicy="no-referrer"
                />
              <button 
                onClick={() => exists ? removeFromWishlist(product.id) : addToWishlist(product)}
                className={cn(
                  "absolute top-6 right-6 p-4 transition-all duration-300",
                  exists ? "bg-m-red text-white" : "bg-canvas/80 backdrop-blur-md text-white border border-white/10 hover:bg-white hover:text-black"
                )}
              >
                <Heart size={20} fill={exists ? "currentColor" : "none"} />
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "w-24 h-24 overflow-hidden border transition-all shrink-0",
                    activeImage === idx ? "border-white" : "border-hairline opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover grayscale brightness-75" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-surface-card border border-hairline px-3 py-1">
                <Star size={12} className="text-white fill-white" />
                <span className="text-[12px] font-bold text-white uppercase tracking-[1.5px]">{product.rating}</span>
              </div>
              <span className="text-[12px] font-bold text-muted uppercase tracking-[1.5px]">{product.reviewsCount} REVIEWS</span>
            </div>

            <h1 className="text-[40px] md:text-[56px] font-bold text-white leading-[1.0] mb-6 tracking-tight uppercase">
              {product.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-10">
              {school && (
                <Link to={`/schools/${school.slug}`} className="flex items-center gap-3 bg-surface-card p-1 pr-6 border border-hairline hover:border-white transition-colors">
                  <div className="w-8 h-8 overflow-hidden bg-canvas">
                    <img src={school.logo} alt="" className="w-full h-full object-cover grayscale brightness-50" referrerPolicy="no-referrer" />
                  </div>
                  <span className="text-[12px] font-bold uppercase tracking-[1.5px] text-white">{school.name}</span>
                </Link>
              )}
              <span className="text-[12px] font-bold uppercase tracking-[1.5px] border border-white text-white px-4 py-2 bg-white/5">TYPE: {product.grade}</span>
            </div>

            <div className="flex items-baseline gap-6 mb-12">
              <span className="text-[32px] md:text-[40px] font-black text-white italic leading-none">{formatCurrency(product.price)}</span>
              {product.originalPrice && (
                <span className="text-[18px] text-muted line-through font-bold leading-none">{formatCurrency(product.originalPrice)}</span>
              )}
            </div>

            <p className="text-body leading-[1.6] mb-12 font-light text-[16px]">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-12">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="font-bold text-[14px] uppercase tracking-[1.5px] text-white">SELECT SPECIFICATION.</h3>
                 <button 
                  onClick={() => setShowSizeChart(true)}
                  className="flex items-center gap-2 text-[12px] font-bold text-white uppercase tracking-[1.5px] border-b border-white pb-1 hover:text-muted hover:border-muted transition-colors"
                 >
                   <Ruler size={14} /> DIMENSIONS
                 </button>
               </div>
               <div className="flex flex-wrap gap-4">
                 {product.sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "w-16 h-16 font-bold text-[14px] uppercase tracking-[1.5px] flex items-center justify-center transition-all border",
                        selectedSize === size ? "bg-white border-white text-black" : "bg-canvas border-hairline text-muted hover:border-white hover:text-white"
                      )}
                    >
                      {size}
                    </button>
                 ))}
               </div>
            </div>

            {/* Quantity and CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
               <div className="flex items-center bg-surface-card p-1 border border-hairline">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-14 h-14 flex items-center justify-center text-muted hover:text-white transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center font-bold text-[16px] text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-14 h-14 flex items-center justify-center text-muted hover:text-white transition-colors"
                  >
                    <Plus size={20} />
                  </button>
               </div>
               <button 
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-on-primary font-bold py-5 flex items-center justify-center gap-3 transition-all hover:bg-white/90 text-[14px] uppercase tracking-[1.5px]"
               >
                 <ShoppingBag size={20} />
                 CONFIGURE & ADD
               </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-hairline">
               <div className="flex flex-col items-center text-center gap-4">
                 <ShieldCheck className="text-white" size={24} />
                 <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-muted">AERODYNAMIC CUT</span>
               </div>
               <div className="flex flex-col items-center text-center gap-4">
                 <Truck className="text-white" size={24} />
                 <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-muted">PRIORITY FREIGHT</span>
               </div>
               <div className="flex flex-col items-center text-center gap-4">
                 <RefreshCw className="text-white" size={24} />
                 <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-muted">10-DAY PIT STOP</span>
               </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-[120px] pt-[120px] border-t border-hairline relative">
             <h2 className="text-[40px] md:text-[56px] font-bold mb-16 tracking-tight uppercase text-ink leading-[1.0] max-w-2xl">
                COMPATIBLE HARDWARE.
             </h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
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
              className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-3xl bg-surface-card border border-hairline z-[110] p-12 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6">
                 <button onClick={() => setShowSizeChart(false)} className="text-muted hover:text-white transition-colors">
                    <X size={24} />
                 </button>
              </div>
              
              <h2 className="text-[40px] font-bold mb-10 text-white uppercase tracking-tight">TECHNICAL SPECS.</h2>
              
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-canvas">
                          <th className="p-5 border-b border-hairline font-bold uppercase tracking-[1.5px] text-[12px] text-muted">Model ID</th>
                          <th className="p-5 border-b border-hairline font-bold uppercase tracking-[1.5px] text-[12px] text-muted">Chest (IN)</th>
                          <th className="p-5 border-b border-hairline font-bold uppercase tracking-[1.5px] text-[12px] text-muted">Length (IN)</th>
                          <th className="p-5 border-b border-hairline font-bold uppercase tracking-[1.5px] text-[12px] text-muted">Target Group</th>
                       </tr>
                    </thead>
                    <tbody>
                       {[
                         { s: '24', c: '26', l: '18', a: '4-5 Yrs' },
                         { s: '26', c: '28', l: '20', a: '6-7 Yrs' },
                         { s: '28', c: '30', l: '22', a: '8-9 Yrs' },
                         { s: '30', c: '32', l: '24', a: '10-11 Yrs' },
                       ].map((row, i) => (
                         <tr key={i} className="hover:bg-canvas transition-colors">
                           <td className="p-5 border-b border-hairline font-bold text-white">{row.s}</td>
                           <td className="p-5 border-b border-hairline text-body">{row.c}</td>
                           <td className="p-5 border-b border-hairline text-body">{row.l}</td>
                           <td className="p-5 border-b border-hairline text-white font-bold">{row.a}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
              <button 
                onClick={() => setShowSizeChart(false)}
                className="mt-12 w-full btn-primary"
              >
                ACKNOWLEDGE
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
