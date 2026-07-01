'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { MapPin, Clock, Users, MessageCircle, Download, Navigation, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import EnquiryModal from '@/components/EnquiryModal';

const TABS = [
  { id: 'overview', label: 'Itinerary' },
  { id: 'inclusions', label: 'Inclusions' },
  { id: 'costing', label: 'Pricing' },
  { id: 'about', label: 'About' },
];

export default function PackageDetailPage({ params }) {
  const { slug } = params;
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDay, setOpenDay] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const sectionRefs = useRef({});

  useEffect(() => {
    fetch(`/api/packages/${slug}`).then(r => r.json()).then(d => {
      setPkg(d.package);
      if (d.package?.tour_options?.length > 0) setSelectedOption(d.package.tour_options[0]);
      if (d.package?.multi_dates?.length > 0) setSelectedDate(d.package.multi_dates[0]);
      else if (d.package?.start_date) setSelectedDate({ start_date: d.package.start_date, end_date: d.package.end_date });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  // Auto-play infinity loop — must be before any early returns
  useEffect(() => {
    if (!pkg) return;
    const allImgs = [pkg.cover_image, ...(pkg.gallery_images || [])].filter(Boolean);
    const count = Math.min((pkg.highlights?.length || 0) + 1, allImgs.length + 1, 6);
    if (count < 2) return;
    const timer = setInterval(() => setActiveSlide(s => (s + 1) % count), 4500);
    return () => clearInterval(timer);
  }, [pkg]);

  const scrollToSection = (id) => {
    setActiveTab(id);
    setTimeout(() => sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#E8651A] border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!pkg) return <div className="h-screen flex items-center justify-center text-gray-400 text-sm">Package not found.</div>;

  const allImages = [pkg.cover_image, ...(pkg.gallery_images || [])].filter(Boolean);
  const displayPrice = selectedOption ? parseInt(selectedOption.price) : pkg.price_per_person;
  const originalPrice = pkg.original_price || pkg.total_price;
  const savings = originalPrice && originalPrice > displayPrice ? originalPrice - displayPrice : null;
  const dateOptions = pkg.multi_dates?.length > 0 ? pkg.multi_dates : pkg.start_date ? [{ start_date: pkg.start_date, end_date: pkg.end_date }] : [];

  const formatDate = (d) => {
    if (!d?.start_date) return 'Coming Soon';
    const fmt = (str) => new Date(str).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    return d.end_date ? `${fmt(d.start_date)} – ${fmt(d.end_date)}` : fmt(d.start_date);
  };

  const waText = `Hi! I'm interested in ${pkg.title}${selectedOption ? ` (${selectedOption.label})` : ''}${selectedDate ? ` — ${formatDate(selectedDate)}` : ''}.`;
  const titleWords = pkg.title.split(' ');

  // Build slides: slide 0 = package overview, slides 1-5 = highlights
  const parseHighlight = (h) => {
    const sepIdx = h.indexOf(' — ');
    const colonIdx = h.indexOf(': ');
    if (sepIdx > 0) return { title: h.slice(0, sepIdx), desc: h.slice(sepIdx + 3) };
    if (colonIdx > 0) return { title: h.slice(0, colonIdx), desc: h.slice(colonIdx + 2) };
    // no separator — use first 4 words as title
    const ws = h.split(' ');
    return { title: ws.slice(0, 4).join(' '), desc: h };
  };

  const slides = [
    { title: pkg.title, titleWords, desc: pkg.description?.substring(0, 160) + '…', image: allImages[0], isMain: true },
    ...(pkg.highlights || []).slice(0, 5).map((h, i) => {
      const { title, desc } = parseHighlight(h);
      return { title, desc, image: allImages[(i + 1) % allImages.length], isMain: false };
    }),
  ];

  const goTo = (idx) => setActiveSlide(s => ((idx % slides.length) + slides.length) % slides.length);
  const active = slides[activeSlide] || slides[0];
  const imgUrl = (src, w = 1600) => src ? `${src}${src.includes('?') ? '&' : '?'}w=${w}&q=85&auto=format&fit=crop` : '';

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "'Poppins', sans-serif", color: '#1a1a1a' }}>

      {/* ── CINEMATIC SLIDER HERO ── */}
      <div style={{ position: 'relative', width: '100%', height: '100vh', minHeight: '620px', maxHeight: '860px', overflow: 'hidden', background: '#0a0a0a' }}>

        {/* Background images — crossfade */}
        {slides.map((slide, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0, zIndex: 0,
            transition: 'opacity 1.2s cubic-bezier(0.4,0,0.2,1), transform 1.6s cubic-bezier(0.4,0,0.2,1)',
            opacity: i === activeSlide ? 1 : 0,
            transform: i === activeSlide ? 'scale(1)' : 'scale(1.06)',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgUrl(slide.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}

        {/* Overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.15) 100%)', zIndex: 1 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 45%)', zIndex: 1 }} />

        {/* LEFT — Active slide content */}
        <div style={{ position: 'absolute', top: '50%', left: '48px', transform: 'translateY(-50%)', zIndex: 2, maxWidth: '520px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '14px' }}>
            {pkg.location}{pkg.state && pkg.state !== pkg.location ? ` · ${pkg.state}` : ''}{pkg.category ? ` · ${pkg.category}` : ''}
          </p>

          {/* Title — changes per slide, fades on change */}
          <h1 key={`title-${activeSlide}`} style={{
            fontSize: 'clamp(32px, 4.8vw, 68px)', fontWeight: 800, color: '#fff',
            lineHeight: 1.08, marginBottom: '18px', letterSpacing: '-0.5px',
            animation: 'fadeSlideUp 0.55s cubic-bezier(0.4,0,0.2,1) both',
          }}>
            {active.isMain ? (
              <>
                <em style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 400 }}>{titleWords[0]} </em>
                {titleWords.slice(1).join(' ')}
              </>
            ) : active.title}
          </h1>

          {/* Description — changes per slide */}
          <p key={`desc-${activeSlide}`} style={{
            fontSize: '14px', color: 'rgba(255,255,255,0.62)', lineHeight: 1.75,
            marginBottom: '32px', maxWidth: '420px',
            animation: 'fadeSlideUp 0.65s 0.1s cubic-bezier(0.4,0,0.2,1) both',
          }}>
            {active.desc}
          </p>

          {/* Meta + CTA */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
            {pkg.duration_nights && <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>{pkg.duration_nights}N / {pkg.duration_days}D</span>}
            {pkg.departure_city && <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>·</span>}
            {pkg.departure_city && <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>From {pkg.departure_city}</span>}
            {displayPrice && <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>·</span>}
            {displayPrice && <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>₹{displayPrice.toLocaleString('en-IN')}</span>}
          </div>

          <button onClick={() => setEnquiryOpen(true)} style={{
            background: 'transparent', border: '1.5px solid rgba(255,255,255,0.65)', color: '#fff',
            padding: '12px 30px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
            fontFamily: "'Poppins', sans-serif", transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#1a1a1a'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
          >
            Book This Trip
          </button>
        </div>

        {/* BOTTOM-RIGHT — Key Highlights cards */}
        <div style={{ position: 'absolute', bottom: '40px', right: '48px', zIndex: 2 }}>
          <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '14px', textAlign: 'right' }}>
            Key Highlights
          </p>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            {slides.map((slide, i) => {
              const isActive = i === activeSlide;
              return (
                <div key={i} onClick={() => goTo(i)} style={{
                  width: isActive ? '160px' : '108px',
                  height: isActive ? '200px' : '140px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.6s cubic-bezier(0.34,1.2,0.64,1)',
                  opacity: isActive ? 1 : 0.55,
                  border: isActive ? '2px solid rgba(255,255,255,0.75)' : '1px solid rgba(255,255,255,0.15)',
                  boxShadow: isActive ? '0 20px 40px rgba(0,0,0,0.55)' : '0 4px 16px rgba(0,0,0,0.3)',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgUrl(slide.image, 400)} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 10px' }}>
                    <p style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '3px' }}>
                      {pkg.location}
                    </p>
                    <p style={{ fontSize: isActive ? '11px' : '10px', fontWeight: 700, color: '#fff', lineHeight: 1.25, transition: 'font-size 0.3s' }}>
                      {slide.title.length > 28 ? slide.title.substring(0, 28) + '…' : slide.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Slide counter — bottom left */}
        <div style={{ position: 'absolute', bottom: '44px', left: '48px', zIndex: 2, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
            {String(activeSlide + 1).padStart(2, '0')}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ width: '24px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
              {String(slides.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* CSS animation keyframes */}
        <style>{`
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>


      {/* ── STICKY TABS ── */}
      <div className="sticky z-20 bg-white" style={{ top: '72px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 48px', display: 'flex', gap: '0' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => scrollToSection(t.id)} style={{
              padding: '16px 20px', fontSize: '14px', fontWeight: activeTab === t.id ? 600 : 400,
              color: activeTab === t.id ? '#E8651A' : '#6b7280',
              background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              borderBottom: `2px solid ${activeTab === t.id ? '#E8651A' : 'transparent'}`,
              marginBottom: '-1px', transition: 'color 0.15s', fontFamily: "'Poppins', sans-serif",
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT + SIDEBAR ── */}
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '48px 48px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '64px', alignItems: 'start' }}>

          {/* LEFT */}
          <div>

            {/* ITINERARY */}
            <section ref={el => sectionRefs.current['overview'] = el} className="scroll-mt-32">
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '28px', paddingBottom: '14px', borderBottom: '1px solid #e5e7eb' }}>
                Tour Itinerary
              </h2>

              <div style={{ position: 'relative' }}>
                {/* vertical line */}
                <div style={{ position: 'absolute', left: '15px', top: '8px', bottom: '8px', width: '1px', background: '#e5e7eb' }} />

                {pkg.itinerary?.map((day, i) => (
                  <div key={i} style={{ display: 'flex', gap: '24px', marginBottom: '8px' }}>
                    {/* circle */}
                    <div style={{ flexShrink: 0, width: '32px', height: '32px', borderRadius: '50%', background: openDay === i ? '#E8651A' : '#fff', border: `1.5px solid ${openDay === i ? '#E8651A' : '#d1d5db'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: openDay === i ? '#fff' : '#9ca3af', zIndex: 1, position: 'relative', marginTop: '10px', transition: 'all 0.15s', flexDirection: 'column' }}>
                      {day.day || i + 1}
                    </div>

                    {/* card */}
                    <div style={{ flex: 1, border: '1px solid', borderColor: openDay === i ? '#e5e7eb' : '#f3f4f6', borderRadius: '12px', overflow: 'hidden', background: '#fff', marginBottom: '0' }}>
                      <button onClick={() => setOpenDay(openDay === i ? null : i)} style={{
                        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer',
                        textAlign: 'left', fontFamily: "'Poppins', sans-serif', gap: '12px'",
                      }}>
                        <div>
                          <span style={{ fontSize: '10px', fontWeight: 600, color: '#E8651A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Day {day.day || i + 1}</span>
                          <p style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a', marginTop: '1px' }}>{day.title}</p>
                        </div>
                        {openDay === i ? <ChevronUp size={16} color="#9ca3af" strokeWidth={2} /> : <ChevronDown size={16} color="#9ca3af" strokeWidth={2} />}
                      </button>

                      {openDay === i && day.description && (
                        <div style={{ padding: '0 18px 16px', borderTop: '1px solid #f3f4f6' }}>
                          {day.images?.filter(Boolean).length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px', margin: '14px 0', borderRadius: '8px', overflow: 'hidden' }}>
                              {day.images.filter(Boolean).slice(0, 3).map((img, ii) => (
                                <div key={ii} style={{ position: 'relative', aspectRatio: '4/3' }}>
                                  <Image src={img} alt="" fill className="object-cover" sizes="150px" />
                                </div>
                              ))}
                            </div>
                          )}
                          <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none' }}>
                            {day.description.split('.').filter(s => s.trim().length > 8).map((s, si) => (
                              <li key={si} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
                                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#d1d5db', flexShrink: 0, marginTop: '8px' }} />
                                <span style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.65 }}>{s.trim()}.</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* INCLUSIONS */}
            <section ref={el => sectionRefs.current['inclusions'] = el} className="scroll-mt-32" style={{ marginTop: '56px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '28px', paddingBottom: '14px', borderBottom: '1px solid #e5e7eb' }}>
                Inclusions & Exclusions
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {pkg.inclusions?.length > 0 && (
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: '16px' }}>Included</p>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      {pkg.inclusions.map((inc, i) => (
                        <li key={i} style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' }}>
                          <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px', fontSize: '9px', color: '#fff', fontWeight: 700 }}>✓</span>
                          <span style={{ fontSize: '14px', color: '#374151', lineHeight: 1.5 }}>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {pkg.exclusions?.length > 0 && (
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: '16px' }}>Not Included</p>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      {pkg.exclusions.map((exc, i) => (
                        <li key={i} style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' }}>
                          <span style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1.5px solid #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px', fontSize: '9px', color: '#9ca3af', fontWeight: 700 }}>✕</span>
                          <span style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.5 }}>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {pkg.things_to_carry?.length > 0 && (
                <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid #f3f4f6' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: '14px' }}>Things to Carry</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {pkg.things_to_carry.map((item, i) => (
                      <span key={i} style={{ padding: '5px 12px', borderRadius: '999px', border: '1px solid #e5e7eb', fontSize: '13px', color: '#4b5563' }}>{item}</span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* COSTING */}
            <section ref={el => sectionRefs.current['costing'] = el} className="scroll-mt-32" style={{ marginTop: '56px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '28px', paddingBottom: '14px', borderBottom: '1px solid #e5e7eb' }}>
                Pricing
              </h2>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                {(pkg.tour_options?.length > 0 ? pkg.tour_options : [{ label: 'Standard', price: String(displayPrice) }]).map((opt, i) => {
                  const disc = parseInt(opt.price);
                  const orig = (i === 0 && originalPrice > disc) ? originalPrice : null;
                  const pct = orig ? Math.round(((orig - disc) / orig) * 100) : null;
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderRadius: '12px', border: `1px solid ${i === 0 ? '#1a1a1a' : '#e5e7eb'}`, background: i === 0 ? '#fafafa' : '#fff' }}>
                      <span style={{ fontSize: '15px', fontWeight: 500, color: '#1a1a1a' }}>{opt.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {orig && <span style={{ fontSize: '14px', color: '#9ca3af', textDecoration: 'line-through' }}>₹{orig.toLocaleString('en-IN')}</span>}
                        <span style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a' }}>₹{disc.toLocaleString('en-IN')}</span>
                        {pct && <span style={{ fontSize: '11px', fontWeight: 600, background: '#f0fdf4', color: '#16a34a', padding: '3px 8px', borderRadius: '4px' }}>−{pct}%</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '24px' }}>* All prices are per person. GST 5% + TCS 2% applicable.</p>

              {/* Batches */}
              {dateOptions.length > 0 && (
                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '24px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: '14px' }}>Available Dates</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {dateOptions.map((d, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid #f3f4f6', borderRadius: '8px' }}>
                        <span style={{ fontSize: '14px', color: '#374151' }}>{formatDate(d)}</span>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>{pkg.duration_days} days</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* ABOUT */}
            <section ref={el => sectionRefs.current['about'] = el} className="scroll-mt-32" style={{ marginTop: '56px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '28px', paddingBottom: '14px', borderBottom: '1px solid #e5e7eb' }}>
                About the Trip
              </h2>
              <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.85, marginBottom: '24px' }}>{pkg.description}</p>
              {pkg.best_time_to_visit && (
                <div style={{ paddingTop: '20px', borderTop: '1px solid #f3f4f6' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: '8px' }}>Best Time to Visit</p>
                  <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.7 }}>{pkg.best_time_to_visit}</p>
                </div>
              )}
              {pkg.highlights?.length > 0 && (
                <div style={{ paddingTop: '20px', marginTop: '20px', borderTop: '1px solid #f3f4f6' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: '14px' }}>Highlights</p>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    {pkg.highlights.map((h, i) => (
                      <li key={i} style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'flex-start' }}>
                        <span style={{ color: '#E8651A', fontWeight: 700, fontSize: '14px', marginTop: '1px', flexShrink: 0 }}>—</span>
                        <span style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6 }}>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

          </div>

          {/* SIDEBAR */}
          <div className="hidden lg:block">
            <div style={{ position: 'sticky', top: '128px', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden' }}>
              {/* Price */}
              <div style={{ padding: '24px', borderBottom: '1px solid #f3f4f6' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: '8px' }}>Starting from</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '34px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.5px' }}>
                    {displayPrice ? `₹${displayPrice.toLocaleString('en-IN')}` : 'On Request'}
                  </span>
                  {savings && <span style={{ fontSize: '14px', color: '#9ca3af', textDecoration: 'line-through' }}>₹{originalPrice?.toLocaleString('en-IN')}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>per person, taxes extra</span>
                  {savings && <span style={{ fontSize: '11px', fontWeight: 600, color: '#16a34a', background: '#f0fdf4', padding: '2px 7px', borderRadius: '4px' }}>Save ₹{savings.toLocaleString('en-IN')}</span>}
                </div>
              </div>

              <div style={{ padding: '20px 24px' }}>
                {/* Date */}
                {dateOptions.length > 0 && (
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: '6px' }}>Date</label>
                    <select value={JSON.stringify(selectedDate)} onChange={e => setSelectedDate(JSON.parse(e.target.value))}
                      style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', color: '#1a1a1a', background: '#fff', fontFamily: "'Poppins', sans-serif", outline: 'none', cursor: 'pointer' }}>
                      {dateOptions.map((d, i) => <option key={i} value={JSON.stringify(d)}>{formatDate(d)}</option>)}
                    </select>
                  </div>
                )}

                {/* Options */}
                {pkg.tour_options?.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: '8px' }}>Option</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {pkg.tour_options.map((opt, i) => (
                        <button key={i} onClick={() => setSelectedOption(opt)} style={{
                          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '11px 14px', borderRadius: '8px', cursor: 'pointer',
                          border: `1.5px solid ${selectedOption?.label === opt.label ? '#1a1a1a' : '#e5e7eb'}`,
                          background: selectedOption?.label === opt.label ? '#1a1a1a' : '#fff',
                          fontSize: '13px', fontWeight: 500,
                          color: selectedOption?.label === opt.label ? '#fff' : '#4b5563',
                          fontFamily: "'Poppins', sans-serif", transition: 'all 0.15s',
                        }}>
                          <span>{opt.label}</span>
                          <span style={{ fontWeight: 600 }}>₹{parseInt(opt.price).toLocaleString('en-IN')}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Book */}
                <button onClick={() => setEnquiryOpen(true)} style={{
                  width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
                  background: '#E8651A', color: '#fff', fontSize: '15px', fontWeight: 600,
                  cursor: 'pointer', marginBottom: '10px', fontFamily: "'Poppins', sans-serif",
                  letterSpacing: '0.01em',
                }}>
                  Book Now
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <a href={pkg.itinerary_pdf || '#'} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px',
                    fontSize: '12px', fontWeight: 500, color: '#6b7280', textDecoration: 'none',
                    opacity: pkg.itinerary_pdf ? 1 : 0.4, pointerEvents: pkg.itinerary_pdf ? 'auto' : 'none',
                    fontFamily: "'Poppins', sans-serif",
                  }}>
                    <Download size={13} /> Download PDF
                  </a>
                  <a href={`https://wa.me/916396464369?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener noreferrer" style={{
                    width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#25D366', borderRadius: '8px', color: '#fff', textDecoration: 'none', flexShrink: 0,
                  }}>
                    <MessageCircle size={17} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 px-5 py-3 flex items-center gap-3" style={{ boxShadow: '0 -2px 16px rgba(0,0,0,0.08)' }}>
        <div className="flex-1">
          <p style={{ fontSize: '10px', color: '#9ca3af' }}>per person</p>
          <p style={{ fontSize: '20px', fontWeight: 700 }}>{displayPrice ? `₹${displayPrice.toLocaleString('en-IN')}` : 'On Request'}</p>
        </div>
        <a href={`https://wa.me/916396464369?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener noreferrer"
          style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#25D366', borderRadius: '10px', color: '#fff', textDecoration: 'none', flexShrink: 0 }}>
          <MessageCircle size={17} />
        </a>
        <button onClick={() => setEnquiryOpen(true)}
          style={{ padding: '11px 22px', background: '#E8651A', color: '#fff', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>
          Book Now
        </button>
      </div>

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} packageId={pkg.id} packageTitle={pkg.title} enquiryType="package" />
    </div>
  );
}
