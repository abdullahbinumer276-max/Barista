import React, { useState, useEffect } from 'react';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  FileText,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Printer,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { api } from '../lib/api';
import { Order, OrderStatus } from '../types';
import { useRestaurant } from '../context/RestaurantContext';

interface OrderTrackingPageProps {
  initialOrderNumber?: string;
  onNavigateToMenu: () => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderNumber,
  onNavigateToMenu,
}) => {
  const { settings } = useRestaurant();
  const [searchInput, setSearchInput] = useState(initialOrderNumber || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getOrderByIdOrNumber(query.trim());
      setOrder(data);
    } catch (err: any) {
      setOrder(null);
      setError('No order found matching this order number or phone number.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      fetchOrder(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchInput);
  };

  const statusSteps: { status: OrderStatus; label: string; description: string }[] = [
    { status: 'Pending', label: 'Order Received', description: 'Your order was received by the kitchen' },
    { status: 'Confirmed', label: 'Order Confirmed', description: 'Branch manager approved your order' },
    { status: 'Preparing', label: 'Cooking in Kitchen', description: 'Freshly baking in oven & sizzling on grill' },
    { status: 'Ready', label: 'Packed & Ready', description: 'Inspected and packed in hot thermal bag' },
    { status: 'Out for Delivery', label: 'Out for Delivery', description: 'Rider is on the way to your location' },
    { status: 'Completed', label: 'Delivered', description: 'Enjoy your meal from Barista’s!' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Confirmed':
        return 1;
      case 'Preparing':
        return 2;
      case 'Ready':
        return 3;
      case 'Out for Delivery':
        return 4;
      case 'Completed':
        return 5;
      case 'Cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;

  return (
    <div className="bg-stone-900 text-stone-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-600/15 border border-amber-500/30 px-3.5 py-1 rounded-full text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Truck className="w-3.5 h-3.5" />
            <span>Live Kitchen & Delivery Tracking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-white">
            Track Your Order
          </h1>
          <p className="text-stone-300 text-sm max-w-md mx-auto">
            Enter your order reference (e.g. BAR-2026-1082) to check real-time kitchen preparation
            and dispatch status.
          </p>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="bg-stone-950 border border-stone-800 p-2.5 rounded-2xl shadow-xl flex gap-2 max-w-xl mx-auto"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
              placeholder="Enter Order # (e.g. BAR-2026-1082)"
              className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-3 py-2.5 text-sm uppercase text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !searchInput.trim()}
            className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-bold px-6 py-2.5 rounded-xl transition-colors text-sm shrink-0"
          >
            {isLoading ? 'Checking...' : 'Track'}
          </button>
        </form>

        {error && (
          <div className="bg-red-950/60 border border-red-800 rounded-2xl p-4 text-red-300 text-sm text-center flex items-center justify-center gap-2 max-w-xl mx-auto">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Order Details Card */}
        {order && (
          <div className="bg-stone-950 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden animate-fadeIn space-y-6 p-6 sm:p-8">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wide">
                  Order Number
                </span>
                <h2 className="text-2xl sm:text-3xl font-mono font-black text-white">
                  {order.orderNumber}
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${
                    order.status === 'Completed'
                      ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                      : order.status === 'Cancelled'
                      ? 'bg-red-950 border border-red-700 text-red-300'
                      : 'bg-amber-950 border border-amber-700 text-amber-300 animate-pulse'
                  }`}
                >
                  Status: {order.status}
                </span>

                <button
                  onClick={() => window.print()}
                  className="p-2.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-xl text-stone-300 hover:text-white transition-colors"
                  title="Print Order Receipt"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cancelled State Alert */}
            {order.status === 'Cancelled' ? (
              <div className="p-4 bg-red-950/40 border border-red-800/80 rounded-2xl text-red-300 text-sm">
                This order was cancelled. If you believe this is an error, please contact Barista's
                hotline directly at {settings?.phone || '(053) 7611953'}.
              </div>
            ) : (
              /* Pipeline Visual Steps */
              <div className="py-4">
                <h3 className="text-sm font-bold text-stone-300 uppercase tracking-wide mb-6">
                  Live Preparation Status
                </h3>

                <div className="relative">
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {statusSteps.map((step, idx) => {
                      const isPast = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div
                          key={step.status}
                          className={`p-3.5 rounded-2xl border transition-all ${
                            isCurrent
                              ? 'bg-amber-600/20 border-amber-500 ring-1 ring-amber-500/50 shadow-lg'
                              : isPast
                              ? 'bg-stone-900 border-emerald-900/60 text-stone-300'
                              : 'bg-stone-900/40 border-stone-800/80 text-stone-600 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                isPast
                                  ? 'bg-emerald-600 text-stone-950'
                                  : 'bg-stone-800 text-stone-400'
                              }`}
                            >
                              {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                            </div>
                            {isCurrent && (
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-white">{step.label}</h4>
                          <p className="text-[10px] text-stone-400 mt-1 leading-snug">
                            {step.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Order Details & Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-800">
              {/* Left: Customer & Delivery Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Customer & Delivery
                </h3>
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2.5 text-xs text-stone-300">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Customer:</span>
                    <span className="font-bold text-white">{order.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Phone:</span>
                    <span className="font-mono text-amber-300 font-bold">{order.customerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Order Type:</span>
                    <span className="capitalize font-bold text-white">{order.orderType}</span>
                  </div>
                  {order.deliveryAddress && (
                    <div className="flex justify-between items-start gap-2 pt-1 border-t border-stone-800">
                      <span className="text-stone-400">Address:</span>
                      <span className="text-right text-stone-200">{order.deliveryAddress}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 border-t border-stone-800">
                    <span className="text-stone-400">Payment:</span>
                    <span className="font-bold text-white">{order.paymentMethod}</span>
                  </div>
                </div>

                {/* WhatsApp & Call Direct Contact */}
                <div className="flex items-center gap-2.5 pt-1">
                  <a
                    href={`tel:${settings?.phone || '(053) 7611953'}`}
                    className="flex-1 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Call Restaurant</span>
                  </a>
                  {settings?.socialLinks?.whatsapp && (
                    <a
                      href={`${settings.socialLinks.whatsapp}?text=${encodeURIComponent(
                        `Hi Barista's! I am inquiring about my order ${order.orderNumber}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp Branch</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Right: Ordered Items Breakdown */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  Items Ordered
                </h3>
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-3">
                  <div className="space-y-2 divide-y divide-stone-800 max-h-56 overflow-y-auto pr-1 text-xs">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="pt-2 first:pt-0 flex justify-between gap-3">
                        <div>
                          <p className="font-bold text-white">
                            {item.quantity}x {item.name}
                          </p>
                          {item.selectedVariant && (
                            <span className="text-[11px] text-amber-400">
                              {item.selectedVariant.name}
                            </span>
                          )}
                          {item.selectedAddons && item.selectedAddons.length > 0 && (
                            <p className="text-[10px] text-stone-400">
                              + {item.selectedAddons.map((a) => a.name).join(', ')}
                            </p>
                          )}
                        </div>
                        <span className="font-mono text-stone-200 font-bold">
                          Rs. {item.itemTotal.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Financial calculation */}
                  <div className="pt-3 border-t border-stone-800 space-y-1.5 text-xs text-stone-300">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono">Rs. {order.subtotal.toLocaleString()}</span>
                    </div>
                    {order.deliveryFee > 0 && (
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span className="font-mono">Rs. {order.deliveryFee}</span>
                      </div>
                    )}
                    {order.discount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Discount ({order.couponCode})</span>
                        <span className="font-mono">- Rs. {order.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-stone-800">
                      <span>Grand Total</span>
                      <span className="text-base text-amber-400 font-mono">
                        Rs. {order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
