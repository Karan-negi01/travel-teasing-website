'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, Lock, Eye, EyeOff, MapPin, ArrowRight, ArrowLeft, AlertCircle, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AuthShell, { authInput, authLabel, authButton, authButtonStyle, authChip, preserveRedirect, safeRedirect } from '@/components/AuthShell';

const TRIP_STYLES = ['Chill', 'Adventure', 'Cultural', 'Spiritual', 'Party', 'Photography', 'Trekking', 'Luxury'];
const STEPS = ['Account', 'About you', 'Travel style'];

function Field({ id, label, icon: Icon, children }) {
  return (
    <div>
      <label htmlFor={id} className={authLabel}>{label}</label>
      <div className="relative"><Icon size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />{children}</div>
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
      title={step === 1 ? 'Create your account' : step === 2 ? 'A bit about you' : 'How do you travel?'}
      subtitle={step === 1 ? 'Book trips, build your gallery and find your travel crew.' : step === 2 ? 'Trip hosts see this when you ask to join. It also powers women-only and age rules.' : 'Optional, but it helps hosts and us suggest the right trips.'}
      footer={<p>Already have an account? <Link href={loginHref} className="font-semibold text-[#1f77a3] hover:underline">Log in</Link></p>}
    >
      {/* Steps */}
      <ol className="flex items-center gap-2 mb-7">
        {STEPS.map((label, idx) => {
          const n = idx + 1; const done = step > n; const active = step === n;
          return (
            <li key={label} className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center transition ${done ? 'bg-[#1f77a3] text-white' : active ? 'bg-[#1a1a2e] text-white' : 'bg-gray-100 text-gray-400'}`}>{done ? <Check size={12} /> : n}</span>
              <span className={`text-xs font-semibold ${active ? 'text-[#1a1a2e]' : 'text-gray-400'}`}>{label}</span>
              {idx < STEPS.length - 1 && <span className={`w-6 h-px ${done ? 'bg-[#1f77a3]' : 'bg-gray-200'}`} />}
            </li>
          );
        })}
      </ol>

      {step === 1 && (
        <form onSubmit={e => { e.preventDefault(); next(); }} className="space-y-4" noValidate>
          <Field id="su-name" label="Full name" icon={User}><input id="su-name" autoComplete="name" value={form.full_name} onChange={e => set('full_name', e.target.value)} className={authInput} placeholder="As on your ID" /></Field>
          <Field id="su-phone" label="Mobile number" icon={Phone}><input id="su-phone" type="tel" inputMode="numeric" autoComplete="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className={authInput} placeholder="10-digit number, for trip updates" /></Field>
          <Field id="su-email" label="Email" icon={Mail}><input id="su-email" type="email" autoComplete="email" value={form.email} onChange={e => set('email', e.target.value)} className={authInput} placeholder="you@example.com" /></Field>
          <Field id="su-password" label="Password" icon={Lock}>
            <input id="su-password" type={show ? 'text' : 'password'} autoComplete="new-password" value={form.password} onChange={e => set('password', e.target.value)} className={`${authInput} pr-12`} placeholder="At least 8 characters" />
            <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">{show ? <EyeOff size={17} /> : <Eye size={17} />}</button>
          </Field>
          {error && <p className="flex items-start gap-2 text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3"><AlertCircle size={16} className="mt-0.5 flex-shrink-0" /> {error}</p>}
          <button type="submit" className={authButton} style={authButtonStyle}>Continue <ArrowRight size={17} /></button>
          <p className="text-[11px] text-gray-400 text-center">By continuing you agree to travel responsibly and be nice to strangers.</p>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={e => { e.preventDefault(); next(); }} className="space-y-5" noValidate>
          <Field id="su-city" label="City" icon={MapPin}><input id="su-city" autoComplete="address-level2" value={form.city} onChange={e => set('city', e.target.value)} className={authInput} placeholder="Where do you usually start from?" /></Field>
          <div>
            <p className={authLabel}>Gender</p>
            <div className="grid grid-cols-3 gap-2">{['Male', 'Female', 'Other'].map(g => <button key={g} type="button" onClick={() => set('gender', g)} className={authChip(form.gender === g)}>{g}</button>)}</div>
            <p className="text-[11px] text-gray-400 mt-2">Needed for women-only or men-only trips. You can change it later in settings.</p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="inline-flex items-center justify-center gap-1.5 px-5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:border-gray-400"><ArrowLeft size={15} /> Back</button>
            <button type="submit" className={authButton} style={authButtonStyle}>Continue <ArrowRight size={17} /></button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <div>
            <p className={authLabel}>Trip style</p>
            <div className="flex flex-wrap gap-2">{TRIP_STYLES.map(s => <button key={s} type="button" onClick={() => toggleStyle(s)} className={`${authChip(form.trip_style.includes(s))} !px-3 !py-1.5 !rounded-full !text-xs`}>{s}</button>)}</div>
          </div>
          <div>
            <p className={authLabel}>Budget</p>
            <div className="grid grid-cols-3 gap-2">{['Budget', 'Mid-range', 'Premium'].map(b => <button key={b} type="button" onClick={() => set('budget_preference', b)} className={`${authChip(form.budget_preference === b)} !text-xs`}>{b}</button>)}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={authLabel}>Sleep</p>
              <div className="grid grid-cols-2 gap-2">{['Early Bird', 'Night Owl'].map(s => <button key={s} type="button" onClick={() => set('sleep_schedule', s)} className={`${authChip(form.sleep_schedule === s)} !text-xs !px-2`}>{s}</button>)}</div>
            </div>
            <div>
              <p className={authLabel}>Stay</p>
              <div className="grid grid-cols-1 gap-2">{['Backpacker', 'Homestay', 'Hotels only'].map(c => <button key={c} type="button" onClick={() => set('comfort_level', c)} className={`${authChip(form.comfort_level === c)} !text-xs !py-1.5`}>{c}</button>)}</div>
            </div>
          </div>
          {error && <p className="flex items-start gap-2 text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3"><AlertCircle size={16} className="mt-0.5 flex-shrink-0" /> {error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)} className="inline-flex items-center justify-center gap-1.5 px-5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:border-gray-400"><ArrowLeft size={15} /> Back</button>
            <button type="button" onClick={handleSubmit} disabled={loading} className={authButton} style={authButtonStyle}>{loading ? 'Creating your account…' : <>Create account <ArrowRight size={17} /></>}</button>
          </div>
          <button type="button" onClick={handleSubmit} disabled={loading} className="w-full text-center text-xs text-gray-400 hover:text-gray-700">Skip this step and create my account</button>
        </div>
      )}
    </AuthShell>
  );
}
