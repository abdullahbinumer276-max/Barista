import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Flame, Leaf, Check } from 'lucide-react';
import { MenuItem, MenuItemSize, MenuItemAddon } from '../types';
import { useCart } from '../context/CartContext';

interface MenuItemModalProps {
  item: MenuItem;
  onClose: () => void;
}

export const MenuItemModal: React.FC<MenuItemModalProps> = ({ item, onClose }) => {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<MenuItemSize | undefined>(
    item.sizes && item.sizes.length > 0 ? item.sizes[0] : undefined
  );
  const [selectedAddons, setSelectedAddons] = useState<MenuItemAddon[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');

  const toggleAddon = (addon: MenuItemAddon) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const basePrice = selectedSize ? selectedSize.price : item.price;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = basePrice + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem(item, selectedSize, selectedAddons, quantity, instructions.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2C1B12]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white border border-[#E5E1D8] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-0 text-[#2C1B12] animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image Showcase */}
        <div className="relative h-56 bg-[#2C1B12] overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-[#2C1B12]/80 hover:bg-[#2C1B12] text-white p-2 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="flex items-center gap-2 mb-1">
              {item.badge && (
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#C5A059] text-[#2C1B12] px-2.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {item.isSpicy && (
                <span className="text-[10px] font-bold bg-red-600/90 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Spicy
                </span>
              )}
              {item.isVegetarian && (
                <span className="text-[10px] font-bold bg-emerald-600/90 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Leaf className="w-3 h-3" /> Veg
                </span>
              )}
            </div>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-white leading-tight">
              {item.name}
            </h3>
          </div>
        </div>

        {/* Modal Content Form */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <p className="text-xs text-stone-600 leading-relaxed">{item.description}</p>

          {/* Size Selector */}
          {item.sizes && item.sizes.length > 0 && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#2C1B12] block">
                Select Size Option
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {item.sizes.map((size) => {
                  const isSelected = selectedSize?.name === size.name;
                  return (
                    <button
                      key={size.name}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#C5A059] bg-[#FAF9F6] ring-1 ring-[#C5A059]'
                          : 'border-[#E5E1D8] bg-white hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-[#2C1B12]">{size.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#C5A059]" />}
                      </div>
                      <span className="font-mono font-bold text-xs text-[#C5A059] mt-1">
                        Rs. {size.price.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons Selector */}
          {item.addons && item.addons.length > 0 && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#2C1B12] block">
                Customize & Add-ons (Optional)
              </label>
              <div className="space-y-2">
                {item.addons.map((addon) => {
                  const isSelected = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#C5A059] bg-[#FAF9F6] ring-1 ring-[#C5A059]'
                          : 'border-[#E5E1D8] bg-white hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#C5A059] border-[#C5A059] text-[#2C1B12]'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-3" />}
                        </div>
                        <span className="text-xs font-semibold text-[#2C1B12]">{addon.name}</span>
                      </div>
                      <span className="font-mono text-xs text-[#C5A059] font-bold">
                        +Rs. {addon.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Cooking Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#2C1B12] block">
              Special Instructions
            </label>
            <input
              type="text"
              placeholder="e.g. Less spicy, extra napkins, crispy fries"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl px-3.5 py-2.5 text-xs text-[#2C1B12] focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-5 sm:p-6 bg-[#FAF9F6] border-t border-[#E5E1D8] flex items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-[#E5E1D8] rounded-xl bg-white shadow-xs">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2.5 text-stone-600 hover:text-[#2C1B12] hover:bg-[#F1EDE4] rounded-l-xl transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 font-mono font-bold text-sm text-[#2C1B12]">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-2.5 text-stone-600 hover:text-[#2C1B12] hover:bg-[#F1EDE4] rounded-r-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3.5 bg-[#2C1B12] hover:bg-[#3D2B1F] text-white rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-between px-5 shadow-lg transition-transform active:scale-98"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#C5A059]" />
              <span>Add to Order</span>
            </span>
            <span className="font-mono text-sm text-[#C5A059] font-bold">
              Rs. {totalPrice.toLocaleString()}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
