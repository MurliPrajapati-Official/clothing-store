import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, User, Loader2, Send, CheckCircle2, Trash2 } from 'lucide-react';
import { formatCurrency, cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

interface Review {
  id: string;
  user_name: string;
  user_id: string | null;
  rating: number;
  comment: string;
  created_at: string;
}

interface ProductReviewsProps {
  productId: string;
  onReviewAdded?: () => void;
}

export default function ProductReviews({ productId, onReviewAdded }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Form State
  const [rating, setRating] = useState(5);
  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchReviews = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setIsLoading(true);
      else setIsLoadingMore(true);

      let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      if (window.location.hostname.includes('uniformtrends.pages.dev')) {
        apiUrl = 'https://uniformtrends.onrender.com';
      }
      
      const res = await fetch(`${apiUrl}/api/reviews/${productId}?page=${pageNum}&limit=5`);
      const data = await res.json();
      
      if (append) {
        setReviews(prev => [...prev, ...(data.reviews || [])]);
      } else {
        setReviews(data.reviews || []);
      }
      
      setTotalReviews(data.total || 0);
      setHasMore(data.hasMore || false);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchReviews(1, false);
    
    // Auto-fill user name and check permissions
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      
      if (session?.user) {
        setCurrentUserId(session.user.id);
        if (adminEmail && session.user.email === adminEmail) {
          setIsAdmin(true);
        }
        
        if (session.user.user_metadata?.full_name) {
          setUserName(session.user.user_metadata.full_name);
        } else if (session.user.email) {
          setUserName(session.user.email.split('@')[0]);
        }
      }
    };
    checkUser();
  }, [productId]);

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;

    try {
      let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      if (window.location.hostname.includes('uniformtrends.pages.dev')) {
        apiUrl = 'https://uniformtrends.onrender.com';
      }
      
      const response = await fetch(`${apiUrl}/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete review');

      setReviews(prev => prev.filter(r => r.id !== reviewId));
      setTotalReviews(prev => prev - 1);
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      console.error("Error deleting review", err);
      alert('Failed to delete review');
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(nextPage, true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !comment) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      if (window.location.hostname.includes('uniformtrends.pages.dev')) {
        apiUrl = 'https://uniformtrends.onrender.com';
      }
      
      const response = await fetch(`${apiUrl}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          user_id: session?.user?.id || null,
          user_name: userName,
          rating,
          comment
        }),
      });

      if (!response.ok) throw new Error('Failed to submit review');

      setSuccess(true);
      setComment('');
      fetchReviews();
      if (onReviewAdded) onReviewAdded();
      
      setTimeout(() => {
        setSuccess(false);
        setShowForm(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-20 pt-20 border-t border-hairline-strong">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-ink tracking-tight flex items-center gap-3">
            Customer Reviews <span className="text-sm font-medium text-muted bg-surface-card px-3 py-1 rounded-full border border-hairline">{totalReviews}</span>
          </h2>
          <p className="text-muted mt-2">Hear what others are saying about this uniform.</p>
        </div>
        
        {!showForm && !success && (
          <button 
            onClick={() => setShowForm(true)}
            className="btn-primary px-8 py-4 rounded-xl flex items-center gap-2"
          >
            <MessageSquare size={18} /> Write a Review
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && !success && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-12"
          >
            <form onSubmit={handleSubmit} className="bg-surface-card p-8 rounded-3xl border border-hairline shadow-lg space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-ink mb-4">Your Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className="transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star 
                          size={28} 
                          className={cn(
                            "transition-colors",
                            num <= rating ? "text-warning fill-gold" : "text-hairline-strong"
                          )} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink mb-2">Display Name</label>
                  <input 
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-canvas border border-hairline rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-ink"
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-ink mb-2">Your Experience</label>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-canvas border border-hairline rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors text-ink min-h-[120px] resize-y"
                  placeholder="What did you like or dislike about this product?"
                ></textarea>
              </div>

              {error && <p className="text-m-red text-sm font-medium">{error}</p>}

              <div className="flex items-center gap-4 pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-primary text-on-primary font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:bg-m-green-light transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  Submit Review
                </button>
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-muted font-bold hover:text-ink transition-colors px-4"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/10 border border-green-500/20 p-8 rounded-3xl mb-12 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-ink mb-2">Review Submitted!</h3>
            <p className="text-muted">Thank you for sharing your feedback with our community.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center gap-4 text-muted">
            <Loader2 className="animate-spin" size={32} />
            <p>Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-12 text-center bg-surface-card rounded-3xl border border-hairline border-dashed">
            <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={24} className="text-muted" />
            </div>
            <h3 className="text-lg font-bold text-ink">No reviews yet</h3>
            <p className="text-muted max-w-xs mx-auto mt-2">Be the first to review this product and help others make a choice.</p>
          </div>
        ) : (
          reviews.map((review, idx) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-surface-card p-6 md:p-8 rounded-3xl border border-hairline shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-surface-elevated rounded-full flex items-center justify-center text-primary border border-hairline">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-ink">{review.user_name}</h4>
                    <p className="text-xs text-muted">{new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-canvas px-3 py-1.5 rounded-full border border-hairline">
                    <Star size={14} className="text-warning fill-gold" />
                    <span className="text-sm font-bold text-ink">{review.rating}</span>
                  </div>
                  {(isAdmin || (currentUserId && review.user_id === currentUserId)) && (
                    <button 
                      onClick={() => handleDeleteReview(review.id)}
                      className="p-2 text-muted hover:text-m-red transition-colors"
                      title="Delete review"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-body-text leading-relaxed whitespace-pre-line italic">
                "{review.comment}"
              </p>
            </motion.div>
          ))
        )}

        {hasMore && (
          <div className="pt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="px-8 py-3 rounded-xl border border-hairline bg-surface-card text-ink font-bold hover:bg-surface-elevated transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isLoadingMore ? <Loader2 className="animate-spin" size={18} /> : null}
              {isLoadingMore ? 'Loading...' : 'Load More Reviews'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
