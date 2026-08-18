import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Flame,
  Leaf,
  Plus,
  Sparkles,
  ShoppingBag,
  Clock,
  SlidersHorizontal,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { useCart } from '../context/CartContext';
import { MenuItemModal } from '../components/MenuItemModal';
import { MenuItem } from '../types';

interface MenuPageProps {
  initialCategoryId?: string;
}

export const MenuPage: React.FC<MenuPageProps> = ({ initialCategoryId }) => {
  const { categories, menuItems } = useRestaurant();
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpicy, setFilterSpicy] = useState(false);
  const [filterVeg, setFilterVeg] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (initialCategoryId) {
      setSelectedCategory(initialCategoryId);
    }
  }, [initialCategoryId]);

  const filteredItems = menuItems.filter((item) => {
    if (!item.isAvailable) return false;
    if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) return false;
    if (filterSpicy && !item.isSpicy) return false;
    if (filterVeg && !item.isVegetarian) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if ((item.sizes && item.sizes.length > 0) || (item.addons && item.addons.length > 0)) {
      setSelectedItemForModal(item);
    } else {
      addItem(item, undefined, [], 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[#C5A059] font-serif italic text-sm font-bold uppercase tracking-widest">
          Kharian Cantt Dining
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#2C1B12]">
          Our Artisan Menu
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Explore stone-baked pizzas, gourmet smash burgers, sizzling platters, handcrafted espressos,
          and decadent desserts.
        </p>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="bg-white border border-[#E5E1D8] p-4 sm:p-5 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Field */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pizzas, burgers, shakes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl text-xs text-[#2C1B12] focus:outline-none focus:border-[#C5A059]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#2C1B12] text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Dietary Filters */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setFilterSpicy(!filterSpicy)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                filterSpicy
                  ? 'bg-red-50 text-red-700 border-red-300'
                  : 'bg-[#FAF9F6] text-stone-600 border-[#E5E1D8] hover:bg-[#F1EDE4]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Spicy Flavors</span>
            </button>

            <button
              onClick={() => setFilterVeg(!filterVeg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                filterVeg
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-[#FAF9F6] text-stone-600 border-[#E5E1D8] hover:bg-[#F1EDE4]'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>Vegetarian</span>
            </button>
          </div>
        </div>

        {/* Categories Pills Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-t border-[#E5E1D8] pt-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#2C1B12] text-white shadow-md'
                : 'bg-[#FAF9F6] text-stone-600 hover:bg-[#F1EDE4]'
            }`}
          >
            All Items ({menuItems.length})
          </button>

          {categories.map((cat) => {
            const count = menuItems.filter((i) => i.categoryId === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#2C1B12] text-white shadow-md'
                    : 'bg-[#FAF9F6] text-stone-600 hover:bg-[#F1EDE4]'
                }`}
              >
                <span>{cat.icon || '🍽️'}</span>
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-[#E5E1D8] rounded-3xl p-16 text-center space-y-3">
          <div className="w-16 h-16 bg-[#FAF9F6] rounded-2xl flex items-center justify-center mx-auto text-2xl">
            🔍
          </div>
          <h3 className="font-serif font-bold text-lg text-[#2C1B12]">No dishes matched</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search keywords or dietary filters to view delicious dishes.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setFilterSpicy(false);
              setFilterVeg(false);
            }}
            className="px-5 py-2 bg-[#2C1B12] text-white rounded-lg text-xs font-bold hover:bg-[#3D2B1F]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItemForModal(item)}
              className="bg-white border border-[#E5E1D8] rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group cursor-pointer"
            >
              {/* Card Image */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-[#2C1B12]">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {item.badge && (
                  <span className="absolute top-3 left-3 bg-[#C5A059] text-[#2C1B12] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow">
                    {item.badge}
                  </span>
                )}

                <div className="absolute top-3 right-3 flex items-center gap-1">
                  {item.isSpicy && (
                    <span className="bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                      <Flame className="w-3 h-3" /> Spicy
                    </span>
                  )}
                  {item.isVegetarian && (
                    <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                      <Leaf className="w-3 h-3" /> Veg
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end text-white">
                  <span className="font-mono font-bold text-sm bg-[#2C1B12]/80 px-2.5 py-1 rounded-lg border border-[#4D3B2F] text-[#C5A059]">
                    {item.sizes && item.sizes.length > 0
                      ? `From Rs. ${item.sizes[0].price.toLocaleString()}`
                      : `Rs. ${item.price.toLocaleString()}`}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-[#2C1B12] group-hover:text-[#C5A059] transition-colors leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Card Action footer */}
                <div className="pt-3 border-t border-[#E5E1D8] flex items-center justify-between">
                  <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{item.prepTimeMinutes || 15} mins</span>
                  </span>

                  <button
                    onClick={(e) => handleQuickAdd(item, e)}
                    className="px-4 py-2 bg-[#2C1B12] hover:bg-[#3D2B1F] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs group-hover:bg-[#C5A059] group-hover:text-[#2C1B12]"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-3" />
                    <span>
                      {item.sizes && item.sizes.length > 0 ? 'Customize' : 'Add to Cart'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {selectedItemForModal && (
        <MenuItemModal
          item={selectedItemForModal}
          onClose={() => setSelectedItemForModal(null)}
        />
      )}
    </div>
  );
};
