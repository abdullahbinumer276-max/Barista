import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  ArrowRight,
  ShoppingBag,
  Truck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useRestaurant } from '../context/RestaurantContext';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    subtotal,
    discountAmount,
    deliveryFee,
    grandTotal,
    itemCount,
  } = useCart();

  const { settings } = useRestaurant();
  const [couponCodeInput, setCouponCodeInput] = useState('');

  if (!isOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const success = applyCoupon(couponCodeInput);
    if (success) {
      setCouponCodeInput('');
    }
  };

  const freeDeliveryThreshold = settings?.freeDeliveryAbove || 2000;
  const progressToFreeDelivery = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));
  const amountNeededForFree = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#2C1B12]/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F6] border-l border-[#E5E1D8] shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 bg-white border-b border-[#E5E1D8] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#2C1B12] rounded-full flex items-center justify-center text-[#C5A059] font-serif text-lg font-bold">
                B
              </div>
              <div>
                <h3 className="font-serif font-black text-lg text-[#2C1B12] uppercase tracking-tight">
                  Your Order Cart
                </h3>
                <p className="text-[11px] text-stone-500 font-medium">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 text-stone-400 hover:text-[#2C1B12] hover:bg-[#F1EDE4] rounded-lg transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          {subtotal > 0 && (
            <div className="bg-[#F1EDE4] border-b border-[#E5E1D8] px-5 py-2.5 text-xs text-[#2C1B12]">
              <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#C5A059]" />
                  {amountNeededForFree === 0
                    ? '🎉 You unlocked Free Cantt Delivery!'
                    : `Add Rs. ${amountNeededForFree.toLocaleString()} for Free Delivery`}
                </span>
                <span className="font-mono text-[#C5A059] font-bold">
                  {progressToFreeDelivery}%
                </span>
              </div>
              <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#C5A059] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressToFreeDelivery}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-stone-400">
                <div className="w-16 h-16 bg-[#F1EDE4] text-[#2C1B12] rounded-2xl flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-[#C5A059]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#2C1B12]">
                    Your cart is empty
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Explore our artisan pizzas, sizzling platters, burgers, and handcrafted coffee.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 bg-[#2C1B12] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#3D2B1F] transition-colors"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              items.map((cartItem) => (
                <div
                  key={cartItem.id}
                  className="bg-white border border-[#E5E1D8] p-4 rounded-xl shadow-xs space-y-3"
                >
                  <div className="flex gap-3 items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-serif font-bold text-sm text-[#2C1B12]">
                        {cartItem.menuItem.name}
                      </h4>
                      {cartItem.selectedSize && (
                        <span className="inline-block text-[11px] font-semibold text-[#C5A059] bg-[#F1EDE4] px-2 py-0.5 rounded mt-0.5">
                          Size: {cartItem.selectedSize.name}
                        </span>
                      )}

                      {cartItem.selectedAddons && cartItem.selectedAddons.length > 0 && (
                        <div className="text-[11px] text-stone-500 mt-1">
                          + {cartItem.selectedAddons.map((a) => a.name).join(', ')}
                        </div>
                      )}

                      {cartItem.specialInstructions && (
                        <div className="text-[10px] text-stone-400 italic mt-0.5">
                          Note: "{cartItem.specialInstructions}"
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => removeItem(cartItem.id)}
                      className="text-stone-300 hover:text-red-600 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E5E1D8]">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-[#E5E1D8] rounded-lg bg-[#FAF9F6]">
                      <button
                        onClick={() => updateQuantity(cartItem.id, -1)}
                        className="p-1.5 text-stone-600 hover:text-[#2C1B12] hover:bg-[#F1EDE4] rounded-l transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-mono font-bold text-xs text-[#2C1B12]">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(cartItem.id, 1)}
                        className="p-1.5 text-stone-600 hover:text-[#2C1B12] hover:bg-[#F1EDE4] rounded-r transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="font-mono font-bold text-sm text-[#2C1B12]">
                      Rs. {cartItem.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="bg-white border-t border-[#E5E1D8] p-5 sm:p-6 space-y-4">
              {/* Promo Code Input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-[#F1EDE4] border border-[#C5A059]/40 p-2.5 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#C5A059]" />
                      <div>
                        <span className="font-mono font-black text-[#2C1B12]">
                          {appliedCoupon.code}
                        </span>
                        <span className="text-stone-500 ml-1.5">
                          (-Rs. {discountAmount.toLocaleString()})
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-stone-400 hover:text-red-600 text-xs font-bold px-2 py-0.5"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo Code (e.g. KHARIAN15)"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                        className="flex-1 uppercase font-mono text-xs px-3 py-2 bg-[#FAF9F6] border border-[#E5E1D8] rounded-lg text-[#2C1B12] focus:outline-none focus:border-[#C5A059]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#2C1B12] text-white rounded-lg text-xs font-bold hover:bg-[#3D2B1F] transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-red-600 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        <span>{couponError}</span>
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* Order Calculations */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-[#E5E1D8]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#2C1B12] font-semibold">
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Promotional Discount</span>
                    <span className="font-mono">-Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Cantt Delivery Fee</span>
                  <span className="font-mono text-[#2C1B12]">
                    {deliveryFee === 0 ? (
                      <span className="text-[#C5A059] font-bold uppercase text-[11px]">FREE</span>
                    ) : (
                      `Rs. ${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm font-serif font-black text-[#2C1B12] pt-2 border-t border-[#E5E1D8]">
                  <span>Grand Total</span>
                  <span className="text-base font-mono text-[#2C1B12]">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    closeCart();
                    onCheckout();
                  }}
                  className="flex-1 py-3.5 bg-[#2C1B12] hover:bg-[#3D2B1F] text-white rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-transform active:scale-98"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
