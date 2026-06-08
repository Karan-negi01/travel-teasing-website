'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ image_url: '', caption: '', location: '', category: '' });
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const res = await fetch('/api/gallery');
    const data = await res.json();
    setImages(data.images || []);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch('/api/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, sort_order: images.length + 1 }) });
    setShowForm(false);
    setForm({ image_url: '', caption: '', location: '', category: '' });
    load();
  }

  async function deleteImage(id) {
    const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    await client.from('gallery').delete().eq('id', id);
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Gallery</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#E8651A] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"><Plus size={16} /> Add Image</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="text-sm font-medium text-gray-700 block mb-1">Image URL *</label><input required value={form.image_url} onChange={e => setForm(f => ({...f, image_url: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="https://images.unsplash.com/..." /></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Caption</label><input value={form.caption} onChange={e => setForm(f => ({...f, caption: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Location</label><input value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600">Cancel</button>
            <button type="submit" className="bg-[#E8651A] text-white px-4 py-2 rounded-lg text-sm font-semibold">Add Image</button>
          </div>
        </form>
      )}

      {loading ? <div className="text-gray-400">Loading...</div> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="relative aspect-square">
                <Image src={img.image_url} alt={img.caption || ''} fill className="object-cover" sizes="250px" />
                <button onClick={() => deleteImage(img.id)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-[#1a1a2e] line-clamp-1">{img.caption || '—'}</p>
                <p className="text-xs text-gray-400">{img.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
