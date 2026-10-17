'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Images, ShieldCheck, Star, MapPin, Calendar, Lock } from 'lucide-react';

const SLIDES = [
  { img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1800&q=85', place: 'Manali, Himachal',       a: 'Strangers today.',    b: 'Legends tomorrow.' },
  { img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1800&q=85', place: 'Leh, Ladakh',             a: 'Go where the road',   b: 'forgets to end.' },
  { img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1800&q=85',    place: 'Rishikesh, Uttarakhand',  a: 'Collect moments.',    b: 'Then show them off.' },
  { img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1800&q=85', place: 'Goa',                     a: 'Your people are',     b: 'already packing.' },
];

const PERKS = [
  { icon: Users,       text: 'Start a trip on any FIT package. You choose who joins.' },
  { icon: Images,      text: 'A travel gallery of your own, album by album, public or private.' },
  { icon: ShieldCheck, text: 'Real profiles, so you always know who you ride with.' },
];

export default function AuthShell({ title, subtitle, eyebrow = 'Travel Teasing account', children, footer }) {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI(n => (n + 1) % SLIDES.length), 6500); return () => clearInterval(t); }, []);
  const s = SLIDES[i];

  return (
    <div className="auth-root min-h-screen grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
      {/* ───── Left: cinematic imagery ───── */}
      <aside className="relative hidden lg:block overflow-hidden bg-[#0b1020]">
        {SLIDES.map((sl, idx) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={sl.img} src={sl.img} alt="" className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: idx === i ? 1 : 0, transition: 'opacity 1.4s ease', animation: idx === i ? 'authKenBurns 7s ease-out forwards' : 'none' }} />
        ))}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(8,12,26,.62) 0%, rgba(8,12,26,.10) 35%, rgba(8,12,26,.35) 65%, rgba(8,12,26,.92) 100%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 60% at 22% 72%, rgba(8,12,26,.82) 0%, rgba(8,12,26,.45) 45%, rgba(8,12,26,0) 75%), linear-gradient(90deg, rgba(8,12,26,.5) 0%, rgba(8,12,26,0) 60%)' }} />
        <div className="absolute inset-0 auth-grain pointer-events-none" />

        <div className="relative h-full flex flex-col justify-between p-12 xl:p-16 text-white">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Travel Teasing" className="w-36 xl:w-40" style={{ filter: 'brightness(0) invert(1)' }} />
            </Link>
            <span className="text-[11px] tracking-[0.28em] uppercase text-white/60">Since 2019 · India &amp; beyond</span>
          </div>

          <div className="grid grid-cols-[1fr_auto] items-end gap-8">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#5bc1d5] mb-5 flex items-center gap-3"><span className="w-8 h-px bg-[#5bc1d5]" /> {s.place}</p>
              <h2 key={i} className="text-[38px] xl:text-[46px] leading-[1.05] font-bold max-w-[17ch] tt-fade-up" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.01em', color: '#ffffff', textShadow: '0 4px 40px rgba(0,0,0,.75), 0 1px 3px rgba(0,0,0,.6)' }}>
                {s.a}<br /><em className="font-semibold" style={{ color: '#9fdfeb' }}>{s.b}</em>
              </h2>
              <ul className="mt-9 space-y-2.5 max-w-md">
                {PERKS.map(p => (
                  <li key={p.text} className="flex items-center gap-3 text-[13.5px] text-white/85 rounded-full pl-1.5 pr-4 py-1.5 w-fit" style={{ background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', backdropFilter: 'blur(8px)' }}>
                    <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(91,193,213,.22)', color: '#5bc1d5' }}><p.icon size={13} /></span>
                    {p.text}
                  </li>
                ))}
              </ul>
              <div className="flex gap-1.5 mt-10">
                {SLIDES.map((_, idx) => <button key={idx} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`} className="h-[3px] rounded-full transition-all duration-500" style={{ width: idx === i ? 34 : 10, background: idx === i ? '#5bc1d5' : 'rgba(255,255,255,.3)' }} />)}
              </div>
            </div>

            {/* Glass trip-card preview */}
            <div className="hidden xl:block w-[250px] rounded-2xl p-4 text-white" style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.16)', backdropFilter: 'blur(16px)', boxShadow: '0 30px 60px -30px rgba(0,0,0,.6)', animation: 'authFloat 6s ease-in-out infinite' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#5bc1d5]">Community trip</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(91,193,213,.2)', color: '#9fdfeb' }}>Open</span>
              </div>
              <p className="font-bold text-[17px] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Spiti in October</p>
              <p className="text-[11px] text-white/70 mt-1 flex items-center gap-3"><span className="flex items-center gap-1"><MapPin size={10} /> Himachal</span><span className="flex items-center gap-1"><Calendar size={10} /> 7 days</span></p>
              <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                {['Women only', 'Chill', 'Photography'].map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,.1)' }}>{t}</span>)}
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-[10px] text-white/70 mb-1"><span>4 of 6 travellers</span><span className="text-[#9fdfeb] font-semibold">2 spots left</span></div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.15)' }}><div className="h-full rounded-full" style={{ width: '66%', background: 'linear-gradient(90deg,#5bc1d5,#1f77a3)' }} /></div>
              </div>
              <div className="flex items-center mt-4">
                {['A', 'R', 'P', 'S'].map((l, k) => <span key={l} className="w-7 h-7 rounded-full border-2 border-[#13223a] flex items-center justify-center text-[10px] font-bold" style={{ marginLeft: k ? -8 : 0, background: ['#5bc1d5', '#e8748a', '#9c72c8', '#E8651A'][k] }}>{l}</span>)}
                <span className="text-[10px] text-white/60 ml-2">approved by the host</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ───── Right: form ───── */}
      <main className="auth-pane relative flex flex-col px-5 sm:px-10 pt-28 pb-14 lg:pt-32 lg:justify-center overflow-hidden">
        <div className="auth-glow auth-glow-a" /><div className="auth-glow auth-glow-b" />
        <div className="w-full max-w-[440px] mx-auto relative">
          <Link href="/" className="lg:hidden inline-block mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Travel Teasing" className="w-32 auth-logo" />
          </Link>

          <div className="auth-card rounded-[28px] p-7 sm:p-9">
            <p className="text-[10.5px] font-bold tracking-[0.26em] uppercase text-[#1f77a3] mb-3">{eyebrow}</p>
            <h1 className="auth-title text-[30px] sm:text-[36px] leading-[1.08] font-bold" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.01em' }}>{title}</h1>
            {subtitle && <p className="auth-sub text-[14px] leading-relaxed mt-3">{subtitle}</p>}
            <div className="mt-7">{children}</div>
            {footer && <div className="auth-sub mt-7 pt-6 border-t text-sm auth-divider">{footer}</div>}
          </div>

          <div className="auth-sub mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px]">
            <span className="flex items-center gap-1.5"><Star size={12} className="fill-[#f5b301] text-[#f5b301]" /> 4.9 rated</span>
            <span className="opacity-30">•</span>
            <span>10K+ travellers</span>
            <span className="opacity-30">•</span>
            <span>150+ destinations</span>
            <span className="opacity-30">•</span>
            <span className="flex items-center gap-1.5"><Lock size={11} /> Secure login</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export const authInput = 'auth-input w-full rounded-2xl pl-12 pr-4 py-[15px] text-[15px] outline-none transition-all duration-200';
export const authLabel = 'auth-label block text-[12px] font-semibold tracking-wide mb-2';
export const authButton = 'auth-btn relative overflow-hidden w-full inline-flex items-center justify-center gap-2 rounded-2xl py-[15px] text-[15px] font-semibold text-white transition-all duration-200 active:scale-[.985] disabled:cursor-not-allowed';
export const authButtonStyle = { background: 'linear-gradient(135deg,#5bc1d5 0%,#2a93b8 55%,#1f77a3 100%)' };
export const authChip = (on) => `auth-chip px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${on ? 'is-on' : ''}`;

export function preserveRedirect(path) {
  if (typeof window === 'undefined') return path;
  const r = new URLSearchParams(window.location.search).get('redirect');
  return r ? `${path}?redirect=${encodeURIComponent(r)}` : path;
}

export function safeRedirect(fallback = '/dashboard') {
  const r = new URLSearchParams(window.location.search).get('redirect');
  return r && r.startsWith('/') && !r.startsWith('//') ? r : fallback;
}
