'use client';
import { useEffect, useState } from 'react';

// Full-screen logo splash on the first page load of a browser session. Fades out once the page has loaded.
export default function SiteLoader() {
  const [state, setState] = useState('hidden'); // hidden | shown | leaving

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem('tt_splash') === '1'; } catch {}
    if (seen) return;
    setState('shown');
    const started = Date.now();
    const MIN = 1300;
    const finish = () => {
      const wait = Math.max(0, MIN - (Date.now() - started));
      setTimeout(() => {
        setState('leaving');
        try { sessionStorage.setItem('tt_splash', '1'); } catch {}
        setTimeout(() => setState('hidden'), 650);
      }, wait);
    };
    if (document.readyState === 'complete') finish(); else window.addEventListener('load', finish, { once: true });
    const safety = setTimeout(finish, 4000);
    return () => { clearTimeout(safety); window.removeEventListener('load', finish); };
  }, []);

  if (state === 'hidden') return null;
  return (
    <div aria-hidden="true" className="fixed inset-0 z-[1000] flex flex-col items-center justify-center"
      style={{ background: 'radial-gradient(120% 120% at 50% 0%, #12343f 0%, #1a1a2e 60%)', transition: 'opacity .6s ease, visibility .6s', opacity: state === 'leaving' ? 0 : 1, visibility: state === 'leaving' ? 'hidden' : 'visible' }}>
      <div style={{ animation: 'ttLogoIn .9s cubic-bezier(.22,1,.36,1) both' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Travel Teasing" style={{ width: 'min(220px, 55vw)', filter: 'brightness(0) invert(1)', animation: 'ttLogoFloat 2.4s ease-in-out infinite' }} />
      </div>
      <div className="mt-8 w-40 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,.12)' }}>
        <div className="h-full rounded-full" style={{ width: '40%', background: 'linear-gradient(90deg,#5bc1d5,#E8651A)', animation: 'ttBar 1.1s ease-in-out infinite' }} />
      </div>
      <p className="mt-4 text-[11px] tracking-[.3em] uppercase" style={{ color: 'rgba(255,255,255,.5)', fontFamily: "'Poppins', sans-serif" }}>Packing your bags</p>
    </div>
  );
}
