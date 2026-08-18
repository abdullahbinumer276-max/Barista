import React, { useState, useEffect } from 'react';
import {
  Shield,
  LayoutDashboard,
  Utensils,
  FolderTree,
  FileText,
  Tag,
  Settings,
  MessageSquare,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  ChefHat,
  Search,
  Eye,
  Lock,
  Sparkles,
  Phone,
  RefreshCw,
  Save,
  Check,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRestaurant } from '../context/RestaurantContext';
import { api } from '../lib/api';
import {
  Order,
  OrderStatus,
  MenuItem,
  MenuCategory,
  Coupon,
  ContactMessage,
  HomepageCMS,
  RestaurantSettings,
} from '../types';

export const AdminPage: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const {
    categories,
    menuItems,
    homepage,
    settings,
    coupons,
    refreshAll,
  } = useRestaurant();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@baristas.pk');
  const [loginPass, setLoginPass] = useState('baristas123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin Active Tab
  const [activeAdminTab, setActiveAdminTab] = useState<
    'orders' | 'menu' | 'categories' | 'cms' | 'coupons' | 'messages' | 'settings'
  >('orders');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Menu item modal / form
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isCreatingNewItem, setIsCreatingNewItem] = useState(false);
  const [itemFormState, setItemFormState] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 500,
    categoryId: 'cat-pizzas',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    isPopular: false,
    isSpicy: false,
    isVegetarian: false,
    prepTimeMinutes: 15,
    sizes: [],
    addons: [],
  });

  // CMS Form state
  const [cmsState, setCmsState] = useState<HomepageCMS | null>(homepage);
  const [cmsSavedSuccess, setCmsSavedSuccess] = useState(false);

  // Store Settings Form state
  const [settingsState, setSettingsState] = useState<RestaurantSettings | null>(settings);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  // Coupon form state
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);
  const [couponForm, setCouponForm] = useState<Partial<Coupon>>({
    code: '',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 1000,
    maxDiscountAmount: 300,
    isActive: true,
    description: '',
    validUntil: '2026-12-31',
  });

  // Contact Messages State
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    if (homepage) setCmsState(homepage);
  }, [homepage]);

  useEffect(() => {
    if (settings) setSettingsState(settings);
  }, [settings]);

  const loadOrdersAndMessages = async () => {
    setIsLoadingOrders(true);
    try {
      const [ordList, msgList] = await Promise.all([api.getOrders(), api.getContactMessages()]);
      setOrders(ordList);
      setMessages(msgList);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadOrdersAndMessages();
    }
  }, [isAuthenticated]);

  // Auth handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      await login(loginEmail, loginPass);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrderForDetails?.id === orderId) {
        setSelectedOrderForDetails(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Menu item save
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateMenuItem(editingItem.id, itemFormState);
      } else {
        await api.createMenuItem({
          ...itemFormState,
          name: itemFormState.name || 'New Item',
          description: itemFormState.description || '',
          price: Number(itemFormState.price) || 0,
          categoryId: itemFormState.categoryId || 'cat-pizzas',
          imageUrl:
            itemFormState.imageUrl ||
            'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
          isAvailable: itemFormState.isAvailable ?? true,
          isPopular: itemFormState.isPopular ?? false,
          isSpicy: itemFormState.isSpicy ?? false,
          isVegetarian: itemFormState.isVegetarian ?? false,
          prepTimeMinutes: Number(itemFormState.prepTimeMinutes) || 15,
        });
      }
      await refreshAll();
      setEditingItem(null);
      setIsCreatingNewItem(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      try {
        await api.deleteMenuItem(id);
        await refreshAll();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await api.updateMenuItem(item.id, { isAvailable: !item.isAvailable });
      await refreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  // CMS Save
  const handleSaveCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmsState) return;
    try {
      await api.updateHomepage(cmsState);
      await refreshAll();
      setCmsSavedSuccess(true);
      setTimeout(() => setCmsSavedSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsState) return;
    try {
      await api.updateSettings(settingsState);
      await refreshAll();
      setSettingsSavedSuccess(true);
      setTimeout(() => setSettingsSavedSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  // Create Coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code) return;
    try {
      await api.createCoupon({
        code: couponForm.code.toUpperCase(),
        discountType: couponForm.discountType || 'percentage',
        discountValue: Number(couponForm.discountValue) || 10,
        minOrderAmount: Number(couponForm.minOrderAmount) || 500,
        maxDiscountAmount: couponForm.maxDiscountAmount
          ? Number(couponForm.maxDiscountAmount)
          : undefined,
        isActive: couponForm.isActive ?? true,
        description: couponForm.description || '',
        validUntil: couponForm.validUntil || '2026-12-31',
      });
      await refreshAll();
      setIsCreatingCoupon(false);
      setCouponForm({
        code: '',
        discountType: 'percentage',
        discountValue: 15,
        minOrderAmount: 1000,
        isActive: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (confirm('Delete this coupon code?')) {
      try {
        await api.deleteCoupon(id);
        await refreshAll();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // If Not Authenticated -> Show Professional Login Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24 animate-fadeIn">
        <div className="bg-white border border-[#E5E1D8] rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#2C1B12] rounded-2xl flex items-center justify-center text-[#C5A059] font-serif text-2xl font-bold mx-auto shadow-md">
              B
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] block">
              Kharian Cantt Store
            </span>
            <h1 className="font-serif font-black text-2xl text-[#2C1B12]">
              Staff & Kitchen Portal
            </h1>
            <p className="text-xs text-stone-500">
              Access real-time POS kitchen orders, menu management, and store CMS.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-[#2C1B12]">Staff Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-[#2C1B12] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#2C1B12]">Password</label>
              <input
                type="password"
                required
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-[#2C1B12] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-[#2C1B12] hover:bg-[#3D2B1F] text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-md transition-colors"
            >
              {isLoggingIn ? 'Verifying...' : 'Sign In to Management'}
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="pt-4 border-t border-[#E5E1D8] text-[11px] text-stone-500 bg-[#FAF9F6] p-3.5 rounded-2xl space-y-1 font-mono">
            <div className="font-bold text-[#2C1B12] font-sans">Demo Credentials:</div>
            <div>
              Email: <span className="text-[#C5A059] font-bold">admin@baristas.pk</span>
            </div>
            <div>
              Password: <span className="text-[#C5A059] font-bold">baristas123</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Orders
  const filteredOrders =
    orderFilter === 'all'
      ? orders
      : orders.filter((o) => o.status === orderFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header Bar */}
      <div className="bg-white border border-[#E5E1D8] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#2C1B12] text-[#C5A059] rounded-2xl flex items-center justify-center font-serif text-xl font-bold">
            B
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-black text-xl text-[#2C1B12]">
                Barista’s Admin & CMS Console
              </h1>
              <span className="bg-[#F1EDE4] text-[#C5A059] font-bold text-[10px] px-2 py-0.5 rounded-full uppercase">
                {user?.role.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Branch: Sadar Bazar, Kharian Cantt • Logged in as{' '}
              <span className="font-semibold text-[#2C1B12]">{user?.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              refreshAll();
              loadOrdersAndMessages();
            }}
            className="p-2.5 bg-[#FAF9F6] hover:bg-[#F1EDE4] border border-[#E5E1D8] text-stone-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Refresh Live Data"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={logout}
            className="p-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E5E1D8]">
        {[
          { id: 'orders', label: 'Live Orders & POS', icon: LayoutDashboard, badge: orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length },
          { id: 'menu', label: 'Menu Catalog', icon: Utensils, badge: menuItems.length },
          { id: 'cms', label: 'Homepage CMS', icon: FileText },
          { id: 'coupons', label: 'Promo Codes', icon: Tag, badge: coupons.length },
          { id: 'messages', label: 'Inquiries & Tables', icon: MessageSquare, badge: messages.length },
          { id: 'settings', label: 'Store & Delivery', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#2C1B12] text-white shadow-md'
                  : 'bg-white border border-[#E5E1D8] text-stone-700 hover:bg-[#FAF9F6]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A059]' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-[#C5A059] text-[#2C1B12]' : 'bg-[#F1EDE4] text-[#2C1B12]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: LIVE ORDERS & POS */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-6">
          {/* Order Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'pending', label: 'New / Pending' },
                { id: 'confirmed', label: 'Kitchen Preparing' },
                { id: 'out_for_delivery', label: 'Out for Delivery' },
                { id: 'delivered', label: 'Completed' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setOrderFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    orderFilter === f.id
                      ? 'bg-[#2C1B12] text-white border-[#2C1B12]'
                      : 'bg-white text-stone-600 border-[#E5E1D8] hover:bg-[#FAF9F6]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-stone-500 font-medium">
              Showing {filteredOrders.length} orders
            </span>
          </div>

          {/* Orders Grid */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white border border-[#E5E1D8] rounded-3xl p-16 text-center space-y-2">
              <Clock className="w-8 h-8 text-stone-400 mx-auto" />
              <h3 className="font-serif font-bold text-base text-[#2C1B12]">
                No orders in this status
              </h3>
              <p className="text-xs text-stone-500">
                New customer orders placed online will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-[#E5E1D8] rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono font-black text-base text-[#2C1B12]">
                          {order.id}
                        </span>
                        <div className="text-[11px] text-stone-400 font-mono">
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full font-mono ${
                          order.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : order.status === 'confirmed' || order.status === 'preparing'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'out_for_delivery'
                            ? 'bg-purple-100 text-purple-800'
                            : order.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Customer details */}
                    <div className="pt-3 border-t border-[#E5E1D8] space-y-1 text-xs">
                      <div className="font-bold text-[#2C1B12]">{order.customer.fullName}</div>
                      <div className="text-stone-600 font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#C5A059]" />
                        <span>{order.customer.phone}</span>
                      </div>
                      <div className="text-stone-500 text-[11px] line-clamp-1">
                        {order.customer.address} ({order.customer.area})
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="pt-3 border-t border-[#E5E1D8] space-y-1 text-xs text-stone-700">
                      {order.items.map((it) => (
                        <div key={it.id} className="flex justify-between text-[11px]">
                          <span>
                            {it.quantity}x {it.menuItem.name}{' '}
                            {it.selectedSize && `(${it.selectedSize.name})`}
                          </span>
                          <span className="font-mono font-bold">
                            Rs. {it.totalPrice.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer Actions & Status Stepper */}
                  <div className="pt-3 border-t border-[#E5E1D8] space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-stone-500">Total Bill:</span>
                      <span className="font-mono font-black text-sm text-[#2C1B12]">
                        Rs. {order.totalAmount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="flex-1 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-2 text-xs font-bold text-[#2C1B12] focus:outline-none focus:border-[#C5A059]"
                      >
                        <option value="pending">Mark as Pending</option>
                        <option value="confirmed">Kitchen Preparing</option>
                        <option value="preparing">Quality Checked</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered / Done</option>
                        <option value="cancelled">Cancel Order</option>
                      </select>

                      <button
                        onClick={() => setSelectedOrderForDetails(order)}
                        className="p-2 bg-[#FAF9F6] hover:bg-[#F1EDE4] border border-[#E5E1D8] text-stone-700 rounded-xl"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal for Full Order Receipt Inspection */}
          {selectedOrderForDetails && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#E5E1D8] animate-fadeIn">
                <div className="flex justify-between items-center border-b border-[#E5E1D8] pb-4">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-[#2C1B12]">
                      Order Receipt #{selectedOrderForDetails.id}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Placed on {new Date(selectedOrderForDetails.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrderForDetails(null)}
                    className="p-2 text-stone-400 hover:text-[#2C1B12]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Customer Details */}
                <div className="space-y-2 text-xs bg-[#FAF9F6] p-4 rounded-2xl border border-[#E5E1D8]">
                  <div className="font-bold text-sm text-[#2C1B12]">
                    {selectedOrderForDetails.customer.fullName}
                  </div>
                  <div>Phone: {selectedOrderForDetails.customer.phone}</div>
                  <div>Address: {selectedOrderForDetails.customer.address}</div>
                  <div>Area: {selectedOrderForDetails.customer.area}</div>
                  {selectedOrderForDetails.customer.nearbyLandmark && (
                    <div>Landmark: {selectedOrderForDetails.customer.nearbyLandmark}</div>
                  )}
                  {selectedOrderForDetails.customer.orderNotes && (
                    <div className="text-[#C5A059] font-semibold">
                      Notes: {selectedOrderForDetails.customer.orderNotes}
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-[#2C1B12]">Order Items:</h4>
                  {selectedOrderForDetails.items.map((it) => (
                    <div
                      key={it.id}
                      className="flex justify-between py-1 border-b border-stone-100"
                    >
                      <div>
                        <span className="font-bold">
                          {it.quantity}x {it.menuItem.name}
                        </span>
                        {it.selectedSize && ` (${it.selectedSize.name})`}
                        {it.selectedAddons && it.selectedAddons.length > 0 && (
                          <div className="text-[10px] text-stone-500">
                            +{it.selectedAddons.map((a) => a.name).join(', ')}
                          </div>
                        )}
                      </div>
                      <span className="font-mono font-bold">
                        Rs. {it.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-1.5 text-xs pt-2 border-t border-[#E5E1D8]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono">
                      Rs. {selectedOrderForDetails.subtotal.toLocaleString()}
                    </span>
                  </div>
                  {selectedOrderForDetails.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount:</span>
                      <span className="font-mono">
                        -Rs. {selectedOrderForDetails.discountAmount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span className="font-mono">
                      Rs. {selectedOrderForDetails.deliveryFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#2C1B12] pt-2 border-t border-[#E5E1D8]">
                    <span>Grand Total:</span>
                    <span className="font-mono text-base">
                      Rs. {selectedOrderForDetails.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setSelectedOrderForDetails(null)}
                    className="w-full py-3 bg-[#2C1B12] text-white rounded-xl font-bold text-xs uppercase"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MENU CATALOG CRUD */}
      {activeAdminTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#2C1B12]">Menu Dishes & Catalog</h3>
              <p className="text-xs text-stone-500">
                Add, edit, change prices, and toggle in-stock availability.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingItem(null);
                setItemFormState({
                  name: '',
                  description: '',
                  price: 650,
                  categoryId: categories[0]?.id || 'cat-pizzas',
                  imageUrl:
                    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
                  isAvailable: true,
                  isPopular: false,
                  isSpicy: false,
                  isVegetarian: false,
                  prepTimeMinutes: 15,
                  sizes: [],
                  addons: [],
                });
                setIsCreatingNewItem(true);
              }}
              className="px-4 py-2.5 bg-[#2C1B12] hover:bg-[#3D2B1F] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
            >
              <Plus className="w-4 h-4 text-[#C5A059]" />
              <span>Add New Dish</span>
            </button>
          </div>

          {/* Menu Items Table */}
          <div className="bg-white border border-[#E5E1D8] rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F6] border-b border-[#E5E1D8] text-stone-600 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Dish</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Sizes</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1D8]">
                  {menuItems.map((item) => {
                    const cat = categories.find((c) => c.id === item.categoryId);
                    return (
                      <tr key={item.id} className="hover:bg-[#FAF9F6]/50">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-10 h-10 rounded-xl object-cover border border-[#E5E1D8] shrink-0"
                          />
                          <div>
                            <div className="font-bold text-[#2C1B12]">{item.name}</div>
                            <div className="text-[10px] text-stone-400 line-clamp-1 max-w-xs">
                              {item.description}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-stone-600">
                          {cat ? `${cat.icon} ${cat.name}` : item.categoryId}
                        </td>
                        <td className="p-4 font-mono font-bold text-[#2C1B12]">
                          Rs. {item.price.toLocaleString()}
                        </td>
                        <td className="p-4 text-stone-500 font-mono text-[11px]">
                          {item.sizes && item.sizes.length > 0
                            ? item.sizes.map((s) => s.name).join(', ')
                            : 'Standard'}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleAvailability(item)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              item.isAvailable
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                          </button>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setItemFormState({ ...item });
                              setIsCreatingNewItem(true);
                            }}
                            className="p-1.5 text-stone-600 hover:text-[#2C1B12] hover:bg-[#F1EDE4] rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add / Edit Menu Item Dialog */}
          {isCreatingNewItem && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#E5E1D8] my-8 animate-fadeIn max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-[#E5E1D8] pb-4">
                  <h3 className="font-serif font-bold text-xl text-[#2C1B12]">
                    {editingItem ? 'Edit Menu Dish' : 'Add New Menu Dish'}
                  </h3>
                  <button
                    onClick={() => {
                      setIsCreatingNewItem(false);
                      setEditingItem(null);
                    }}
                    className="p-2 text-stone-400 hover:text-[#2C1B12]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveMenuItem} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#2C1B12]">Dish Name *</label>
                    <input
                      type="text"
                      required
                      value={itemFormState.name || ''}
                      onChange={(e) =>
                        setItemFormState({ ...itemFormState, name: e.target.value })
                      }
                      className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-[#2C1B12]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#2C1B12]">Category *</label>
                      <select
                        value={itemFormState.categoryId || ''}
                        onChange={(e) =>
                          setItemFormState({ ...itemFormState, categoryId: e.target.value })
                        }
                        className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-[#2C1B12]"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-[#2C1B12]">Base Price (PKR) *</label>
                      <input
                        type="number"
                        required
                        value={itemFormState.price || 0}
                        onChange={(e) =>
                          setItemFormState({
                            ...itemFormState,
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-[#2C1B12] font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-[#2C1B12]">Description</label>
                    <textarea
                      rows={3}
                      value={itemFormState.description || ''}
                      onChange={(e) =>
                        setItemFormState({ ...itemFormState, description: e.target.value })
                      }
                      className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-[#2C1B12]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-[#2C1B12]">Image URL</label>
                    <input
                      type="url"
                      value={itemFormState.imageUrl || ''}
                      onChange={(e) =>
                        setItemFormState({ ...itemFormState, imageUrl: e.target.value })
                      }
                      className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-[#2C1B12] font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <label className="flex items-center gap-2 p-3 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={itemFormState.isAvailable ?? true}
                        onChange={(e) =>
                          setItemFormState({ ...itemFormState, isAvailable: e.target.checked })
                        }
                        className="accent-[#C5A059]"
                      />
                      <span className="font-bold">In Stock</span>
                    </label>

                    <label className="flex items-center gap-2 p-3 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={itemFormState.isPopular ?? false}
                        onChange={(e) =>
                          setItemFormState({ ...itemFormState, isPopular: e.target.checked })
                        }
                        className="accent-[#C5A059]"
                      />
                      <span className="font-bold">Popular</span>
                    </label>

                    <label className="flex items-center gap-2 p-3 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={itemFormState.isSpicy ?? false}
                        onChange={(e) =>
                          setItemFormState({ ...itemFormState, isSpicy: e.target.checked })
                        }
                        className="accent-red-600"
                      />
                      <span className="font-bold">Spicy</span>
                    </label>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingNewItem(false);
                        setEditingItem(null);
                      }}
                      className="flex-1 py-3 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl font-bold uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-[#2C1B12] text-white rounded-xl font-bold uppercase shadow-md"
                    >
                      Save Dish
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: HOMEPAGE CMS */}
      {activeAdminTab === 'cms' && cmsState && (
        <div className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-[#E5E1D8] pb-4">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#2C1B12]">
                Homepage & Story CMS Editor
              </h3>
              <p className="text-xs text-stone-500">
                Update marketing hero text, top announcement bar, and restaurant story without code.
              </p>
            </div>

            {cmsSavedSuccess && (
              <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Changes Saved!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveCMS} className="space-y-6 text-xs">
            {/* Announcement Banner */}
            <div className="space-y-3 bg-[#FAF9F6] p-5 rounded-2xl border border-[#E5E1D8]">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#2C1B12]">Top Micro Announcement Bar</h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cmsState.isAnnouncementActive}
                    onChange={(e) =>
                      setCmsState({ ...cmsState, isAnnouncementActive: e.target.checked })
                    }
                    className="accent-[#C5A059]"
                  />
                  <span className="font-bold">Active</span>
                </label>
              </div>
              <input
                type="text"
                value={cmsState.announcementText || ''}
                onChange={(e) => setCmsState({ ...cmsState, announcementText: e.target.value })}
                className="w-full bg-white border border-[#E5E1D8] rounded-xl p-3 text-[#2C1B12]"
              />
            </div>

            {/* Hero Section */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-[#2C1B12]">Hero Section Copy</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#2C1B12]">Hero Subtitle</label>
                  <input
                    type="text"
                    value={cmsState.heroSubtitle || ''}
                    onChange={(e) => setCmsState({ ...cmsState, heroSubtitle: e.target.value })}
                    className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-[#2C1B12]">Hero Headline</label>
                  <input
                    type="text"
                    value={cmsState.heroTitle || ''}
                    onChange={(e) => setCmsState({ ...cmsState, heroTitle: e.target.value })}
                    className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#2C1B12]">Hero Lead Description</label>
                <textarea
                  rows={3}
                  value={cmsState.heroDescription || ''}
                  onChange={(e) => setCmsState({ ...cmsState, heroDescription: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3"
                />
              </div>
            </div>

            {/* Story Section */}
            <div className="space-y-4 pt-4 border-t border-[#E5E1D8]">
              <h4 className="font-bold text-sm text-[#2C1B12]">Heritage Story Content</h4>
              <div className="space-y-1.5">
                <label className="font-bold text-[#2C1B12]">Story Title</label>
                <input
                  type="text"
                  value={cmsState.storyTitle || ''}
                  onChange={(e) => setCmsState({ ...cmsState, storyTitle: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#2C1B12]">Story Paragraph 1</label>
                <textarea
                  rows={3}
                  value={cmsState.storyParagraph1 || ''}
                  onChange={(e) => setCmsState({ ...cmsState, storyParagraph1: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#2C1B12]">Story Paragraph 2</label>
                <textarea
                  rows={3}
                  value={cmsState.storyParagraph2 || ''}
                  onChange={(e) => setCmsState({ ...cmsState, storyParagraph2: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 bg-[#2C1B12] hover:bg-[#3D2B1F] text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#C5A059]" />
              <span>Save CMS Content</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: COUPONS & PROMOS */}
      {activeAdminTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#2C1B12]">Promo & Discount Codes</h3>
              <p className="text-xs text-stone-500">
                Create promotional discount coupons for Cantt residents.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingCoupon(true)}
              className="px-4 py-2.5 bg-[#2C1B12] hover:bg-[#3D2B1F] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4 text-[#C5A059]" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-[#E5E1D8] rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-mono font-black text-lg text-[#2C1B12] bg-[#FAF9F6] px-3 py-1 rounded-xl border border-[#E5E1D8]">
                      {c.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 mt-3">{c.description}</p>

                  <div className="space-y-1 text-xs text-stone-500 pt-3 font-mono">
                    <div>
                      Discount:{' '}
                      <span className="font-bold text-[#2C1B12]">
                        {c.discountType === 'percentage'
                          ? `${c.discountValue}% OFF`
                          : `Rs. ${c.discountValue} OFF`}
                      </span>
                    </div>
                    <div>Min Order: Rs. {c.minOrderAmount}</div>
                    {c.maxDiscountAmount && <div>Max Cap: Rs. {c.maxDiscountAmount}</div>}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5E1D8] flex justify-end">
                  <button
                    onClick={() => handleDeleteCoupon(c.id)}
                    className="text-stone-400 hover:text-red-600 text-xs font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Create Coupon Dialog */}
          {isCreatingCoupon && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-[#E5E1D8] animate-fadeIn">
                <div className="flex justify-between items-center border-b border-[#E5E1D8] pb-4">
                  <h3 className="font-serif font-bold text-xl text-[#2C1B12]">Create Promo Code</h3>
                  <button
                    onClick={() => setIsCreatingCoupon(false)}
                    className="p-2 text-stone-400 hover:text-[#2C1B12]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#2C1B12]">Coupon Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. KHARIAN15"
                      value={couponForm.code || ''}
                      onChange={(e) =>
                        setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })
                      }
                      className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 font-mono uppercase font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#2C1B12]">Discount % / Value</label>
                      <input
                        type="number"
                        required
                        value={couponForm.discountValue || 15}
                        onChange={(e) =>
                          setCouponForm({
                            ...couponForm,
                            discountValue: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#2C1B12]">Min Order (PKR)</label>
                      <input
                        type="number"
                        required
                        value={couponForm.minOrderAmount || 1000}
                        onChange={(e) =>
                          setCouponForm({
                            ...couponForm,
                            minOrderAmount: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-[#2C1B12]">Description</label>
                    <input
                      type="text"
                      placeholder="e.g. 15% discount for Cantt residents"
                      value={couponForm.description || ''}
                      onChange={(e) =>
                        setCouponForm({ ...couponForm, description: e.target.value })
                      }
                      className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3"
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCreatingCoupon(false)}
                      className="flex-1 py-3 bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-[#2C1B12] text-white rounded-xl font-bold uppercase"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: INQUIRIES & TABLE RESERVATIONS */}
      {activeAdminTab === 'messages' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#2C1B12]">
              Customer Inquiries & Table Reservations
            </h3>
            <p className="text-xs text-stone-500">
              Messages submitted via the contact and reservation forms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white border border-[#E5E1D8] rounded-3xl p-6 shadow-xs space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-[#2C1B12]">{msg.name}</h4>
                    <span className="text-xs text-stone-500 font-mono flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-[#C5A059]" />
                      <span>{msg.phone}</span>
                    </span>
                  </div>
                  <span className="text-[10px] bg-[#F1EDE4] text-[#C5A059] font-bold px-2.5 py-1 rounded-full uppercase">
                    {msg.subject}
                  </span>
                </div>

                <p className="text-xs text-stone-700 bg-[#FAF9F6] p-3.5 rounded-2xl border border-[#E5E1D8] leading-relaxed">
                  "{msg.message}"
                </p>

                <div className="text-[10px] text-stone-400 font-mono">
                  Received: {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: STORE & DELIVERY SETTINGS */}
      {activeAdminTab === 'settings' && settingsState && (
        <div className="bg-white border border-[#E5E1D8] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6 max-w-3xl">
          <div className="flex justify-between items-center border-b border-[#E5E1D8] pb-4">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#2C1B12]">
                Store & Delivery Configuration
              </h3>
              <p className="text-xs text-stone-500">
                Opening hours, Cantt delivery charges, phone numbers, and WhatsApp hotline.
              </p>
            </div>

            {settingsSavedSuccess && (
              <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Settings Saved!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-[#2C1B12]">Landline Phone</label>
                <input
                  type="text"
                  value={settingsState.phone}
                  onChange={(e) => setSettingsState({ ...settingsState, phone: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#2C1B12]">Mobile / WhatsApp</label>
                <input
                  type="text"
                  value={settingsState.whatsapp}
                  onChange={(e) =>
                    setSettingsState({ ...settingsState, whatsapp: e.target.value })
                  }
                  className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#2C1B12]">Store Address (Sadar Bazar)</label>
              <input
                type="text"
                value={settingsState.address}
                onChange={(e) => setSettingsState({ ...settingsState, address: e.target.value })}
                className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#2C1B12]">Opening Hours</label>
              <input
                type="text"
                value={settingsState.openingHours}
                onChange={(e) =>
                  setSettingsState({ ...settingsState, openingHours: e.target.value })
                }
                className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="font-bold text-[#2C1B12]">Delivery Fee (PKR)</label>
                <input
                  type="number"
                  value={settingsState.deliveryFee}
                  onChange={(e) =>
                    setSettingsState({
                      ...settingsState,
                      deliveryFee: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#2C1B12]">Free Delivery Above (PKR)</label>
                <input
                  type="number"
                  value={settingsState.freeDeliveryAbove}
                  onChange={(e) =>
                    setSettingsState({
                      ...settingsState,
                      freeDeliveryAbove: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#2C1B12]">Min Order (PKR)</label>
                <input
                  type="number"
                  value={settingsState.minimumOrderAmount}
                  onChange={(e) =>
                    setSettingsState({
                      ...settingsState,
                      minimumOrderAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 bg-[#2C1B12] hover:bg-[#3D2B1F] text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-[#C5A059]" />
              <span>Save Restaurant Settings</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
