import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform } from 'motion/react';
import { Search, ArrowRight, ShieldCheck, Truck, RefreshCw, Star, ArrowUpRight, Scissors, Factory } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import QuickViewModal from '../components/product/QuickViewModal';
import { PRODUCTS } from '../constants';
import { Product } from '../types';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function Home() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 400]);
  const heroTextY = useTransform(scrollY, [0, 500], [0, 150]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <div className="flex flex-col bg-canvas text-body-text">
      <Helmet>
        <title>Ovi Global Uniform | Dress for Excellence</title>
        <meta name="description" content="Premium, durable, and comfortable uniforms for Schools, Colleges, Hospitals, and Corporate Administration." />
      </Helmet>

      {/* Cinematic Hero Section */}
      <section className="relative h-[95vh] flex items-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ y: heroY }}
        >
          <img
            src="https://picsum.photos/seed/uniform-hero/1920/1080"
            alt="Professionals in uniform"
            className="w-full h-full object-cover brightness-[0.7]"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-canvas/95 via-canvas/70 to-transparent" />
        </motion.div>

        <div className="container-custom relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            style={{ y: heroTextY, opacity: heroOpacity }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-primary/90 text-on-primary font-medium text-sm mb-6 tracking-wide shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              Premium Manufacturer & Supplier
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-[76px] font-bold text-ink leading-[1.05] mb-6 tracking-tight">
              Dress for Excellence with <br />
              Ovi Global Uniform.
            </h1>
            <p className="text-[18px] md:text-[20px] text-body-text mb-10 leading-[1.6] max-w-xl font-light">
              Premium, durable, and comfortable uniforms for Schools, Colleges, Hospitals, and Corporate Administration.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
                Explore Our Collection
              </Link>
              <Link to="/contact" className="btn-secondary border-hairline-strong hover:bg-surface-card hover:border-ink">
                Request a Bulk Quote
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-24 bg-surface-card border-b border-hairline relative z-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight"
            >
              Welcome to Ovi Global Uniform
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted leading-relaxed font-light"
            >
              At Ovi Global Uniform, we believe that the right attire fosters unity, professionalism, and confidence.
              Whether you are equipping the next generation of students or outfitting dedicated healthcare heroes,
              we manufacture uniforms that combine all-day comfort with long-lasting durability.
            </motion.p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <motion.div variants={fadeUpVariant} className="flex flex-col items-center text-center p-6 bg-canvas rounded-2xl border border-hairline shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mb-6 text-primary shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <Star size={28} />
              </div>
              <h4 className="font-bold text-xl text-ink mb-3">Premium Fabrics</h4>
              <p className="text-muted text-sm font-light leading-relaxed">Breathable, skin-friendly, and easy to wash materials selected for daily wear.</p>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="flex flex-col items-center text-center p-6 bg-canvas rounded-2xl border border-hairline shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mb-6 text-primary shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <Scissors size={28} />
              </div>
              <h4 className="font-bold text-xl text-ink mb-3">Custom Fits & Tailoring</h4>
              <p className="text-muted text-sm font-light leading-relaxed">Ensuring every individual feels comfortable and confident in their everyday attire.</p>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="flex flex-col items-center text-center p-6 bg-canvas rounded-2xl border border-hairline shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mb-6 text-primary shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <Factory size={28} />
              </div>
              <h4 className="font-bold text-xl text-ink mb-3">Bulk Order Specialists</h4>
              <p className="text-muted text-sm font-light leading-relaxed">Timely delivery and consistent quality for institutions of all sizes.</p>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="flex flex-col items-center text-center p-6 bg-canvas rounded-2xl border border-hairline shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mb-6 text-primary shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <ShieldCheck size={28} />
              </div>
              <h4 className="font-bold text-xl text-ink mb-3">Unbeatable Durability</h4>
              <p className="text-muted text-sm font-light leading-relaxed">Stitched to precision to withstand daily wear and tear for years to come.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-canvas border-b border-hairline overflow-hidden">
        <div className="container-custom">
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-ink tracking-tight mb-4">Our Products</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto font-light">Explore our specialized categories designed for different professional needs.</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Category 1 */}
            <motion.div variants={fadeUpVariant} className="group relative rounded-3xl overflow-hidden bg-surface-card aspect-[4/5] shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-hairline">
              <img src="https://picsum.photos/seed/school-uniform/800/1000" alt="School Uniforms" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-bold text-white mb-2">School & College Uniforms</h3>
                <p className="text-sm text-gray-300 font-light mb-6 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  Fostering equality and pride. Shirts, trousers, blazers, and sports uniforms built for the classroom and beyond.
                </p>
                <Link to={`/shop?category=${encodeURIComponent('School & College Uniforms')}`} className="inline-flex items-center gap-2 text-white font-medium hover:text-primary transition-colors">
                  Explore Category <ArrowUpRight size={18} />
                </Link>
              </div>
            </motion.div>

            {/* Category 2 */}
            <motion.div variants={fadeUpVariant} className="group relative rounded-3xl overflow-hidden bg-surface-card aspect-[4/5] shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-hairline">
              <img src="https://picsum.photos/seed/hospital-uniform/800/1000" alt="Hospital Uniforms" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Hospital Staff Uniforms</h3>
                <p className="text-sm text-gray-300 font-light mb-6 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  Hygiene, flexibility, and comfort. Medical scrubs, lab coats, and staff tunics for healthcare heroes.
                </p>
                <Link to={`/shop?category=${encodeURIComponent('Hospital Staff Uniforms')}`} className="inline-flex items-center gap-2 text-white font-medium hover:text-primary transition-colors">
                  Explore Category <ArrowUpRight size={18} />
                </Link>
              </div>
            </motion.div>

            {/* Category 3 */}
            <motion.div variants={fadeUpVariant} className="group relative rounded-3xl overflow-hidden bg-surface-card aspect-[4/5] shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-hairline">
              <img src="https://picsum.photos/seed/admin-uniform/800/1000" alt="Admin Uniforms" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Admin Uniforms & Dresses</h3>
                <p className="text-sm text-gray-300 font-light mb-6 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  Make a lasting first impression. Corporate suits, formal shirts, receptionist dresses, and accessories.
                </p>
                <Link to={`/shop?category=${encodeURIComponent('Admin Uniforms & Dresses')}`} className="inline-flex items-center gap-2 text-white font-medium hover:text-primary transition-colors">
                  Explore Category <ArrowUpRight size={18} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-canvas border-b border-hairline overflow-hidden">
        <div className="container-custom">
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6"
          >
            <div>
              <h2 className="text-4xl font-bold text-ink tracking-tight mb-2">Ready to Ship</h2>
              <p className="text-muted font-light">Our most popular standard garments.</p>
            </div>
            <Link to="/shop" className="text-ink font-semibold hover:text-primary flex items-center gap-2 transition-colors">
              View All Products <ArrowRight size={18} />
            </Link>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {PRODUCTS.filter(p => p.isFeatured).map((product) => (
              <motion.div key={product.id} variants={fadeUpVariant}>
                <ProductCard product={product} onQuickView={setQuickViewProduct} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-24 bg-surface-card border-y border-hairline relative overflow-hidden">
        <div className="container-custom relative z-10">
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-ink">Partner with Ovi Global Uniform</h2>
            <p className="text-lg text-muted font-light mb-10 max-w-2xl mx-auto">
              Ready to upgrade your institution's wardrobe? Get in touch with us today to discuss bulk orders, custom designs, and fabric swatches.
            </p>
            <div className="flex justify-center">
              <Link to="/contact" className="bg-ink text-canvas hover:scale-105 active:scale-95 transition-all shadow-[0_8px_30px_rgba(255,255,255,0.1)] rounded-full py-4 px-8 text-lg font-bold inline-flex items-center justify-center">
                Contact Us Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
