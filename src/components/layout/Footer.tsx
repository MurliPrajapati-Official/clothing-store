import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { motion } from 'motion/react';

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
          <motion.div variants={fadeUpVariant}>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <span className="font-extrabold text-2xl tracking-tight text-ink">
                Ovi Global<span className="font-light">Uniform</span>
              </span>
            </Link>
            <p className="text-body-text mb-8 leading-relaxed font-light text-[15px]">
              Ovi Global Uniform is a trusted manufacturer and supplier of specialized uniforms. We manufacture uniforms that combine all-day comfort with long-lasting durability.
            </p>
            <div className="flex gap-4">
               <a href="#" className="p-2 bg-surface-card rounded-full hover:bg-warning hover:text-canvas transition-all duration-300 hover:scale-110 active:scale-95">
                  <Facebook size={18} />
               </a>
               <a href="https://www.instagram.com/walrie_exclusive_apparels/" target="_blank" rel="noopener noreferrer" className="p-2 bg-surface-card rounded-full hover:bg-warning hover:text-canvas transition-all duration-300 hover:scale-110 active:scale-95">
                  <Instagram size={18} />
               </a>
            </div>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <h4 className="text-[15px] font-bold mb-6 text-ink tracking-wide">Category</h4>
            <ul className="space-y-4 text-body-text font-light">
              {['School & College Uniforms', 'Hospital Staff Uniforms', 'Admin Uniforms & Dresses'].map((item) => (
                <li key={item}>
                  <Link to={`/shop?category=${encodeURIComponent(item)}`} className="hover:text-warning transition-colors block">{item}</Link>
                </li>
              ))}
              <li>
                <Link to={`/contact`} className="hover:text-warning transition-colors block">Custom Bulk Orders</Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <h4 className="text-[15px] font-bold mb-6 text-ink tracking-wide">Quick Links</h4>
            <ul className="space-y-4 text-body-text font-light">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Size Guide', path: '/size-guide' },
                { name: 'Track Order', path: '/track-order' },
                { name: 'Return Policy', path: '/return-policy' },
                { name: 'Terms & Conditions', path: '/terms' },
                { name: 'Privacy Policy', path: '/privacy' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="hover:text-warning transition-colors block">{item.name}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <h4 className="text-[15px] font-bold mb-6 text-ink tracking-wide">Contact Us</h4>
            <ul className="space-y-6 font-light text-body-text mb-8">
              <li className="flex gap-4 items-start">
                <MapPin className="text-warning shrink-0 mt-1" size={20} />
                <span>WALRIE - Exclusive Gown Store<br />Ranchi, Jharkhand, India</span>
              </li>
              <li className="flex gap-4 items-center">
                <Phone className="text-warning shrink-0" size={20} />
                <span>07004301436</span>
              </li>
              <li className="flex gap-4 items-center">
                <Mail className="text-warning shrink-0" size={20} />
                <span>contact@oviglobaluniform.com</span>
              </li>
            </ul>
            <div className="w-full h-48 rounded-xl overflow-hidden border border-hairline shadow-sm">
              <iframe 
                src="https://maps.google.com/maps?q=WALRIE+-+Exclusive+Gown+Store&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Store Location"
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="pt-8 border-t border-hairline flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <p className="text-muted text-[13px] font-light uppercase tracking-wider">
            © {new Date().getFullYear()} OVI GLOBAL UNIFORM. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-4">
             {/* Payment Icons */}
             <div className="h-8 w-14 bg-surface-card border border-hairline rounded flex items-center justify-center text-ink font-bold text-[10px]">VISA</div>
             <div className="h-8 w-14 bg-surface-card border border-hairline rounded flex items-center justify-center text-ink font-bold text-[10px]">MASTER</div>
             <div className="h-8 w-14 bg-surface-card border border-hairline rounded flex items-center justify-center text-ink font-bold text-[10px]">UPI</div>
             <div className="h-8 w-14 bg-surface-card border border-hairline rounded flex items-center justify-center text-ink font-bold text-[10px]">COD</div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
