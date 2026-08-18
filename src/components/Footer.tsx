import React from 'react';
import {
  Phone,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  ShieldCheck,
  Truck,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

interface FooterProps {
  onNavigate: (tab: string, categoryId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings, categories } = useRestaurant();

  return (
    <footer className="bg-[#2C1B12] text-[#F1EDE4] border-t border-[#4D3B2F]">
      {/* Upper Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-xs">
        {/* Column 1: Brand & Heritage */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FAF9F6] rounded-full flex items-center justify-center text-[#2C1B12] font-serif text-xl font-bold shadow">
              B
            </div>
            <div>
              <span className="text-xl font-serif font-black tracking-tight uppercase text-white block leading-none">
                Barista's
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block mt-1">
                Kharian Cantt • Punjab
              </span>
            </div>
          </div>

          <p className="text-stone-300 leading-relaxed">
            Kharian Cantt's premier gourmet destination. Renowned for stone-baked Mughlai pizzas,
            handcrafted artisan coffees, smashing burgers, and warm family hospitality in Sadar
            Bazar.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-[#3D2B1F] hover:bg-[#C5A059] hover:text-[#2C1B12] flex items-center justify-center transition-colors text-stone-300"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-[#3D2B1F] hover:bg-[#C5A059] hover:text-[#2C1B12] flex items-center justify-center transition-colors text-stone-300"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={`https://wa.me/${settings?.whatsapp ? settings.whatsapp.replace(/\D/g, '') : '923007611953'}`}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center transition-transform hover:scale-110 shadow"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links & Menu */}
        <div className="space-y-3">
          <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider border-b border-[#4D3B2F] pb-2">
            Menu Highlights
          </h4>
          <ul className="space-y-2 text-stone-300">
            {categories.slice(0, 5).map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => onNavigate('menu', cat.id)}
                  className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[#C5A059] text-xs">›</span>
                  <span>{cat.name}</span>
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => onNavigate('menu')}
                className="text-[#C5A059] font-bold hover:underline"
              >
                View Full Online Menu →
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact & Store Location */}
        <div className="space-y-3">
          <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider border-b border-[#4D3B2F] pb-2">
            Visit & Contact
          </h4>
          <div className="space-y-2.5 text-stone-300">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <span>
                {settings?.address || 'Sadar Bazar, Kharian Cantt, District Gujrat, Punjab'}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
              <div className="space-y-0.5">
                <div>Landline: {settings?.phone || '(053) 7611953'}</div>
                <div>Mobile: {settings?.mobile || '0300-7611953'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>{settings?.openingHours || '11:00 AM – 11:30 PM (Daily)'}</span>
            </div>
          </div>
        </div>

        {/* Column 4: Cantt Delivery & Online Ordering */}
        <div className="space-y-3">
          <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider border-b border-[#4D3B2F] pb-2">
            Cantt Delivery
          </h4>
          <div className="bg-[#3D2B1F] p-4 rounded-xl border border-[#4D3B2F] space-y-2">
            <div className="flex items-center gap-2 text-[#C5A059] font-bold">
              <Truck className="w-4 h-4" />
              <span>Express Cantt Service</span>
            </div>
            <p className="text-[11px] text-stone-300 leading-snug">
              Serving Army Garrison, Officers Colony, Sadar Bazar, GT Road, and surrounding sectors
              in 30-40 mins.
            </p>
            <div className="text-[11px] text-stone-300 pt-1">
              <span className="text-[#C5A059] font-semibold">Free Delivery</span> on all orders over
              Rs. {settings?.freeDeliveryAbove || 2000}.
            </div>
          </div>

          <button
            onClick={() => onNavigate('track')}
            className="w-full py-2 bg-[#FAF9F6] text-[#2C1B12] hover:bg-[#F1EDE4] rounded-lg font-bold text-xs text-center transition-colors"
          >
            Track Existing Order
          </button>
        </div>
      </div>

      {/* Bottom Micro Status Bar matching Design specification */}
      <div className="border-t border-[#4D3B2F] bg-[#24150D] py-4 px-6 sm:px-12 text-[10px] uppercase tracking-widest font-bold text-[#F1EDE4] flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 sm:gap-8 justify-center">
          <span className="flex items-center gap-1.5">
            CMS STATUS: <span className="text-emerald-400 font-black">● ONLINE</span>
          </span>
          <span className="hidden sm:inline text-stone-600">|</span>
          <span>
            LOCATION: <span className="text-[#C5A059]">SADAR BAZAR, KHARIAN CANTT</span>
          </span>
          <span className="hidden sm:inline text-stone-600">|</span>
          <span>
            TEL: <span className="text-[#C5A059]">{settings?.phone || '(053) 7611953'}</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-stone-400">
          <span>&copy; {new Date().getFullYear()} BARISTA'S RESTAURANT</span>
          <button
            onClick={() => onNavigate('admin')}
            className="hover:text-[#C5A059] transition-colors underline"
          >
            Staff Portal
          </button>
        </div>
      </div>
    </footer>
  );
};
