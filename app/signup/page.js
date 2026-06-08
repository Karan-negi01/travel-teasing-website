'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mountain, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const tripStyles = ['Chill', 'Adventure', 'Cultural', 'Spiritual', 'Party'];

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', password: '', city: '', gender: '', trip_style: [], budget_preference: '', sleep_schedule: '', comfort_level: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  function set(k, v) { setForm(f => ({...f, [k]: v})); }
  function toggleStyle(s) { set('trip_style', form.trip_style.includes(s) ? form.trip_style.filter(x => x !== s) : [...form.trip_style, s]); }

  async function handleSubmit() {
    setLoading(true); setError('');
    const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!data.success) { setError(data.error); setLoading(false); return; }
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    if (signInError) { router.push('/login'); return; }
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Mountain size={28} className="text-[#E8651A]" />
            <span className="font-bold text-xl text-[#1a1a2e]">Travel Teasing</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Create Your Account</h1>
          <div className="flex justify-center gap-3 mt-4">
            {[1,2,3].map(s => (
              <div key={s} className={`w-8 h-1.5 rounded-full transition-all ${step >= s ? 'bg-[#E8651A]' : 'bg-gray-200'}`} />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">Step {step} of 3</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-bold text-[#1a1a2e] mb-4">Basic Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input required value={form.full_name} onChange={e => set('full_name', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input required value={form.phone} onChange={e => set('phone', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="10-digit mobile number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" required value={form.email} onChange={e => set('email', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input type="password" required value={form.password} onChange={e => set('password', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="Min 8 characters" />
              </div>
              <button onClick={() => { if (form.full_name && form.phone && form.email && form.password) { setError(''); setStep(2); } else setError('All fields required'); }} className="btn-primary w-full justify-center py-3 mt-2">Continue</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-bold text-[#1a1a2e] mb-4">A Bit More About You</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input value={form.city} onChange={e => set('city', e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="Your city" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <div className="flex gap-3">
                  {['Male', 'Female', 'Other'].map(g => (
                    <button key={g} type="button" onClick={() => set('gender', g)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${form.gender === g ? 'bg-[#E8651A] text-white border-[#E8651A]' : 'border-gray-300 text-gray-600 hover:border-[#E8651A]'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-full font-semibold hover:bg-gray-50 text-sm">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 btn-primary justify-center py-3 text-sm">Continue</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-bold text-[#1a1a2e] mb-1">Your Travel Personality</h2>
              <p className="text-gray-400 text-sm mb-4">Help us suggest better trips for you (optional)</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trip Style</label>
                <div className="flex flex-wrap gap-2">
                  {tripStyles.map(s => (
                    <button key={s} type="button" onClick={() => toggleStyle(s)}
                      className={`px-4 py-1.5 rounded-full text-sm border font-medium transition-all ${form.trip_style.includes(s) ? 'bg-[#E8651A] text-white border-[#E8651A]' : 'border-gray-300 text-gray-600 hover:border-[#E8651A]'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                <div className="flex gap-2">
                  {['Budget', 'Mid-range', 'Premium'].map(b => (
                    <button key={b} type="button" onClick={() => set('budget_preference', b)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${form.budget_preference === b ? 'bg-[#E8651A] text-white border-[#E8651A]' : 'border-gray-300 text-gray-600'}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Schedule</label>
                <div className="flex gap-2">
                  {['Early Bird', 'Night Owl'].map(s => (
                    <button key={s} type="button" onClick={() => set('sleep_schedule', s)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${form.sleep_schedule === s ? 'bg-[#E8651A] text-white border-[#E8651A]' : 'border-gray-300 text-gray-600'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comfort Level</label>
                <div className="flex gap-2">
                  {['Backpacker', 'Homestay', 'Hotels Only'].map(c => (
                    <button key={c} type="button" onClick={() => set('comfort_level', c)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${form.comfort_level === c ? 'bg-[#E8651A] text-white border-[#E8651A]' : 'border-gray-300 text-gray-600'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-full font-semibold hover:bg-gray-50 text-sm">Back</button>
                <button onClick={handleSubmit} disabled={loading} className="flex-1 btn-primary justify-center py-3 text-sm">{loading ? 'Creating...' : 'Create Account'}</button>
              </div>
              <button onClick={handleSubmit} disabled={loading} className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-2">Skip & Create Account</button>
            </div>
          )}

          {error && step !== 3 && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-[#E8651A] font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
