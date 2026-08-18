import React, { useState } from 'react';
import { Camera, Sparkles, Eye } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'food' | 'beverage' | 'ambiance';
  imageUrl: string;
  caption: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Signature Mughlai Pizza',
    category: 'food',
    imageUrl:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    caption: 'Freshly baked with spiced Mughlai chicken & extra mozzarella.',
  },
  {
    id: 'g-2',
    title: 'Artisan Spanish Latte',
    category: 'beverage',
    imageUrl:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    caption: 'Double Arabica espresso with sweet condensed milk foam.',
  },
  {
    id: 'g-3',
    title: 'Cantt Dining Lounge',
    category: 'ambiance',
    imageUrl:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    caption: 'Warm, hospitable atmosphere for families and private gatherings.',
  },
  {
    id: 'g-4',
    title: 'Thunder Crunch Burger',
    category: 'food',
    imageUrl:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    caption: 'Double crispy chicken fillet with melted cheddar & brioche bun.',
  },
  {
    id: 'g-5',
    title: 'Choco Bounty Supreme Shake',
    category: 'beverage',
    imageUrl:
      'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    caption: 'Blended with real Bounty coconut bars & chocolate fudge.',
  },
  {
    id: 'g-6',
    title: 'Kharian Cantt Grand Platter',
    category: 'food',
    imageUrl:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    caption: 'Sizzling grilled chicken steak, seasoned rice, and spicy wings.',
  },
  {
    id: 'g-7',
    title: 'Barista Espresso Extraction',
    category: 'beverage',
    imageUrl:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    caption: 'Golden crema flowing from our commercial Italian espresso machine.',
  },
  {
    id: 'g-8',
    title: 'Warm Molten Lava Cake',
    category: 'food',
    imageUrl:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    caption: 'Oozing Belgian chocolate ganache served with vanilla gelato.',
  },
];

export const GalleryPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'food' | 'beverage' | 'ambiance'>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filtered =
    activeFilter === 'all'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[#C5A059] font-serif italic text-sm font-bold uppercase tracking-widest">
          Visual Showcase
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#2C1B12]">
          The Barista’s Experience
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Glimpses of our artisan culinary craft, freshly brewed coffee, and cozy dining lounge in
          Sadar Bazar, Kharian Cantt.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-2">
        <div className="bg-white border border-[#E5E1D8] p-1.5 rounded-2xl shadow-xs flex items-center gap-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-[#2C1B12] text-white shadow-sm'
                : 'text-stone-600 hover:text-[#2C1B12]'
            }`}
          >
            All Photos
          </button>
          <button
            onClick={() => setActiveFilter('food')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'food'
                ? 'bg-[#2C1B12] text-white shadow-sm'
                : 'text-stone-600 hover:text-[#2C1B12]'
            }`}
          >
            Artisan Food
          </button>
          <button
            onClick={() => setActiveFilter('beverage')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'beverage'
                ? 'bg-[#2C1B12] text-white shadow-sm'
                : 'text-stone-600 hover:text-[#2C1B12]'
            }`}
          >
            Coffee & Shakes
          </button>
          <button
            onClick={() => setActiveFilter('ambiance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'ambiance'
                ? 'bg-[#2C1B12] text-white shadow-sm'
                : 'text-stone-600 hover:text-[#2C1B12]'
            }`}
          >
            Restaurant Ambiance
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item)}
            className="group relative bg-[#2C1B12] rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer border border-[#E5E1D8] aspect-4/5"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            <div className="absolute bottom-0 inset-x-0 p-5 text-white space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block">
                {item.category}
              </span>
              <h3 className="font-serif font-bold text-base text-white">{item.title}</h3>
              <p className="text-xs text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl border border-[#E5E1D8] animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-80 sm:h-96 bg-black">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm hover:bg-black"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
                {selectedImage.category}
              </span>
              <h3 className="font-serif font-bold text-xl text-[#2C1B12]">{selectedImage.title}</h3>
              <p className="text-xs text-stone-600">{selectedImage.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
