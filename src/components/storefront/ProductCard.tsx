import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore, formatINR } from '../../context/StoreContext';
import { Plus, Check, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct } = useStore();
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes?.[0] || 'Standard';
    addToCart(product, 1, defaultSize);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const discountPercent =
    product.originalMrp && product.originalMrp > product.price
      ? Math.round(((product.originalMrp - product.price) / product.originalMrp) * 100)
      : 0;

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group flex flex-col bg-white rounded-xl border border-stone-200/80 overflow-hidden cursor-pointer transition-all duration-300 hover:border-stone-400 hover:shadow-lg hover:shadow-stone-900/5"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] bg-[#F7F6F3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Subtle Material & Origin Tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {product.material && (
            <span className="text-[10px] tracking-wider uppercase font-medium text-stone-700 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-stone-200/60 shadow-2xs">
              {product.material}
            </span>
          )}
        </div>

        {/* Discrete Discount Badge (if any) */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3">
            <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-900 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-stone-200/60 shadow-2xs">
              -{discountPercent}%
            </span>
          </div>
        )}

        {/* Hover Quick Action Layer */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 translate-y-1.5 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className={`flex-1 py-2.5 px-3 text-xs tracking-wider uppercase font-medium rounded-full flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${
              justAdded
                ? 'bg-emerald-800 text-white'
                : 'bg-stone-900/95 hover:bg-stone-900 text-white backdrop-blur-xs'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            aria-label="View garment details"
            className="w-9 h-9 bg-white/95 hover:bg-white text-stone-800 rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer shrink-0"
          >
            <Eye className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-stone-400 tracking-wider uppercase">
            <span>{product.category}</span>
            {product.supplierOrigin && (
              <span className="text-stone-500 font-light truncate max-w-[140px]">
                {product.supplierOrigin.split(',')[0]}
              </span>
            )}
          </div>

          <h3 className="text-sm font-medium text-stone-900 group-hover:text-stone-600 transition-colors line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 font-light line-clamp-1 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Sizes Preview & Pricing */}
        <div className="pt-3 border-t border-stone-100 flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-stone-900 tabular-nums">
              {formatINR(product.price)}
            </span>
            {product.originalMrp && product.originalMrp > product.price && (
              <span className="text-xs text-stone-400 line-through tabular-nums font-light">
                {formatINR(product.originalMrp)}
              </span>
            )}
          </div>

          {/* Size Pills */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="text-[11px] text-stone-500 font-light tracking-wide">
              {product.sizes.length > 2
                ? `${product.sizes[0]} – ${product.sizes[product.sizes.length - 1]}`
                : product.sizes.join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
