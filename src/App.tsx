import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { HelmetProvider } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useAuth } from './lib/supabase';
import Lenis from 'lenis';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CookieConsent from './components/layout/CookieConsent';
import CartDrawer from './components/cart/CartDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Success from './pages/Success';
import Collections from './pages/Collections';
import AdminDashboard from './pages/AdminDashboard';
import SizeGuide from './pages/SizeGuide';
import Wishlist from './pages/Wishlist';
import ReturnPolicy from './pages/ReturnPolicy';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiesPolicy from './pages/CookiesPolicy';
import SEO from './components/layout/SEO';
import { useCartStore } from './store/cartStore';

// Placeholder components for other pages
const Placeholder = ({ name }: { name: string }) => (
  <div className="pt-[140px] pb-20 text-center container mx-auto bg-canvas min-h-[70vh] flex flex-col items-center justify-center">
    <SEO title={`${name} | Under Development`} description="This section is currently under development at Uniform Trends." robots="noindex, nofollow" />
    <h1 className="text-[40px] font-bold mb-4 uppercase tracking-tight text-ink">{name}</h1>
    <p className="text-muted tracking-wide font-medium">This section is currently under development.</p>
  </div>
);

export default function App() {
  const { pathname, search } = useLocation();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    setLenis(lenisInstance);

    function raf(time: number) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisInstance.destroy();
    };
  }, []);

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, search, lenis]);

  return (
    <HelmetProvider>
      <div className="flex flex-col min-h-screen bg-canvas">
        <Header />
        <CartDrawer />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/size-guide" element={<SizeGuide />} />
            <Route path="/track-order" element={<Navigate to="/account?tab=orders" replace />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookiesPolicy />} />
            <Route path="/admin-8822" element={<AdminDashboard />} />
            <Route path="/schools" element={<Placeholder name="Our Schools" />} />
            <Route path="/schools/:slug" element={<Placeholder name="School Details" />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/account" element={<Account />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="*" element={<Placeholder name="404 - Not Found" />} />
          </Routes>
        </main>
        <Footer />
        <CookieConsent />

        {/* Floating WhatsApp Button */}
        <a
          href="https://wa.me/917004301436"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:-translate-y-1 transition-transform duration-300"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </a>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-hairline flex items-center justify-around py-2 px-6 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <Link to="/" className="flex flex-col items-center gap-1 group">
            <div className="text-muted group-hover:text-ink transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a11 11 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            </div>
            <span className="text-[10px] font-medium text-muted group-hover:text-ink transition-colors">Home</span>
          </Link>
          <Link to="/shop" className="flex flex-col items-center gap-1 group">
            <div className="text-muted group-hover:text-ink transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
            <span className="text-[10px] font-medium text-muted group-hover:text-ink transition-colors">Shop</span>
          </Link>
          <button onClick={() => setDrawerOpen(true)} className="flex flex-col items-center gap-1 -mt-6">
            <div className="w-12 h-12 bg-primary text-on-primary rounded-none flex items-center justify-center shadow-lg shadow-primary/30 group hover:brightness-110 transition-all">
              <ShoppingBag size={20} />
            </div>
          </button>
          {isLoggedIn && (
            <Link to="/wishlist" className="flex flex-col items-center gap-1 group">
              <div className="text-muted group-hover:text-ink transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </div>
              <span className="text-[10px] font-medium text-muted group-hover:text-ink transition-colors">Wishlist</span>
            </Link>
          )}
          <Link to="/account" className="flex flex-col items-center gap-1 group">
            <div className="text-muted group-hover:text-ink transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <span className="text-[10px] font-medium text-muted group-hover:text-ink transition-colors">Account</span>
          </Link>
        </div>
      </div>
    </HelmetProvider>
  );
}
