import React, { useState, useEffect } from 'react';
import { Sparkles, Save, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { api } from '../../lib/api';
import { HomepageCMS } from '../../types';

export const AdminContentTab: React.FC = () => {
  const { homepage, refreshAll } = useRestaurant();
  const [formData, setFormData] = useState<Partial<HomepageCMS>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (homepage) {
      setFormData(homepage);
    }
  }, [homepage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await api.updateHomepageContent(formData);
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
          <h3 className="text-base font-serif font-bold text-white">Homepage & Brand CMS</h3>
          <p className="text-xs text-stone-400">
            Edit live headlines, storytelling copy, and featured imagery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved to Database!</span>
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Hero Section Box */}
      <div className="bg-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h4 className="text-lg font-serif font-bold text-white">Hero Header Section</h4>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-300">Hero Main Title (Uppercase)</label>
            <input
              type="text"
              value={formData.heroTitle || ''}
              onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-white text-xs font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-300">Hero Subtitle / Slogan</label>
            <input
              type="text"
              value={formData.heroSubtitle || ''}
              onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-white text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-300">Hero Description</label>
            <textarea
              rows={3}
              value={formData.heroDescription || ''}
              onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-white text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-300">Hero Showcase Image URL</label>
            <input
              type="url"
              value={formData.heroImageUrl || ''}
              onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-white text-xs"
            />
          </div>
        </div>
      </div>

      {/* Story Section Box */}
      <div className="bg-stone-950 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
          <ImageIcon className="w-5 h-5 text-amber-400" />
          <h4 className="text-lg font-serif font-bold text-white">Our Story & Heritage</h4>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-stone-300">Story Title</label>
            <input
              type="text"
              value={formData.storyTitle || ''}
              onChange={(e) => setFormData({ ...formData, storyTitle: e.target.value })}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-white text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-300">Story Paragraph 1</label>
            <textarea
              rows={3}
              value={formData.storyParagraph1 || ''}
              onChange={(e) => setFormData({ ...formData, storyParagraph1: e.target.value })}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-white text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-300">Story Paragraph 2</label>
            <textarea
              rows={3}
              value={formData.storyParagraph2 || ''}
              onChange={(e) => setFormData({ ...formData, storyParagraph2: e.target.value })}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-white text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-stone-300">Story Ambiance Image URL</label>
            <input
              type="url"
              value={formData.storyImageUrl || ''}
              onChange={(e) => setFormData({ ...formData, storyImageUrl: e.target.value })}
              className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-white text-xs"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
