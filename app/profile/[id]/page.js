'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, ShieldCheck, Images, X, Compass, Lock } from 'lucide-react';
import InstagramIcon from '@/components/InstagramIcon';
import Avatar from '@/components/Avatar';
import AlbumCard from '@/components/AlbumCard';
import AlbumLightbox from '@/components/AlbumLightbox';
import CommunityTripCard from '@/components/CommunityTripCard';
import { useSession } from '@/lib/useSession';
import { CT } from '@/lib/communityTrips';

function AlbumViewer({ album, onClose }) {
  const [lightbox, setLightbox] = useState(null);
  const photos = album.photos || [];
  const when = album.travel_date_from ? new Date(album.travel_date_from).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : null;
  useEffect(() => { const prev = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = prev; }; }, []);
  return (
    <div className="fixed inset-0 z-[150] bg-[#fafafa] overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="container-max py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-bold text-[#1a1a2e] truncate" style={{ fontFamily: "'Playfair Display', serif" }}>{album.destination}</h2>
            <p className="text-xs text-gray-500">{[album.state, when, `${photos.length} photo${photos.length === 1 ? '' : 's'}`].filter(Boolean).join(' · ')}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close album"><X size={22} /></button>
        </div>
      </div>
      <div className="container-max py-6">
        {album.caption && <p className="text-gray-700 max-w-2xl mb-6">{album.caption}</p>}
        {photos.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-16">No photos in this album yet.</p>
        ) : (
          <div style={{ columns: '4 220px', columnGap: '12px' }}>
            {photos.map((p, i) => (
              <figure key={p.id} className="mb-3 break-inside-avoid rounded-2xl overflow-hidden bg-gray-100 group cursor-zoom-in tt-fade-up" style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }} onClick={() => setLightbox(i)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.caption || album.destination} loading="lazy" className="w-full block transition-transform duration-700 group-hover:scale-[1.04]" />
                {p.caption && <figcaption className="text-xs text-gray-500 px-2 py-1.5">{p.caption}</figcaption>}
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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openAlbum, setOpenAlbum] = useState(null);

  useEffect(() => {
    fetch(`/api/profile/${params.id}`).then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-[#5bc1d5] border-t-transparent rounded-full" /></div>;
  if (!data?.profile) return <div className="min-h-[60vh] flex items-center justify-center text-gray-500">Profile not found.</div>;

  const { profile, trips, badges, hosting } = data;
  const isMe = user?.id === params.id;
  const states = [...new Set(trips.map(t => t.state).filter(Boolean))];
  const photoCount = trips.reduce((n, t) => n + (t.photos?.length || 0), 0);
  const memberSince = new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const meta = [profile.age ? `${profile.age} yrs` : null, profile.city || 'India'].filter(Boolean).join(' · ');

  return (
    <div className="bg-[#fafafa] min-h-screen">
      {/* Header */}
      <div className="text-white" style={{ background: 'linear-gradient(135deg,#1a1a2e 0%,#12343f 60%,#1f77a3 150%)' }}>
        <div className="container-max py-10 md:py-14">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="rounded-full p-1 bg-white/15"><Avatar src={profile.profile_photo} name={profile.full_name} size={104} /></div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{profile.full_name}</h1>
                {profile.is_verified && <span className="bg-white/15 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1"><ShieldCheck size={12} /> Verified</span>}
              </div>
              <p className="text-white/70 text-sm flex items-center gap-1 justify-center sm:justify-start mt-1"><MapPin size={14} /> {meta}</p>
              {profile.bio && <p className="text-white/85 text-sm mt-3 max-w-xl">{profile.bio}</p>}
              {profile.trip_style?.length > 0 && <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-3">{profile.trip_style.map(s => <span key={s} className="bg-white/10 text-white text-xs px-3 py-1 rounded-full">{s}</span>)}</div>}
              <div className="flex gap-6 justify-center sm:justify-start text-sm mt-5">
                {[[trips.length, 'Albums'], [photoCount, 'Photos'], [states.length, 'States'], [badges.length, 'Badges']].map(([v, l]) => <div key={l} className="text-center"><p className="font-bold text-xl tabular-nums">{v}</p><p className="text-white/60 text-xs">{l}</p></div>)}
              </div>
            </div>
            <div className="flex flex-col gap-2 items-center sm:items-end">
              {profile.instagram_handle && <a href={`https://instagram.com/${profile.instagram_handle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white flex items-center gap-1.5 text-sm"><InstagramIcon size={16} /> {profile.instagram_handle}</a>}
              {isMe && <Link href="/dashboard?tab=settings" className="btn-white text-sm py-2">Edit profile</Link>}
              <p className="text-white/50 text-xs">Member since {memberSince}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-max py-10 space-y-12">
        {isMe && <p className="text-xs text-gray-500 bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-2"><Lock size={13} /> This is how others see you. Only albums marked public appear here. Manage them in your <Link href="/dashboard?tab=gallery" className="text-[#1f77a3] font-semibold">dashboard</Link>.</p>}

        {hosting?.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5"><h2 className="text-2xl font-bold text-[#1a1a2e]" style={{ fontFamily: "'Playfair Display', serif" }}>Trips {profile.full_name.split(' ')[0]} is hosting</h2><Link href={CT.base} className="text-sm font-semibold text-[#1f77a3]">All {CT.label.toLowerCase()} →</Link></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">{hosting.map(t => <CommunityTripCard key={t.id} trip={t} />)}</div>
          </section>
        )}

        <section>
          <div className="flex items-center gap-3 mb-5"><Images size={20} className="text-[#1f77a3]" /><h2 className="text-2xl font-bold text-[#1a1a2e]" style={{ fontFamily: "'Playfair Display', serif" }}>Travel gallery</h2></div>
          {trips.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center text-gray-400 text-sm">{isMe ? 'No public albums yet. Create one from your dashboard.' : 'No public albums yet.'}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trips.map((a, i) => <div key={a.id} className="tt-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}><AlbumCard album={a} onOpen={() => setOpenAlbum(a)} /></div>)}
            </div>
          )}
        </section>

        {badges.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>Badges</h2>
            <div className="flex flex-wrap gap-3">{badges.map(b => <div key={b.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3"><span className="text-2xl">{b.badges?.icon}</span><div><p className="font-semibold text-sm text-[#1a1a2e]">{b.badges?.name}</p><p className="text-xs text-gray-400">{b.badges?.description}</p></div></div>)}</div>
          </section>
        )}

        {!isMe && (
          <section className="rounded-3xl p-8 text-white text-center" style={{ background: 'linear-gradient(135deg,#1f77a3,#5bc1d5)' }}>
            <Compass size={26} className="mx-auto mb-3" />
            <h3 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Want to travel with {profile.full_name.split(' ')[0]}?</h3>
            <p className="text-white/85 text-sm mt-1 mb-5">Join one of their trips, or start your own and invite them.</p>
            <div className="flex gap-2 justify-center flex-wrap"><Link href={CT.base} className="bg-white text-[#1f77a3] font-semibold text-sm px-5 py-2.5 rounded-full">Browse trips</Link><Link href={`${CT.base}/new`} className="border border-white/70 text-white font-semibold text-sm px-5 py-2.5 rounded-full">Create a trip</Link></div>
          </section>
        )}
      </div>

      {openAlbum && <AlbumViewer album={openAlbum} onClose={() => setOpenAlbum(null)} />}
    </div>
  );
}
