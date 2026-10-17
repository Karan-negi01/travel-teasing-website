'use client';
import { useEffect, useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Check, MapPin, Clock, Users, ArrowLeft, LogIn, Info } from 'lucide-react';
import { CT, VIBES, GENDER_RULES, isFitPackage } from '@/lib/communityTrips';
import { useSession, loginHref } from '@/lib/useSession';

const today = () => new Date().toISOString().slice(0, 10);
const inputCls = 'w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5bc1d5] bg-white';

function NewTripContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const preSlug = sp.get('package') || '';
  const { user, loading, authFetch } = useSession();

  const [packages, setPackages] = useState(null);
  const [pkgSearch, setPkgSearch] = useState('');
  const [pkg, setPkg] = useState(null);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ title: '', note: '', start_date: '', end_date: '', departure_city: '', total_spots: '', vibe_tags: [], gender_rule: 'any', age_min: '', age_max: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/packages?fit_group=true').then(r => r.json()),
      fetch('/api/packages?package_type=FIT').then(r => r.json()),
      fetch('/api/packages?category=fit').then(r => r.json()),
    ]).then(results => {
      const seen = new Set(); const merged = [];
      for (const r of results) for (const p of r.packages || []) if (!seen.has(p.id) && isFitPackage(p)) { seen.add(p.id); merged.push(p); }
      setPackages(merged);
      if (preSlug) {
        const found = merged.find(p => p.slug === preSlug);
        if (found) setPkg(found);
        else fetch(`/api/packages/${preSlug}`).then(r => r.json()).then(d => { if (d.package && isFitPackage(d.package)) setPkg(d.package); });
      }
    }).catch(() => setPackages([]));
  }, [preSlug]);

  useEffect(() => {
    if (!user) return;
    authFetch('/api/profile').then(d => setProfile(d.profile)).catch(() => {});
  }, [user, authFetch]);

  const minSpots = Math.max(2, pkg?.group_size_min || 2);
  const maxSpots = Math.max(minSpots, pkg?.group_size_max || 20);

  useEffect(() => {
    if (!pkg) return;
    setForm(f => ({ ...f, total_spots: f.total_spots || String(Math.min(Math.max(4, minSpots), maxSpots)), departure_city: f.departure_city || pkg.departure_city || '' }));
  }, [pkg, minSpots, maxSpots]);

  useEffect(() => {
    if (!pkg?.duration_days || !form.start_date) return;
    const d = new Date(form.start_date); d.setDate(d.getDate() + Math.max(0, pkg.duration_days - 1));
    setForm(f => ({ ...f, end_date: d.toISOString().slice(0, 10) }));
  }, [form.start_date, pkg?.duration_days]);

  const filteredPkgs = useMemo(() => (packages || []).filter(p => !pkgSearch || `${p.title} ${p.location} ${p.state}`.toLowerCase().includes(pkgSearch.toLowerCase())), [packages, pkgSearch]);

  const toggleVibe = (v) => setForm(f => ({ ...f, vibe_tags: f.vibe_tags.includes(v) ? f.vibe_tags.filter(x => x !== v) : f.vibe_tags.length >= 4 ? f.vibe_tags : [...f.vibe_tags, v] }));

  const genderWarning = form.gender_rule !== 'any' && profile && (profile.gender || '').toLowerCase() !== form.gender_rule
    ? (profile.gender ? 'You can only create a trip you are eligible to join yourself.' : 'Set your gender in Dashboard → Settings to use this rule.') : '';

  async function submit(e) {
    e.preventDefault();
    if (!pkg) { setError('Pick a package first'); return; }
    setSubmitting(true); setError('');
    try {
      const d = await authFetch('/api/community-trips', { method: 'POST', body: { ...form, package_id: pkg.id } });
      router.push(`${CT.base}/${d.share_code}?created=1`);
    } catch (err) { setError(err.message); setSubmitting(false); }
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-[#5bc1d5] border-t-transparent rounded-full" /></div>;

  if (!user) return (
    <div className="container-max py-16 max-w-lg text-center">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
        <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg,#5bc1d5,#1f77a3)' }}><LogIn size={22} /></div>
        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Log in to create a trip</h1>
        <p className="text-gray-500 text-sm mb-6">Trips are tied to your traveller profile so people who join can see who they are travelling with.</p>
        <div className="flex gap-3 justify-center">
          <Link href={loginHref(`${CT.base}/new${preSlug ? `?package=${encodeURIComponent(preSlug)}` : ''}`)} className="btn-primary text-sm">Log in</Link>
          <Link href="/signup" className="btn-outline text-sm">Sign up</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#fafafa] min-h-screen">
      <div className="container-max py-10">
        <Link href={CT.base} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5"><ArrowLeft size={15} /> All {CT.label.toLowerCase()}</Link>
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a2e]" style={{ fontFamily: "'Playfair Display', serif" }}>Create a trip</h1>
        <p className="text-gray-500 text-sm mt-2 max-w-xl">Choose an FIT package, pick your dates and set the rules. You approve every traveller who asks to join.</p>

        <form onSubmit={submit} className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: package */}
            <section className="bg-white rounded-3xl border border-gray-100 p-6">
              <h2 className="font-bold text-[#1a1a2e] mb-1 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-[#1a1a2e] text-white text-xs flex items-center justify-center">1</span> Package</h2>
              <p className="text-xs text-gray-500 mb-4">Only FIT packages are listed. Group departures are run by Travel Teasing with a trip captain.</p>
              {pkg ? (
                <div className="flex gap-4 items-center border border-[#5bc1d5] bg-[#f4fbfd] rounded-2xl p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pkg.cover_image} alt="" className="w-24 h-20 object-cover rounded-xl flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#1a1a2e] truncate">{pkg.title}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-3 mt-1 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin size={11} /> {pkg.location}</span>
                      {pkg.duration_days && <span className="flex items-center gap-1"><Clock size={11} /> {pkg.duration_days}D/{pkg.duration_nights}N</span>}
                      <span className="flex items-center gap-1"><Users size={11} /> {minSpots}–{maxSpots} people</span>
                    </p>
                  </div>
                  <button type="button" onClick={() => setPkg(null)} className="text-xs font-semibold text-[#1f77a3] hover:underline flex-shrink-0">Change</button>
                </div>
              ) : (
                <div>
                  <div className="relative mb-3">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input id="pkg-search" value={pkgSearch} onChange={e => setPkgSearch(e.target.value)} placeholder="Search packages" className={`${inputCls} pl-9`} />
                  </div>
                  <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                    {packages === null ? <p className="text-sm text-gray-400 py-6 text-center">Loading packages…</p>
                      : filteredPkgs.length === 0 ? <p className="text-sm text-gray-400 py-6 text-center">No FIT packages found.</p>
                      : filteredPkgs.map(p => (
                        <button type="button" key={p.id} onClick={() => setPkg(p)} className="w-full flex gap-3 items-center text-left border border-gray-100 hover:border-[#5bc1d5] rounded-xl p-2 transition">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.cover_image} alt="" className="w-16 h-14 object-cover rounded-lg flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-[#1a1a2e] truncate">{p.title}</p>
                            <p className="text-xs text-gray-500">{p.location}{p.duration_days ? ` · ${p.duration_days}D/${p.duration_nights}N` : ''}</p>
                          </div>
                          <p className="text-sm font-bold text-[#1a1a2e] flex-shrink-0">{p.price_per_person ? `₹${Number(p.price_per_person).toLocaleString('en-IN')}` : ''}</p>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </section>

            {/* Step 2: dates & size */}
            <section className={`bg-white rounded-3xl border border-gray-100 p-6 ${pkg ? '' : 'opacity-50 pointer-events-none'}`}>
              <h2 className="font-bold text-[#1a1a2e] mb-4 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-[#1a1a2e] text-white text-xs flex items-center justify-center">2</span> Dates &amp; group</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ct-start" className="block text-xs font-semibold text-gray-600 mb-1.5">Start date *</label>
                  <input id="ct-start" type="date" required min={today()} value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="ct-end" className="block text-xs font-semibold text-gray-600 mb-1.5">End date</label>
                  <input id="ct-end" type="date" min={form.start_date || today()} value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="ct-spots" className="block text-xs font-semibold text-gray-600 mb-1.5">Group size (including you) *</label>
                  <input id="ct-spots" type="number" required min={minSpots} max={maxSpots} value={form.total_spots} onChange={e => setForm(f => ({ ...f, total_spots: e.target.value }))} className={inputCls} />
                  <p className="text-[11px] text-gray-400 mt-1">This package runs for {minSpots} to {maxSpots} people.</p>
                </div>
                <div>
                  <label htmlFor="ct-city" className="block text-xs font-semibold text-gray-600 mb-1.5">Departure city</label>
                  <input id="ct-city" value={form.departure_city} onChange={e => setForm(f => ({ ...f, departure_city: e.target.value }))} placeholder="e.g. Delhi" className={inputCls} />
                </div>
              </div>
            </section>

            {/* Step 3: rules */}
            <section className={`bg-white rounded-3xl border border-gray-100 p-6 ${pkg ? '' : 'opacity-50 pointer-events-none'}`}>
              <h2 className="font-bold text-[#1a1a2e] mb-4 flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-[#1a1a2e] text-white text-xs flex items-center justify-center">3</span> Rules &amp; vibe</h2>
              <p className="text-xs font-semibold text-gray-600 mb-2">Who can join?</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-1">
                {GENDER_RULES.map(g => (
                  <button type="button" key={g.value} onClick={() => setForm(f => ({ ...f, gender_rule: g.value }))}
                    className={`text-left rounded-xl border px-4 py-3 text-sm transition ${form.gender_rule === g.value ? 'border-[#1a1a2e] bg-[#1a1a2e] text-white' : 'border-gray-200 hover:border-gray-400'}`}>
                    <span className="flex items-center justify-between">{g.label}{form.gender_rule === g.value && <Check size={14} />}</span>
                  </button>
                ))}
              </div>
              {genderWarning && <p className="text-xs text-amber-700 flex items-center gap-1 mt-2"><Info size={12} /> {genderWarning}</p>}

              <div className="grid grid-cols-2 gap-4 mt-5">
                <div>
                  <label htmlFor="ct-agemin" className="block text-xs font-semibold text-gray-600 mb-1.5">Min age</label>
                  <input id="ct-agemin" type="number" min="16" max="90" value={form.age_min} onChange={e => setForm(f => ({ ...f, age_min: e.target.value }))} placeholder="Any" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="ct-agemax" className="block text-xs font-semibold text-gray-600 mb-1.5">Max age</label>
                  <input id="ct-agemax" type="number" min="16" max="90" value={form.age_max} onChange={e => setForm(f => ({ ...f, age_max: e.target.value }))} placeholder="Any" className={inputCls} />
                </div>
              </div>

              <p className="text-xs font-semibold text-gray-600 mt-5 mb-2">Vibe of the trip <span className="text-gray-400 font-normal">(up to 4)</span></p>
              <div className="flex flex-wrap gap-2">
                {VIBES.map(v => (
                  <button type="button" key={v} onClick={() => toggleVibe(v)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${form.vibe_tags.includes(v) ? 'bg-[#5bc1d5] border-[#5bc1d5] text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'}`}>{v}</button>
                ))}
              </div>

              <div className="mt-5">
                <label htmlFor="ct-title" className="block text-xs font-semibold text-gray-600 mb-1.5">Trip name <span className="text-gray-400 font-normal">(optional)</span></label>
                <input id="ct-title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} maxLength={80} placeholder={pkg ? `${pkg.location} with ${(profile?.full_name || 'me').split(' ')[0]}` : 'e.g. Spiti in October'} className={inputCls} />
              </div>
              <div className="mt-4">
                <label htmlFor="ct-note" className="block text-xs font-semibold text-gray-600 mb-1.5">A note for people who want to join</label>
                <textarea id="ct-note" rows={3} maxLength={600} value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="What kind of trip is this? Early starts or slow mornings? Budget stays or comfort? Anything people should know." className={`${inputCls} resize-none`} />
              </div>
            </section>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-28 h-fit">
            <div className="bg-white rounded-3xl border border-gray-100 p-6">
              <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-3">Summary</p>
              {pkg ? (
                <>
                  <p className="font-bold text-[#1a1a2e] leading-snug">{form.title || pkg.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{pkg.location}{pkg.state ? `, ${pkg.state}` : ''}</p>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between"><dt className="text-gray-500">Dates</dt><dd className="font-medium text-right">{form.start_date ? `${form.start_date}${form.end_date ? ` → ${form.end_date}` : ''}` : '—'}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Group size</dt><dd className="font-medium">{form.total_spots || '—'} people</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Who</dt><dd className="font-medium">{GENDER_RULES.find(g => g.value === form.gender_rule)?.short}{form.age_min || form.age_max ? `, ${form.age_min || '18'}${form.age_max ? `–${form.age_max}` : '+'}` : ''}</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">Price per person</dt><dd className="font-medium">{pkg.price_per_person ? `from ₹${Number(pkg.price_per_person).toLocaleString('en-IN')}` : 'On request'}</dd></div>
                  </dl>
                  <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">Final per-person price is confirmed by Travel Teasing for your group size before anyone pays.</p>
                </>
              ) : <p className="text-sm text-gray-400">Pick a package to see the summary.</p>}
              {error && <p className="text-red-600 text-sm mt-4 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
              <button type="submit" disabled={!pkg || submitting || !!genderWarning} className="btn-primary w-full justify-center mt-5 disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? 'Creating…' : 'Create trip & get share link'}
              </button>
              <p className="text-[11px] text-gray-400 mt-3 text-center">You are automatically the first member.</p>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

export default function NewCommunityTripPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-[#5bc1d5] border-t-transparent rounded-full" /></div>}>
      <NewTripContent />
    </Suspense>
  );
}
