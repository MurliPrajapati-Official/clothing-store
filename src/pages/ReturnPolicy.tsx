import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';

export default function ReturnPolicy() {
  return (
    <div className="pt-32 pb-24 bg-canvas min-h-screen text-body-text">
      <Helmet>
        <title>Return Policy | Ovi Global Uniform</title>
      </Helmet>
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-8 text-ink tracking-tight">Return & Exchange Policy</h1>
          
          <div className="bg-surface-card rounded-2xl p-8 shadow-sm border border-hairline space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">1. General Returns</h2>
              <p className="text-muted leading-relaxed">
                We accept returns within 15 days of delivery for all unworn, unwashed, and undamaged items in their original packaging with tags still attached. Items that show signs of wear or are missing original packaging may be rejected.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">2. Custom & Bulk Orders</h2>
              <p className="text-muted leading-relaxed">
                Customized uniforms, monogrammed items, and specific bulk orders made to specialized requirements cannot be returned unless there is a clear manufacturing defect or an error on our part. Please review all proofs and sample sizes carefully before confirming a bulk order.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">3. Exchanges</h2>
              <p className="text-muted leading-relaxed">
                If you ordered the wrong size, we are happy to exchange it for the correct size within the 15-day window. Please initiate the exchange process through our contact page or by reaching out to our support team. Additional shipping charges may apply.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">4. Defective Items</h2>
              <p className="text-muted leading-relaxed">
                If you receive a defective or incorrect item, please take photos of the defect and contact our support team within 48 hours of delivery. We will arrange a replacement and cover all subsequent shipping costs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">5. Refund Process</h2>
              <p className="text-muted leading-relaxed">
                Once we receive and inspect your returned items, a refund will be processed to your original method of payment within 5-7 business days. Please note that original shipping fees are non-refundable.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
