'use client';
import { Lock, Globe, Images } from 'lucide-react';

const FALLBACK = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80';

// A "photo pile": the cover sits on top of up to three fanned-out photos. Hover fans them further.
export default function AlbumCard({ album, onOpen, controls, showVisibility = false }) {
  const photos = album.photos || [];
  const cover = album.cover_photo || photos[0]?.url || FALLBACK;
  const behind = photos.filter(p => p.url !== cover).slice(0, 3);
  const when = album.travel_date_from ? new Date(album.travel_date_from).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : null;
  const rot = [-7, 5, -3];

  return (
    <div className="group flex flex-col">
      <button type="button" onClick={onOpen} className="relative block w-full aspect-[4/3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5bc1d5] rounded-2xl" aria-label={`Open ${album.destination} album`}>
        {behind.map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={p.id || i} src={p.url} alt="" className="absolute inset-0 w-full h-full object-cover rounded-2xl shadow-md transition-transform duration-500 ease-out"
            style={{ transform: `rotate(${rot[i]}deg) scale(0.94) translateY(${(i + 1) * 3}px)`, zIndex: 3 - i, '--r': `${rot[i] * 1.8}deg` }}
            onLoad={e => { e.currentTarget.dataset.loaded = '1'; }} />
        ))}
        <style jsx>{`
          .group:hover img[style] { transform: rotate(var(--r)) scale(0.96) translate(0, -6px) !important; }
          .group:hover .cover { transform: translateY(-4px) scale(1.01); }
        `}</style>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt={album.destination} className="cover relative z-10 w-full h-full object-cover rounded-2xl shadow-lg transition-transform duration-500 ease-out" />
        <div className="absolute inset-0 z-20 rounded-2xl bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />
        <div className="absolute z-30 top-3 left-3 flex gap-1.5">
          {showVisibility && (
            album.is_public === false
              ? <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-black/60 text-white"><Lock size={11} /> Private</span>
              : <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-white/85 text-[#1a1a2e]"><Globe size={11} /> Public</span>
          )}
        </div>
        <span className="absolute z-30 top-3 right-3 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-white/85 text-[#1a1a2e]"><Images size={11} /> {photos.length}</span>
        <div className="absolute z-30 bottom-3 left-4 right-4 text-left text-white pointer-events-none">
          <p className="font-bold text-lg leading-tight drop-shadow" style={{ fontFamily: "'Playfair Display', serif" }}>{album.destination}</p>
          <p className="text-[11px] text-white/85">{[album.state, when].filter(Boolean).join(' · ')}</p>
        </div>
      </button>
      {controls && <div className="mt-2">{controls}</div>}
    </div>
  );
}
