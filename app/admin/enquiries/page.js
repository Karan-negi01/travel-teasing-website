'use client';
import { useState, useEffect } from 'react';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  async function load() {
    const res = await fetch('/api/enquiries');
    const data = await res.json();
    setEnquiries(data.enquiries || []);
    setLoading(false);
  }

  async function updateStatus(id, status) {
    await fetch(`/api/admin/enquiries/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    load();
  }

  useEffect(() => { load(); }, []);

  const statusColors = { new: 'bg-green-100 text-green-700', contacted: 'bg-blue-100 text-blue-700', closed: 'bg-gray-100 text-gray-500' };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1a1a2e] mb-6">Enquiries</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b"><tr>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Name / Phone</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Type</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={4} className="py-8 text-center text-gray-400">Loading...</td></tr> : enquiries.map(e => (
                <tr key={e.id} onClick={() => setSelected(e)} className={`border-b border-gray-50 hover:bg-orange-50 cursor-pointer transition-colors ${selected?.id === e.id ? 'bg-orange-50' : ''}`}>
                  <td className="py-3 px-4">
                    <p className="font-medium">{e.name}</p>
                    <p className="text-gray-400 text-xs">{e.phone}</p>
                  </td>
                  <td className="py-3 px-4"><span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full capitalize">{e.enquiry_type}</span></td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{new Date(e.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                  <td className="py-3 px-4">
                    <select value={e.status} onChange={ev => { ev.stopPropagation(); updateStatus(e.id, ev.target.value); }} onClick={ev => ev.stopPropagation()} className={`text-xs px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${statusColors[e.status] || 'bg-gray-100 text-gray-600'}`}>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[#1a1a2e]">Enquiry Details</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            {[
              { label: 'Name', value: selected.name },
              { label: 'Phone', value: selected.phone },
              { label: 'Email', value: selected.email },
              { label: 'Type', value: selected.enquiry_type },
              { label: 'Package', value: selected.package_title },
              { label: 'Destination', value: selected.destination },
              { label: 'Travel Dates', value: selected.travel_dates },
              { label: 'Group Size', value: selected.group_size },
              { label: 'Date', value: new Date(selected.created_at).toLocaleString('en-IN') },
            ].map(item => item.value ? (
              <div key={item.label}>
                <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                <p className="text-sm font-medium text-[#1a1a2e]">{item.value}</p>
              </div>
            ) : null)}
            {selected.message && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Message</p>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{selected.message}</p>
              </div>
            )}
            <a href={`https://wa.me/${selected.phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="block text-center bg-[#25D366] text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-500">
              Reply on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
