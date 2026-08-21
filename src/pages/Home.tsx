import { useState, useEffect } from 'react';
import SEO from '../components/layout/SEO';
import { motion } from 'motion/react';
import { ArrowRight, Star, ArrowUpRight, Sparkles, ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import QuickViewModal from '../components/product/QuickViewModal';
import { Product } from '../types';
import { mockProductService } from '../lib/mockService';
import { STORE_NAME, STORE_TAGLINE } from '../constants';

const FASHION_CATEGORIES = [
  {
    name: "Men's Collection",
    category: 'Men',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    desc: 'Structured blazers, heavy cotton tees & relaxed shirts'
  },
  {
    name: "Women's Collection",
    category: 'Women',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80',
    desc: 'Architectural trench coats, silk slip dresses & trousers'
  },
  {
    name: 'Streetwear & Hoodies',
    category: 'Streetwear',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    desc: '450 GSM heavyweight fleece, drop-shoulder silhouettes'
  },
  {
    name: 'Outerwear & Coats',
    category: 'Outerwear',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
    desc: 'Virgin wool coats, trucker denim & tailored jackets'
  },
  {
    name: 'Knitwear & Sweaters',
    category: 'Knitwear',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80',
    desc: 'Merino wool cardigans, ribbed textures & cashmeres'
  },
  {
    name: 'Bags & Accessories',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    desc: 'Full-grain vegetable-tanned leather totes & belts'
  }
];

const TESTIMONIALS = [
  {
    name: 'Aarav Mehta',
    role: 'Creative Director, Mumbai',
    text: 'The 280 GSM heavyweight tees are unlike anything else in this price bracket. The collar holds its shape after dozens of washes, and the drape is flawless.',
    rating: 5
  },
  {
    name: 'Priya Nambiar',
    role: 'Architect, Bangalore',
    text: 'The structured trench coat gets compliments everywhere I go. Impeccable stitching, thoughtful interior pockets, and luxurious weight.',
    rating: 5
  },
  {
    name: 'Kabir Singhal',
    role: 'Design Lead, Delhi',
    text: 'Seamless ordering, rapid shipping, and zero compromise on materials. My entire wardrobe rotation is now built around their minimalist essentials.',
    rating: 5
  }
];

export default function Home() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'featured' | 'new'>('featured');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featured, arrivals] = await Promise.all([
          mockProductService.getFeaturedProducts(),
          mockProductService.getNewArrivals()
        ]);
        setFeaturedProducts(featured);
        setNewArrivals(arrivals);
      } catch (e) {
        console.error('Failed to load products:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const displayedProducts = activeTab === 'featured' ? featuredProducts : newArrivals;

  return (
    <div className="flex flex-col bg-canvas text-body-text">
      <SEO
        title={`${STORE_NAME} — ${STORE_TAGLINE} | Shop Online`}
        description="Discover contemporary luxury wardrobe essentials. Premium heavyweight t-shirts, tailored wool blazers, minimalist trench coats, and artisanal knitwear."
      />

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden bg-surface-soft border-b border-hairline">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&auto=format&fit=crop&q=85"
            alt="New Season Campaign"
            className="w-full h-full object-cover object-center opacity-30 lg:opacity-40 filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 py-20 lg:py-32">
          <div className="max-w-2xl space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-ink text-white text-[11px] font-bold uppercase tracking-widest"
            >
              <Sparkles size={12} />
              <span>Autumn / Winter & Spring 2026 Edit</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-ink leading-[1.05]"
            >
              Elevated <br />
              Everyday <br />
              Wardrobe.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-muted font-normal max-w-lg leading-relaxed"
            >
              Architectural silhouettes, heavyweight organic cottons, and impeccably tailored outerwear designed for longevity and effortless confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <Link to="/shop" className="btn-primary py-4 px-8 text-xs flex items-center gap-2">
                <span>Explore Full Collection</span>
                <ArrowRight size={14} />
              </Link>
              <Link to="/collections" className="btn-secondary py-4 px-8 text-xs">
                View Lookbook
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CURATED CATEGORIES ─── */}
      <section className="py-20 bg-white border-b border-hairline">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-xs uppercase font-bold tracking-widest text-muted mb-2">Curated Categories</p>
              <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-ink">
                Shop By Department
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-ink hover:underline mt-4 md:mt-0"
            >
              <span>View All Categories</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FASHION_CATEGORIES.map((cat, index) => (
              <Link
                key={cat.category}
                to={`/shop?category=${encodeURIComponent(cat.category)}`}
                className="group relative aspect-[4/5] overflow-hidden bg-surface-soft border border-hairline"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 text-white flex flex-col justify-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-sand/90 mb-1">Explore</span>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-1 group-hover:translate-x-1 transition-transform">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-1">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED & NEW ARRIVALS CATALOG ─── */}
      <section className="py-20 bg-canvas border-b border-hairline">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
            <div>
              <p className="text-xs uppercase font-bold tracking-widest text-muted mb-2">Curated Catalog</p>
              <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-ink">
                Trending Essentials
              </h2>
            </div>

            {/* Toggle Tabs */}
            <div className="inline-flex border border-hairline bg-white p-1">
              <button
                onClick={() => setActiveTab('featured')}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeTab === 'featured' ? 'bg-ink text-white' : 'text-muted hover:text-ink'
                }`}
              >
                Featured
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeTab === 'new' ? 'bg-ink text-white' : 'text-muted hover:text-ink'
                }`}
              >
                New Arrivals
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-surface-card animate-pulse border border-hairline" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/shop" className="btn-primary py-4 px-10 text-xs inline-flex items-center gap-2">
              <span>View All ({featuredProducts.length + newArrivals.length}+) Products</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── EDITORIAL LOOKBOOK SPLIT BANNER ─── */}
      <section className="py-20 bg-ink text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 lg:pr-8">
              <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">Atelier Lookbook</span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
                Sculptural Forms & Architectural Tailoring.
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
                We reject fast trends in favor of disciplined design. Every garment is pattern-drafted for precision, constructed with reinforced seam stress points, and finished with organic, tactile textiles.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link to="/collections" className="bg-white text-ink font-bold text-xs uppercase tracking-wider py-3.5 px-8 hover:bg-neutral-200 transition-colors">
                  Explore Editorial Lookbook
                </Link>
                <Link to="/about" className="border border-white/40 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-8 hover:bg-white/10 transition-colors">
                  Our Design Philosophy
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80"
                  alt="Editorial Look 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[3/4] overflow-hidden pt-8">
                <img
                  src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80"
                  alt="Editorial Look 2"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CUSTOMER TESTIMONIALS ─── */}
      <section className="py-20 bg-surface-card border-b border-hairline">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center">
          <p className="text-xs uppercase font-bold tracking-widest text-muted mb-3">Customer Perspectives</p>
          <div className="flex justify-center items-center gap-1 text-ink mb-6">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={18} className="fill-ink text-ink" />
            ))}
          </div>

          <blockquote className="text-xl sm:text-2xl lg:text-3xl font-medium text-ink leading-snug mb-8">
            "{TESTIMONIALS[activeTestimonial].text}"
          </blockquote>

          <div>
            <p className="font-bold text-sm text-ink">{TESTIMONIALS[activeTestimonial].name}</p>
            <p className="text-xs text-muted mt-0.5">{TESTIMONIALS[activeTestimonial].role}</p>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Testimonial ${idx + 1}`}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-3 h-3 transition-all ${
                  activeTestimonial === idx ? 'bg-ink scale-125' : 'bg-hairline hover:bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
