import React, { useEffect, useRef } from 'react';
import { useStore, formatINR } from '../../context/StoreContext';
import { Search, X, ArrowRight, Star } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    products,
    setSelectedProduct,
    setCurrentView,
  } = useStore();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Keyboard shortcut Cmd+K or / to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const results = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.material && p.material.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.supplierOrigin && p.supplierOrigin.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectProduct = (p: typeof products[0]) => {
    setSelectedProduct(p);
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden mt-12 animate-in slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3">
          <Search className="w-4 h-4 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search garments by weave, category, city..."
            className="flex-1 text-sm bg-transparent border-none text-stone-900 placeholder:text-stone-400 focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
            className="p-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 divide-y divide-stone-100">
          {results.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-400 font-light">
              No garments found matching &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className="py-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50 px-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-14 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200/80"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-medium text-stone-900 truncate">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 font-light truncate">{product.tagline}</p>
                    <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-0.5 font-light uppercase tracking-wider">
                      <span>{product.category}</span>
                      {product.material && (
                        <>
                          <span>·</span>
                          <span>{product.material}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-medium text-stone-900 tabular-nums">
                    {formatINR(product.price)}
                  </div>
                  <div className="text-[10px] text-stone-400 font-light">
                    {product.stock} available
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Search Footer */}
        <div className="p-3 bg-[#FAF9F6] border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500 font-light">
          <span>Press ESC to close</span>
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setCurrentView('storefront');
              const el = document.getElementById('catalog');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-stone-900 font-medium hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Garments</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
