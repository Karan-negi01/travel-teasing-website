'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import PackageCard from '@/components/PackageCard';

const SUBTYPES = [
  { label: 'All', value: '' },
  { label: "Women's Only", value: "Women's Only Group" },
  { label: 'Travel with Pets', value: 'Travel with Pets Group' },
  { label: 'Normal Group', value: 'Normal Group' },
  { label: 'Sacred Places', value: 'Sacred Places Group' },
  { label: 'Exclusive Trips', value: 'Exclusive Trips' },
];

function GroupTripsContent() {
  const searchParams = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeSubtype, setActiveSubtype] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('category', 'group');
    if (activeSubtype) params.set('subtype', activeSubtype);
    fetch(`/api/packages?${params}`)
      .then(r => r.json())
      .then(d => { setPackages(d.packages || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeSubtype]);

  const filtered = packages.filter(p =>
    !search ||
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.location?.toLowerCase().includes(search.toLowerCase()) ||
    p.state?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <section className="relative h-52 md:h-72 flex items-center">
        <Image src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200" alt="Group Trips" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 container-max">
          <p className="text-white/60 text-sm mb-2">Home / Group Trips</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white">Community Group Trips</h1>
          <p className="text-white/80 mt-2">Curated group trips for every kind of traveler</p>
        </div>
      </section>

      <div className="container-max py-12">
        {/* Search + Subtype filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by destination or location..."
            className="w-full sm:max-w-md border border-gray-200 rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#5bc1d5]"
          />
        </div>

        {/* Subtype pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {SUBTYPES.map(st => (
            <button
              key={st.value}
              onClick={() => setActiveSubtype(st.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                activeSubtype === st.value
                  ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="bg-gray-100 rounded-xl h-72 animate-pulse" />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">No group trips available yet</h3>
            <p className="text-gray-500 mb-6">Check back soon — new trips are added regularly.</p>
            <Link href="/packages" className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#333] transition-all">
              Browse All Packages
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GroupTripsPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-[#5bc1d5] border-t-transparent rounded-full" /></div>}>
      <GroupTripsContent />
    </Suspense>
  );
}
