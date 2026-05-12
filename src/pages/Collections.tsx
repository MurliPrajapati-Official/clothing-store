import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { Camera, ArrowRight, ShieldCheck, Star } from 'lucide-react';

const showcaseImages = [
  { 
    url: '/products/gen_school_1.png', 
    title: 'School Uniforms Showcase', 
    category: 'School',
    desc: 'Premium school blazers, shirts, and trousers manufactured for durability.'
  },
  { 
    url: '/products/gen_corporate_1.png', 
    title: 'Corporate Attire Gallery', 
    category: 'Corporate',
    desc: 'Professional suits and administrative wear for Indian corporate sectors.'
  },
  { 
    url: '/products/gen_hospital_1.png', 
    title: 'Medical Scrubs Collection', 
    category: 'Hospital',
    desc: 'Antimicrobial hospital scrubs and lab coats for healthcare professionals.'
  },
  { 
    url: '/products/gen_factory_1.png', 
    title: 'Industrial Workwear Gallery', 
    category: 'Factory',
    desc: 'Safety-first industrial uniforms for factory and mining operations.'
  },
  { 
    url: '/products/gen_hotel_1.png', 
    title: 'Hospitality Uniforms', 
    category: 'Hotels',
    desc: 'Elegant uniforms for hotel staff, chefs, and front desk administration.'
  },
  { 
    url: '/products/gen_defence_1.png', 
    title: 'Defence & Tactical Gear', 
    category: 'Defence',
    desc: 'High-performance tactical uniforms for security and paramilitary forces.'
  }
];

export default function Collections() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-canvas">
      <Helmet>
        <title>Uniform Collections Showcase | Best Uniform PNG Gallery India</title>
        <meta name="description" content="Explore our premium uniform image gallery. High-quality PNG showcase of school uniforms, corporate wear, and medical scrubs by Uniform Trends by WEA." />
        <meta name="keywords" content="uniform images PNG, school uniform gallery, corporate wear showcase, hospital scrubs photos, Uniform Trends gallery" />
        <link rel="canonical" href="https://uniformtrends.in/collections" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "Uniform Trends by WEA Collections",
            "description": "A high-quality showcase of premium uniforms manufactured in India.",
            "image": showcaseImages.map(img => `https://uniformtrends.in${img.url}`)
          })}
        </script>
      </Helmet>

      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-6 font-bold text-sm uppercase tracking-widest">
            <Camera size={16} />
            Visual Showcase
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-ink mb-6 tracking-tight">Our Premium Collections</h1>
          <p className="text-xl text-muted font-light leading-relaxed">
            High-definition visual representation of our manufacturing excellence. 
            Google recognizes our quality through precision-stitched PNG assets designed for durability.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {showcaseImages.map((img, idx) => (
            <motion.div
              key={img.url}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-surface-card rounded-3xl overflow-hidden border border-hairline shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div className="aspect-[4/5] relative overflow-hidden bg-canvas">
                <img 
                  src={img.url} 
                  alt={img.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <Link 
                    to={`/shop?category=${encodeURIComponent(img.category)}`}
                    className="w-full bg-white text-ink font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    View Category <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck size={16} className="text-primary" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-primary">{img.category}</span>
                </div>
                <h3 className="text-2xl font-bold text-ink mb-2">{img.title}</h3>
                <p className="text-muted text-sm font-light leading-relaxed mb-6">{img.desc}</p>
                <div className="flex items-center gap-1 text-warning">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  <span className="text-muted text-xs ml-2 font-medium">Industry Standard</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* SEO Content Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-surface-card p-12 rounded-[40px] border border-hairline shadow-xl text-center max-w-5xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-ink mb-6">Optimized Uniform Asset Management</h2>
          <p className="text-lg text-muted font-light leading-relaxed max-w-3xl mx-auto">
            Our PNG uniform assets are optimized for Google Image Search with descriptive ALT tags and structured data. 
            Whether you are searching for <Link to="/shop?category=School" className="text-primary font-medium hover:underline">school uniform photos</Link> or 
            <Link to="/shop?category=Corporate" className="text-primary font-medium hover:underline">corporate wear PNGs</Link>, 
            our showcase ensures maximum visibility for institutional buyers in India.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
