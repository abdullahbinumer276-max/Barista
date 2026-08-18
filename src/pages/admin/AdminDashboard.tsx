import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Layers,
  Tag,
  FileText,
  Settings,
  Mail,
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle2,
  DollarSign,
  Lock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { AdminOrdersTab } from './AdminOrdersTab';
import { AdminMenuTab } from './AdminMenuTab';
import { AdminPromotionsTab } from './AdminPromotionsTab';
import { AdminContentTab } from './AdminContentTab';
import { AdminSettingsTab } from './AdminSettingsTab';
import { AdminMessagesTab } from './AdminMessagesTab';
import { api } from '../../lib/api';
import { DashboardStats } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  const { menuItems, coupons } = useRestaurant();
  const [activeTab, setActiveTab] = useState<
    'orders' | 'menu' | 'promotions' | 'content' | 'settings' | 'messages'
  >('orders');
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Login form state
  const [email, setEmail] = useState('admin@baristas.pk');
  const [password, setPassword] = useState('baristas123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const fetchStats = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await api.getAdminStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      const interval = setInterval(fetchStats, 15000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid email or password');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // If not logged in, show Login Screen
  if (!isAuthenticated) {
    return (
      <div className="bg-stone-900 text-stone-100 min-h-[85vh] flex items-center justify-center p-4">
        <div className="bg-stone-950 border border-stone-800 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-600/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-2">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-serif font-black text-white">Barista's Staff Portal</h2>
            <p className="text-xs text-stone-400">
              Authorized access for Kharian Cantt store management & kitchen POS.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/50 border border-red-800 rounded-xl text-red-300 text-xs text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-stone-300">Staff Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-300">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-white text-xs font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-3.5 rounded-xl transition-colors text-xs shadow-md"
            >
              {isLoggingIn ? 'Verifying Credentials...' : 'Sign In to Management'}
            </button>
          </form>

          {/* Quick Demo Login Preset Note */}
          <div className="bg-stone-900/80 p-3.5 rounded-xl border border-stone-800 text-[11px] text-stone-400 text-center space-y-1">
            <p className="font-semibold text-amber-400">Demo Admin Credentials Preloaded</p>
            <p>
              Email: <code className="text-stone-200">admin@baristas.pk</code> | Pass:{' '}
              <code className="text-stone-200">baristas123</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-900 text-stone-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Management Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-950 border border-stone-800 p-6 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-stone-950 flex items-center justify-center font-serif font-bold text-2xl shadow-lg">
              B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-black text-white">
                  Barista's Management & CMS
                </h1>
                <span className="text-[10px] bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold px-2 py-0.5 rounded uppercase">
                  Kharian Branch
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Logged in as <strong className="text-stone-200">{user?.name}</strong> (
                {user?.role})
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="self-start sm:self-auto bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold border border-stone-800 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Live Metrics Overview Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-stone-950 border border-stone-800 p-5 rounded-2xl shadow-xl space-y-1">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>Total Orders</span>
                <ShoppingBag className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-2xl font-black text-white font-mono">{stats.totalOrders}</span>
              <p className="text-[10px] text-stone-500">Live order counter</p>
            </div>

            <div className="bg-stone-950 border border-stone-800 p-5 rounded-2xl shadow-xl space-y-1">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>Pending Kitchen</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-2xl font-black text-amber-400 font-mono">
                {stats.pendingOrders}
              </span>
              <p className="text-[10px] text-stone-500">Requires cooking/dispatch</p>
            </div>

            <div className="bg-stone-950 border border-stone-800 p-5 rounded-2xl shadow-xl space-y-1">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>Total Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                Rs. {stats.totalRevenue.toLocaleString()}
              </span>
              <p className="text-[10px] text-stone-500">Completed & active sales</p>
            </div>

            <div className="bg-stone-950 border border-stone-800 p-5 rounded-2xl shadow-xl space-y-1">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>Menu Items</span>
                <Layers className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-2xl font-black text-white font-mono">{menuItems.length}</span>
              <p className="text-[10px] text-stone-500">Pizzas, burgers, shakes</p>
            </div>

            <div className="bg-stone-950 border border-stone-800 p-5 rounded-2xl shadow-xl space-y-1">
              <div className="flex items-center justify-between text-stone-400 text-xs">
                <span>Promo Codes</span>
                <Tag className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-2xl font-black text-white font-mono">{coupons.length}</span>
              <p className="text-[10px] text-stone-500">Active customer discounts</p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none bg-stone-950 border border-stone-800 p-2 rounded-2xl shadow-xl">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-amber-600 text-stone-950 font-black shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders & POS</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'menu'
                ? 'bg-amber-600 text-stone-950 font-black shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Menu & Categories</span>
          </button>

          <button
            onClick={() => setActiveTab('promotions')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'promotions'
                ? 'bg-amber-600 text-stone-950 font-black shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Promotions & Coupons</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'content'
                ? 'bg-amber-600 text-stone-950 font-black shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Homepage Copy CMS</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-amber-600 text-stone-950 font-black shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store & Delivery Rules</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'messages'
                ? 'bg-amber-600 text-stone-950 font-black shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Inquiries & Reviews</span>
          </button>
        </div>

        {/* Tab View Content */}
        <div className="pt-2">
          {activeTab === 'orders' && <AdminOrdersTab />}
          {activeTab === 'menu' && <AdminMenuTab />}
          {activeTab === 'promotions' && <AdminPromotionsTab />}
          {activeTab === 'content' && <AdminContentTab />}
          {activeTab === 'settings' && <AdminSettingsTab />}
          {activeTab === 'messages' && <AdminMessagesTab />}
        </div>
      </div>
    </div>
  );
};
