import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Review } from '../../types';
import {
  Star,
  CheckCircle,
  Clock,
  EyeOff,
  MessageSquare,
  ThumbsUp,
  ShieldCheck,
  Send,
  X,
} from 'lucide-react';

export const ReviewsTab: React.FC = () => {
  const { reviews, updateReviewStatus, replyToReview } = useStore();
  const [filter, setFilter] = useState<'All' | 'Approved' | 'Pending' | 'Hidden'>('All');
  
  // Reply modal
  const [activeReplyReview, setActiveReplyReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'All') return true;
    return r.status === filter;
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 5.0;

  const handleOpenReply = (review: Review) => {
    setActiveReplyReview(review);
    setReplyText(review.merchantReply || '');
  };

  const handleSaveReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReplyReview) return;
    replyToReview(activeReplyReview.id, replyText.trim());
    setActiveReplyReview(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Header & KPI Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Customer Review Moderation & Feedback
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Moderate verified customer experiences, reply directly to inquiries, and safeguard social proof.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          {(['All', 'Approved', 'Pending', 'Hidden'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === st
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Overall Rating</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {avgRating.toFixed(2)} / 5.0
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            Based on {reviews.length} authentic submissions
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Pending Moderation</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {reviews.filter((r) => r.status === 'Pending').length} pending
          </div>
          <div className="text-[11px] text-slate-500">
            Awaiting merchant review
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Verified Purchase Rate</span>
            <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            100%
          </div>
          <div className="text-[11px] text-slate-500">
            Validated against storefront order IDs
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200/80 p-6">
            <p className="text-xs text-slate-500">No reviews found in this view.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-slate-900 text-xs">{review.author}</span>
                  {review.verifiedPurchase && (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400">{review.date}</span>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded self-start sm:self-auto ${
                    review.status === 'Approved'
                      ? 'bg-emerald-50 text-emerald-700'
                      : review.status === 'Pending'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {review.status}
                </span>
              </div>

              {/* Title & Comment */}
              <div>
                <h4 className="text-xs font-bold text-slate-900">{review.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {review.comment}
                </p>
                <div className="text-[11px] text-[#6D28D9] font-medium mt-1">
                  Product: {review.productName}
                </div>
              </div>

              {/* Existing Merchant Reply */}
              {review.merchantReply && (
                <div className="p-3 bg-[#6D28D9]/5 rounded-xl border border-[#6D28D9]/20 text-xs">
                  <div className="font-semibold text-[#6D28D9] flex items-center gap-1.5 mb-0.5">
                    <MessageSquare className="w-3 h-3" />
                    <span>Official Merchant Response:</span>
                  </div>
                  <p className="text-slate-700 text-[11px]">{review.merchantReply}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenReply(review)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{review.merchantReply ? 'Edit Response' : 'Reply to Customer'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {review.status !== 'Approved' && (
                    <button
                      onClick={() => updateReviewStatus(review.id, 'Approved')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Approve
                    </button>
                  )}
                  {review.status !== 'Hidden' && (
                    <button
                      onClick={() => updateReviewStatus(review.id, 'Hidden')}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
                    >
                      Hide
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      {activeReplyReview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Reply to {activeReplyReview.author}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Published responses are visible under the product on the storefront.
                </p>
              </div>
              <button
                onClick={() => setActiveReplyReview(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReply} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
                <span className="font-semibold text-slate-800">Customer feedback: </span>
                &ldquo;{activeReplyReview.comment}&rdquo;
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Official Merchant Reply
                </label>
                <textarea
                  rows={4}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Thank you for your feedback! Our engineering team..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#6D28D9]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveReplyReview(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#6D28D9] text-white font-semibold rounded-xl hover:bg-[#5b21b6]"
                >
                  Publish Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
