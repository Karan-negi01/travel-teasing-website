'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Images, ShieldCheck } from 'lucide-react';

const SLIDES = [
  { img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600&q=80', place: 'Manali, Himachal', quote: 'Strangers today. Legends tomorrow.' },
  { img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80', place: 'Leh, Ladakh', quote: 'Go where the road forgets to end.' },
  { img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&q=80', place: 'Rishikesh, Uttarakhand', quote: 'Collect moments. Then show them off.' },
  { img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=80', place: 'Goa', quote: 'Your people are already packing.' },
];

const PERKS = [
  { icon: Users,       text: 'Create a trip on any FIT package and pick who joins' },
  { icon: Images,      text: 'A personal travel gallery, public or private, album by album' },
  { icon: ShieldCheck, text: 'Every traveller has a profile, so you know who you ride with' },
];

// Split-screen frame shared by login and signup.
export default function AuthShell({ title, subtitle, children, footer }) {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI(n => (n + 1) % SLIDES.length), 5000); return () => clearInterval(t); }, []);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] bg-white">
      {/* Left: imagery */}
      <aside className="relative hidden lg:block overflow-hidden bg-[#1a1a2e]">
        {SLIDES.map((s, idx) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={s.img} src={s.img} alt="" className="absolute inset-0 w-full h-full object-cover transition-all duration-[1600ms] ease-out"
            style={{ opacity: idx === i ? 1 : 0, transform: idx === i ? 'scale(1)' : 'scale(1.06)' }} />
        ))}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,12,24,.55) 0%, rgba(10,12,24,.15) 40%, rgba(10,12,24,.85) 100%)' }} />
        <div className="relative h-full flex flex-col justify-between p-12 xl:p-16 text-white">
          <Link href="/" className="inline-block w-fit">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Travel Teasing" className="w-40" style={{ filter: 'brightness(0) invert(1)' }} />
          </Link>
          <div>
            <p key={i} className="text-4xl xl:text-5xl font-bold leading-[1.1] max-w-md tt-fade-up" style={{ fontFamily: "'Playfair Display', serif" }}>{SLIDES[i].quote}</p>
            <p className="mt-4 text-sm text-white/70 tracking-[0.18em] uppercase">{SLIDES[i].place}</p>
            <ul className="mt-10 space-y-3 max-w-md">
              {PERKS.map(p => (
                <li key={p.text} className="flex items-start gap-3 text-sm text-white/85">
                  <span className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(91,193,213,.22)', color: '#5bc1d5' }}><p.icon size={14} /></span>
                  {p.text}
                </li>
              ))}
            </ul>
            <div className="flex gap-1.5 mt-10">
              {SLIDES.map((_, idx) => <button key={idx} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`} className="h-1 rounded-full transition-all duration-500" style={{ width: idx === i ? 28 : 10, background: idx === i ? '#5bc1d5' : 'rgba(255,255,255,.35)' }} />)}
            </div>
          </div>
        </div>
      </aside>

      {/* Right: form */}
      <main className="relative flex flex-col px-6 sm:px-12 pt-28 pb-12 lg:pt-32 lg:justify-center">
        <div className="auth-glow absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-60 pointer-events-none" style={{ background: 'radial-gradient(circle, #e0f4f8 0%, transparent 70%)' }} />
        <div className="w-full max-w-[420px] mx-auto relative">
          <Link href="/" className="lg:hidden inline-block mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Travel Teasing" className="w-32" />
          </Link>
          <h1 className="text-3xl sm:text-[34px] font-bold text-[#1a1a2e] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h1>
          {subtitle && <p className="text-gray-500 text-sm mt-2">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 text-sm text-gray-500">{footer}</div>}
        </div>
      </main>
    </div>
  );
}

export const authInput = 'auth-input w-full bg-[#f6f9fb] border border-transparent rounded-xl pl-11 pr-4 py-3.5 text-[15px] text-[#1a1a2e] placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-[#5bc1d5] focus:ring-4 focus:ring-[#5bc1d5]/20';
export const authLabel = 'block text-xs font-semibold tracking-wide text-gray-600 mb-1.5';
export const authButton = 'w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-[15px] font-semibold text-white transition-all active:scale-[.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_10px_24px_-10px_rgba(31,119,163,.6)] hover:shadow-[0_14px_28px_-10px_rgba(31,119,163,.7)]';
export const authButtonStyle = { background: 'linear-gradient(135deg,#5bc1d5,#1f77a3)' };
export const authChip = (on) => `px-3.5 py-2 rounded-xl text-sm border font-medium transition ${on ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'}`;

export function preserveRedirect(path) {
  if (typeof window === 'undefined') return path;
  const r = new URLSearchParams(window.location.search).get('redirect');
  return r ? `${path}?redirect=${encodeURIComponent(r)}` : path;
}

export function safeRedirect(fallback = '/dashboard') {
  const r = new URLSearchParams(window.location.search).get('redirect');
  return r && r.startsWith('/') && !r.startsWith('//') ? r : fallback;
}
