'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import { Plus, Edit, Eye, EyeOff } from 'lucide-react';

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadPackages() {
    const res = await fetch('/api/admin/packages');
    const data = await res.json();
    setPackages(data.packages || []);
    setLoading(false);
  }

  async function toggleActive(id, current) {
    await fetch(`/api/admin/packages/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active: !current }) });
    loadPackages();
  }

  useEffect(() => { loadPackages(); }, []);

  const catBg = { group: 'bg-orange-100 text-orange-700', family: 'bg-green-100 text-green-700', sacred: 'bg-yellow-100 text-yellow-700', adventure: 'bg-blue-100 text-blue-700', corporate: 'bg-purple-100 text-purple-700' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Packages</h1>
        <Link href="/admin/packages/new" className="bg-[#E8651A] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-orange-600"><Plus size={16} /> New Package</Link>
      </div>

      {loading ? <div className="bg-white rounded-xl p-8 text-center text-gray-400">Loading...</div> : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr><th className="text-left py-3 px-4 text-gray-500 font-medium">Package</th><th className="text-left py-3 px-4 text-gray-500 font-medium">Category</th><th className="text-left py-3 px-4 text-gray-500 font-medium">Duration</th><th className="text-left py-3 px-4 text-gray-500 font-medium">Price</th><th className="text-left py-3 px-4 text-gray-500 font-medium">Featured</th><th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th><th className="text-left py-3 px-4 text-gray-500 font-medium">Actions</th></tr></thead>
            <tbody>
              {packages.map(pkg => (
                <tr key={pkg.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-[#1a1a2e] line-clamp-1">{pkg.title}</p>
                    <p className="text-gray-400 text-xs">{pkg.location}, {pkg.state}</p>
                  </td>
                  <td className="py-3 px-4"><span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${catBg[pkg.category] || 'bg-gray-100 text-gray-600'}`}>{pkg.category}</span></td>
                  <td className="py-3 px-4 text-gray-500">{pkg.duration_days}D/{pkg.duration_nights}N</td>
                  <td className="py-3 px-4 text-[#E8651A] font-medium">₹{pkg.price_per_person?.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4">{pkg.is_featured ? '⭐' : '—'}</td>
                  <td className="py-3 px-4"><span className={`text-xs px-2 py-0.5 rounded-full ${pkg.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{pkg.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/packages/${pkg.id}/edit`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={15} /></Link>
                      <button onClick={() => toggleActive(pkg.id, pkg.is_active)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg">{pkg.is_active ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
