import React from 'react';
import { useStore } from '../../context/StoreContext';
import { AnalyticsTab } from './AnalyticsTab';
import { ProductsTab } from './ProductsTab';
import { OrdersTab } from './OrdersTab';
import { InventoryTab } from './InventoryTab';
import { ReviewsTab } from './ReviewsTab';
import { EmailNotificationsTab } from './EmailNotificationsTab';
import { HeroSectionTab } from './HeroSectionTab';
import {
  TrendingUp,
  Package,
  Truck,
  Layers,
  Star,
  Mail,
  Store,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface NavItem {
  id: 'analytics' | 'hero' | 'products' | 'orders' | 'inventory' | 'reviews' | 'emails';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const BackendDashboard: React.FC = () => {
  const {
    backendTab,
    setBackendTab,
    setCurrentView,
    orders,
    reviews,
    openDashboardInNewTab,
  } = useStore();

  const unfulfilledCount = orders.filter((o) => o.status === 'Unfulfilled').length;
  const pendingReviewsCount = reviews.filter((r) => r.status === 'Pending').length;

  const NAV_ITEMS: NavItem[] = [
    { id: 'analytics', label: 'Sales Overview (₹)', icon: TrendingUp },
    { id: 'hero', label: 'Editorial Hero CMS', icon: Sparkles },
    { id: 'products', label: 'Apparel & 5 Photos', icon: Package },
    {
      id: 'orders',
      label: 'Consignments & Logistics',
      icon: Truck,
      badge: unfulfilledCount > 0 ? unfulfilledCount : undefined,
    },
    { id: 'inventory', label: 'Fabric Stock & Weaves', icon: Layers },
    {
      id: 'reviews',
      label: 'Customer Letters',
      icon: Star,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
    },
    { id: 'emails', label: 'SMS & Dispatch Triggers', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 pb-20 font-sans">
      
      {/* Studio Top Bar */}
      <header className="bg-stone-900 text-stone-100 sticky top-0 z-30 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <span className="font-editorial text-xl font-medium tracking-[0.2em] text-white">
              AURA
            </span>
            <span className="text-stone-600">/</span>
            <span className="text-xs font-light tracking-wider uppercase text-stone-300">
              Studio & Inventory Management
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Atelier Status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-stone-800/80 rounded-full text-[11px] text-stone-300 border border-stone-700/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Jaipur, Varanasi & Surat Ateliers Active</span>
            </div>

            {/* Dashboard Line: Open New Tab of Browser (User Requirement) */}
            <button
              onClick={openDashboardInNewTab}
              title="Open Studio in a brand new browser tab"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-800 hover:bg-stone-750 text-stone-200 hover:text-white text-xs font-medium rounded-full border border-stone-700 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open in New Tab</span>
            </button>

            {/* Switch to Storefront Button */}
            <button
              onClick={() => setCurrentView('storefront')}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-stone-100 hover:bg-white text-stone-950 text-xs font-semibold rounded-full transition-all cursor-pointer shadow-xs"
            >
              <Store className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-stone-200 scrollbar-none">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = backendTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setBackendTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full whitespace-nowrap transition-all focus-visible:outline-none cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-stone-200' : 'text-stone-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-medium ${
                      isActive ? 'bg-stone-700 text-stone-100' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Body */}
        {backendTab === 'analytics' && <AnalyticsTab />}
        {backendTab === 'hero' && <HeroSectionTab />}
        {backendTab === 'products' && <ProductsTab />}
        {backendTab === 'orders' && <OrdersTab />}
        {backendTab === 'inventory' && <InventoryTab />}
        {backendTab === 'reviews' && <ReviewsTab />}
        {backendTab === 'emails' && <EmailNotificationsTab />}

      </main>
    </div>
  );
};
