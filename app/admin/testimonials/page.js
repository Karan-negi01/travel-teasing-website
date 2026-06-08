'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Star } from 'lucide-react';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', traveler_city: '', trip_destination: '', review_text: '', rating: 5, trip_category: '', is_active: true });

  async function load() {
    const res = await fetch('/api/testimonials');
    const data = await res.json();
    setTestimonials(data.testimonials || []);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch('/api/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setShowForm(false);
    setForm({ name: '', traveler_city: '', trip_destination: '', review_text: '', rating: 5, trip_category: '', is_active: true });
    load();
  }

  async function deleteItem(id) {
    await supabaseAdmin.from('testimonials').delete().eq('id', id);
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Testimonials</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#E8651A] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"><Plus size={16} /> Add</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Name *</label><input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1">City</label><input value={form.traveler_city} onChange={e => setForm(f => ({...f, traveler_city: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Destination</label><input value={form.trip_destination} onChange={e => setForm(f => ({...f, trip_destination: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Rating</label><select value={form.rating} onChange={e => setForm(f => ({...f, rating: parseInt(e.target.value)}))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]">{[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}</select></div>
          </div>
          <div><label className="text-sm font-medium text-gray-700 block mb-1">Review *</label><textarea required rows={3} value={form.review_text} onChange={e => setForm(f => ({...f, review_text: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A] resize-none" /></div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600">Cancel</button>
            <button type="submit" className="bg-[#E8651A] text-white px-4 py-2 rounded-lg text-sm font-semibold">Add Testimonial</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? <div className="text-gray-400">Loading...</div> : testimonials.map(t => (
          <div key={t.id} className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-[#1a1a2e]">{t.name}</p>
                <p className="text-gray-400 text-xs">{t.trip_destination} · {t.traveler_city}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">{Array.from({length: t.rating}).map((_, i) => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}</div>
              </div>
            </div>
            <p className="text-gray-500 text-sm line-clamp-3">{t.review_text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
