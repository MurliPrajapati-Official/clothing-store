import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';

export default function TermsConditions() {
  return (
    <div className="pt-32 pb-24 bg-canvas min-h-screen text-body-text">
      <Helmet>
        <title>Terms & Conditions | Ovi Global Uniform</title>
      </Helmet>
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-8 text-ink tracking-tight">Terms & Conditions</h1>
          
          <div className="bg-surface-card rounded-2xl p-8 shadow-sm border border-hairline space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">1. Introduction</h2>
              <p className="text-muted leading-relaxed">
                Welcome to Ovi Global Uniform. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions. If you disagree with any part of these terms, please do not use our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">2. Products and Services</h2>
              <p className="text-muted leading-relaxed">
                We make every effort to display as accurately as possible the colors and images of our products. However, we cannot guarantee that your computer monitor's display of any color will be accurate. We reserve the right to modify or discontinue products at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">3. Pricing & Payments</h2>
              <p className="text-muted leading-relaxed">
                All prices are subject to change without notice. We reserve the right, at any time, to modify or discontinue any service (or any part or content thereof) without notice. We are not liable to you or any third party for any modification, price change, suspension, or discontinuance.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">4. Bulk Orders</h2>
              <p className="text-muted leading-relaxed">
                Bulk order quotes are valid for 30 days. Final production for custom orders will not commence until we receive formal approval of digital mockups or physical samples (if requested).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-ink">5. Intellectual Property</h2>
              <p className="text-muted leading-relaxed">
                All content included on this site, such as text, graphics, logos, images, and software, is the property of Ovi Global Uniform and is protected by intellectual property laws.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
