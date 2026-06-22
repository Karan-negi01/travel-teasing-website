'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ packages: 0, enquiries: 0, users: 0 });
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/packages').then(r => r.json()),
      fetch('/api/enquiries').then(r => r.json()),
    ]).then(([pkgs, enq]) => {
      setStats({ packages: pkgs.packages?.length || 0, enquiries: (enq.enquiries || []).filter(e => e.status === 'new').length, users: 0 });
      setEnquiries((enq.enquiries || []).slice(0, 5));
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-[#E8651A] border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1a1a2e] mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Packages', value: stats.packages, href: '/admin/packages', color: 'bg-blue-500' },
          { label: 'New Enquiries', value: stats.enquiries, href: '/admin/enquiries', color: 'bg-orange-500' },
          { label: 'Total Users', value: stats.users, href: '/admin/users', color: 'bg-purple-500' },
        ].map(s => (
          <Link key={s.label} href={s.href} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className={`w-10 h-10 ${s.color} rounded-lg mb-3`} />
            <p className="text-2xl font-bold text-[#1a1a2e]">{s.value}</p>
            <p className="text-gray-500 text-sm">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#1a1a2e]">Recent Enquiries</h2>
          <Link href="/admin/enquiries" className="text-[#E8651A] text-sm hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100"><th className="text-left py-2 pr-4 text-gray-500 font-medium">Name</th><th className="text-left py-2 pr-4 text-gray-500 font-medium">Phone</th><th className="text-left py-2 pr-4 text-gray-500 font-medium">Type</th><th className="text-left py-2 pr-4 text-gray-500 font-medium">Status</th><th className="text-left py-2 text-gray-500 font-medium">Date</th></tr></thead>
            <tbody>
              {enquiries.map(e => (
                <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 pr-4 font-medium">{e.name}</td>
                  <td className="py-3 pr-4 text-gray-500">{e.phone}</td>
                  <td className="py-3 pr-4"><span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full capitalize">{e.enquiry_type}</span></td>
                  <td className="py-3 pr-4"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${e.status === 'new' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{e.status}</span></td>
                  <td className="py-3 text-gray-400 text-xs">{new Date(e.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
