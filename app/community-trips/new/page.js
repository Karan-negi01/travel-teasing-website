'use client';
import { useEffect, useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Check, MapPin, Clock, Users, ArrowLeft, LogIn, Info } from 'lucide-react';
import { CT, VIBES, GENDER_RULES, isFitPackage } from '@/lib/communityTrips';
import { useSession, loginHref } from '@/lib/useSession';
import { usePalette, Card, Eyebrow, FieldLabel, inputStyle, Button, Pill, Spinner } from '@/components/ui';
import { getDestImage } from '@/components/PackageCard';

const today = () => new Date().toISOString().slice(0, 10);

function Step({ n, title, children, disabled }) {
  const p = usePalette();
  return (
    <Card pad={28} style={{ opacity: disabled ? 0.45 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      <Eyebrow style={{ marginBottom: 6 }}>{n}</Eyebrow>
      <h3 style={{ fontSize: 20, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: p.text, margin: '0 0 18px' }}>{title}</h3>
      {children}
    </Card>
  );
}

function NewTripContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const preSlug = sp.get('package') || '';
  const { user, loading, authFetch } = useSession();
  const p = usePalette();
  const input = inputStyle(p);

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
      for (const r of results) for (const x of r.packages || []) if (!seen.has(x.id) && isFitPackage(x)) { seen.add(x.id); merged.push(x); }
      setPackages(merged);
      if (preSlug) {
        const found = merged.find(x => x.slug === preSlug);
        if (found) setPkg(found);
        else fetch(`/api/packages/${preSlug}`).then(r => r.json()).then(d => { if (d.package && isFitPackage(d.package)) setPkg(d.package); });
      }
    }).catch(() => setPackages([]));
  }, [preSlug]);

  useEffect(() => { if (user) authFetch('/api/profile').then(d => setProfile(d.profile)).catch(() => {}); }, [user, authFetch]);

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

  const filteredPkgs = useMemo(() => (packages || []).filter(x => !pkgSearch || `${x.title} ${x.location} ${x.state}`.toLowerCase().includes(pkgSearch.toLowerCase())), [packages, pkgSearch]);
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

  if (loading) return <Spinner />;

  if (!user) return (
    <div style={{ background: p.pageBg, minHeight: '70vh', fontFamily: p.font }} className="flex items-center justify-center px-4">
      <Card pad={40} style={{ maxWidth: 460, textAlign: 'center' }}>
        <Eyebrow color={p.accent} style={{ marginBottom: 12 }}>{CT.label}</Eyebrow>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: p.text, margin: '0 0 10px' }}>Log in to create a trip</h1>
        <p style={{ fontSize: 14, color: p.muted, margin: '0 0 24px' }}>Trips are tied to your traveller profile so people who join can see who they are travelling with.</p>
        <div className="flex gap-3 justify-center">
          <Button href={loginHref(`${CT.base}/new${preSlug ? `?package=${encodeURIComponent(preSlug)}` : ''}`)}><LogIn size={15} /> Log in</Button>
          <Button variant="outline" href="/signup">Sign up</Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div style={{ background: p.pageBg, minHeight: '100vh', fontFamily: p.font, color: p.text }}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 md:py-12">
        <Link href={CT.base} className="inline-flex items-center gap-1.5 text-sm" style={{ color: p.muted }}><ArrowLeft size={15} /> All {CT.label.toLowerCase()}</Link>
        <div className="mt-5 mb-10">
          <Eyebrow color={p.accent} style={{ marginBottom: 10 }}>{CT.label}</Eyebrow>
          <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, color: p.text, margin: 0, lineHeight: 1.05 }}>Create a trip</h1>
          <p style={{ fontSize: 15, color: p.muted, marginTop: 12, maxWidth: 560 }}>Choose an FIT package, pick your dates and set the rules. You approve every traveller who asks to join.</p>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div className="space-y-5">
            {/* 01 Package */}
            <Step n="01 — Package" title="Choose the package">
              <p style={{ fontSize: 13, color: p.muted, margin: '-8px 0 16px' }}>Only FIT packages are listed. Group departures are run by Travel Teasing with a trip captain.</p>
              {pkg ? (
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', border: `1px solid ${p.accent}`, background: `${p.accent}12`, borderRadius: 12, padding: 12 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pkg.cover_image || getDestImage(pkg)} alt="" style={{ width: 104, height: 80, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontWeight: 600, color: p.text, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pkg.title}</p>
                    <p style={{ fontSize: 12, color: p.muted, margin: '6px 0 0', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                      <span className="inline-flex items-center gap-1"><MapPin size={11} /> {pkg.location}</span>
                      {pkg.duration_days && <span className="inline-flex items-center gap-1"><Clock size={11} /> {pkg.duration_days}D/{pkg.duration_nights}N</span>}
                      <span className="inline-flex items-center gap-1"><Users size={11} /> {minSpots}–{maxSpots} people</span>
                    </p>
                  </div>
                  <button type="button" onClick={() => setPkg(null)} style={{ fontSize: 12, fontWeight: 600, color: p.accent, background: 'none', border: 'none', cursor: 'pointer' }}>Change</button>
                </div>
              ) : (
                <div>
                  <div style={{ position: 'relative', marginBottom: 12 }}>
                    <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: p.faint }} />
                    <input id="pkg-search" value={pkgSearch} onChange={e => setPkgSearch(e.target.value)} placeholder="Search packages" style={{ ...input, paddingLeft: 40 }} />
                  </div>
                  <div style={{ maxHeight: 340, overflowY: 'auto', display: 'grid', gap: 8, paddingRight: 4 }}>
                    {packages === null ? <p style={{ fontSize: 13, color: p.faint, textAlign: 'center', padding: 24 }}>Loading packages…</p>
                      : filteredPkgs.length === 0 ? <p style={{ fontSize: 13, color: p.faint, textAlign: 'center', padding: 24 }}>No FIT packages found.</p>
                      : filteredPkgs.map(x => (
                        <button type="button" key={x.id} onClick={() => setPkg(x)} style={{ display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left', border: `1px solid ${p.border}`, background: p.surface, borderRadius: 12, padding: 8, cursor: 'pointer', color: p.text }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = p.accent} onMouseLeave={e => e.currentTarget.style.borderColor = p.border}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={x.cover_image || getDestImage(x)} alt="" style={{ width: 72, height: 56, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <p style={{ fontSize: 14, fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.title}</p>
                            <p style={{ fontSize: 12, color: p.muted, margin: '2px 0 0' }}>{x.location}{x.duration_days ? ` · ${x.duration_days}D/${x.duration_nights}N` : ''}</p>
                          </div>
                          <p style={{ fontSize: 14, fontWeight: 700, margin: 0, flexShrink: 0 }}>{x.price_per_person ? `₹${Number(x.price_per_person).toLocaleString('en-IN')}` : ''}</p>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </Step>

            {/* 02 Dates & group */}
            <Step n="02 — Dates & group" title="When and how many" disabled={!pkg}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><FieldLabel htmlFor="ct-start">Start date *</FieldLabel><input id="ct-start" type="date" required min={today()} value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} style={input} /></div>
                <div><FieldLabel htmlFor="ct-end">End date</FieldLabel><input id="ct-end" type="date" min={form.start_date || today()} value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} style={input} /></div>
                <div><FieldLabel htmlFor="ct-spots">Group size, including you *</FieldLabel><input id="ct-spots" type="number" required min={minSpots} max={maxSpots} value={form.total_spots} onChange={e => setForm(f => ({ ...f, total_spots: e.target.value }))} style={input} /><p style={{ fontSize: 11, color: p.faint, marginTop: 6 }}>This package runs for {minSpots} to {maxSpots} people.</p></div>
                <div><FieldLabel htmlFor="ct-city">Departure city</FieldLabel><input id="ct-city" value={form.departure_city} onChange={e => setForm(f => ({ ...f, departure_city: e.target.value }))} placeholder="e.g. Delhi" style={input} /></div>
              </div>
            </Step>

            {/* 03 Rules */}
            <Step n="03 — Rules & vibe" title="Who can join" disabled={!pkg}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {GENDER_RULES.map(g => {
                  const on = form.gender_rule === g.value;
                  return <button type="button" key={g.value} onClick={() => setForm(f => ({ ...f, gender_rule: g.value }))} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', borderRadius: 10, padding: '12px 14px', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: p.font, border: `1px solid ${on ? p.btnBg : p.borderMid}`, background: on ? p.btnBg : 'transparent', color: on ? p.btnFg : p.sub }}>{g.label}{on && <Check size={14} />}</button>;
                })}
              </div>
              {genderWarning && <p style={{ fontSize: 12, color: p.warn, marginTop: 10, display: 'flex', gap: 6, alignItems: 'center' }}><Info size={12} /> {genderWarning}</p>}

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div><FieldLabel htmlFor="ct-agemin">Min age</FieldLabel><input id="ct-agemin" type="number" min="16" max="90" value={form.age_min} onChange={e => setForm(f => ({ ...f, age_min: e.target.value }))} placeholder="Any" style={input} /></div>
                <div><FieldLabel htmlFor="ct-agemax">Max age</FieldLabel><input id="ct-agemax" type="number" min="16" max="90" value={form.age_max} onChange={e => setForm(f => ({ ...f, age_max: e.target.value }))} placeholder="Any" style={input} /></div>
              </div>

              <div className="mt-6">
                <FieldLabel>Vibe of the trip <span style={{ opacity: .6, textTransform: 'none', letterSpacing: 0 }}>(up to 4)</span></FieldLabel>
                <div className="flex flex-wrap gap-2">{VIBES.map(v => <Pill key={v} small active={form.vibe_tags.includes(v)} onClick={() => toggleVibe(v)}>{v}</Pill>)}</div>
              </div>

              <div className="mt-6"><FieldLabel htmlFor="ct-title">Trip name <span style={{ opacity: .6, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></FieldLabel><input id="ct-title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} maxLength={80} placeholder={pkg ? `${pkg.location} with ${(profile?.full_name || 'me').split(' ')[0]}` : 'e.g. Spiti in October'} style={input} /></div>
              <div className="mt-4"><FieldLabel htmlFor="ct-note">A note for people who want to join</FieldLabel><textarea id="ct-note" rows={3} maxLength={600} value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="What kind of trip is this? Early starts or slow mornings? Budget stays or comfort?" style={{ ...input, resize: 'none' }} /></div>
            </Step>
          </div>

          {/* Summary */}
          <Card pad={0} className="lg:sticky lg:top-32" style={{ overflow: 'hidden' }}>
            <div style={{ padding: 24, borderBottom: `1px solid ${p.border}` }}>
              <Eyebrow style={{ marginBottom: 8 }}>Your trip</Eyebrow>
              {pkg ? (
                <>
                  <p style={{ fontSize: 20, fontWeight: 700, color: p.text, margin: 0, lineHeight: 1.25 }}>{form.title || pkg.title}</p>
                  <p style={{ fontSize: 13, color: p.muted, marginTop: 6 }}>{pkg.location}{pkg.state ? `, ${pkg.state}` : ''}</p>
                </>
              ) : <p style={{ fontSize: 14, color: p.faint, margin: 0 }}>Pick a package to see the summary.</p>}
            </div>
            {pkg && (
              <div style={{ padding: '20px 24px' }}>
                {[
                  ['Dates', form.start_date ? `${form.start_date}${form.end_date ? ` → ${form.end_date}` : ''}` : '—'],
                  ['Group size', `${form.total_spots || '—'} people`],
                  ['Who', `${GENDER_RULES.find(g => g.value === form.gender_rule)?.short}${form.age_min || form.age_max ? `, ${form.age_min || '18'}${form.age_max ? `–${form.age_max}` : '+'}` : ''}`],
                  ['Price per person', pkg.price_per_person ? `from ₹${Number(pkg.price_per_person).toLocaleString('en-IN')}` : 'On request'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: `1px solid ${p.border}`, fontSize: 14 }}>
                    <span style={{ color: p.muted }}>{k}</span><span style={{ color: p.text, fontWeight: 500, textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
                <p style={{ fontSize: 11, color: p.faint, margin: '14px 0 18px', lineHeight: 1.6 }}>Final per-person price is confirmed by Travel Teasing for your group size before anyone pays.</p>
                {error && <p style={{ fontSize: 13, color: p.bad, marginBottom: 12 }}>{error}</p>}
                <Button type="submit" variant="accent" full size="lg" disabled={!pkg || submitting || !!genderWarning}>{submitting ? 'Creating…' : 'Create trip & get share link'}</Button>
                <p style={{ fontSize: 11, color: p.faint, textAlign: 'center', marginTop: 12 }}>You are automatically the first member.</p>
              </div>
            )}
          </Card>
        </form>
      </div>
    </div>
  );
}

export default function NewCommunityTripPage() {
  return <Suspense fallback={<Spinner />}><NewTripContent /></Suspense>;
}
