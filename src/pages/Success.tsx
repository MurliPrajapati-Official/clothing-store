import SEO from '../components/layout/SEO';
import { motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Home, ShoppingBag, Truck } from 'lucide-react';
import { STORE_NAME } from '../constants';

export default function Success() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id') || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-canvas flex flex-col items-center justify-center">
      <SEO
        title={`Order Confirmed #${orderId} | ${STORE_NAME}`}
        description="Your apparel order has been placed successfully."
        robots="noindex, nofollow"
      />

      <div className="container mx-auto px-4 max-w-2xl text-center">
        {/* Animated Checkmark */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1
          }}
          className="w-20 h-20 bg-ink text-white flex items-center justify-center mx-auto mb-6 shadow-xl"
        >
          <CheckCircle2 size={48} strokeWidth={1.75} />
        </motion.div>

        {/* Text Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-700 block mb-1">
            Order Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-ink uppercase tracking-tight mb-4">
            Thank You For Your Order!
          </h1>
          <p className="text-sm text-muted font-normal leading-relaxed mb-8 max-w-md mx-auto">
            Your order <strong className="text-ink font-mono">{orderId}</strong> has been generated in the mock system and is now being tailored for dispatch.
          </p>
        </motion.div>

        {/* Order Progress Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-3 gap-4 mb-10 text-left"
        >
          <div className="p-4 bg-white border border-hairline">
            <Package className="text-ink mb-2" size={20} />
            <h4 className="font-bold text-xs uppercase tracking-wider text-ink mb-0.5">1. Order Placed</h4>
            <p className="text-[11px] text-muted">Confirmed in catalog.</p>
          </div>
          <div className="p-4 bg-white border border-hairline">
            <div className="w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin mb-2" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-ink mb-0.5">2. Packaging</h4>
            <p className="text-[11px] text-muted">Quality inspection.</p>
          </div>
          <div className="p-4 bg-white border border-hairline opacity-40">
            <Truck className="text-muted mb-2" size={20} />
            <h4 className="font-bold text-xs uppercase tracking-wider text-muted mb-0.5">3. Dispatch</h4>
            <p className="text-[11px] text-muted">Courier pickup.</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/account?tab=orders" className="btn-primary py-4 px-8 text-xs flex items-center justify-center gap-2">
            <Package size={16} />
            <span>View in My Orders</span>
          </Link>
          <Link to="/shop" className="btn-secondary py-4 px-8 text-xs flex items-center justify-center gap-2">
            <ShoppingBag size={16} />
            <span>Continue Shopping</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
