import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Phone,
  ChefHat,
  PackageCheck,
  MapPin,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api } from '../lib/api';

interface TrackOrderPageProps {
  initialOrderId?: string;
  onNavigateToMenu: () => void;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({
  initialOrderId,
  onNavigateToMenu,
}) => {
  const [query, setQuery] = useState(initialOrderId || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialOrderId) {
      handleSearch(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSearch = async (lookupQuery: string) => {
    const q = lookupQuery.trim();
    if (!q) return;

    setIsSearching(true);
    setErrorMessage(null);
    setSearched(true);

    try {
      // Look up by ID first
      let found: Order | null = null;
      try {
        found = await api.getOrderById(q);
      } catch {
        // Search by phone or partial
        const allOrders = await api.getOrders();
        found =
          allOrders.find(
            (o) =>
              o.id.toLowerCase() === q.toLowerCase() ||
              o.customer.phone.replace(/\D/g, '').includes(q.replace(/\D/g, ''))
          ) || null;
      }

      setOrder(found);
      if (!found) {
        setErrorMessage(
          `No active order found matching "${q}". Please check your order ID or phone number.`
        );
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error looking up order');
    } finally {
      setIsSearching(false);
    }
  };

  const statusSteps: { status: OrderStatus; label: string; icon: any; desc: string }[] = [
    {
      status: 'pending',
      label: 'Order Placed',
      icon: Clock,
      desc: 'Received by Sadar Bazar branch counter',
    },
    {
      status: 'confirmed',
      label: 'Kitchen Preparing',
      icon: ChefHat,
      desc: 'Baking in stone oven & grilling ingredients',
    },
    {
      status: 'preparing',
      label: 'Quality Checked',
      icon: CheckCircle2,
      desc: 'Packed hot and inspected for delivery',
    },
    {
      status: 'out_for_delivery',
      label: 'Rider on the Way',
      icon: Truck,
      desc: 'Express courier dispatched across Cantt',
    },
    {
      status: 'delivered',
      label: 'Delivered / Completed',
      icon: PackageCheck,
      desc: 'Handed over fresh & hot',
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'cancelled') return -1;
    switch (status) {
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'preparing':
        return 2;
      case 'out_for_delivery':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[#C5A059] font-serif italic text-sm font-bold uppercase tracking-widest">
          Live Status
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#2C1B12]">
          Track Your Barista’s Order
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Enter your Order ID (e.g., <span className="font-mono font-bold">BK-8942</span>) or your
          phone number to track kitchen preparation and dispatch in real-time.
        </p>
      </div>

      {/* Lookup Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(query);
        }}
        className="max-w-xl mx-auto flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Enter Order ID or Mobile Number"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3.5 bg-white border border-[#E5E1D8] rounded-2xl text-xs text-[#2C1B12] focus:outline-none focus:border-[#C5A059] shadow-xs font-mono font-semibold"
          />
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="px-6 py-3.5 bg-[#2C1B12] hover:bg-[#3D2B1F] text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center gap-2"
        >
          <span>{isSearching ? 'Tracking...' : 'Track'}</span>
        </button>
      </form>

      {errorMessage && (
        <div className="max-w-xl mx-auto p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 animate-fadeIn">
          {/* Order Header Badge */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E5E1D8] pb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-black text-xl sm:text-2xl text-[#2C1B12]">
                  {order.id}
                </span>
                <span className="px-3 py-1 bg-[#F1EDE4] text-[#2C1B12] rounded-full text-xs font-black uppercase tracking-wider font-mono">
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Placed on {new Date(order.createdAt).toLocaleString()} • {order.orderType.toUpperCase()}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] text-stone-400 uppercase tracking-wider font-bold block">
                Total Amount
              </span>
              <span className="font-mono font-black text-xl text-[#2C1B12]">
                Rs. {order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Timeline Visualizer */}
          {order.status === 'cancelled' ? (
            <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center text-red-700 space-y-2">
              <h3 className="font-serif font-bold text-lg">Order Cancelled</h3>
              <p className="text-xs">
                This order was cancelled. Please contact branch reception at (053) 7611953 for
                inquiries.
              </p>
            </div>
          ) : (
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                {statusSteps.map((step, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.status}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                        isCurrent
                          ? 'border-[#C5A059] bg-[#FAF9F6] ring-2 ring-[#C5A059]/30'
                          : isDone
                          ? 'border-[#E5E1D8] bg-[#F1EDE4]/50'
                          : 'border-[#E5E1D8]/60 bg-white opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isDone ? 'bg-[#2C1B12] text-[#C5A059]' : 'bg-stone-200 text-stone-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </div>

                      <div>
                        <h4 className="font-bold text-xs text-[#2C1B12] leading-tight">
                          {step.label}
                        </h4>
                        <p className="text-[10px] text-stone-500 mt-1 leading-snug">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customer & Items Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#E5E1D8] text-xs">
            {/* Delivery Details */}
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-sm text-[#2C1B12]">
                Delivery Information
              </h4>
              <p className="text-stone-700">
                <span className="font-semibold text-[#2C1B12]">Recipient:</span>{' '}
                {order.customer.fullName}
              </p>
              <p className="text-stone-700">
                <span className="font-semibold text-[#2C1B12]">Contact:</span>{' '}
                <span className="font-mono">{order.customer.phone}</span>
              </p>
              <p className="text-stone-700">
                <span className="font-semibold text-[#2C1B12]">Address:</span>{' '}
                {order.customer.address} ({order.customer.area})
              </p>
              {order.customer.nearbyLandmark && (
                <p className="text-stone-500 italic">
                  Landmark: {order.customer.nearbyLandmark}
                </p>
              )}
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-sm text-[#2C1B12]">Items Ordered</h4>
              <div className="space-y-1.5">
                {order.items.map((it) => (
                  <div key={it.id} className="flex justify-between">
                    <span>
                      {it.quantity}x {it.menuItem.name}{' '}
                      {it.selectedSize && `(${it.selectedSize.name})`}
                    </span>
                    <span className="font-mono font-bold text-[#2C1B12]">
                      Rs. {it.totalPrice.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Help & Support Footer */}
          <div className="bg-[#FAF9F6] border border-[#E5E1D8] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-stone-600">
              <Phone className="w-4 h-4 text-[#C5A059]" />
              <span>Need help with this order? Call Sadar Bazar branch at (053) 7611953</span>
            </div>
            <a
              href={`https://wa.me/923007611953?text=Inquiry%20regarding%20order%20${order.id}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-[#25D366] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 hover:bg-[#20bd5a] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Store</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
