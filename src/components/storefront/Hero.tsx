import React from 'react';
import { ArrowRight, SlidersHorizontal, ArrowDown } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCategory } from '../../types';

export const Hero: React.FC = () => {
  const {
    heroConfig,
    setCurrentView,
    setBackendTab,
    selectedCategory,
    setSelectedCategory,
  } = useStore();

  const handleCategoryClick = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBackendHero = () => {
    setBackendTab('hero');
    setCurrentView('backend');
  };

  return (
    <section className="relative bg-[#FAF9F6] border-b border-stone-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Editorial Copy Column */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Volume / Season Eyebrow */}
            <div className="inline-flex items-center gap-2.5 text-xs font-medium tracking-[0.25em] uppercase text-stone-500">
              <span className="w-2 h-2 rounded-full bg-stone-800" />
              <span>{heroConfig.festivalTitle || 'SPRING / SUMMER · VOL. 01'}</span>
            </div>

            {/* Editorial Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-editorial font-medium tracking-tight text-stone-900 leading-[1.1]">
                {heroConfig.mainHeadline || 'Understated Silhouettes.'}
                <span className="block italic text-stone-600 font-light mt-1">
                  {heroConfig.highlightSpan || 'Pure Handwoven Indian Textiles'}
                </span>
              </h1>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light max-w-xl pt-2">
                {heroConfig.description ||
                  'Mindfully designed apparel cut from pure handloom Chanderi silk, organic Khadi cotton, and breathable linen. Sourced directly from artisan weaving clusters across Jaipur, Varanasi, and Surat.'}
              </p>
            </div>

            {/* Department Quick Filter Tabs */}
            <div className="pt-1">
              <div className="text-[11px] font-medium tracking-[0.2em] uppercase text-stone-400 mb-3">
                Curated Departments
              </div>
              <div className="flex flex-wrap gap-2">
                {(['All', 'Women', 'Men', 'Children'] as const).map((cat) => {
                  const isCurrent = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryClick(cat)}
                      className={`px-4 py-2 text-xs tracking-wider uppercase font-medium rounded-full border transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                          : 'bg-white text-stone-700 hover:border-stone-400 border-stone-200'
                      }`}
                    >
                      {cat === 'All' ? 'All Styles' : cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Minimal CTAs */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleScrollToCatalog}
                className="inline-flex items-center gap-3 px-7 py-3.5 text-xs font-semibold tracking-wider uppercase text-white bg-stone-900 hover:bg-stone-800 rounded-full transition-all shadow-xs active:scale-[0.99] cursor-pointer"
              >
                <span>{heroConfig.ctaPrimaryText || 'Explore Collection'}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('story');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-medium tracking-wider uppercase text-stone-700 bg-transparent hover:bg-stone-100/80 border border-stone-300 rounded-full transition-all cursor-pointer"
              >
                <span>Atelier Story</span>
              </button>

              {/* Discreet hero settings trigger for store owner */}
              <button
                type="button"
                onClick={handleOpenBackendHero}
                title="Edit Hero Banner Copy in Studio"
                aria-label="Edit Hero Banner Copy"
                className="p-3 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3 Hallmarks */}
            <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-4 text-stone-600">
              <div>
                <div className="text-xs font-semibold text-stone-900 tracking-tight">100% Natural</div>
                <div className="text-[11px] text-stone-500 font-light mt-0.5">Pit-loom cotton & silk</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-stone-900 tracking-tight">Limited Runs</div>
                <div className="text-[11px] text-stone-500 font-light mt-0.5">Small artisan batches</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-stone-900 tracking-tight">Zero Plastic</div>
                <div className="text-[11px] text-stone-500 font-light mt-0.5">Muslin bag packaging</div>
              </div>
            </div>

          </div>

          {/* Right Visual Image Column */}
          <div className="lg:col-span-6">
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-sm aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5]">
                <img
                  src={heroConfig.heroImage || '/src/assets/images/hero_minimalist_apparel_1790140391930.jpg'}
                  alt="Minimalist contemporary Indian handloom apparel"
                  className="w-full h-full object-cover object-center"
                />
                
                {/* Subtle Editorial Caption Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent p-6 sm:p-8 flex items-end justify-between">
                  <div className="text-white space-y-1">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-stone-300 font-medium">
                      Atelier Capsule · 2026
                    </span>
                    <h3 className="font-editorial text-lg sm:text-xl font-normal text-stone-100 italic">
                      "Dignity in every thread, ease in every silhouette."
                    </h3>
                  </div>

                  <button
                    onClick={handleScrollToCatalog}
                    aria-label="Scroll to collection"
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-stone-900 flex items-center justify-center transition-all cursor-pointer shrink-0"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
