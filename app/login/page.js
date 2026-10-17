'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AuthShell, { authInput, authLabel, authButton, authButtonStyle, preserveRedirect, safeRedirect } from '@/components/AuthShell';

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
    setLoading(true); setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email: form.email.trim(), password: form.password });
    if (err) { setError(err.message === 'Invalid login credentials' ? 'That email and password do not match.' : err.message); setLoading(false); return; }
    router.push(safeRedirect('/dashboard'));
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to see your trips, your gallery and who wants to travel with you."
      footer={<p>New to Travel Teasing? <Link href={signupHref} className="font-semibold text-[#1f77a3] hover:underline">Create an account</Link></p>}
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="login-email" className={authLabel}>Email</label>
          <div className="relative">
            <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input id="login-email" type="email" autoComplete="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={authInput} placeholder="you@example.com" />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className={`${authLabel} mb-0`}>Password</label>
            <a href="https://wa.me/918510988703?text=Hi!%20I%20forgot%20my%20Travel%20Teasing%20password." target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-[#1f77a3]">Forgot password?</a>
          </div>
          <div className="relative">
            <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input id="login-password" type={show ? 'text' : 'password'} autoComplete="current-password" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className={`${authInput} pr-12`} placeholder="Your password" />
            <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">{show ? <EyeOff size={17} /> : <Eye size={17} />}</button>
          </div>
        </div>
        {error && <p className="flex items-start gap-2 text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3"><AlertCircle size={16} className="mt-0.5 flex-shrink-0" /> {error}</p>}
        <button type="submit" disabled={loading} className={authButton} style={authButtonStyle}>
          {loading ? 'Signing in…' : <>Sign in <ArrowRight size={17} /></>}
        </button>
      </form>
    </AuthShell>
  );
}
