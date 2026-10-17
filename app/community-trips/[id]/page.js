'use client';
import { useCallback, useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MapPin, Calendar, Users, Copy, Check, ShieldCheck, Clock, LogIn, X, Pencil, AlertTriangle, MessageCircle, ArrowLeft, Sparkles } from 'lucide-react';
import Avatar from '@/components/Avatar';
import { CT, TRIP_STATUS, GENDER_RULES, VIBES, fmtRange, tripTitle, daysUntil, shareUrl } from '@/lib/communityTrips';
import { useSession, loginHref } from '@/lib/useSession';

const inputCls = 'w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5bc1d5] bg-white';
const WA_ICON = <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;

function MemberCard({ m, isHost, you, actions }) {
  const p = m.profile || {};
  const meta = [p.age ? `${p.age} yrs` : null, p.city].filter(Boolean).join(' · ');
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3">
      <Link href={`/profile/${m.user_id}`}><Avatar src={p.profile_photo} name={p.full_name} size={48} /></Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link href={`/profile/${m.user_id}`} className="font-semibold text-[#1a1a2e] text-sm hover:underline truncate">{p.full_name || 'Traveller'}</Link>
          {p.is_verified && <ShieldCheck size={13} className="text-blue-500" />}
          {isHost && <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#1a1a2e] text-white">Host</span>}
          {you && <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#e0f4f8] text-[#1f77a3]">You</span>}
        </div>
        {meta && <p className="text-xs text-gray-500 mt-0.5">{meta}</p>}
        {p.trip_style?.length > 0 && <div className="flex flex-wrap gap-1 mt-1.5">{p.trip_style.slice(0, 4).map(s => <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{s}</span>)}</div>}
        {m.message && <p className="text-xs text-gray-700 mt-2 bg-[#fafafa] rounded-lg px-3 py-2 italic">“{m.message}”</p>}
        {!m.message && p.bio && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{p.bio}</p>}
        {actions && <div className="flex flex-wrap gap-2 mt-3">{actions}</div>}
      </div>
    </div>
  );
}

function TripContent({ params }) {
  const sp = useSearchParams();
  const justCreated = sp.get('created') === '1';
  const { user, loading: sessionLoading, authFetch } = useSession();
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
    try { setData(await authFetch(`/api/community-trips/${params.id}`)); setError(''); }
    catch (e) { setError(e.message); }
  }, [authFetch, params.id]);

  useEffect(() => { if (!sessionLoading) load(); }, [sessionLoading, load]);

  const run = async (key, fn) => {
    setBusy(key); setActionError('');
    try { await fn(); await load(); } catch (e) { setActionError(e.message); } finally { setBusy(''); }
  };

  const copyLink = async () => {
    const url = shareUrl(data.trip);
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { window.prompt('Copy this link', url); }
  };

  if (error && !data) return (
    <div className="container-max py-20 text-center">
      <p className="text-gray-500 mb-4">{error}</p>
      <Link href={CT.base} className="btn-outline text-sm">Back to {CT.label.toLowerCase()}</Link>
    </div>
  );
  if (!data) return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-[#5bc1d5] border-t-transparent rounded-full" /></div>;

  const { trip, members, requests, history, viewer } = data;
  const pkg = trip.packages || {};
  const st = TRIP_STATUS[trip.status] || TRIP_STATUS.open;
  const rule = GENDER_RULES.find(g => g.value === trip.gender_rule) || GENDER_RULES[0];
  const approved = trip.approved_count ?? members.length;
  const left = Math.max(0, trip.total_spots - approved);
  const pct = Math.min(100, Math.round((approved / trip.total_spots) * 100));
  const until = daysUntil(trip.start_date);
  const isCreator = viewer.is_creator;
  const membership = viewer.membership;
  const closed = ['cancelled', 'completed'].includes(trip.status);
  const waShare = `https://wa.me/?text=${encodeURIComponent(`Join my trip to ${pkg.location || tripTitle(trip)} on Travel Teasing: ${shareUrl(trip)}`)}`;

  const openEdit = () => {
    setEditForm({ title: trip.title || '', note: trip.note || '', start_date: trip.start_date || '', end_date: trip.end_date || '', departure_city: trip.departure_city || '', total_spots: trip.total_spots, gender_rule: trip.gender_rule, age_min: trip.age_min || '', age_max: trip.age_max || '', vibe_tags: trip.vibe_tags || [] });
    setEditOpen(true);
  };

  return (
    <div className="bg-[#fafafa] min-h-screen pb-24 lg:pb-10">
      {/* Hero */}
      <div className="relative h-[46vh] min-h-[320px] max-h-[520px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pkg.cover_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80'} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
        <div className="container-max relative h-full flex flex-col justify-end pb-8 text-white">
          <Link href={CT.base} className="absolute top-6 inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white"><ArrowLeft size={14} /> {CT.label}</Link>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full" style={{ background: st.bg, color: st.fg }}>{st.label}</span>
            {until !== null && until >= 0 && !closed && <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/15 backdrop-blur">{until === 0 ? 'Starts today' : `In ${until} day${until === 1 ? '' : 's'}`}</span>}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>{tripTitle(trip)}</h1>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-sm text-white/85">
            <span className="flex items-center gap-1.5"><MapPin size={14} /> {pkg.location}{pkg.state ? `, ${pkg.state}` : ''}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {fmtRange(trip.start_date, trip.end_date)}</span>
            {pkg.duration_days && <span className="flex items-center gap-1.5"><Clock size={14} /> {pkg.duration_days}D / {pkg.duration_nights}N</span>}
            {trip.departure_city && <span className="flex items-center gap-1.5">From {trip.departure_city}</span>}
          </div>
        </div>
      </div>

      <div className="container-max -mt-6 relative grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {justCreated && isCreator && (
            <div className="rounded-2xl p-5 text-white tt-fade-up" style={{ background: 'linear-gradient(135deg,#1f77a3,#5bc1d5)' }}>
              <p className="font-bold text-lg flex items-center gap-2"><Sparkles size={18} /> Your trip is live!</p>
              <p className="text-sm text-white/90 mt-1">Share the link with friends or anywhere you like. Anyone who wants in will send you a request to approve.</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <button onClick={copyLink} className="inline-flex items-center gap-2 bg-white text-[#1f77a3] font-semibold text-sm px-4 py-2 rounded-full">{copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy link'}</button>
                <a href={waShare} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold text-sm px-4 py-2 rounded-full">{WA_ICON} Share on WhatsApp</a>
              </div>
            </div>
          )}

          {actionError && <div className="bg-red-50 text-red-700 text-sm rounded-xl px-4 py-3 flex items-start gap-2"><AlertTriangle size={16} className="mt-0.5 flex-shrink-0" /> {actionError}</div>}

          {/* Host + note */}
          <section className="bg-white rounded-3xl border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <Link href={`/profile/${trip.creator_id}`}><Avatar src={trip.creator?.profile_photo} name={trip.creator?.full_name} size={56} /></Link>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400">Hosted by</p>
                <Link href={`/profile/${trip.creator_id}`} className="font-bold text-[#1a1a2e] text-lg hover:underline flex items-center gap-1.5">{trip.creator?.full_name || 'Traveller'}{trip.creator?.is_verified && <ShieldCheck size={15} className="text-blue-500" />}</Link>
                {trip.creator?.city && <p className="text-xs text-gray-500">{trip.creator.city}</p>}
              </div>
              <Link href={`/profile/${trip.creator_id}`} className="text-xs font-semibold text-[#1f77a3] hover:underline flex-shrink-0">View profile</Link>
            </div>
            {trip.note && <p className="text-gray-700 text-sm leading-relaxed mt-5 whitespace-pre-line">{trip.note}</p>}
          </section>

          {/* Rules */}
          <section className="bg-white rounded-3xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#1a1a2e] mb-4">Trip rules</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              {[
                { k: 'Group size', v: `${trip.total_spots} people` },
                { k: 'Who can join', v: rule.label },
                { k: 'Age', v: trip.age_min || trip.age_max ? `${trip.age_min || '18'}${trip.age_max ? ` – ${trip.age_max}` : '+'}` : 'Any age' },
                { k: 'Price per person', v: trip.price_per_person ? `from ₹${Number(trip.price_per_person).toLocaleString('en-IN')}` : 'On request' },
              ].map(r => <div key={r.k} className="bg-[#fafafa] rounded-xl p-3"><p className="text-[11px] text-gray-400 uppercase tracking-wide">{r.k}</p><p className="font-semibold text-[#1a1a2e] mt-0.5">{r.v}</p></div>)}
            </div>
            {trip.vibe_tags?.length > 0 && <div className="flex flex-wrap gap-2 mt-4">{trip.vibe_tags.map(v => <span key={v} className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: '#e0f4f8', color: '#1f77a3' }}>{v}</span>)}</div>}
          </section>

          {/* Package */}
          <section className="bg-white rounded-3xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#1a1a2e] mb-4">The package</h2>
            <div className="flex gap-4 items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pkg.cover_image} alt="" className="w-28 h-20 object-cover rounded-xl flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#1a1a2e] truncate">{pkg.title}</p>
                <p className="text-xs text-gray-500 mt-1">{pkg.location}{pkg.duration_days ? ` · ${pkg.duration_days} days` : ''} · FIT package by Travel Teasing</p>
                <Link href={`/packages/${pkg.slug}`} className="text-xs font-semibold text-[#1f77a3] hover:underline mt-2 inline-block">Itinerary, inclusions &amp; details →</Link>
              </div>
            </div>
          </section>

          {/* Travellers */}
          <section className="bg-white rounded-3xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <h2 className="font-bold text-[#1a1a2e]">Travellers <span className="text-gray-400 font-normal text-sm">{approved} of {trip.total_spots}</span></h2>
              {isCreator && !closed && <span className="text-xs text-gray-400">You can remove anyone before the trip is confirmed</span>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {members.map(m => (
                <MemberCard key={m.user_id} m={m} isHost={m.role === 'creator'} you={user?.id === m.user_id}
                  actions={isCreator && m.role !== 'creator' && !closed ? (
                    <>
                      {m.payment_status && <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${m.payment_status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{m.payment_status === 'paid' ? 'Paid' : 'Payment pending'}</span>}
                      <button disabled={busy === m.user_id} onClick={() => run(m.user_id, () => authFetch(`/api/community-trips/${trip.id}/members/${m.user_id}`, { method: 'PATCH', body: { action: 'remove' } }))} className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-red-200 text-red-600 hover:bg-red-50">Remove</button>
                    </>
                  ) : null} />
              ))}
              {Array.from({ length: left }).map((_, i) => (
                <div key={`empty-${i}`} className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex items-center gap-3 text-gray-400 text-sm"><div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center"><Users size={18} /></div> Open spot</div>
              ))}
            </div>
          </section>

          {/* Requests (creator only) */}
          {isCreator && (
            <section className="bg-white rounded-3xl border border-gray-100 p-6">
              <h2 className="font-bold text-[#1a1a2e] mb-1">Join requests {requests.length > 0 && <span className="ml-1 text-xs font-bold px-2 py-0.5 rounded-full bg-[#E8651A] text-white">{requests.length}</span>}</h2>
              <p className="text-xs text-gray-500 mb-4">Open their profile to see past trips and albums before you decide.</p>
              {requests.length === 0 ? <p className="text-sm text-gray-400 py-6 text-center bg-[#fafafa] rounded-xl">No pending requests. Share the link to get more travellers.</p> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {requests.map(m => (
                    <MemberCard key={m.user_id} m={m} actions={
                      <>
                        <button disabled={!!busy || left === 0} onClick={() => run(m.user_id, () => authFetch(`/api/community-trips/${trip.id}/members/${m.user_id}`, { method: 'PATCH', body: { action: 'approve' } }))} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#1a1a2e] text-white disabled:opacity-40">{left === 0 ? 'Group full' : 'Approve'}</button>
                        <button disabled={!!busy} onClick={() => run(m.user_id, () => authFetch(`/api/community-trips/${trip.id}/members/${m.user_id}`, { method: 'PATCH', body: { action: 'reject' } }))} className="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-gray-400">Decline</button>
                      </>
                    } />
                  ))}
                </div>
              )}
              {history.length > 0 && <p className="text-[11px] text-gray-400 mt-4">{history.length} earlier request{history.length === 1 ? '' : 's'} declined, removed or withdrawn.</p>}
            </section>
          )}

          <div className="bg-[#e0f4f8] rounded-2xl p-5 text-sm text-[#1f3f4a]">
            <b>How payment works.</b> When the group is full, Travel Teasing messages every traveller on WhatsApp to confirm the final per-person price and collect payment. Once everyone has paid, the trip is confirmed. The host can remove anyone who does not pay.
          </div>
        </div>

        {/* RIGHT */}
        <aside className="lg:sticky lg:top-28 h-fit space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-end justify-between gap-3 mb-1">
              <div>
                <p className="text-[11px] text-gray-400">per person, from</p>
                <p className="text-3xl font-bold text-[#1a1a2e]">{trip.price_per_person ? `₹${Number(trip.price_per_person).toLocaleString('en-IN')}` : 'On request'}</p>
              </div>
              <p className="text-xs font-semibold text-right" style={{ color: st.fg }}>{st.hint}</p>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1"><span className="flex items-center gap-1"><Users size={12} /> {approved} / {trip.total_spots} travellers</span><span className="font-semibold text-[#1f77a3]">{left === 0 ? 'Full' : `${left} left`}</span></div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden"><div className="h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#5bc1d5,#1f77a3)' }} /></div>
            </div>

            <div className="mt-5 space-y-2">
              {isCreator ? (
                <>
                  <button onClick={copyLink} className="btn-primary w-full justify-center text-sm">{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Link copied' : 'Copy share link'}</button>
                  <a href={waShare} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold text-sm py-3 rounded-full">{WA_ICON} Share on WhatsApp</a>
                  {!closed && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button onClick={openEdit} className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-full border border-gray-200 hover:border-gray-400"><Pencil size={13} /> Edit rules</button>
                      {confirmCancel ? (
                        <button disabled={busy === 'cancel'} onClick={() => run('cancel', () => authFetch(`/api/community-trips/${trip.id}`, { method: 'PATCH', body: { action: 'cancel' } }))} className="text-xs font-semibold py-2.5 rounded-full bg-red-600 text-white">Yes, cancel trip</button>
                      ) : (
                        <button onClick={() => setConfirmCancel(true)} className="text-xs font-semibold py-2.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50">Cancel trip</button>
                      )}
                    </div>
                  )}
                  {confirmCancel && <button onClick={() => setConfirmCancel(false)} className="w-full text-[11px] text-gray-400 hover:text-gray-600">Keep the trip</button>}
                </>
              ) : !viewer.logged_in ? (
                <>
                  <Link href={loginHref(`${CT.base}/${trip.share_code || trip.id}`)} className="btn-primary w-full justify-center text-sm"><LogIn size={16} /> Log in to request a spot</Link>
                  <p className="text-[11px] text-gray-400 text-center">New here? <Link href="/signup" className="text-[#1f77a3] font-semibold">Create an account</Link></p>
                </>
              ) : membership?.status === 'approved' ? (
                <>
                  <div className="rounded-xl bg-green-50 text-green-800 text-sm px-4 py-3 font-semibold flex items-center gap-2"><Check size={16} /> You&apos;re on this trip</div>
                  <p className="text-xs text-gray-500">Payment: <b className={membership.payment_status === 'paid' ? 'text-green-700' : 'text-amber-700'}>{membership.payment_status === 'paid' ? 'received' : 'pending — we will message you on WhatsApp'}</b></p>
                  {!closed && (confirmLeave
                    ? <button disabled={busy === 'leave'} onClick={() => run('leave', () => authFetch(`/api/community-trips/${trip.id}/join`, { method: 'DELETE' }))} className="w-full text-xs font-semibold py-2.5 rounded-full bg-red-600 text-white">Yes, leave the trip</button>
                    : <button onClick={() => setConfirmLeave(true)} className="w-full text-xs font-semibold py-2.5 rounded-full border border-gray-200 text-gray-600 hover:border-gray-400">Leave trip</button>)}
                </>
              ) : membership?.status === 'requested' ? (
                <>
                  <div className="rounded-xl bg-amber-50 text-amber-800 text-sm px-4 py-3 font-semibold">Request sent. Waiting for {(trip.creator?.full_name || 'the host').split(' ')[0]} to approve.</div>
                  <button disabled={busy === 'withdraw'} onClick={() => run('withdraw', () => authFetch(`/api/community-trips/${trip.id}/join`, { method: 'DELETE' }))} className="w-full text-xs font-semibold py-2.5 rounded-full border border-gray-200 text-gray-600 hover:border-gray-400">Withdraw request</button>
                </>
              ) : ['rejected', 'removed'].includes(membership?.status) ? (
                <div className="rounded-xl bg-gray-100 text-gray-600 text-sm px-4 py-3">The host has closed this trip to you.</div>
              ) : trip.status !== 'open' ? (
                <div className="rounded-xl bg-gray-100 text-gray-600 text-sm px-4 py-3">{st.hint}. Not accepting new requests.</div>
              ) : joinOpen ? (
                <div className="space-y-2">
                  <textarea id="join-msg" rows={3} maxLength={400} value={joinMsg} onChange={e => setJoinMsg(e.target.value)} placeholder="Say hi — why do you want in, what's your travel style?" className={`${inputCls} resize-none`} />
                  <button disabled={busy === 'join'} onClick={() => run('join', async () => { await authFetch(`/api/community-trips/${trip.id}/join`, { method: 'POST', body: { message: joinMsg } }); setJoinOpen(false); })} className="btn-primary w-full justify-center text-sm">{busy === 'join' ? 'Sending…' : 'Send request'}</button>
                  <button onClick={() => setJoinOpen(false)} className="w-full text-[11px] text-gray-400 hover:text-gray-600">Not now</button>
                </div>
              ) : (
                <>
                  <button onClick={() => setJoinOpen(true)} className="btn-primary w-full justify-center text-sm"><Users size={16} /> Request to join</button>
                  <p className="text-[11px] text-gray-400 text-center">The host sees your profile and past trips before approving.</p>
                </>
              )}
            </div>

            {!isCreator && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button onClick={copyLink} className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-full border border-gray-200 hover:border-gray-400">{copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy link'}</button>
                <a href={waShare} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-full border border-gray-200 hover:border-gray-400">{WA_ICON} Share</a>
              </div>
            )}
          </div>

          <a href={`https://wa.me/918510988703?text=${encodeURIComponent(`Hi! I have a question about the community trip "${tripTitle(trip)}" (${shareUrl(trip)})`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 text-sm hover:border-gray-300">
            <span className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center"><MessageCircle size={16} /></span>
            <span><b className="text-[#1a1a2e]">Questions?</b><br /><span className="text-gray-500 text-xs">Ask Travel Teasing on WhatsApp</span></span>
          </a>
        </aside>
      </div>

      {/* Edit modal */}
      {editOpen && editForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60" onClick={e => e.target === e.currentTarget && setEditOpen(false)}>
          <form onSubmit={e => { e.preventDefault(); run('edit', async () => { await authFetch(`/api/community-trips/${trip.id}`, { method: 'PATCH', body: editForm }); setEditOpen(false); }); }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white rounded-t-3xl"><h3 className="font-bold text-[#1a1a2e]">Edit trip</h3><button type="button" onClick={() => setEditOpen(false)} className="text-gray-400 hover:text-gray-700"><X size={20} /></button></div>
            <div className="px-6 py-5 space-y-4">
              <div><label htmlFor="e-title" className="block text-xs font-semibold text-gray-600 mb-1">Trip name</label><input id="e-title" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} className={inputCls} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label htmlFor="e-start" className="block text-xs font-semibold text-gray-600 mb-1">Start</label><input id="e-start" type="date" value={editForm.start_date} onChange={e => setEditForm(f => ({ ...f, start_date: e.target.value }))} className={inputCls} /></div>
                <div><label htmlFor="e-end" className="block text-xs font-semibold text-gray-600 mb-1">End</label><input id="e-end" type="date" value={editForm.end_date} onChange={e => setEditForm(f => ({ ...f, end_date: e.target.value }))} className={inputCls} /></div>
                <div><label htmlFor="e-spots" className="block text-xs font-semibold text-gray-600 mb-1">Group size</label><input id="e-spots" type="number" min={2} value={editForm.total_spots} onChange={e => setEditForm(f => ({ ...f, total_spots: e.target.value }))} className={inputCls} /></div>
                <div><label htmlFor="e-city" className="block text-xs font-semibold text-gray-600 mb-1">Departure city</label><input id="e-city" value={editForm.departure_city} onChange={e => setEditForm(f => ({ ...f, departure_city: e.target.value }))} className={inputCls} /></div>
                <div><label htmlFor="e-amin" className="block text-xs font-semibold text-gray-600 mb-1">Min age</label><input id="e-amin" type="number" value={editForm.age_min} onChange={e => setEditForm(f => ({ ...f, age_min: e.target.value }))} className={inputCls} placeholder="Any" /></div>
                <div><label htmlFor="e-amax" className="block text-xs font-semibold text-gray-600 mb-1">Max age</label><input id="e-amax" type="number" value={editForm.age_max} onChange={e => setEditForm(f => ({ ...f, age_max: e.target.value }))} className={inputCls} placeholder="Any" /></div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1.5">Who can join</p>
                <div className="flex gap-2">{GENDER_RULES.map(g => <button type="button" key={g.value} onClick={() => setEditForm(f => ({ ...f, gender_rule: g.value }))} className={`flex-1 text-xs font-semibold py-2 rounded-lg border ${editForm.gender_rule === g.value ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' : 'border-gray-200'}`}>{g.short}</button>)}</div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1.5">Vibe</p>
                <div className="flex flex-wrap gap-1.5">{VIBES.map(v => <button type="button" key={v} onClick={() => setEditForm(f => ({ ...f, vibe_tags: f.vibe_tags.includes(v) ? f.vibe_tags.filter(x => x !== v) : f.vibe_tags.length >= 4 ? f.vibe_tags : [...f.vibe_tags, v] }))} className={`px-3 py-1 rounded-full text-xs font-semibold border ${editForm.vibe_tags.includes(v) ? 'bg-[#5bc1d5] border-[#5bc1d5] text-white' : 'border-gray-200 text-gray-600'}`}>{v}</button>)}</div>
              </div>
              <div><label htmlFor="e-note" className="block text-xs font-semibold text-gray-600 mb-1">Note</label><textarea id="e-note" rows={3} value={editForm.note} onChange={e => setEditForm(f => ({ ...f, note: e.target.value }))} className={`${inputCls} resize-none`} /></div>
              {actionError && <p className="text-red-600 text-xs">{actionError}</p>}
            </div>
            <div className="px-6 py-4 border-t flex gap-3"><button type="button" onClick={() => setEditOpen(false)} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-full text-sm font-semibold">Cancel</button><button type="submit" disabled={busy === 'edit'} className="flex-1 btn-primary justify-center text-sm py-2.5">{busy === 'edit' ? 'Saving…' : 'Save changes'}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function CommunityTripPage({ params }) {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-[#5bc1d5] border-t-transparent rounded-full" /></div>}>
      <TripContent params={params} />
    </Suspense>
  );
}
