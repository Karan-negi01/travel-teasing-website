'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import GroupTripCard from '@/components/GroupTripCard';
import SectionHeader from '@/components/SectionHeader';

function GroupTripsContent() {
  const searchParams = useSearchParams();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const pkgSlug = searchParams.get('package_slug');
    const url = pkgSlug ? `/api/group-trips?package_slug=${pkgSlug}` : '/api/group-trips';
    fetch(url).then(r => r.json()).then(d => { setTrips(d.trips || []); setLoading(false); }).catch(() => setLoading(false));
  }, [searchParams]);

  const filtered = trips.filter(t => !search || t.package_title?.toLowerCase().includes(search.toLowerCase()) || t.departure_city?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <section className="relative h-52 md:h-72 flex items-center">
        <Image src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200" alt="Group Trips" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 container-max">
          <p className="text-white/60 text-sm mb-2">Home / Group Trips</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white">Open Group Trips</h1>
          <p className="text-white/80 mt-2">Connect with like-minded travelers and split the cost</p>
        </div>
      </section>

      <div className="container-max py-12">
        <div className="max-w-md mb-8">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by destination or city..." className="w-full border border-gray-200 rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#E8651A]" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="bg-gray-100 rounded-xl h-72 animate-pulse" />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(t => <GroupTripCard key={t.id} trip={t} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">No group trips open yet</h3>
            <p className="text-gray-500 mb-6">Be the first to create one! Pick a package and start your group trip listing.</p>
            <Link href="/packages?category=group" className="btn-primary">Browse Group Packages</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GroupTripsPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-[#E8651A] border-t-transparent rounded-full" /></div>}>
      <GroupTripsContent />
    </Suspense>
  );
}
