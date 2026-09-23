import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingBag,
  Search,
  Truck,
  Menu,
  X,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';
import { ProductCategory } from '../../types';

export const Navbar: React.FC = () => {
  const {
    cart,
    setIsCartOpen,
    setIsSearchOpen,
    currentView,
    setCurrentView,
    selectedCategory,
    setSelectedCategory,
    openDashboardInNewTab,
    heroConfig,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCategorySelect = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setCurrentView('storefront');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById('catalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleStoryClick = () => {
    setCurrentView('storefront');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById('story');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Editorial Announcement Strip */}
      <div className="bg-stone-900 text-stone-200 text-[11px] tracking-wider py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-3">
            <span className="font-light">{heroConfig.activeSaleOffer || 'Complimentary Pan-India Express Shipping on Orders Above ₹1,999'}</span>
          </div>

          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6 text-[11px] text-stone-300">
            <span className="sm:hidden font-light">Complimentary Pan-India Shipping over ₹1,999</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView('tracking')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Track Consignment
              </button>
              <span className="text-stone-600">·</span>
              {/* Discrete Dashboard Link with user's new tab capability */}
              <button
                onClick={openDashboardInNewTab}
                title="Open Studio Manager in a new browser tab"
                className="inline-flex items-center gap-1 text-stone-300 hover:text-white transition-colors cursor-pointer"
              >
                <span>Studio</span>
                <ExternalLink className="w-3 h-3 text-stone-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Minimalist Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        
        {/* Zone 1: Editorial Brandmark */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              setCurrentView('storefront');
              setSelectedCategory('All');
            }}
            className="text-left group cursor-pointer focus-visible:outline-none"
          >
            <div className="font-editorial text-2xl sm:text-3xl tracking-[0.25em] font-medium text-stone-900 uppercase">
              AURA
            </div>
            <span className="block text-[9px] tracking-[0.3em] uppercase text-stone-500 font-light -mt-0.5">
              Atelier & Textiles
            </span>
          </button>
        </div>

        {/* Zone 2: Minimalist Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs tracking-wider uppercase font-medium text-stone-600">
          <button
            onClick={() => handleCategorySelect('All')}
            className={`pb-1 transition-colors relative cursor-pointer ${
              selectedCategory === 'All' && currentView === 'storefront'
                ? 'text-stone-900 font-semibold'
                : 'hover:text-stone-900'
            }`}
          >
            <span>Collection</span>
            {selectedCategory === 'All' && currentView === 'storefront' && (
              <span className="absolute -bottom-1 inset-x-0 h-[1.5px] bg-stone-900" />
            )}
          </button>

          <button
            onClick={() => handleCategorySelect('Women')}
            className={`pb-1 transition-colors relative cursor-pointer ${
              selectedCategory === 'Women' && currentView === 'storefront'
                ? 'text-stone-900 font-semibold'
                : 'hover:text-stone-900'
            }`}
          >
            <span>Women</span>
            {selectedCategory === 'Women' && currentView === 'storefront' && (
              <span className="absolute -bottom-1 inset-x-0 h-[1.5px] bg-stone-900" />
            )}
          </button>

          <button
            onClick={() => handleCategorySelect('Men')}
            className={`pb-1 transition-colors relative cursor-pointer ${
              selectedCategory === 'Men' && currentView === 'storefront'
                ? 'text-stone-900 font-semibold'
                : 'hover:text-stone-900'
            }`}
          >
            <span>Men</span>
            {selectedCategory === 'Men' && currentView === 'storefront' && (
              <span className="absolute -bottom-1 inset-x-0 h-[1.5px] bg-stone-900" />
            )}
          </button>

          <button
            onClick={() => handleCategorySelect('Children')}
            className={`pb-1 transition-colors relative cursor-pointer ${
              selectedCategory === 'Children' && currentView === 'storefront'
                ? 'text-stone-900 font-semibold'
                : 'hover:text-stone-900'
            }`}
          >
            <span>Children</span>
            {selectedCategory === 'Children' && currentView === 'storefront' && (
              <span className="absolute -bottom-1 inset-x-0 h-[1.5px] bg-stone-900" />
            )}
          </button>

          <button
            onClick={handleStoryClick}
            className="pb-1 transition-colors relative hover:text-stone-900 cursor-pointer"
          >
            <span>Atelier Story</span>
          </button>
        </nav>

        {/* Zone 3: Actions (Search, Order Tracking, Bag, Mobile Toggle) */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Minimalist Search Icon Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search catalog"
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4 stroke-[1.5]" />
          </button>

          {/* Minimalist Order Tracking */}
          <button
            onClick={() => setCurrentView('tracking')}
            aria-label="Track consignment"
            title="Track Consignment"
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              currentView === 'tracking'
                ? 'text-stone-900 bg-stone-100'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Truck className="w-4 h-4 stroke-[1.5]" />
          </button>

          {/* Shopping Bag Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="View shopping bag"
            className="relative p-2 text-stone-800 hover:text-stone-950 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.75]" />
            {totalCartCount > 0 && (
              <span className="absolute top-0 right-0 bg-stone-900 text-white text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Studio Link / Switch */}
          <button
            onClick={() => setCurrentView(currentView === 'backend' ? 'storefront' : 'backend')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] tracking-wider uppercase font-medium rounded-full border border-stone-300 text-stone-700 hover:border-stone-800 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>{currentView === 'backend' ? 'Storefront' : 'Studio'}</span>
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 text-stone-700 hover:text-stone-900 rounded-lg cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200/80 bg-[#FAF9F6] px-6 py-6 space-y-4 shadow-lg animate-in fade-in">
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-400">
            Departments
          </div>
          <div className="flex flex-col space-y-3 text-sm font-medium text-stone-800">
            <button
              onClick={() => handleCategorySelect('All')}
              className="text-left py-1 hover:text-stone-600 transition-colors"
            >
              Complete Collection
            </button>
            <button
              onClick={() => handleCategorySelect('Women')}
              className="text-left py-1 hover:text-stone-600 transition-colors"
            >
              Women · Handloom Silks & Mulmul
            </button>
            <button
              onClick={() => handleCategorySelect('Men')}
              className="text-left py-1 hover:text-stone-600 transition-colors"
            >
              Men · Khadi Shirts & Chanderi Kurtas
            </button>
            <button
              onClick={() => handleCategorySelect('Children')}
              className="text-left py-1 hover:text-stone-600 transition-colors"
            >
              Children · Organic Cotton & Festive Sets
            </button>
            <button
              onClick={handleStoryClick}
              className="text-left py-1 hover:text-stone-600 transition-colors"
            >
              The Atelier Philosophy
            </button>
          </div>

          <div className="pt-4 border-t border-stone-200 flex flex-col space-y-3 text-xs">
            <button
              onClick={() => {
                setCurrentView('tracking');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 py-1 text-stone-700"
            >
              <Truck className="w-4 h-4 text-stone-500" />
              <span>Track Consignment</span>
            </button>

            <button
              onClick={() => {
                openDashboardInNewTab();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between py-2 text-stone-700 border-t border-stone-200/60"
            >
              <span>Open Studio Manager (New Tab)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
