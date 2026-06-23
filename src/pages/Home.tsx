import { useState, useEffect } from 'react';
import SEO from '../components/layout/SEO';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Star, ArrowUpRight, Scissors, Factory, Plus, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import ProductSkeleton from '../components/product/ProductSkeleton';
import QuickViewModal from '../components/product/QuickViewModal';
import HomeSkeleton from '../components/layout/HomeSkeleton';
import { Product } from '../types';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const CATEGORIES_GRID = [
  { name: 'School Uniforms', image: '/products/gen_school_1.png', category: 'School', desc: 'For the next generation' },
  { name: 'College Wear', image: '/products/gen_college_1.png', category: 'College', desc: 'Modern campus style' },
  { name: 'Corporate Attire', image: '/products/gen_corporate_1.png', category: 'Corporate', desc: 'Executive excellence' },
  { name: 'Medical & Scrubs', image: '/products/gen_hospital_1.png', category: 'Hospital', desc: 'Healthcare heroes' },
  { name: 'Hotel & Hospitality', image: '/products/gen_hotel_1.png', category: 'Hotels', desc: 'Front-desk elegance' },
  { name: 'Industrial & Factory', image: '/products/gen_factory_1.png', category: 'Factory', desc: 'Heavy-duty safety' },
  { name: 'CCL / CIL', image: '/products/gen_ccl_cil_1.png', category: 'CCL/CIL', desc: 'Mining & PSU sector' },
  { name: 'Defence', image: '/products/gen_defence_1.png', category: 'Defence', desc: 'Tactical performance' },
];

const TESTIMONIALS = [
  { name: 'Rajesh Kumar', role: 'Principal, Delhi Public School', text: 'Uniform Trends has been our trusted partner for 5+ years. The quality is consistently excellent and they handle our 2000+ student orders seamlessly.', rating: 5 },
  { name: 'Dr. Anita Sharma', role: 'Head of Procurement, Apollo Hospitals', text: 'The scrubs and lab coats are incredibly durable. Our staff loves the antimicrobial fabric and the comfortable fit throughout long shifts.', rating: 5 },
  { name: 'Priya Mehta', role: 'HR Director, Tata Consultancy', text: 'Professional, reliable, and attentive to our corporate branding requirements. The blazers and shirts look absolutely premium.', rating: 5 },
];

import { getApiUrl } from '../config';

export default function Home() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 200]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        let apiUrl = getApiUrl();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const res = await fetch(`${apiUrl}/api/products`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setFeaturedProducts(data.slice(0, 8));
      } catch (err) {
        console.error("Failed to load featured products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="flex flex-col bg-canvas text-body-text">
      <SEO
        title="Uniform Trends — Premium Uniforms for Schools, Corporates & Healthcare | Shop Now"
        description="Shop India's finest uniforms. Premium quality school wear, corporate suits, hospital scrubs & more. Free shipping on bulk orders. Trusted by 500+ institutions."
        keywords="school uniforms India, best school uniforms Mumbai, corporate uniform manufacturers, hospital scrubs wholesale, uniform supplier Delhi, custom uniforms, Uniform Trends, buy uniforms online"
      />

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-sand border-b border-hairline">
        {/* Subtle decorative elements */}
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/1 blur-3xl" />

        <div className="container-custom relative z-10 pt-28 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none bg-ink text-white font-bold text-xs mb-6 tracking-widest uppercase">
                <Award size={12} />
                Trusted by 500+ Institutions
              </span>
              <h1 className="text-[32px] sm:text-5xl md:text-6xl lg:text-[68px] font-black text-ink leading-[1.08] mb-6 tracking-tight">
                Premium Uniforms,{' '}
                <span className="text-primary font-black">Crafted</span>{' '}
                for Excellence.
              </h1>
              <p className="text-lg md:text-xl text-body-text mb-10 leading-relaxed max-w-xl font-light">
                From school halls to hospital corridors — discover uniforms that combine unmatched comfort, durability, and style. Made in India with love.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="btn-primary text-sm px-10 font-bold uppercase tracking-widest">
                  Shop Now <ArrowRight size={16} className="ml-2" />
                </Link>
                <Link to="/contact" className="btn-outline text-sm px-8 font-bold uppercase tracking-widest">
                  Request Bulk Quote
                </Link>
              </div>

              {/* Mini stats */}
              <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-hairline">
                <div>
                  <span className="text-3xl font-black text-ink">500+</span>
                  <p className="text-sm text-muted font-medium">Schools & Institutions</p>
                </div>
                <div>
                  <span className="text-3xl font-black text-ink">50K+</span>
                  <p className="text-sm text-muted font-medium">Uniforms Delivered</p>
                </div>
                <div>
                  <span className="text-3xl font-black text-ink">4.9★</span>
                  <p className="text-sm text-muted font-medium">Customer Rating</p>
                </div>
              </div>
            </motion.div>

            {/* Right: Hero Image Grid */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
              className="relative hidden lg:block"
              style={{ y: heroY }}
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  {/* Staggered Frame 1 */}
                  <div className="relative group/hero">
                    <div className="absolute inset-0 bg-sand-dark translate-x-2 translate-y-2 z-0 pointer-events-none" />
                    <div className="relative z-10 bg-white border border-hairline aspect-[3/4] overflow-hidden rounded-none">
                      <img src="/products/gen_school_1.png" alt="School Uniforms" className="w-full h-full object-cover transition-transform duration-[1.5s] hover:scale-105" loading="eager" />
                    </div>
                  </div>
                  {/* Staggered Frame 2 */}
                  <div className="relative group/hero">
                    <div className="absolute inset-0 bg-sand-dark translate-x-2 translate-y-2 z-0 pointer-events-none" />
                    <div className="relative z-10 bg-white border border-hairline aspect-square overflow-hidden rounded-none">
                      <img src="/products/gen_hospital_1.png" alt="Medical Scrubs" className="w-full h-full object-cover transition-transform duration-[1.5s] hover:scale-105" loading="eager" />
                    </div>
                  </div>
                </div>
                <div className="space-y-6 pt-12">
                  {/* Staggered Frame 3 */}
                  <div className="relative group/hero">
                    <div className="absolute inset-0 bg-sand-dark translate-x-2 translate-y-2 z-0 pointer-events-none" />
                    <div className="relative z-10 bg-white border border-hairline aspect-square overflow-hidden rounded-none">
                      <img src="/products/gen_corporate_1.png" alt="Corporate Attire" className="w-full h-full object-cover transition-transform duration-[1.5s] hover:scale-105" loading="eager" />
                    </div>
                  </div>
                  {/* Staggered Frame 4 */}
                  <div className="relative group/hero">
                    <div className="absolute inset-0 bg-sand-dark translate-x-2 translate-y-2 z-0 pointer-events-none" />
                    <div className="relative z-10 bg-white border border-hairline aspect-[3/4] overflow-hidden rounded-none">
                      <img src="/products/gen_hotel_1.png" alt="Hospitality Uniforms" className="w-full h-full object-cover transition-transform duration-[1.5s] hover:scale-105" loading="eager" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -left-6 top-1/2 bg-white rounded-none shadow-[8px_8px_0_rgba(15,23,42,0.05)] border border-hairline px-6 py-4 flex items-center gap-3.5 z-20">
                <div className="w-10 h-10 bg-[#0f172a] flex items-center justify-center text-white shrink-0">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-[#0f172a] uppercase tracking-widest">Free Delivery</p>
                  <p className="text-[10px] text-muted font-bold mt-0.5">On bulk orders</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TRUST BADGES BAR ─── */}
      <section className="bg-sand border-b border-hairline py-8 relative z-20">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: <Truck size={22} />, title: 'Free Shipping', desc: 'On orders above ₹5,000' },
              { icon: <ShieldCheck size={22} />, title: 'Quality Guarantee', desc: 'Premium fabrics only' },
              { icon: <RefreshCw size={22} />, title: 'Easy Returns', desc: 'Hassle-free 7 days' },
              { icon: <Clock size={22} />, title: 'Fast Turnaround', desc: 'Bulk orders in 3 weeks' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-3 md:gap-4">
                <div className="w-11 h-11 rounded-none border border-hairline bg-white flex items-center justify-center text-ink shrink-0">
                  {badge.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-ink">{badge.title}</h4>
                  <p className="text-xs text-muted font-medium">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SHOP BY CATEGORY ─── */}
      <section className="py-20 md:py-28 bg-white overflow-hidden">
        <div className="container-custom">
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <span className="text-muted font-semibold text-sm uppercase tracking-widest mb-2 block font-medium">Categories</span>
              <h2 className="text-3xl md:text-5xl font-black text-ink tracking-tight">Shop by Category</h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-ink font-bold hover:underline underline-offset-4 transition-all">
              View All <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {CATEGORIES_GRID.map((cat) => (
              <motion.div key={cat.category} variants={fadeUpVariant}>
                <Link
                  to={`/shop?category=${encodeURIComponent(cat.category)}`}
                  className="group block relative"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-surface-soft border border-hairline mb-4 rounded-none">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105" 
                      loading="lazy" 
                    />
                    <div className="absolute inset-0 bg-[#0f172a]/0 group-hover:bg-[#0f172a]/5 transition-colors duration-500" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-muted uppercase font-black tracking-widest block mb-1">
                      {cat.desc}
                    </span>
                    <h3 className="text-base md:text-lg font-black text-[#0f172a] group-hover:underline transition-all leading-tight">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-8 md:hidden text-center">
            <Link to="/shop" className="inline-flex items-center gap-2 text-ink font-bold hover:underline">
              View All Categories <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TRENDING / FEATURED PRODUCTS ─── */}
      <section className="py-20 md:py-28 bg-sand border-y border-hairline overflow-hidden">
        <div className="container-custom">
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <span className="text-muted font-semibold text-sm uppercase tracking-widest mb-2 block font-medium">Bestsellers</span>
              <h2 className="text-3xl md:text-5xl font-black text-ink tracking-tight">Trending Now</h2>
              <p className="text-muted text-sm md:text-base font-medium mt-2">Our most popular ready-to-ship uniforms.</p>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-ink font-bold hover:underline underline-offset-4 transition-all">
              View All Products <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {featuredProducts.length === 0 ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </>
            ) : (
              featuredProducts.slice(0, 4).map((product) => (
                <motion.div key={product.id} variants={fadeUpVariant}>
                  <ProductCard product={product} onQuickView={setQuickViewProduct} />
                </motion.div>
              ))
            )}
          </motion.div>

          <div className="mt-8 md:hidden text-center">
            <Link to="/shop" className="inline-flex items-center gap-2 text-ink font-bold hover:underline">
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE US ─── */}
      <section className="py-20 md:py-28 bg-white overflow-hidden">
        <div className="container-custom">
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            className="text-center mb-16"
          >
            <span className="text-muted font-semibold text-sm uppercase tracking-widest mb-2 block font-medium">Why Uniform Trends</span>
            <h2 className="text-3xl md:text-5xl font-black text-ink tracking-tight mb-4">Built for Quality. Designed for Comfort.</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">Every stitch, every fabric choice, every detail — engineered for the demands of daily professional wear.</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
          >
            {[
              { icon: <Star size={24} />, title: 'Premium Fabrics', desc: 'Breathable, skin-friendly materials that last 2x longer than standard uniforms.' },
              { icon: <Scissors size={24} />, title: 'Custom Tailoring', desc: 'Precision fits with computerized embroidery and custom branding for your institution.' },
              { icon: <Factory size={24} />, title: 'Bulk Order Ready', desc: 'From 50 to 50,000 pieces — consistent quality with timely delivery, always.' },
              { icon: <ShieldCheck size={24} />, title: 'Quality Assured', desc: 'Multi-point inspection, colorfastness testing, and a full manufacturing defect guarantee.' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUpVariant} className="flex flex-col items-center text-center p-6 md:p-8 bg-sand rounded-none border border-hairline/60 hover:border-ink transition-all duration-300">
                <div className="w-14 h-14 bg-ink rounded-none flex items-center justify-center mb-5 text-white">
                  {item.icon}
                </div>
                <h4 className="font-bold text-base md:text-lg text-ink mb-2">{item.title}</h4>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 md:py-28 bg-sand border-b border-hairline overflow-hidden">
        <div className="container-custom">
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="text-muted font-semibold text-sm uppercase tracking-widest mb-4 block font-medium">What Our Clients Say</span>
            <h2 className="text-3xl md:text-5xl font-black text-ink tracking-tight mb-12">Trusted by India's Best</h2>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-none p-8 md:p-12 border border-hairline shadow-sm"
                >
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(TESTIMONIALS[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} size={18} className="text-warning fill-warning" />
                    ))}
                  </div>
                  <p className="text-lg md:text-xl text-body-text leading-relaxed mb-8 italic">
                    "{TESTIMONIALS[activeTestimonial].text}"
                  </p>
                  <div>
                    <p className="font-bold text-ink">{TESTIMONIALS[activeTestimonial].name}</p>
                    <p className="text-sm text-muted">{TESTIMONIALS[activeTestimonial].role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation dots */}
              <div className="flex justify-center gap-2 mt-8">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`w-3 h-1 transition-all duration-300 ${i === activeTestimonial ? 'bg-ink w-8' : 'bg-ink/20 hover:bg-ink/40'}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FAQ SECTION ─── */}
      <section className="py-20 md:py-28 bg-white overflow-hidden">
        <div className="container-custom max-w-4xl mx-auto">
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            className="text-center mb-14"
          >
            <span className="text-muted font-semibold text-sm uppercase tracking-widest mb-2 block font-medium">FAQs</span>
            <h2 className="text-3xl md:text-5xl font-black text-ink tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Everything you need to know about ordering, customization, and delivery.
            </p>
          </motion.div>

          <div className="space-y-3">
            {[
              {
                q: "What is the minimum order quantity (MOQ) for custom uniforms?",
                a: "Our standard MOQ for custom school and corporate uniform orders is 50 sets per style. However, we also offer ready-to-ship sizes with no minimum order — just add to cart and checkout!"
              },
              {
                q: "Do you provide fabric swatches and samples before production?",
                a: "Absolutely. We ship physical fabric swatches and tailored fit samples to institutional buyers so you can inspect quality, weight, and color fastness before committing to a bulk order."
              },
              {
                q: "Can we add our school/company logo and branding?",
                a: "Yes! We offer premium computerized embroidery, high-definition screen printing, and heat-transfer vinyl for school crests, company logos, names, and custom tags."
              },
              {
                q: "What is the delivery timeline for bulk orders?",
                a: "Bulk institutional orders typically take 3–4 weeks from approval to doorstep delivery. Ready-to-ship catalog items are dispatched within 2–3 business days."
              },
              {
                q: "Do you offer a warranty or replacement guarantee?",
                a: "All our uniforms undergo rigorous quality testing including double-stitch reinforcement and colorfastness checks. We provide a full replacement guarantee against any manufacturing defects."
              }
            ].map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="border-b border-hairline bg-transparent overflow-hidden hover:border-ink/60 transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full py-5 flex items-center justify-between text-left transition-all hover:bg-sand/30"
                  >
                    <span className="font-bold text-base md:text-lg text-ink pr-4 leading-snug">
                      {faq.q}
                    </span>
                    <span className={`w-8 h-8 rounded-none border border-hairline flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-ink border-ink text-white rotate-45' : 'bg-canvas text-ink'}`}>
                      <Plus size={16} />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="pb-6 pr-6 text-sm md:text-base text-body-text leading-relaxed pt-2">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER / CTA ─── */}
      <section className="py-20 md:py-28 bg-sand border-y border-hairline relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/2 rounded-none blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/2 rounded-none blur-3xl pointer-events-none" />

        <div className="container-custom relative z-10">
          <motion.div
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-20px" }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight text-ink">Ready to Upgrade Your Uniforms?</h2>
            <p className="text-lg text-body-text mb-10 max-w-2xl mx-auto font-light">
              Join 500+ institutions who trust Uniform Trends for premium quality, custom designs, and reliable delivery.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/shop" className="btn-primary text-sm px-10 font-bold uppercase tracking-widest">
                Start Shopping <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link to="/contact" className="btn-outline text-sm px-8 font-bold uppercase tracking-widest flex items-center justify-center">
                Get a Custom Quote
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
