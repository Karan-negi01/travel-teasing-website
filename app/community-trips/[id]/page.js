'use client';
import { useCallback, useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MapPin, Calendar, Users, Copy, Check, ShieldCheck, Clock, LogIn, X, Pencil, AlertTriangle, MessageCircle, ArrowLeft } from 'lucide-react';
import Avatar from '@/components/Avatar';
import { getDestImage } from '@/components/PackageCard';
import { usePalette, Card, Eyebrow, FieldLabel, inputStyle, Button, Pill, Tag, Progress, BlockTitle, Spinner } from '@/components/ui';
import { CT, TRIP_STATUS, GENDER_RULES, VIBES, fmtRange, tripTitle, daysUntil, shareUrl } from '@/lib/communityTrips';
import { useSession, loginHref } from '@/lib/useSession';

const WA = <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
const toneFor = (s) => s === 'open' ? 'accent' : s === 'confirmed' ? 'ok' : s === 'full' ? 'warn' : s === 'cancelled' ? 'bad' : 'neutral';

function MemberRow({ m, isHost, you, actions, p }) {
  const pr = m.profile || {};
  const meta = [pr.age ? `${pr.age} yrs` : null, pr.city].filter(Boolean).join(' · ');
  return (
    <div style={{ display: 'flex', gap: 14, padding: 16, border: `1px solid ${p.border}`, borderRadius: 14, background: p.surface }}>
      <Link href={`/profile/${m.user_id}`}><Avatar src={pr.profile_photo} name={pr.full_name} size={46} /></Link>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Link href={`/profile/${m.user_id}`} style={{ fontWeight: 600, fontSize: 14, color: p.text, textDecoration: 'none' }}>{pr.full_name || 'Traveller'}</Link>
          {pr.is_verified && <ShieldCheck size={13} color={p.accent} />}
          {isHost && <Tag tone="accent">Host</Tag>}
          {you && <Tag>You</Tag>}
        </div>
        {meta && <p style={{ fontSize: 12, color: p.muted, margin: '3px 0 0' }}>{meta}</p>}
        {pr.trip_style?.length > 0 && <p style={{ fontSize: 11, color: p.faint, margin: '6px 0 0', letterSpacing: '0.04em' }}>{pr.trip_style.slice(0, 4).join('  ·  ')}</p>}
        {m.message && <p style={{ fontSize: 13, color: p.sub, margin: '10px 0 0', fontStyle: 'italic' }}>“{m.message}”</p>}
        {!m.message && pr.bio && <p style={{ fontSize: 12, color: p.muted, margin: '8px 0 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{pr.bio}</p>}
        {actions && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>{actions}</div>}
      </div>
    </div>
  );
}

function TripContent({ params }) {
  const sp = useSearchParams();
  const justCreated = sp.get('created') === '1';
  const { user, loading: sessionLoading, authFetch } = useSession();
  const p = usePalette();
  const input = inputStyle(p);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [actionError, setActionError] = useState('');
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinMsg, setJoinMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  const load = useCallback(async () => {
    try { setData(await authFetch(`/api/community-trips/${params.id}`)); setError(''); } catch (e) { setError(e.message); }
  }, [authFetch, params.id]);
  useEffect(() => { if (!sessionLoading) load(); }, [sessionLoading, load]);

  const run = async (key, fn) => { setBusy(key); setActionError(''); try { await fn(); await load(); } catch (e) { setActionError(e.message); } finally { setBusy(''); } };
  const copyLink = async () => { const url = shareUrl(data.trip); try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { window.prompt('Copy this link', url); } };

  if (error && !data) return <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4" style={{ background: p.pageBg, color: p.muted }}><p>{error}</p><Button variant="outline" href={CT.base}>Back to {CT.label.toLowerCase()}</Button></div>;
  if (!data) return <Spinner />;

  const { trip, members, requests, history, viewer } = data;
  const pkg = trip.packages || {};
  const st = TRIP_STATUS[trip.status] || TRIP_STATUS.open;
  const rule = GENDER_RULES.find(g => g.value === trip.gender_rule) || GENDER_RULES[0];
  const approved = trip.approved_count ?? members.length;
  const left = Math.max(0, trip.total_spots - approved);
  const until = daysUntil(trip.start_date);
  const isCreator = viewer.is_creator;
  const membership = viewer.membership;
  const closed = ['cancelled', 'completed'].includes(trip.status);
  const waShare = `https://wa.me/?text=${encodeURIComponent(`Join my trip to ${pkg.location || tripTitle(trip)} on Travel Teasing: ${shareUrl(trip)}`)}`;
  const heroImg = pkg.cover_image || getDestImage(pkg);

  const openEdit = () => { setEditForm({ title: trip.title || '', note: trip.note || '', start_date: trip.start_date || '', end_date: trip.end_date || '', departure_city: trip.departure_city || '', total_spots: trip.total_spots, gender_rule: trip.gender_rule, age_min: trip.age_min || '', age_max: trip.age_max || '', vibe_tags: trip.vibe_tags || [] }); setEditOpen(true); };

  /* ── CTA block (shared by sidebar and mobile bar) ── */
  const cta = isCreator ? (
    <>
      <Button variant="accent" full onClick={copyLink}>{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Link copied' : 'Copy share link'}</Button>
      <Button variant="whatsapp" full href={waShare} target="_blank" rel="noopener noreferrer">{WA} Share on WhatsApp</Button>
      {!closed && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Button variant="outline" size="sm" onClick={openEdit}><Pencil size={13} /> Edit rules</Button>
          {confirmCancel
            ? <Button variant="danger" size="sm" disabled={busy === 'cancel'} onClick={() => run('cancel', () => authFetch(`/api/community-trips/${trip.id}`, { method: 'PATCH', body: { action: 'cancel' } }))} style={{ background: p.bad, color: '#fff' }}>Yes, cancel</Button>
            : <Button variant="danger" size="sm" onClick={() => setConfirmCancel(true)}>Cancel trip</Button>}
        </div>
      )}
      {confirmCancel && <button onClick={() => setConfirmCancel(false)} style={{ fontSize: 11, color: p.faint, background: 'none', border: 'none', cursor: 'pointer' }}>Keep the trip</button>}
    </>
  ) : !viewer.logged_in ? (
    <>
      <Button variant="accent" full href={loginHref(`${CT.base}/${trip.share_code || trip.id}`)}><LogIn size={16} /> Log in to request a spot</Button>
      <p style={{ fontSize: 11, color: p.faint, textAlign: 'center', margin: 0 }}>New here? <Link href="/signup" style={{ color: p.accent, fontWeight: 600 }}>Create an account</Link></p>
    </>
  ) : membership?.status === 'approved' ? (
    <>
      <div style={{ borderRadius: 8, background: 'rgba(74,222,128,.12)', color: p.dark ? '#86efac' : '#15803d', fontSize: 14, fontWeight: 600, padding: '12px 14px', display: 'flex', gap: 8, alignItems: 'center' }}><Check size={16} /> You&apos;re on this trip</div>
      <p style={{ fontSize: 12, color: p.muted, margin: 0 }}>Payment: <b style={{ color: membership.payment_status === 'paid' ? p.ok : p.warn }}>{membership.payment_status === 'paid' ? 'received' : 'pending, we will message you on WhatsApp'}</b></p>
      {!closed && (confirmLeave
        ? <Button variant="danger" full size="sm" disabled={busy === 'leave'} onClick={() => run('leave', () => authFetch(`/api/community-trips/${trip.id}/join`, { method: 'DELETE' }))} style={{ background: p.bad, color: '#fff' }}>Yes, leave the trip</Button>
        : <Button variant="outline" full size="sm" onClick={() => setConfirmLeave(true)}>Leave trip</Button>)}
    </>
  ) : membership?.status === 'requested' ? (
    <>
      <div style={{ borderRadius: 8, background: 'rgba(251,191,36,.12)', color: p.dark ? '#fcd34d' : '#92400e', fontSize: 14, fontWeight: 600, padding: '12px 14px' }}>Request sent. Waiting for {(trip.creator?.full_name || 'the host').split(' ')[0]} to approve.</div>
      <Button variant="outline" full size="sm" disabled={busy === 'withdraw'} onClick={() => run('withdraw', () => authFetch(`/api/community-trips/${trip.id}/join`, { method: 'DELETE' }))}>Withdraw request</Button>
    </>
  ) : ['rejected', 'removed'].includes(membership?.status) ? (
    <div style={{ borderRadius: 8, background: p.surface, color: p.muted, fontSize: 14, padding: '12px 14px' }}>The host has closed this trip to you.</div>
  ) : trip.status !== 'open' ? (
    <div style={{ borderRadius: 8, background: p.surface, color: p.muted, fontSize: 14, padding: '12px 14px' }}>{st.hint}. Not accepting new requests.</div>
  ) : joinOpen ? (
    <>
      <textarea id="join-msg" rows={3} maxLength={400} value={joinMsg} onChange={e => setJoinMsg(e.target.value)} placeholder="Say hi. Why do you want in, what's your travel style?" style={{ ...input, resize: 'none' }} />
      <Button variant="accent" full disabled={busy === 'join'} onClick={() => run('join', async () => { await authFetch(`/api/community-trips/${trip.id}/join`, { method: 'POST', body: { message: joinMsg } }); setJoinOpen(false); })}>{busy === 'join' ? 'Sending…' : 'Send request'}</Button>
      <button onClick={() => setJoinOpen(false)} style={{ fontSize: 11, color: p.faint, background: 'none', border: 'none', cursor: 'pointer' }}>Not now</button>
    </>
  ) : (
    <>
      <Button variant="accent" full size="lg" onClick={() => setJoinOpen(true)}><Users size={16} /> Request to join</Button>
      <p style={{ fontSize: 11, color: p.faint, textAlign: 'center', margin: 0 }}>The host sees your profile and past trips before approving.</p>
    </>
  );

  return (
    <div style={{ background: p.pageBg, minHeight: '100vh', fontFamily: p.font, color: p.text }} className="pb-24 lg:pb-12">
      {/* ── HERO, same proportions as the package page ── */}
      <div style={{ position: 'relative', width: '100%', height: '68vh', minHeight: 520, maxHeight: 760, overflow: 'hidden', background: '#0a0a0a' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImg} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.5) 0%, rgba(0,0,0,.15) 40%, rgba(0,0,0,.88) 100%)' }} />
        <div className="max-w-[1400px] mx-auto px-6" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 44 }}>
          <Link href={CT.base} style={{ position: 'absolute', top: 120, left: 24, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,.75)', textDecoration: 'none' }}><ArrowLeft size={14} /> {CT.label}</Link>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span>Community trip</span><span style={{ width: 1, height: 10, background: 'rgba(255,255,255,.3)' }} /><span style={{ color: trip.status === 'open' ? '#5bc1d5' : trip.status === 'confirmed' ? '#4ade80' : '#fbbf24' }}>{st.label}</span>
            {until !== null && until >= 0 && !closed && <><span style={{ width: 1, height: 10, background: 'rgba(255,255,255,.3)' }} /><span>{until === 0 ? 'Starts today' : `In ${until} day${until === 1 ? '' : 's'}`}</span></>}
          </p>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, lineHeight: 1.02, color: '#fff', margin: 0, maxWidth: 900, fontFamily: "'DM Sans', 'Poppins', sans-serif", letterSpacing: '-0.01em' }}>{tripTitle(trip)}</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 22px', marginTop: 18, fontSize: 14, color: 'rgba(255,255,255,.8)' }}>
            <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {pkg.location}{pkg.state ? `, ${pkg.state}` : ''}</span>
            <span className="inline-flex items-center gap-1.5"><Calendar size={14} /> {fmtRange(trip.start_date, trip.end_date)}</span>
            {pkg.duration_days && <span className="inline-flex items-center gap-1.5"><Clock size={14} /> {pkg.duration_days}D / {pkg.duration_nights}N</span>}
            {trip.departure_city && <span>From {trip.departure_city}</span>}
          </div>
          <Link href={`/profile/${trip.creator_id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 22, textDecoration: 'none', width: 'fit-content' }}>
            <Avatar src={trip.creator?.profile_photo} name={trip.creator?.full_name} size={36} ring />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,.8)' }}>Hosted by <b style={{ color: '#fff', fontWeight: 600 }}>{trip.creator?.full_name || 'Traveller'}</b>{trip.creator?.is_verified && <ShieldCheck size={13} style={{ display: 'inline', marginLeft: 6, color: '#5bc1d5' }} />}</span>
          </Link>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-10 pt-10">
        {/* LEFT */}
        <div className="space-y-10">
          {/* Mobile: join card inline (the sticky sidebar is desktop-only) */}
          {!isCreator && (
            <Card pad={20} className="lg:hidden" style={{ borderColor: p.borderMid }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
                <div><p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: p.text, margin: 0 }}>Join this trip</p><p style={{ fontSize: 22, fontWeight: 700, color: p.text, margin: '4px 0 0' }}>{trip.price_per_person ? `₹${Number(trip.price_per_person).toLocaleString('en-IN')}` : 'On request'} <span style={{ fontSize: 12, fontWeight: 400, color: p.muted }}>per person, from</span></p></div>
                <Tag tone={toneFor(trip.status)}>{st.label}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: p.muted, marginBottom: 8 }}><span>{approved} / {trip.total_spots} travellers</span><span style={{ color: p.text, fontWeight: 600 }}>{left === 0 ? 'Full' : `${left} left`}</span></div>
              <Progress value={approved} max={trip.total_spots} />
              <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>{cta}</div>
            </Card>
          )}
          {justCreated && isCreator && (
            <Card pad={22} style={{ borderColor: p.accent, background: `${p.accent}12` }}>
              <Eyebrow color={p.accent} style={{ marginBottom: 6 }}>Your trip is live</Eyebrow>
              <p style={{ fontSize: 15, color: p.sub, margin: 0 }}>Share the link with friends or anywhere you like. Anyone who wants in sends you a request to approve.</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
                <Button size="sm" onClick={copyLink}>{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy link'}</Button>
                <Button size="sm" variant="whatsapp" href={waShare} target="_blank" rel="noopener noreferrer" style={{ borderRadius: 999 }}>{WA} Share on WhatsApp</Button>
              </div>
            </Card>
          )}
          {actionError && <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 14, color: p.bad, background: 'rgba(248,113,113,.1)', borderRadius: 10, padding: '12px 14px' }}><AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} /> {actionError}</div>}

          {/* About */}
          <section>
            <BlockTitle>About the trip</BlockTitle>
            {trip.note ? <p style={{ fontSize: 17, lineHeight: 1.9, color: p.sub, margin: 0, whiteSpace: 'pre-line' }}>{trip.note}</p> : <p style={{ fontSize: 15, color: p.faint, margin: 0 }}>The host has not written a note yet.</p>}
            {trip.vibe_tags?.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>{trip.vibe_tags.map(v => <Tag key={v} tone="accent">{v}</Tag>)}</div>}
          </section>

          {/* Rules */}
          <section>
            <BlockTitle>Trip rules</BlockTitle>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[['Group size', `${trip.total_spots} people`], ['Who can join', rule.label], ['Age', trip.age_min || trip.age_max ? `${trip.age_min || '18'}${trip.age_max ? ` – ${trip.age_max}` : '+'}` : 'Any age'], ['Price per person', trip.price_per_person ? `from ₹${Number(trip.price_per_person).toLocaleString('en-IN')}` : 'On request']].map(([k, v]) => (
                <div key={k} style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: 14 }}><Eyebrow size={10}>{k}</Eyebrow><p style={{ fontSize: 15, fontWeight: 600, color: p.text, margin: '6px 0 0' }}>{v}</p></div>
              ))}
            </div>
          </section>

          {/* Package */}
          <section>
            <BlockTitle>The package</BlockTitle>
            <Card pad={14} style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroImg} alt="" style={{ width: 120, height: 84, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontWeight: 600, color: p.text, margin: 0 }}>{pkg.title}</p>
                <p style={{ fontSize: 12, color: p.muted, margin: '4px 0 0' }}>{pkg.location}{pkg.duration_days ? ` · ${pkg.duration_days} days` : ''} · FIT package by Travel Teasing</p>
              </div>
              <Button variant="outline" size="sm" href={`/packages/${pkg.slug}`}>Itinerary & details</Button>
            </Card>
          </section>

          {/* Travellers */}
          <section>
            <BlockTitle right={<span style={{ fontSize: 13, color: p.muted }}>{approved} of {trip.total_spots}</span>}>Travellers</BlockTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {members.map(m => (
                <MemberRow key={m.user_id} m={m} p={p} isHost={m.role === 'creator'} you={user?.id === m.user_id}
                  actions={isCreator && m.role !== 'creator' && !closed ? (<>
                    {m.payment_status && <Tag tone={m.payment_status === 'paid' ? 'ok' : 'warn'}>{m.payment_status === 'paid' ? 'Paid' : 'Payment pending'}</Tag>}
                    <Button variant="danger" size="sm" disabled={busy === m.user_id} onClick={() => run(m.user_id, () => authFetch(`/api/community-trips/${trip.id}/members/${m.user_id}`, { method: 'PATCH', body: { action: 'remove' } }))} style={{ padding: '5px 12px', fontSize: 11 }}>Remove</Button>
                  </>) : null} />
              ))}
              {Array.from({ length: left }).map((_, i) => (
                <div key={`e${i}`} style={{ border: `1px dashed ${p.borderMid}`, borderRadius: 14, padding: 16, display: 'flex', alignItems: 'center', gap: 14, color: p.faint, fontSize: 13 }}><div style={{ width: 46, height: 46, borderRadius: '50%', background: p.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={18} /></div> Open spot</div>
              ))}
            </div>
          </section>

          {/* Requests */}
          {isCreator && (
            <section>
              <BlockTitle right={requests.length > 0 && <Tag tone="warn">{requests.length} pending</Tag>}>Join requests</BlockTitle>
              <p style={{ fontSize: 13, color: p.muted, margin: '-6px 0 14px' }}>Open their profile to see past trips and albums before you decide.</p>
              {requests.length === 0 ? <div style={{ background: p.surface, borderRadius: 12, padding: 24, textAlign: 'center', fontSize: 14, color: p.faint }}>No pending requests. Share the link to get more travellers.</div> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {requests.map(m => (
                    <MemberRow key={m.user_id} m={m} p={p} actions={<>
                      <Button size="sm" disabled={!!busy || left === 0} onClick={() => run(m.user_id, () => authFetch(`/api/community-trips/${trip.id}/members/${m.user_id}`, { method: 'PATCH', body: { action: 'approve' } }))}>{left === 0 ? 'Group full' : 'Approve'}</Button>
                      <Button size="sm" variant="outline" disabled={!!busy} onClick={() => run(m.user_id, () => authFetch(`/api/community-trips/${trip.id}/members/${m.user_id}`, { method: 'PATCH', body: { action: 'reject' } }))}>Decline</Button>
                    </>} />
                  ))}
                </div>
              )}
              {history.length > 0 && <p style={{ fontSize: 11, color: p.faint, marginTop: 12 }}>{history.length} earlier request{history.length === 1 ? '' : 's'} declined, removed or withdrawn.</p>}
            </section>
          )}

          <div style={{ background: p.surface, border: `1px solid ${p.border}`, borderRadius: 12, padding: 20, fontSize: 14, color: p.sub, lineHeight: 1.7 }}>
            <Eyebrow style={{ marginBottom: 8 }}>How payment works</Eyebrow>
            When the group is full, Travel Teasing messages every traveller on WhatsApp to confirm the final per-person price and collect payment. Once everyone has paid, the trip is confirmed. The host can remove anyone who does not pay.
          </div>
        </div>

        {/* RIGHT — sticky card like "Book This Tour" */}
        <div className="hidden lg:block" style={{ position: 'sticky', top: 148, height: 'fit-content' }}>
          <Card pad={0} style={{ overflow: 'hidden', borderColor: p.borderMid }}>
            <div style={{ padding: 24, borderBottom: `1px solid ${p.border}` }}>
              <p style={{ fontSize: 17, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: p.text, marginBottom: 8 }}>Join this trip</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontSize: 34, fontWeight: 700, color: p.text, letterSpacing: '-0.5px' }}>{trip.price_per_person ? `₹${Number(trip.price_per_person).toLocaleString('en-IN')}` : 'On request'}</span>
                <span style={{ fontSize: 13, color: p.muted }}>per person, from</span>
              </div>
              <div style={{ marginTop: 10 }}><Tag tone={toneFor(trip.status)}>{st.label}</Tag><span style={{ fontSize: 12, color: p.muted, marginLeft: 10 }}>{st.hint}</span></div>
            </div>
            <div style={{ padding: '20px 24px', display: 'grid', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: p.muted, marginBottom: 8 }}><span className="inline-flex items-center gap-1"><Users size={12} /> {approved} / {trip.total_spots} travellers</span><span style={{ color: p.text, fontWeight: 600 }}>{left === 0 ? 'Full' : `${left} left`}</span></div>
                <Progress value={approved} max={trip.total_spots} />
              </div>
              <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>{cta}</div>
              {!isCreator && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8, paddingTop: 16, borderTop: `1px solid ${p.border}` }}>
                  <Button variant="outline" size="sm" full onClick={copyLink}>{copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy link'}</Button>
                  <Button variant="outline" size="sm" full href={waShare} target="_blank" rel="noopener noreferrer">{WA} Share</Button>
                </div>
              )}
            </div>
          </Card>
          <a href={`https://wa.me/918510988703?text=${encodeURIComponent(`Hi! I have a question about the community trip "${tripTitle(trip)}" (${shareUrl(trip)})`)}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, padding: 14, border: `1px solid ${p.border}`, borderRadius: 14, textDecoration: 'none', color: p.text }}>
            <span style={{ width: 36, height: 36, borderRadius: '50%', background: '#25D366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageCircle size={16} /></span>
            <span style={{ fontSize: 13 }}><b>Questions?</b><br /><span style={{ color: p.muted, fontSize: 12 }}>Ask Travel Teasing on WhatsApp</span></span>
          </a>
        </div>
      </div>

      {/* MOBILE CTA — host only; non-hosts get the inline join card above */}
      {isCreator && (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-5 py-3" style={{ background: p.cardBg, borderTop: `1px solid ${p.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}><p style={{ fontSize: 10, color: p.label, margin: 0 }}>per person, from</p><p style={{ fontSize: 20, fontWeight: 700, color: p.text, margin: 0 }}>{trip.price_per_person ? `₹${Number(trip.price_per_person).toLocaleString('en-IN')}` : 'On request'}</p></div>
          <div style={{ display: 'flex', gap: 8, flex: 1.4 }}>{isCreator ? <Button variant="accent" full onClick={copyLink}>{copied ? 'Copied' : 'Copy link'}</Button> : !viewer.logged_in ? <Button variant="accent" full href={loginHref(`${CT.base}/${trip.share_code || trip.id}`)}>Log in to join</Button> : membership ? <Button variant="outline" full disabled>{membership.status === 'approved' ? 'You are in' : membership.status === 'requested' ? 'Requested' : 'Closed'}</Button> : <Button variant="accent" full onClick={() => { setJoinOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Request to join</Button>}</div>
        </div>
        {joinOpen && !isCreator && !membership && (
          <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
            <textarea rows={2} maxLength={400} value={joinMsg} onChange={e => setJoinMsg(e.target.value)} placeholder="Say hi to the host" style={{ ...input, resize: 'none' }} />
            <Button variant="accent" full disabled={busy === 'join'} onClick={() => run('join', async () => { await authFetch(`/api/community-trips/${trip.id}/join`, { method: 'POST', body: { message: joinMsg } }); setJoinOpen(false); })}>{busy === 'join' ? 'Sending…' : 'Send request'}</Button>
          </div>
        )}
      </div>
      )}

      {/* Edit modal */}
      {editOpen && editForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,.7)' }} onClick={e => e.target === e.currentTarget && setEditOpen(false)}>
          <form onSubmit={e => { e.preventDefault(); run('edit', async () => { await authFetch(`/api/community-trips/${trip.id}`, { method: 'PATCH', body: editForm }); setEditOpen(false); }); }} style={{ background: p.cardBg, border: `1px solid ${p.borderMid}`, borderRadius: 20, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: `1px solid ${p.border}` }}><p style={{ fontSize: 15, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Edit trip</p><button type="button" onClick={() => setEditOpen(false)} style={{ background: 'none', border: 'none', color: p.muted, cursor: 'pointer' }}><X size={20} /></button></div>
            <div style={{ padding: 24, display: 'grid', gap: 16 }}>
              <div><FieldLabel htmlFor="e-title">Trip name</FieldLabel><input id="e-title" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} style={input} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><FieldLabel htmlFor="e-start">Start</FieldLabel><input id="e-start" type="date" value={editForm.start_date} onChange={e => setEditForm(f => ({ ...f, start_date: e.target.value }))} style={input} /></div>
                <div><FieldLabel htmlFor="e-end">End</FieldLabel><input id="e-end" type="date" value={editForm.end_date} onChange={e => setEditForm(f => ({ ...f, end_date: e.target.value }))} style={input} /></div>
                <div><FieldLabel htmlFor="e-spots">Group size</FieldLabel><input id="e-spots" type="number" min={2} value={editForm.total_spots} onChange={e => setEditForm(f => ({ ...f, total_spots: e.target.value }))} style={input} /></div>
                <div><FieldLabel htmlFor="e-city">Departure city</FieldLabel><input id="e-city" value={editForm.departure_city} onChange={e => setEditForm(f => ({ ...f, departure_city: e.target.value }))} style={input} /></div>
                <div><FieldLabel htmlFor="e-amin">Min age</FieldLabel><input id="e-amin" type="number" value={editForm.age_min} onChange={e => setEditForm(f => ({ ...f, age_min: e.target.value }))} placeholder="Any" style={input} /></div>
                <div><FieldLabel htmlFor="e-amax">Max age</FieldLabel><input id="e-amax" type="number" value={editForm.age_max} onChange={e => setEditForm(f => ({ ...f, age_max: e.target.value }))} placeholder="Any" style={input} /></div>
              </div>
              <div><FieldLabel>Who can join</FieldLabel><div style={{ display: 'flex', gap: 8 }}>{GENDER_RULES.map(g => <Pill key={g.value} small active={editForm.gender_rule === g.value} onClick={() => setEditForm(f => ({ ...f, gender_rule: g.value }))}>{g.short}</Pill>)}</div></div>
              <div><FieldLabel>Vibe</FieldLabel><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{VIBES.map(v => <Pill key={v} small active={editForm.vibe_tags.includes(v)} onClick={() => setEditForm(f => ({ ...f, vibe_tags: f.vibe_tags.includes(v) ? f.vibe_tags.filter(x => x !== v) : f.vibe_tags.length >= 4 ? f.vibe_tags : [...f.vibe_tags, v] }))}>{v}</Pill>)}</div></div>
              <div><FieldLabel htmlFor="e-note">Note</FieldLabel><textarea id="e-note" rows={3} value={editForm.note} onChange={e => setEditForm(f => ({ ...f, note: e.target.value }))} style={{ ...input, resize: 'none' }} /></div>
              {actionError && <p style={{ fontSize: 12, color: p.bad, margin: 0 }}>{actionError}</p>}
            </div>
            <div style={{ padding: '16px 24px', borderTop: `1px solid ${p.border}`, display: 'flex', gap: 10 }}><Button variant="outline" full onClick={() => setEditOpen(false)}>Cancel</Button><Button type="submit" variant="accent" full disabled={busy === 'edit'}>{busy === 'edit' ? 'Saving…' : 'Save changes'}</Button></div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function CommunityTripPage({ params }) {
  return <Suspense fallback={<Spinner />}><TripContent params={params} /></Suspense>;
}
