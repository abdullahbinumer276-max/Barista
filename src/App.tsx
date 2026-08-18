import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { RestaurantProvider } from './context/RestaurantContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ContactPage } from './pages/ContactPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AdminPage } from './pages/AdminPage';
import { Order } from './types';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCategoryForMenu, setSelectedCategoryForMenu] = useState<string | undefined>(
    undefined
  );
  const [activeOrderIdForTracking, setActiveOrderIdForTracking] = useState<string | undefined>(
    undefined
  );

  const handleNavigate = (tab: string, categoryId?: string) => {
    setCurrentTab(tab);
    if (categoryId) {
      setSelectedCategoryForMenu(categoryId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderPlaced = (order: Order) => {
    setActiveOrderIdForTracking(order.id);
    setCurrentTab('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2C1B12] flex flex-col justify-between selection:bg-[#C5A059] selection:text-[#2C1B12]">
      <div>
        <Navbar currentTab={currentTab} onNavigate={handleNavigate} />

        <main className="animate-fadeIn">
          {currentTab === 'home' && <HomePage onNavigate={handleNavigate} />}

          {currentTab === 'menu' && (
            <MenuPage initialCategoryId={selectedCategoryForMenu} />
          )}

          {currentTab === 'about' && (
            <AboutPage onNavigateToMenu={() => handleNavigate('menu')} />
          )}

          {currentTab === 'gallery' && <GalleryPage />}

          {currentTab === 'reviews' && <ReviewsPage />}

          {currentTab === 'contact' && <ContactPage />}

          {currentTab === 'checkout' && (
            <CheckoutPage
              onBackToMenu={() => handleNavigate('menu')}
              onOrderPlaced={handleOrderPlaced}
            />
          )}

          {currentTab === 'track' && (
            <TrackOrderPage
              initialOrderId={activeOrderIdForTracking}
              onNavigateToMenu={() => handleNavigate('menu')}
            />
          )}

          {currentTab === 'admin' && <AdminPage />}
        </main>
      </div>

      <CartDrawer onCheckout={() => handleNavigate('checkout')} />

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <RestaurantProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </RestaurantProvider>
    </AuthProvider>
  );
}

export default App;
