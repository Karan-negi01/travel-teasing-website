'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mountain } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    const data = await res.json();
    if (data.success) router.push('/admin');
    else { setError('Incorrect password.'); setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Mountain size={36} className="text-[#E8651A] mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">Travel Teasing</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="Enter admin password" />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">{loading ? 'Verifying...' : 'Access Admin'}</button>
        </form>
      </div>
    </div>
  );
}
