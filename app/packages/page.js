'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Search, MessageCircle } from 'lucide-react';
import PackageCard from '@/components/PackageCard';
import SectionHeader from '@/components/SectionHeader';

const categories = [
  { id: '', label: 'All' },
  { id: 'group', label: 'Group Trips' },
  { id: 'family', label: 'Family' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'corporate', label: 'Corporate' },
];

function PackagesContent() {
  const searchParams = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('featured');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    fetch(`/api/packages?${params}`)
      .then(r => r.json())
      .then(d => {
        let pkgs = d.packages || [];
        if (sort === 'price-asc') pkgs = [...pkgs].sort((a, b) => a.price_per_person - b.price_per_person);
        if (sort === 'price-desc') pkgs = [...pkgs].sort((a, b) => b.price_per_person - a.price_per_person);
        if (sort === 'duration') pkgs = [...pkgs].sort((a, b) => a.duration_days - b.duration_days);
        setPackages(pkgs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category, search, sort]);

  function handleSearch(e) {
    e.preventDefault();
    setSearch(searchInput);
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative h-52 md:h-72 flex items-center">
        <Image src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200" alt="Packages" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 container-max">
          <p className="text-white/60 text-sm mb-2">Home / Packages</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white">Our Packages</h1>
        </div>
      </section>

      <div className="container-max py-12">
        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex flex-1 shadow-sm rounded-full overflow-hidden border border-gray-200">
            <input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search destinations..." className="flex-1 px-5 py-3 text-sm outline-none" />
            <button type="submit" className="bg-[#5bc1d5] text-white px-5 py-3 hover:bg-[#4ab0c4] transition-colors">
              <Search size={18} />
            </button>
          </form>
          <select value={sort} onChange={e => setSort(e.target.value)} className="border border-gray-200 rounded-full px-4 py-3 text-sm outline-none text-gray-600 bg-white">
            <option value="featured">Sort: Popularity</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="duration">Duration</option>
          </select>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat.id)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${category === cat.id ? 'bg-[#5bc1d5] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Resus */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="bg-gray-100 rounded-xl h-80 animate-pulse" />)}
          </div>
        ) : packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">No packages found</h3>
            <p className="text-gray-500 mb-6">Contact us for a custom package tailored to your needs.</p>
            <a href="https://wa.me/916396464369?text=Hi! I need a custom travel package." target="_blank" rel="noopener noreferrer" className="btn-primary">
              <MessageCircle size={18} /> WhatsApp for Custom Package
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PackagesPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-[#E8651A] border-t-transparent rounded-full" /></div>}>
      <PackagesContent />
    </Suspense>
  );
}
