import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Clock,
  MapPin,
  Truck,
  ShieldCheck,
  Star,
  Flame,
  Coffee,
  CheckCircle2,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { useCart } from '../context/CartContext';
import { MenuItemModal } from '../components/MenuItemModal';
import { MenuItem } from '../types';

interface HomePageProps {
  onNavigate: (tab: string, categoryId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { homepage, settings, categories, menuItems, reviews } = useRestaurant();
  const { addItem } = useCart();
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);

  const popularItems = menuItems.filter((i) => i.isPopular && i.isAvailable).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section (Design Mockup Faithful Implementation) */}
      <section className="bg-white border-b border-[#E5E1D8] overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-16 sm:py-20 relative space-y-6">
            <div className="text-[#C5A059] font-serif italic text-lg sm:text-xl font-medium tracking-wide">
              {homepage?.heroSubtitle || 'Kharian Cantt, Punjab'}
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light text-[#2C1B12] leading-[1.1] tracking-tight">
              Where every cup <br />
              <span className="font-bold italic text-[#2C1B12]">tells a story.</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
              {homepage?.heroDescription ||
                "Experience the premium taste of Punjab's finest coffee house and restaurant. From our signature Mughlai Pizzas to artisan brews and sizzling platters, every bite is crafted for excellence."}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <button
                onClick={() => onNavigate('menu')}
                className="px-8 py-4 bg-[#2C1B12] hover:bg-[#3D2B1F] text-white font-bold rounded-full flex items-center gap-3 transition-all shadow-xl shadow-stone-900/10 active:scale-95 group text-sm tracking-wider uppercase"
              >
                <span>EXPLORE MENU</span>
                <ArrowRight className="w-4 h-4 text-[#C5A059] group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex flex-col border-l border-[#E5E1D8] pl-5">
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                  Open Today
                </span>
                <span className="text-sm font-bold text-[#2C1B12]">
                  {settings?.openingHours || '11:00 AM – 11:30 PM'}
                </span>
              </div>
            </div>

            {/* Micro perks */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E5E1D8]/80 text-xs text-[#2C1B12]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#C5A059]" />
                <span className="font-semibold">Stone-Oven Pizzas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#C5A059]" />
                <span className="font-semibold">Artisan Arabica</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#C5A059]" />
                <span className="font-semibold">Cantt Fast Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Rich Espresso Showcase Card */}
          <div className="lg:col-span-5 bg-[#2C1B12] relative overflow-hidden flex flex-col items-center justify-center p-6 sm:p-12 text-white">
            {/* Subtle textured background */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative w-full max-w-md bg-[#3D2B1F] rounded-3xl p-6 sm:p-8 border border-[#4D3B2F] shadow-2xl space-y-6">
              <div className="flex justify-between items-center border-b border-[#4D3B2F] pb-4">
                <div>
                  <h3 className="text-white font-serif text-xl font-bold">Popular Today</h3>
                  <p className="text-[11px] text-stone-400">Kharian Cantt favorites</p>
                </div>
                <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-wider border border-[#C5A059]/40 bg-[#C5A059]/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> CMS LIVE
                </span>
              </div>

              {/* Sample Popular Dishes inside card */}
              <div className="space-y-3.5">
                {popularItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemForModal(item)}
                    className="flex items-center gap-3.5 bg-[#2C1B12] p-3 rounded-2xl border border-[#4D3B2F] hover:border-[#C5A059] transition-all cursor-pointer group"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#4D3B2F]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-xs truncate group-hover:text-[#C5A059] transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[#C5A059] text-xs font-mono font-bold mt-0.5">
                        {item.sizes && item.sizes.length > 0
                          ? `Rs. ${item.sizes[0].price} – ${item.sizes[item.sizes.length - 1].price}`
                          : `Rs. ${item.price}`}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#3D2B1F] text-[#C5A059] flex items-center justify-center group-hover:bg-[#C5A059] group-hover:text-[#2C1B12] transition-colors shrink-0 shadow">
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Live social proof footer */}
              <div className="pt-4 border-t border-[#4D3B2F] flex justify-between items-center">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-amber-700 border-2 border-[#2C1B12] flex items-center justify-center text-[10px] font-bold text-white">
                    M
                  </div>
                  <div className="w-7 h-7 rounded-full bg-stone-700 border-2 border-[#2C1B12] flex items-center justify-center text-[10px] font-bold text-white">
                    A
                  </div>
                  <div className="w-7 h-7 rounded-full bg-stone-800 border-2 border-[#2C1B12] flex items-center justify-center text-[10px] font-bold text-white">
                    U
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#C5A059] border-2 border-[#2C1B12] flex items-center justify-center text-[9px] font-black text-[#2C1B12]">
                    +18
                  </div>
                </div>
                <span className="text-[11px] text-stone-300 font-medium">
                  Active orders cooking in Cantt
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[#C5A059] font-serif italic text-sm font-bold uppercase tracking-widest">
              Gourmet Selection
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#2C1B12] mt-1">
              Explore Our Categories
            </h2>
          </div>

          <button
            onClick={() => onNavigate('menu')}
            className="self-start sm:self-auto text-xs font-bold text-[#C5A059] hover:text-[#2C1B12] transition-colors flex items-center gap-1 group"
          >
            <span>View Full Menu</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onNavigate('menu', category.id)}
              className="bg-white border border-[#E5E1D8] hover:border-[#C5A059] p-6 rounded-2xl text-left transition-all hover:shadow-xl hover:-translate-y-1 group flex flex-col justify-between space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#E5E1D8] group-hover:bg-[#F1EDE4] flex items-center justify-center text-2xl transition-colors">
                {category.icon || '🍽️'}
              </div>

              <div>
                <h3 className="font-serif font-bold text-base text-[#2C1B12] group-hover:text-[#C5A059] transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-[#C5A059]">
                <span>Browse Category</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Specialties Menu Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-[#C5A059] font-serif italic text-sm font-bold uppercase tracking-widest">
            Chef’s Recommendations
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#2C1B12]">
            Signature House Specialties
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Prepared fresh to order using authentic spices, certified Halal poultry, and Italian stone
            ovens in Sadar Bazar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E5E1D8] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div className="relative h-52 overflow-hidden bg-[#2C1B12]">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {item.badge && (
                  <span className="absolute top-4 left-4 bg-[#C5A059] text-[#2C1B12] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow">
                    {item.badge}
                  </span>
                )}

                <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end text-white">
                  <span className="font-mono font-bold text-sm bg-[#2C1B12]/80 px-2.5 py-1 rounded-lg border border-[#4D3B2F] text-[#C5A059]">
                    {item.sizes && item.sizes.length > 0
                      ? `From Rs. ${item.sizes[0].price}`
                      : `Rs. ${item.price}`}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-lg text-[#2C1B12] group-hover:text-[#C5A059] transition-colors leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5E1D8] flex items-center justify-between">
                  <span className="text-[11px] text-stone-500 font-medium">
                    ⚡ {item.prepTimeMinutes || 20} mins prep
                  </span>

                  <button
                    onClick={() => setSelectedItemForModal(item)}
                    className="px-4 py-2 bg-[#2C1B12] hover:bg-[#3D2B1F] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Order</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story & Heritage Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2C1B12] text-white rounded-3xl overflow-hidden border border-[#4D3B2F] shadow-2xl grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-6 p-8 sm:p-14 lg:p-16 flex flex-col justify-center space-y-6">
            <span className="text-[#C5A059] font-serif italic text-sm font-bold uppercase tracking-widest">
              Kharian Cantt Heritage
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
              {homepage?.storyTitle || 'Crafted with Passion in Sadar Bazar'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {homepage?.storyParagraph1 ||
                'Established as a haven for food enthusiasts and coffee connoisseurs in Kharian Cantt, Barista’s Restaurant blends timeless culinary traditions with modern artisan recipes.'}
            </p>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {homepage?.storyParagraph2 ||
                'Whether you are craving a stone-baked Mughlai crust, a double-stacked gourmet Angus burger, or a velvety Spanish Latte after duty, our kitchen guarantees fresh ingredients, hygiene, and hospitable warmth.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-3 bg-[#FAF9F6] text-[#2C1B12] hover:bg-[#F1EDE4] rounded-full text-xs font-bold tracking-wider uppercase transition-colors"
              >
                Read Our Story
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#2C1B12] rounded-full text-xs font-bold tracking-wider uppercase transition-colors"
              >
                Reserve a Table
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative min-h-[320px] lg:min-h-full">
            <img
              src={
                homepage?.storyImageUrl ||
                'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80'
              }
              alt="Barista's Atmosphere"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2C1B12] via-transparent to-transparent lg:block hidden" />
          </div>
        </div>
      </section>

      {/* Customer Testimonials & Reviews Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[#C5A059] font-serif italic text-sm font-bold uppercase tracking-widest">
              Cantt Community Love
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#2C1B12] mt-1">
              What Our Guests Say
            </h2>
          </div>

          <button
            onClick={() => onNavigate('reviews')}
            className="self-start sm:self-auto text-xs font-bold text-[#C5A059] hover:text-[#2C1B12] transition-colors flex items-center gap-1 group"
          >
            <span>Read All Verified Reviews</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="bg-white border border-[#E5E1D8] p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5E1D8] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-full ${review.avatarBg || 'bg-[#2C1B12]'} text-[#C5A059] flex items-center justify-center font-bold text-xs`}
                  >
                    {review.authorName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#2C1B12]">{review.authorName}</h4>
                    <span className="text-[10px] text-stone-400">{review.date}</span>
                  </div>
                </div>
                <span className="text-[10px] bg-[#F1EDE4] text-[#C5A059] font-bold px-2 py-0.5 rounded">
                  Verified Guest
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Item Customization Modal */}
      {selectedItemForModal && (
        <MenuItemModal
          item={selectedItemForModal}
          onClose={() => setSelectedItemForModal(null)}
        />
      )}
    </div>
  );
};
