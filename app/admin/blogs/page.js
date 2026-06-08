'use client';
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ slug: '', title: '', excerpt: '', content: '', cover_image: '', category: 'travel-tips', is_published: false });

  async function load() {
    const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const { data } = await client.from('blogs').select('id,slug,title,category,is_published,created_at').order('created_at', { ascending: false });
    setBlogs(data || []);
    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form };
    if (payload.is_published && !payload.published_at) payload.published_at = new Date().toISOString();
    await fetch('/api/blogs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setShowForm(false);
    setForm({ slug: '', title: '', excerpt: '', content: '', cover_image: '', category: 'travel-tips', is_published: false });
    load();
  }

  async function togglePublish(slug, current) {
    await fetch(`/api/blogs/${slug}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_published: !current, published_at: !current ? new Date().toISOString() : null }) });
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Blogs</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-[#E8651A] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"><Plus size={16} /> New Post</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Title *</label><input required value={form.title} onChange={e => { setForm(f => ({...f, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})); }} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Slug *</label><input required value={form.slug} onChange={e => setForm(f => ({...f, slug: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Category</label><select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]"><option value="travel-tips">Travel Tips</option><option value="destination-guide">Destination Guide</option><option value="trek-report">Trek Report</option><option value="spiritual">Spiritual</option><option value="food-culture">Food & Culture</option></select></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Cover Image URL</label><input value={form.cover_image} onChange={e => setForm(f => ({...f, cover_image: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" /></div>
          </div>
          <div><label className="text-sm font-medium text-gray-700 block mb-1">Excerpt</label><textarea rows={2} value={form.excerpt} onChange={e => setForm(f => ({...f, excerpt: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A] resize-none" /></div>
          <div><label className="text-sm font-medium text-gray-700 block mb-1">Content (Markdown)</label><textarea rows={8} value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A] resize-none font-mono" /></div>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_published} onChange={e => setForm(f => ({...f, is_published: e.target.checked}))} className="accent-[#E8651A]" /><span className="text-sm">Publish immediately</span></label>
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600">Cancel</button>
            <button type="submit" className="bg-[#E8651A] text-white px-4 py-2 rounded-lg text-sm font-semibold">Save Post</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b"><tr><th className="text-left py-3 px-4 text-gray-500 font-medium">Title</th><th className="text-left py-3 px-4 text-gray-500 font-medium">Category</th><th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th><th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={4} className="py-8 text-center text-gray-400">Loading...</td></tr> : blogs.map(b => (
              <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-[#1a1a2e]">{b.title}</td>
                <td className="py-3 px-4 text-gray-500 capitalize text-xs">{b.category?.replace('-', ' ')}</td>
                <td className="py-3 px-4 text-gray-400 text-xs">{new Date(b.created_at).toLocaleDateString('en-IN')}</td>
                <td className="py-3 px-4">
                  <button onClick={() => togglePublish(b.slug, b.is_published)} className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${b.is_published ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {b.is_published ? 'Published' : 'Draft'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
