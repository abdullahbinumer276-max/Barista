import React, { useState } from 'react';
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  Phone,
  Shield,
  Clock,
  Compass,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useRestaurant } from '../context/RestaurantContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, categoryId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { toggleCart, itemCount, grandTotal } = useCart();
  const { settings, homepage } = useRestaurant();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'menu', label: 'MENU' },
    { id: 'about', label: 'OUR STORY' },
    { id: 'gallery', label: 'GALLERY' },
    { id: 'reviews', label: 'REVIEWS' },
    { id: 'contact', label: 'CONTACT' },
    { id: 'track', label: 'TRACK ORDER' },
  ];

  const handleNavClick = (tabId: string) => {
    onNavigate(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6] border-b border-[#E5E1D8] transition-all">
      {/* Top micro announcement bar */}
      {homepage?.isAnnouncementActive && (
        <div className="bg-[#2C1B12] text-[#F1EDE4] text-[11px] font-medium py-1.5 px-4 text-center tracking-wider flex items-center justify-center gap-4">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Open Today: {settings?.openingHours || '11:00 AM – 11:30 PM'}</span>
          </span>
          <span className="hidden sm:inline text-stone-500">•</span>
          <span className="hidden sm:inline font-semibold text-[#C5A059]">
            {homepage.announcementText || '⚡ Fast Cantt & Garrison Delivery Available'}
          </span>
          <span className="hidden md:inline text-stone-500">•</span>
          <a
            href={`tel:${settings?.phone || '053-7611953'}`}
            className="hidden md:flex items-center gap-1 text-[#F1EDE4] hover:text-[#C5A059] transition-colors"
          >
            <Phone className="w-3 h-3 text-[#C5A059]" />
            <span>{settings?.phone || '(053) 7611953'}</span>
          </a>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Location */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left focus:outline-none group"
        >
          <div className="w-11 h-11 bg-[#2C1B12] rounded-full flex items-center justify-center text-[#C5A059] font-serif text-2xl font-bold shadow-md transition-transform group-hover:scale-105">
            B
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-serif font-black tracking-tight uppercase text-[#2C1B12] block leading-none">
              Barista's
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mt-1">
              Kharian Cantt • Punjab
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 font-medium text-xs tracking-wider">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition-all py-1 font-semibold ${
                  isActive
                    ? 'text-[#C5A059] border-b-2 border-[#C5A059] font-bold'
                    : 'text-[#2C1B12] hover:text-[#C5A059]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons: Admin Portal + Cart + Order Now */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => handleNavClick('admin')}
            className={`text-xs font-bold px-3.5 py-2 rounded-lg border transition-colors flex items-center gap-1.5 ${
              currentTab === 'admin'
                ? 'bg-[#2C1B12] text-[#F1EDE4] border-[#2C1B12]'
                : 'bg-[#F1EDE4] text-[#2C1B12] border-[#E5E1D8] hover:bg-[#E5E1D8]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{isAuthenticated ? 'STAFF POS' : 'STAFF LOGIN'}</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={toggleCart}
            className="relative bg-white hover:bg-[#F1EDE4] text-[#2C1B12] border border-[#E5E1D8] px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
            <span className="hidden md:inline font-mono">
              {itemCount > 0 ? `Rs. ${grandTotal.toLocaleString()}` : 'Cart'}
            </span>
            {itemCount > 0 && (
              <span className="bg-[#C5A059] text-[#2C1B12] font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                {itemCount}
              </span>
            )}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => handleNavClick('menu')}
            className="text-xs font-bold tracking-wider uppercase px-5 py-2.5 bg-[#2C1B12] hover:bg-[#3D2B1F] text-white rounded-lg shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            <span>ORDER NOW</span>
          </button>
        </div>

        {/* Mobile Menu & Cart Trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleCart}
            className="relative p-2.5 bg-[#F1EDE4] text-[#2C1B12] rounded-lg"
          >
            <ShoppingBag className="w-5 h-5 text-[#2C1B12]" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C5A059] text-[#2C1B12] font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 bg-[#2C1B12] text-white rounded-lg"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E5E1D8] px-6 py-5 space-y-4 shadow-xl animate-fadeIn">
          <nav className="flex flex-col space-y-3 font-semibold text-sm">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left py-2 px-3 rounded-lg transition-colors ${
                  currentTab === link.id
                    ? 'bg-[#F1EDE4] text-[#C5A059] font-bold'
                    : 'text-[#2C1B12] hover:bg-[#FAF9F6]'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 border-t border-[#E5E1D8] flex flex-col gap-2">
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full py-2.5 text-xs font-bold bg-[#F1EDE4] text-[#2C1B12] rounded-lg text-center flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 text-[#C5A059]" />
                <span>{isAuthenticated ? 'Staff & Kitchen POS' : 'Staff Admin Login'}</span>
              </button>
              <button
                onClick={() => handleNavClick('menu')}
                className="w-full py-3 text-xs font-bold uppercase tracking-wider bg-[#2C1B12] text-white rounded-lg text-center"
              >
                Explore Full Menu & Order
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
