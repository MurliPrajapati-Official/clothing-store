import SEO from '../components/layout/SEO';
import { motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Home, ShoppingBag } from 'lucide-react';

export default function Success() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id') || Math.floor(Math.random() * 1000000).toString();

  return (
    <div className="pt-32 pb-24 min-h-screen bg-canvas flex flex-col items-center justify-center">
      <SEO
        title="Order Confirmed | Uniform Trends"
        description="Thank you for your order. Your premium uniforms are being prepared by Uniform Trends."
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
          className="w-24 h-24 bg-ink text-white rounded-none flex items-center justify-center mx-auto mb-8 shadow-sm border border-hairline"
        >
          <CheckCircle2 size={56} strokeWidth={1.5} />
        </motion.div>

        {/* Cinematic Text Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-xl text-muted font-light leading-relaxed mb-10">
            Thank you for choosing <span className="text-ink font-semibold">Uniform Trends</span>. 
            Your order <span className="text-ink font-bold">#{orderId}</span> has been successfully placed 
            and is now being processed for a fresh start.
          </p>
        </motion.div>

        {/* Steps Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="p-6 bg-surface-card rounded-none border border-hairline shadow-sm">
            <Package className="text-ink mx-auto mb-3" size={24} />
            <h4 className="font-bold text-ink text-sm uppercase tracking-widest mb-1">Processing</h4>
            <p className="text-xs text-muted">Preparing your premium fabrics.</p>
          </div>
          <div className="p-6 bg-surface-card rounded-none border border-hairline shadow-sm opacity-50">
            <div className="w-6 h-6 border-2 border-muted border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <h4 className="font-bold text-ink text-sm uppercase tracking-widest mb-1">Tailoring</h4>
            <p className="text-xs text-muted">Quality check & finishing.</p>
          </div>
          <div className="p-6 bg-surface-card rounded-none border border-hairline shadow-sm opacity-30">
            <ArrowRight className="text-muted mx-auto mb-3" size={24} />
            <h4 className="font-bold text-ink text-sm uppercase tracking-widest mb-1">Shipping</h4>
            <p className="text-xs text-muted">On the way to your door.</p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/" className="btn-primary px-8 py-4 flex items-center justify-center gap-2 group shadow-xl">
            <Home size={18} />
            Back to Home
          </Link>
          <Link to="/shop" className="btn-secondary px-8 py-4 flex items-center justify-center gap-2 group border-hairline hover:border-ink">
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </motion.div>

        {/* Fresh Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 text-sm text-muted font-light"
        >
          A confirmation email with your order details has been sent to your registered address. 
          For any queries, please reach out to our <Link to="/contact" className="text-ink hover:underline font-semibold">support team</Link>.
        </motion.p>
      </div>
    </div>
  );
}
