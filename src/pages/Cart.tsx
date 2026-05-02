import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="pt-[140px] pb-[120px] container mx-auto px-4 flex flex-col items-center min-h-screen bg-canvas">
        <div className="w-24 h-24 bg-surface-card rounded-none flex items-center justify-center text-muted border border-hairline mb-8">
           <ShoppingBag size={32} />
        </div>
        <h1 className="text-[40px] font-bold mb-4 text-ink uppercase tracking-tight">CART EMPTY.</h1>
        <p className="text-body text-[16px] font-light mb-10 max-w-md text-center">No configurations found in your current session. Please select units from the catalog.</p>
        <Link to="/shop" className="btn-primary">
           EXPLORE CATALOG
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-[140px] pb-20 bg-canvas min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-[56px] font-bold mb-16 tracking-tight uppercase text-ink">BUILD ORDER.</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex border-b border-hairline pb-4 mb-4">
               <div className="flex-1 font-bold text-muted uppercase tracking-[1.5px] text-[12px]">Configuration</div>
               <div className="w-24 text-center font-bold text-muted uppercase tracking-[1.5px] text-[12px]">Qty</div>
               <div className="w-32 text-right font-bold text-muted uppercase tracking-[1.5px] text-[12px]">Value</div>
            </div>
            
            {items.map((item, idx) => (
              <motion.div 
                key={`${item.id}-${item.selectedSize}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-surface-card p-6 border border-hairline flex gap-8 items-center"
              >
                <div className="w-[120px] h-[150px] overflow-hidden bg-canvas shrink-0">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover grayscale brightness-75" />
                </div>
                
                <div className="flex-1 flex flex-col">
                   <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-[20px] text-white uppercase tracking-tighter leading-[1.1]">{item.name}</h3>
                      <button 
                        onClick={() => removeItem(item.id, item.selectedSize)}
                        className="p-2 text-muted hover:text-m-red transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                   </div>
                   
                   <div className="flex gap-4 mb-4">
                      <span className="text-[12px] font-bold text-white uppercase tracking-[1.5px] border border-white px-3 py-1">SPEC: {item.selectedSize}</span>
                   </div>
                </div>
                
                <div className="w-24 flex justify-center">
                   <div className="flex items-center gap-4 bg-canvas border border-hairline p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted hover:text-white transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-[14px] text-white w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-muted hover:text-white transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                   </div>
                </div>
                
                <div className="w-32 text-right">
                    <span className="text-[20px] font-black text-white italic">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <aside className="lg:col-span-1">
            <div className="bg-surface-card border border-hairline p-10 sticky top-28">
               {/* Decorative stripe */}
               <div className="absolute top-0 left-0 right-0 h-1 flex">
                  <div className="flex-1 bg-m-blue-light" />
                  <div className="flex-1 bg-m-blue-dark" />
                  <div className="flex-1 bg-m-red" />
               </div>

               <h2 className="text-[32px] font-bold mb-10 uppercase tracking-tight text-white leading-[1.0]">SUMMARY.</h2>
               
               <div className="space-y-6 mb-10">
                  <div className="flex justify-between items-center text-muted">
                    <span className="font-bold text-[14px] uppercase tracking-[1.5px]">Subtotal</span>
                    <span className="font-bold text-[14px] text-white">{formatCurrency(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted">
                    <span className="font-bold text-[14px] uppercase tracking-[1.5px]">Shipping</span>
                    <span className="text-white font-bold text-[14px] uppercase tracking-[1.5px]">Complimentary</span>
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-hairline">
                    <span className="text-[20px] font-bold text-white uppercase tracking-[1.5px]">TOTAL</span>
                    <span className="text-[24px] font-black text-white italic">{formatCurrency(getTotalPrice())}</span>
                  </div>
               </div>

               <Link 
                to="/checkout" 
                className="w-full bg-white text-black font-bold uppercase tracking-[1.5px] text-[14px] py-4 flex items-center justify-center gap-3 transition-colors hover:bg-gray-200 mb-8"
               >
                 AUTHORIZE CHECKOUT <ArrowRight size={16} />
               </Link>

               <div className="space-y-6 pt-8 border-t border-hairline">
                  <div className="flex items-center gap-4 text-muted">
                    <ShieldCheck size={20} className="text-white" />
                    <span className="text-[12px] font-bold uppercase tracking-[1.5px]">Secure Transaction</span>
                  </div>
                  <div className="flex items-center gap-4 text-muted">
                    <Truck size={20} className="text-white" />
                    <span className="text-[12px] font-bold uppercase tracking-[1.5px]">Priority Fleet Dispatch</span>
                  </div>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
