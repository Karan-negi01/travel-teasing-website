'use client';
import { useState } from 'react';
import { CheckCircle, MessageCircle, Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', destination: '', travel_dates: '', group_size: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.phone) { setError('Name and phone are required.'); return; }
    setLoading(true); setError('');
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, enquiry_type: 'general' }),
    });
    const data = await res.json();
    if (data.success) setSuccess(true);
    else setError(data.error || 'Something went wrong.');
    setLoading(false);
  }

  return (
    <div className="pt-20">
      <div className="bg-gray-50 py-12">
        <div className="container-max text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-[#1a1a2e] mb-3">
            <em className="italic font-normal">Get in</em> Touch
          </h1>
          <p className="text-gray-500">Tell us about your dream trip — we'll make it happen</p>
        </div>
      </div>

      <div className="container-max py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {/* Contact info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#1a1a2e]">We're Here For You</h2>
            <p className="text-gray-500 text-sm leading-relaxed">Whether you have a specific destination in mind or just want to explore options, our travel experts are ready to help craft the perfect trip for you.</p>
            <div className="space-y-4">
              <a href="https://wa.me/916396464369" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <MessageCircle size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#1a1a2e]">WhatsApp</p>
                  <p className="text-gray-400 text-xs">Chat with us instantly</p>
                </div>
              </a>
              <a href="mailto:hello@travelteasing.com" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Mail size={18} className="text-[#E8651A]" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#1a1a2e]">Email</p>
                  <p className="text-gray-400 text-xs">hello@travelteasing.com</p>
                </div>
              </a>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#1a1a2e]">Based In</p>
                  <p className="text-gray-400 text-xs">Delhi, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {success ? (
              <div className="card p-10 text-center">
                <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#1a1a2e] mb-3">We've Received Your Message!</h3>
                <p className="text-gray-500">Our team will get back to you within 2-4 hours on WhatsApp. Thank you for choosing Travel Teasing!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input required value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="10-digit mobile" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination in Mind</label>
                  <input value={form.destination} onChange={e => setForm(f => ({...f, destination: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="e.g. Kasol, Ladakh, Char Dham" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Travel Dates</label>
                    <input value={form.travel_dates} onChange={e => setForm(f => ({...f, travel_dates: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="e.g. July 10-15" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Group Size</label>
                    <input type="number" min="1" value={form.group_size} onChange={e => setForm(f => ({...f, group_size: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="Number of people" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea rows={4} value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A] resize-none" placeholder="Tell us what you're looking for..." />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
