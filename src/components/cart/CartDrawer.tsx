import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency, cn } from '../../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function CartDrawer() {
  const { items, isDrawerOpen, setDrawerOpen, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();
  const navigate = useNavigate();

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  const handleCheckout = () => {
    setDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-[450px] bg-white border-l border-hairline shadow-2xl z-[110] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-hairline">
              <div className="flex items-center gap-3">
                <ShoppingBag size={22} className="text-ink" />
                <h2 className="text-xl font-bold text-ink tracking-tight">Your Cart</h2>
                <span className="bg-surface-elevated text-ink text-[11px] font-bold px-2 py-0.5 rounded-none border border-hairline">
                  {getTotalItems()}
                </span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-muted hover:text-ink hover:bg-surface-elevated rounded-none transition-colors border border-hairline"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6" data-lenis-prevent>
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-surface-elevated rounded-none flex items-center justify-center text-muted mb-6 border border-hairline">
                    <ShoppingBag size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-2">Cart is empty</h3>
                  <p className="text-muted mb-8 max-w-[250px]">Looks like you haven't added anything yet.</p>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="btn-primary w-full"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor || 'none'}`} className="flex gap-4 group">
                    <div className="w-24 h-32 bg-canvas rounded-none overflow-hidden shrink-0 border border-hairline flex items-center justify-center">
                      {item.images && item.images.length > 0 ? (
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-muted/30 uppercase">{item.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className="font-bold text-ink truncate leading-tight">{item.name}</h4>
                        <button
                          onClick={() => removeItem(item.id, item.selectedSize, item.selectedColor)}
                          className="text-muted hover:text-m-red transition-colors shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted mb-3">
                        <span>Size: {item.selectedSize}</span>
                        {item.selectedColor && (
                          <>
                            <span className="text-muted/30">|</span>
                            <span>Color: {item.selectedColor}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center bg-canvas rounded-none border border-hairline-strong p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1, item.selectedColor)}
                            className="w-7 h-7 flex items-center justify-center text-muted hover:text-ink transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-ink">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1, item.selectedColor)}
                            className="w-7 h-7 flex items-center justify-center text-muted hover:text-ink transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="font-bold text-ink">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-hairline bg-white shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-muted font-medium">Subtotal</span>
                  <span className="text-2xl font-bold text-ink">{formatCurrency(getTotalPrice())}</span>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full btn-primary h-14 rounded-none flex items-center justify-center gap-2 text-sm uppercase tracking-widest font-bold"
                  >
                    Checkout <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      navigate('/cart');
                    }}
                    className="w-full text-sm font-bold text-muted hover:text-ink transition-colors py-2"
                  >
                    View Full Shopping Bag
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
