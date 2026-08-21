import SEO from '../components/layout/SEO';
import { STORE_NAME } from '../constants';

export default function TermsConditions() {
  return (
    <div className="pt-28 pb-24 bg-canvas min-h-screen text-body-text">
      <SEO
        title={`Terms & Conditions | ${STORE_NAME}`}
        description={`Review the terms of service governing purchases and catalog use at ${STORE_NAME}.`}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-muted block">Legal Agreement</span>
          <h1 className="text-3xl sm:text-4xl font-black text-ink uppercase tracking-tight">Terms of Service</h1>
          <p className="text-xs text-muted max-w-xl mx-auto">
            Please review these terms and conditions governing the use of this clothing store prototype and services.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 border border-hairline space-y-8 text-xs text-muted leading-relaxed">
          <section className="space-y-3 pb-6 border-b border-hairline">
            <h2 className="text-sm font-black uppercase tracking-wider text-ink">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or making purchases through this store, you agree to be bound by these Terms and Conditions. These terms apply to all visitors, registered users, and shoppers.
            </p>
          </section>

          <section className="space-y-3 pb-6 border-b border-hairline">
            <h2 className="text-sm font-black uppercase tracking-wider text-ink">2. Product Catalog & Pricing</h2>
            <p>
              All garment descriptions, prices, materials, and size specifications listed on the website are presented accurately in our mock catalog. Prices are inclusive of applicable goods & services tax (GST).
            </p>
          </section>

          <section className="space-y-3 pb-6 border-b border-hairline">
            <h2 className="text-sm font-black uppercase tracking-wider text-ink">3. Intellectual Property</h2>
            <p>
              All trademarks, product photography, editorial layouts, and site designs are the exclusive property of {STORE_NAME}.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-ink">4. Contact & Disputes</h2>
            <p>
              For any inquiries regarding our terms, please contact our support team at <strong className="text-ink">care@clothingstore.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
