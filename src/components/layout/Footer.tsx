import { Link, useLocation } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import Skeleton from '../ui/Skeleton';
import { CATEGORIES } from '../../constants';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function Footer() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(false);
  }, [location.pathname]);

  return (
    <footer className="bg-canvas border-t border-hairline pt-20 pb-12 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20"
        >
          {/* Brand Column */}
          <motion.div variants={fadeUpVariant}>
            {isLoading ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Skeleton variant="circle" className="h-12 w-12" />
                  <Skeleton variant="text" className="h-8 w-40" />
                </div>
                <div className="space-y-2">
                  <Skeleton variant="text" className="w-full h-4" />
                  <Skeleton variant="text" className="w-full h-4" />
                  <Skeleton variant="text" className="w-4/5 h-4" />
                </div>
                <div className="flex gap-4">
                  <Skeleton variant="circle" className="w-10 h-10" />
                  <Skeleton variant="circle" className="w-10 h-10" />
                </div>
              </div>
            ) : (
              <>
                <Link to="/" className="flex items-center gap-3 mb-6">
                  <img 
                    src="/images/logo.svg" 
                    alt="Uniform Trends Uniforms - Premium Manufacturer in India" 
                    className="h-12 w-auto object-contain" 
                  />
                  <span className="font-black text-2xl tracking-tight text-ink">
                    Uniform Trends
                  </span>
                </Link>
                <p className="text-body-text mb-8 leading-relaxed font-light text-[15px]">
                  Uniform Trends is a premium uniform manufacturer and supplier in India, trusted for quality school, corporate, and hospital attire. We manufacture uniforms that combine all-day comfort with long-lasting durability.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="w-9 h-9 bg-surface-card rounded-full flex items-center justify-center hover:bg-warning hover:text-canvas transition-all duration-300 hover:scale-110 active:scale-95">
                    <Facebook size={18} />
                  </a>
                  <a href="https://www.instagram.com/walrie_exclusive_apparels/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-surface-card rounded-full flex items-center justify-center hover:bg-warning hover:text-canvas transition-all duration-300 hover:scale-110 active:scale-95">
                    <Instagram size={18} />
                  </a>
                </div>
              </>
            )}
          </motion.div>

          {/* Category Column */}
          <motion.div variants={fadeUpVariant} className="lg:col-span-1">
            {isLoading ? (
              <div className="space-y-6">
                <Skeleton variant="text" className="w-24 h-5 mb-6" />
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} variant="text" className="w-32 h-4" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <h4 className="text-[15px] font-bold mb-6 text-ink tracking-wide">Category</h4>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-4 text-body-text font-light">
                  {CATEGORIES.map((item) => (
                    <li key={item}>
                      <Link to={`/shop?category=${encodeURIComponent(item)}`} className="hover:text-warning transition-colors block truncate">{item}</Link>
                    </li>
                  ))}
                  <li className="col-span-2">
                    <Link to={`/contact`} className="hover:text-warning transition-colors block">Custom Bulk Orders</Link>
                  </li>
                </ul>
              </>
            )}
          </motion.div>

          {/* Quick Links Column */}
          <motion.div variants={fadeUpVariant}>
            {isLoading ? (
              <div className="space-y-6">
                <Skeleton variant="text" className="w-24 h-5 mb-6" />
                <div className="space-y-4">
                  {[...Array(7)].map((_, i) => (
                    <Skeleton key={i} variant="text" className="w-40 h-4" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <h4 className="text-[15px] font-bold mb-6 text-ink tracking-wide">Quick Links</h4>
                <ul className="space-y-4 text-body-text font-light">
                  {[
                    { name: 'About Us', path: '/about' },
                    { name: 'Our Collections', path: '/collections' },
                    { name: 'Size Guide', path: '/size-guide' },
                    { name: 'Track Order', path: '/track-order' },
                    { name: 'Return Policy', path: '/return-policy' },
                    { name: 'Terms & Conditions', path: '/terms' },
                    { name: 'Privacy Policy', path: '/privacy' },
                    { name: 'Cookies Policy', path: '/cookies' }
                  ].map((item) => (
                    <li key={item.name}>
                      <Link to={item.path} className="hover:text-warning transition-colors block">{item.name}</Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </motion.div>

          {/* Contact Column */}
          <motion.div variants={fadeUpVariant}>
            {isLoading ? (
              <div className="space-y-6">
                <Skeleton variant="text" className="w-24 h-5 mb-6" />
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <Skeleton variant="circle" className="w-5 h-5 mt-1 shrink-0" />
                    <div className="space-y-2 w-full">
                      <Skeleton variant="text" className="w-full h-4" />
                      <Skeleton variant="text" className="w-1/2 h-4" />
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <Skeleton variant="circle" className="w-5 h-5 shrink-0" />
                    <Skeleton variant="text" className="w-1/2 h-4" />
                  </div>
                  <div className="flex gap-4 items-center">
                    <Skeleton variant="circle" className="w-5 h-5 shrink-0" />
                    <Skeleton variant="text" className="w-3/4 h-4" />
                  </div>
                </div>
                <Skeleton className="w-full h-48 rounded-xl" />
              </div>
            ) : (
              <>
                <h4 className="text-[15px] font-bold mb-6 text-ink tracking-wide">Contact Us</h4>
                <ul className="space-y-6 font-light text-body-text mb-8">
                  <li className="flex gap-4 items-start">
                    <MapPin className="text-warning shrink-0 mt-1" size={20} />
                    <span>Uniform Trends<br />India</span>
                  </li>
                  <li className="flex gap-4 items-center">
                    <Phone className="text-warning shrink-0" size={20} />
                    <span>07004301436</span>
                  </li>
                  <li className="flex gap-4 items-center overflow-hidden">
                    <Mail className="text-warning shrink-0" size={20} />
                    <span className="break-all sm:break-normal">uniformtrends01@gmail.com</span>
                  </li>
                </ul>
                <div className="w-full h-48 rounded-xl overflow-hidden border border-hairline shadow-sm bg-surface-elevated">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4506.666925674507!2d85.33548!3d23.367912!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4e17341d1d58f%3A0xc973b664ccbfcfa5!2sWALRIE%20-%20Exclusive%20Gown%20Store!5e1!3m2!1sen!2sin!4v1778774668294!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office Location"
                  ></iframe>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* SEO Keyword Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pt-12 mt-12 border-t border-hairline grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
        >
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton variant="text" className="w-1/2 h-3" />
                <div className="space-y-2">
                  <Skeleton variant="text" className="w-full h-2.5" />
                  <Skeleton variant="text" className="w-full h-2.5" />
                </div>
              </div>
            ))
          ) : (
            <>
              <div>
                <h5 className="text-xs font-bold uppercase tracking-widest text-ink mb-4">Uniforms in India</h5>
                <p className="text-[12px] text-muted leading-relaxed font-light">
                  Providing premium school uniforms, corporate suits, and medical scrubs across the entire nation.
                </p>
              </div>
              <div>
                <h5 className="text-xs font-bold uppercase tracking-widest text-ink mb-4">Specialized Manufacturing</h5>
                <p className="text-[12px] text-muted leading-relaxed font-light">
                  Custom tailoring for healthcare professionals, industrial factory workers, and luxury hotel staff across the nation.
                </p>
              </div>
              <div>
                <h5 className="text-xs font-bold uppercase tracking-widest text-ink mb-4">Bulk Order Supply</h5>
                <p className="text-[12px] text-muted leading-relaxed font-light">
                  Trusted supplier for large educational institutions and corporate administrative offices with door-step delivery.
                </p>
              </div>
              <div>
                <h5 className="text-xs font-bold uppercase tracking-widest text-ink mb-4">Quality & Comfort</h5>
                <p className="text-[12px] text-muted leading-relaxed font-light">
                  Using anti-microbial, breathable, and durable fabrics designed by the experts at Uniform Trends.
                </p>
              </div>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="pt-8 border-t border-hairline flex flex-col md:flex-row justify-between items-center gap-6"
        >
          {isLoading ? (
            <Skeleton variant="text" className="w-64 h-4" />
          ) : (
            <p className="text-muted text-[13px] font-light uppercase tracking-wider">
              © {new Date().getFullYear()} Uniform Trends. ALL RIGHTS RESERVED.
            </p>
          )}
          <div className="flex gap-4">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-14 rounded" />
              ))
            ) : (
              <>
                <div className="h-8 w-14 bg-surface-card border border-hairline rounded flex items-center justify-center text-ink font-bold text-[10px]">VISA</div>
                <div className="h-8 w-14 bg-surface-card border border-hairline rounded flex items-center justify-center text-ink font-bold text-[10px]">MASTER</div>
                <div className="h-8 w-14 bg-surface-card border border-hairline rounded flex items-center justify-center text-ink font-bold text-[10px]">UPI</div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
