'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AuthShell, { authInput, authLabel, authLabelStyle, authButton, authButtonStyle, authLink, preserveRedirect, safeRedirect } from '@/components/AuthShell';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signupHref, setSignupHref] = useState('/signup');
  const router = useRouter();

  useEffect(() => { setSignupHref(preserveRedirect('/signup')); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Enter your email and password.'); return; }
    setLoading(true); setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email: form.email.trim(), password: form.password });
    if (err) { setError(err.message === 'Invalid login credentials' ? 'That email and password do not match.' : err.message); setLoading(false); return; }
    router.push(safeRedirect('/dashboard'));
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in"
      footer={<p>New to Travel Teasing? <Link href={signupHref} className={authLink}>Create an account</Link></p>}
    >
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label htmlFor="login-email" className={authLabel} style={authLabelStyle}>Email</label>
          <input id="login-email" type="email" autoComplete="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={authInput} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="login-password" className={`${authLabel} mb-0`} style={authLabelStyle}>Password</label>
            <a href="https://wa.me/918510988703?text=Hi!%20I%20forgot%20my%20Travel%20Teasing%20password." target="_blank" rel="noopener noreferrer" className="auth-sub text-[11px] uppercase hover:opacity-70" style={{ letterSpacing: '0.14em' }}>Forgot?</a>
          </div>
          <div className="relative">
            <input id="login-password" type={show ? 'text' : 'password'} autoComplete="current-password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className={`${authInput} pr-12`} />
            <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'} className="auth-sub absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:opacity-70">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
        </div>
        {error && <p className="auth-error text-[13px]">{error}</p>}
        <button type="submit" disabled={loading} className={authButton} style={authButtonStyle}>{loading ? 'Signing in' : 'Sign in'}</button>
      </form>
    </AuthShell>
  );
}
