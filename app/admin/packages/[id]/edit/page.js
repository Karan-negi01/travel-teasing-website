'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';

export default function EditPackagePage({ params }) {
  const router = useRouter();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/packages/${params.id}`).then(r => r.json()).then(d => {
      if (d.package) {
        const p = d.package;
        p.highlights = p.highlights?.length ? p.highlights : [''];
        p.inclusions = p.inclusions?.length ? p.inclusions : [''];
        p.exclusions = p.exclusions?.length ? p.exclusions : [''];
        p.things_to_carry = p.things_to_carry?.length ? p.things_to_carry : [''];
        setPkg(p);
      }
      setLoading(false);
    });
  }, [params.id]);

  function setField(k, v) { setPkg(p => ({...p, [k]: v})); }
  function setArr(k, i, v) { setPkg(p => ({ ...p, [k]: p[k].map((x, idx) => idx === i ? v : x) })); }
  function addItem(k) { setPkg(p => ({ ...p, [k]: [...p[k], ''] })); }
  function removeItem(k, i) { setPkg(p => ({ ...p, [k]: p[k].filter((_, idx) => idx !== i) })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setError('');
    const res = await fetch(`/api/admin/packages/${params.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pkg) });
    const data = await res.json();
    if (data.success) router.push('/admin/packages');
    else { setError(data.error); setSaving(false); }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-[#E8651A] border-t-transparent rounded-full" /></div>;
  if (!pkg) return <div className="text-gray-400">Package not found.</div>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-[#1a1a2e] mb-6">Edit: {pkg.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-[#1a1a2e] border-b pb-2">Basic Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Title</label><input value={pkg.title || ''} onChange={e => setField('title', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Price/Person ₹</label><input type="number" value={pkg.price_per_person || 0} onChange={e => setField('price_per_person', parseInt(e.target.value))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Cover Image URL</label><input value={pkg.cover_image || ''} onChange={e => setField('cover_image', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Best Time</label><input value={pkg.best_time_to_visit || ''} onChange={e => setField('best_time_to_visit', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
          </div>
          <div><label className="text-sm font-medium text-gray-700 block mb-1">Description</label><textarea rows={4} value={pkg.description || ''} onChange={e => setField('description', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A] resize-none" /></div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={pkg.is_featured || false} onChange={e => setField('is_featured', e.target.checked)} className="accent-[#E8651A]" /><span className="text-sm">Featured</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={pkg.is_active !== false} onChange={e => setField('is_active', e.target.checked)} className="accent-[#E8651A]" /><span className="text-sm">Active</span></label>
          </div>
        </div>

        {['highlights', 'inclusions', 'exclusions', 'things_to_carry'].map(key => (
          <div key={key} className="bg-white rounded-xl p-6 shadow-sm space-y-3">
            <h2 className="font-bold text-[#1a1a2e] border-b pb-2 capitalize">{key.replace(/_/g, ' ')}</h2>
            {(pkg[key] || []).map((item, i) => (
              <div key={i} className="flex gap-2"><input value={item} onChange={e => setArr(key, i, e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /><button type="button" onClick={() => removeItem(key, i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button></div>
            ))}
            <button type="button" onClick={() => addItem(key)} className="text-[#E8651A] text-sm flex items-center gap-1"><Plus size={14} /> Add</button>
          </div>
        ))}

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button type="button" onClick={() => router.push('/admin/packages')} className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={saving} className="bg-[#E8651A] text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-60">{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
}
