'use client';
import { Lock, Images } from 'lucide-react';

const FALLBACK = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80';

// Matches the homepage destination tiles: rounded image, dark gradient, name bottom-left. Hover lifts the photo stack behind it.
export default function AlbumCard({ album, onOpen, controls, showVisibility = false }) {
  const photos = album.photos || [];
  const cover = album.cover_photo || photos[0]?.url || FALLBACK;
  const behind = photos.filter(p => p.url !== cover).slice(0, 2);
  const when = album.travel_date_from ? new Date(album.travel_date_from).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : null;

  return (
    <div className="group flex flex-col">
      <button type="button" onClick={onOpen} className="relative block w-full aspect-[4/5] rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5bc1d5]" aria-label={`Open ${album.destination} album`}>
        {behind.map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={p.id || i} src={p.url} alt="" className="absolute inset-0 w-full h-full object-cover rounded-2xl transition-transform duration-500 ease-out"
            style={{ transform: `rotate(${i === 0 ? -4 : 3}deg) scale(.96)`, opacity: .9, zIndex: 1 }} />
        ))}
        <style jsx>{`.group:hover img[style] { transform: rotate(${behind.length ? '-7deg' : '0'}) scale(.97) translateY(-10px) !important; } .group:hover img[style]:nth-of-type(2) { transform: rotate(6deg) scale(.97) translateY(-6px) !important; }`}</style>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt={album.destination} className="relative z-10 w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]" />
        <div className="absolute inset-0 z-20 rounded-2xl bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />
        <div className="absolute z-30 top-3 left-3 right-3 flex items-center justify-between">
          {showVisibility && album.is_public === false
            ? <span className="inline-flex items-center gap-1 rounded-full bg-black/55 backdrop-blur px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white"><Lock size={10} /> Private</span>
            : <span />}
          <span className="inline-flex items-center gap-1 rounded-full bg-white/92 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#0d0d0d]"><Images size={10} /> {photos.length}</span>
        </div>
        <div className="absolute z-30 bottom-4 left-4 right-4 text-left text-white pointer-events-none" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <p className="font-semibold text-[18px] leading-tight">{album.destination}</p>
          <p className="text-[11px] text-white/70 mt-1 uppercase tracking-[0.12em]">{[album.state, when].filter(Boolean).join(' · ')}</p>
        </div>
      </button>
      {controls && <div className="mt-2">{controls}</div>}
    </div>
  );
}
