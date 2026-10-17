'use client';
import Link from 'next/link';

const PHOTO = 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1800&q=85';

// Editorial split screen: one still photograph with a tracked tagline, and a quiet off-white form panel.
export default function AuthShell({ eyebrow, title, children, footer }) {
  return (
    <div className="auth-root min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <aside className="auth-photo relative hidden lg:block overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PHOTO} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,.45) 100%)' }} />
        <p className="absolute left-10 xl:left-14 bottom-10 xl:bottom-12 text-white font-light uppercase leading-none" style={{ fontSize: 'clamp(26px, 2.7vw, 42px)', letterSpacing: '0.16em', fontFamily: "'Poppins', 'Inter', sans-serif" }}>
          Strangers today.<br />Legends tomorrow.
        </p>
      </aside>

      <main className="auth-pane relative flex flex-col px-6 sm:px-12 lg:px-20 xl:px-28 pt-10 pb-14 min-h-screen">
        <Link href="/" className="inline-block w-fit">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Travel Teasing" className="auth-logo h-14 w-auto" />
        </Link>

        <div className="flex-1 flex flex-col justify-center py-16">
          <div className="w-full max-w-[460px] mx-auto">
            {eyebrow && <p className="auth-eyebrow text-[11px] uppercase mb-3" style={{ letterSpacing: '0.32em' }}>{eyebrow}</p>}
            <h1 className="auth-title uppercase font-light leading-none mb-10" style={{ fontSize: 'clamp(26px, 2.5vw, 34px)', letterSpacing: '0.14em', whiteSpace: 'nowrap', fontFamily: "'Poppins', 'Inter', sans-serif" }}>{title}</h1>
            {children}
            {footer && <div className="auth-sub text-[14.5px] text-center mt-10">{footer}</div>}
          </div>
        </div>
      </main>
    </div>
  );
}

export const authLabel = 'auth-label block text-[11px] uppercase mb-2';
export const authLabelStyle = { letterSpacing: '0.22em' };
export const authInput = 'auth-input w-full h-[52px] px-4 text-[15px] outline-none transition-colors duration-150';
export const authButton = 'auth-btn w-full h-[54px] inline-flex items-center justify-center text-[12.5px] font-semibold uppercase text-white transition-colors duration-150 disabled:cursor-not-allowed';
export const authButtonStyle = { letterSpacing: '0.28em' };
export const authGhost = 'auth-ghost h-[54px] inline-flex items-center justify-center px-6 text-[12.5px] font-semibold uppercase transition-colors duration-150';
export const authChip = (on) => `auth-chip h-[44px] inline-flex items-center justify-center px-4 text-[12px] uppercase transition-colors duration-150 ${on ? 'is-on' : ''}`;
export const authChipStyle = { letterSpacing: '0.14em' };
export const authLink = 'auth-link underline underline-offset-4 decoration-1';

export function preserveRedirect(path) {
  if (typeof window === 'undefined') return path;
  const r = new URLSearchParams(window.location.search).get('redirect');
  return r ? `${path}?redirect=${encodeURIComponent(r)}` : path;
}

export function safeRedirect(fallback = '/dashboard') {
  const r = new URLSearchParams(window.location.search).get('redirect');
  return r && r.startsWith('/') && !r.startsWith('//') ? r : fallback;
}
