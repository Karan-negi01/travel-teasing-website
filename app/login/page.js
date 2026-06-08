'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mountain } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    if (err) { setError(err.message); setLoading(false); return; }
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Mountain size={28} className="text-[#E8651A]" />
            <span className="font-bold text-xl text-[#1a1a2e]">Travel Teasing</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="Your password" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-5">
          Don't have an account?{' '}
          <Link href="/signup" className="text-[#E8651A] font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
