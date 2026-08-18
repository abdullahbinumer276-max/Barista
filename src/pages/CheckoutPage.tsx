import React, { useState } from 'react';
import {
  ArrowLeft,
  Truck,
  ShoppingBag,
  CreditCard,
  Banknote,
  Smartphone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Tag,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useRestaurant } from '../context/RestaurantContext';
import { api } from '../lib/api';
import { Order } from '../types';

interface CheckoutPageProps {
  onBackToMenu: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBackToMenu, onOrderPlaced }) => {
  const {
    items,
    subtotal,
    discountAmount,
    deliveryFee,
    grandTotal,
    appliedCoupon,
    clearCart,
  } = useCart();
  const { settings } = useRestaurant();

  // Form State
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState(settings?.deliveryAreas[0] || 'Kharian Cantt - Sadar Bazar');
  const [nearbyLandmark, setNearbyLandmark] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<
    'cash_on_delivery' | 'jazzcash' | 'easypaisa' | 'card_pos'
  >('cash_on_delivery');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-[#F1EDE4] rounded-2xl flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8 text-[#C5A059]" />
        </div>
        <h2 className="font-serif font-bold text-2xl text-[#2C1B12]">Your Cart is Empty</h2>
        <p className="text-xs text-stone-500">
          Please add items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={onBackToMenu}
          className="px-6 py-3 bg-[#2C1B12] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#3D2B1F]"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  const effectiveDeliveryFee = orderType === 'pickup' ? 0 : deliveryFee;
  const effectiveTotal = Math.max(0, subtotal - discountAmount + effectiveDeliveryFee);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim() || !phone.trim()) {
      setFormError('Please enter your full name and contact phone number.');
      return;
    }

    if (orderType === 'delivery' && !address.trim()) {
      setFormError('Please provide your complete delivery address in Kharian.');
      return;
    }

    if (subtotal < (settings?.minimumOrderAmount || 400)) {
      setFormError(
        `Minimum order requirement is Rs. ${settings?.minimumOrderAmount || 400}. Please add more items.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await api.placeOrder({
        customer: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          address: orderType === 'delivery' ? address.trim() : 'Self Pickup at Sadar Bazar Counter',
          area,
          nearbyLandmark: nearbyLandmark.trim() || undefined,
          orderNotes: orderNotes.trim() || undefined,
        },
        items,
        subtotal,
        discountAmount,
        appliedCoupon: appliedCoupon || undefined,
        deliveryFee: effectiveDeliveryFee,
        totalAmount: effectiveTotal,
        paymentMethod,
        orderType,
      });

      clearCart();
      onOrderPlaced(order);
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Top Header with Back action */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBackToMenu}
          className="p-2.5 bg-white border border-[#E5E1D8] text-stone-600 hover:text-[#2C1B12] rounded-xl transition-colors flex items-center gap-2 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>
        <div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#2C1B12]">
            Complete Your Order
          </h1>
          <p className="text-xs text-stone-500">Kharian Cantt Kitchen & Express Delivery</p>
        </div>
      </div>

      {formError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Steps */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Order Mode */}
          <div className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#2C1B12] border-b border-[#E5E1D8] pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#2C1B12] text-[#C5A059] text-xs flex items-center justify-center font-mono font-bold">
                1
              </span>
              <span>Order Type</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  orderType === 'delivery'
                    ? 'border-[#C5A059] bg-[#FAF9F6] ring-1 ring-[#C5A059]'
                    : 'border-[#E5E1D8] bg-white hover:bg-[#FAF9F6]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#2C1B12]">Cantt Express Delivery</span>
                  <Truck className="w-4 h-4 text-[#C5A059]" />
                </div>
                <span className="text-[11px] text-stone-500 mt-1">
                  Delivered to your home/barracks in 30-40m
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  orderType === 'pickup'
                    ? 'border-[#C5A059] bg-[#FAF9F6] ring-1 ring-[#C5A059]'
                    : 'border-[#E5E1D8] bg-white hover:bg-[#FAF9F6]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#2C1B12]">Takeaway / Pickup</span>
                  <Clock className="w-4 h-4 text-[#C5A059]" />
                </div>
                <span className="text-[11px] text-stone-500 mt-1">
                  Ready for pickup at Sadar Bazar in 15-20m
                </span>
              </button>
            </div>
          </div>

          {/* Step 2: Customer & Address Information */}
          <div className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#2C1B12] border-b border-[#E5E1D8] pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#2C1B12] text-[#C5A059] text-xs flex items-center justify-center font-mono font-bold">
                2
              </span>
              <span>Customer & Delivery Details</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#2C1B12]">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Major Usman / Abdullah"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-[#2C1B12] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#2C1B12]">Mobile Number (for Courier) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0300-1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-[#2C1B12] font-mono focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {orderType === 'delivery' && (
                <>
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#2C1B12]">Cantt Area / Sector *</label>
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-[#2C1B12] focus:outline-none focus:border-[#C5A059]"
                    >
                      {(
                        settings?.deliveryAreas || [
                          'Kharian Cantt - Sadar Bazar',
                          'Kharian Cantt - Army Garrison & Officers Colony',
                          'Kharian City - GT Road',
                          'Civil Lines & Model Town',
                        ]
                      ).map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-[#2C1B12]">House / Street Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. House #24, Lane 3, Officers Colony"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-[#2C1B12] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-[#2C1B12]">
                      Nearby Famous Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Near Station Mess, Cantt Gate 2, CMH Chowk"
                      value={nearbyLandmark}
                      onChange={(e) => setNearbyLandmark(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-[#2C1B12] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="font-bold text-[#2C1B12]">Special Kitchen/Delivery Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Extra garlic sauce, call on arrival"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-[#2C1B12] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#2C1B12] border-b border-[#E5E1D8] pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#2C1B12] text-[#C5A059] text-xs flex items-center justify-center font-mono font-bold">
                3
              </span>
              <span>Payment Option</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash_on_delivery')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-[#C5A059] bg-[#FAF9F6] ring-1 ring-[#C5A059]'
                    : 'border-[#E5E1D8] bg-white hover:bg-[#FAF9F6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Banknote className="w-5 h-5 text-[#C5A059]" />
                  <div>
                    <div className="font-bold text-[#2C1B12]">Cash on Delivery</div>
                    <div className="text-[10px] text-stone-500">Pay cash upon receipt</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('jazzcash')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  paymentMethod === 'jazzcash'
                    ? 'border-[#C5A059] bg-[#FAF9F6] ring-1 ring-[#C5A059]'
                    : 'border-[#E5E1D8] bg-white hover:bg-[#FAF9F6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-bold text-[#2C1B12]">JazzCash</div>
                    <div className="text-[10px] text-stone-500">Instant mobile wallet</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('easypaisa')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  paymentMethod === 'easypaisa'
                    ? 'border-[#C5A059] bg-[#FAF9F6] ring-1 ring-[#C5A059]'
                    : 'border-[#E5E1D8] bg-white hover:bg-[#FAF9F6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="font-bold text-[#2C1B12]">EasyPaisa</div>
                    <div className="text-[10px] text-stone-500">Direct wallet transfer</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card_pos')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  paymentMethod === 'card_pos'
                    ? 'border-[#C5A059] bg-[#FAF9F6] ring-1 ring-[#C5A059]'
                    : 'border-[#E5E1D8] bg-white hover:bg-[#FAF9F6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-[#2C1B12]" />
                  <div>
                    <div className="font-bold text-[#2C1B12]">Card on POS Device</div>
                    <div className="text-[10px] text-stone-500">Rider brings POS terminal</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 sticky top-24">
            <h3 className="font-serif font-bold text-xl text-[#2C1B12] border-b border-[#E5E1D8] pb-3">
              Order Summary
            </h3>

            {/* Selected Items summary */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 text-xs">
              {items.map((ci) => (
                <div key={ci.id} className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-[#2C1B12]">
                      {ci.quantity}x {ci.menuItem.name}
                    </span>
                    {ci.selectedSize && (
                      <div className="text-[10px] text-[#C5A059]">({ci.selectedSize.name})</div>
                    )}
                    {ci.selectedAddons && ci.selectedAddons.length > 0 && (
                      <div className="text-[10px] text-stone-400">
                        +{ci.selectedAddons.map((a) => a.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <span className="font-mono font-bold text-[#2C1B12]">
                    Rs. {ci.totalPrice.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-stone-600 pt-4 border-t border-[#E5E1D8]">
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
                  {effectiveDeliveryFee === 0 ? (
                    <span className="text-[#C5A059] font-bold text-[11px]">FREE</span>
                  ) : (
                    `Rs. ${effectiveDeliveryFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center text-base font-serif font-black text-[#2C1B12] pt-3 border-t border-[#E5E1D8]">
                <span>Total Due</span>
                <span className="text-xl font-mono text-[#2C1B12]">
                  Rs. {effectiveTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#2C1B12] hover:bg-[#3D2B1F] text-white rounded-2xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />
              <span>{isSubmitting ? 'Submitting Order...' : 'Confirm & Place Order'}</span>
            </button>

            <div className="text-[11px] text-stone-400 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>Direct Kitchen Notification in Kharian Cantt</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
