import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ProductCategory } from '../../types';
import { Search, RotateCcw, ChevronDown } from 'lucide-react';

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'All', label: 'All Garments' },
  { id: 'Women', label: 'Women' },
  { id: 'Men', label: 'Men' },
  { id: 'Children', label: 'Children' },
];

const FABRIC_MATERIALS = [
  'All',
  '100% Pure Cotton',
  'Chanderi Silk',
  'Mulmul Cotton',
  'Linen Blend',
  'Raw Denim',
  'Banarasi Jacquard',
];

export const ProductGrid: React.FC = () => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedMaterial,
    setSelectedMaterial,
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategory === 'All' || product.category === selectedCategory;

        const matchesMaterial =
          selectedMaterial === 'All' ||
          (product.material && product.material.toLowerCase().includes(selectedMaterial.toLowerCase()));

        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.tagline.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          (product.material && product.material.toLowerCase().includes(query)) ||
          (product.supplierOrigin && product.supplierOrigin.toLowerCase().includes(query));

        return matchesCategory && matchesMaterial && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedMaterial, searchQuery, sortBy]);

  const hasActiveFilters = selectedCategory !== 'All' || selectedMaterial !== 'All' || searchQuery.trim() !== '';

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedMaterial('All');
    setSearchQuery('');
  };

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      
      {/* Editorial Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200">
        <div className="space-y-2">
          <div className="text-xs font-medium tracking-[0.25em] uppercase text-stone-400">
            Natural Textile Wardrobe
          </div>
          <h2 className="text-3xl sm:text-4xl font-editorial font-medium text-stone-900 tracking-tight">
            {selectedCategory === 'All'
              ? 'The Contemporary Collection'
              : `${selectedCategory}'s Collection`}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-light">
            Showing {filteredProducts.length} thoughtfully designed silhouettes tailored in limited editions.
          </p>
        </div>

        {/* Minimal Search & Sort */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fabric, style, city..."
              className="w-full pl-9 pr-4 py-2 bg-white rounded-full border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-800 transition-colors shadow-2xs"
            />
          </div>

          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none pl-4 pr-9 py-2 bg-white rounded-full border border-stone-200 text-xs font-medium text-stone-700 focus:outline-none focus:border-stone-800 transition-colors cursor-pointer shadow-2xs"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filter Row: Categories + Fabric Materials */}
      <div className="py-6 flex flex-col gap-4 border-b border-stone-200/60">
        
        {/* Department Tabs */}
        <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-1.5 text-xs tracking-wider uppercase font-medium rounded-full transition-all cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-white'
                      : 'bg-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 tracking-wider uppercase font-medium cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Fabric Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-medium tracking-wider uppercase text-stone-400 shrink-0 mr-1">
            Fiber:
          </span>
          {FABRIC_MATERIALS.map((fabric) => {
            const isSelected = selectedMaterial === fabric;
            return (
              <button
                key={fabric}
                type="button"
                onClick={() => setSelectedMaterial(fabric)}
                className={`px-3 py-1 text-[11px] tracking-wide font-medium rounded-full border transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-stone-800 text-white border-stone-800'
                    : 'bg-white text-stone-600 hover:border-stone-400 border-stone-200'
                }`}
              >
                {fabric === 'All' ? 'All Weaves' : fabric}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid Stage */}
      {filteredProducts.length === 0 ? (
        <div className="py-24 text-center space-y-4">
          <p className="font-editorial text-2xl text-stone-700">No styles match your selection.</p>
          <p className="text-xs text-stone-500 font-light max-w-sm mx-auto">
            Try adjusting your department or fiber filters to browse the complete atelier catalogue.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 bg-stone-900 text-white text-xs tracking-wider uppercase font-medium rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Show All Garments
          </button>
        </div>
      ) : (
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
