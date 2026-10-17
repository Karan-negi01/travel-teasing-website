'use client';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plus, Search, Compass, Users, ShieldCheck, X } from 'lucide-react';
import CommunityTripCard from '@/components/CommunityTripCard';
import { CT, VIBES, GENDER_RULES } from '@/lib/communityTrips';
import { useSession, loginHref } from '@/lib/useSession';

const STEPS = [
  { icon: Compass,     title: 'Pick an FIT package',   text: 'Any personalised package can become a trip. Dates are yours to choose.' },
  { icon: ShieldCheck, title: 'Set your rules',        text: 'Group size, vibe, women-only or mixed, age range. Your trip, your call.' },
  { icon: Users,       title: 'Approve your crew',     text: 'Travellers request to join. You see their profile and past trips before saying yes.' },
];

function ListingContent() {
  const sp = useSearchParams();
  const pkgSlug = sp.get('package') || '';
  const { user } = useSession();
  const [trips, setTrips] = useState(null);
  const [q, setQ] = useState('');
  const [vibe, setVibe] = useState('');
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState('open');

  useEffect(() => {
    setTrips(null);
    const params = new URLSearchParams({ status, limit: '60' });
    if (pkgSlug) params.set('package_slug', pkgSlug);
    fetch(`/api/community-trips?${params}`).then(r => r.json()).then(d => setTrips(d.trips || [])).catch(() => setTrips([]));
  }, [status, pkgSlug]);

  const filtered = (trips || []).filter(t => {
    const hay = `${t.title || ''} ${t.packages?.title || ''} ${t.packages?.location || ''} ${t.packages?.state || ''} ${t.departure_city || ''}`.toLowerCase();
    if (q && !hay.includes(q.toLowerCase())) return false;
    if (vibe && !(t.vibe_tags || []).includes(vibe)) return false;
    if (gender && t.gender_rule !== gender) return false;
    return true;
  });

  const createHref = user ? `${CT.base}/new${pkgSlug ? `?package=${encodeURIComponent(pkgSlug)}` : ''}` : loginHref(`${CT.base}/new`);

  return (
    <div className="bg-[#fafafa] min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden text-white" style={{ background: 'linear-gradient(135deg,#1a1a2e 0%,#12343f 55%,#1f77a3 140%)' }}>
        <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle,#5bc1d5,transparent 70%)' }} />
        <div className="container-max relative py-14 md:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#5bc1d5] mb-3">Travel together</p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>{CT.label}</h1>
          <p className="text-white/75 mt-3 max-w-xl text-sm md:text-base">{CT.tagline}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={createHref} className="btn-primary text-sm"><Plus size={16} /> Create a trip</Link>
            <a href="#how" className="btn-white text-sm">How it works</a>
          </div>
        </div>
      </section>

      <div className="container-max py-10">
        {pkgSlug && (
          <div className="mb-6 flex items-center gap-3 text-sm bg-white border border-gray-100 rounded-full px-4 py-2 w-fit">
            <span className="text-gray-600">Showing trips on <b className="text-[#1a1a2e]">{pkgSlug.replace(/-/g, ' ')}</b></span>
            <Link href={CT.base} className="text-gray-400 hover:text-gray-700" aria-label="Clear package filter"><X size={14} /></Link>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input id="ct-search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search destination, package or city"
              className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#5bc1d5]" />
          </div>
          <div className="flex flex-wrap gap-2">
            <select id="ct-status" value={status} onChange={e => setStatus(e.target.value)} className="bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none">
              <option value="open">Open for requests</option>
              <option value="full,confirmed">Full / confirmed</option>
              <option value="open,full,confirmed">All upcoming</option>
            </select>
            <select id="ct-gender" value={gender} onChange={e => setGender(e.target.value)} className="bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none">
              <option value="">Any group type</option>
              {GENDER_RULES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-8">
          {['', ...VIBES].map(v => (
            <button key={v || 'all'} onClick={() => setVibe(v)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold border transition ${vibe === v ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
              {v || 'All vibes'}
            </button>
          ))}
        </div>

        {/* Grid */}
        {trips === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="bg-white rounded-2xl h-[380px] animate-pulse border border-gray-100" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="text-5xl mb-4">🧭</div>
            <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">{trips.length === 0 ? 'No trips are forming yet' : 'Nothing matches those filters'}</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">{trips.length === 0 ? 'Be the first. Pick an FIT package, set your rules, and share the link with friends or let other travellers find you.' : 'Try clearing a filter or two.'}</p>
            <Link href={createHref} className="btn-primary text-sm"><Plus size={16} /> Create a trip</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((t, i) => <div key={t.id} className="tt-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}><CommunityTripCard trip={t} /></div>)}
          </div>
        )}

        {/* How it works */}
        <section id="how" className="mt-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>How it works</h2>
            <p className="text-gray-500 text-sm mt-2">Only FIT packages can be turned into trips. Fixed group departures stay with our trip captains.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STEPS.map((s, i) => (
              <div key={s.title} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg,#5bc1d5,#1f77a3)' }}>{i + 1}</span>
                  <s.icon size={18} className="text-[#1f77a3]" />
                </div>
                <h3 className="font-bold text-[#1a1a2e] mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-[#e0f4f8] rounded-2xl p-5 text-sm text-[#1f3f4a]">
            <b>Payment.</b> Once the group is full, Travel Teasing contacts every member on WhatsApp to collect payment. The creator can remove anyone who does not pay, and the spot opens up again.
          </div>
        </section>
      </div>
    </div>
  );
}

export default function CommunityTripsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-[#5bc1d5] border-t-transparent rounded-full" /></div>}>
      <ListingContent />
    </Suspense>
  );
}
