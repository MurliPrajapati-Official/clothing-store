import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'The Psychology of School Uniforms: How What Students Wear Impacts Learning',
    excerpt: 'Discussing focus, equality, and discipline in modern classroom environments.',
    image: 'https://picsum.photos/seed/blog1/800/500',
    date: 'Nov 12, 2026',
    author: 'Editorial Team',
    category: 'Education'
  },
  {
    id: 2,
    title: 'Cotton vs. Blended Fabrics: Choosing the Right Material for Hospital Scrubs',
    excerpt: 'Highlighting breathability, stain resistance, and washability for healthcare professionals.',
    image: 'https://picsum.photos/seed/blog2/800/500',
    date: 'Oct 28, 2026',
    author: 'Product Team',
    category: 'Healthcare'
  },
  {
    id: 3,
    title: 'How to Maintain Your Corporate Uniform for Long-Lasting Wear',
    excerpt: 'Providing tips on washing, ironing, and storing admin outfits to stay sharp all day.',
    image: 'https://picsum.photos/seed/blog3/800/500',
    date: 'Oct 15, 2026',
    author: 'Care Advisors',
    category: 'Corporate'
  }
];

export default function Blog() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-canvas text-body-text">
      <Helmet>
        <title>Ovi Global Journal | Uniform Insights in Ranchi</title>
        <meta name="description" content="Industry insights, news, and tips from Ovi Global (by WALRIE) - the experts in Ranchi uniforms." />
      </Helmet>

      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight">The Ovi Global Journal</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto font-light">Industry Insights, News, and Tips on Specialized Uniforms.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {BLOG_POSTS.map((post, index) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface-card rounded-3xl overflow-hidden border border-hairline shadow-[0_4px_20px_rgba(0,0,0,0.02)] group hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-primary mb-4">
                  <span>{post.category}</span>
                </div>
                <h3 className="text-xl font-bold text-ink mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted font-light mb-6 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-4 text-sm text-muted font-medium">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {post.date}
                    </div>
                  </div>
                  <button className="text-ink group-hover:text-primary transition-colors">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
