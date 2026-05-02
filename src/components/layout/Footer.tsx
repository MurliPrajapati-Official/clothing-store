import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-canvas border-t border-hairline text-body pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="flex flex-col h-6 w-10 gap-0.5">
                <div className="flex-1 bg-m-blue-light" />
                <div className="flex-1 bg-m-blue-dark" />
                <div className="flex-1 bg-m-red" />
              </div>
              <span className="font-extrabold text-2xl tracking-tighter text-white uppercase italic">
                UNIFORMKART
              </span>
            </Link>
            <p className="text-muted mb-8 leading-relaxed text-sm">
              ENGINEERED FOR EXCELLENCE. India's premier specialized platform for high-performance school uniforms and technical educational gear.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold mb-8 uppercase tracking-[1.5px] text-white">Models / Series</h4>
            <ul className="space-y-4 text-muted text-sm font-bold uppercase tracking-widest">
              {['Boys Series', 'Girls Series', 'Winter Tech', 'Track & Field', 'M-Performance', 'Tactical Gear'].map((item) => (
                <li key={item}>
                  <Link to="/shop" className="hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold mb-8 uppercase tracking-[1.5px] text-white">Services</h4>
            <ul className="space-y-4 text-muted text-sm font-bold uppercase tracking-widest">
              {['About The Brand', 'Support Center', 'Calculated Sizing', 'Fleet Solutions', 'Terms & Conditions', 'Data Privacy'].map((item) => (
                <li key={item}>
                  <Link to="#" className="hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold mb-8 uppercase tracking-[1.5px] text-white">Contact</h4>
            <ul className="space-y-6 text-sm">
              <li className="flex gap-4">
                <MapPin className="text-white shrink-0" size={18} />
                <span className="text-muted">High-Performance Center, Phase III, Okhla, New Delhi</span>
              </li>
              <li className="flex gap-4">
                <Phone className="text-white shrink-0" size={18} />
                <span className="text-muted">+91 (11) 4500-1200</span>
              </li>
              <li className="flex gap-4">
                <Mail className="text-white shrink-0" size={18} />
                <span className="text-muted">operations@uniformkart.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-hairline flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-muted text-[10px] font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} UNIFORMKART MOTORSPORT CLOTHING. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
             {/* Payment Icons */}
             <div className="h-4 w-10 bg-white/20 rounded-sm" />
             <div className="h-4 w-10 bg-white/20 rounded-sm" />
             <div className="h-4 w-10 bg-white/20 rounded-sm" />
          </div>
        </div>
      </div>
    </footer>
  );
}
