import SEO from '../components/layout/SEO';
import { motion } from 'motion/react';

export default function TermsConditions() {
  return (
    <div className="pt-32 pb-24 bg-canvas min-h-screen text-body-text">
      <SEO
        title="Terms & Conditions"
        description="Terms and conditions for using the Uniform Trends web platform. Read about license usage, liability disclaimers, governing laws, and purchase policies."
      />
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-12 tracking-tight">Terms & Conditions</h1>
          
          <div className="prose prose-invert max-w-none space-y-8 text-lg font-light leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-ink mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-ink mb-4">2. Use of License</h2>
              <p>Permission is granted to temporarily download one copy of the materials (information or software) on Uniform Trends' website for personal, non-commercial transitory viewing only.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink mb-4">3. Disclaimer</h2>
              <p>The materials on Uniform Trends' website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink mb-4">4. Governing Law</h2>
              <p>These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
