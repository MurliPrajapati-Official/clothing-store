import SEO from '../components/layout/SEO';
import { motion } from 'motion/react';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { STORE_NAME } from '../constants';

const FASHION_POSTS = [
  {
    id: 1,
    title: 'The Anatomy of Heavyweight Cotton: Why 280 GSM Changes Everything',
    excerpt: 'Examining yarn count, combed ring-spun fibers, and why fabric weight dictates silhouette longevity.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    date: 'Aug 18, 2026',
    category: 'Material Focus'
  },
  {
    id: 2,
    title: 'Building a 10-Piece Capsule Wardrobe for the Modern Professional',
    excerpt: 'How to pair tailored Italian wool blazers, relaxed linen shirts, and pleated wide-leg trousers for infinite daily rotations.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    date: 'Aug 10, 2026',
    category: 'Style Journal'
  },
  {
    id: 3,
    title: 'The Sustainable Care Protocol: Keeping Fine Textiles Sharp for Decades',
    excerpt: 'Cold water techniques, steam press guidelines, and natural cedar storage for pure wool and raw denim.',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80',
    date: 'Jul 28, 2026',
    category: 'Care & Longevity'
  }
];

export default function Blog() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="pt-28 pb-24 min-h-screen bg-canvas text-body-text">
      <SEO
        title={`Style Journal & Fabric Guides | ${STORE_NAME}`}
        description="Read our journal covering architectural tailoring, organic textile care, and capsule wardrobe styling."
      />

      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-card border border-hairline text-xs font-bold uppercase tracking-widest text-ink">
            <Sparkles size={12} />
            <span>Editorial Journal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-ink uppercase tracking-tight">The Style Journal</h1>
          <p className="text-sm text-muted leading-relaxed">
            Essays on garment construction, fabric history, and contemporary wardrobe styling.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FASHION_POSTS.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-hairline group flex flex-col justify-between hover:border-ink/40 transition-colors"
            >
              <div className="aspect-[16/10] overflow-hidden bg-surface-soft border-b border-hairline">
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-2">{post.category}</span>
                  <h2 className="text-lg font-black uppercase tracking-tight text-ink mb-3 line-clamp-2 leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-xs text-muted leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-hairline text-xs text-muted">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar size={13} />
                    <span>{post.date}</span>
                  </div>
                  <span className="text-ink font-bold uppercase text-[11px] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
