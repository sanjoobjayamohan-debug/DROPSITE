import React from 'react';
import { Feather, Sparkles, Sprout, ShieldCheck, Compass } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AtelierStory: React.FC = () => {
  const { setSelectedCategory } = useStore();

  const handleExplore = () => {
    setSelectedCategory('All');
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="story" className="border-t border-stone-200/80 bg-[#FAF9F6] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Editorial Vignette */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-stone-500">
              <Compass className="w-3.5 h-3.5 text-stone-700" />
              <span>The Atelier Philosophy</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-medium tracking-tight text-stone-900 leading-[1.15]">
              Slow textiles, honest weaves, and quiet silhouettes.
            </h2>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl font-light">
              We reject fleeting micro-trends and synthetic plastic blends. Every garment at AURA begins in generational artisan clusters across Varanasi, Jaipur, and Surat—woven slowly on wooden pit looms using pure mulberry silk, organic rain-fed cotton, and herbal botanical dyes.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-stone-700 font-medium">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
                100% Biodegradable Natural Fibers
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
                Artisan Handloom Guild Partnerships
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
                Plastic-Free Muslin Bag Packaging
              </span>
            </div>

            <div className="pt-4">
              <button
                onClick={handleExplore}
                type="button"
                className="inline-flex items-center gap-2 text-xs tracking-wider uppercase font-semibold text-stone-900 pb-1 border-b border-stone-900 hover:text-stone-600 hover:border-stone-400 transition-colors cursor-pointer"
              >
                <span>Discover the Garment Collection</span>
                <span>→</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-xs aspect-[4/3]">
              <img
                src="/src/assets/images/craft_handloom_textile_1790140405358.jpg"
                alt="Traditional wooden handloom weaving pure natural cotton yarn"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <p className="text-xs uppercase tracking-widest font-semibold text-stone-300">
                    Artisan Collective · Varanasi & Jaipur
                  </p>
                  <p className="text-sm font-editorial text-stone-100 italic mt-0.5">
                    "A single handloom saree carries upwards of eighty hours of human touch and lineage."
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Pillars of Craftsmanship */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-7 bg-white rounded-2xl border border-stone-200/70 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
              <Feather className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 tracking-tight">Pure Raw Fibers</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              We exclusively use long-staple Indian cotton, Chanderi mulberry silk, and natural Khadi. Zero synthetic polyester, nylon, or acrylic fillers.
            </p>
          </div>

          <div className="p-7 bg-white rounded-2xl border border-stone-200/70 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 tracking-tight">Artisanal Looms</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Crafted in partnership with generational master weavers. Each cut retains the tactile nuances and breathable grain only pit looms can produce.
            </p>
          </div>

          <div className="p-7 bg-white rounded-2xl border border-stone-200/70 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 tracking-tight">Small-Batch Tailoring</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Cut and tailored in limited runs of 80–120 pieces. We create only what is worn, preventing the textile surplus that burdens landfills.
            </p>
          </div>

          <div className="p-7 bg-white rounded-2xl border border-stone-200/70 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 tracking-tight">Fair Provenance</h3>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Every garment tags its weaving cluster origin and master artisan co-op. We ensure prompt, dignified remuneration for all craftspeople.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
