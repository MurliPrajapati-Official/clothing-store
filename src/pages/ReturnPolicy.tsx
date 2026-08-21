import SEO from '../components/layout/SEO';
import { motion } from 'motion/react';
import { RefreshCcw, Info } from 'lucide-react';
import { STORE_NAME } from '../constants';

export default function ReturnPolicy() {
  return (
    <div className="pt-28 pb-24 bg-canvas min-h-screen text-body-text">
      <SEO
        title={`Return & Exchange Policy | ${STORE_NAME}`}
        description={`Read the official 30-day return, exchange, and refund guidelines for ${STORE_NAME}.`}
      />
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-12 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-card border border-hairline text-xs font-bold uppercase tracking-widest text-ink">
              <RefreshCcw size={14} />
              <span>Customer Care</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-ink uppercase tracking-tight">Return & Exchange Policy</h1>
            <p className="text-xs text-muted max-w-xl mx-auto leading-relaxed">
              We stand behind the craftsmanship of every garment. Here is our straightforward 30-day policy for exchanges and refunds.
            </p>
          </div>

          <div className="bg-white p-8 md:p-12 border border-hairline space-y-8 text-xs text-muted leading-relaxed">
            <section className="space-y-3 pb-6 border-b border-hairline">
              <h2 className="text-sm font-black uppercase tracking-wider text-ink flex items-center gap-2">
                <Info size={16} /> 1. 30-Day Doorstep Returns & Exchanges
              </h2>
              <p>
                We accept returns and size exchanges within 30 calendar days from the date of delivery. Whether you need a different size or wish to return an unworn piece, our team will coordinate a complimentary courier pickup at your address.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Garments must be unworn, unwashed, and in original pristine condition with brand tags attached.</li>
                <li>Items must be returned with their original protective dust bags or packaging.</li>
              </ul>
            </section>

            <section className="space-y-3 pb-6 border-b border-hairline">
              <h2 className="text-sm font-black uppercase tracking-wider text-ink">2. How to Initiate a Return</h2>
              <p>
                Log in to your account, visit <strong className="text-ink">My Account &gt; Order History</strong>, locate your order, and tap request return or exchange. Alternatively, email our concierge team at <strong className="text-ink">care@clothingstore.com</strong> with your order ID.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-ink">3. Refund Processing</h2>
              <p>
                Once your returned parcel is received and inspected at our central studio warehouse, refunds will be credited back to your original payment method (Credit Card, Net Banking, or UPI) within 3-5 business days.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
