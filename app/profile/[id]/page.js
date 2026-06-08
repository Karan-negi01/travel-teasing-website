'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, CheckCircle } from 'lucide-react';
import InstagramIcon from '@/components/InstagramIcon';
import { supabase } from '@/lib/supabase';

export default function PublicProfilePage({ params }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetch(`/api/profile/${params.id}`).then(r => r.json()).then(d => { setData(d); setLoading(false); });
    supabase.auth.getUser().then(({ data }) => setCurrentUserId(data?.user?.id));
  }, [params.id]);

  if (loading) return <div className="h-screen flex items-center justify-center pt-20"><div className="animate-spin w-10 h-10 border-4 border-[#E8651A] border-t-transparent rounded-full" /></div>;
  if (!data?.profile) return <div className="h-screen flex items-center justify-center pt-20 text-gray-500">Profile not found.</div>;

  const { profile, trips, badges } = data;
  const states = [...new Set(trips.map(t => t.state).filter(Boolean))];
  const memberSince = new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <div className="container-max py-10 max-w-4xl">
        {/* Profile header */}
        <div className="card p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-orange-200 to-orange-400 flex items-center justify-center flex-shrink-0">
              {profile.profile_photo ? (
                <Image src={profile.profile_photo} alt={profile.full_name} width={96} height={96} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-white">{(profile.full_name || 'T').charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <h1 className="text-2xl font-bold text-[#1a1a2e]">{profile.full_name}</h1>
                {profile.is_verified && <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle size={12} /> Verified</span>}
              </div>
              <p className="text-gray-500 text-sm flex items-center gap-1 justify-center sm:justify-start mb-2"><MapPin size={14} /> {profile.city || 'India'}</p>
              {profile.bio && <p className="text-gray-600 text-sm mb-3">{profile.bio}</p>}
              {profile.trip_style?.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-3">
                  {profile.trip_style.map(s => <span key={s} className="bg-orange-50 text-[#E8651A] text-xs px-3 py-1 rounded-full font-medium">{s}</span>)}
                </div>
              )}
              <div className="flex gap-6 justify-center sm:justify-start text-sm">
                <div className="text-center"><p className="font-bold text-[#1a1a2e]">{trips.length}</p><p className="text-gray-400 text-xs">Trips</p></div>
                <div className="text-center"><p className="font-bold text-[#1a1a2e]">{states.length}</p><p className="text-gray-400 text-xs">States</p></div>
                <div className="text-center"><p className="font-bold text-[#1a1a2e]">{badges.length}</p><p className="text-gray-400 text-xs">Badges</p></div>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-center">
              {profile.instagram_handle && (
                <a href={`https://instagram.com/${profile.instagram_handle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-500 flex items-center gap-1 text-sm"><InstagramIcon size={16} /> {profile.instagram_handle}</a>
              )}
              {currentUserId === params.id && (
                <Link href="/dashboard?tab=settings" className="btn-outline text-sm py-2">Edit Profile</Link>
              )}
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-4 text-center sm:text-left">Member since {memberSince}</p>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="font-bold text-[#1a1a2e] mb-4">Badges</h2>
            <div className="flex flex-wrap gap-3">
              {badges.map(b => (
                <div key={b.id} className="flex items-center gap-2 bg-orange-50 rounded-xl px-3 py-2">
                  <span className="text-2xl">{b.badges?.icon}</span>
                  <div>
                    <p className="font-semibold text-xs text-[#1a1a2e]">{b.badges?.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Travel portfolio */}
        <div className="card p-6">
          <h2 className="font-bold text-[#1a1a2e] mb-4">Travel Portfolio</h2>
          {trips.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No trips added yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {trips.map(t => (
                <div key={t.id} className="rounded-xl overflow-hidden border border-gray-100">
                  {t.cover_photo ? (
                    <div className="relative aspect-video"><Image src={t.cover_photo} alt={t.destination} fill className="object-cover" sizes="300px" /></div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center text-3xl">🏔️</div>
                  )}
                  <div className="p-3">
                    <p className="font-semibold text-sm text-[#1a1a2e]">{t.destination}</p>
                    <p className="text-gray-400 text-xs">{t.state}</p>
                    {t.caption && <p className="text-gray-500 text-xs mt-1 line-clamp-1">{t.caption}</p>}
                    {t.booked_through_platform && <span className="text-green-600 text-xs flex items-center gap-1 mt-1"><CheckCircle size={11} /> Via Travel Teasing</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
