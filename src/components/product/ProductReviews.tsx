import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, User, Send, CheckCircle2, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../lib/mockAuth';
import { mockReviewService } from '../../lib/mockService';
import { Review } from '../../types';

interface ProductReviewsProps {
  productId: string;
  onReviewAdded?: () => void;
}

export default function ProductReviews({ productId, onReviewAdded }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(5.0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Form State
  const [rating, setRating] = useState(5);
  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { session } = useAuth();

  const fetchReviews = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setIsLoading(true);
      const data = await mockReviewService.getReviews(productId, pageNum, 5);
      if (append) {
        setReviews((prev) => [...prev, ...data.reviews]);
      } else {
        setReviews(data.reviews);
      }
      setTotalReviews(data.total);
      setHasMore(data.hasMore);
      setAverageRating(data.averageRating);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchReviews(1, false);

    if (session?.user) {
      if (session.user.user_metadata?.full_name) {
        setUserName(session.user.user_metadata.full_name);
      } else if (session.user.email) {
        setUserName(session.user.email.split('@')[0]);
      }
    }
  }, [productId, session]);

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    await mockReviewService.deleteReview(productId, reviewId);
    fetchReviews(1, false);
    if (onReviewAdded) onReviewAdded();
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(nextPage, true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) {
      setError('Please provide your name and review comment.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await mockReviewService.addReview({
        productId,
        userName: userName.trim(),
        userId: session?.user?.id || null,
        rating,
        comment: comment.trim()
      });

      setSuccess(true);
      setComment('');
      setShowForm(false);
      fetchReviews(1, false);
      if (onReviewAdded) onReviewAdded();

      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Review Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-surface-card border border-hairline">
        <div className="flex items-center gap-6">
          <div className="text-center sm:text-left">
            <span className="text-4xl font-black text-ink">{averageRating.toFixed(1)}</span>
            <div className="flex items-center gap-1 mt-1 text-ink">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  className={cn(
                    s <= Math.round(averageRating) ? "fill-ink text-ink" : "text-hairline-strong fill-transparent"
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-muted mt-1 font-medium">Based on {totalReviews} customer reviews</p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary py-3 px-6 text-xs"
        >
          {showForm ? 'Cancel Review' : 'Write a Review'}
        </button>
      </div>

      {/* Review Submission Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-6 bg-surface-soft border border-hairline space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink">Share Your Experience</h3>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-xs">{error}</div>
              )}

              {/* Rating Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ink mb-1.5">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        size={22}
                        className={cn(
                          star <= rating ? "fill-ink text-ink" : "text-hairline-strong fill-transparent"
                        )}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-ink ml-2">{rating} out of 5</span>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ink mb-1.5">Your Name</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-white border border-hairline px-4 py-2.5 text-xs text-ink outline-none focus:border-ink"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ink mb-1.5">Review</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How was the fabric quality, stitching, and sizing fit?"
                  className="w-full bg-white border border-hairline px-4 py-2.5 text-xs text-ink outline-none focus:border-ink resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary py-3 px-8 text-xs flex items-center gap-2"
              >
                <Send size={14} />
                <span>{isSubmitting ? 'Posting Review...' : 'Submit Review'}</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      {success && (
        <div className="p-4 bg-canvas border border-ink text-xs font-bold flex items-center gap-2 text-ink">
          <CheckCircle2 size={16} />
          <span>Thank you! Your verified customer review has been published.</span>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading && page === 1 ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 bg-surface-card animate-pulse border border-hairline" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-surface-soft border border-hairline">
            <p className="text-sm text-muted">No reviews yet for this product. Be the first to leave one!</p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="p-5 bg-surface-card border border-hairline space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-elevated border border-hairline flex items-center justify-center font-bold text-xs text-ink uppercase">
                    {rev.user_name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-ink">{rev.user_name}</span>
                      {rev.verifiedPurchase && (
                        <span className="text-[10px] text-muted flex items-center gap-0.5">
                          <CheckCircle2 size={10} className="text-ink" /> Verified Buyer
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 text-ink">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={11}
                          className={cn(
                            s <= rev.rating ? "fill-ink text-ink" : "text-hairline fill-transparent"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-muted">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </span>
                  {(session?.user?.id === rev.user_id || !rev.user_id) && (
                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="text-muted hover:text-red-500 transition-colors p-1"
                      title="Delete review"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-body-text leading-relaxed pt-1">
                {rev.comment}
              </p>
            </div>
          ))
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center pt-4">
            <button
              onClick={handleLoadMore}
              className="btn-secondary text-xs uppercase tracking-wider py-2.5 px-6"
            >
              Load More Reviews
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
