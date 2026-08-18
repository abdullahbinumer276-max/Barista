import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Flame,
  Crown,
  Clock,
  Layers,
  Sparkles,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { MenuItem, MenuVariant, MenuAddon, Category } from '../../types';
import { api } from '../../lib/api';

export const AdminMenuTab: React.FC = () => {
  const { categories, menuItems, refreshAll } = useRestaurant();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Filter items
  const filteredItems = menuItems.filter((i) => {
    if (selectedCategory !== 'all' && i.categoryId !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        i.name.toLowerCase().includes(q) ||
        i.categoryName.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingItem({
      name: '',
      categoryId: categories[0]?.id || '',
      categoryName: categories[0]?.name || '',
      description: '',
      basePrice: 500,
      image:
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      prepTime: '20-25 mins',
      isSpicy: false,
      isPopular: false,
      isFeatured: false,
      isAvailable: true,
      variants: [],
      addons: [],
    });
    setIsEditingItem(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem({ ...item });
    setIsEditingItem(true);
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
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

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name || !editingItem.categoryId) return;

    setIsSaving(true);
    try {
      const cat = categories.find((c) => c.id === editingItem.categoryId);
      const payload = {
        ...editingItem,
        categoryName: cat?.name || editingItem.categoryName || '',
      };

      if (editingItem.id) {
        await api.updateMenuItem(editingItem.id, payload);
      } else {
        await api.createMenuItem(payload);
      }
      await refreshAll();
      setIsEditingItem(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Failed to save menu item', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Add / Remove Variant in Form
  const handleAddVariant = () => {
    if (!editingItem) return;
    const variants = editingItem.variants || [];
    const newVariant: MenuVariant = {
      id: `v-${Date.now()}`,
      name: 'Regular',
      price: editingItem.basePrice || 500,
    };
    setEditingItem({ ...editingItem, variants: [...variants, newVariant] });
  };

  const handleRemoveVariant = (idx: number) => {
    if (!editingItem || !editingItem.variants) return;
    const variants = [...editingItem.variants];
    variants.splice(idx, 1);
    setEditingItem({ ...editingItem, variants });
  };

  const handleUpdateVariant = (idx: number, field: keyof MenuVariant, val: any) => {
    if (!editingItem || !editingItem.variants) return;
    const variants = [...editingItem.variants];
    variants[idx] = { ...variants[idx], [field]: val };
    setEditingItem({ ...editingItem, variants });
  };

  // Add / Remove Addon in Form
  const handleAddAddon = () => {
    if (!editingItem) return;
    const addons = editingItem.addons || [];
    const newAddon: MenuAddon = {
      id: `a-${Date.now()}`,
      name: 'Extra Cheese',
      price: 150,
    };
    setEditingItem({ ...editingItem, addons: [...addons, newAddon] });
  };

  const handleRemoveAddon = (idx: number) => {
    if (!editingItem || !editingItem.addons) return;
    const addons = [...editingItem.addons];
    addons.splice(idx, 1);
    setEditingItem({ ...editingItem, addons });
  };

  const handleUpdateAddon = (idx: number, field: keyof MenuAddon, val: any) => {
    if (!editingItem || !editingItem.addons) return;
    const addons = [...editingItem.addons];
    addons[idx] = { ...addons[idx], [field]: val };
    setEditingItem({ ...editingItem, addons });
  };

  // Add Category Handler
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await api.createCategory({
        name: newCatName.trim(),
        slug: newCatSlug.trim() || newCatName.trim().toLowerCase().replace(/\s+/g, '-'),
        description: newCatDesc.trim() || undefined,
        displayOrder: categories.length + 1,
      });
      setNewCatName('');
      setNewCatSlug('');
      setNewCatDesc('');
      await refreshAll();
      setIsCategoryModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-serif font-bold text-white">Manage Categories</h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                Add New Category
              </h4>
              <input
                type="text"
                required
                placeholder="Category Name (e.g. Desserts)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Slug (e.g. desserts)"
                value={newCatSlug}
                onChange={(e) => setNewCatSlug(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white font-mono"
              />
              <input
                type="text"
                placeholder="Short Description"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white"
              />
              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-2.5 rounded-xl text-xs"
              >
                Create Category
              </button>
            </form>

            <div className="space-y-2 pt-3 border-t border-stone-800">
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wide">
                Existing Categories
              </h4>
              <div className="max-h-40 overflow-y-auto space-y-1.5 text-xs">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    className="p-2 bg-stone-950 border border-stone-800 rounded-lg flex justify-between items-center text-stone-200"
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {menuItems.filter((i) => i.categoryId === c.id).length} items
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add Menu Item Modal */}
      {isEditingItem && editingItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <h3 className="text-2xl font-serif font-bold text-white">
                {editingItem.id ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <button
                onClick={() => {
                  setIsEditingItem(false);
                  setEditingItem(null);
                }}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-300">Item Name *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder="e.g. Baristas Thunder Burger"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-300">Category *</label>
                  <select
                    value={editingItem.categoryId || ''}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const cat = categories.find((c) => c.id === selectedId);
                      setEditingItem({
                        ...editingItem,
                        categoryId: selectedId,
                        categoryName: cat?.name || '',
                      });
                    }}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-stone-300">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Ingredients and taste description..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-300">Base Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingItem.basePrice || 0}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, basePrice: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-300">Prep Time</label>
                  <input
                    type="text"
                    value={editingItem.prepTime || '20-25 mins'}
                    onChange={(e) => setEditingItem({ ...editingItem, prepTime: e.target.value })}
                    placeholder="e.g. 15-20 mins"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-stone-300">Image URL</label>
                  <input
                    type="url"
                    value={editingItem.image || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white text-xs"
                  />
                </div>
              </div>

              {/* Badges and Flags */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-950 p-4 rounded-2xl border border-stone-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isAvailable ?? true}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isAvailable: e.target.checked })
                    }
                    className="rounded border-stone-700 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-stone-300">In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isFeatured ?? false}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isFeatured: e.target.checked })
                    }
                    className="rounded border-stone-700 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-stone-300">Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isPopular ?? false}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isPopular: e.target.checked })
                    }
                    className="rounded border-stone-700 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-stone-300">Popular Pick</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isSpicy ?? false}
                    onChange={(e) => setEditingItem({ ...editingItem, isSpicy: e.target.checked })}
                    className="rounded border-stone-700 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-stone-300">Spicy</span>
                </label>
              </div>

              {/* Sizes / Variants Builder */}
              <div className="space-y-3 bg-stone-950 p-4 rounded-2xl border border-stone-800">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-200 uppercase tracking-wide">
                    Sizes & Variants (e.g. Small, Medium, Large)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Size</span>
                  </button>
                </div>

                {editingItem.variants && editingItem.variants.length > 0 ? (
                  <div className="space-y-2">
                    {editingItem.variants.map((v, idx) => (
                      <div key={v.id || idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Size (e.g. Medium 10 inch)"
                          value={v.name}
                          onChange={(e) => handleUpdateVariant(idx, 'name', e.target.value)}
                          className="flex-1 bg-stone-900 border border-stone-800 rounded-lg p-2 text-xs text-white"
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={v.price}
                          onChange={(e) =>
                            handleUpdateVariant(idx, 'price', parseFloat(e.target.value) || 0)
                          }
                          className="w-28 bg-stone-900 border border-stone-800 rounded-lg p-2 text-xs text-white font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(idx)}
                          className="text-stone-500 hover:text-red-400 p-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-stone-500 text-xs italic">
                    No custom sizes. Will use base price Rs. {editingItem.basePrice}.
                  </p>
                )}
              </div>

              {/* Addons Builder */}
              <div className="space-y-3 bg-stone-950 p-4 rounded-2xl border border-stone-800">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-200 uppercase tracking-wide">
                    Add-ons & Upgrades (e.g. Cheese Stuffed Crust, Mayo Dip)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddAddon}
                    className="text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Add-on</span>
                  </button>
                </div>

                {editingItem.addons && editingItem.addons.length > 0 ? (
                  <div className="space-y-2">
                    {editingItem.addons.map((a, idx) => (
                      <div key={a.id || idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Addon (e.g. Cheese Stuffed Crust)"
                          value={a.name}
                          onChange={(e) => handleUpdateAddon(idx, 'name', e.target.value)}
                          className="flex-1 bg-stone-900 border border-stone-800 rounded-lg p-2 text-xs text-white"
                        />
                        <input
                          type="number"
                          placeholder="Extra Price"
                          value={a.price}
                          onChange={(e) =>
                            handleUpdateAddon(idx, 'price', parseFloat(e.target.value) || 0)
                          }
                          className="w-28 bg-stone-900 border border-stone-800 rounded-lg p-2 text-xs text-white font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAddon(idx)}
                          className="text-stone-500 hover:text-red-400 p-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-stone-500 text-xs italic">No add-ons configured.</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingItem(false);
                    setEditingItem(null);
                  }}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-5 py-2.5 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-2.5 rounded-xl transition-colors shadow-md"
                >
                  {isSaving ? 'Saving...' : 'Save Menu Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-stone-950 border border-stone-800 p-4 rounded-2xl shadow-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by name, description..."
            className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-3.5 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-amber-600 text-stone-950 font-black shadow-md'
              : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-white'
          }`}
        >
          All Items ({menuItems.length})
        </button>
        {categories.map((c) => {
          const count = menuItems.filter((i) => i.categoryId === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-amber-600 text-stone-950 font-black shadow-md'
                  : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              {c.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Items Table */}
      <div className="bg-stone-950 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-800 bg-stone-900/50 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                <th className="p-4">Dish</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Variants</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-xs">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-stone-500">
                    No menu items found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-900/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-800 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{item.name}</span>
                            {item.isSpicy && <Flame className="w-3 h-3 text-red-500" />}
                            {item.isFeatured && <Crown className="w-3 h-3 text-amber-400" />}
                          </div>
                          <p className="text-[11px] text-stone-400 line-clamp-1 max-w-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300 text-[11px]">
                        {item.categoryName}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-amber-300">
                      Rs. {item.basePrice.toLocaleString()}
                    </td>
                    <td className="p-4 text-stone-400 text-[11px]">
                      {item.variants && item.variants.length > 0 ? (
                        <span>{item.variants.length} Sizes</span>
                      ) : (
                        <span>Standard</span>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleAvailability(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
                          item.isAvailable
                            ? 'bg-emerald-950 border-emerald-800 text-emerald-300'
                            : 'bg-red-950 border-red-800 text-red-300'
                        }`}
                      >
                        {item.isAvailable ? 'In Stock' : 'Sold Out'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white rounded-xl transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          className="p-2 bg-stone-900 hover:bg-red-950/60 border border-stone-800 text-stone-400 hover:text-red-400 rounded-xl transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
