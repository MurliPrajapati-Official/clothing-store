import SEO from '../components/layout/SEO';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { STORE_NAME } from '../constants';

const EDITORIAL_COLLECTIONS = [
  {
    title: 'The Minimalist Wardrobe',
    season: 'Year-Round Capsule',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80',
    description: 'Crisp organic cottons, clean lines, and unpretentious silhouettes designed to anchor your daily rotation with effortless refinement.',
    link: '/shop?category=Tops+%26+Shirts'
  },
  {
    title: 'Architectural Outerwear & Trench',
    season: 'Autumn / Winter',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1200&auto=format&fit=crop&q=80',
    description: 'Virgin wool blends, oversized storm flaps, and double-breasted structuring tailored for cold-weather elegance.',
    link: '/shop?category=Outerwear'
  },
  {
    title: '450 GSM Heavy Streetwear',
    season: 'Essential Fleece',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1200&auto=format&fit=crop&q=80',
    description: 'Dense French terry hoodies, drop-shoulder cuts, and heavy canvas carpenter trousers built for sculptural streetwear drape.',
    link: '/shop?category=Streetwear'
  },
  {
    title: 'Executive Tailoring & Italian Wool',
    season: 'Occasion & Business',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=80',
    description: 'Unstructured blazers, sharp pleats, and crease-resistant weaves engineered for boardroom presence and evening dinners.',
    link: '/shop?category=Outerwear'
  },
  {
    title: 'Satin & Evening Silhouettes',
    season: 'Evening Capsule',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&auto=format&fit=crop&q=80',
    description: 'Bias-cut mulberry satin slip dresses and fluid separates with lustrous sheen and second-skin comfort.',
    link: '/shop?category=Dresses'
  },
  {
    title: 'Studio Movement & Active Sets',
    season: 'Performance Series',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&auto=format&fit=crop&q=80',
    description: 'Seamless micro-ribbed compression knitwear crafted for high-performance yoga, studio conditioning, and recovery.',
    link: '/shop?category=Activewear'
  }
];

export default function Collections() {
  return (
    <div className="pt-28 pb-24 bg-canvas min-h-screen">
      <SEO
        title={`Lookbook & Collections | ${STORE_NAME}`}
        description="Explore the seasonal lookbooks and curated capsules."
      />

      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-card border border-hairline text-xs font-bold uppercase tracking-widest text-ink">
            <Sparkles size={12} />
            <span>Seasonal Lookbooks</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-ink">
            Curated Capsules
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            Each collection explores the relationship between architectural silhouette, tactile textiles, and functional everyday durability.
          </p>
        </div>

        {/* Lookbooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {EDITORIAL_COLLECTIONS.map((col, idx) => (
            <div key={idx} className="bg-white border border-hairline group flex flex-col justify-between">
              <div className="relative aspect-[16/10] overflow-hidden bg-surface-soft border-b border-hairline">
                <img
                  src={col.image}
                  alt={col.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 bg-ink text-white text-[10px] font-black uppercase px-2.5 py-1 tracking-wider">
                  {col.season}
                </span>
              </div>

              <div className="p-8 flex flex-col justify-between flex-grow space-y-6">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-ink mb-2">
                    {col.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    {col.description}
                  </p>
                </div>

                <Link
                  to={col.link}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink group-hover:translate-x-1 transition-transform"
                >
                  <span>Explore Collection</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
