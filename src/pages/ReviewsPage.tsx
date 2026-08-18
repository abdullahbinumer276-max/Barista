import React, { useState } from 'react';
import { Star, MessageSquare, CheckCircle2, User, Send, ThumbsUp } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { api } from '../lib/api';

export const ReviewsPage: React.FC = () => {
  const { reviews, refreshAll } = useRestaurant();
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      await api.submitReview({
        authorName: authorName.trim(),
        rating,
        comment: comment.trim(),
        avatarBg: 'bg-[#2C1B12]',
      });
      setAuthorName('');
      setComment('');
      setRating(5);
      setSubmittedSuccess(true);
      await refreshAll();
      setTimeout(() => setSubmittedSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[#C5A059] font-serif italic text-sm font-bold uppercase tracking-widest">
          Testimonials & Ratings
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#2C1B12]">
          Guest Experiences
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Read genuine impressions from our patrons across Kharian Cantt, garrison officers, and
          visiting guests.
        </p>
      </div>

      {/* Rating Overview Badge Box */}
      <div className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#2C1B12] text-[#C5A059] flex items-center justify-center font-mono font-black text-3xl shadow">
            {averageRating}
          </div>
          <div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#C5A059] text-[#C5A059]" />
              ))}
            </div>
            <p className="text-xs text-stone-600 font-semibold mt-1">
              Based on {reviews.length} verified customer reviews in Kharian
            </p>
          </div>
        </div>

        <div className="text-xs text-stone-500 text-center sm:text-right">
          <div className="font-bold text-[#2C1B12]">100% Halal Certified</div>
          <div>Strict Kitchen Hygiene & Fresh Ingredients</div>
        </div>
      </div>

      {/* Reviews Grid & Submit Form Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Customer Reviews */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-serif font-bold text-xl text-[#2C1B12]">Verified Reviews</h2>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-[#E5E1D8] p-6 rounded-3xl shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full ${rev.avatarBg || 'bg-[#2C1B12]'} text-[#C5A059] flex items-center justify-center font-bold text-xs shadow-xs`}
                    >
                      {rev.authorName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#2C1B12]">{rev.authorName}</h4>
                      <span className="text-[10px] text-stone-400 font-mono">{rev.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Submit Review Form */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 sticky top-24">
            <div className="space-y-1 border-b border-[#E5E1D8] pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
                Share Your Feedback
              </span>
              <h3 className="font-serif font-bold text-xl text-[#2C1B12]">Write a Review</h3>
              <p className="text-xs text-stone-500">
                Help us keep our food and service at highest standards.
              </p>
            </div>

            {submittedSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Thank you! Your review has been published.</span>
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-[#2C1B12] block">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Major Ali Raza or Zara Khan"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-[#2C1B12] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#2C1B12] block">Your Rating</label>
                <div className="flex items-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'fill-[#C5A059] text-[#C5A059]'
                            : 'text-stone-300 stroke-1'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-[#2C1B12] ml-2">{rating} out of 5 Stars</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#2C1B12] block">Your Review & Comments</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what you liked about the food, ambiance, or delivery speed..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-[#2C1B12] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#2C1B12] hover:bg-[#3D2B1F] text-white rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Send className="w-4 h-4 text-[#C5A059]" />
                <span>{isSubmitting ? 'Publishing...' : 'Submit Review'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
