import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';

export default function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-24 bg-canvas min-h-screen text-body-text">
      <Helmet>
        <title>Privacy Policy | Uniform trends</title>
        <link rel="canonical" href="https://uniformtrends.in/privacy" />
      </Helmet>
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-12 tracking-tight">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none space-y-8 text-lg font-light leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-ink mb-4">1. Introduction</h2>
              <p>Welcome to Uniform trends. We are committed to protecting your personal information and your right to privacy as part of By WEA. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink mb-4">2. Information We Collect</h2>
              <p>We collect personal information that you provide to us such as name, address, contact information, passwords and security data, and payment information.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink mb-4">3. How We Use Your Information</h2>
              <p>We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink mb-4">4. Sharing Your Information</h2>
              <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink mb-4">5. Contact Us</h2>
              <p>If you have questions or comments about this policy, you may email us at privacy@uniformtrendsbywea.com or by post to our business address.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
