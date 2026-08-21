import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';
import { STORE_NAME, STORE_TAGLINE } from '../../constants';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-surface-card border-t border-hairline text-ink pt-16 pb-12">
      {/* Value Pillars Banner */}
      <div className="container mx-auto px-4 lg:px-8 pb-16 border-b border-hairline">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-canvas border border-hairline shrink-0">
              <Truck size={24} className="text-ink" />
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-ink mb-1">Express Shipping</h4>
              <p className="text-xs text-muted leading-relaxed">Complimentary delivery across India on orders above ₹1,999.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-canvas border border-hairline shrink-0">
              <RotateCcw size={24} className="text-ink" />
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-ink mb-1">30-Day Easy Returns</h4>
              <p className="text-xs text-muted leading-relaxed">Hassle-free doorstep exchanges and return pickups.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-canvas border border-hairline shrink-0">
              <Award size={24} className="text-ink" />
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-ink mb-1">Artisanal Quality</h4>
              <p className="text-xs text-muted leading-relaxed">Premium combed cottons, rich wool blends & durable tailoring.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-canvas border border-hairline shrink-0">
              <ShieldCheck size={24} className="text-ink" />
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-ink mb-1">Secure Checkout</h4>
              <p className="text-xs text-muted leading-relaxed">Encrypted 256-bit payments supporting UPI, Cards & NetBanking.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links Grid */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 bg-ink text-white flex items-center justify-center font-black text-sm tracking-tighter">
                CS
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase text-ink">
                {STORE_NAME}
              </span>
            </Link>
            <p className="text-sm text-muted max-w-sm leading-relaxed">
              {STORE_TAGLINE}. Designed for timeless style, contemporary comfort, and elevated everyday wear.
            </p>

            {/* Newsletter */}
            <div className="pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-ink mb-2">Subscribe to Newsletter</p>
              {subscribed ? (
                <div className="p-3 bg-canvas border border-ink text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-ink" />
                  <span>Thank you for subscribing! Check your inbox for 20% off.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-md">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-canvas border border-hairline-strong px-4 py-3 text-xs outline-none focus:border-ink transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-ink text-white px-5 py-3 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0 flex items-center gap-1"
                  >
                    <span>Join</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-ink mb-4">Shop Collections</h4>
            <ul className="space-y-2.5 text-xs text-muted">
              <li><Link to="/shop?gender=men" className="hover:text-ink transition-colors">Men's Apparel</Link></li>
              <li><Link to="/shop?gender=women" className="hover:text-ink transition-colors">Women's Apparel</Link></li>
              <li><Link to="/shop?category=Streetwear" className="hover:text-ink transition-colors">Streetwear & Hoodies</Link></li>
              <li><Link to="/shop?category=Outerwear" className="hover:text-ink transition-colors">Jackets & Coats</Link></li>
              <li><Link to="/shop?category=Knitwear" className="hover:text-ink transition-colors">Knitwear & Sweaters</Link></li>
              <li><Link to="/shop?category=Accessories" className="hover:text-ink transition-colors">Bags & Accessories</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-ink mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-muted">
              <li><Link to="/account?tab=orders" className="hover:text-ink transition-colors">Track Order</Link></li>
              <li><Link to="/size-guide" className="hover:text-ink transition-colors">Size Guide & Fit</Link></li>
              <li><Link to="/return-policy" className="hover:text-ink transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/contact" className="hover:text-ink transition-colors">Contact Support</Link></li>
              <li><Link to="/account" className="hover:text-ink transition-colors">Customer Account</Link></li>
            </ul>
          </div>

          {/* Legal & Store */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-ink mb-4">Company & Legal</h4>
            <ul className="space-y-2.5 text-xs text-muted">
              <li><Link to="/about" className="hover:text-ink transition-colors">Our Story</Link></li>
              <li><Link to="/collections" className="hover:text-ink transition-colors">Lookbook Showcase</Link></li>
              <li><Link to="/blog" className="hover:text-ink transition-colors">Style Journal</Link></li>
              <li><Link to="/terms" className="hover:text-ink transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-ink transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="hover:text-ink transition-colors">Cookies Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="container mx-auto px-4 lg:px-8 pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
        <p>© {new Date().getFullYear()} {STORE_NAME}. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link to="/privacy" className="hover:text-ink">Privacy</Link>
          <Link to="/terms" className="hover:text-ink">Terms</Link>
          <Link to="/cookies" className="hover:text-ink">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}
