import { motion } from 'motion/react';
import { Search, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import { PRODUCTS, SCHOOLS, CATEGORIES } from '../constants';

export default function Home() {
  return (
    <div className="flex flex-col bg-canvas text-body">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/seed/hero/1920/1080" 
            alt="Students in uniform"
            className="w-full h-full object-cover grayscale brightness-50 scale-105"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <h1 className="text-[56px] md:text-[80px] font-bold text-ink leading-[1.0] mb-8 uppercase tracking-tight">
              THE ULTIMATE <br />
              SCHOOL UNIFORM.
            </h1>
            <p className="text-[16px] text-body-strong mb-10 leading-[1.5] max-w-xl font-light">
              Engineered for endurance. We provide meticulously crafted school uniforms for Delhi's premier institutions. Durable, comfortable, and official.
            </p>
            
            <div className="flex flex-wrap gap-6">
              <Link to="/shop" className="btn-primary">
                Explore Collection
              </Link>
              <Link to="/schools" className="btn-outline">
                Find Your School
              </Link>
            </div>
          </motion.div>
        </div>

        {/* M-Stripe Accents */}
        <div className="absolute bottom-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-m-blue-light" />
          <div className="flex-1 bg-m-blue-dark" />
          <div className="flex-1 bg-m-red" />
        </div>
      </section>

      {/* Quick Stats / Trust Signals */}
      <section className="border-b border-hairline bg-surface-card">
        <div className="container mx-auto px-4 py-[96px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-start gap-5">
              <ShieldCheck size={32} className="text-white" />
              <div>
                <h4 className="font-bold text-[24px] uppercase text-ink">Official Partner</h4>
                <p className="text-body text-[16px] font-light mt-2">100+ Schools in Delhi NCR. Authorized and verified supplier.</p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-5 border-t md:border-t-0 md:border-l border-hairline pt-8 md:pt-0 md:pl-12">
              <Truck size={32} className="text-white" />
              <div>
                <h4 className="font-bold text-[24px] uppercase text-ink">Express Delivery</h4>
                <p className="text-body text-[16px] font-light mt-2">24-48h Delivery across NCR via our dedicated fleet logistics.</p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-5 border-t md:border-t-0 md:border-l border-hairline pt-8 md:pt-0 md:pl-12">
              <RefreshCw size={32} className="text-white" />
              <div>
                <h4 className="font-bold text-[24px] uppercase text-ink">Hassle-Free</h4>
                <p className="text-body text-[16px] font-light mt-2">10-Day Size Exchange Policy. Precision fit guaranteed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Search Section */}
      <section className="py-[96px] bg-canvas border-b border-hairline">
        <div className="container mx-auto px-4">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="max-w-4xl"
          >
            <h2 className="text-[56px] text-ink font-bold mb-6 uppercase tracking-tight leading-[1.05]">SELECT YOUR INSTITUTION.</h2>
            <p className="text-[18px] text-body mb-12 max-w-2xl font-light">
              Access the official uniform range, sportswear, and accessories approved by the administration.
            </p>
            <div className="relative group max-w-2xl">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="text-muted group-focus-within:text-white transition-colors" size={24} />
              </div>
              <input 
                type="text" 
                placeholder="SEARCH BY SCHOOL NAME..."
                className="w-full bg-surface-elevated border border-hairline rounded-none py-5 pl-14 pr-32 text-[16px] text-white focus:border-white transition-all outline-none font-bold uppercase tracking-widest placeholder:text-muted"
              />
              <button className="absolute right-0 top-0 bottom-0 px-8 bg-white text-black font-bold text-[14px] uppercase tracking-[1.5px] hover:bg-gray-200 transition-colors">
                SEARCH
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-[96px] bg-surface-card border-b border-hairline">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-16">
            <h2 className="text-[56px] font-bold text-ink uppercase tracking-tight leading-[1.05]">SHOP DEPARTMENTS.</h2>
            <Link to="/shop" className="text-[14px] text-ink font-bold uppercase tracking-[1.5px] hover:opacity-80 flex items-center gap-2">
              VIEW CATEGORIES <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.map((cat, i) => (
              <Link 
                key={cat} 
                to={`/shop?category=${cat}`}
                className="group flex flex-col items-center gap-4 bg-canvas border border-hairline p-6 transition-all hover:border-white"
              >
                <div className="w-full aspect-square flex items-center justify-center relative overflow-hidden mb-4">
                   <img 
                      src={`https://picsum.photos/seed/cat${i}/400/400`}
                      className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:scale-110 group-hover:opacity-80 transition-all duration-700" 
                      alt={cat}
                      referrerPolicy="no-referrer"
                   />
                </div>
                <span className="text-[14px] text-white font-bold uppercase tracking-[1.5px]">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-[96px] bg-canvas border-b border-hairline">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <h2 className="text-[56px] font-bold text-ink uppercase tracking-tight leading-[1.05]">MORE FROM THE CATALOG.</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.filter(p => p.isFeatured).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Schools Grid */}
      <section className="py-[96px] bg-surface-card border-b border-hairline">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <h2 className="text-[56px] font-bold text-ink uppercase tracking-tight leading-[1.05]">APPROVED FLEETS.</h2>
            <p className="text-[20px] font-light text-body max-w-2xl mt-4">Authorized providers for premier institutions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SCHOOLS.map((school) => (
              <Link 
                key={school.id}
                to={`/schools/${school.slug}`}
                className="group relative h-[400px] overflow-hidden border border-hairline bg-canvas"
              >
                <img src={school.logo} alt={school.name} className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-75 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 to-transparent">
                   <h3 className="font-bold text-[24px] uppercase text-white leading-[1.3] mb-2">{school.name}</h3>
                   <p className="text-body text-[14px] font-light uppercase tracking-widest">{school.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-[96px] bg-canvas">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl border border-hairline p-16 bg-surface-card relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-m-red/10 rounded-full blur-3xl" />
             
             <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
               <div className="flex-1">
                  <h2 className="text-[40px] font-bold text-white uppercase tracking-tight leading-[1.1] mb-4">THE INSIDE TRACK.</h2>
                  <p className="text-[16px] text-body font-light">Subscribe for priority updates on technical gear and official release drops.</p>
               </div>
               <div className="flex-2 w-full">
                  <div className="flex flex-col gap-4">
                     <input 
                        type="email" 
                        placeholder="EMAIL ADDRESS"
                        className="w-full bg-surface-elevated border border-hairline px-6 py-4 text-white outline-none focus:border-white transition-all font-bold uppercase tracking-widest text-[14px]"
                     />
                     <button className="bg-white text-black font-bold text-[14px] uppercase tracking-[1.5px] px-8 py-4 w-full hover:bg-gray-200 transition-colors">
                        SUBSCRIBE
                     </button>
                  </div>
                  <p className="text-[12px] text-muted mt-4 font-light">By subscribing, you agree to our privacy policy and terms of service.</p>
               </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
