'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Phone } from 'lucide-react';

const catLabels = {
  group:     'Group',
  family:    'FIT',
  sacred:    'FIT',
  adventure: 'Group',
  corporate: 'Corporate',
  weekend:   'FIT',
  fit:       'FIT',
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

export default function PackageCard({ pkg, fromCategory, dark }) {
  const label = catLabels[pkg.category] || 'Group';

  const savings = pkg.original_price && pkg.price_per_person && pkg.original_price > pkg.price_per_person
    ? pkg.original_price - pkg.price_per_person : null;

  let dateStr = null;
  if (pkg.start_date) {
    try {
      dateStr = new Date(pkg.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch (_) {}
  }

  const href = `/packages/${pkg.slug}${fromCategory ? `?from=${fromCategory}` : ''}`;

  if (dark) {
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{
          background: '#181818', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px',
          overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.25s ease, border-color 0.25s ease',
          fontFamily: "'Poppins', sans-serif",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>

          {/* Image */}
          <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
            <Image src={getDestImage(pkg)} alt={pkg.title} fill
              style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
              sizes="400px" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
            {pkg.duration_days && (
              <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.15)' }}>
                {pkg.duration_days}N/{pkg.duration_days + 1}D
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ padding: '18px 20px 20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 10px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {pkg.title}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
                <MapPin size={11} color="rgba(255,255,255,0.35)" />
                {pkg.location || pkg.state || label}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
                <Calendar size={11} color="rgba(255,255,255,0.35)" />
                {dateStr || 'Request dates'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                  ₹{pkg.price_per_person?.toLocaleString('en-IN')}
                </div>
                {savings && (
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through', marginTop: '2px' }}>
                    ₹{pkg.original_price?.toLocaleString('en-IN')}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <a href={'https://wa.me/916396464369?text=' + encodeURIComponent('Hi! I\'m interested in ' + pkg.title + '. Please share more details.')}
                  target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.553 4.112 1.523 5.84L.057 23.143a.75.75 0 0 0 .921.919l5.376-1.457A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.718 9.718 0 0 1-4.964-1.36l-.355-.212-3.686.999 1.016-3.586-.232-.369A9.718 9.718 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                  </svg>
                </a>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fff', color: '#0d0d0d', fontSize: '13px', fontWeight: 700, padding: '8px 16px', borderRadius: '999px' }}>
                  Details
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0d0d0d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <>
      <div className="group relative overflow-hidden rounded-2xl font-sans text-sm transition-all duration-300
                      flex h-[220px] max-h-[220px] flex-row gap-x-2
                      md:h-full md:max-h-full md:max-w-[400px] md:flex-col">

        {/* ── IMAGE ── */}
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
        </div>

        {/* ── TEXT PANEL ── */}
        <div className="flex flex-col justify-between gap-3 py-2 md:gap-3 md:py-3">
          <h2 className="line-clamp-2 text-base font-medium leading-6 text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {pkg.title}
          </h2>

          <div className="flex items-center justify-between -ml-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <span className="inline-flex items-center gap-1 text-[15px] font-normal text-gray-600">
              <MapPin size={14} className="text-[#1a1a1a]" />
              {label}
            </span>
            {label === 'FIT' ? (
              <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[#1a1a1a]">
                <Calendar size={14} className="text-[#1a1a1a]" />
                Request
              </span>
            ) : dateStr ? (
              <span className="inline-flex items-center gap-1 text-[13px] font-normal text-gray-500">
                <Calendar size={14} className="text-[#1a1a1a]" />
                {dateStr}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col items-start justify-between gap-1.5 md:flex-row md:items-center md:gap-0">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-[#1a1a1a]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  ₹{pkg.price_per_person?.toLocaleString('en-IN')}
                </span>
                {savings && (
                  <span className="text-[12px] font-normal line-through text-gray-400">
                    ₹{pkg.original_price?.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              {pkg.duration_days && (
                <p className="hidden text-[12px] font-normal text-gray-400 md:block" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {pkg.duration_days}-day package
                </p>
              )}
            </div>

            <div className="flex flex-row items-center gap-1.5">
              <a
                href={'https://wa.me/916396464369?text=' + encodeURIComponent('Hi! I\'m interested in ' + pkg.title + '. Please share more details.')}
                target="_blank" rel="noopener noreferrer"
                className="cursor-pointer rounded-full border-[2px] border-gray-300 p-2 flex items-center justify-center transition-all duration-500 hover:border-gray-500"
                aria-label="WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#1a1a1a">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.553 4.112 1.523 5.84L.057 23.143a.75.75 0 0 0 .921.919l5.376-1.457A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.718 9.718 0 0 1-4.964-1.36l-.355-.212-3.686.999 1.016-3.586-.232-.369A9.718 9.718 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                </svg>
              </a>
              <Link
                href={href}
                className="flex flex-row items-center gap-1 rounded-full border-2 border-[#1a1a1a]
                           bg-[#1a1a1a] p-2 text-white transition-all duration-500 hover:bg-[#333]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M17 7H7M17 7v10"/>
                </svg>
                <span className="text-[14px] font-normal" style={{ fontFamily: "'Poppins', sans-serif" }}>Details</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
