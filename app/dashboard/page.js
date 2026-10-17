'use client';
import { useCallback, useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Globe, Lock, Images, Upload, Trash2, Star, X, Compass, Users, Award, Camera, ChevronRight, Pencil, AlertCircle } from 'lucide-react';
import { useSession, loginHref } from '@/lib/useSession';
import { CT, TRIP_STATUS } from '@/lib/communityTrips';
import CommunityTripCard from '@/components/CommunityTripCard';
import AlbumCard from '@/components/AlbumCard';
import AlbumLightbox from '@/components/AlbumLightbox';
import Avatar from '@/components/Avatar';

const INDIAN_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jammu & Kashmir','Jharkhand','Karnataka','Kerala','Ladakh','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];
const TRIP_TYPES = ['Solo', 'Group', 'Family', 'Sacred', 'Adventure', 'Corporate'];
const TRIP_STYLES = ['Adventure', 'Chill', 'Party', 'Cultural', 'Spiritual', 'Luxury', 'Budget', 'Photography', 'Trekking', 'Road Trip'];
const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'trips',    label: 'My Trips' },
  { id: 'gallery',  label: 'Gallery' },
  { id: 'settings', label: 'Settings' },
];
const inputCls = 'w-full border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5bc1d5] bg-white';
const todayStr = () => new Date().toISOString().slice(0, 10);

function Toggle({ on, onChange, label, busy }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} disabled={busy} onClick={onChange}
      className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${on ? 'bg-[#1f77a3]' : 'bg-gray-300'} disabled:opacity-60`}>
      <span className={`inline-block h-5 w-5 bg-white rounded-full shadow transform transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/60" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`bg-white rounded-3xl shadow-2xl w-full ${wide ? 'max-w-5xl' : 'max-w-lg'} max-h-[92vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <h3 className="font-bold text-[#1a1a2e]">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700" aria-label="Close"><X size={22} /></button>
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

/* ─────────────── Gallery: album manager ─────────────── */
function AlbumManager({ album, authFetch, onChange, onClose }) {
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const [lightbox, setLightbox] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ destination: album.destination || '', state: album.state || '', trip_type: album.trip_type || '', travel_date_from: album.travel_date_from || '', travel_date_to: album.travel_date_to || '', caption: album.caption || '' });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);
  const photos = album.photos || [];

  const upload = async (fileList) => {
    const files = Array.from(fileList || []).filter(f => f.type.startsWith('image/'));
    if (!files.length) return;
    setBusy('upload'); setErr('');
    try {
      const fd = new FormData();
      files.slice(0, 20).forEach(f => fd.append('files', f));
      const d = await authFetch(`/api/profile/trips/${album.id}/photos`, { method: 'POST', body: fd });
      if (d.errors?.length) setErr(d.errors.join(' · '));
      await onChange();
    } catch (e) { setErr(e.message); } finally { setBusy(''); if (fileRef.current) fileRef.current.value = ''; }
  };

  const act = async (key, fn) => { setBusy(key); setErr(''); try { await fn(); await onChange(); } catch (e) { setErr(e.message); } finally { setBusy(''); } };

  return (
    <Modal title={album.destination} onClose={onClose} wide>
      <div className="px-6 py-5 space-y-5">
        {/* Header row */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <Toggle on={album.is_public !== false} busy={busy === 'vis'} label="Album visibility" onChange={() => act('vis', () => authFetch(`/api/profile/trips/${album.id}`, { method: 'PATCH', body: { is_public: album.is_public === false } }))} />
            <span className="text-sm text-gray-700 flex items-center gap-1.5">{album.is_public !== false ? <><Globe size={14} className="text-[#1f77a3]" /> Public — visible on your profile</> : <><Lock size={14} /> Private — only you can see this</>}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditing(e => !e)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border border-gray-200 hover:border-gray-400"><Pencil size={13} /> Details</button>
            {confirmDelete ? (
              <button disabled={busy === 'del'} onClick={() => act('del', async () => { await authFetch(`/api/profile/trips/${album.id}`, { method: 'DELETE' }); onClose(); })} className="text-xs font-semibold px-3 py-2 rounded-full bg-red-600 text-white">Delete album &amp; {photos.length} photos</button>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50"><Trash2 size={13} /> Delete</button>
            )}
          </div>
        </div>

        {editing && (
          <form onSubmit={e => { e.preventDefault(); act('edit', async () => { await authFetch(`/api/profile/trips/${album.id}`, { method: 'PATCH', body: form }); setEditing(false); }); }} className="bg-[#fafafa] rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2"><label htmlFor="al-dest" className="block text-xs font-semibold text-gray-600 mb-1">Album name / destination</label><input id="al-dest" required value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} className={inputCls} /></div>
            <div><label htmlFor="al-state" className="block text-xs font-semibold text-gray-600 mb-1">State</label><select id="al-state" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} className={inputCls}><option value="">Select</option>{INDIAN_STATES.map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label htmlFor="al-type" className="block text-xs font-semibold text-gray-600 mb-1">Trip type</label><select id="al-type" value={form.trip_type} onChange={e => setForm(f => ({ ...f, trip_type: e.target.value }))} className={inputCls}><option value="">Select</option>{TRIP_TYPES.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}</select></div>
            <div><label htmlFor="al-from" className="block text-xs font-semibold text-gray-600 mb-1">From</label><input id="al-from" type="date" value={form.travel_date_from || ''} onChange={e => setForm(f => ({ ...f, travel_date_from: e.target.value }))} className={inputCls} /></div>
            <div><label htmlFor="al-to" className="block text-xs font-semibold text-gray-600 mb-1">To</label><input id="al-to" type="date" value={form.travel_date_to || ''} onChange={e => setForm(f => ({ ...f, travel_date_to: e.target.value }))} className={inputCls} /></div>
            <div className="sm:col-span-2"><label htmlFor="al-cap" className="block text-xs font-semibold text-gray-600 mb-1">Caption</label><textarea id="al-cap" rows={2} value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} className={`${inputCls} resize-none`} /></div>
            <div className="sm:col-span-2 flex gap-2 justify-end"><button type="button" onClick={() => setEditing(false)} className="text-xs font-semibold px-4 py-2 rounded-full border border-gray-200">Cancel</button><button type="submit" disabled={busy === 'edit'} className="text-xs font-semibold px-4 py-2 rounded-full bg-[#1a1a2e] text-white">Save</button></div>
          </form>
        )}

        {/* Upload zone */}
        <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files); }}
          className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${dragging ? 'border-[#5bc1d5] bg-[#f4fbfd]' : 'border-gray-200'}`}>
          <input ref={fileRef} id={`al-files-${album.id}`} type="file" accept="image/*" multiple hidden onChange={e => upload(e.target.files)} />
          <Upload size={22} className="mx-auto text-[#1f77a3] mb-2" />
          <p className="text-sm font-semibold text-[#1a1a2e]">{busy === 'upload' ? 'Uploading…' : 'Drop photos here or'} {busy !== 'upload' && <button type="button" onClick={() => fileRef.current?.click()} className="text-[#1f77a3] underline">choose files</button>}</p>
          <p className="text-[11px] text-gray-400 mt-1">Up to 20 photos at a time, 8 MB each. JPG, PNG, WEBP, HEIC.</p>
        </div>
        {err && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{err}</p>}

        {/* Photos masonry */}
        {photos.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No photos yet. Add your first ones above.</p>
        ) : (
          <div style={{ columns: '3 180px', columnGap: '10px' }}>
            {photos.map((p, i) => (
              <div key={p.id} className="relative group mb-2.5 break-inside-avoid rounded-xl overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.caption || ''} loading="lazy" onClick={() => setLightbox(i)} className="w-full block cursor-zoom-in transition-transform duration-500 group-hover:scale-[1.03]" />
                {album.cover_photo === p.url && <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-[#1a1a2e] flex items-center gap-1"><Star size={10} className="fill-current" /> Cover</span>}
                <div className="absolute inset-x-0 bottom-0 p-2 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent">
                  {album.cover_photo !== p.url && <button title="Set as cover" onClick={() => act(p.id, () => authFetch(`/api/profile/trips/${album.id}/photos/${p.id}`, { method: 'PATCH', body: { set_cover: true } }))} className="p-1.5 rounded-full bg-white/90 text-[#1a1a2e] hover:bg-white"><Star size={13} /></button>}
                  <button title="Delete photo" onClick={() => act(p.id, () => authFetch(`/api/profile/trips/${album.id}/photos/${p.id}`, { method: 'DELETE' }))} className="p-1.5 rounded-full bg-white/90 text-red-600 hover:bg-white"><Trash2 size={13} /></button>
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

/* ─────────────── Gallery: new album ─────────────── */
function NewAlbumModal({ authFetch, onCreated, onClose }) {
  const [form, setForm] = useState({ destination: '', state: '', trip_type: '', travel_date_from: '', travel_date_to: '', caption: '', is_public: true, booked_through_platform: false });
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr('');
    try {
      const d = await authFetch('/api/profile/trips/add', { method: 'POST', body: form });
      if (files.length && d.trip?.id) {
        const fd = new FormData(); files.slice(0, 20).forEach(f => fd.append('files', f));
        await authFetch(`/api/profile/trips/${d.trip.id}/photos`, { method: 'POST', body: fd });
      }
      onCreated(d.new_badges || []);
    } catch (e2) { setErr(e2.message); setBusy(false); }
  }

  return (
    <Modal title="New album" onClose={onClose}>
      <form onSubmit={submit} className="px-6 py-5 space-y-4">
        <div><label htmlFor="na-dest" className="block text-xs font-semibold text-gray-600 mb-1">Album name / destination *</label><input id="na-dest" required autoFocus value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} placeholder="e.g. Manali, Spiti, Goa" className={inputCls} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label htmlFor="na-state" className="block text-xs font-semibold text-gray-600 mb-1">State</label><select id="na-state" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} className={inputCls}><option value="">Select</option>{INDIAN_STATES.map(s => <option key={s}>{s}</option>)}</select></div>
          <div><label htmlFor="na-type" className="block text-xs font-semibold text-gray-600 mb-1">Trip type</label><select id="na-type" value={form.trip_type} onChange={e => setForm(f => ({ ...f, trip_type: e.target.value }))} className={inputCls}><option value="">Select</option>{TRIP_TYPES.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}</select></div>
          <div><label htmlFor="na-from" className="block text-xs font-semibold text-gray-600 mb-1">From</label><input id="na-from" type="date" value={form.travel_date_from} onChange={e => setForm(f => ({ ...f, travel_date_from: e.target.value }))} className={inputCls} /></div>
          <div><label htmlFor="na-to" className="block text-xs font-semibold text-gray-600 mb-1">To</label><input id="na-to" type="date" value={form.travel_date_to} onChange={e => setForm(f => ({ ...f, travel_date_to: e.target.value }))} className={inputCls} /></div>
        </div>
        <div><label htmlFor="na-cap" className="block text-xs font-semibold text-gray-600 mb-1">Caption</label><textarea id="na-cap" rows={2} value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} placeholder="A line about this trip" className={`${inputCls} resize-none`} /></div>
        <div>
          <label htmlFor="na-files" className="block text-xs font-semibold text-gray-600 mb-1">Photos</label>
          <input id="na-files" type="file" accept="image/*" multiple onChange={e => setFiles(Array.from(e.target.files || []))} className="block w-full text-sm text-gray-600 file:mr-3 file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-[#e0f4f8] file:text-[#1f77a3] file:font-semibold" />
          {files.length > 0 && <p className="text-[11px] text-gray-400 mt-1">{files.length} photo{files.length === 1 ? '' : 's'} selected. You can add more later.</p>}
        </div>
        <div className="flex items-center justify-between bg-[#fafafa] rounded-xl px-4 py-3">
          <span className="text-sm text-gray-700 flex items-center gap-2">{form.is_public ? <Globe size={15} className="text-[#1f77a3]" /> : <Lock size={15} />} {form.is_public ? 'Public — shown on your profile' : 'Private — only you'}</span>
          <Toggle on={form.is_public} label="Public album" onChange={() => setForm(f => ({ ...f, is_public: !f.is_public }))} />
        </div>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"><input type="checkbox" checked={form.booked_through_platform} onChange={e => setForm(f => ({ ...f, booked_through_platform: e.target.checked }))} className="w-4 h-4 accent-[#1f77a3]" /> This trip was booked through Travel Teasing</label>
        {err && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{err}</p>}
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-full text-sm font-semibold">Cancel</button>
          <button type="submit" disabled={busy} className="flex-1 btn-primary justify-center text-sm py-2.5">{busy ? 'Creating…' : 'Create album'}</button>
        </div>
      </form>
    </Modal>
  );
}

/* ─────────────── Dashboard ─────────────── */
function DashboardContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const tab = TABS.some(t => t.id === sp.get('tab')) ? sp.get('tab') : 'overview';
  const { user, loading: sessionLoading, authFetch } = useSession();
  const [data, setData] = useState(null);
  const [newAlbum, setNewAlbum] = useState(false);
  const [openAlbumId, setOpenAlbumId] = useState(null);
  const [newBadges, setNewBadges] = useState([]);
  const [tripsSub, setTripsSub] = useState('upcoming');
  const [settingsForm, setSettingsForm] = useState({});
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState('');
  const [visBusy, setVisBusy] = useState('');

  const load = useCallback(async () => {
    const d = await authFetch('/api/profile');
    setData(d);
    setSettingsForm(f => (Object.keys(f).length ? f : (d.profile || {})));
  }, [authFetch]);

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) { router.replace(loginHref('/dashboard')); return; }
    load().catch(() => {});
  }, [sessionLoading, user, router, load]);

  const setTab = (id) => router.replace(`/dashboard?tab=${id}`, { scroll: false });

  const derived = useMemo(() => {
    if (!data) return null;
    const today = todayStr();
    const ct = data.community_trips || [];
    const live = ['open', 'full', 'confirmed'];
    const upcoming = ct.filter(t => t.my_status === 'approved' && live.includes(t.status) && (t.end_date || t.start_date) >= today);
    const requested = ct.filter(t => t.my_status === 'requested' && live.includes(t.status) && t.start_date >= today);
    const past = ct.filter(t => !upcoming.includes(t) && !requested.includes(t));
    const hosted = ct.filter(t => t.my_role === 'creator');
    const pendingRequests = hosted.reduce((n, t) => n + (t.pending_requests || 0), 0);
    const albums = data.trips || [];
    const photos = albums.reduce((n, a) => n + (a.photos?.length || 0), 0);
    const states = [...new Set(albums.map(a => a.state).filter(Boolean))];
    return { upcoming, requested, past, hosted, pendingRequests, albums, photos, states };
  }, [data]);

  async function saveSettings(e) {
    e.preventDefault(); setSettingsSaving(true); setSettingsMsg('');
    try {
      const { full_name, city, bio, instagram_handle, profile_photo, gender, date_of_birth, trip_style } = settingsForm;
      await authFetch('/api/profile/update', { method: 'POST', body: { full_name, city, bio, instagram_handle, profile_photo, gender, date_of_birth: date_of_birth || null, trip_style } });
      setSettingsMsg('Saved'); await load();
    } catch (err) { setSettingsMsg(err.message); } finally { setSettingsSaving(false); setTimeout(() => setSettingsMsg(''), 2500); }
  }

  async function toggleVisibility(album) {
    setVisBusy(album.id);
    try { await authFetch(`/api/profile/trips/${album.id}`, { method: 'PATCH', body: { is_public: album.is_public === false } }); await load(); } catch {} finally { setVisBusy(''); }
  }

  if (sessionLoading || !user || !data || !derived) return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-[#5bc1d5] border-t-transparent rounded-full" /></div>;

  const { profile } = data;
  const openAlbum = derived.albums.find(a => a.id === openAlbumId);
  const first = profile?.full_name?.split(' ')[0] || 'Traveller';

  const tripList = tripsSub === 'upcoming' ? derived.upcoming : tripsSub === 'requested' ? derived.requested : derived.past;

  return (
    <div className="bg-[#fafafa] min-h-screen">
      {/* Header */}
      <div className="text-white" style={{ background: 'linear-gradient(135deg,#1a1a2e 0%,#12343f 60%,#1f77a3 150%)' }}>
        <div className="container-max py-8 md:py-10">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <Avatar src={profile?.profile_photo} name={profile?.full_name} size={56} />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Hey {first} 👋</h1>
                <p className="text-white/70 text-sm">{data.email} · <Link href={`/profile/${user.id}`} className="underline hover:text-white">View public profile</Link></p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`${CT.base}/new`} className="btn-primary text-sm"><Plus size={16} /> Create a trip</Link>
              <button onClick={() => setNewAlbum(true)} className="btn-white text-sm"><Camera size={16} /> New album</button>
            </div>
          </div>
          <div className="flex gap-1 mt-8 overflow-x-auto scrollbar-hide">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${tab === t.id ? 'bg-white text-[#1a1a2e]' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
                {t.label}{t.id === 'trips' && derived.pendingRequests > 0 && <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#E8651A] text-white">{derived.pendingRequests}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-max py-8">
        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="space-y-8 tt-fade-up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Upcoming trips', value: derived.upcoming.length, icon: Compass, tab: 'trips' },
                { label: 'Albums', value: derived.albums.length, icon: Images, tab: 'gallery' },
                { label: 'Photos', value: derived.photos, icon: Camera, tab: 'gallery' },
                { label: 'Badges', value: (data.badges || []).length, icon: Award, tab: 'overview' },
              ].map(s => (
                <button key={s.label} onClick={() => setTab(s.tab)} className="bg-white rounded-2xl border border-gray-100 p-5 text-left hover:shadow-md transition">
                  <s.icon size={18} className="text-[#1f77a3] mb-3" />
                  <p className="text-2xl font-bold text-[#1a1a2e] tabular-nums">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </button>
              ))}
            </div>

            {derived.pendingRequests > 0 && (
              <div className="bg-[#FEF3EB] border border-[#f7d9c4] rounded-2xl p-5 flex flex-wrap items-center gap-4 justify-between">
                <div className="flex items-center gap-3"><AlertCircle size={20} className="text-[#E8651A]" /><div><p className="font-semibold text-[#1a1a2e]">{derived.pendingRequests} traveller{derived.pendingRequests === 1 ? ' wants' : 's want'} to join your trip{derived.hosted.filter(t => t.pending_requests).length > 1 ? 's' : ''}</p><p className="text-xs text-gray-600">Review their profiles and approve the ones whose vibe fits.</p></div></div>
                <div className="flex flex-wrap gap-2">{derived.hosted.filter(t => t.pending_requests).map(t => <Link key={t.id} href={`${CT.base}/${t.share_code || t.id}`} className="text-xs font-semibold px-3 py-2 rounded-full bg-[#1a1a2e] text-white">{t.title || t.packages?.title} · {t.pending_requests} <ChevronRight size={12} className="inline" /></Link>)}</div>
              </div>
            )}

            {derived.upcoming.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-[#1a1a2e]">Next up</h2><button onClick={() => setTab('trips')} className="text-sm font-semibold text-[#1f77a3]">All trips →</button></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{derived.upcoming.slice(0, 3).map(t => <CommunityTripCard key={t.id} trip={t} badge={t.my_role === 'creator' ? 'You host' : 'You\'re in'} />)}</div>
              </section>
            )}

            {derived.upcoming.length === 0 && (
              <section className="bg-white rounded-3xl border border-dashed border-gray-200 p-8 text-center">
                <div className="text-4xl mb-3">🧭</div>
                <h2 className="text-lg font-bold text-[#1a1a2e]">No upcoming trips yet</h2>
                <p className="text-sm text-gray-500 mt-1 mb-5 max-w-md mx-auto">Create a trip on any FIT package and invite friends, or join one that other travellers are planning.</p>
                <div className="flex gap-2 justify-center flex-wrap"><Link href={`${CT.base}/new`} className="btn-primary text-sm"><Plus size={15} /> Create a trip</Link><Link href={CT.base} className="btn-outline text-sm">Browse {CT.label.toLowerCase()}</Link></div>
              </section>
            )}

            <section>
              <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-[#1a1a2e]">Your gallery</h2><button onClick={() => setTab('gallery')} className="text-sm font-semibold text-[#1f77a3]">Manage →</button></div>
              {derived.albums.length === 0 ? (
                <button onClick={() => setNewAlbum(true)} className="w-full bg-white rounded-3xl border border-dashed border-gray-200 p-8 text-center hover:border-[#5bc1d5] transition">
                  <Camera size={24} className="mx-auto text-[#1f77a3] mb-2" /><p className="font-semibold text-[#1a1a2e]">Create your first album</p><p className="text-xs text-gray-500 mt-1">Name it after the place, add your photos, choose what the world sees.</p>
                </button>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">{derived.albums.slice(0, 4).map(a => <AlbumCard key={a.id} album={a} showVisibility onOpen={() => setOpenAlbumId(a.id)} />)}</div>
              )}
            </section>

            {(data.badges || []).length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-[#1a1a2e] mb-4">Badges</h2>
                <div className="flex flex-wrap gap-3">{data.badges.map(b => <div key={b.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3"><span className="text-2xl">{b.badges?.icon}</span><div><p className="font-semibold text-sm text-[#1a1a2e]">{b.badges?.name}</p><p className="text-xs text-gray-400">{b.badges?.description}</p></div></div>)}</div>
              </section>
            )}
          </div>
        )}

        {/* MY TRIPS */}
        {tab === 'trips' && (
          <div className="tt-fade-up">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex gap-1 bg-white border border-gray-100 rounded-full p-1">
                {[['upcoming', `Upcoming (${derived.upcoming.length})`], ['requested', `Requested (${derived.requested.length})`], ['past', `Past (${derived.past.length})`]].map(([id, label]) => (
                  <button key={id} onClick={() => setTripsSub(id)} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${tripsSub === id ? 'bg-[#1a1a2e] text-white' : 'text-gray-600 hover:bg-gray-50'}`}>{label}</button>
                ))}
              </div>
              <Link href={`${CT.base}/new`} className="btn-primary text-sm"><Plus size={15} /> Create a trip</Link>
            </div>
            {tripList.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-10 text-center">
                <p className="font-semibold text-[#1a1a2e]">{tripsSub === 'upcoming' ? 'Nothing upcoming' : tripsSub === 'requested' ? 'No pending requests' : 'No past trips yet'}</p>
                <p className="text-sm text-gray-500 mt-1">{tripsSub === 'past' ? 'Completed trips land here, and an album is started for you automatically.' : 'Find a trip that matches your vibe or start your own.'}</p>
                <Link href={CT.base} className="btn-outline text-sm mt-5">Browse {CT.label.toLowerCase()}</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {tripList.map(t => (
                  <CommunityTripCard key={t.id} trip={t}
                    badge={t.my_role === 'creator' ? 'You host' : t.my_status === 'requested' ? 'Awaiting approval' : 'You\'re in'}
                    footer={
                      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-gray-100 mt-1">
                        {t.my_role === 'creator'
                          ? <span className={t.pending_requests ? 'font-semibold text-[#E8651A]' : 'text-gray-400'}>{t.pending_requests ? `${t.pending_requests} request${t.pending_requests === 1 ? '' : 's'} to review` : 'No pending requests'}</span>
                          : <span className="text-gray-400">{TRIP_STATUS[t.status]?.hint}</span>}
                        {t.my_status === 'approved' && <span className={`font-semibold px-2 py-0.5 rounded-full ${t.my_payment_status === 'paid' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{t.my_payment_status === 'paid' ? 'Paid' : 'Payment pending'}</span>}
                      </div>
                    } />
                ))}
              </div>
            )}
          </div>
        )}

        {/* GALLERY */}
        {tab === 'gallery' && (
          <div className="tt-fade-up">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#1a1a2e]">Your travel gallery</h2>
                <p className="text-sm text-gray-500">{derived.albums.length} album{derived.albums.length === 1 ? '' : 's'} · {derived.photos} photos · {derived.states.length} states. Public albums appear on your profile.</p>
              </div>
              <button onClick={() => setNewAlbum(true)} className="btn-primary text-sm"><Plus size={15} /> New album</button>
            </div>
            {derived.albums.length === 0 ? (
              <button onClick={() => setNewAlbum(true)} className="w-full bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center hover:border-[#5bc1d5] transition">
                <Camera size={28} className="mx-auto text-[#1f77a3] mb-3" /><p className="text-lg font-bold text-[#1a1a2e]">Start your gallery</p><p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">Create an album for a place you have been, like “Manali”, drop in your photos, and decide whether other travellers can see it.</p>
              </button>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {derived.albums.map(a => (
                  <AlbumCard key={a.id} album={a} showVisibility onOpen={() => setOpenAlbumId(a.id)}
                    controls={
                      <div className="flex items-center justify-between px-1">
                        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                          <Toggle on={a.is_public !== false} busy={visBusy === a.id} label={`Make ${a.destination} public`} onChange={() => toggleVisibility(a)} />
                          {a.is_public !== false ? 'Public' : 'Private'}
                        </label>
                        <button onClick={() => setOpenAlbumId(a.id)} className="text-xs font-semibold text-[#1f77a3] hover:underline">Manage</button>
                      </div>
                    } />
                ))}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <form onSubmit={saveSettings} className="max-w-xl space-y-5 tt-fade-up">
            <h2 className="text-xl font-bold text-[#1a1a2e]">Profile settings</h2>
            {[
              { label: 'Full name', key: 'full_name', placeholder: 'Your full name' },
              { label: 'City', key: 'city', placeholder: 'Your city' },
              { label: 'Bio', key: 'bio', placeholder: 'A short bio other travellers will see', textarea: true },
              { label: 'Instagram handle', key: 'instagram_handle', placeholder: '@yourusername' },
              { label: 'Profile photo URL', key: 'profile_photo', placeholder: 'https://...' },
            ].map(field => (
              <div key={field.key}>
                <label htmlFor={`s-${field.key}`} className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                {field.textarea
                  ? <textarea id={`s-${field.key}`} rows={3} value={settingsForm[field.key] || ''} onChange={e => setSettingsForm(f => ({ ...f, [field.key]: e.target.value }))} className={`${inputCls} resize-none`} placeholder={field.placeholder} />
                  : <input id={`s-${field.key}`} value={settingsForm[field.key] || ''} onChange={e => setSettingsForm(f => ({ ...f, [field.key]: e.target.value }))} className={inputCls} placeholder={field.placeholder} />}
              </div>
            ))}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <div className="flex gap-2">{['Male', 'Female', 'Other'].map(g => <button key={g} type="button" onClick={() => setSettingsForm(f => ({ ...f, gender: g }))} className={`flex-1 py-2 rounded-xl text-sm border font-medium transition ${(settingsForm.gender || '').toLowerCase() === g.toLowerCase() ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' : 'border-gray-300 text-gray-600'}`}>{g}</button>)}</div>
              </div>
              <div>
                <label htmlFor="s-dob" className="block text-sm font-medium text-gray-700 mb-2">Date of birth</label>
                <input id="s-dob" type="date" max={todayStr()} value={settingsForm.date_of_birth || ''} onChange={e => setSettingsForm(f => ({ ...f, date_of_birth: e.target.value }))} className={inputCls} />
              </div>
            </div>
            <p className="text-xs text-gray-500 bg-[#fafafa] rounded-xl px-4 py-3">Gender and age are used to match you with trips that have rules like “women only” or “ages 22 to 30”. Other travellers see your age, never your date of birth.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Travel style</label>
              <div className="flex flex-wrap gap-2">{TRIP_STYLES.map(s => { const on = (settingsForm.trip_style || []).includes(s); return <button key={s} type="button" onClick={() => setSettingsForm(f => ({ ...f, trip_style: on ? (f.trip_style || []).filter(x => x !== s) : [...(f.trip_style || []), s] }))} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${on ? 'bg-[#5bc1d5] border-[#5bc1d5] text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>{s}</button>; })}</div>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" disabled={settingsSaving} className="btn-primary">{settingsSaving ? 'Saving…' : 'Save changes'}</button>
              {settingsMsg && <span className={`text-sm ${settingsMsg === 'Saved' ? 'text-green-700' : 'text-red-600'}`}>{settingsMsg}</span>}
            </div>
          </form>
        )}
      </div>

      {newAlbum && <NewAlbumModal authFetch={authFetch} onClose={() => setNewAlbum(false)} onCreated={async (badges) => { setNewAlbum(false); await load(); if (badges.length) setNewBadges(badges); }} />}
      {openAlbum && <AlbumManager album={openAlbum} authFetch={authFetch} onChange={load} onClose={() => setOpenAlbumId(null)} />}

      {newBadges.length > 0 && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-[#1a1a2e] mb-2">New badge{newBadges.length > 1 ? 's' : ''} earned!</h3>
            <div className="space-y-3 my-5">{newBadges.map(b => <div key={b.id} className="flex items-center gap-3 bg-[#e0f4f8] rounded-xl p-3"><span className="text-3xl">{b.icon}</span><div className="text-left"><p className="font-bold text-[#1a1a2e]">{b.name}</p><p className="text-xs text-gray-500">{b.description}</p></div></div>)}</div>
            <button onClick={() => setNewBadges([])} className="btn-primary w-full justify-center">Awesome!</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-[#5bc1d5] border-t-transparent rounded-full" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}
