import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Check, Compass, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setBackendTab, showToast, openDashboardInNewTab, setSelectedCategory } = useStore();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribed(true);
    showToast('Subscribed to Atelier Dispatch', 'You will receive seasonal textile stories and private release notes.');
    setEmailInput('');
  };

  const handleCategoryClick = (cat: 'All' | 'Women' | 'Men' | 'Children') => {
    setSelectedCategory(cat);
    setCurrentView('storefront');
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 text-stone-400 border-t border-stone-800 text-xs font-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Brand & Ethos */}
          <div className="md:col-span-4 space-y-5">
            <div className="space-y-1">
              <span className="font-editorial text-2xl font-medium tracking-[0.25em] text-stone-100 block uppercase">
                AURA
              </span>
              <p className="text-[10px] tracking-[0.3em] uppercase text-stone-500">
                Natural Indian Apparel & Handlooms
              </p>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              Contemporary silhouettes shaped by centuries of Indian textile heritage. Pit-loom Chanderi silks, rain-fed organic cotton, and hand-carved block prints tailored with deliberate quietude.
            </p>
            <div className="flex items-center gap-6 text-[11px] text-stone-500 pt-1">
              <span>Jaipur · Varanasi · Surat</span>
              <span>·</span>
              <span>100% Biodegradable</span>
            </div>
          </div>

          {/* Departments */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-stone-200">
              Wardrobe
            </h4>
            <ul className="space-y-2.5 text-stone-400">
              <li>
                <button
                  onClick={() => handleCategoryClick('All')}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  All Silhouettes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Women')}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  Women's Handlooms
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Men')}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  Men's Khadi & Kurtas
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Children')}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  Children's Organic Sets
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('tracking')}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  Track Consignment
                </button>
              </li>
            </ul>
          </div>

          {/* Studio Management */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-stone-200">
              Studio
            </h4>
            <ul className="space-y-2.5 text-stone-400">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('backend');
                    setBackendTab('products');
                  }}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  Garment Catalog & Images
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('backend');
                    setBackendTab('orders');
                  }}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  Dispatched Consignments
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('backend');
                    setBackendTab('hero');
                  }}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  Hero & Editorial Banners
                </button>
              </li>
              <li>
                <button
                  onClick={openDashboardInNewTab}
                  className="inline-flex items-center gap-1 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="Open Studio in a separate browser tab"
                >
                  <span>Open Studio (New Tab)</span>
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter / Seasonal Dispatch */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-stone-200">
              Seasonal Dispatch
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Receive quiet seasonal updates, new dye batch chronicles, and limited capsule invitations.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 pt-1">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Your email address..."
                className="flex-1 px-4 py-2.5 bg-stone-900 border border-stone-800 rounded-full text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-stone-400"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="px-5 py-2.5 bg-stone-100 hover:bg-white text-stone-900 font-medium rounded-full text-xs transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {subscribed ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-light">
          <div>
            © {new Date().getFullYear()} AURA Apparel & Handloom Textiles. Handcrafted with pride across India.
          </div>
          <div className="flex items-center gap-6">
            <span>All amounts in Indian Rupees (INR ₹)</span>
            <span>·</span>
            <span>Plastic-Free Fulfillment</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
