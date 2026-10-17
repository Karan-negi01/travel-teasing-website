'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { safeRedirect } from '@/components/AuthShell';

const G = <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.8 6.1C12.3 13.6 17.6 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-2.8-.4-4H24v7.6h12.9c-.3 2.1-1.7 5.3-4.8 7.4l7.4 5.7c4.4-4.1 7-10.1 7-16.7z"/><path fill="#FBBC05" d="M10.4 28.6A14.7 14.7 0 0 1 9.6 24c0-1.6.3-3.1.8-4.6l-7.8-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l7.8-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2 1.4-4.7 2.4-8.5 2.4-6.4 0-11.7-4.1-13.6-9.9l-7.8 6.1C6.5 42.6 14.6 48 24 48z"/></svg>;

// "Continue with Google" via Supabase OAuth. Finishes on /auth/callback, which also creates the profile row for new users.
export default function GoogleButton({ label = 'Continue with Google', onError }) {
  const [busy, setBusy] = useState(false);
  async function go() {
    setBusy(true);
    const next = safeRedirect('/dashboard');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(next)}`, queryParams: { prompt: 'select_account' }, skipBrowserRedirect: true },
    });
    if (error || !data?.url) { setBusy(false); onError?.(error?.message || 'Could not start Google sign-in.'); return; }
    // Pre-flight: if the provider is disabled, Supabase answers 400 instead of redirecting to Google.
    try {
      const res = await fetch(data.url, { redirect: 'manual' });
      if (res.status === 400) {
        const j = await res.json().catch(() => ({}));
        setBusy(false);
        onError?.(/provider/i.test(j.msg || j.error_description || '') ? 'Google sign-in is not switched on yet. Use email and password for now.' : (j.msg || 'Could not start Google sign-in.'));
        return;
      }
    } catch { /* opaque or blocked — just continue to Google */ }
    window.location.assign(data.url);
  }
  return (
    <button type="button" onClick={go} disabled={busy} className="auth-google w-full h-[54px] inline-flex items-center justify-center gap-3 text-[14px] font-medium transition-colors duration-150 disabled:opacity-60">
      {G} {busy ? 'Opening Google…' : label}
    </button>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-4 my-7" aria-hidden="true">
      <span className="auth-rule flex-1 h-px" /><span className="auth-eyebrow text-[10px] uppercase" style={{ letterSpacing: '0.3em' }}>or</span><span className="auth-rule flex-1 h-px" />
    </div>
  );
}
