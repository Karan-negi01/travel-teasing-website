'use client';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// Client hook: current Supabase session + a fetch wrapper that attaches the access token.
export function useSession() {
  const [session, setSession] = useState(undefined); // undefined = still loading
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => { if (active) setSession(data.session || null); });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => { if (active) setSession(s || null); });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  const authFetch = useCallback(async (url, opts = {}) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    const headers = { ...(opts.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    const isForm = typeof FormData !== 'undefined' && opts.body instanceof FormData;
    if (opts.body && !isForm && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
    const res = await fetch(url, { ...opts, headers, body: isForm || typeof opts.body === 'string' || !opts.body ? opts.body : JSON.stringify(opts.body) });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || 'Something went wrong. Please try again.');
    return json;
  }, []);

  return { session, user: session?.user || null, loading: session === undefined, authFetch };
}

export function loginHref(next) {
  return `/login?redirect=${encodeURIComponent(next || '/dashboard')}`;
}
