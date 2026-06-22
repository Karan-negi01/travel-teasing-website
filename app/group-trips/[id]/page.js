'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Users, MessageCircle } from 'lucide-react';

const vibeBg = { Chill: 'bg-blue-100 text-blue-700', Adventure: 'bg-orange-100 text-orange-700', Cultural: 'bg-purple-100 text-purple-700', Spiritual: 'bg-yellow-100 text-yellow-700' };

export default function GroupTripDetailPage({ params }) {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/group-trips/${params.id}`).then(r => r.json()).then(d => { setTrip(d.trip); setLoading(false); }).catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="h-screen flex items-center justify-center pt-20"><div className="animate-spin w-10 h-10 border-4 border-[#E8651A] border-t-transparent rounded-full" /></div>;
  if (!trip) return <div className="h-screen flex items-center justify-center pt-20 text-gray-500">Group trip not found.</div>;

  const filled = trip.filled_spots || 1;
  const total = trip.total_spots;
  const pct = Math.round((filled / total) * 100);
  const pkg = trip.packages;

  const waMessage = encodeURIComponent(`Hi! I'm interested in the trip: ${trip.package_title}. Please share more details.`);

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

            {pkg && (
              <Link href={`/packages/${pkg.slug || trip.package_slug}`} className="text-[#E8651A] text-sm font-semibold hover:underline">
                View full package details →
              </Link>
            )}
          </div>

          {/* Book via WhatsApp */}
          <div>
            <div className="card p-6 lg:sticky lg:top-24">
              <p className="text-[#E8651A] text-3xl font-bold mb-1">₹{trip.price_per_person?.toLocaleString('en-IN')}<span className="text-base text-gray-500 font-normal">/person</span></p>
              <p className="text-gray-400 text-sm mb-6">Total trip cost: ₹{trip.total_price?.toLocaleString('en-IN')}</p>

              <a
                href={`https://wa.me/916396464369?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-3.5 rounded-xl hover:bg-[#1ebe5d] transition-colors text-sm"
              >
                <MessageCircle size={18} />
                Book on WhatsApp
              </a>
              <p className="text-gray-400 text-xs text-center mt-3">We'll get back to you within 1 hour</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
