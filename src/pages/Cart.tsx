import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } }
};

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 container mx-auto px-4 flex flex-col items-center min-h-screen bg-canvas">
        <Helmet>
          <title>Your Cart is Empty | UniformKart</title>
        </Helmet>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 bg-surface-card rounded-full flex items-center justify-center text-muted mb-8 shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-hairline"
        >
           <ShoppingBag size={32} />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-ink tracking-tight mb-4"
        >
          Your Cart is Empty
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted text-lg mb-8 text-center max-w-md font-light"
        >
          Looks like you haven't added any uniforms to your cart yet.
        </motion.p>
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link to="/shop" className="btn-primary flex items-center gap-2 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
             Continue Shopping <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-canvas min-h-screen">
      <Helmet>
        <title>Your Cart ({items.length}) | UniformKart</title>
      </Helmet>
      <div className="container mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-ink tracking-tight mb-12"
        >
          Shopping Cart
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items List */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-6"
          >
            <div className="hidden md:flex border-b border-hairline-strong pb-4 mb-4">
               <div className="flex-1 font-semibold text-muted text-sm uppercase tracking-wider">Product details</div>
               <div className="w-24 text-center font-semibold text-muted text-sm uppercase tracking-wider">Quantity</div>
               <div className="w-32 text-right font-semibold text-muted text-sm uppercase tracking-wider">Total</div>
            </div>
            
            <AnimatePresence mode="popLayout">
              {items.map((item, idx) => (
                <motion.div 
                  key={`${item.id}-${item.selectedSize}`}
                  variants={itemVariants}
                  layout
                  className="bg-surface-card p-4 md:p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-shadow border border-hairline flex flex-col md:flex-row gap-6 md:items-center"
                >
                  <div className="w-24 h-32 md:w-28 md:h-36 overflow-hidden rounded-xl bg-canvas shrink-0">
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                     <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-ink line-clamp-2 pr-4">{item.name}</h3>
                        <button 
                          onClick={() => removeItem(item.id, item.selectedSize)}
                          className="p-2 text-muted hover:text-m-red bg-canvas rounded-full transition-colors shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                     </div>
                     
                     <div className="flex gap-4 mb-4">
                        <span className="text-xs font-semibold text-muted border border-hairline-strong rounded-md px-2 py-1">Size: {item.selectedSize}</span>
                     </div>
                     
                     <span className="font-bold text-ink md:hidden">{formatCurrency(item.price)}</span>
                  </div>
                  
                  <div className="w-full md:w-24 flex md:justify-center mt-4 md:mt-0">
                     <div className="flex items-center gap-2 bg-canvas rounded-lg border border-hairline-strong p-1">
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-body-text hover:text-ink hover:bg-surface-elevated rounded-md transition-colors"
                        >
                          <Minus size={14} />
                        </motion.button>
                        <span className="font-semibold text-sm text-ink w-6 text-center">{item.quantity}</span>
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-body-text hover:text-ink hover:bg-surface-elevated rounded-md transition-colors"
                        >
                          <Plus size={14} />
                        </motion.button>
                     </div>
                  </div>
                  
                  <div className="hidden md:block w-32 text-right">
                      <span className="text-xl font-bold text-ink">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Summary */}
          <motion.aside 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-1"
          >
            <div className="bg-surface-card rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-hairline p-6 md:p-8 sticky top-28">
               <h2 className="text-xl font-bold mb-6 text-ink border-b border-hairline pb-4">Order Summary</h2>
               
               <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-body-text">
                    <span className="text-sm font-medium">Subtotal</span>
                    <span className="font-semibold text-ink">{formatCurrency(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between items-center text-body-text">
                    <span className="text-sm font-medium">Shipping</span>
                    <span className="font-semibold text-success">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-body-text">
                    <span className="text-sm font-medium">Tax</span>
                    <span className="font-semibold text-muted">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-hairline">
                    <span className="text-lg font-bold text-ink">Total</span>
                    <span className="text-2xl font-bold text-ink">{formatCurrency(getTotalPrice())}</span>
                  </div>
               </div>

               <Link to="/checkout" className="block relative group overflow-hidden rounded-full mb-6">
                 <motion.div
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className="w-full btn-primary flex flex-row items-center justify-center gap-2 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                 >
                   Proceed to Checkout <ArrowRight size={18} />
                 </motion.div>
               </Link>

               <div className="bg-canvas rounded-xl p-4 space-y-3 border border-hairline">
                  <div className="flex items-center gap-3 text-body-text">
                    <ShieldCheck size={18} className="text-warning" />
                    <span className="text-sm font-medium">Secure Payments</span>
                  </div>
                  <div className="flex items-center gap-3 text-body-text">
                    <Truck size={18} className="text-warning" />
                    <span className="text-sm font-medium">Free Doorstep Delivery</span>
                  </div>
               </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
