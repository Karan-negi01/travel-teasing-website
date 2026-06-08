'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminGroupTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/group-trips').then(r => r.json()).then(d => { setTrips(d.trips || []); setLoading(false); });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1a1a2e] mb-6">Group Trips</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b"><tr>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Package</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Organizer</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Dates</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Spots</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="py-8 text-center text-gray-400">Loading...</td></tr> : trips.map(t => (
              <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-[#1a1a2e]">{t.package_title}</td>
                <td className="py-3 px-4">
                  <p className="text-gray-700">{t.creator_name}</p>
                  <p className="text-gray-400 text-xs">{t.creator_phone}</p>
                </td>
                <td className="py-3 px-4 text-gray-500 text-xs">
                  {t.trip_dates_from ? new Date(t.trip_dates_from).toLocaleDateString('en-IN') : 'TBD'} — {t.trip_dates_to ? new Date(t.trip_dates_to).toLocaleDateString('en-IN') : ''}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5"><div className="bg-[#E8651A] h-1.5 rounded-full" style={{ width: `${(t.filled_spots/t.total_spots)*100}%` }} /></div>
                    <span className="text-xs text-gray-500">{t.filled_spots}/{t.total_spots}</span>
                  </div>
                </td>
                <td className="py-3 px-4"><span className={`text-xs px-2 py-0.5 rounded-full ${t.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{t.status}</span></td>
                <td className="py-3 px-4">
                  <Link href={`/group-trips/${t.id}`} className="text-[#E8651A] text-xs hover:underline">View →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
