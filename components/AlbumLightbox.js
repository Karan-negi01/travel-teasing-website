'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Full-screen photo viewer with keyboard, swipe and a filmstrip.
export default function AlbumLightbox({ photos = [], index = 0, title, onClose }) {
  const [i, setI] = useState(index);
  const [dir, setDir] = useState(0);
  const touchX = useRef(null);
  const count = photos.length;

  const go = useCallback((n) => {
    if (!count) return;
    setDir(n > i ? 1 : -1);
    setI(((n % count) + count) % count);
  }, [count, i]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(i + 1);
      if (e.key === 'ArrowLeft') go(i - 1);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [go, i, onClose]);

  if (!count) return null;
  const photo = photos[i];

  return (
    <div className="fixed inset-0 z-[300] bg-black/95 flex flex-col select-none" role="dialog" aria-label={`${title || 'Album'} photo ${i + 1} of ${count}`}
      onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={e => { if (touchX.current === null) return; const dx = e.changedTouches[0].clientX - touchX.current; if (Math.abs(dx) > 50) go(dx < 0 ? i + 1 : i - 1); touchX.current = null; }}>
      <div className="flex items-center justify-between px-4 py-3 text-white/80 text-sm">
        <span className="font-medium truncate">{title}</span>
        <div className="flex items-center gap-4">
          <span className="tabular-nums">{i + 1} / {count}</span>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10" aria-label="Close"><X size={20} /></button>
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center min-h-0 px-2 sm:px-16" onClick={e => e.target === e.currentTarget && onClose()}>
        <button onClick={() => go(i - 1)} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white" aria-label="Previous"><ChevronLeft size={22} /></button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={photo.id || photo.url} src={photo.url} alt={photo.caption || ''}
          className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
          style={{ animation: `ttSlideIn${dir < 0 ? 'Left' : 'Right'} .35s cubic-bezier(.22,1,.36,1)` }} />
        <button onClick={() => go(i + 1)} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white" aria-label="Next"><ChevronRight size={22} /></button>
      </div>

      {photo.caption && <p className="text-center text-white/80 text-sm px-6 pb-2">{photo.caption}</p>}

      <div className="flex gap-2 overflow-x-auto px-4 pb-4 pt-1 scrollbar-hide justify-start sm:justify-center">
        {photos.map((p, idx) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={p.id || idx} src={p.url} alt="" onClick={() => go(idx)}
            className={`h-14 w-20 object-cover rounded-md cursor-pointer flex-shrink-0 transition-all ${idx === i ? 'ring-2 ring-[#5bc1d5] opacity-100 scale-105' : 'opacity-50 hover:opacity-90'}`} />
        ))}
      </div>
      <style jsx global>{`
        @keyframes ttSlideInRight { from { opacity: 0; transform: translateX(24px) scale(.98); } to { opacity: 1; transform: none; } }
        @keyframes ttSlideInLeft  { from { opacity: 0; transform: translateX(-24px) scale(.98); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}
