'use client';
import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

export default function EnquiryModal({ open, onClose, packageId, packageTitle, enquiryType = 'general' }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', destination: '', travel_dates: '', group_size: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.phone) { setError('Name and phone are required.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, package_id: packageId, package_title: packageTitle, enquiry_type: enquiryType }),
      });
      const data = await res.json();
      if (data.success) setSuccess(true);
      else setError(data.error || 'Something went wrong.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    onClose();
    setTimeout(() => { setSuccess(false); setForm({ name: '', phone: '', email: '', destination: '', travel_dates: '', group_size: '', message: '' }); }, 300);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-bold text-[#1a1a2e]">
            {packageTitle ? `Enquire: ${packageTitle}` : 'Plan Your Trip'}
          </h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
        </div>

        {success ? (
          <div className="px-6 py-12 text-center">
            <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-[#1a1a2e] mb-2">Enquiry Received!</h4>
            <p className="text-gray-500 mb-6">Our team will reach out to you within 2-4 hours on WhatsApp.</p>
            <button onClick={handleClose} className="btn-primary">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input name="phone" value={form.phone} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="10-digit mobile" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="your@email.com" />
            </div>
            {!packageTitle && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <input name="destination" value={form.destination} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="Where do you want to go?" />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Travel Dates</label>
                <input name="travel_dates" value={form.travel_dates} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="e.g. July 15-20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Size</label>
                <input name="group_size" type="number" min="1" value={form.group_size} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="No. of people" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A] resize-none" placeholder="Any special requirements or questions..." />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={handleClose} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 bg-[#E8651A] text-white py-2.5 rounded-full text-sm font-semibold hover:bg-orange-600 disabled:opacity-60">
                {loading ? 'Sending...' : 'Send Enquiry'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
