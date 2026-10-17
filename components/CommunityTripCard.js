'use client';
import Link from 'next/link';
import { MapPin, Calendar, Users, ShieldCheck } from 'lucide-react';
import Avatar from './Avatar';
import { CT, TRIP_STATUS, GENDER_RULES, fmtRange, tripTitle, approvedCount } from '@/lib/communityTrips';

const FALLBACK = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80';

export default function CommunityTripCard({ trip, badge, footer }) {
  const pkg = trip.packages || {};
  const approved = trip.approved_count ?? approvedCount(trip);
  const total = trip.total_spots || 1;
  const left = Math.max(0, total - approved);
  const pct = Math.min(100, Math.round((approved / total) * 100));
  const st = TRIP_STATUS[trip.status] || TRIP_STATUS.open;
  const rule = GENDER_RULES.find(g => g.value === trip.gender_rule);
  const href = `${CT.base}/${trip.share_code || trip.id}`;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pkg.cover_image || FALLBACK} alt={tripTitle(trip)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute top-3 left-3 text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full" style={{ background: st.bg, color: st.fg }}>{st.label}</span>
        {badge && <span className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/90 text-[#1a1a2e]">{badge}</span>}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="font-bold text-lg leading-tight drop-shadow-sm line-clamp-2">{tripTitle(trip)}</p>
          <p className="text-xs text-white/85 flex items-center gap-1 mt-1"><MapPin size={12} /> {pkg.location}{pkg.state ? `, ${pkg.state}` : ''}</p>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="flex items-center gap-1.5"><Calendar size={13} className="text-[#1f77a3]" /> {fmtRange(trip.start_date, trip.end_date)}</span>
          {trip.departure_city && <span className="bg-gray-100 px-2 py-0.5 rounded-full">From {trip.departure_city}</span>}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {rule && rule.value !== 'any' && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-pink-50 text-pink-700">{rule.short}</span>}
          {(trip.age_min || trip.age_max) && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">Age {trip.age_min || '18'}{trip.age_max ? `–${trip.age_max}` : '+'}</span>}
          {(trip.vibe_tags || []).slice(0, 3).map(v => <span key={v} className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: '#e0f4f8', color: '#1f77a3' }}>{v}</span>)}
        </div>

        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span className="flex items-center gap-1"><Users size={12} /> {approved} / {total} travellers</span>
            <span className={left === 0 ? 'text-amber-700 font-semibold' : 'text-[#1f77a3] font-semibold'}>{left === 0 ? 'Full' : `${left} spot${left === 1 ? '' : 's'} left`}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#5bc1d5,#1f77a3)' }} />
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-1">
          <Link href={`/profile/${trip.creator_id}`} className="flex items-center gap-2 min-w-0">
            <Avatar src={trip.creator?.profile_photo} name={trip.creator?.full_name} size={28} />
            <span className="text-xs text-gray-600 truncate">by <b className="text-[#1a1a2e]">{(trip.creator?.full_name || 'Traveller').split(' ')[0]}</b>{trip.creator?.is_verified && <ShieldCheck size={12} className="inline ml-1 text-blue-500" />}</span>
          </Link>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 leading-none">from</p>
            <p className="text-sm font-bold text-[#1a1a2e]">{trip.price_per_person ? `₹${Number(trip.price_per_person).toLocaleString('en-IN')}` : 'On request'}</p>
          </div>
        </div>
        {footer}
      </div>
    </div>
  );
}
