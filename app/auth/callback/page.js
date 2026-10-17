'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Lands here after Google. The Supabase client exchanges the code itself; we just wait for the session,
// make sure a profile exists, then continue to where the user was going.
export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const oauthError = params.get('error_description') || hash.get('error_description') || params.get('error');
    if (oauthError) { setError(decodeURIComponent(oauthError.replace(/\+/g, ' '))); return; }

    const r = params.get('redirect');
    const next = r && r.startsWith('/') && !r.startsWith('//') ? r : '/dashboard';
    let done = false;

    const finish = async (session) => {
      if (done || !session) return; done = true;
      try { await fetch('/api/auth/ensure-profile', { method: 'POST', headers: { Authorization: `Bearer ${session.access_token}` } }); } catch {}
      router.replace(next);
    };

    supabase.auth.getSession().then(({ data }) => finish(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => finish(session));
    const t = setTimeout(() => { if (!done) setError('We could not complete the sign-in. Please try again.'); }, 10000);
    return () => { sub.subscription.unsubscribe(); clearTimeout(t); };
  }, [router]);

  return (
    <div className="auth-pane min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Travel Teasing" className="auth-logo h-14 w-auto mb-8" />
      {error ? (
        <>
          <p className="auth-eyebrow text-[11px] uppercase mb-3" style={{ letterSpacing: '0.32em' }}>Sign-in failed</p>
          <p className="auth-title text-[15px] max-w-sm">{error}</p>
          <Link href="/login" className="auth-link text-sm mt-8 underline underline-offset-4">Back to sign in</Link>
        </>
      ) : (
        <>
          <div className="w-8 h-8 rounded-full border-2 border-[#5bc1d5] border-t-transparent animate-spin mb-5" />
          <p className="auth-eyebrow text-[11px] uppercase" style={{ letterSpacing: '0.32em' }}>Signing you in</p>
        </>
      )}
    </div>
  );
}
