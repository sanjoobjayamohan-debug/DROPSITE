import React, { useState } from 'react';
import { useStore, formatINR } from '../../context/StoreContext';
import {
  X,
  Star,
  ShoppingBag,
  Check,
  Truck,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Layers,
  BellRing,
  Mail,
  Trash2,
} from 'lucide-react';

export const ProductModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    reviews,
    submitReview,
    priceDropSubscriptions,
    subscribePriceDrop,
    unsubscribePriceDrop,
    showToast,
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'fabric' | 'reviews'>('overview');
  const [justAdded, setJustAdded] = useState(false);

  // Price Drop Alert State
  const [showPriceDropAlert, setShowPriceDropAlert] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [customTargetPrice, setCustomTargetPrice] = useState<number>(0);
  const [priceThresholdMode, setPriceThresholdMode] = useState<'any' | '10%' | '20%' | 'custom'>('10%');
  const [isSubscribing, setIsSubscribing] = useState(false);

  // New Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  if (!selectedProduct) return null;

  // Initialize or fallback gallery images (up to 5 images)
  const productImages =
    selectedProduct.galleryImages && selectedProduct.galleryImages.length > 0
      ? selectedProduct.galleryImages
      : selectedProduct.images && selectedProduct.images.length > 0
      ? selectedProduct.images
      : [selectedProduct.image];

  // Default selected size if not chosen yet
  const currentSize =
    selectedSize || (selectedProduct.sizes && selectedProduct.sizes[0]) || 'Standard';

  const productReviews = reviews.filter(
    (r) => r.productId === selectedProduct.id && r.status === 'Approved'
  );

  const discountPercent =
    selectedProduct.originalMrp && selectedProduct.originalMrp > selectedProduct.price
      ? Math.round(
          ((selectedProduct.originalMrp - selectedProduct.price) /
            selectedProduct.originalMrp) *
            100
        )
      : 0;

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, currentSize);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    submitReview({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      author: reviewAuthor,
      rating: reviewRating,
      title: reviewTitle || 'Honest Review',
      comment: reviewComment,
      status: 'Approved',
      verifiedPurchase: true,
    });

    setReviewAuthor('');
    setReviewTitle('');
    setReviewComment('');
    setShowReviewForm(false);
    showToast('Review Shared', 'Thank you for sharing your thoughtful feedback.');
  };

  const activeSubscriptionForEmail = priceDropSubscriptions.find(
    (sub) => sub.productId === selectedProduct.id && sub.status === 'Active'
  );

  const handlePriceDropSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberEmail.trim()) return;

    let targetPrice = selectedProduct.price;
    if (priceThresholdMode === '10%') {
      targetPrice = Math.round(selectedProduct.price * 0.9);
    } else if (priceThresholdMode === '20%') {
      targetPrice = Math.round(selectedProduct.price * 0.8);
    } else if (priceThresholdMode === 'custom' && customTargetPrice > 0) {
      targetPrice = customTargetPrice;
    }

    setIsSubscribing(true);
    setTimeout(() => {
      subscribePriceDrop(selectedProduct.id, subscriberEmail, targetPrice);
      setIsSubscribing(false);
      setShowPriceDropAlert(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200 my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          aria-label="Close product view"
          className="absolute top-4 right-4 z-20 p-2 text-stone-500 hover:text-stone-900 bg-white/90 hover:bg-white rounded-full shadow-xs transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body: Scrollable Dual Column */}
        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left: 5-Photo Gallery */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Stage Image */}
              <div className="relative aspect-[3/4] bg-[#F7F6F3] rounded-xl overflow-hidden border border-stone-200/80">
                <img
                  src={productImages[activeImageIndex] || selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />

                {/* Left/Right Arrow Navigation */}
                {productImages.length > 1 && (
                  <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(
                          (prev) => (prev - 1 + productImages.length) % productImages.length
                        );
                      }}
                      className="p-1.5 rounded-full bg-white/90 text-stone-800 hover:bg-white shadow-md pointer-events-auto transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex((prev) => (prev + 1) % productImages.length);
                      }}
                      className="p-1.5 rounded-full bg-white/90 text-stone-800 hover:bg-white shadow-md pointer-events-auto transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Photo Count Indicator */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-stone-950/70 backdrop-blur-xs text-white text-[11px] font-medium tracking-wider uppercase rounded-full">
                  {activeImageIndex + 1} / {productImages.length}
                </div>
              </div>

              {/* Thumbnail Gallery (Up to 5 Photos) */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-stone-900 shadow-xs'
                          : 'border-stone-200/80 hover:border-stone-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${selectedProduct.name} view ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Garment Details & Purchasing */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Category & Provenance */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs tracking-wider uppercase text-stone-400">
                  <span>{selectedProduct.category} · {selectedProduct.material}</span>
                  {selectedProduct.supplierOrigin && (
                    <span className="text-stone-600 font-light">
                      {selectedProduct.supplierOrigin}
                    </span>
                  )}
                </div>

                <h1 className="font-editorial text-2xl sm:text-3xl font-medium text-stone-900 leading-snug">
                  {selectedProduct.name}
                </h1>

                <p className="text-xs text-stone-500 font-light leading-relaxed pt-0.5">
                  {selectedProduct.tagline}
                </p>
              </div>

              {/* Pricing in ₹ INR */}
              <div className="pb-4 border-b border-stone-200/80 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-medium text-stone-900 tabular-nums">
                  {formatINR(selectedProduct.price)}
                </span>
                {selectedProduct.originalMrp && selectedProduct.originalMrp > selectedProduct.price && (
                  <span className="text-sm text-stone-400 line-through tabular-nums font-light">
                    {formatINR(selectedProduct.originalMrp)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-semibold tracking-wider text-stone-800 bg-stone-100 px-2 py-0.5 rounded-full">
                    {discountPercent}% Off
                  </span>
                )}
              </div>

              {/* Sizes Selection */}
              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs tracking-wider uppercase font-medium text-stone-700">
                    <span>Select Sizing:</span>
                    <span className="text-[11px] text-stone-400 font-light normal-case">
                      Standard Indian Tailored Fit
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((sz) => {
                      const isChosen = currentSize === sz;
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`min-w-[48px] px-3.5 py-2 text-xs font-medium tracking-wide rounded-full border transition-all cursor-pointer ${
                            isChosen
                              ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                              : 'bg-white text-stone-700 hover:border-stone-400 border-stone-200'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Shopping Bag */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-stone-300 rounded-full bg-stone-50 px-3 py-1.5">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="text-stone-600 hover:text-stone-900 px-2 font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-semibold text-stone-900 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="text-stone-600 hover:text-stone-900 px-2 font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag CTA */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!selectedProduct.inStock}
                    className={`flex-1 py-3 px-6 text-xs tracking-wider uppercase font-semibold rounded-full flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                      justAdded
                        ? 'bg-emerald-800 text-white'
                        : 'bg-stone-900 hover:bg-stone-800 text-white'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Shopping Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                        <span>Add to Bag · {formatINR(selectedProduct.price * quantity)}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-stone-500 font-light flex items-center justify-center gap-4 pt-1">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-stone-600" />
                    <span>Complimentary Express Shipping over ₹1,999</span>
                  </span>
                  <span>·</span>
                  <span>Delhivery & BlueDart Air</span>
                </div>
              </div>

              {/* Price Drop Alert Trigger */}
              <div className="pt-2 border-t border-stone-200/80">
                <button
                  type="button"
                  onClick={() => setShowPriceDropAlert(!showPriceDropAlert)}
                  className="w-full py-2 px-3 text-xs font-light text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-300 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BellRing className="w-3.5 h-3.5 text-stone-500" />
                  <span>
                    {activeSubscriptionForEmail
                      ? 'Price alert is currently active for this piece'
                      : 'Notify me by email if price drops'}
                  </span>
                </button>

                {showPriceDropAlert && (
                  <div className="mt-3 p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs">
                    {activeSubscriptionForEmail ? (
                      <div className="flex items-center justify-between text-stone-700">
                        <span>Alert active for: {activeSubscriptionForEmail.email}</span>
                        <button
                          type="button"
                          onClick={() => unsubscribePriceDrop(activeSubscriptionForEmail.id)}
                          className="text-stone-500 hover:text-stone-900 text-[11px] underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handlePriceDropSubmit} className="space-y-3">
                        <p className="text-stone-600 text-xs font-light">
                          We’ll notify you discreetly if this handwoven garment has a price courtesy.
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            required
                            value={subscriberEmail}
                            onChange={(e) => setSubscriberEmail(e.target.value)}
                            placeholder="Enter your email address..."
                            className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                          />
                          <button
                            type="submit"
                            disabled={isSubscribing}
                            className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium cursor-pointer"
                          >
                            Set Alert
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Minimal Tabs: Overview, Fabric Specs, Reviews */}
              <div className="pt-4 border-t border-stone-200/80">
                <div className="flex items-center gap-6 border-b border-stone-200 pb-2 text-xs tracking-wider uppercase font-medium">
                  {(['overview', 'fabric', 'reviews'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`pb-1 transition-colors relative cursor-pointer ${
                        activeTab === tab
                          ? 'text-stone-900 font-semibold'
                          : 'text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      {tab === 'overview' && 'Garment Overview'}
                      {tab === 'fabric' && 'Weave & Specs'}
                      {tab === 'reviews' && `Reviews (${productReviews.length})`}
                      {activeTab === tab && (
                        <span className="absolute -bottom-2 inset-x-0 h-[1.5px] bg-stone-900" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-4 text-xs">
                  {/* Tab 1: Overview */}
                  {activeTab === 'overview' && (
                    <div className="space-y-3 text-stone-600 font-light leading-relaxed">
                      <p>{selectedProduct.description}</p>
                      <div className="pt-2 text-[11px] text-stone-500 space-y-1">
                        <p>• Hand-tailored in limited editions to preserve textile integrity.</p>
                        <p>• Packed inside a reusable unbleached cotton muslin garment bag.</p>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Fabric Specs */}
                  {activeTab === 'fabric' && (
                    <div className="space-y-3">
                      <div className="divide-y divide-stone-100">
                        {selectedProduct.specs.map((spec, i) => (
                          <div key={i} className="py-2 flex items-center justify-between">
                            <span className="text-stone-500">{spec.label}</span>
                            <span className="font-medium text-stone-900">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Reviews */}
                  {activeTab === 'reviews' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-stone-900">
                          Buyer Feedback ({productReviews.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(!showReviewForm)}
                          className="text-stone-800 hover:text-stone-950 font-medium underline cursor-pointer"
                        >
                          {showReviewForm ? 'Cancel' : 'Write a Review'}
                        </button>
                      </div>

                      {showReviewForm && (
                        <form onSubmit={handleReviewSubmit} className="p-4 bg-stone-50 rounded-xl space-y-3 border border-stone-200">
                          <div>
                            <label className="block text-[11px] text-stone-600 mb-1">Your Name</label>
                            <input
                              type="text"
                              required
                              value={reviewAuthor}
                              onChange={(e) => setReviewAuthor(e.target.value)}
                              placeholder="e.g. Meera S."
                              className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-stone-600 mb-1">Rating</label>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewRating(star)}
                                  className="p-1 cursor-pointer"
                                >
                                  <Star
                                    className={`w-4 h-4 ${
                                      star <= reviewRating
                                        ? 'fill-stone-900 text-stone-900'
                                        : 'text-stone-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] text-stone-600 mb-1">Review</label>
                            <textarea
                              required
                              rows={2}
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              placeholder="Share your impressions on the fabric texture and drape..."
                              className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs"
                            />
                          </div>

                          <button
                            type="submit"
                            className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium cursor-pointer"
                          >
                            Submit Review
                          </button>
                        </form>
                      )}

                      <div className="space-y-3 max-h-48 overflow-y-auto divide-y divide-stone-100">
                        {productReviews.length === 0 ? (
                          <p className="text-stone-400 italic py-2">No reviews yet. Be the first to share your experience.</p>
                        ) : (
                          productReviews.map((r) => (
                            <div key={r.id} className="pt-2.5 first:pt-0">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-stone-900">{r.author}</span>
                                <div className="flex items-center gap-0.5">
                                  {Array.from({ length: r.rating }).map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-stone-900 text-stone-900" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-stone-600 font-light mt-1">{r.comment}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
