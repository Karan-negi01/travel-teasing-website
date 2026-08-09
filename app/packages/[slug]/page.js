'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { MapPin, Clock, Users, MessageCircle, Download, Navigation, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import EnquiryModal from '@/components/EnquiryModal';
import { useTheme, CATEGORY_THEMES } from '@/contexts/ThemeContext';

function getThemeKeyFromPackage(pkg) {
  if (!pkg) return 'default';
  const v = (pkg.vibe || '').toLowerCase().trim();
  const c = (pkg.category || '').toLowerCase();
  const s = (pkg.subtype || '').toLowerCase();
  const t = (pkg.title || '').toLowerCase();
  // Direct category key match (set from admin)
  const KEYS = ['treks', 'honeymoon', 'beaches', 'wildlife', 'heritage', 'offbeat', 'womens', 'weekend'];
  if (KEYS.includes(v)) return v;
  // Fallback fuzzy detection
  if (v.includes('trek') || t.includes('trek')) return 'treks';
  if (s.includes('women') || t.includes("women's only")) return 'womens';
  if (c === 'weekend' || t.includes('weekend')) return 'weekend';
  if (v.includes('honeymoon') || t.includes('honeymoon')) return 'honeymoon';
  if (v.includes('beach') || t.includes('beach') || t.includes('goa') || t.includes('andaman')) return 'beaches';
  if (v.includes('wildlife') || v.includes('safari') || t.includes('wildlife') || t.includes('safari')) return 'wildlife';
  if (v.includes('heritage') || v.includes('culture') || t.includes('heritage')) return 'heritage';
  if (v.includes('offbeat') || t.includes('offbeat')) return 'offbeat';
  return 'default';
}

const TABS = [
  { id: 'about', label: 'About the Trip' },
  { id: 'overview', label: 'Itinerary' },
  { id: 'inclusions', label: 'Inclusions' },
  { id: 'costing', label: 'Pricing' },
  { id: 'faq', label: 'FAQ' },
];

export default function PackageDetailPage({ params }) {
  const { slug } = params;
  const searchParams = useSearchParams();
  const fromCategory = searchParams.get('from');
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const { applyTheme, darkMode, theme } = useTheme();
  const [activeTab, setActiveTab] = useState('about');
  const [openFaq, setOpenFaq] = useState(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookingMode, setBookingMode] = useState('fit'); // 'fit' | 'group'
  const [fitCustomDate, setFitCustomDate] = useState('');
  const [openDay, setOpenDay] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const sectionRefs = useRef({});

  useEffect(() => {
    fetch(`/api/packages/${slug}`).then(r => r.json()).then(d => {
      setPkg(d.package);
      if (d.package?.tour_options?.length > 0) setSelectedOption(d.package.tour_options[0]);
      if (d.package?.multi_dates?.length > 0) setSelectedDate(d.package.multi_dates[0]);
      else if (d.package?.start_date) setSelectedDate({ start_date: d.package.start_date, end_date: d.package.end_date });
      const themeKey = (fromCategory && CATEGORY_THEMES[fromCategory]) ? fromCategory : getThemeKeyFromPackage(d.package);
      applyTheme(themeKey);
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
      <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
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

  const waDateStr = pkg.is_fit_group
    ? (bookingMode === 'fit' ? (fitCustomDate ? ` — FIT, date: ${fitCustomDate}` : ' — FIT') : (selectedDate ? ` — Group, ${formatDate(selectedDate)}` : ' — Group'))
    : (selectedDate ? ` — ${formatDate(selectedDate)}` : '');
  const waText = `Hi! I'm interested in ${pkg.title}${selectedOption ? ` (${selectedOption.label})` : ''}${waDateStr}.`;
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
  const resolvedThemeKey = (fromCategory && CATEGORY_THEMES[fromCategory]) ? fromCategory : getThemeKeyFromPackage(pkg);
  const catTheme = CATEGORY_THEMES[resolvedThemeKey] || CATEGORY_THEMES.default;
  const accent = catTheme.primary;

  const c = {
    pageBg:      darkMode ? '#0d0d0d'                   : '#ffffff',
    cardBg:      darkMode ? '#181818'                   : '#ffffff',
    textPrimary: darkMode ? '#ffffff'                   : '#111111',
    textSub:     darkMode ? 'rgba(255,255,255,0.6)'     : '#111111',
    textMuted:   darkMode ? 'rgba(255,255,255,0.4)'     : '#111111',
    textFaint:   darkMode ? 'rgba(255,255,255,0.25)'    : '#444444',
    textLabel:   darkMode ? 'rgba(255,255,255,0.35)'    : '#555555',
    border:      darkMode ? 'rgba(255,255,255,0.07)'    : 'rgba(0,0,0,0.08)',
    borderMid:   darkMode ? 'rgba(255,255,255,0.1)'     : 'rgba(0,0,0,0.12)',
    surface:     darkMode ? 'rgba(255,255,255,0.03)'    : 'rgba(0,0,0,0.03)',
    surfaceHov:  darkMode ? 'rgba(255,255,255,0.05)'    : 'rgba(0,0,0,0.05)',
    tabsBg:      darkMode ? 'rgba(18,18,18,0.85)'       : 'rgba(255,255,255,0.85)',
    tabsActive:  darkMode ? 'rgba(255,255,255,0.1)'     : 'rgba(0,0,0,0.08)',
    tabsActiveBorder: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)',
    tabsInactive: darkMode ? 'rgba(255,255,255,0.4)'   : 'rgba(0,0,0,0.4)',
    tabsHov:     darkMode ? 'rgba(255,255,255,0.7)'     : 'rgba(0,0,0,0.7)',
    tabsHovBg:   darkMode ? 'rgba(255,255,255,0.05)'    : 'rgba(0,0,0,0.05)',
    dot:         darkMode ? 'rgba(255,255,255,0.2)'     : 'rgba(0,0,0,0.2)',
    shadow:      darkMode ? 'rgba(0,0,0,0.4)'           : 'rgba(0,0,0,0.12)',
    mobileCta:   darkMode ? '#181818'                   : '#ffffff',
    selectBg:    darkMode ? 'rgba(255,255,255,0.07)'    : 'rgba(0,0,0,0.05)',
    selectColor: darkMode ? '#ffffff'                   : '#111111',
  };

  return (
    <div style={{ background: c.pageBg, backgroundColor: c.pageBg, minHeight: '100vh', fontFamily: "'Poppins', sans-serif", color: c.textPrimary }}>

      {/* ── CINEMATIC SLIDER HERO ── */}
      <div style={{ position: 'relative', width: '100%', height: '85vh', minHeight: '580px', maxHeight: '820px', overflow: 'hidden', background: '#0a0a0a' }}>

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
          @keyframes contentFadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes itineraryExpand {
            from { opacity: 0; transform: translateY(-8px); max-height: 0; }
            to   { opacity: 1; transform: translateY(0);  max-height: 600px; }
          }
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: ${darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}; }
          ::-webkit-scrollbar-thumb { background: ${accent}; border-radius: 999px; }
          ::-webkit-scrollbar-thumb:hover { background: ${accent}cc; }
          * { scrollbar-width: thin; scrollbar-color: ${accent} ${darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}; }
        `}</style>
      </div>


      {/* ── STICKY TABS ── */}
      <div style={{ background: c.pageBg, borderBottom: `1px solid ${c.border}`, boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '0' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => scrollToSection(t.id)} style={{
              padding: '16px 28px',
              fontSize: '15px',
              fontWeight: activeTab === t.id ? 700 : 500,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: activeTab === t.id ? accent : c.textPrimary,
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === t.id ? `2.5px solid ${accent}` : '2.5px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              fontFamily: "'Poppins', sans-serif",
              marginBottom: '-1px',
            }}
            onMouseEnter={e => { if (activeTab !== t.id) { e.currentTarget.style.color = c.textPrimary; }}}
            onMouseLeave={e => { if (activeTab !== t.id) { e.currentTarget.style.color = c.tabsInactive; }}}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT + SIDEBAR ── */}
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '48px 24px 80px 24px', background: c.pageBg, backgroundColor: c.pageBg }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: '64px', alignItems: 'start' }}>

          {/* LEFT */}
          <div style={{ animation: 'contentFadeUp 0.5s ease both' }}>

            {/* ABOUT */}
            <section ref={el => sectionRefs.current['about'] = el} className="scroll-mt-32">

              {/* Section heading */}
              <h2 style={{ fontSize: '26px', fontWeight: 700, color: c.textPrimary, marginBottom: '20px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>About the Trip</h2>

              {/* Description + about_sections with Read More */}
              {(() => {
                const hasSections = (pkg.about_sections || []).length > 0;
                const isLong = (pkg.description?.length > 300) || hasSections;
                return (
                  <div style={{ marginBottom: '32px' }}>
                    {/* Clipped container */}
                    <div style={{ position: 'relative', maxHeight: descExpanded || !isLong ? 'none' : '120px', overflow: 'hidden' }}>
                      {pkg.description && (
                        <p style={{ fontSize: '18px', color: c.textSub, lineHeight: 1.9, margin: '0 0 32px' }}>{pkg.description}</p>
                      )}
                      {/* Extra about sections — hidden until expanded */}
                      {hasSections && (pkg.about_sections || []).map((sec, i) => (
                        <div key={i} style={{ marginBottom: '32px' }}>
                          {sec.heading && <h3 style={{ fontSize: '20px', fontWeight: 700, color: c.textPrimary, marginBottom: '12px' }}>{sec.heading}</h3>}
                          <p style={{ fontSize: '18px', color: c.textSub, lineHeight: 1.9, margin: 0 }}>{sec.content}</p>
                        </div>
                      ))}
                      {/* Gradient overlay */}
                      {isLong && !descExpanded && (
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
                          background: `linear-gradient(to bottom, transparent, ${c.pageBg})`,
                          pointerEvents: 'none',
                        }} />
                      )}
                    </div>
                    {/* Read More button */}
                    {isLong && (
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                        <button onClick={() => setDescExpanded(e => !e)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 700, color: c.textPrimary, display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px', letterSpacing: '0.02em' }}>
                          {descExpanded ? 'Read Less' : 'Read More'}
                          <ChevronDown size={16} style={{ transform: descExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}


              {/* Highlights */}
              {pkg.highlights?.length > 0 && (
                <div>
                  <h2 style={{ fontSize: '26px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: c.textPrimary, marginBottom: '20px' }}>Highlights</h2>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {pkg.highlights.map((h, i) => (
                      <li key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}><circle cx="10" cy="10" r="10" fill={accent}/><path d="M5.5 10.5l3 3 6-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span style={{ fontSize: '18px', color: c.textSub, lineHeight: 1.5 }}>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* ITINERARY */}
            <section ref={el => sectionRefs.current['overview'] = el} className="scroll-mt-32" style={{ marginTop: '56px' }}>
              <h2 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '28px', color: c.textPrimary, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Tour Itinerary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

                {pkg.itinerary?.map((day, i) => (
                  <div key={i} style={{ border: '1px solid', borderColor: openDay === i ? `${accent}40` : c.border, borderRadius: '14px', overflow: 'hidden', background: openDay === i ? `${accent}08` : 'transparent', transition: 'all 0.2s ease' }}>
                      <button onClick={() => setOpenDay(openDay === i ? null : i)} style={{
                        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer',
                        textAlign: 'left', fontFamily: "'Poppins', sans-serif", gap: '16px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: openDay === i ? accent : c.textFaint, letterSpacing: '0.08em', textTransform: 'uppercase', minWidth: '52px', flexShrink: 0 }}>DAY {i + 1}</span>
                          <p style={{ fontSize: '18px', fontWeight: 500, color: openDay === i ? c.textPrimary : c.textSub, margin: 0, transition: 'color 0.2s' }}>{day.title}</p>
                        </div>
                        {openDay === i ? <ChevronUp size={15} color={accent} strokeWidth={2} /> : <ChevronDown size={15} color={c.textFaint} strokeWidth={2} />}
                      </button>

                      {openDay === i && (day.description || day.bullets?.length > 0 || day.meal_info) && (
                        <div style={{ padding: '0 22px 20px', borderTop: `1px solid ${c.border}`, animation: 'itineraryExpand 0.3s cubic-bezier(0.4,0,0.2,1)', overflow: 'hidden' }}>
                          {/* Day images */}
                          {day.images?.filter(Boolean).length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px', margin: '16px 0', borderRadius: '8px', overflow: 'hidden' }}>
                              {day.images.filter(Boolean).slice(0, 3).map((img, ii) => (
                                <div key={ii} style={{ position: 'relative', aspectRatio: '4/3' }}>
                                  <Image src={img} alt="" fill className="object-cover" sizes="150px" />
                                </div>
                              ))}
                            </div>
                          )}
                          {/* New format: paragraph + bullets array */}
                          {day.bullets?.filter(Boolean).length > 0 ? (
                            <>
                              {day.description && (
                                <p style={{ fontSize: '18px', color: c.textSub, lineHeight: 1.9, margin: '16px 0 14px' }}>{day.description}</p>
                              )}
                              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {day.bullets.filter(Boolean).map((b, bi) => (
                                  <li key={bi} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: accent, flexShrink: 0, marginTop: '11px' }} />
                                    <span style={{ fontSize: '18px', color: c.textSub, lineHeight: 1.9 }}>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            /* Old format fallback: split description by period into bullets */
                            day.description && (
                              <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {day.description.split('.').filter(s => s.trim().length > 8).map((s, si) => (
                                  <li key={si} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: accent, flexShrink: 0, marginTop: '11px' }} />
                                    <span style={{ fontSize: '18px', color: c.textSub, lineHeight: 1.9 }}>{s.trim()}.</span>
                                  </li>
                                ))}
                              </ul>
                            )
                          )}
                          {/* Meal info */}
                          {day.meal_info && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', paddingTop: '14px', borderTop: `1px solid ${c.border}` }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Clock size={14} color="#fff" strokeWidth={2} />
                              </div>
                              <span style={{ fontSize: '15px', fontWeight: 700, color: accent }}>{day.meal_info}</span>
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </section>

            {/* INCLUSIONS */}
            <section ref={el => sectionRefs.current['inclusions'] = el} className="scroll-mt-32" style={{ marginTop: '56px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {pkg.inclusions?.length > 0 && (
                  <div>
                    <h2 style={{ fontSize: '26px', fontWeight: 700, color: c.textPrimary, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>What's Included</h2>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      {pkg.inclusions.map((inc, i) => (
                        <li key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}><circle cx="10" cy="10" r="10" fill={accent}/><path d="M5.5 10.5l3 3 6-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          <span style={{ fontSize: '18px', color: c.textSub, lineHeight: 1.5 }}>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {pkg.exclusions?.length > 0 && (
                  <div>
                    <h2 style={{ fontSize: '26px', fontWeight: 700, color: c.textPrimary, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>What's Not Included</h2>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      {pkg.exclusions.map((exc, i) => (
                        <li key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}><circle cx="10" cy="10" r="10" fill={accent}/><path d="M6.5 6.5l7 7M13.5 6.5l-7 7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>
                          <span style={{ fontSize: '18px', color: c.textPrimary, lineHeight: 1.5 }}>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {pkg.things_to_carry?.length > 0 && (
                <div style={{ marginTop: '40px' }}>
                  <h2 style={{ fontSize: '26px', fontWeight: 700, color: c.textPrimary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px' }}>Things to Carry</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {pkg.things_to_carry.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.dot, flexShrink: 0, marginTop: '8px' }} />
                        <span style={{ fontSize: '18px', color: c.textSub }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* COSTING */}
            <section ref={el => sectionRefs.current['costing'] = el} className="scroll-mt-32" style={{ marginTop: '56px' }}>
              <h2 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '28px', color: c.textPrimary, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Pricing
              </h2>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                {(pkg.tour_options?.length > 0 ? pkg.tour_options : [{ label: 'Standard', price: String(displayPrice) }]).map((opt, i) => {
                  const disc = parseInt(opt.price);
                  const orig = (i === 0 && originalPrice > disc) ? originalPrice : null;
                  const pct = orig ? Math.round(((orig - disc) / orig) * 100) : null;
                  return (
                    <div key={i} style={{ borderRadius: '12px', border: `1px solid ${i === 0 ? accent + '50' : c.border}`, background: i === 0 ? accent + '12' : c.surface, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 500, color: c.textPrimary }}>{opt.label}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {orig && <span style={{ fontSize: '16px', color: c.textLabel, textDecoration: 'line-through' }}>₹{orig.toLocaleString('en-IN')}</span>}
                          <span style={{ fontSize: '20px', fontWeight: 700, color: c.textPrimary }}>₹{disc.toLocaleString('en-IN')}</span>
                          {pct && <span style={{ fontSize: '11px', fontWeight: 600, background: 'rgba(34,197,94,0.15)', color: '#4ade80', padding: '3px 8px', borderRadius: '4px' }}>−{pct}%</span>}
                        </div>
                      </div>
                      <div style={{ padding: '10px 22px 14px', borderTop: `1px solid ${i === 0 ? accent + '30' : c.border}` }}>
                        <span style={{ fontSize: '14px', color: c.textPrimary }}>* All prices are per person. GST 5% + TCS 2% applicable.</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Batches */}
              {dateOptions.length > 0 && (
                <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: '24px' }}>
                  <p style={{ fontSize: '18px', fontWeight: 600, color: c.textPrimary, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>Available Dates</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {dateOptions.map((d, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: `1px solid ${c.border}`, borderRadius: '8px', background: c.surface }}>
                        <span style={{ fontSize: '14px', color: c.textSub }}>{formatDate(d)}</span>
                        <span style={{ fontSize: '12px', color: c.textPrimary }}>{pkg.duration_days} days</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Important Notes */}
              <div style={{
                marginTop: '28px',
                background: darkMode ? 'rgba(255,220,80,0.07)' : '#fffde7',
                border: `1px solid ${darkMode ? 'rgba(255,220,80,0.2)' : '#f9e44a'}`,
                borderLeft: '4px solid #f9e44a',
                borderRadius: '12px',
                padding: '20px 24px',
              }}>
                <p style={{ fontSize: '15px', fontWeight: 700, color: darkMode ? '#ffe066' : '#111111', marginBottom: '12px' }}>
                  Important Notes
                </p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    'Reserve your seat now by paying a booking amount of ₹50,000 & pay the rest 30–35 days before the trip.',
                    'We levy 5% GST on tour packages and 2% TCS as per the regulations of Indian Government and taxation system.',
                    'Package prices are dynamic and subject to change. The price may update in case the confirmation is delayed and the source prices get updated.',
                    ...(pkg.important_notes || []),
                  ].map((note, i) => (
                    <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: darkMode ? '#fff' : '#111', flexShrink: 0, marginTop: '11px', display: 'inline-block' }} />
                      <span style={{ fontSize: '18px', color: darkMode ? 'rgba(255,255,255,0.75)' : '#111111', lineHeight: 1.9 }}>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* FAQ */}
            <section ref={el => sectionRefs.current['faq'] = el} className="scroll-mt-32" style={{ marginTop: '56px' }}>
              <h2 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '28px', color: c.textPrimary, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Frequently Asked <span style={{ color: accent }}>Questions</span>
              </h2>
              {[
                { q: 'What is included in the package price?', a: 'The package includes accommodation, transportation between destinations, breakfast daily, and all monument entry fees as mentioned in the inclusions section. Flights to the starting city are not included unless specified.' },
                { q: 'Can the itinerary be customised?', a: 'Yes! All our packages are fully customisable. You can add/remove destinations, change hotel categories, adjust the number of days, or add special experiences. Just drop us a message on WhatsApp.' },
                { q: 'What is the cancellation policy?', a: 'Cancellations made 30+ days before departure: 90% refund. 15–29 days: 50% refund. 7–14 days: 25% refund. Less than 7 days: no refund. We strongly recommend travel insurance.' },
                { q: 'How do I book this package?', a: 'Click "Book Now" or message us on WhatsApp. We will confirm availability, share a detailed itinerary, and collect a 25% advance to lock your dates. Balance is due 15 days before departure.' },
                { q: 'Is this a group trip or private?', a: 'This is a private trip — just you and your group. We do not mix you with other travelers. For fixed-departure group trips, check our Group Trips section.' },
              ].map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i} style={{ borderBottom: `1px solid ${c.border}`, overflow: 'hidden' }}>
                    <button onClick={() => setOpenFaq(isOpen ? null : i)} style={{
                      width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer',
                      textAlign: 'left', fontFamily: "'Poppins', sans-serif", gap: '16px',
                    }}>
                      <span style={{ fontSize: '18px', fontWeight: 500, color: isOpen ? c.textPrimary : c.textSub, transition: 'color 0.2s' }}>{item.q}</span>
                      <span style={{ color: isOpen ? accent : c.textFaint, flexShrink: 0, transition: 'color 0.2s' }}>
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </span>
                    </button>
                    {isOpen && (
                      <div style={{ paddingBottom: '18px', animation: 'contentFadeUp 0.2s ease both' }}>
                        <p style={{ fontSize: '18px', color: c.textMuted, lineHeight: 1.8, margin: 0 }}>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </section>

          </div>

          {/* SIDEBAR */}
          <div className="hidden lg:block" style={{ position: 'sticky', top: '148px' }}>
            <div style={{ border: `1px solid ${c.borderMid}`, borderRadius: '16px', overflow: 'hidden', background: c.cardBg }}>
              {/* Price */}
              <div style={{ padding: '24px', borderBottom: `1px solid ${c.border}` }}>
                <p style={{ fontSize: '17px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: c.textPrimary, marginBottom: '8px' }}>Book This Tour</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '34px', fontWeight: 700, color: c.textPrimary, letterSpacing: '-0.5px' }}>
                    {displayPrice ? `₹${displayPrice.toLocaleString('en-IN')}` : 'On Request'}
                  </span>
                  {savings && <span style={{ fontSize: '14px', color: c.textFaint, textDecoration: 'line-through' }}>₹{originalPrice?.toLocaleString('en-IN')}</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: c.textPrimary }}>+ tax as applicable</span>
                  {savings && <span style={{ fontSize: '11px', fontWeight: 600, color: '#4ade80', background: 'rgba(34,197,94,0.12)', padding: '2px 7px', borderRadius: '4px' }}>Save ₹{savings.toLocaleString('en-IN')}</span>}
                </div>
              </div>

              <div style={{ padding: '20px 24px' }}>
                {/* Date — FIT & Group split */}
                {pkg.is_fit_group ? (
                  <div style={{ marginBottom: '14px' }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', background: c.surface, borderRadius: '10px', padding: '4px' }}>
                      {['fit', 'group'].map(mode => (
                        <button key={mode} onClick={() => setBookingMode(mode)} style={{
                          flex: 1, padding: '8px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                          fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 600,
                          background: bookingMode === mode ? accent : 'transparent',
                          color: bookingMode === mode ? '#fff' : c.textSub,
                          transition: 'all 0.15s',
                        }}>
                          {mode === 'fit' ? 'FIT' : 'Group'}
                        </button>
                      ))}
                    </div>
                    {bookingMode === 'fit' ? (
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: c.textLabel, marginBottom: '6px' }}>Select Your Date</label>
                        <input type="date" value={fitCustomDate} onChange={e => setFitCustomDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          style={{ width: '100%', border: `1px solid ${c.borderMid}`, borderRadius: '8px', padding: '11px 14px', fontSize: '15px', color: fitCustomDate ? c.textPrimary : c.textFaint, background: c.selectBg, fontFamily: "'Poppins', sans-serif", outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }} />
                      </div>
                    ) : (
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: c.textLabel, marginBottom: '6px' }}>Available Batch</label>
                        {dateOptions.length > 0 ? (
                          <select value={JSON.stringify(selectedDate)} onChange={e => setSelectedDate(JSON.parse(e.target.value))}
                            style={{ width: '100%', border: `1px solid ${c.borderMid}`, borderRadius: '8px', padding: '12px 14px', fontSize: '15px', color: c.selectColor, background: c.selectBg, fontFamily: "'Poppins', sans-serif", outline: 'none', cursor: 'pointer' }}>
                            {dateOptions.map((d, i) => <option key={i} value={JSON.stringify(d)}>{formatDate(d)}</option>)}
                          </select>
                        ) : (
                          <div style={{ padding: '12px 14px', borderRadius: '8px', border: `1px solid ${c.borderMid}`, fontSize: '15px', color: c.textFaint, background: c.selectBg }}>On Request</div>
                        )}
                      </div>
                    )}
                  </div>
                ) : dateOptions.length > 0 ? (
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: c.textLabel, marginBottom: '6px' }}>Select Date</label>
                    <select value={JSON.stringify(selectedDate)} onChange={e => setSelectedDate(JSON.parse(e.target.value))}
                      style={{ width: '100%', border: `1px solid ${c.borderMid}`, borderRadius: '8px', padding: '12px 14px', fontSize: '16px', color: c.selectColor, background: c.selectBg, fontFamily: "'Poppins', sans-serif", outline: 'none', cursor: 'pointer' }}>
                      {dateOptions.map((d, i) => <option key={i} value={JSON.stringify(d)}>{formatDate(d)}</option>)}
                    </select>
                  </div>
                ) : null}

                {/* Options */}
                {pkg.tour_options?.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: c.textLabel, marginBottom: '8px' }}>Tour Option</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {pkg.tour_options.map((opt, i) => (
                        <button key={i} onClick={() => setSelectedOption(opt)} style={{
                          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '13px 16px', borderRadius: '8px', cursor: 'pointer',
                          border: `1.5px solid ${selectedOption?.label === opt.label ? accent : c.borderMid}`,
                          background: selectedOption?.label === opt.label ? accent + '22' : c.surface,
                          fontSize: '15px', fontWeight: 500,
                          color: selectedOption?.label === opt.label ? c.textPrimary : c.textSub,
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
                  background: accent, color: '#fff', fontSize: '17px', fontWeight: 600,
                  cursor: 'pointer', marginBottom: '10px', fontFamily: "'Poppins', sans-serif",
                  letterSpacing: '0.01em',
                }}>
                  Book Now
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <a href={pkg.itinerary_pdf || '#'} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    border: `1px solid ${c.borderMid}`, borderRadius: '8px', padding: '10px',
                    fontSize: '14px', fontWeight: 500, color: c.textMuted, textDecoration: 'none',
                    opacity: pkg.itinerary_pdf ? 1 : 0.4, pointerEvents: pkg.itinerary_pdf ? 'auto' : 'none',
                    fontFamily: "'Poppins', sans-serif", background: c.surface,
                  }}>
                    <Download size={13} /> Download PDF
                  </a>
                  <a href={`https://wa.me/916396464369?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener noreferrer" style={{
                    width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#25D366', borderRadius: '8px', color: '#fff', textDecoration: 'none', flexShrink: 0,
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* MOBILE CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t px-5 py-3 flex items-center gap-3" style={{ background: c.mobileCta, borderColor: c.border, boxShadow: `0 -4px 24px ${c.shadow}` }}>
        <div className="flex-1">
          <p style={{ fontSize: '10px', color: c.textLabel }}>per person</p>
          <p style={{ fontSize: '20px', fontWeight: 700, color: c.textPrimary }}>{displayPrice ? `₹${displayPrice.toLocaleString('en-IN')}` : 'On Request'}</p>
        </div>
        <a href={`https://wa.me/916396464369?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener noreferrer"
          style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#25D366', borderRadius: '10px', color: '#fff', textDecoration: 'none', flexShrink: 0 }}>
          <MessageCircle size={17} />
        </a>
        <button onClick={() => setEnquiryOpen(true)}
          style={{ padding: '11px 22px', background: accent, color: '#fff', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>
          Book Now
        </button>
      </div>

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} packageId={pkg.id} packageTitle={pkg.title} enquiryType="package" />
    </div>
  );
}
