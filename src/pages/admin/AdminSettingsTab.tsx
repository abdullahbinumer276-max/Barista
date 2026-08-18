import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, MapPin, Phone, Clock, Truck } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { api } from '../../lib/api';
import { RestaurantSettings } from '../../types';

export const AdminSettingsTab: React.FC = () => {
  const { settings, refreshAll } = useRestaurant();
  const [formData, setFormData] = useState<Partial<RestaurantSettings>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await api.updateSettings(formData);
      await refreshAll();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Save Action Bar */}
      <div className="flex items-center justify-between bg-stone-950 border border-stone-800 p-4 rounded-2xl shadow-xl sticky top-24 z-10 backdrop-blur-md">
        <div>
          <h3 className="text-base font-serif font-bold text-white">Store & System Configuration</h3>
          <p className="text-xs text-stone-400">
            Manage Kharian Cantt store details, delivery charges, and contact info.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings Updated!</span>
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* General Store Info */}
      <div className="bg-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
          <Settings className="w-5 h-5 text-amber-400" />
          <h4 className="text-lg font-serif font-bold text-white">General Information</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-300">Restaurant Brand Name</label>
            <input
              type="text"
              value={formData.restaurantName || ''}
              onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-white text-xs font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-300">Opening Hours</label>
            <input
              type="text"
              value={formData.openingHours || ''}
              onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-white text-xs"
            />
          </div>

          <div className="col-span-2 space-y-1.5">
            <label className="font-semibold text-stone-300">Complete Address</label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-white text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-300">Landline Phone</label>
            <input
              type="text"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-white text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-300">Mobile / WhatsApp Number</label>
            <input
              type="text"
              value={formData.mobile || ''}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-white text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* Delivery & Ordering Settings */}
      <div className="bg-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
          <Truck className="w-5 h-5 text-amber-400" />
          <h4 className="text-lg font-serif font-bold text-white">Delivery & Ordering Rules</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-300">Standard Delivery Fee (Rs.)</label>
            <input
              type="number"
              value={formData.deliveryFee || 0}
              onChange={(e) =>
                setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) || 0 })
              }
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-white text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-300">Free Delivery Above (Rs.)</label>
            <input
              type="number"
              value={formData.freeDeliveryAbove || 0}
              onChange={(e) =>
                setFormData({ ...formData, freeDeliveryAbove: parseFloat(e.target.value) || 0 })
              }
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-white text-xs font-mono"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
