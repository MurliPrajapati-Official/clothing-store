import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';

export default function ReturnPolicy() {
  return (
    <div className="pt-32 pb-24 bg-canvas min-h-screen text-body-text">
      <Helmet>
        <title>Return Policy | Uniform trends</title>
        <link rel="canonical" href="https://uniformtrends.in/return-policy" />
      </Helmet>
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-12 tracking-tight">Return Policy</h1>
          
          <div className="prose prose-invert max-w-none space-y-8 text-lg font-light leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-ink mb-4">1. Eligibility for Returns</h2>
              <p>Items can be returned within 14 days of delivery. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink mb-4">2. Non-returnable Items</h2>
              <p>Customized uniforms with school logos or personal names cannot be returned unless there is a manufacturing defect.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink mb-4">3. Refunds</h2>
              <p>Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink mb-4">4. Shipping</h2>
              <p>You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
