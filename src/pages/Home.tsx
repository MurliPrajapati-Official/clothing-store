import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform } from 'motion/react';
import { Search, ArrowRight, ShieldCheck, Truck, RefreshCw, Star, ArrowUpRight, Scissors, Factory } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import ProductSkeleton from '../components/product/ProductSkeleton';
import QuickViewModal from '../components/product/QuickViewModal';
import HomeSkeleton from '../components/layout/HomeSkeleton';
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
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // AUTO-DETECT PRODUCTION
        if (window.location.hostname.includes('uniformtrends.in')) {
          apiUrl = 'https://uniformtrends.onrender.com';
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const res = await fetch(`${apiUrl}/api/products`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setFeaturedProducts(data.slice(0, 4));
      } catch (err) {
        console.error("Failed to load featured products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="flex flex-col bg-canvas text-body-text">
      <Helmet>
        <title>Best School & Corporate Uniforms in India | Uniform Trends</title>
        <meta name="description" content="Uniform Trends By WEA provides premium, durable, and custom-tailored uniforms for schools, hospitals, and corporate offices across India. Experience the perfect fit today." />
        <link rel="canonical" href="https://uniformtrends.in/" />
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
            <h1 className="text-[28px] sm:text-4xl md:text-5xl lg:text-[76px] font-bold text-ink leading-[1.1] mb-6 tracking-tight break-words">
              Best School & Corporate <br />
              Uniforms in India.
            </h1>
            <p className="text-[18px] md:text-[20px] text-body-text mb-10 leading-[1.6] max-w-xl font-light">
              Premium, durable, and comfortable uniforms for Schools, Colleges, Hospitals, and Corporate Administration (by WALRIE).
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
              viewport={{ once: true, margin: "-20px" }}
              className="text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight"
            >
              Welcome to Uniform Trends
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted leading-relaxed font-light"
            >
              At Uniform Trends (By WEA), we believe that the right attire fosters unity, professionalism, and confidence.
              As a leading national uniform manufacturer, we specialize in high-performance garments for schools, 
              hospitals, and industrial sectors across India. Whether you are equipping the next generation of students 
              or outfitting dedicated healthcare heroes, we manufacture uniforms that combine all-day comfort with 
              unmatched durability for the demanding climates.
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
            viewport={{ once: true, margin: "-20px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-ink tracking-tight mb-4">Our Products</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto font-light">Explore our specialized categories designed for different professional needs.</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
          >
            {/* Category 1: School */}
            <motion.div variants={fadeUpVariant} className="group relative rounded-3xl overflow-hidden bg-surface-card aspect-[4/5] shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-hairline">
              <img src="/products/school_1.webp" alt="School Uniforms" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 md:p-8">
                <h3 className="text-lg md:text-2xl font-bold text-white mb-2">School Uniforms</h3>
                <p className="hidden md:block text-sm text-gray-300 font-light mb-6 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  Durable, comfortable, and professional attire for the next generation of leaders.
                </p>
                <Link to={`/shop?category=${encodeURIComponent('School')}`} className="inline-flex items-center gap-2 text-white font-medium hover:text-primary transition-colors text-sm md:text-base">
                  Explore <ArrowUpRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* Category 2: College */}
            <motion.div variants={fadeUpVariant} className="group relative rounded-3xl overflow-hidden bg-surface-card aspect-[4/5] shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-hairline">
              <img src="/products/college_1.webp" alt="College Uniforms" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 md:p-8">
                <h3 className="text-lg md:text-2xl font-bold text-white mb-2">College Wear</h3>
                <p className="hidden md:block text-sm text-gray-300 font-light mb-6 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  Modern varsity jackets and formal attire for higher education excellence.
                </p>
                <Link to={`/shop?category=${encodeURIComponent('College')}`} className="inline-flex items-center gap-2 text-white font-medium hover:text-primary transition-colors text-sm md:text-base">
                  Explore <ArrowUpRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* Category 3: Corporate */}
            <motion.div variants={fadeUpVariant} className="group relative rounded-3xl overflow-hidden bg-surface-card aspect-[4/5] shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-hairline">
              <img src="/products/corporate_1.webp" alt="Corporate Uniforms" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 md:p-8">
                <h3 className="text-lg md:text-2xl font-bold text-white mb-2">Corporate Attire</h3>
                <p className="hidden md:block text-sm text-gray-300 font-light mb-6 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  Sharp business suits and professional outfits for modern administrative excellence.
                </p>
                <Link to={`/shop?category=${encodeURIComponent('Corporate')}`} className="inline-flex items-center gap-2 text-white font-medium hover:text-primary transition-colors text-sm md:text-base">
                  Explore <ArrowUpRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* Category 4: Hospital */}
            <motion.div variants={fadeUpVariant} className="group relative rounded-3xl overflow-hidden bg-surface-card aspect-[4/5] shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-hairline">
              <img src="/products/hospital_1.webp" alt="Hospital Uniforms" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 md:p-8">
                <h3 className="text-lg md:text-2xl font-bold text-white mb-2">Healthcare Heroes</h3>
                <p className="hidden md:block text-sm text-gray-300 font-light mb-6 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  Premium surgical scrubs and lab coats designed for hygiene and comfort.
                </p>
                <Link to={`/shop?category=${encodeURIComponent('Hospital')}`} className="inline-flex items-center gap-2 text-white font-medium hover:text-primary transition-colors text-sm md:text-base">
                  Explore <ArrowUpRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* Category 5: Hotels */}
            <motion.div variants={fadeUpVariant} className="group relative rounded-3xl overflow-hidden bg-surface-card aspect-[4/5] shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-hairline">
              <img src="/products/hotel_1.webp" alt="Hotel Uniforms" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 md:p-8">
                <h3 className="text-lg md:text-2xl font-bold text-white mb-2">Hotels & Hospitality</h3>
                <p className="hidden md:block text-sm text-gray-300 font-light mb-6 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  Elegant front-desk and culinary uniforms for a superior hospitality experience.
                </p>
                <Link to={`/shop?category=${encodeURIComponent('Hotels')}`} className="inline-flex items-center gap-2 text-white font-medium hover:text-primary transition-colors text-sm md:text-base">
                  Explore <ArrowUpRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* Category 6: Factory */}
            <motion.div variants={fadeUpVariant} className="group relative rounded-3xl overflow-hidden bg-surface-card aspect-[4/5] shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-hairline">
              <img src="/products/factory_1.webp" alt="Factory Uniforms" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 md:p-8">
                <h3 className="text-lg md:text-2xl font-bold text-white mb-2">Industrial & Factory</h3>
                <p className="hidden md:block text-sm text-gray-300 font-light mb-6 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  Rugged, heavy-duty safety gear and uniforms for industrial environments.
                </p>
                <Link to={`/shop?category=${encodeURIComponent('Factory')}`} className="inline-flex items-center gap-2 text-white font-medium hover:text-primary transition-colors text-sm md:text-base">
                  Explore <ArrowUpRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* Category 7: CCL/CIL */}
            <motion.div variants={fadeUpVariant} className="group relative rounded-3xl overflow-hidden bg-surface-card aspect-[4/5] shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-hairline">
              <img src="/products/ccl_cil_1.webp" alt="CCL/CIL Uniforms" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 md:p-8">
                <h3 className="text-lg md:text-2xl font-bold text-white mb-2">CCL/CIL Specials</h3>
                <p className="hidden md:block text-sm text-gray-300 font-light mb-6 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  Specialized heavy-duty uniforms and safety workwear for mining and PSU sectors.
                </p>
                <Link to={`/shop?category=${encodeURIComponent('CCL/CIL')}`} className="inline-flex items-center gap-2 text-white font-medium hover:text-primary transition-colors text-sm md:text-base">
                  Explore <ArrowUpRight size={16} />
                </Link>
              </div>
            </motion.div>

            {/* Category 8: Defence */}
            <motion.div variants={fadeUpVariant} className="group relative rounded-3xl overflow-hidden bg-surface-card aspect-[4/5] shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-hairline">
              <img src="/products/defence_1.webp" alt="Defence Uniforms" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 md:p-8">
                <h3 className="text-lg md:text-2xl font-bold text-white mb-2">Defence</h3>
                <p className="hidden md:block text-sm text-gray-300 font-light mb-6 opacity-0 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  Tactical gear and high-performance uniforms for defence and paramilitary forces.
                </p>
                <Link to={`/shop?category=${encodeURIComponent('Defence')}`} className="inline-flex items-center gap-2 text-white font-medium hover:text-primary transition-colors text-sm md:text-base">
                  Explore <ArrowUpRight size={16} />
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
            viewport={{ once: true, margin: "-20px" }}
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
            viewport={{ once: true, margin: "-20px" }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
          >
            {featuredProducts.length === 0 ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </>
            ) : (
              featuredProducts.map((product) => (
                <motion.div key={product.id} variants={fadeUpVariant}>
                  <ProductCard product={product} onQuickView={setQuickViewProduct} />
                </motion.div>
              ))
            )}
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
            viewport={{ once: true, margin: "-20px" }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-ink">Partner By WEA</h2>
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
