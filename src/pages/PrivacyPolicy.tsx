import SEO from '../components/layout/SEO';
import { STORE_NAME } from '../constants';

export default function PrivacyPolicy() {
  return (
    <div className="pt-28 pb-24 bg-canvas min-h-screen text-body-text">
      <SEO
        title={`Privacy Policy | ${STORE_NAME}`}
        description={`Learn how ${STORE_NAME} collects, stores, and protects your personal shopping data.`}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-muted block">Data Privacy</span>
          <h1 className="text-3xl sm:text-4xl font-black text-ink uppercase tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-muted max-w-xl mx-auto">
            Your privacy is of paramount importance to us. This policy explains how we collect and safeguard your information.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 border border-hairline space-y-8 text-xs text-muted leading-relaxed">
          <section className="space-y-3 pb-6 border-b border-hairline">
            <h2 className="text-sm font-black uppercase tracking-wider text-ink">1. Information We Collect</h2>
            <p>
              We collect information necessary to process your apparel orders and improve your shopping experience, such as your name, shipping address, email address, phone number, and selected size preferences.
            </p>
          </section>

          <section className="space-y-3 pb-6 border-b border-hairline">
            <h2 className="text-sm font-black uppercase tracking-wider text-ink">2. How Your Data Is Used</h2>
            <p>
              Your data is exclusively used to fulfill your deliveries, send tracking updates, provide customer support, and save your preferences for seamless return visits. We do not sell or rent personal information to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-ink">3. Data Security & Storage</h2>
            <p>
              All customer sessions and mock orders are securely stored in your local browser storage and protected with 256-bit SSL encryption during transit.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
