import React, { useState, useEffect } from 'react';
import { Mail, Star, CheckCircle2, Trash2, Eye, Phone, MessageCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { ContactMessage, Review } from '../../types';
import { useRestaurant } from '../../context/RestaurantContext';

export const AdminMessagesTab: React.FC = () => {
  const { reviews, refreshAll } = useRestaurant();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'messages' | 'reviews'>('messages');

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleResolved = async (msg: ContactMessage) => {
    try {
      await api.updateContactMessage(msg.id, { isResolved: !msg.isResolved });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, isResolved: !m.isResolved } : m))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleReviewApproval = async (review: Review) => {
    try {
      await api.updateReview(review.id, { isApproved: !review.isApproved });
      await refreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (window.confirm('Delete this customer review?')) {
      try {
        await api.deleteReview(id);
        await refreshAll();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center gap-2 bg-stone-950 border border-stone-800 p-2 rounded-2xl">
        <button
          onClick={() => setActiveSubTab('messages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'messages'
              ? 'bg-amber-600 text-stone-950 shadow-md font-black'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Inquiries & Reservations ({messages.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reviews')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'reviews'
              ? 'bg-amber-600 text-stone-950 shadow-md font-black'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Customer Reviews ({reviews.length})</span>
        </button>
      </div>

      {activeSubTab === 'messages' ? (
        /* Messages / Inquiries List */
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="bg-stone-950 border border-stone-800 p-12 rounded-3xl text-center text-stone-500">
              No customer inquiries yet.
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className="bg-stone-950 border border-stone-800 p-5 rounded-2xl shadow-xl space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{m.name}</h4>
                      <span className="text-[11px] bg-stone-900 border border-stone-800 text-amber-400 px-2 py-0.5 rounded">
                        {m.subject}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-stone-400 mt-1">
                      <span className="font-mono">{m.phone}</span>
                      {m.email && <span>• {m.email}</span>}
                      <span>• {new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleResolved(m)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                      m.isResolved
                        ? 'bg-emerald-950 border-emerald-800 text-emerald-300'
                        : 'bg-amber-950 border-amber-800 text-amber-300'
                    }`}
                  >
                    {m.isResolved ? 'Resolved' : 'Mark as Resolved'}
                  </button>
                </div>

                <p className="text-xs text-stone-300 bg-stone-900/60 p-3 rounded-xl border border-stone-800 leading-relaxed">
                  "{m.message}"
                </p>

                <div className="flex gap-2 pt-1">
                  <a
                    href={`tel:${m.phone}`}
                    className="bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Call Guest</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Reviews List */
        <div className="space-y-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-stone-950 border border-stone-800 p-5 rounded-2xl shadow-xl flex items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-white">{r.authorName}</span>
                  <span className="text-xs text-stone-500 font-mono">({r.date})</span>
                </div>
                <p className="text-xs text-stone-300 italic max-w-xl">"{r.comment}"</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleReviewApproval(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    r.isApproved
                      ? 'bg-emerald-950 border-emerald-800 text-emerald-300'
                      : 'bg-stone-900 border-stone-800 text-stone-400'
                  }`}
                >
                  {r.isApproved ? 'Published' : 'Hidden'}
                </button>
                <button
                  onClick={() => handleDeleteReview(r.id)}
                  className="p-2 bg-stone-900 hover:bg-red-950 border border-stone-800 text-stone-400 hover:text-red-400 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
