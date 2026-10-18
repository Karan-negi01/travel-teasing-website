'use client';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Users } from 'lucide-react';
import Avatar from './Avatar';
import { getDestImage } from './PackageCard';
import { CT, TRIP_STATUS, GENDER_RULES, fmtRange, tripTitle, approvedCount } from '@/lib/communityTrips';

// Mirrors PackageCard: tall image with rounded corners, Poppins text panel, black "Details" pill.
export default function CommunityTripCard({ trip, badge, footer }) {
  const pkg = trip.packages || {};
  const approved = trip.approved_count ?? approvedCount(trip);
  const total = trip.total_spots || 1;
  const left = Math.max(0, total - approved);
  const pct = Math.min(100, Math.round((approved / total) * 100));
  const st = TRIP_STATUS[trip.status] || TRIP_STATUS.open;
  const rule = GENDER_RULES.find(g => g.value === trip.gender_rule);
  const href = `${CT.base}/${trip.share_code || trip.id}`;
  const meta = [rule && rule.value !== 'any' ? rule.short : null, trip.age_min || trip.age_max ? `${trip.age_min || '18'}${trip.age_max ? `–${trip.age_max}` : '+'} yrs` : null, ...(trip.vibe_tags || []).slice(0, 2)].filter(Boolean);

  return (
    <div className="group relative overflow-hidden rounded-2xl font-sans text-sm flex flex-col h-full" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* IMAGE */}
      <Link href={href} className="relative block overflow-hidden rounded-2xl h-64 md:h-72 w-full">
        <Image src={pkg.cover_image || getDestImage(pkg)} alt={tripTitle(trip)} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 400px" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0d0d0d]">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: trip.status === 'open' ? '#5bc1d5' : trip.status === 'confirmed' ? '#4ade80' : '#fbbf24' }} />{st.label}
        </span>
        {badge && <span className="absolute top-3 right-3 rounded-full bg-black/55 backdrop-blur px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white">{badge}</span>}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-white">
          <Avatar src={trip.creator?.profile_photo} name={trip.creator?.full_name} size={26} ring />
          <span className="text-[12px] text-white/90">Hosted by <b className="font-semibold text-white">{(trip.creator?.full_name || 'Traveller').split(' ')[0]}</b></span>
        </div>
      </Link>

      {/* TEXT PANEL */}
      <div className="flex flex-col gap-3 py-3 flex-1">
        <h2 className="line-clamp-2 text-base font-medium leading-6 text-gray-900" style={{ minHeight: 48 }}>{tripTitle(trip)}</h2>

        <div className="flex items-center justify-between -ml-0.5">
          <span className="inline-flex items-center gap-1 text-[14px] text-gray-600"><MapPin size={14} className="text-[#1a1a1a]" /> {pkg.location}{pkg.state ? `, ${pkg.state}` : ''}</span>
          <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[#1a1a1a]"><Calendar size={14} className="text-[#1a1a1a]" /> {fmtRange(trip.start_date, trip.end_date)}</span>
        </div>

        {meta.length > 0 && <p className="text-[12px] text-gray-500 tracking-wide">{meta.join('  ·  ')}</p>}

        <div>
          <div className="flex justify-between text-[12px] text-gray-500 mb-1.5">
            <span className="inline-flex items-center gap-1"><Users size={12} /> {approved} of {total} travellers</span>
            <span className="font-medium text-[#1a1a1a]">{left === 0 ? 'Full' : `${left} left`}</span>
          </div>
          <div className="w-full h-[3px] rounded-full bg-gray-200 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#5bc1d5' }} /></div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-1">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-[#1a1a1a]">{trip.price_per_person ? `₹${Number(trip.price_per_person).toLocaleString('en-IN')}` : 'On request'}</span>
            </div>
            <p className="text-[12px] text-gray-400">per person, from</p>
          </div>
          <Link href={href} className="flex flex-row items-center gap-1 rounded-full border-2 border-[#1a1a1a] bg-[#1a1a1a] p-2 pr-3 text-white transition-all duration-500 hover:bg-[#333]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            <span className="text-[14px]">Details</span>
          </Link>
        </div>
        {footer}
      </div>
    </div>
  );
}
