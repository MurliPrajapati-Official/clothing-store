import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';
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
              <div className="flex items-center justify-center w-10 h-10 bg-surface-card border border-hairline rounded-lg text-ink font-serif font-black text-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                U
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-ink">
                Uniform<span className="font-light">Kart</span>
              </span>
            </Link>
            <p className="text-body-text mb-8 leading-relaxed font-light text-[15px]">
              Engineered for excellence. India's premium specialized platform for comfortable, durable, and stylish school uniforms and institutional wear.
            </p>
            <div className="flex gap-4">
               <a href="#" className="p-2 bg-surface-card rounded-full hover:bg-warning hover:text-canvas transition-all duration-300 hover:scale-110 active:scale-95">
                  <Facebook size={18} />
               </a>
               <a href="#" className="p-2 bg-surface-card rounded-full hover:bg-warning hover:text-canvas transition-all duration-300 hover:scale-110 active:scale-95">
                  <Instagram size={18} />
               </a>
               <a href="#" className="p-2 bg-surface-card rounded-full hover:bg-warning hover:text-canvas transition-all duration-300 hover:scale-110 active:scale-95">
                  <Youtube size={18} />
               </a>
            </div>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <h4 className="text-[15px] font-bold mb-6 text-ink tracking-wide">Category</h4>
            <ul className="space-y-4 text-body-text font-light">
              {['School Uniforms', 'Winter Wear', 'Sportswear', 'Institutional Wear', 'Shoes & Accessories', 'Custom Bulk Orders'].map((item) => (
                <li key={item}>
                  <Link to="/shop" className="hover:text-warning transition-colors block">{item}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <h4 className="text-[15px] font-bold mb-6 text-ink tracking-wide">Quick Links</h4>
            <ul className="space-y-4 text-body-text font-light">
              {['About Us', 'Size Guide', 'Track Order', 'Return Policy', 'Terms & Conditions', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link to="#" className="hover:text-warning transition-colors block">{item}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <h4 className="text-[15px] font-bold mb-6 text-ink tracking-wide">Contact Us</h4>
            <ul className="space-y-6 font-light text-body-text">
              <li className="flex gap-4 items-start">
                <MapPin className="text-warning shrink-0 mt-1" size={20} />
                <span>Sector 22, Premium Industrial Estate, New Delhi, India 110001</span>
              </li>
              <li className="flex gap-4 items-center">
                <Phone className="text-warning shrink-0" size={20} />
                <span>+91 (11) 4500-1200</span>
              </li>
              <li className="flex gap-4 items-center">
                <Mail className="text-warning shrink-0" size={20} />
                <span>support@uniformkart.com</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="pt-8 border-t border-hairline flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <p className="text-muted text-[13px] font-light">
            © {new Date().getFullYear()} UNIFORMKART. ALL RIGHTS RESERVED.
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
