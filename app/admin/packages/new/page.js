'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';

const categories = ['group', 'family', 'sacred', 'adventure', 'corporate'];

export default function NewPackagePage() {
  const router = useRouter();
  const [form, setForm] = useState({ slug: '', title: '', location: '', state: '', category: 'group', duration_days: 3, duration_nights: 2, group_size_min: 8, group_size_max: 12, price_per_person: 0, total_price: 0, description: '', highlights: ['', '', '', '', ''], inclusions: [''], exclusions: [''], things_to_carry: [''], cover_image: '', is_featured: false, is_active: true, departure_city: '', best_time_to_visit: '', difficulty_level: '' });
  const [itinerary, setItinerary] = useState([{ day: 1, title: '', description: '' }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function setField(k, v) { setForm(f => ({...f, [k]: v})); }
  function setArr(k, i, v) { setForm(f => ({ ...f, [k]: f[k].map((x, idx) => idx === i ? v : x) })); }
  function addItem(k) { setForm(f => ({ ...f, [k]: [...f[k], ''] })); }
  function removeItem(k, i) { setForm(f => ({ ...f, [k]: f[k].filter((_, idx) => idx !== i) })); }

  function addItineraryDay() { setItinerary(d => [...d, { day: d.length + 1, title: '', description: '' }]); }
  function removeItineraryDay(i) { setItinerary(d => d.filter((_, idx) => idx !== i).map((x, idx) => ({...x, day: idx + 1}))); }
  function setItineraryField(i, k, v) { setItinerary(d => d.map((x, idx) => idx === i ? {...x, [k]: v} : x)); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setError('');
    const payload = { ...form, itinerary, highlights: form.highlights.filter(Boolean), inclusions: form.inclusions.filter(Boolean), exclusions: form.exclusions.filter(Boolean), things_to_carry: form.things_to_carry.filter(Boolean) };
    const res = await fetch('/api/admin/packages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (data.success) router.push('/admin/packages');
    else { setError(data.error); setSaving(false); }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">New Package</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-[#1a1a2e] border-b pb-2">Basic Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Title *</label><input required value={form.title} onChange={e => { setField('title', e.target.value); setField('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')); }} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Slug *</label><input required value={form.slug} onChange={e => setField('slug', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Location</label><input value={form.location} onChange={e => setField('location', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1">State</label><input value={form.state} onChange={e => setField('state', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Category</label><select value={form.category} onChange={e => setField('category', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Departure City</label><input value={form.departure_city} onChange={e => setField('departure_city', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Days</label><input type="number" value={form.duration_days} onChange={e => setField('duration_days', parseInt(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Nights</label><input type="number" value={form.duration_nights} onChange={e => setField('duration_nights', parseInt(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Min Group</label><input type="number" value={form.group_size_min} onChange={e => setField('group_size_min', parseInt(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Max Group</label><input type="number" value={form.group_size_max} onChange={e => setField('group_size_max', parseInt(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Price/Person ₹</label><input type="number" value={form.price_per_person} onChange={e => setField('price_per_person', parseInt(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Total Price ₹</label><input type="number" value={form.total_price} onChange={e => setField('total_price', parseInt(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
          </div>
          <div><label className="text-sm font-medium text-gray-700 block mb-1">Cover Image URL</label><input value={form.cover_image} onChange={e => setField('cover_image', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="https://images.unsplash.com/..." /></div>
          <div><label className="text-sm font-medium text-gray-700 block mb-1">Description</label><textarea rows={4} value={form.description} onChange={e => setField('description', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A] resize-none" /></div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_featured} onChange={e => setField('is_featured', e.target.checked)} className="accent-[#E8651A]" /><span className="text-sm">Featured</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={e => setField('is_active', e.target.checked)} className="accent-[#E8651A]" /><span className="text-sm">Active</span></label>
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-3">
          <h2 className="font-bold text-[#1a1a2e] border-b pb-2">Highlights</h2>
          {form.highlights.map((h, i) => (
            <div key={i} className="flex gap-2"><input value={h} onChange={e => setArr('highlights', i, e.target.value)} placeholder={`Highlight ${i+1}`} className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /><button type="button" onClick={() => removeItem('highlights', i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button></div>
          ))}
          <button type="button" onClick={() => addItem('highlights')} className="text-[#E8651A] text-sm flex items-center gap-1"><Plus size={14} /> Add Highlight</button>
        </div>

        {/* Inclusions */}
        {['inclusions', 'exclusions', 'things_to_carry'].map(key => (
          <div key={key} className="bg-white rounded-xl p-6 shadow-sm space-y-3">
            <h2 className="font-bold text-[#1a1a2e] border-b pb-2 capitalize">{key.replace('_', ' ')}</h2>
            {form[key].map((item, i) => (
              <div key={i} className="flex gap-2"><input value={item} onChange={e => setArr(key, i, e.target.value)} placeholder={`Item ${i+1}`} className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /><button type="button" onClick={() => removeItem(key, i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button></div>
            ))}
            <button type="button" onClick={() => addItem(key)} className="text-[#E8651A] text-sm flex items-center gap-1"><Plus size={14} /> Add Item</button>
          </div>
        ))}

        {/* Itinerary */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-[#1a1a2e] border-b pb-2">Itinerary</h2>
          {itinerary.map((day, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-[#E8651A]">Day {day.day}</span>
                <button type="button" onClick={() => removeItineraryDay(i)} className="p-1 text-red-400 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
              </div>
              <input value={day.title} onChange={e => setItineraryField(i, 'title', e.target.value)} placeholder="Day title" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" />
              <textarea rows={3} value={day.description} onChange={e => setItineraryField(i, 'description', e.target.value)} placeholder="Day description..." className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A] resize-none" />
            </div>
          ))}
          <button type="button" onClick={addItineraryDay} className="text-[#E8651A] text-sm flex items-center gap-1"><Plus size={14} /> Add Day</button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button type="button" onClick={() => router.push('/admin/packages')} className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={saving} className="bg-[#E8651A] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-60">{saving ? 'Saving...' : 'Create Package'}</button>
        </div>
      </form>
    </div>
  );
}
