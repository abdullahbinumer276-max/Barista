import React, { useState } from 'react';
import { Tag, Plus, Trash2, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Coupon } from '../../types';
import { api } from '../../lib/api';

export const AdminPromotionsTab: React.FC = () => {
  const { coupons, refreshAll } = useRestaurant();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [minOrderAmount, setMinOrderAmount] = useState(1000);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(500);
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsSaving(true);
    try {
      await api.createCoupon({
        code: code.trim().toUpperCase(),
        discountType,
        discountValue,
        minOrderAmount,
        maxDiscountAmount: discountType === 'percentage' ? maxDiscountAmount : undefined,
        description: description.trim() || undefined,
        isActive: true,
      });
      setCode('');
      setDescription('');
      await refreshAll();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCoupon = async (id: string, couponCode: string) => {
    if (window.confirm(`Delete coupon code ${couponCode}?`)) {
      try {
        await api.deleteCoupon(id);
        await refreshAll();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-xl font-serif font-bold text-white">Create Promo Code</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-stone-300">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CANTTFREE or KHARIAN15"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs uppercase font-mono text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-300">Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Flat Fixed (Rs.)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-300">Discount Value</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-300">Min Order (Rs.)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white font-mono"
                  />
                </div>

                {discountType === 'percentage' && (
                  <div className="space-y-1.5">
                    <label className="font-semibold text-stone-300">Max Cap (Rs.)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={maxDiscountAmount}
                      onChange={(e) => setMaxDiscountAmount(parseFloat(e.target.value) || 0)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-300">Short Description</label>
                <input
                  type="text"
                  placeholder="e.g. 10% off on all Kharian orders"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-3 rounded-xl transition-colors text-xs shadow-md"
              >
                {isSaving ? 'Saving...' : 'Save Coupon'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between bg-stone-950 border border-stone-800 p-4 rounded-2xl shadow-xl">
        <div>
          <h3 className="text-base font-serif font-bold text-white">Active Promotional Codes</h3>
          <p className="text-xs text-stone-400">
            Customers can enter these codes at checkout or drawer.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Coupon</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="bg-stone-950 border border-stone-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-amber-400 text-base bg-amber-600/15 border border-amber-500/30 px-3 py-1 rounded-lg">
                  {c.code}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold">
                  Active
                </span>
              </div>
              <p className="text-xs text-stone-300">{c.description || 'Promotional discount'}</p>
            </div>

            <div className="pt-3 border-t border-stone-800/80 space-y-1 text-xs text-stone-400">
              <div className="flex justify-between">
                <span>Discount:</span>
                <span className="text-white font-bold">
                  {c.discountType === 'percentage' ? `${c.discountValue}%` : `Rs. ${c.discountValue}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Min Order:</span>
                <span className="text-white">Rs. {c.minOrderAmount}</span>
              </div>
              {c.maxDiscountAmount && (
                <div className="flex justify-between">
                  <span>Max Cap:</span>
                  <span className="text-white">Rs. {c.maxDiscountAmount}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleDeleteCoupon(c.id, c.code)}
                className="text-stone-500 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
