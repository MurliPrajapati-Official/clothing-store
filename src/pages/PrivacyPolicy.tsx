import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';

export default function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-24 bg-canvas min-h-screen text-body-text">
      <Helmet>
        <title>Privacy Policy | Ovi Global Uniform</title>
      </Helmet>
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-8 text-ink tracking-tight">Privacy Policy</h1>
          
          <div className="bg-surface-card rounded-2xl p-8 shadow-sm border border-hairline space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">1. Information We Collect</h2>
              <p className="text-muted leading-relaxed">
                When you visit our store or place an order, we collect certain information about your device, your interaction with the site, and information necessary to process your purchases. This may include your name, billing address, shipping address, payment information, email address, and phone number.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">2. How We Use Your Information</h2>
              <p className="text-muted leading-relaxed">
                We use the order information that we collect generally to fulfill any orders placed through the site (including processing your payment, arranging for shipping, and providing you with invoices and/or order confirmations). We also use this information to communicate with you and screen our orders for potential risk or fraud.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">3. Sharing Your Information</h2>
              <p className="text-muted leading-relaxed">
                We share your Personal Information with third parties to help us use it as described above. We may also share your Personal Information to comply with applicable laws and regulations, or to otherwise protect our rights.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">4. Data Retention</h2>
              <p className="text-muted leading-relaxed">
                When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">5. Changes</h2>
              <p className="text-muted leading-relaxed">
                We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
