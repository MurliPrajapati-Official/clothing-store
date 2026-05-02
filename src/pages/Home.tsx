import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform } from 'motion/react';
import { Search, ArrowRight, ShieldCheck, Truck, RefreshCw, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { PRODUCTS, SCHOOLS, CATEGORIES } from '../constants';

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
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <div className="flex flex-col bg-canvas text-body-text">
      <Helmet>
        <title>UniformKart | Premium School & Institutional Wear</title>
        <meta name="description" content="Discover premium school uniforms, blazers, shoes and accessories. Trustworthy, comfortable, and officially approved for top institutions." />
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
            src="https://picsum.photos/seed/hero/1920/1080" 
            alt="Students in uniform"
            className="w-full h-full object-cover brightness-[0.85]"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-canvas/90 via-canvas/50 to-transparent" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            style={{ y: heroTextY, opacity: heroOpacity }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-m-red/90 text-white font-medium text-sm mb-6 tracking-wide shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              Premium Collection 2026
            </span>
            <h1 className="text-[52px] md:text-[76px] font-bold text-white leading-[1.05] mb-6 tracking-tight">
              A New Standard in <br />
              School Uniforms.
            </h1>
            <p className="text-[18px] md:text-[20px] text-gray-200 mb-10 leading-[1.6] max-w-xl font-light">
              Impeccable quality, exceptional comfort, and officially approved designs. 
              Elevating the daily wear of India's finest institutions.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary bg-gold text-ink hover:bg-gold/90 shadow-gold/20">
                Shop Collection
              </Link>
              <Link to="/schools" className="btn-outline border-white/30 text-white hover:bg-surface-card/10 hover:border-white">
                Find Your School
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-surface-card border-b border-hairline py-12 relative z-20 shadow-[0_2px_10px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-hairline-strong"
          >
            <motion.div variants={fadeUpVariant} className="flex items-center justify-center gap-4 pt-4 md:pt-0">
              <ShieldCheck size={36} className="text-warning" />
              <div>
                <h4 className="font-bold text-lg text-ink">Official Partner</h4>
                <p className="text-muted text-sm mt-1">Verified supplier for 100+ schools</p>
              </div>
            </motion.div>
            <motion.div variants={fadeUpVariant} className="flex items-center justify-center gap-4 pt-4 md:pt-0">
              <Truck size={36} className="text-warning" />
              <div>
                <h4 className="font-bold text-lg text-ink">Pan-India Delivery</h4>
                <p className="text-muted text-sm mt-1">Fast, reliable doorstep shipping</p>
              </div>
            </motion.div>
            <motion.div variants={fadeUpVariant} className="flex items-center justify-center gap-4 pt-4 md:pt-0">
              <RefreshCw size={36} className="text-warning" />
              <div>
                <h4 className="font-bold text-lg text-ink">Easy Returns</h4>
                <p className="text-muted text-sm mt-1">10-Day hassle-free exchanges</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* School Search Section */}
      <section className="py-24 bg-canvas border-b border-hairline">
        <div className="container mx-auto px-4">
          <motion.div
             variants={fadeUpVariant}
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-100px" }}
             className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight">Select Your Institution</h2>
            <p className="text-lg text-muted mb-10 max-w-2xl mx-auto">
              Find officially approved uniforms, winter wear, and accessories specifically tailored for your school.
            </p>
            <div className="relative group max-w-2xl mx-auto shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search className="text-muted" size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Search by school name..."
                className="w-full bg-surface-card border-2 border-transparent py-5 pl-14 pr-36 text-base text-ink focus:border-gold transition-all outline-none"
              />
              <button className="absolute right-2 top-2 bottom-2 px-8 bg-primary text-on-primary font-medium rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.1)]">
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-surface-card border-b border-hairline overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
             variants={fadeUpVariant}
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-100px" }}
             className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6"
          >
            <div>
               <h2 className="text-4xl font-bold text-ink tracking-tight mb-2">Shop by Category</h2>
               <p className="text-muted">Explore our curated collections</p>
            </div>
            <Link to="/shop" className="text-ink font-semibold hover:text-m-red flex items-center gap-2 transition-colors">
              View All Categories <ArrowRight size={18} />
            </Link>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat} variants={fadeUpVariant}>
                <Link 
                  to={`/shop?category=${cat}`}
                  className="group flex flex-col items-center gap-4 p-4 rounded-2xl hover:bg-canvas transition-all duration-300"
                >
                  <div className="w-full aspect-[4/5] rounded-xl flex items-center justify-center relative overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.5)] shadow-black/5 group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                     <motion.img 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                        src={`https://picsum.photos/seed/cat${i}/400/500`}
                        className="absolute inset-0 w-full h-full object-cover" 
                        alt={cat}
                        referrerPolicy="no-referrer"
                     />
                  </div>
                  <span className="text-base text-ink font-semibold text-center">{cat}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Schools Grid */}
      <section className="py-24 bg-canvas border-b border-hairline overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-ink tracking-tight mb-4">Partner Institutions</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">Providing official mandate uniforms for elite schools.</p>
          </motion.div>

          <motion.div 
             variants={staggerContainer}
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-100px" }}
             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {SCHOOLS.map((school) => (
              <motion.div key={school.id} variants={fadeUpVariant}>
                <Link 
                  to={`/schools/${school.slug}`}
                  className="group relative h-[380px] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)] bg-surface-card block"
                >
                  <img src={school.logo} alt={school.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-canvas/95 via-canvas/40 to-transparent flex flex-col justify-end p-8">
                     <h3 className="font-bold text-2xl text-white leading-tight mb-1">{school.name}</h3>
                     <div className="flex items-center gap-2 text-warning">
                        <Star size={14} fill="currentColor"/>
                        <span className="text-sm font-medium">{school.location}</span>
                     </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-surface-card border-b border-hairline overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div 
             variants={fadeUpVariant}
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-100px" }}
             className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6"
          >
            <div>
               <h2 className="text-4xl font-bold text-ink tracking-tight mb-2">Bestsellers</h2>
               <p className="text-muted">Most loved by parents and students.</p>
            </div>
             <Link to="/shop" className="text-ink font-semibold hover:text-m-red flex items-center gap-2 transition-colors">
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
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-surface-elevated border-y border-hairline relative overflow-hidden">
        {/* decorative blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-m-red/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
             variants={fadeUpVariant}
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-100px" }}
             className="max-w-4xl mx-auto text-center"
          >
             <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-ink">Join the UniformKart Family</h2>
             <p className="text-lg text-body-text font-light mb-10 max-w-2xl mx-auto">
               Subscribe for updates on new school additions, exclusive offers, and early access to winter wear sales.
             </p>
             <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <input 
                  type="email" 
                  placeholder="Your email address"
                  className="flex-1 bg-canvas border border-hairline-strong rounded-full px-6 py-4 text-ink outline-none focus:border-ink transition-all placeholder:text-muted"
                />
                <button type="button" className="btn-secondary whitespace-nowrap">
                  Subscribe
                </button>
             </form>
             <p className="text-xs text-muted mt-6 font-light">By subscribing, you agree to our privacy policy and terms of service.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
