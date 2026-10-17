'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AuthShell, { authInput, authLabel, authLabelStyle, authButton, authButtonStyle, authGhost, authChip, authChipStyle, authLink, preserveRedirect, safeRedirect } from '@/components/AuthShell';

const TRIP_STYLES = ['Chill', 'Adventure', 'Cultural', 'Spiritual', 'Party', 'Photography', 'Trekking', 'Luxury'];
const STEPS = ['Account', 'About you', 'Travel style'];

function Field({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} className={authLabel} style={authLabelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', password: '', city: '', gender: '', trip_style: [], budget_preference: '', sleep_schedule: '', comfort_level: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginHref, setLoginHref] = useState('/login');
  const router = useRouter();

  useEffect(() => { setLoginHref(preserveRedirect('/login')); }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleStyle = (s) => set('trip_style', form.trip_style.includes(s) ? form.trip_style.filter(x => x !== s) : [...form.trip_style, s]);

  function next() {
    setError('');
    if (step === 1) {
      if (!form.full_name.trim() || !form.phone.trim() || !form.email.trim() || !form.password) return setError('Please fill in all four fields.');
      if (!/^\d{10}$/.test(form.phone.replace(/\D/g, '').slice(-10))) return setError('Enter a 10-digit mobile number.');
      if (form.password.length < 8) return setError('Password needs at least 8 characters.');
    }
    setStep(s => s + 1);
  }

  async function handleSubmit() {
    setLoading(true); setError('');
    const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, email: form.email.trim() }) });
    const data = await res.json();
    if (!data.success) { setError(data.error || 'Could not create your account.'); setLoading(false); return; }
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: form.email.trim(), password: form.password });
    if (signInError) { router.push(loginHref); return; }
    router.push(safeRedirect('/dashboard'));
  }

  return (
    <AuthShell
      eyebrow={`Step ${step} of 3 — ${STEPS[step - 1]}`}
      title={step === 1 ? 'Create account' : step === 2 ? 'About you' : 'Travel style'}
      footer={<p>Already have an account? <Link href={loginHref} className={authLink}>Sign in</Link></p>}
    >
      {/* thin progress line */}
      <div className="auth-track h-px w-full mb-10 relative"><div className="auth-track-fill absolute left-0 top-0 h-px transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} /></div>

      {step === 1 && (
        <form onSubmit={e => { e.preventDefault(); next(); }} className="space-y-6" noValidate>
          <Field id="su-name" label="Full name"><input id="su-name" autoComplete="name" value={form.full_name} onChange={e => set('full_name', e.target.value)} className={authInput} /></Field>
          <Field id="su-phone" label="Mobile number"><input id="su-phone" type="tel" inputMode="numeric" autoComplete="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className={authInput} /></Field>
          <Field id="su-email" label="Email"><input id="su-email" type="email" autoComplete="email" value={form.email} onChange={e => set('email', e.target.value)} className={authInput} /></Field>
          <Field id="su-password" label="Password">
            <div className="relative">
              <input id="su-password" type={show ? 'text' : 'password'} autoComplete="new-password" value={form.password} onChange={e => set('password', e.target.value)} className={`${authInput} pr-12`} />
              <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'} className="auth-sub absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:opacity-70">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
          </Field>
          {error && <p className="auth-error text-[13px]">{error}</p>}
          <button type="submit" className={authButton} style={authButtonStyle}>Continue</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={e => { e.preventDefault(); next(); }} className="space-y-6" noValidate>
          <Field id="su-city" label="City"><input id="su-city" autoComplete="address-level2" value={form.city} onChange={e => set('city', e.target.value)} className={authInput} /></Field>
          <div>
            <p className={authLabel} style={authLabelStyle}>Gender</p>
            <div className="grid grid-cols-3 gap-2">{['Male', 'Female', 'Other'].map(g => <button key={g} type="button" onClick={() => set('gender', g)} className={authChip(form.gender === g)} style={authChipStyle}>{g}</button>)}</div>
            <p className="auth-sub text-[12px] mt-3">Used for women-only or men-only trips. You can change it later.</p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className={authGhost} style={authButtonStyle}>Back</button>
            <button type="submit" className={authButton} style={authButtonStyle}>Continue</button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="space-y-7">
          <div>
            <p className={authLabel} style={authLabelStyle}>Trip style</p>
            <div className="flex flex-wrap gap-2">{TRIP_STYLES.map(s => <button key={s} type="button" onClick={() => toggleStyle(s)} className={`${authChip(form.trip_style.includes(s))} !h-[38px] !px-3.5 !text-[11px]`} style={authChipStyle}>{s}</button>)}</div>
          </div>
          <div>
            <p className={authLabel} style={authLabelStyle}>Budget</p>
            <div className="grid grid-cols-3 gap-2">{['Budget', 'Mid-range', 'Premium'].map(b => <button key={b} type="button" onClick={() => set('budget_preference', b)} className={`${authChip(form.budget_preference === b)} !text-[11px]`} style={authChipStyle}>{b}</button>)}</div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className={authLabel} style={authLabelStyle}>Sleep</p>
              <div className="grid grid-cols-1 gap-2">{['Early bird', 'Night owl'].map(s => <button key={s} type="button" onClick={() => set('sleep_schedule', s)} className={`${authChip(form.sleep_schedule === s)} !text-[11px]`} style={authChipStyle}>{s}</button>)}</div>
            </div>
            <div>
              <p className={authLabel} style={authLabelStyle}>Stay</p>
              <div className="grid grid-cols-1 gap-2">{['Backpacker', 'Homestay', 'Hotels only'].map(c => <button key={c} type="button" onClick={() => set('comfort_level', c)} className={`${authChip(form.comfort_level === c)} !text-[11px]`} style={authChipStyle}>{c}</button>)}</div>
            </div>
          </div>
          {error && <p className="auth-error text-[13px]">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)} className={authGhost} style={authButtonStyle}>Back</button>
            <button type="button" onClick={handleSubmit} disabled={loading} className={authButton} style={authButtonStyle}>{loading ? 'Creating' : 'Create account'}</button>
          </div>
          <button type="button" onClick={handleSubmit} disabled={loading} className="auth-sub w-full text-center text-[11px] uppercase hover:opacity-70" style={{ letterSpacing: '0.18em' }}>Skip and create account</button>
        </div>
      )}
    </AuthShell>
  );
}
