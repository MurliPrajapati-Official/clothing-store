import SEO from '../components/layout/SEO';
import { STORE_NAME } from '../constants';

export default function CookiesPolicy() {
  return (
    <div className="pt-28 pb-24 bg-canvas min-h-screen text-body-text">
      <SEO
        title={`Cookies Policy | ${STORE_NAME}`}
        description={`Learn how ${STORE_NAME} uses cookies and local storage to enhance your shopping experience.`}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-muted block">Cookie Information</span>
          <h1 className="text-3xl sm:text-4xl font-black text-ink uppercase tracking-tight">Cookies Policy</h1>
          <p className="text-xs text-muted max-w-xl mx-auto">
            Understand how our site utilizes browser storage and cookies for persistent shopping cart and preferences.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 border border-hairline space-y-8 text-xs text-muted leading-relaxed">
          <section className="space-y-3 pb-6 border-b border-hairline">
            <h2 className="text-sm font-black uppercase tracking-wider text-ink">1. What Are Cookies & Local Storage?</h2>
            <p>
              Cookies and localStorage are small data files placed on your device to remember your session state, maintain items in your shopping bag, and preserve your preferred currency and sizing units.
            </p>
          </section>

          <section className="space-y-3 pb-6 border-b border-hairline">
            <h2 className="text-sm font-black uppercase tracking-wider text-ink">2. Essential Shopping Functions</h2>
            <p>
              Essential storage is used to keep your shopping bag intact across page refreshes, remember wishlist selections, and maintain active login sessions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-ink">3. Managing Preferences</h2>
            <p>
              You can clear your local storage and cookies at any time via your browser settings or via the reset button in your Account settings.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
