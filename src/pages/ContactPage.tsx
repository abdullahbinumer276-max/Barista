import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { api } from '../lib/api';

export const ContactPage: React.FC = () => {
  const { settings } = useRestaurant();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Table Reservation');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await api.submitContactMessage({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        subject,
        message: message.trim(),
      });
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setSubmittedSuccess(true);
      setTimeout(() => setSubmittedSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[#C5A059] font-serif italic text-sm font-bold uppercase tracking-widest">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-[#2C1B12]">
          Visit Us & Table Reservations
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Reach our Sadar Bazar team for reservations, catering inquiries, or home delivery support
          in Kharian Cantt.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Contact Cards & Map */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E5E1D8] p-6 sm:p-8 rounded-3xl shadow-xs space-y-6">
            <h3 className="font-serif font-bold text-xl text-[#2C1B12] border-b border-[#E5E1D8] pb-4">
              Restaurant Information
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF9F6] border border-[#E5E1D8] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#2C1B12] text-sm">Location</h4>
                  <p className="text-stone-600 mt-0.5 leading-relaxed">
                    {settings?.address ||
                      'Sadar Bazar, Kharian Cantt, District Gujrat, Punjab, Pakistan'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF9F6] border border-[#E5E1D8] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#2C1B12] text-sm">Phone Contacts</h4>
                  <p className="text-stone-600 mt-0.5 font-mono">
                    Landline: {settings?.phone || '(053) 7611953'}
                  </p>
                  <p className="text-stone-600 font-mono">
                    Mobile/WhatsApp: {settings?.mobile || '0300-7611953'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF9F6] border border-[#E5E1D8] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#2C1B12] text-sm">Operating Hours</h4>
                  <p className="text-stone-600 mt-0.5">
                    {settings?.openingHours || 'Monday – Sunday: 11:00 AM – 11:30 PM'}
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp Quick Connect Button */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${settings?.whatsapp ? settings.whatsapp.replace(/\D/g, '') : '923007611953'}?text=Hello%20Barista's%20Kharian%20Cantt,%20I%20would%20like%20to%20inquire%20about%20ordering`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp Directly</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Reservation & Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-[#E5E1D8] p-6 sm:p-10 rounded-3xl shadow-sm space-y-6">
            <div className="border-b border-[#E5E1D8] pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
                Reservations & Inquiries
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#2C1B12] mt-1">
                Send Us a Message
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Reserve family tables, plan official garrison luncheons, or give general feedback.
              </p>
            </div>

            {submittedSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Thank you! Your message has been received. Our team will contact you.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#2C1B12]">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Mehmood"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-[#2C1B12] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#2C1B12]">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0300-1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-[#2C1B12] font-mono focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#2C1B12]">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-[#2C1B12] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#2C1B12]">Inquiry Type</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-[#2C1B12] focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Table Reservation">Table Reservation (Family/Lounge)</option>
                    <option value="Official Garrison Event">Official Garrison Event</option>
                    <option value="Birthday / Celebration">Birthday / Celebration</option>
                    <option value="Delivery Feedback">Delivery / Food Feedback</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#2C1B12]">Your Message / Date & Guests *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Mention your preferred date, time, number of guests, or special requirements..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#E5E1D8] rounded-xl p-3 text-[#2C1B12] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#2C1B12] hover:bg-[#3D2B1F] text-white rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Send className="w-4 h-4 text-[#C5A059]" />
                <span>{isSubmitting ? 'Sending Request...' : 'Send Inquiry'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
