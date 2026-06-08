'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Users, CheckCircle } from 'lucide-react';

const vibeBg = { Chill: 'bg-blue-100 text-blue-700', Adventure: 'bg-orange-100 text-orange-700', Cultural: 'bg-purple-100 text-purple-700', Spiritual: 'bg-yellow-100 text-yellow-700' };

export default function GroupTripDetailPage({ params }) {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/group-trips/${params.id}`).then(r => r.json()).then(d => { setTrip(d.trip); setLoading(false); }).catch(() => setLoading(false));
  }, [params.id]);

  async function handleJoin(e) {
    e.preventDefault();
    if (!form.name || !form.phone) { setError('Name and phone are required.'); return; }
    setSubmitting(true); setError('');
    const res = await fetch(`/api/group-trips/${params.id}/join`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (data.success) setSuccess(true);
    else setError(data.error || 'Something went wrong.');
    setSubmitting(false);
  }

  if (loading) return <div className="h-screen flex items-center justify-center pt-20"><div className="animate-spin w-10 h-10 border-4 border-[#E8651A] border-t-transparent rounded-full" /></div>;
  if (!trip) return <div className="h-screen flex items-center justify-center pt-20 text-gray-500">Group trip not found.</div>;

  const filled = trip.filled_spots || 1;
  const total = trip.total_spots;
  const pct = Math.round((filled / total) * 100);
  const pkg = trip.packages;

  return (
    <div className="pt-20">
      <div className="container-max py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {pkg?.cover_image && (
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
                <Image src={pkg.cover_image} alt={trip.package_title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 65vw" />
              </div>
            )}
            <h1 className="text-3xl font-bold text-[#1a1a2e] mb-4">{trip.package_title}</h1>

            <div className="flex flex-wrap gap-3 mb-6">
              <span className="flex items-center gap-1 text-gray-500 text-sm"><MapPin size={14} />{pkg?.location}, {pkg?.state}</span>
              <span className="flex items-center gap-1 text-gray-500 text-sm"><Calendar size={14} />
                {trip.trip_dates_from ? new Date(trip.trip_dates_from).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBD'}
                {' — '}
                {trip.trip_dates_to ? new Date(trip.trip_dates_to).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
              </span>
              {trip.departure_city && <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">From {trip.departure_city}</span>}
            </div>

            {trip.vibe_tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {trip.vibe_tags.map(tag => <span key={tag} className={`text-sm px-3 py-1 rounded-full font-medium ${vibeBg[tag] || 'bg-gray-100 text-gray-600'}`}>{tag}</span>)}
              </div>
            )}

            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span className="flex items-center gap-1"><Users size={16} /> {filled} / {total} spots filled</span>
                <span className="font-semibold text-[#E8651A]">{total - filled} spots remaining</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-[#E8651A] h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 mb-6">
              <p className="text-gray-600 text-sm">
                <span className="font-semibold text-[#E8651A]">{trip.creator_name?.split(' ')[0]}</span> is organizing this trip.
                Join now to secure your spot!
              </p>
            </div>

            {pkg && (
              <Link href={`/packages/${pkg.slug || trip.package_slug}`} className="text-[#E8651A] text-sm font-semibold hover:underline">
                View full package details →
              </Link>
            )}
          </div>

          {/* Join form */}
          <div>
            <div className="card p-6 lg:sticky lg:top-24">
              <p className="text-[#E8651A] text-3xl font-bold mb-1">₹{trip.price_per_person?.toLocaleString('en-IN')}<span className="text-base text-gray-500 font-normal">/person</span></p>
              <p className="text-gray-400 text-sm mb-5">Total trip cost: ₹{trip.total_price?.toLocaleString('en-IN')}</p>

              {success ? (
                <div className="text-center py-6">
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                  <h4 className="font-bold text-[#1a1a2e] mb-2">Request Sent!</h4>
                  <p className="text-gray-500 text-sm">We'll connect you with the group organizer shortly via WhatsApp.</p>
                </div>
              ) : (
                <form onSubmit={handleJoin} className="space-y-4">
                  <h3 className="font-bold text-[#1a1a2e]">Join This Trip</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input required value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea rows={3} value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A] resize-none" placeholder="Tell the organizer about yourself..." />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button type="submit" disabled={submitting} className="w-full btn-primary justify-center">{submitting ? 'Sending...' : 'Request to Join'}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
