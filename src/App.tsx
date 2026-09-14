import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { SearchModal } from './components/search/SearchModal';
import { ToastContainer } from './components/ui/Toast';
import { Phase1Hero } from './components/home/Phase1Hero';
import { ProductCatalog } from './components/catalog/ProductCatalog';
import { ProductDetailView } from './components/product/ProductDetailView';
import { CheckoutView } from './components/checkout/CheckoutView';
import { OrderTrackingView } from './components/orders/OrderTrackingView';
import { AdminPortal } from './components/admin/AdminPortal';

const StoreContent: React.FC = () => {
  const { currentView } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d13] text-[#edf2f7]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        {currentView === 'home' && <Phase1Hero />}
        {currentView === 'catalog' && <ProductCatalog />}
        {currentView === 'product-details' && <ProductDetailView />}
        {currentView === 'cart' && <ProductCatalog />}
        {currentView === 'checkout' && <CheckoutView />}
        {currentView === 'order-tracking' && <OrderTrackingView />}
        {currentView === 'admin' && <AdminPortal />}
      </main>

      <Footer />
      <CartDrawer />
      <SearchModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
