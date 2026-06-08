'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Calendar, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import EnquiryModal from './EnquiryModal';

const catLabels = {
  group: 'Group', family: 'Family', sacred: 'Sacred',
  adventure: 'Adventure', corporate: 'Corporate',
};

const destImages = [
  ['ladakh|leh',                        'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80'],
  ['spiti',                             'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
  ['kashmir',                           'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'],
  ['manali|himachal|dharamshala|kullu', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80'],
  ['kedarnath|badrinath|char dham|chardham|rishikesh|haridwar|uttarakhand', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80'],
  ['rajasthan|jaipur|jodhpur|udaipur|jaisalmer', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80'],
  ['varanasi|banaras|kashi',            'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&q=80'],
  ['meghalaya|cherrapunji|shillong',    'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80'],
  ['goa',                               'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80'],
  ['kerala|munnar|alleppey|kochi',      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80'],
  ['sikkim|gangtok',                    'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800&q=80'],
  ['andaman',                           'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80'],
  ['coorg',                             'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&q=80'],
  ['bali',                              'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80'],
  ['thailand|bangkok|phuket',           'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80'],
  ['vietnam',                           'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80'],
  ['nepal',                             'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80'],
  ['sri lanka',                         'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80'],
  ['europe',                            'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80'],
  ['japan',                             'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80'],
  ['turkey|istanbul',                   'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80'],
  ['dubai|uae',                         'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80'],
  ['singapore',                         'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80'],
  ['malaysia',                          'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80'],
  ['maldives',                          'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80'],
];

function getDestImage(pkg) {
  // keyword mapping takes priority — DB cover_image only if no match (avoids broken DB URLs)
  const text = `${pkg.title || ''} ${pkg.location || ''} ${pkg.state || ''}`.toLowerCase();
  for (const [keys, url] of destImages) {
    if (keys.split('|').some(k => text.includes(k))) return url;
  }
  return pkg.cover_image || 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=80';
}

export default function PackageCard({ pkg }) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const label = catLabels[pkg.category] || 'Group';

  const savings = pkg.original_price && pkg.price_per_person && pkg.original_price > pkg.price_per_person
    ? pkg.original_price - pkg.price_per_person : null;

  let dateStr = null;
  if (pkg.start_date) {
    try {
      dateStr = new Date(pkg.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch (_) {}
  }

  return (
    <>
      {/*
        EXACT copy of deshvideshtravels.com card:
        Mobile  → flex-row h-[220px]: image LEFT (40%), content RIGHT
        Desktop → flex-col h-full:    image TOP (h-80 = 320px), content BELOW
      */}
      <div className="group relative overflow-hidden rounded-2xl font-sans text-sm transition-all duration-300
                      flex h-[220px] max-h-[220px] flex-row gap-x-2
                      md:h-full md:max-h-full md:max-w-[400px] md:flex-col">

        {/* ── IMAGE — rounded-2xl all corners, h-[220px] mobile / h-80 desktop ── */}
        <div className="group relative overflow-hidden rounded-2xl flex-shrink-0
                        h-[220px] w-full max-w-[40%] min-w-[40%]
                        md:h-80 md:w-full md:max-w-full">
          <Image
            src={getDestImage(pkg)}
            alt={pkg.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 40vw, 400px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />

          {/* Save badge — exact DV: orange pill top-left */}
          {savings && (
            <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1
                            bg-[#ff6b35] text-white text-[11px] font-semibold
                            px-2.5 py-1 rounded-full shadow-md">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
              </svg>
              Save ₹{savings.toLocaleString('en-IN')}
            </div>
          )}
        </div>

        {/* ── TEXT PANEL ── */}
        <div className="flex flex-col justify-between gap-1.5 py-1 md:gap-2 md:py-2">

          {/* Title — 16px / 500 */}
          <h2 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900">
            {pkg.title}
          </h2>

          {/* Meta row — cool colored pill for category + styled rating */}
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Category pill — colored by type */}
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              pkg.category === 'sacred'    ? 'bg-orange-100 text-orange-700' :
              pkg.category === 'adventure' ? 'bg-green-100 text-green-700'  :
              pkg.category === 'family'    ? 'bg-purple-100 text-purple-700':
              pkg.category === 'corporate' ? 'bg-gray-100 text-gray-700'    :
              'bg-blue-100 text-blue-700'
            }`}>
              <MapPin size={10} />
              {label}
            </span>
            {/* Rating pill */}
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5 text-[11px] font-semibold text-yellow-700">
              <Star size={10} className="fill-yellow-400 text-yellow-400" />
              4.9
              <span className="font-normal text-gray-400">(100)</span>
            </span>
            {/* Date chip */}
            {dateStr && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                <Calendar size={10} />
                {dateStr}
              </span>
            )}
          </div>

          {/* Price row */}
          <div className="flex flex-col items-start justify-between gap-1.5 md:flex-row md:items-center md:gap-0">

            {/* Left: price + days */}
            <div>
              <div className="flex items-baseline gap-1.5">
                {/* Price — 20px / 700 bold */}
                <span className="text-xl font-bold text-[#1a1a1a]">
                  ₹{pkg.price_per_person?.toLocaleString('en-IN')}
                </span>
                {savings && (
                  <span className="text-[12px] font-normal line-through text-gray-400">
                    ₹{pkg.original_price?.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              {pkg.duration_days && (
                <p className="hidden text-[11px] font-medium text-gray-500 md:block">
                  {pkg.duration_days}-day package
                </p>
              )}
            </div>

            {/* Right: phone + Details — bigger buttons (p-2.5, icon 15px) */}
            <div className="flex flex-row items-center gap-1.5">
              <button
                onClick={() => setEnquiryOpen(true)}
                className="cursor-pointer rounded-full border-2 border-gray-200 bg-white p-2.5
                           transition-all duration-300 hover:border-[#5bc1d5] hover:shadow-sm"
                aria-label="Enquire">
                <Phone size={15} className="text-[#1a1a1a]" />
              </button>
              <Link
                href={`/packages/${pkg.slug}`}
                className="flex flex-row items-center gap-1.5 rounded-full border-2 border-[#1a1a1a]
                           bg-[#1a1a1a] px-3 py-2.5 text-white transition-all duration-300 hover:bg-[#333]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M17 7H7M17 7v10"/>
                </svg>
                <span className="text-xs font-semibold">Details</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <EnquiryModal
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        packageId={pkg.id}
        packageTitle={pkg.title}
        enquiryType="package"
      />
    </>
  );
}
