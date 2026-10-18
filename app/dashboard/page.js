'use client';
import { useCallback, useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Globe, Lock, Upload, Trash2, Star, X, Camera, ArrowRight, Pencil, AlertCircle } from 'lucide-react';
import { useSession, loginHref } from '@/lib/useSession';
import { CT, TRIP_STATUS } from '@/lib/communityTrips';
import CommunityTripCard from '@/components/CommunityTripCard';
import AlbumCard from '@/components/AlbumCard';
import AlbumLightbox from '@/components/AlbumLightbox';
import Avatar from '@/components/Avatar';
import { usePalette, Card, Eyebrow, FieldLabel, inputStyle, Button, Pill, Tag, SectionTitle, Spinner } from '@/components/ui';

const INDIAN_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jammu & Kashmir','Jharkhand','Karnataka','Kerala','Ladakh','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];
const TRIP_TYPES = ['Solo', 'Group', 'Family', 'Sacred', 'Adventure', 'Corporate'];
const TRIP_STYLES = ['Adventure', 'Chill', 'Party', 'Cultural', 'Spiritual', 'Luxury', 'Budget', 'Photography', 'Trekking', 'Road Trip'];
const TABS = [['overview', 'Overview'], ['trips', 'My Trips'], ['gallery', 'Gallery'], ['settings', 'Settings']];
const todayStr = () => new Date().toISOString().slice(0, 10);

function Toggle({ on, onChange, label, busy }) {
  const p = usePalette();
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} disabled={busy} onClick={onChange}
      style={{ position: 'relative', width: 42, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer', background: on ? p.accent : (p.dark ? 'rgba(255,255,255,.18)' : '#d1d5db'), transition: 'background .2s', opacity: busy ? .6 : 1 }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .2s' }} />
    </button>
  );
}

function Modal({ title, onClose, children, wide }) {
  const p = usePalette();
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6" style={{ background: 'rgba(0,0,0,.7)' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: p.cardBg, border: `1px solid ${p.borderMid}`, borderRadius: 20, width: '100%', maxWidth: wide ? 1100 : 560, maxHeight: '92vh', display: 'flex', flexDirection: 'column', color: p.text, fontFamily: p.font }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: `1px solid ${p.border}`, flexShrink: 0 }}>
          <p style={{ fontSize: 15, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{title}</p>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: p.muted, cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}

/* ── Album manager ── */
function AlbumManager({ album, authFetch, onChange, onClose }) {
  const p = usePalette(); const input = inputStyle(p);
  const [busy, setBusy] = useState(''); const [err, setErr] = useState(''); const [lightbox, setLightbox] = useState(null);
  const [editing, setEditing] = useState(false); const [confirmDelete, setConfirmDelete] = useState(false); const [dragging, setDragging] = useState(false);
  const [form, setForm] = useState({ destination: album.destination || '', state: album.state || '', trip_type: album.trip_type || '', travel_date_from: album.travel_date_from || '', travel_date_to: album.travel_date_to || '', caption: album.caption || '' });
  const fileRef = useRef(null);
  const photos = album.photos || [];

  const upload = async (fileList) => {
    const files = Array.from(fileList || []).filter(f => f.type.startsWith('image/'));
    if (!files.length) return;
    setBusy('upload'); setErr('');
    try { const fd = new FormData(); files.slice(0, 20).forEach(f => fd.append('files', f)); const d = await authFetch(`/api/profile/trips/${album.id}/photos`, { method: 'POST', body: fd }); if (d.errors?.length) setErr(d.errors.join(' · ')); await onChange(); }
    catch (e) { setErr(e.message); } finally { setBusy(''); if (fileRef.current) fileRef.current.value = ''; }
  };
  const act = async (key, fn) => { setBusy(key); setErr(''); try { await fn(); await onChange(); } catch (e) { setErr(e.message); } finally { setBusy(''); } };

  return (
    <Modal title={album.destination} onClose={onClose} wide>
      <div style={{ padding: 24, display: 'grid', gap: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Toggle on={album.is_public !== false} busy={busy === 'vis'} label="Album visibility" onChange={() => act('vis', () => authFetch(`/api/profile/trips/${album.id}`, { method: 'PATCH', body: { is_public: album.is_public === false } }))} />
            <span style={{ fontSize: 14, color: p.sub, display: 'flex', alignItems: 'center', gap: 6 }}>{album.is_public !== false ? <><Globe size={14} color={p.accent} /> Public, visible on your profile</> : <><Lock size={14} /> Private, only you can see this</>}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" size="sm" onClick={() => setEditing(e => !e)}><Pencil size={13} /> Details</Button>
            {confirmDelete
              ? <Button variant="danger" size="sm" disabled={busy === 'del'} onClick={() => act('del', async () => { await authFetch(`/api/profile/trips/${album.id}`, { method: 'DELETE' }); onClose(); })} style={{ background: p.bad, color: '#fff' }}>Delete album & {photos.length} photos</Button>
              : <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}><Trash2 size={13} /> Delete</Button>}
          </div>
        </div>

        {editing && (
          <form onSubmit={e => { e.preventDefault(); act('edit', async () => { await authFetch(`/api/profile/trips/${album.id}`, { method: 'PATCH', body: form }); setEditing(false); }); }} style={{ background: p.surface, borderRadius: 14, padding: 18 }} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2"><FieldLabel htmlFor="al-dest">Album name / destination</FieldLabel><input id="al-dest" required value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} style={input} /></div>
            <div><FieldLabel htmlFor="al-state">State</FieldLabel><select id="al-state" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} style={input}><option value="">Select</option>{INDIAN_STATES.map(s => <option key={s}>{s}</option>)}</select></div>
            <div><FieldLabel htmlFor="al-type">Trip type</FieldLabel><select id="al-type" value={form.trip_type} onChange={e => setForm(f => ({ ...f, trip_type: e.target.value }))} style={input}><option value="">Select</option>{TRIP_TYPES.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}</select></div>
            <div><FieldLabel htmlFor="al-from">From</FieldLabel><input id="al-from" type="date" value={form.travel_date_from || ''} onChange={e => setForm(f => ({ ...f, travel_date_from: e.target.value }))} style={input} /></div>
            <div><FieldLabel htmlFor="al-to">To</FieldLabel><input id="al-to" type="date" value={form.travel_date_to || ''} onChange={e => setForm(f => ({ ...f, travel_date_to: e.target.value }))} style={input} /></div>
            <div className="sm:col-span-2"><FieldLabel htmlFor="al-cap">Caption</FieldLabel><textarea id="al-cap" rows={2} value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} style={{ ...input, resize: 'none' }} /></div>
            <div className="sm:col-span-2" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}><Button variant="outline" size="sm" onClick={() => setEditing(false)}>Cancel</Button><Button type="submit" size="sm" disabled={busy === 'edit'}>Save</Button></div>
          </form>
        )}

        <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files); }}
          style={{ borderRadius: 14, border: `1px dashed ${dragging ? p.accent : p.borderMid}`, background: dragging ? `${p.accent}10` : 'transparent', padding: 28, textAlign: 'center', transition: 'all .2s' }}>
          <input ref={fileRef} id={`al-files-${album.id}`} type="file" accept="image/*" multiple hidden onChange={e => upload(e.target.files)} />
          <Upload size={20} color={p.accent} style={{ margin: '0 auto 8px' }} />
          <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{busy === 'upload' ? 'Uploading…' : <>Drop photos here or <button type="button" onClick={() => fileRef.current?.click()} style={{ color: p.accent, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: p.font, fontWeight: 600 }}>choose files</button></>}</p>
          <p style={{ fontSize: 11, color: p.faint, margin: '6px 0 0' }}>Up to 20 photos at a time, 8 MB each. JPG, PNG, WEBP, HEIC.</p>
        </div>
        {err && <p style={{ fontSize: 12, color: p.bad, margin: 0 }}>{err}</p>}

        {photos.length === 0 ? <p style={{ fontSize: 14, color: p.faint, textAlign: 'center', padding: 24, margin: 0 }}>No photos yet. Add your first ones above.</p> : (
          <div style={{ columns: '3 200px', columnGap: 10 }}>
            {photos.map((ph, i) => (
              <div key={ph.id} className="group" style={{ position: 'relative', marginBottom: 10, breakInside: 'avoid', borderRadius: 12, overflow: 'hidden', background: p.surface }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ph.url} alt={ph.caption || ''} loading="lazy" onClick={() => setLightbox(i)} className="w-full block cursor-zoom-in transition-transform duration-500 group-hover:scale-[1.03]" />
                {album.cover_photo === ph.url && <span style={{ position: 'absolute', top: 8, left: 8 }}><Tag tone="onImage"><Star size={9} /> Cover</Tag></span>}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 8, display: 'flex', justifyContent: 'flex-end', gap: 6, background: 'linear-gradient(to top, rgba(0,0,0,.6), transparent)' }}>
                  {album.cover_photo !== ph.url && <button title="Set as cover" onClick={() => act(ph.id, () => authFetch(`/api/profile/trips/${album.id}/photos/${ph.id}`, { method: 'PATCH', body: { set_cover: true } }))} style={{ width: 30, height: 30, borderRadius: '50%', background: '#fff', border: 'none', color: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Star size={13} /></button>}
                  <button title="Delete photo" onClick={() => act(ph.id, () => authFetch(`/api/profile/trips/${album.id}/photos/${ph.id}`, { method: 'DELETE' }))} style={{ width: 30, height: 30, borderRadius: '50%', background: '#fff', border: 'none', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {lightbox !== null && <AlbumLightbox photos={photos} index={lightbox} title={album.destination} onClose={() => setLightbox(null)} />}
    </Modal>
  );
}

/* ── New album ── */
function NewAlbumModal({ authFetch, onCreated, onClose }) {
  const p = usePalette(); const input = inputStyle(p);
  const [form, setForm] = useState({ destination: '', state: '', trip_type: '', travel_date_from: '', travel_date_to: '', caption: '', is_public: true, booked_through_platform: false });
  const [files, setFiles] = useState([]); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr('');
    try {
      const d = await authFetch('/api/profile/trips/add', { method: 'POST', body: form });
      if (files.length && d.trip?.id) { const fd = new FormData(); files.slice(0, 20).forEach(f => fd.append('files', f)); await authFetch(`/api/profile/trips/${d.trip.id}/photos`, { method: 'POST', body: fd }); }
      onCreated(d.new_badges || []);
    } catch (e2) { setErr(e2.message); setBusy(false); }
  }
  return (
    <Modal title="New album" onClose={onClose}>
      <form onSubmit={submit} style={{ padding: 24, display: 'grid', gap: 16 }}>
        <div><FieldLabel htmlFor="na-dest">Album name / destination *</FieldLabel><input id="na-dest" required autoFocus value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} placeholder="e.g. Manali, Spiti, Goa" style={input} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><FieldLabel htmlFor="na-state">State</FieldLabel><select id="na-state" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} style={input}><option value="">Select</option>{INDIAN_STATES.map(s => <option key={s}>{s}</option>)}</select></div>
          <div><FieldLabel htmlFor="na-type">Trip type</FieldLabel><select id="na-type" value={form.trip_type} onChange={e => setForm(f => ({ ...f, trip_type: e.target.value }))} style={input}><option value="">Select</option>{TRIP_TYPES.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}</select></div>
          <div><FieldLabel htmlFor="na-from">From</FieldLabel><input id="na-from" type="date" value={form.travel_date_from} onChange={e => setForm(f => ({ ...f, travel_date_from: e.target.value }))} style={input} /></div>
          <div><FieldLabel htmlFor="na-to">To</FieldLabel><input id="na-to" type="date" value={form.travel_date_to} onChange={e => setForm(f => ({ ...f, travel_date_to: e.target.value }))} style={input} /></div>
        </div>
        <div><FieldLabel htmlFor="na-cap">Caption</FieldLabel><textarea id="na-cap" rows={2} value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} placeholder="A line about this trip" style={{ ...input, resize: 'none' }} /></div>
        <div>
          <FieldLabel htmlFor="na-files">Photos</FieldLabel>
          <input id="na-files" type="file" accept="image/*" multiple onChange={e => setFiles(Array.from(e.target.files || []))} style={{ fontSize: 13, color: p.muted }} />
          {files.length > 0 && <p style={{ fontSize: 11, color: p.faint, margin: '6px 0 0' }}>{files.length} photo{files.length === 1 ? '' : 's'} selected. You can add more later.</p>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: p.surface, borderRadius: 12, padding: '12px 14px' }}>
          <span style={{ fontSize: 14, color: p.sub, display: 'flex', alignItems: 'center', gap: 8 }}>{form.is_public ? <Globe size={15} color={p.accent} /> : <Lock size={15} />} {form.is_public ? 'Public, shown on your profile' : 'Private, only you'}</span>
          <Toggle on={form.is_public} label="Public album" onChange={() => setForm(f => ({ ...f, is_public: !f.is_public }))} />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: p.sub, cursor: 'pointer' }}><input type="checkbox" checked={form.booked_through_platform} onChange={e => setForm(f => ({ ...f, booked_through_platform: e.target.checked }))} style={{ width: 16, height: 16, accentColor: p.accent }} /> This trip was booked through Travel Teasing</label>
        {err && <p style={{ fontSize: 12, color: p.bad, margin: 0 }}>{err}</p>}
        <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}><Button variant="outline" full onClick={onClose}>Cancel</Button><Button type="submit" variant="accent" full disabled={busy}>{busy ? 'Creating…' : 'Create album'}</Button></div>
      </form>
    </Modal>
  );
}

/* ── Dashboard ── */
function DashboardContent() {
  const router = useRouter(); const sp = useSearchParams();
  const tab = TABS.some(t => t[0] === sp.get('tab')) ? sp.get('tab') : 'overview';
  const { user, loading: sessionLoading, authFetch } = useSession();
  const p = usePalette(); const input = inputStyle(p);
  const [data, setData] = useState(null); const [newAlbum, setNewAlbum] = useState(false); const [openAlbumId, setOpenAlbumId] = useState(null);
  const [newBadges, setNewBadges] = useState([]); const [tripsSub, setTripsSub] = useState('upcoming');
  const [settingsForm, setSettingsForm] = useState({}); const [settingsSaving, setSettingsSaving] = useState(false); const [settingsMsg, setSettingsMsg] = useState(''); const [visBusy, setVisBusy] = useState('');

  const load = useCallback(async () => { const d = await authFetch('/api/profile'); setData(d); setSettingsForm(f => (Object.keys(f).length ? f : (d.profile || {}))); }, [authFetch]);
  useEffect(() => { if (sessionLoading) return; if (!user) { router.replace(loginHref('/dashboard')); return; } load().catch(() => {}); }, [sessionLoading, user, router, load]);
  const setTab = (id) => router.replace(`/dashboard?tab=${id}`, { scroll: false });

  const derived = useMemo(() => {
    if (!data) return null;
    const today = todayStr(); const ct = data.community_trips || []; const live = ['open', 'full', 'confirmed'];
    const upcoming = ct.filter(t => t.my_status === 'approved' && live.includes(t.status) && (t.end_date || t.start_date) >= today);
    const requested = ct.filter(t => t.my_status === 'requested' && live.includes(t.status) && t.start_date >= today);
    const past = ct.filter(t => !upcoming.includes(t) && !requested.includes(t));
    const hosted = ct.filter(t => t.my_role === 'creator');
    const pendingRequests = hosted.reduce((n, t) => n + (t.pending_requests || 0), 0);
    const albums = data.trips || []; const photos = albums.reduce((n, a) => n + (a.photos?.length || 0), 0); const states = [...new Set(albums.map(a => a.state).filter(Boolean))];
    return { upcoming, requested, past, hosted, pendingRequests, albums, photos, states };
  }, [data]);

  async function saveSettings(e) {
    e.preventDefault(); setSettingsSaving(true); setSettingsMsg('');
    try { const { full_name, city, bio, instagram_handle, profile_photo, gender, date_of_birth, trip_style } = settingsForm; await authFetch('/api/profile/update', { method: 'POST', body: { full_name, city, bio, instagram_handle, profile_photo, gender, date_of_birth: date_of_birth || null, trip_style } }); setSettingsMsg('Saved'); await load(); }
    catch (err) { setSettingsMsg(err.message); } finally { setSettingsSaving(false); setTimeout(() => setSettingsMsg(''), 2500); }
  }
  async function toggleVisibility(album) { setVisBusy(album.id); try { await authFetch(`/api/profile/trips/${album.id}`, { method: 'PATCH', body: { is_public: album.is_public === false } }); await load(); } catch {} finally { setVisBusy(''); } }

  if (sessionLoading || !user || !data || !derived) return <Spinner />;
  const { profile } = data; const openAlbum = derived.albums.find(a => a.id === openAlbumId); const first = profile?.full_name?.split(' ')[0] || 'Traveller';
  const tripList = tripsSub === 'upcoming' ? derived.upcoming : tripsSub === 'requested' ? derived.requested : derived.past;
  const pillCls = (on) => `inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${on ? 'border-gray-800 bg-gray-800 text-white shadow-sm' : 'border-neutral-200 bg-white text-neutral-700 shadow-sm hover:border-neutral-300 hover:text-neutral-900'}`;

  return (
    <div style={{ background: p.pageBg, minHeight: '100vh', fontFamily: p.font, color: p.text }}>
      <section className="bg-white">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-6 pb-10">
          {/* Header */}
          <div className="flex flex-wrap items-end justify-between gap-6 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-5">
              <Avatar src={profile?.profile_photo} name={profile?.full_name} size={72} />
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#5bc1d5] mb-1">Dashboard</p>
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-800" style={{ fontFamily: "'DM Sans', sans-serif" }}>Hey <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 600 }}>{first}</span></h1>
                <p className="text-sm text-gray-500 mt-1">{data.email} · <Link href={`/profile/${user.id}`} className="underline underline-offset-4 hover:text-gray-900">View public profile</Link></p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link href={`${CT.base}/new`} className={pillCls(true)}><Plus size={15} /> Create a trip</Link>
              <button onClick={() => setNewAlbum(true)} className={pillCls(false)}><Camera size={15} /> New album</button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto scrollbar-hide pb-1">
            {TABS.map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} className={pillCls(tab === id)}>
                {label}{id === 'trips' && derived.pendingRequests > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#E8651A', color: '#fff' }}>{derived.pendingRequests}</span>}
              </button>
            ))}
          </div>

          <div className="mt-10">
            {/* OVERVIEW */}
            {tab === 'overview' && (
              <div className="space-y-14">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[['Upcoming trips', derived.upcoming.length, 'trips'], ['Albums', derived.albums.length, 'gallery'], ['Photos', derived.photos, 'gallery'], ['Badges', (data.badges || []).length, 'overview']].map(([label, value, to]) => (
                    <button key={label} onClick={() => setTab(to)} className="text-left rounded-2xl border border-gray-100 bg-white p-6 transition hover:-translate-y-0.5">
                      <p className="text-3xl font-bold text-[#1a1a1a] tabular-nums" style={{ fontFamily: "'DM Sans', sans-serif" }}>{value}</p>
                      <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-gray-500 mt-2">{label}</p>
                    </button>
                  ))}
                </div>

                {derived.pendingRequests > 0 && (
                  <Card pad={22} style={{ borderColor: p.accent, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><AlertCircle size={20} color={p.accent} /><div><p style={{ fontWeight: 600, margin: 0 }}>{derived.pendingRequests} traveller{derived.pendingRequests === 1 ? ' wants' : 's want'} to join your trip{derived.hosted.filter(t => t.pending_requests).length > 1 ? 's' : ''}</p><p style={{ fontSize: 13, color: p.muted, margin: 0 }}>Review their profiles and approve the ones whose vibe fits.</p></div></div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{derived.hosted.filter(t => t.pending_requests).map(t => <Button key={t.id} size="sm" href={`${CT.base}/${t.share_code || t.id}`}>{t.title || t.packages?.title} · {t.pending_requests} <ArrowRight size={13} /></Button>)}</div>
                  </Card>
                )}

                <div>
                  <div className="flex items-end justify-between gap-4 mb-6 flex-wrap"><SectionTitle align="left" italic="Next" rest="up" sub={derived.upcoming.length ? 'Trips you are hosting or have been approved for.' : null} />{derived.upcoming.length > 0 && <button onClick={() => setTab('trips')} className={pillCls(false)}>All trips <ArrowRight size={14} /></button>}</div>
                  {derived.upcoming.length === 0 ? (
                    <Card pad={40} style={{ textAlign: 'center' }}><Eyebrow color={p.accent} style={{ marginBottom: 10 }}>Nothing upcoming</Eyebrow><p style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>No trips on the calendar yet</p><p style={{ fontSize: 14, color: p.muted, margin: '8px auto 20px', maxWidth: 440 }}>Create a trip on any FIT package and invite friends, or join one that other travellers are planning.</p><div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}><Button href={`${CT.base}/new`}><Plus size={14} /> Create a trip</Button><Button variant="outline" href={CT.base}>Browse {CT.label.toLowerCase()}</Button></div></Card>
                  ) : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">{derived.upcoming.slice(0, 4).map(t => <CommunityTripCard key={t.id} trip={t} badge={t.my_role === 'creator' ? 'You host' : "You're in"} />)}</div>}
                </div>

                <div>
                  <div className="flex items-end justify-between gap-4 mb-6 flex-wrap"><SectionTitle align="left" italic="Your" rest="gallery" /><button onClick={() => setTab('gallery')} className={pillCls(false)}>Manage <ArrowRight size={14} /></button></div>
                  {derived.albums.length === 0 ? (
                    <button onClick={() => setNewAlbum(true)} className="w-full rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center transition hover:border-[#5bc1d5]"><Camera size={22} className="mx-auto text-[#5bc1d5] mb-3" /><p className="font-semibold text-gray-800">Create your first album</p><p className="text-sm text-gray-500 mt-1">Name it after the place, add your photos, choose what the world sees.</p></button>
                  ) : <div className="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-5 gap-5">{derived.albums.slice(0, 5).map(a => <AlbumCard key={a.id} album={a} showVisibility onOpen={() => setOpenAlbumId(a.id)} />)}</div>}
                </div>

                {(data.badges || []).length > 0 && (
                  <div><SectionTitle align="left" italic="Badges" rest="earned" className="mb-6" /><div className="flex flex-wrap gap-3">{data.badges.map(b => <Card key={b.id} pad={14} style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 240 }}><span style={{ fontSize: 24 }}>{b.badges?.icon}</span><div><p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>{b.badges?.name}</p><p style={{ fontSize: 12, color: p.muted, margin: 0 }}>{b.badges?.description}</p></div></Card>)}</div></div>
                )}
              </div>
            )}

            {/* MY TRIPS */}
            {tab === 'trips' && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
                  <div className="flex gap-2">{[['upcoming', `Upcoming · ${derived.upcoming.length}`], ['requested', `Requested · ${derived.requested.length}`], ['past', `Past · ${derived.past.length}`]].map(([id, label]) => <button key={id} onClick={() => setTripsSub(id)} className={pillCls(tripsSub === id)}>{label}</button>)}</div>
                  <Link href={`${CT.base}/new`} className={pillCls(false)}><Plus size={15} /> Create a trip</Link>
                </div>
                {tripList.length === 0 ? (
                  <Card pad={40} style={{ textAlign: 'center' }}><p style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{tripsSub === 'upcoming' ? 'Nothing upcoming' : tripsSub === 'requested' ? 'No pending requests' : 'No past trips yet'}</p><p style={{ fontSize: 14, color: p.muted, margin: '8px 0 20px' }}>{tripsSub === 'past' ? 'Completed trips land here, and an album is started for you automatically.' : 'Find a trip that matches your vibe or start your own.'}</p><Button variant="outline" href={CT.base}>Browse {CT.label.toLowerCase()}</Button></Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {tripList.map(t => (
                      <CommunityTripCard key={t.id} trip={t} badge={t.my_role === 'creator' ? 'You host' : t.my_status === 'requested' ? 'Awaiting approval' : "You're in"}
                        footer={<div className="flex items-center justify-between text-[12px] pt-3 border-t border-gray-100">{t.my_role === 'creator' ? <span className={t.pending_requests ? 'font-semibold text-[#E8651A]' : 'text-gray-400'}>{t.pending_requests ? `${t.pending_requests} request${t.pending_requests === 1 ? '' : 's'} to review` : 'No pending requests'}</span> : <span className="text-gray-400">{TRIP_STATUS[t.status]?.hint}</span>}{t.my_status === 'approved' && <Tag tone={t.my_payment_status === 'paid' ? 'ok' : 'warn'}>{t.my_payment_status === 'paid' ? 'Paid' : 'Payment pending'}</Tag>}</div>} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* GALLERY */}
            {tab === 'gallery' && (
              <div>
                <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                  <SectionTitle align="left" italic="Travel" rest="gallery" sub={`${derived.albums.length} album${derived.albums.length === 1 ? '' : 's'} · ${derived.photos} photos · ${derived.states.length} states. Public albums appear on your profile.`} />
                  <button onClick={() => setNewAlbum(true)} className={pillCls(true)}><Plus size={15} /> New album</button>
                </div>
                {derived.albums.length === 0 ? (
                  <button onClick={() => setNewAlbum(true)} className="w-full rounded-2xl border border-dashed border-gray-200 bg-white p-14 text-center transition hover:border-[#5bc1d5]"><Camera size={26} className="mx-auto text-[#5bc1d5] mb-3" /><p className="text-lg font-semibold text-gray-800">Start your gallery</p><p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">Create an album for a place you have been, like “Manali”, drop in your photos, and decide whether other travellers can see it.</p></button>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
                    {derived.albums.map(a => (
                      <AlbumCard key={a.id} album={a} showVisibility onOpen={() => setOpenAlbumId(a.id)}
                        controls={<div className="flex items-center justify-between px-1"><label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer"><Toggle on={a.is_public !== false} busy={visBusy === a.id} label={`Make ${a.destination} public`} onChange={() => toggleVisibility(a)} />{a.is_public !== false ? 'Public' : 'Private'}</label><button onClick={() => setOpenAlbumId(a.id)} className="text-xs font-semibold underline underline-offset-4 text-gray-700 hover:text-gray-900">Manage</button></div>} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS */}
            {tab === 'settings' && (
              <form onSubmit={saveSettings} className="max-w-2xl">
                <SectionTitle align="left" italic="Profile" rest="settings" sub="What other travellers see on your profile, and what trip rules check against." className="mb-8" />
                <Card pad={28} style={{ display: 'grid', gap: 18 }}>
                  {[['Full name', 'full_name', 'Your full name'], ['City', 'city', 'Your city'], ['Instagram handle', 'instagram_handle', '@yourusername'], ['Profile photo URL', 'profile_photo', 'https://...']].map(([label, key, ph]) => (
                    <div key={key}><FieldLabel htmlFor={`s-${key}`}>{label}</FieldLabel><input id={`s-${key}`} value={settingsForm[key] || ''} onChange={e => setSettingsForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} style={input} /></div>
                  ))}
                  <div><FieldLabel htmlFor="s-bio">Bio</FieldLabel><textarea id="s-bio" rows={3} value={settingsForm.bio || ''} onChange={e => setSettingsForm(f => ({ ...f, bio: e.target.value }))} placeholder="A short bio other travellers will see" style={{ ...input, resize: 'none' }} /></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><FieldLabel>Gender</FieldLabel><div style={{ display: 'flex', gap: 8 }}>{['Male', 'Female', 'Other'].map(g => <Pill key={g} small active={(settingsForm.gender || '').toLowerCase() === g.toLowerCase()} onClick={() => setSettingsForm(f => ({ ...f, gender: g }))}>{g}</Pill>)}</div></div>
                    <div><FieldLabel htmlFor="s-dob">Date of birth</FieldLabel><input id="s-dob" type="date" max={todayStr()} value={settingsForm.date_of_birth || ''} onChange={e => setSettingsForm(f => ({ ...f, date_of_birth: e.target.value }))} style={input} /></div>
                  </div>
                  <p style={{ fontSize: 12, color: p.muted, background: p.surface, borderRadius: 10, padding: '10px 14px', margin: 0 }}>Gender and age are used to match you with trips that have rules like “women only” or “ages 22 to 30”. Other travellers see your age, never your date of birth.</p>
                  <div><FieldLabel>Travel style</FieldLabel><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{TRIP_STYLES.map(s => { const on = (settingsForm.trip_style || []).includes(s); return <Pill key={s} small active={on} onClick={() => setSettingsForm(f => ({ ...f, trip_style: on ? (f.trip_style || []).filter(x => x !== s) : [...(f.trip_style || []), s] }))}>{s}</Pill>; })}</div></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 6 }}><Button type="submit" variant="accent" disabled={settingsSaving}>{settingsSaving ? 'Saving…' : 'Save changes'}</Button>{settingsMsg && <span style={{ fontSize: 13, color: settingsMsg === 'Saved' ? p.ok : p.bad }}>{settingsMsg}</span>}</div>
                </Card>
              </form>
            )}
          </div>
        </div>
      </section>

      {newAlbum && <NewAlbumModal authFetch={authFetch} onClose={() => setNewAlbum(false)} onCreated={async (badges) => { setNewAlbum(false); await load(); if (badges.length) setNewBadges(badges); }} />}
      {openAlbum && <AlbumManager album={openAlbum} authFetch={authFetch} onChange={load} onClose={() => setOpenAlbumId(null)} />}
      {newBadges.length > 0 && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,.7)' }}>
          <Card pad={32} style={{ maxWidth: 400, textAlign: 'center' }}>
            <Eyebrow color={p.accent} style={{ marginBottom: 10 }}>New badge{newBadges.length > 1 ? 's' : ''}</Eyebrow>
            <div style={{ display: 'grid', gap: 10, margin: '12px 0 20px' }}>{newBadges.map(b => <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: p.surface, borderRadius: 12, padding: 12, textAlign: 'left' }}><span style={{ fontSize: 28 }}>{b.icon}</span><div><p style={{ fontWeight: 600, margin: 0 }}>{b.name}</p><p style={{ fontSize: 12, color: p.muted, margin: 0 }}>{b.description}</p></div></div>)}</div>
            <Button full onClick={() => setNewBadges([])}>Nice</Button>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return <Suspense fallback={<Spinner />}><DashboardContent /></Suspense>;
}
