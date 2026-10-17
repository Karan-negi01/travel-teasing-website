'use client';

export default function Avatar({ src, name, size = 40, className = '' }) {
  const initial = (name || 'T').trim().charAt(0).toUpperCase();
  return (
    <div className={`rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-white ${className}`}
      style={{ width: size, height: size, background: 'linear-gradient(135deg,#5bc1d5,#1f77a3)', fontSize: Math.max(12, size * 0.42) }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src ? <img src={src} alt={name || ''} className="w-full h-full object-cover" /> : initial}
    </div>
  );
}
