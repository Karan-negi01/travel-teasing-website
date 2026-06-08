'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    client.from('user_profiles')
      .select('*, user_trips(count)')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setUsers(data || []); setLoading(false); });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1a1a2e] mb-6">Users</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b"><tr>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Name</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">City</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Phone</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Trips</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Joined</th>
          </tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="py-8 text-center text-gray-400">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-gray-400">No users yet.</td></tr>
            ) : users.map(u => (
              <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <p className="font-medium text-[#1a1a2e]">{u.full_name || '—'}</p>
                  {u.is_verified && <span className="text-xs text-blue-600">✓ Verified</span>}
                </td>
                <td className="py-3 px-4 text-gray-500">{u.city || '—'}</td>
                <td className="py-3 px-4 text-gray-500">{u.phone || '—'}</td>
                <td className="py-3 px-4 text-gray-500">{u.user_trips?.[0]?.count || 0}</td>
                <td className="py-3 px-4 text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
