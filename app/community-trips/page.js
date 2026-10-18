'use client';
import { useEffect, useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Plus, ArrowRight, X } from 'lucide-react';
import CommunityTripCard from '@/components/CommunityTripCard';
import { PageHero, Pill, Button, SectionTitle, Eyebrow, Card, inputStyle, usePalette, Spinner } from '@/components/ui';
import { CT, VIBES, GENDER_RULES, approvedCount } from '@/lib/communityTrips';
import { useSession, loginHref } from '@/lib/useSession';

const HERO = 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1800&q=85';
const STEPS = [
  ['01', 'Pick an FIT package', 'Any personalised package can become a trip. The dates are yours to choose.'],
  ['02', 'Set your rules', 'Group size, vibe, women-only or mixed, age range. Your trip, your call.'],
  ['03', 'Approve your crew', 'Travellers request to join. You see their profile and past trips before saying yes.'],
  ['04', 'Pay when it is full', 'Travel Teasing confirms the price for your group size and collects payment on WhatsApp.'],
];

function ListingContent() {
  const sp = useSearchParams();
  const pkgSlug = sp.get('package') || '';
  const { user } = useSession();
  const p = usePalette();
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

  const filtered = useMemo(() => (trips || []).filter(t => {
    const hay = `${t.title || ''} ${t.packages?.title || ''} ${t.packages?.location || ''} ${t.packages?.state || ''} ${t.departure_city || ''}`.toLowerCase();
    if (q && !hay.includes(q.toLowerCase())) return false;
    if (vibe && !(t.vibe_tags || []).includes(vibe)) return false;
    if (gender && t.gender_rule !== gender) return false;
    return true;
  }), [trips, q, vibe, gender]);

  const stats = useMemo(() => {
    const list = trips || [];
    return [
      { value: `${list.length}`, label: status === 'open' ? 'Open trips' : 'Trips' },
      { value: `${list.reduce((n, t) => n + approvedCount(t), 0)}`, label: 'Travellers' },
      { value: `${new Set(list.map(t => t.packages?.location).filter(Boolean)).size}`, label: 'Destinations' },
    ];
  }, [trips, status]);

  const createHref = user ? `${CT.base}/new${pkgSlug ? `?package=${encodeURIComponent(pkgSlug)}` : ''}` : loginHref(`${CT.base}/new`);

  return (
    <div style={{ background: p.pageBg, minHeight: '100vh', fontFamily: p.font }}>
      <PageHero
        image={HERO}
        eyebrow="Travel together"
        title={CT.label}
        subtitle={CT.tagline}
        stats={stats}
        chips={['FIT packages only', 'You approve who joins', 'Pay only when the group is full']}
        right={<Button href={createHref} variant="primary" size="lg" style={{ background: '#fff', color: '#0d0d0d', borderColor: '#fff' }}><Plus size={16} /> Create a trip</Button>}
      />

      <section className="bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-10">
          {pkgSlug && (
            <div className="mb-5 flex items-center gap-3 text-sm">
              <span className="text-gray-500">Showing trips on</span>
              <Pill active>{pkgSlug.replace(/-/g, ' ')} <Link href={CT.base} aria-label="Clear" className="ml-1 opacity-70 hover:opacity-100"><X size={13} /></Link></Pill>
            </div>
          )}

          {/* Tabs + sort row, like the category pages */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-100 pb-5">
            <div className="flex gap-6 overflow-x-auto scrollbar-hide">
              {[['open', 'Open for requests'], ['full,confirmed', 'Full & confirmed'], ['open,full,confirmed', 'All upcoming']].map(([id, label]) => (
                <button key={id} onClick={() => setStatus(id)} className={`whitespace-nowrap pb-1 text-sm font-medium transition border-b-2 ${status === id ? 'border-[#5bc1d5] text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
                  {label}{status === id && trips && <span className="ml-1.5 text-xs text-gray-400">{filtered.length}</span>}
                </button>
              ))}
            </div>
            <select id="ct-gender" value={gender} onChange={e => setGender(e.target.value)} style={{ ...inputStyle(p), width: 'auto', padding: '9px 36px 9px 14px', fontSize: 13, borderRadius: 999 }}>
              <option value="">Any group type</option>
              {GENDER_RULES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>

          {/* Search bar */}
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4" style={{ height: 52 }}>
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input id="ct-search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search destinations, packages or departure city" className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-400" style={{ border: 'none', boxShadow: 'none' }} />
            {q && <button onClick={() => setQ('')} className="text-gray-400 hover:text-gray-700" aria-label="Clear search"><X size={15} /></button>}
          </div>

          {/* Vibe pills */}
          <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {['', ...VIBES].map(v => <Pill key={v || 'all'} small active={vibe === v} onClick={() => setVibe(v)}>{v || 'All vibes'}</Pill>)}
          </div>

          <p className="mt-8 mb-5 text-base font-semibold text-gray-800">{trips === null ? 'Loading trips…' : `${filtered.length} trip${filtered.length === 1 ? '' : 's'} found`}</p>

          {trips === null ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i}><div className="h-72 bg-gray-100 rounded-2xl animate-pulse" /><div className="py-3 space-y-3"><div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" /><div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" /></div></div>)}
            </div>
          ) : filtered.length === 0 ? (
            <Card pad={48} style={{ textAlign: 'center' }}>
              <Eyebrow color="#5bc1d5" style={{ marginBottom: 12 }}>{trips.length === 0 ? 'Be the first' : 'No match'}</Eyebrow>
              <p style={{ fontSize: 22, fontWeight: 600, color: p.text, margin: 0 }}>{trips.length === 0 ? 'No trips are forming yet' : 'Nothing matches those filters'}</p>
              <p style={{ fontSize: 14, color: p.muted, maxWidth: 440, margin: '10px auto 24px' }}>{trips.length === 0 ? 'Pick an FIT package, set your rules, and share the link with friends or let other travellers find you.' : 'Try clearing a filter or two.'}</p>
              {trips.length === 0 ? <Button href={createHref}><Plus size={15} /> Create a trip</Button> : <Button variant="outline" onClick={() => { setQ(''); setVibe(''); setGender(''); }}>Clear filters</Button>}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {filtered.map(t => <CommunityTripCard key={t.id} trip={t} />)}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#fafafa]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-16 md:py-24">
          <SectionTitle italic="How it" rest="works" sub="Only FIT packages can be turned into trips. Fixed group departures stay with our trip captains." />
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-10">
            {STEPS.map(([n, t, d]) => (
              <div key={n} className="border-t border-gray-200 pt-6">
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#5bc1d5]">{n}</p>
                <h3 className="text-lg font-semibold text-gray-900 mt-3" style={{ fontSize: 18 }}>{t}</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link href={createHref} className="inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-800 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition">Start your trip <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function CommunityTripsPage() {
  return <Suspense fallback={<Spinner />}><ListingContent /></Suspense>;
}
