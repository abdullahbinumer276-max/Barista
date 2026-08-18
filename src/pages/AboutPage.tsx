import React from 'react';
import { Coffee, Award, ShieldCheck, Heart, Users, MapPin, CheckCircle } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

interface AboutPageProps {
  onNavigateToMenu: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateToMenu }) => {
  const { homepage, settings } = useRestaurant();

  const values = [
    {
      icon: <Coffee className="w-6 h-6 text-[#C5A059]" />,
      title: 'Artisan Roast Mastery',
      description:
        'We source prime Arabica beans, ground fresh per shot to create rich crema and silky espresso velvet.',
    },
    {
      icon: <Award className="w-6 h-6 text-[#C5A059]" />,
      title: 'Authentic Stone Ovens',
      description:
        'Our handcrafted pizzas are baked at 400°C over stone decks for a blistered crisp crust with molten cheese.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#C5A059]" />,
      title: '100% Halal & Clean',
      description:
        'Uncompromising hygiene, farm-fresh poultry, and strict quality protocols across all kitchen stations.',
    },
    {
      icon: <Users className="w-6 h-6 text-[#C5A059]" />,
      title: 'Cantt Family Atmosphere',
      description:
        'A hospitable, serene dining haven designed for family get-togethers, friends, and official officer dinners.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[#C5A059] font-serif italic text-sm font-bold uppercase tracking-widest">
          Kharian Cantt Heritage
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#2C1B12] leading-tight">
          A Tradition of Culinary Excellence & Passion
        </h1>
        <p className="text-xs sm:text-base text-stone-600 leading-relaxed">
          Located in the heart of Sadar Bazar, Barista’s Restaurant has redefined dining and coffee
          culture across the Kharian Garrison and Punjab region.
        </p>
      </div>

      {/* Split Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="border-l-2 border-[#C5A059] pl-5 space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-stone-400">
              Our Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C1B12]">
              {homepage?.storyTitle || 'From a Humble Espresso Bar to Cantt’s Favorite Dining'}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            {homepage?.storyParagraph1 ||
              'Established with a passion for world-class dining in Kharian Cantt, Barista’s Restaurant blends timeless culinary recipes with contemporary artisan innovations.'}
          </p>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            {homepage?.storyParagraph2 ||
              'Whether you are dropping by for a morning Spanish Latte, savoring a sizzling grand steak platter with family, or ordering our signature Mughlai Pizzas to your home in the Officers Colony, our kitchen is dedicated to exceeding your expectations.'}
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={onNavigateToMenu}
              className="px-6 py-3 bg-[#2C1B12] hover:bg-[#3D2B1F] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              Explore Our Menu
            </button>
            <div className="flex items-center gap-2 text-xs text-stone-600 font-semibold px-4 py-3 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl">
              <MapPin className="w-4 h-4 text-[#C5A059]" />
              <span>Sadar Bazar, Kharian Cantt</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80"
            alt="Barista's Lounge"
            className="w-full h-64 object-cover rounded-3xl border border-[#E5E1D8] shadow-md"
          />
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
            alt="Stone oven pizza"
            className="w-full h-64 object-cover rounded-3xl border border-[#E5E1D8] shadow-md mt-6"
          />
        </div>
      </div>

      {/* Values Grid */}
      <div className="space-y-8 pt-8 border-t border-[#E5E1D8]">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[#C5A059] font-serif italic text-xs font-bold uppercase tracking-widest">
            Our Standard
          </span>
          <h3 className="text-2xl font-serif font-black text-[#2C1B12]">
            The Four Pillars of Barista’s
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E5E1D8] p-6 rounded-3xl shadow-xs space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-[#E5E1D8] flex items-center justify-center">
                {v.icon}
              </div>
              <h4 className="font-serif font-bold text-base text-[#2C1B12]">{v.title}</h4>
              <p className="text-xs text-stone-600 leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
