'use client';

export default function Avatar({ src, name, size = 40, className = '', ring = false }) {
  const initial = (name || 'T').trim().charAt(0).toUpperCase();
  return (
    <div className={`rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-semibold ${className}`}
      style={{ width: size, height: size, background: '#181818', color: '#fff', fontSize: Math.max(12, size * 0.4), border: ring ? '2px solid rgba(255,255,255,0.9)' : '1px solid rgba(255,255,255,0.12)', fontFamily: "'Poppins', sans-serif" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src ? <img src={src} alt={name || ''} className="w-full h-full object-cover" /> : initial}
    </div>
  );
}
