import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Printer,
  ChevronDown,
  AlertCircle,
  Phone,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { api } from '../../lib/api';

export const AdminOrdersTab: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000); // Polling for live orders
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdatingStatus(orderId);
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const statuses: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Preparing',
    'Ready',
    'Out for Delivery',
    'Completed',
    'Cancelled',
  ];

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'All' && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchPhone) return false;
    }
    return true;
  });

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-950/80 border-amber-700 text-amber-300';
      case 'Confirmed':
        return 'bg-blue-950/80 border-blue-700 text-blue-300';
      case 'Preparing':
        return 'bg-orange-950/80 border-orange-700 text-orange-300';
      case 'Ready':
        return 'bg-purple-950/80 border-purple-700 text-purple-300';
      case 'Out for Delivery':
        return 'bg-cyan-950/80 border-cyan-700 text-cyan-300';
      case 'Completed':
        return 'bg-emerald-950/80 border-emerald-700 text-emerald-300';
      case 'Cancelled':
        return 'bg-red-950/80 border-red-700 text-red-300';
      default:
        return 'bg-stone-800 border-stone-700 text-stone-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  Order Management
                </span>
                <h3 className="text-2xl font-mono font-bold text-white">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-200 p-2.5 rounded-xl border border-stone-700 transition-colors"
                  title="Print KOT / Invoice"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Quick Status Bar inside Modal */}
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
              <label className="text-xs font-bold text-stone-300 uppercase tracking-wide">
                Update Order Status
              </label>
              <div className="flex flex-wrap gap-2">
                {statuses.map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedOrder.id, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedOrder.status === st
                        ? 'bg-amber-600 border-amber-500 text-stone-950 shadow-md font-black'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-stone-950 p-4 rounded-2xl border border-stone-800">
              <div>
                <span className="text-stone-500 block">Customer Name</span>
                <span className="text-sm font-bold text-white">{selectedOrder.customerName}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Contact Phone</span>
                <span className="text-sm font-bold text-amber-400 font-mono">
                  {selectedOrder.customerPhone}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">Order Mode</span>
                <span className="capitalize font-semibold text-white">{selectedOrder.orderType}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Payment Method</span>
                <span className="font-semibold text-white">{selectedOrder.paymentMethod}</span>
              </div>
              {selectedOrder.deliveryAddress && (
                <div className="col-span-2 pt-2 border-t border-stone-800">
                  <span className="text-stone-500 block">Delivery Address (Kharian Cantt)</span>
                  <span className="text-stone-200 font-medium">{selectedOrder.deliveryAddress}</span>
                </div>
              )}
              {selectedOrder.notes && (
                <div className="col-span-2 pt-2 border-t border-stone-800">
                  <span className="text-stone-500 block">Kitchen & Delivery Notes</span>
                  <span className="text-amber-300 italic">"{selectedOrder.notes}"</span>
                </div>
              )}
            </div>

            {/* Ordered Items Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wide">
                Items Checklist
              </h4>
              <div className="bg-stone-950 rounded-2xl border border-stone-800 p-4 divide-y divide-stone-800/80 space-y-2 text-xs">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex justify-between gap-3">
                    <div>
                      <span className="font-bold text-white">
                        {item.quantity}x {item.name}
                      </span>
                      {item.selectedVariant && (
                        <span className="block text-amber-400 text-[11px]">
                          Option: {item.selectedVariant.name}
                        </span>
                      )}
                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <span className="block text-stone-400 text-[10px]">
                          + {item.selectedAddons.map((a) => a.name).join(', ')}
                        </span>
                      )}
                      {item.specialInstructions && (
                        <span className="block text-stone-400 italic text-[10px]">
                          Note: "{item.specialInstructions}"
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-stone-200 font-bold">
                      Rs. {item.itemTotal.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-1.5 text-xs text-stone-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">Rs. {selectedOrder.subtotal.toLocaleString()}</span>
              </div>
              {selectedOrder.deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-mono">Rs. {selectedOrder.deliveryFee}</span>
                </div>
              )}
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({selectedOrder.couponCode})</span>
                  <span className="font-mono">- Rs. {selectedOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-stone-800">
                <span>Grand Total</span>
                <span className="text-lg text-amber-400 font-mono font-black">
                  Rs. {selectedOrder.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-stone-950 border border-stone-800 p-4 rounded-2xl shadow-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order #, Customer Name, or Phone..."
            className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-3.5 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="p-2.5 bg-stone-900 hover:bg-stone-800 text-stone-300 rounded-xl border border-stone-800 transition-colors"
            title="Refresh Live Orders"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {['All', ...statuses].map((st) => {
          const count =
            st === 'All' ? orders.length : orders.filter((o) => o.status === st).length;
          const isActive = statusFilter === st;

          return (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-600 text-stone-950 font-black shadow-md'
                  : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="bg-stone-950 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-800 bg-stone-900/50 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Type</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Time</th>
                <th className="p-4">Status & Action</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-stone-500">
                    No orders matching the current filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-900/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">
                      <span>{ord.orderNumber}</span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-stone-200">{ord.customerName}</div>
                      <div className="text-[11px] text-stone-400 font-mono">{ord.customerPhone}</div>
                    </td>
                    <td className="p-4">
                      <span className="capitalize px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300 text-[11px]">
                        {ord.orderType}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-amber-300">
                      Rs. {ord.total.toLocaleString()}
                    </td>
                    <td className="p-4 text-stone-400 text-[11px]">
                      {new Date(ord.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-4">
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          handleStatusChange(ord.id, e.target.value as OrderStatus)
                        }
                        disabled={isUpdatingStatus === ord.id}
                        className={`text-xs font-bold py-1 px-2 rounded-lg border focus:outline-none transition-all ${getStatusBadgeClass(
                          ord.status
                        )}`}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s} className="bg-stone-900 text-white">
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white rounded-xl transition-colors inline-flex items-center gap-1 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
