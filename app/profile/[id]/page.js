'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, X, Lock, ArrowRight } from 'lucide-react';
import InstagramIcon from '@/components/InstagramIcon';
import Avatar from '@/components/Avatar';
import AlbumCard from '@/components/AlbumCard';
import AlbumLightbox from '@/components/AlbumLightbox';
import CommunityTripCard from '@/components/CommunityTripCard';
import { PageHero, SectionTitle, Button, Card, Eyebrow, usePalette, Spinner } from '@/components/ui';
import { useSession } from '@/lib/useSession';
import { CT } from '@/lib/communityTrips';

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&q=85';

function AlbumViewer({ album, onClose }) {
  const p = usePalette();
  const [lightbox, setLightbox] = useState(null);
  const photos = album.photos || [];
  const when = album.travel_date_from ? new Date(album.travel_date_from).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : null;
  useEffect(() => { const prev = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = prev; }; }, []);
  return (
    <div className="fixed inset-0 z-[150] overflow-y-auto" style={{ background: p.pageBg, color: p.text, fontFamily: p.font }}>
      <div className="sticky top-0 z-10" style={{ background: p.dark ? 'rgba(13,13,13,.9)' : 'rgba(255,255,255,.9)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${p.border}` }}>
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <Eyebrow style={{ marginBottom: 4 }}>{[album.state, when, `${photos.length} photo${photos.length === 1 ? '' : 's'}`].filter(Boolean).join(' · ')}</Eyebrow>
            <h2 style={{ fontSize: 26, fontWeight: 700, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{album.destination}</h2>
          </div>
          <button onClick={onClose} aria-label="Close album" style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${p.borderMid}`, background: 'transparent', color: p.text, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {album.caption && <p style={{ fontSize: 17, lineHeight: 1.8, color: p.sub, maxWidth: 720, marginBottom: 28 }}>{album.caption}</p>}
        {photos.length === 0 ? <p style={{ color: p.faint, textAlign: 'center', padding: '80px 0' }}>No photos in this album yet.</p> : (
          <div style={{ columns: '4 240px', columnGap: 14 }}>
            {photos.map((ph, i) => (
              <figure key={ph.id} className="group cursor-zoom-in" style={{ margin: '0 0 14px', breakInside: 'avoid', borderRadius: 16, overflow: 'hidden', background: p.surface }} onClick={() => setLightbox(i)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ph.url} alt={ph.caption || album.destination} loading="lazy" className="w-full block transition-transform duration-700 group-hover:scale-[1.03]" />
                {ph.caption && <figcaption style={{ fontSize: 12, color: p.muted, padding: '8px 10px' }}>{ph.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )}
      </div>
      {lightbox !== null && <AlbumLightbox photos={photos} index={lightbox} title={album.destination} onClose={() => setLightbox(null)} />}
    </div>
  );
}

export default function PublicProfilePage({ params }) {
  const { user } = useSession();
  const p = usePalette();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openAlbum, setOpenAlbum] = useState(null);

  useEffect(() => { fetch(`/api/profile/${params.id}`).then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false)); }, [params.id]);

  if (loading) return <Spinner />;
  if (!data?.profile) return <div className="min-h-[60vh] flex items-center justify-center" style={{ color: p.muted }}>Profile not found.</div>;

  const { profile, trips, badges, hosting } = data;
  const isMe = user?.id === params.id;
  const first = (profile.full_name || 'Traveller').split(' ')[0];
  const states = [...new Set(trips.map(t => t.state).filter(Boolean))];
  const photoCount = trips.reduce((n, t) => n + (t.photos?.length || 0), 0);
  const memberSince = new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  const cover = trips.find(t => t.cover_photo)?.cover_photo || hosting?.[0]?.packages?.cover_image || DEFAULT_COVER;

  return (
    <div style={{ background: p.pageBg, minHeight: '100vh', fontFamily: p.font }}>
      <PageHero
        image={cover}
        eyebrow={`Traveller · member since ${memberSince}${profile.city ? ` · ${profile.city}` : ''}${profile.age ? ` · ${profile.age} yrs` : ''}`}
        title={profile.full_name}
        subtitle={profile.bio || ''}
        stats={[{ value: trips.length, label: 'Albums' }, { value: photoCount, label: 'Photos' }, { value: states.length, label: 'States' }, { value: badges.length, label: 'Badges' }]}
        chips={profile.trip_style || []}
        right={
          <div className="flex flex-col items-center lg:items-end gap-3">
            <Avatar src={profile.profile_photo} name={profile.full_name} size={128} ring />
            <div className="flex items-center gap-2">
              {profile.is_verified && <span className="inline-flex items-center gap-1.5 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0d0d0d]"><ShieldCheck size={11} /> Verified</span>}
              {profile.instagram_handle && <a href={`https://instagram.com/${profile.instagram_handle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] text-white" style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)' }}><InstagramIcon size={12} /> {profile.instagram_handle}</a>}
            </div>
            {isMe && <Button href="/dashboard?tab=settings" size="sm" style={{ background: '#fff', color: '#0d0d0d', borderColor: '#fff' }}>Edit profile</Button>}
          </div>
        }
      />

      {isMe && (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-6">
          <p style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: p.muted, margin: 0 }}><Lock size={13} /> This is how others see you. Only albums marked public appear here. Manage them in your <Link href="/dashboard?tab=gallery" style={{ color: p.accent, fontWeight: 600 }}>dashboard</Link>.</p>
        </div>
      )}

      {hosting?.length > 0 && (
        <section className="bg-white">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-16 md:py-20">
            <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
              <SectionTitle align="left" italic={`${first} is`} rest="hosting" sub="Open trips you can request to join." />
              <Link href={CT.base} className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-neutral-300">All {CT.label.toLowerCase()} <ArrowRight size={14} /></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">{hosting.map(t => <CommunityTripCard key={t.id} trip={t} />)}</div>
          </div>
        </section>
      )}

      <section className="bg-[#fafafa]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-16 md:py-20">
          <SectionTitle align="left" italic="Travel" rest="Gallery" sub={trips.length ? `${trips.length} album${trips.length === 1 ? '' : 's'} across ${states.length || 'a few'} ${states.length === 1 ? 'state' : 'states'}.` : null} className="mb-8" />
          {trips.length === 0 ? (
            <Card pad={48} style={{ textAlign: 'center' }}><p style={{ color: p.faint, margin: 0 }}>{isMe ? 'No public albums yet. Create one from your dashboard.' : 'No public albums yet.'}</p></Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5">{trips.map(a => <AlbumCard key={a.id} album={a} onOpen={() => setOpenAlbum(a)} />)}</div>
          )}
        </div>
      </section>

      {badges.length > 0 && (
        <section className="bg-white">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-16 md:py-20">
            <SectionTitle align="left" italic="Badges" rest="earned" className="mb-8" />
            <div className="flex flex-wrap gap-3">{badges.map(b => <Card key={b.id} pad={14} style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 220 }}><span style={{ fontSize: 24 }}>{b.badges?.icon}</span><div><p style={{ fontWeight: 600, fontSize: 14, color: p.text, margin: 0 }}>{b.badges?.name}</p><p style={{ fontSize: 12, color: p.muted, margin: 0 }}>{b.badges?.description}</p></div></Card>)}</div>
          </div>
        </section>
      )}

      {!isMe && (
        <section className="bg-[#fafafa]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#5bc1d5] mb-3">Travel together</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">Want to travel with {first}?</h2>
              <p className="text-gray-500 text-sm mt-2">Join one of their trips, or start your own and invite them.</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link href={CT.base} className="inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-800 px-6 py-2.5 text-sm font-medium text-white shadow-sm">Browse trips <ArrowRight size={14} /></Link>
              <Link href={`${CT.base}/new`} className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm font-medium text-neutral-700 shadow-sm">Create a trip</Link>
            </div>
          </div>
        </section>
      )}

      {openAlbum && <AlbumViewer album={openAlbum} onClose={() => setOpenAlbum(null)} />}
    </div>
  );
}
