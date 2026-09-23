/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/storefront/Navbar';
import { Hero } from './components/storefront/Hero';
import { ProductGrid } from './components/storefront/ProductGrid';
import { AtelierStory } from './components/storefront/AtelierStory';
import { OrderTrackingView } from './components/storefront/OrderTrackingView';
import { Footer } from './components/storefront/Footer';
import { ProductModal } from './components/storefront/ProductModal';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CheckoutModal } from './components/storefront/CheckoutModal';
import { SearchModal } from './components/storefront/SearchModal';
import { ToastContainer } from './components/common/Toast';
import { BackendDashboard } from './components/backend/BackendDashboard';

const MainApp: React.FC = () => {
  const { currentView } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-900 selection:bg-stone-900 selection:text-white font-sans">
      {/* Toast Notification Layer */}
      <ToastContainer />

      {/* Global Interactive Overlays */}
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <SearchModal />

      {/* Route Switcher */}
      {currentView === 'backend' ? (
        <BackendDashboard />
      ) : (
        <>
          <Navbar />
          <main className="flex-1">
            {currentView === 'tracking' ? (
              <OrderTrackingView />
            ) : (
              <>
                <Hero />
                <ProductGrid />
                <AtelierStory />
              </>
            )}
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
