'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { CT, TRIP_STATUS, fmtRange, tripTitle } from '@/lib/communityTrips';

const STATUSES = ['open', 'full', 'confirmed', 'completed', 'cancelled'];

async function api(url, opts = {}) {
  const res = await fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) }, body: opts.body ? JSON.stringify(opts.body) : undefined });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Request failed');
  return json;
}

function TripRow({ trip, onChanged }) {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const approved = (trip.community_trip_members || []).filter(m => m.status === 'approved').length;
  const pending = (trip.community_trip_members || []).filter(m => m.status === 'requested').length;
  const st = TRIP_STATUS[trip.status] || TRIP_STATUS.open;

  const loadDetail = useCallback(async () => { try { setDetail(await api(`/api/admin/community-trips/${trip.id}`)); } catch (e) { setErr(e.message); } }, [trip.id]);
  useEffect(() => { if (open && !detail) loadDetail(); }, [open, detail, loadDetail]);

  const act = async (key, body) => {
    setBusy(key); setErr('');
    try { await api(`/api/admin/community-trips/${trip.id}`, { method: 'PATCH', body }); await loadDetail(); await onChanged(); }
    catch (e) { setErr(e.message); } finally { setBusy(''); }
  };

  return (
    <>
      <tr className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer" onClick={() => setOpen(o => !o)}>
        <td className="py-3 px-4">
          <p className="font-medium text-[#1a1a2e]">{tripTitle(trip)}</p>
          <p className="text-xs text-gray-400">{trip.packages?.title} · {trip.packages?.location}</p>
        </td>
        <td className="py-3 px-4"><p className="text-gray-700">{trip.creator?.full_name}</p><p className="text-gray-400 text-xs">{trip.creator?.city}</p></td>
        <td className="py-3 px-4 text-gray-500 text-xs">{fmtRange(trip.start_date, trip.end_date)}</td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-200 rounded-full h-1.5"><div className="bg-[#5bc1d5] h-1.5 rounded-full" style={{ width: `${Math.min(100, (approved / trip.total_spots) * 100)}%` }} /></div>
            <span className="text-xs text-gray-500">{approved}/{trip.total_spots}</span>
            {pending > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">{pending} pending</span>}
          </div>
        </td>
        <td className="py-3 px-4"><span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: st.bg, color: st.fg }}>{st.label}</span></td>
        <td className="py-3 px-4 text-right">{open ? <ChevronUp size={16} className="inline text-gray-400" /> : <ChevronDown size={16} className="inline text-gray-400" />}</td>
      </tr>
      {open && (
        <tr className="border-b border-gray-100 bg-[#fafbfc]">
          <td colSpan={6} className="px-4 py-4">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <label className="text-xs text-gray-500">Trip status</label>
              <select value={trip.status} disabled={!!busy} onChange={e => act('status', { status: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white">
                {STATUSES.map(s => <option key={s} value={s}>{TRIP_STATUS[s].label}</option>)}
              </select>
              <Link href={`${CT.base}/${trip.share_code}`} target="_blank" className="text-xs text-[#1f77a3] font-semibold inline-flex items-center gap-1 hover:underline">Open trip page <ExternalLink size={12} /></Link>
              <span className="text-xs text-gray-400">Rules: {trip.gender_rule === 'any' ? 'mixed' : trip.gender_rule} · age {trip.age_min || '—'}–{trip.age_max || '—'} · {trip.vibe_tags?.join(', ') || 'no vibe tags'}</span>
            </div>
            {err && <p className="text-xs text-red-600 mb-3">{err}</p>}
            {!detail ? <p className="text-xs text-gray-400">Loading members…</p> : (
              <table className="w-full text-xs bg-white rounded-lg overflow-hidden border border-gray-100">
                <thead className="bg-gray-50"><tr><th className="text-left py-2 px-3 text-gray-500 font-medium">Traveller</th><th className="text-left py-2 px-3 text-gray-500 font-medium">Phone</th><th className="text-left py-2 px-3 text-gray-500 font-medium">Role</th><th className="text-left py-2 px-3 text-gray-500 font-medium">Membership</th><th className="text-left py-2 px-3 text-gray-500 font-medium">Payment</th></tr></thead>
                <tbody>
                  {detail.members.map(m => (
                    <tr key={m.user_id} className="border-t border-gray-50">
                      <td className="py-2 px-3"><Link href={`/profile/${m.user_id}`} target="_blank" className="text-[#1a1a2e] font-medium hover:underline">{m.profile?.full_name || '—'}</Link><span className="text-gray-400 ml-1">{m.profile?.age ? `${m.profile.age} · ` : ''}{m.profile?.city || ''}</span></td>
                      <td className="py-2 px-3 text-gray-600">{m.phone || '—'}</td>
                      <td className="py-2 px-3 capitalize text-gray-600">{m.role}</td>
                      <td className="py-2 px-3 capitalize text-gray-600">{m.status}</td>
                      <td className="py-2 px-3">
                        {m.status === 'approved' ? (
                          <select value={m.payment_status} disabled={!!busy} onChange={e => act(m.user_id, { member_user_id: m.user_id, payment_status: e.target.value })} className={`border rounded-md px-2 py-1 text-xs ${m.payment_status === 'paid' ? 'bg-green-50 border-green-200 text-green-700' : m.payment_status === 'refunded' ? 'bg-gray-50 border-gray-200' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                            <option value="pending">Pending</option><option value="paid">Paid</option><option value="refunded">Refunded</option>
                          </select>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <p className="text-[11px] text-gray-400 mt-2">When every approved member is marked Paid, the trip flips to Confirmed automatically. Marking a trip Completed creates a gallery album for every member.</p>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminCommunityTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');
  const load = useCallback(async () => { try { const d = await api('/api/admin/community-trips'); setTrips(d.trips || []); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);

  const shown = trips.filter(t => filter === 'all' ? true : filter === 'active' ? ['open', 'full', 'confirmed'].includes(t.status) : t.status === filter);
  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: trips.filter(t => t.status === s).length }), {});

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div><h1 className="text-2xl font-bold text-[#1a1a2e]">{CT.label}</h1><p className="text-sm text-gray-500">Trips created by travellers on FIT packages. Collect payment on WhatsApp and mark it here.</p></div>
        <div className="flex gap-1 bg-white border border-gray-100 rounded-full p-1 text-xs">
          {[['active', 'Active'], ['open', `Open (${counts.open})`], ['full', `Full (${counts.full})`], ['confirmed', `Confirmed (${counts.confirmed})`], ['completed', 'Completed'], ['cancelled', 'Cancelled'], ['all', 'All']].map(([id, label]) => (
            <button key={id} onClick={() => setFilter(id)} className={`px-3 py-1.5 rounded-full font-semibold ${filter === id ? 'bg-[#1a1a2e] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>{label}</button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[820px]">
          <thead className="bg-gray-50 border-b"><tr>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Trip</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Host</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Dates</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Travellers</th>
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
            <th className="py-3 px-4" />
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="py-8 text-center text-gray-400">Loading…</td></tr>
              : shown.length === 0 ? <tr><td colSpan={6} className="py-8 text-center text-gray-400">No trips here yet.</td></tr>
              : shown.map(t => <TripRow key={t.id} trip={t} onChanged={load} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
