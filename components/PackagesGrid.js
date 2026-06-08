'use client';
import { useState, useEffect } from 'react';
import PackageCard from './PackageCard';

export default function PackagesGrid({ category, featured, limit }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (featured) params.set('featured', 'true');
    fetch(`/api/packages?${params}`)
      .then(r => r.json())
      .then(d => { setPackages(d.packages || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [category, featured]);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1,2,3].map(i => <div key={i} className="bg-gray-100 rounded-xl h-80 animate-pulse" />)}
    </div>
  );

  const displayed = limit ? packages.slice(0, limit) : packages;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayed.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
    </div>
  );
}
