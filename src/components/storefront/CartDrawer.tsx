import React, { useState } from 'react';
import { useStore, formatINR } from '../../context/StoreContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    setIsCheckoutOpen,
    appliedDiscount,
    discountCode,
    applyPromoCode,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const rawSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = Math.round(rawSubtotal * appliedDiscount);
  const freeShippingThreshold = 1999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - rawSubtotal);
  const progressPercent = Math.min(100, (rawSubtotal / freeShippingThreshold) * 100);
  const finalSubtotal = rawSubtotal - discountAmount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    applyPromoCode(promoInput);
    setPromoInput('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-editorial font-medium text-stone-900">Your Shopping Bag</h3>
            <span className="text-xs font-light text-stone-500 tabular-nums">
              ({cart.reduce((s, i) => s + i.quantity, 0)} items)
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close shopping bag"
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter (₹1,999 Pan-India threshold) */}
        <div className="bg-[#FAF9F6] px-5 py-3 border-b border-stone-200/80">
          <div className="flex items-center justify-between text-xs text-stone-700 font-light mb-1.5">
            {remainingForFreeShipping > 0 ? (
              <span>
                Add <span className="font-medium text-stone-900">{formatINR(remainingForFreeShipping)}</span> more for Complimentary Shipping
              </span>
            ) : (
              <span className="text-stone-900 font-medium flex items-center gap-1">
                ✓ Unlocked Complimentary Pan-India Shipping
              </span>
            )}
            <span className="text-[11px] text-stone-400 tabular-nums font-mono">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="w-full h-1 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-stone-900 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-100">
          {cart.length === 0 ? (
            <div className="py-24 text-center space-y-4">
              <p className="font-editorial text-xl text-stone-700">Your shopping bag is empty.</p>
              <p className="text-xs text-stone-500 font-light max-w-xs mx-auto">
                Explore our handwoven Chanderi, pure Khadi cotton, and limited capsule silhouettes.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 bg-stone-900 text-white text-xs tracking-wider uppercase font-medium rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            cart.map(({ product, quantity, selectedSize }) => (
              <div key={`${product.id}-${selectedSize}`} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-18 h-22 object-cover rounded-lg bg-stone-100 border border-stone-200/80 shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-medium text-stone-900 line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 font-light mt-0.5">
                        {product.material} {selectedSize ? `· Size: ${selectedSize}` : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      aria-label="Remove item"
                      className="text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Stepper */}
                    <div className="flex items-center border border-stone-200 rounded-full bg-white px-2 py-0.5">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-1 text-stone-500 hover:text-stone-900 font-bold cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-medium tabular-nums">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="px-1 text-stone-500 hover:text-stone-900 font-bold cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    {/* Price in INR */}
                    <span className="text-xs font-medium text-stone-900 tabular-nums">
                      {formatINR(product.price * quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Promo Code & Totals Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-[#FAF9F6] space-y-4">
            {/* Courtesy / Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Code (ATELIER10)"
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-full text-xs placeholder:text-stone-400 focus:outline-none focus:border-stone-800"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-xs font-medium text-white rounded-full transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>

            {discountCode && (
              <div className="flex justify-between items-center text-xs text-stone-800 bg-white border border-stone-200 px-3 py-1.5 rounded-full">
                <span>Code &ldquo;{discountCode}&rdquo; applied ({appliedDiscount * 100}%)</span>
                <span className="font-medium">-{formatINR(discountAmount)}</span>
              </div>
            )}

            {/* Price breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-500 font-light">
                <span>Subtotal</span>
                <span className="font-medium text-stone-900 tabular-nums">{formatINR(rawSubtotal)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-stone-800 font-light">
                  <span>Courtesy Courtesy</span>
                  <span className="tabular-nums">-{formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-500 font-light">
                <span>Pan-India Shipping</span>
                <span className="font-medium text-stone-900">
                  {rawSubtotal >= freeShippingThreshold ? 'Complimentary' : '₹90'}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-semibold text-stone-900">
                <span>Total Amount</span>
                <span className="tabular-nums">
                  {formatINR(finalSubtotal + (rawSubtotal >= freeShippingThreshold ? 0 : 90))}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white text-xs tracking-wider uppercase font-semibold rounded-full shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 font-light">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
              <span>Direct Artisan Weave · Plastic-Free Muslin Bag Delivery</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
