import SEO from '../components/layout/SEO';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BlogSkeleton from '../components/blog/BlogSkeleton';

import Skeleton from '../components/ui/Skeleton';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'The Psychology of School Uniforms: How What Students Wear Impacts Learning',
    excerpt: 'Discussing focus, equality, and discipline in modern classroom environments.',
    image: 'https://picsum.photos/seed/blog1/800/500',
    date: 'Apr 20, 2026',
    author: 'Editorial Team',
    category: 'Education'
  },
  {
    id: 2,
    title: 'Cotton vs. Blended Fabrics: Choosing the Right Material for Hospital Scrubs',
    excerpt: 'Highlighting breathability, stain resistance, and washability for healthcare professionals.',
    image: 'https://picsum.photos/seed/blog2/800/500',
    date: 'Mar 15, 2026',
    author: 'Product Team',
    category: 'Healthcare'
  },
  {
    id: 3,
    title: 'How to Maintain Your Corporate Uniform for Long-Lasting Wear',
    excerpt: 'Providing tips on washing, ironing, and storing admin outfits to stay sharp all day.',
    image: 'https://picsum.photos/seed/blog3/800/500',
    date: 'Feb 10, 2026',
    author: 'Care Advisors',
    category: 'Corporate'
  }
];

export default function Blog() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-canvas text-body-text">
      <SEO
        title="Uniform Industry Insights & Trends"
        description="Read our blog for the latest trends in school uniforms, healthcare scrub fabrics, and corporate wear tips. Expert insights by Uniform Trends."
      />

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          {isLoading ? (
            <div className="space-y-6 max-w-2xl mx-auto">
              <Skeleton className="w-full h-12 md:h-16" />
              <Skeleton className="w-3/4 h-6 mx-auto" />
            </div>
          ) : (
            <>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight">The Uniform Trends Journal</h1>
                <p className="text-lg text-muted max-w-2xl mx-auto font-light">Industry Insights, News, and Tips on Specialized Uniforms.</p>
              </motion.div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <BlogSkeleton key={i} />
              ))}
            </>
          ) : (
            BLOG_POSTS.map((post, index) => (
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
                  <h2 className="text-xl font-bold text-ink mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
