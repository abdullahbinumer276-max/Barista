import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Flame, Crown, Clock, Check, Sparkles } from 'lucide-react';
import { MenuItem, MenuVariant, MenuAddon } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCustomizerModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const ProductCustomizerModal: React.FC<ProductCustomizerModalProps> = ({
  item,
  onClose,
}) => {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<MenuVariant | undefined>(undefined);
  const [selectedAddons, setSelectedAddons] = useState<MenuAddon[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (item) {
      if (item.variants && item.variants.length > 0) {
        setSelectedVariant(item.variants[0]);
      } else {
        setSelectedVariant(undefined);
      }
      setSelectedAddons([]);
      setSpecialInstructions('');
      setQuantity(1);
    }
  }, [item]);

  if (!item) return null;

  const currentUnitPrice = selectedVariant ? selectedVariant.price : item.basePrice;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const itemTotal = (currentUnitPrice + addonsTotal) * quantity;

  const handleToggleAddon = (addon: MenuAddon) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const handleAddToCart = () => {
    addToCart(item, selectedVariant, selectedAddons, specialInstructions, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-stone-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-stone-950/70 hover:bg-stone-900 text-stone-300 hover:text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Hero Image */}
          <div className="relative h-56 sm:h-64 w-full bg-stone-950 overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-black/30" />

            {/* Badges */}
            <div className="absolute bottom-3 left-4 flex flex-wrap gap-2">
              <span className="bg-amber-600/90 backdrop-blur-md text-stone-950 font-bold text-xs px-2.5 py-1 rounded-md shadow uppercase tracking-wide">
                {item.categoryName}
              </span>
              {item.isFeatured && (
                <span className="bg-amber-500 text-stone-950 font-bold text-xs px-2.5 py-1 rounded-md shadow flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" />
                  Specialty
                </span>
              )}
              {item.isSpicy && (
                <span className="bg-red-600/90 text-white font-bold text-xs px-2 py-1 rounded-md shadow flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  Spicy
                </span>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Header Info */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl sm:text-2xl font-serif font-black text-white">
                  {item.name}
                </h3>
                <span className="text-xl font-black text-amber-400 shrink-0">
                  Rs. {currentUnitPrice.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-stone-300 mt-2 leading-relaxed">
                {item.description}
              </p>
              {item.prepTime && (
                <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-3">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Prep time: ~{item.prepTime}</span>
                </div>
              )}
            </div>

            {/* Variants / Sizes Selection */}
            {item.variants && item.variants.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-stone-800">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                    <span>Select Size / Option</span>
                    <span className="text-amber-500 text-xs">(Required)</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {item.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-amber-600/15 border-amber-500 text-white ring-1 ring-amber-500/50'
                            : 'bg-stone-800/60 border-stone-700/60 text-stone-300 hover:border-stone-600'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-amber-500 bg-amber-500' : 'border-stone-500'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-stone-950" />}
                          </div>
                          <span className="text-sm font-medium">{v.name}</span>
                        </div>
                        <span className="text-xs font-bold text-amber-400">
                          Rs. {v.price.toLocaleString()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add-ons Selection */}
            {item.addons && item.addons.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-stone-800">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-1.5">
                    <span>Add-ons & Upgrades</span>
                    <span className="text-stone-400 text-xs font-normal">(Optional)</span>
                  </label>
                </div>
                <div className="space-y-2">
                  {item.addons.map((addon) => {
                    const isChecked = selectedAddons.some((a) => a.id === addon.id);
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => handleToggleAddon(addon)}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isChecked
                            ? 'bg-stone-800 border-amber-500/80 text-white'
                            : 'bg-stone-800/40 border-stone-700/50 text-stone-300 hover:border-stone-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                              isChecked
                                ? 'bg-amber-500 border-amber-500 text-stone-950'
                                : 'border-stone-600 bg-stone-900'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-sm">{addon.name}</span>
                        </div>
                        <span className="text-xs font-bold text-amber-400">
                          +Rs. {addon.price.toLocaleString()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="space-y-2 pt-4 border-t border-stone-800">
              <label className="text-xs font-semibold text-stone-300 uppercase tracking-wide">
                Special Kitchen Notes (Optional)
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Less spicy, extra sauce on the side, well done crust..."
                rows={2}
                maxLength={180}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer / CTA */}
        <div className="p-4 sm:p-5 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-4">
          {/* Quantity Counter */}
          <div className="flex items-center bg-stone-800 border border-stone-700 rounded-xl p-1 shrink-0">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-9 h-9 flex items-center justify-center text-stone-300 hover:text-white disabled:opacity-30 rounded-lg transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-sm font-black text-white">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-9 h-9 flex items-center justify-center text-stone-300 hover:text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add To Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-3 px-5 rounded-xl shadow-lg shadow-amber-950/40 flex items-center justify-between text-sm active:scale-[0.98] transition-all"
          >
            <span>Add to Order</span>
            <span className="font-mono font-black text-amber-200">
              Rs. {itemTotal.toLocaleString()}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
