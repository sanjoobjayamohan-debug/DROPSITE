import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { HeroBannerConfig, ProductCategory } from '../../types';
import {
  Sparkles,
  Save,
  RotateCcw,
  Eye,
  Check,
  Upload,
  ExternalLink,
} from 'lucide-react';

export const HeroSectionTab: React.FC = () => {
  const { heroConfig, updateHeroConfig, showToast, setCurrentView, openDashboardInNewTab } = useStore();
  const [config, setConfig] = useState<HeroBannerConfig>(heroConfig);
  const [justSaved, setJustSaved] = useState(false);

  // Sync state if heroConfig changes externally
  React.useEffect(() => {
    setConfig(heroConfig);
  }, [heroConfig]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroConfig(config);
    setJustSaved(true);
    showToast('Hero Section Saved', 'Storefront editorial hero has been updated live!', 'success');
    setTimeout(() => setJustSaved(false), 2000);
  };

  const handleReset = () => {
    const defaults: HeroBannerConfig = {
      festivalTitle: 'NATURAL TEXTILES · HANDLOOM ARCHIVE',
      mainHeadline: 'Living Weaves of India, Tailored in Quiet Minimalist Forms.',
      highlightSpan: 'Chanderi, Khadi, & Organic Cotton',
      description: 'Slow apparel crafted across traditional weaver clusters in Varanasi, Jaipur, and Surat. Direct from artisan pit-looms with zero synthetic blends and complimentary pan-India dispatch.',
      badgeDiscount: 'LIMITED CAPSULE · AUTUMN DISPATCH',
      ctaPrimaryText: 'Explore Wardrobe',
      ctaPrimaryCategory: 'Women',
      heroImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
      heroSecondaryImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      announcementTicker: [
        'Varanasi Loom Direct: Pure Chanderi & Kora Cotton silhouettes tailored in limited batches',
        'Jaipur Block-Print Atelier: Hand-carved teak dyes on unbleached 100% Khadi',
        'Complimentary Pan-India Express Delivery on orders above ₹1,999 with BlueDart & Delhivery',
        'Safe, Plastic-Free Muslin Packaging · Verified Cash on Delivery (COD) Available',
      ],
      activeSaleOffer: 'Complimentary Pan-India Shipping on orders ₹1,999+',
    };
    setConfig(defaults);
    updateHeroConfig(defaults);
    showToast('Hero Reset', 'Restored default minimalist editorial hero.', 'info');
  };

  const handleImageUpload = (field: 'heroImage' | 'heroSecondaryImage', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const res = ev.target?.result as string;
        if (res) {
          setConfig((prev) => ({ ...prev, [field]: res }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 uppercase tracking-[0.2em] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-stone-700" />
            <span>Storefront First Section Controller</span>
          </div>
          <h2 className="font-editorial text-2xl font-medium text-stone-900">
            Editorial Hero CMS
          </h2>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            The first section of the storefront is dynamically controlled here. Any changes take effect immediately on the customer landing page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentView('storefront')}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Storefront</span>
          </button>
          <button
            type="button"
            onClick={openDashboardInNewTab}
            className="px-4 py-2 border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-medium rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Open in new browser tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-stone-600" />
            <span>New Tab</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-stone-200 hover:bg-stone-50 text-stone-500 text-xs font-medium rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form Column */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            
            {/* Header Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Editorial Category Tag
                </label>
                <input
                  type="text"
                  required
                  value={config.festivalTitle}
                  onChange={(e) => setConfig({ ...config, festivalTitle: e.target.value })}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Capsule / Badge Notice
                </label>
                <input
                  type="text"
                  required
                  value={config.badgeDiscount}
                  onChange={(e) => setConfig({ ...config, badgeDiscount: e.target.value })}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-medium text-stone-800"
                />
              </div>
            </div>

            {/* Main Headline */}
            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Main Headline
              </label>
              <input
                type="text"
                required
                value={config.mainHeadline}
                onChange={(e) => setConfig({ ...config, mainHeadline: e.target.value })}
                className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-editorial text-base text-stone-900 focus:border-stone-800"
              />
            </div>

            {/* Highlight Tagline */}
            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Highlight Accent Span
              </label>
              <input
                type="text"
                required
                value={config.highlightSpan}
                onChange={(e) => setConfig({ ...config, highlightSpan: e.target.value })}
                className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-medium text-stone-800 focus:border-stone-800"
              />
            </div>

            {/* Description Subtitle */}
            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Hero Description / Value Narrative
              </label>
              <textarea
                rows={3}
                required
                value={config.description}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-light text-stone-700"
              />
            </div>

            {/* CTA Text & Target Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Primary CTA Label
                </label>
                <input
                  type="text"
                  required
                  value={config.ctaPrimaryText}
                  onChange={(e) => setConfig({ ...config, ctaPrimaryText: e.target.value })}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  CTA Target Department
                </label>
                <select
                  value={config.ctaPrimaryCategory}
                  onChange={(e) => setConfig({ ...config, ctaPrimaryCategory: e.target.value as ProductCategory })}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-medium"
                >
                  <option value="Women">Women's Handlooms</option>
                  <option value="Men">Men's Khadi & Silhouettes</option>
                  <option value="Children">Children's Pure Cotton</option>
                  <option value="All">Complete Archive</option>
                </select>
              </div>
            </div>

            {/* Active Banner Offer */}
            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Top Ticker Offer Text
              </label>
              <input
                type="text"
                value={config.activeSaleOffer}
                onChange={(e) => setConfig({ ...config, activeSaleOffer: e.target.value })}
                className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-mono text-stone-800"
              />
            </div>

            {/* Banner Images: Primary & Secondary */}
            <div className="space-y-3 p-4 bg-[#FAF9F6] rounded-xl border border-stone-200">
              <div className="font-medium text-stone-900">
                Hero Photography Assets:
              </div>

              {/* Primary Image */}
              <div>
                <label className="block text-stone-600 font-light mb-1">
                  Primary Model / Garment Image
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={config.heroImage}
                    onChange={(e) => setConfig({ ...config, heroImage: e.target.value })}
                    className="flex-1 p-2 bg-white border border-stone-300 rounded-lg font-mono text-[11px]"
                  />
                  <label className="px-3 py-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 font-medium rounded-lg cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3 h-3" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload('heroImage', e)}
                    />
                  </label>
                </div>
              </div>

              {/* Secondary Image */}
              <div>
                <label className="block text-stone-600 font-light mb-1">
                  Secondary Weave / Detail Image
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={config.heroSecondaryImage}
                    onChange={(e) => setConfig({ ...config, heroSecondaryImage: e.target.value })}
                    className="flex-1 p-2 bg-white border border-stone-300 rounded-lg font-mono text-[11px]"
                  />
                  <label className="px-3 py-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 font-medium rounded-lg cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3 h-3" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload('heroSecondaryImage', e)}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Announcement Ticker Items */}
            <div>
              <label className="block font-medium text-stone-700 mb-1">
                Announcement Ticker Messages (One line per ticker announcement)
              </label>
              <textarea
                rows={4}
                value={config.announcementTicker.join('\n')}
                onChange={(e) => setConfig({
                  ...config,
                  announcementTicker: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                })}
                className="w-full p-2.5 bg-white border border-stone-300 rounded-xl font-mono text-[11px]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-7 py-3 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-full shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                {justSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Updated Live on Storefront!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save & Publish Hero</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Live Preview Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-xs font-medium text-stone-700 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-stone-600" />
                <span>Live Hero Preview</span>
              </span>
              <span className="text-[10px] bg-stone-100 text-stone-800 font-medium px-2 py-0.5 rounded-full">
                Synchronized
              </span>
            </div>

            {/* Ticker banner */}
            <div className="p-2.5 bg-stone-900 text-white text-[10px] rounded-lg flex items-center justify-between">
              <span className="truncate">{config.announcementTicker[0] || 'Varanasi Loom Direct Apparel'}</span>
              <span className="bg-stone-800 text-stone-300 px-1.5 py-0.5 rounded text-[9px] shrink-0 font-mono">
                {config.activeSaleOffer}
              </span>
            </div>

            {/* Images layout */}
            <div className="grid grid-cols-2 gap-2">
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-stone-100 border border-stone-200">
                <img src={config.heroImage} alt="Main" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-stone-100 border border-stone-200">
                <img src={config.heroSecondaryImage} alt="Secondary" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Text Preview */}
            <div className="space-y-1.5 text-xs">
              <div className="text-[10px] font-medium text-stone-500 uppercase tracking-widest">
                {config.festivalTitle} · {config.badgeDiscount}
              </div>
              <h3 className="font-editorial text-lg font-medium text-stone-900 leading-tight">
                {config.mainHeadline}
              </h3>
              <div className="text-xs text-stone-700 italic">
                {config.highlightSpan}
              </div>
              <p className="text-stone-500 text-[11px] font-light line-clamp-2">
                {config.description}
              </p>
              
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentView('storefront')}
                  className="w-full py-2 bg-stone-900 text-white font-medium rounded-full text-center text-xs cursor-pointer"
                >
                  {config.ctaPrimaryText} ({config.ctaPrimaryCategory})
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
