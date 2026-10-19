'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { X, Home, Layers, Users, BookOpen, MapPin, ArrowUpRight, Sun, Moon, Search, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTheme, CATEGORY_THEMES } from '@/contexts/ThemeContext';


const menuItems = [
  { label: 'Best Sellers',  sub: 'Our top picks',             href: '/packages?sort=popular',       img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80' },
  { label: 'Domestic',      sub: 'Incredible India',          href: '/packages?type=domestic',      img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
  { label: 'International', sub: 'Beyond borders',            href: '/packages?type=international', img: 'https://images.unsplash.com/photo-1537519646099-335112f03225?w=800&q=80' },
  { label: 'Community Trips', sub: 'Hosted by travellers',    href: '/community-trips',             img: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1200&q=80' },
  { label: 'About Us',      sub: 'Our story since 2019',      href: '/about',                       img: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=80' },
  { label: 'Blog',          sub: 'Travel stories & tips',     href: '/blog',                        img: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=80' },
];

const menuTiles = [
  { label: 'Best Sellers',     sub: 'Our most-loved trips',        href: '/packages?sort=popular',         img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80' },
  { label: 'Upcoming Trips',   sub: 'Fixed departures, trip captain', href: '/packages?category=groups',   img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80' },
  { label: 'Community Trips',  sub: 'Hosted by travellers like you', href: '/community-trips',             img: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1200&q=80' },
  { label: 'Domestic',         sub: 'Incredible India',            href: '/packages?type=domestic',        img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80' },
  { label: 'International',    sub: 'Beyond borders',              href: '/packages?type=international',   img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80' },
  { label: 'About Us',         sub: 'Our story since 2019',        href: '/about',                         img: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1200&q=80' },
];

const mobileLinks = [
  { href: '/',            label: 'Home',    Icon: Home },
  { href: '/packages',    label: 'Explore', Icon: Layers },
  { href: '/packages?category=groups', label: 'Trips',   Icon: Users },
  { href: '/blog',        label: 'Blog',    Icon: BookOpen },
  { href: '/contact',     label: 'Contact', Icon: MapPin },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen]         = useState(false);
  const [hoveredIdx, setHoveredIdx]     = useState(0);
  const [scrolled, setScrolled]         = useState(false);
  const [user, setUser]                 = useState(null);
  const pathname                        = usePathname();
  const router                          = useRouter();
  const [navSearch, setNavSearch]       = useState('');
  const { theme, category, applyTheme, darkMode, toggleDarkMode } = useTheme();
  const isHeroPage = ['/', '/packages', '/about', '/community-trips'].includes(pathname) || (pathname?.startsWith('/community-trips/') && pathname !== '/community-trips/new') || pathname?.startsWith('/profile/');

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setUser(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const transparent = isHeroPage && !scrolled && !menuOpen;

  return (
    <>
      {/* ── FULL-WIDTH NAVBAR ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, pointerEvents: 'none' }}>
        <nav className="px-5 sm:px-8 lg:px-10" style={{
          pointerEvents: 'auto', position: 'relative',
          display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
          width: '100%', height: scrolled && !menuOpen ? '68px' : '84px',
          background: menuOpen
            ? 'rgba(10,10,10,0.95)'
            : transparent ? 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)' : 'rgba(10,10,10,0.9)',
          backdropFilter: transparent ? 'none' : 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: transparent ? 'none' : 'blur(20px) saturate(180%)',
          borderBottom: 'none',
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
          fontFamily: "'Poppins', sans-serif",
        }}>

          {/* ── LEFT: SEARCH (desktop) ── */}
          <form onSubmit={e => { e.preventDefault(); const q = navSearch.trim(); if (q) { router.push(`/packages?search=${encodeURIComponent(q)}`); setNavSearch(''); } }}
            className="hidden lg:flex" style={{ alignItems: 'center', gap: '10px', width: 'min(300px, 100%)', height: '42px', padding: '0 16px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.06)' }}>
            <Search size={15} style={{ color: 'rgba(255,255,255,0.6)', flexShrink: 0 }} />
            <input value={navSearch} onChange={e => setNavSearch(e.target.value)} placeholder="Where to?" aria-label="Search destinations"
              style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', fontFamily: "'Poppins', sans-serif", letterSpacing: '0.02em', boxShadow: 'none', backgroundColor: 'transparent' }} />
          </form>
          <div className="lg:hidden" />
          {/* ── LOGO ── */}
          <Link href="/" onClick={() => { setMenuOpen(false); applyTheme('default'); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', flexShrink: 0, justifySelf: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Travel Teasing"
              style={{ height: scrolled && !menuOpen ? '46px' : '54px', width: 'auto', objectFit: 'contain', filter: `brightness(0) invert(1) ${category === 'default' ? '' : getLogoTintFilter(category)}`, transition: 'filter 0.5s ease, height 0.4s cubic-bezier(0.4,0,0.2,1)' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }} />
            <span style={{ display: 'none', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 700, letterSpacing: '-0.2px', color: '#fff', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '18px' }}>{theme.emoji}</span> Travel Teasing
            </span>
          </Link>

          {/* ── RIGHT ACTIONS ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', flexShrink: 0 }}>
            <div className="hidden lg:block" style={{ marginRight: '10px' }}><ExploreDropdown theme={theme} pathname={pathname} /></div>

            {user ? (
              <Link href="/dashboard" title="Your dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', padding: '4px 6px 4px 4px', marginLeft: '4px' }}>
                <span style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.6)', boxShadow: 'none', background: 'rgba(255,255,255,0.08)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, overflow: 'hidden' }}>
                  {user.user_metadata?.avatar_url
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={user.user_metadata.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : (user.user_metadata?.full_name || user.email || 'T').trim().charAt(0).toUpperCase()}
                </span>
              </Link>
            ) : (
              <Link href="/login" className="hidden sm:inline-flex tt-nav-link" style={{ padding: '8px 4px' }}>Log in</Link>
            )}


            <button onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu" className="tt-nav-icon" style={{ marginLeft: '4px', border: '1px solid rgba(255,255,255,0.22)', width: '44px', height: '44px', background: menuOpen ? '#fff' : 'transparent', color: menuOpen ? '#0d0d0d' : '#fff' }}>
              {menuOpen ? <X size={16} strokeWidth={2} /> : (
                <span style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
                  <span style={{ display: 'block', width: '18px', height: '1.5px', background: 'currentColor' }} />
                  <span style={{ display: 'block', width: '12px', height: '1.5px', background: 'currentColor' }} />
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* ── FULL SCREEN OVERLAY MENU — photo tiles ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 999, background: '#0a0a0a',
        pointerEvents: menuOpen ? 'auto' : 'none', opacity: menuOpen ? 1 : 0,
        transition: 'opacity 0.4s cubic-bezier(0.4,0,0.2,1)', overflowY: 'auto',
        fontFamily: "'Poppins', sans-serif",
      }}>
        <div className="px-5 sm:px-8 lg:px-10" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '104px', paddingBottom: '24px' }}>

          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '18px', animation: menuOpen ? 'fadeInUp 0.5s 0.05s both' : 'none' }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 2.2vw, 30px)', color: '#fff', margin: 0, fontWeight: 400 }}>Where to <em style={{ color: 'rgba(255,255,255,.6)' }}>next?</em></p>
            <div style={{ display: 'flex', gap: '22px', alignItems: 'center', flexWrap: 'wrap' }}>
              {user ? <Link href="/dashboard" className="tt-nav-link">Dashboard</Link> : <Link href="/login" className="tt-nav-link">Log in</Link>}
              <Link href="/blog" className="tt-nav-link">Blog</Link>
              <Link href="/contact" className="tt-nav-link">Contact</Link>
              <button onClick={toggleDarkMode} className="tt-nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                {darkMode ? <Sun size={13} /> : <Moon size={13} />} {darkMode ? 'Light' : 'Dark'}
              </button>
            </div>
          </div>

          {/* Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '10px', flex: 1, gridAutoRows: 'minmax(200px, 1fr)' }}>
            {menuTiles.map((t, i) => (
              <Link key={t.href} href={t.href} onClick={() => setMenuOpen(false)} className="group"
                style={{ position: 'relative', display: 'block', overflow: 'hidden', borderRadius: '18px', minHeight: '200px', textDecoration: 'none', background: '#141414', animation: menuOpen ? `fadeInUp 0.55s ${0.08 + i * 0.06}s both` : 'none' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1), filter 0.4s', filter: 'brightness(0.78)' }}
                  className="group-hover:scale-[1.06] group-hover:brightness-90" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.1) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,.78) 100%)' }} />
                <span style={{ position: 'absolute', top: '16px', left: '18px', fontSize: '10px', letterSpacing: '0.26em', color: 'rgba(255,255,255,.7)' }}>0{i + 1}</span>
                <span className="group-hover:opacity-100 group-hover:translate-x-0" style={{ position: 'absolute', top: '14px', right: '16px', width: '34px', height: '34px', borderRadius: '50%', background: '#fff', color: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transform: 'translateX(6px)', transition: 'opacity .3s, transform .3s' }}><ArrowUpRight size={15} /></span>
                <div style={{ position: 'absolute', left: '18px', right: '18px', bottom: '18px' }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px, 2.1vw, 34px)', fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1.05 }}>{t.label}</p>
                  <p style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', margin: '8px 0 0' }}>{t.sub}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Categories + footer */}
          <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px 24px', animation: menuOpen ? 'fadeInUp 0.5s 0.5s both' : 'none' }}>
            <div className="scrollbar-hide" style={{ display: 'flex', gap: '18px', overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '2px' }}>
              {Object.entries(CATEGORY_THEMES).filter(([k]) => k !== 'default').map(([key, catTheme]) => (
                <Link key={key} href={`/packages?category=${key}`} onClick={() => { applyTheme(key); setMenuOpen(false); }}
                  style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', textDecoration: 'none', color: category === key ? catTheme.primary : 'rgba(255,255,255,0.5)', transition: 'color .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; }} onMouseLeave={e => { e.currentTarget.style.color = category === key ? catTheme.primary : 'rgba(255,255,255,0.5)'; }}>
                  {catTheme.label}
                </Link>
              ))}
            </div>
            <a href="https://wa.me/918510988703" target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', flexShrink: 0 }}>WhatsApp · +91 85109 88703</a>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav — hidden on detail pages that have their own bottom action bar */}
      {!((pathname?.startsWith('/packages/') ) || (pathname?.startsWith('/community-trips/') && pathname !== '/community-trips/new')) && (
      <nav className="flex lg:hidden" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
        justifyContent: 'space-around',
        background: 'rgba(10,10,10,0.97)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '8px 0 12px',
        borderRadius: '20px 20px 0 0',
      }}>
        {mobileLinks.map(({ href, label, Icon }) => (
          <Link key={href + label} href={href} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
            padding: '4px 16px', textDecoration: 'none',
            color: pathname === href ? theme.primary : 'rgba(255,255,255,0.38)',
            transition: 'color 0.15s',
          }}>
            <Icon size={20} />
            <span style={{ fontSize: '10px', fontWeight: 500, fontFamily: "'Poppins', sans-serif" }}>{label}</span>
          </Link>
        ))}
      </nav>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  );
}

function ExploreDropdown({ theme, pathname }) {
  const [open, setOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState(null);
  const ref = useRef(null);
  const closeTimer = useRef(null);

  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setHoveredCat(null);
    }, 150);
  };

  const categories = [
    { key: 'treks',     label: 'Treks',          tagline: 'Conquer peaks, breathe mountains',  trips: '24+', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85' },
    { key: 'honeymoon', label: 'Honeymoon',       tagline: 'Begin forever in beautiful places', trips: '18+', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=85' },
    { key: 'beaches',   label: 'Beaches',         tagline: 'Sun, sand & sound of waves',       trips: '15+', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=85' },
    { key: 'offbeat',   label: 'Offbeat',         tagline: "Go where maps haven't been",       trips: '12+', img: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=85' },
    { key: 'wildlife',  label: 'Wildlife',        tagline: 'Into the wild — real & raw',       trips: '10+', img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=85' },
    { key: 'heritage',  label: 'Heritage',        tagline: "India's living history",           trips: '14+', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=85' },
    { key: 'womens',    label: "Women's Only",    tagline: 'Safe, curated trips for women',    trips: '8+',  img: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=85' },
    { key: 'weekend',   label: 'Weekend Escapes', tagline: 'Two days. Infinite memories.',     trips: '20+', img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=85' },
    { key: 'party',     label: 'Party Life',      tagline: 'Live loud. Travel louder.',        trips: '8+',  img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=85' },
    { key: 'city',      label: 'City Tours',      tagline: 'Streets, stories, skylines.',      trips: '10+', img: 'https://images.unsplash.com/photo-1538485399081-7c8272461b8a?w=800&q=85' },
    { key: 'adventure', label: 'Adventure',       tagline: 'Push limits. Chase thrills.',      trips: '12+', img: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800&q=85' },
  ];

  const activeIdx = hoveredCat !== null ? hoveredCat : 0;
  const activeCat = categories[activeIdx];
  const activeTheme = CATEGORY_THEMES[activeCat.key];

  return (
    <div ref={ref} style={{ position: 'relative' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}>

      {/* Trigger button */}
      <button className={`tt-nav-link${open ? ' is-active' : ''}`} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        Explore
        <ChevronDown size={14} strokeWidth={2.2} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', marginTop: '-1px' }} />
      </button>

      {/* Invisible bridge — keeps hover alive between button and panel */}
      <div
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          position: 'fixed', top: '66px', right: 'clamp(16px, 2.8vw, 40px)',
          
          width: '800px', height: '24px',
          pointerEvents: open ? 'auto' : 'none',
          zIndex: 201,
        }} />

      {/* Dropdown panel */}
      <div
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          position: 'fixed', top: '92px', right: 'clamp(16px, 2.8vw, 40px)',
          width: '800px',
          background: '#0c0c0c',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '24px',
          overflow: 'hidden',
          zIndex: 200,
          boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
          pointerEvents: open ? 'auto' : 'none',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0px)' : 'translateY(-12px)',
          transition: 'opacity 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}>

        {/* Thin top color accent strip */}
        <div style={{
          height: '2px',
          background: `linear-gradient(90deg, transparent 0%, ${activeTheme.primary} 50%, transparent 100%)`,
          transition: 'background 0.4s ease',
        }} />

        <div style={{ display: 'flex', height: '520px' }}>

          {/* ── LEFT: category list ── */}
          <div style={{
            width: '380px', flexShrink: 0,
            display: 'flex', flexDirection: 'column',
            padding: '20px 10px 18px',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(255,255,255,0.01)',
          }}>
            <p style={{
              fontSize: '10px', fontWeight: 700,
              color: 'rgba(255,255,255,0.18)',
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: '0.18em', textTransform: 'uppercase',
              padding: '0 16px 14px', margin: 0,
            }}>Browse Categories</p>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
              {categories.map((cat, i) => {
                const ct = CATEGORY_THEMES[cat.key];
                const isHov = (hoveredCat === null ? i === 0 : hoveredCat === i);
                return (
                  <Link key={cat.key} href={`/packages?category=${cat.key}`}
                    onClick={() => setOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '9px 16px', borderRadius: '10px',
                      textDecoration: 'none',
                      background: isHov ? `${ct.primary}12` : 'transparent',
                      transition: 'background 0.18s ease',
                      position: 'relative', overflow: 'hidden',
                    }}
                    onMouseEnter={() => setHoveredCat(i)}
                    onMouseLeave={() => setHoveredCat(null)}
                  >
                    {/* Left accent bar */}
                    <div style={{
                      position: 'absolute', left: 0, top: '20%', bottom: '20%',
                      width: '2px', borderRadius: '2px',
                      background: ct.primary,
                      opacity: isHov ? 1 : 0,
                      transition: 'opacity 0.18s ease',
                    }} />

                    <div style={{ paddingLeft: isHov ? '4px' : '0', transition: 'padding 0.18s ease' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{
                          fontSize: '9px', fontWeight: 700,
                          color: isHov ? ct.primary : 'rgba(255,255,255,0.15)',
                          fontFamily: "'Poppins', sans-serif",
                          transition: 'color 0.18s ease',
                          letterSpacing: '0.05em',
                        }}>0{i + 1}</span>
                        <span style={{
                          fontSize: '15px', fontWeight: 600,
                          color: isHov ? '#fff' : 'rgba(255,255,255,0.5)',
                          fontFamily: "'Poppins', sans-serif",
                          transition: 'color 0.18s ease',
                          lineHeight: 1.3,
                        }}>{cat.label}</span>
                      </div>
                      {/* Tagline only visible on hover */}
                      <span style={{
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.35)',
                        fontFamily: "'Poppins', sans-serif",
                        display: 'block', marginTop: '1px',
                        maxHeight: isHov ? '20px' : '0',
                        opacity: isHov ? 1 : 0,
                        overflow: 'hidden',
                        transition: 'max-height 0.2s ease, opacity 0.2s ease',
                      }}>{cat.tagline}</span>
                    </div>

                    {/* Trip count badge */}
                    <span style={{
                      fontSize: '10px', fontWeight: 700,
                      padding: '3px 8px', borderRadius: '20px',
                      background: isHov ? `${ct.primary}22` : 'rgba(255,255,255,0.04)',
                      color: isHov ? ct.primary : 'rgba(255,255,255,0.18)',
                      border: `1px solid ${isHov ? ct.primary + '40' : 'transparent'}`,
                      fontFamily: "'Poppins', sans-serif",
                      transition: 'all 0.18s ease',
                      whiteSpace: 'nowrap', flexShrink: 0,
                    }}>{cat.trips}</span>
                  </Link>
                );
              })}
            </div>

            {/* Footer CTA */}
            <div style={{ padding: '12px 14px 0', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '8px' }}>
              <Link href="/packages" onClick={() => setOpen(false)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                textDecoration: 'none', padding: '8px 0',
              }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.35)', fontFamily: "'Poppins', sans-serif" }}>
                  All packages
                </span>
                <span style={{
                  fontSize: '11px', fontWeight: 700, color: theme.primary,
                  fontFamily: "'Poppins', sans-serif",
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  View all <span>→</span>
                </span>
              </Link>
            </div>
          </div>

          {/* ── RIGHT: image preview ── */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            {/* Stacked images */}
            {categories.map((cat, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={cat.key} src={cat.img} alt={cat.label}
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover',
                  opacity: activeIdx === i ? 1 : 0,
                  transition: 'opacity 0.5s cubic-bezier(0.4,0,0.2,1)',
                  transform: activeIdx === i ? 'scale(1)' : 'scale(1.04)',
                  filter: 'brightness(0.55)',
                }} />
            ))}

            {/* Multi-layer gradient */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,12,12,0.95) 0%, rgba(12,12,12,0.3) 40%, transparent 70%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(12,12,12,0.4) 0%, transparent 50%)' }} />

            {/* Top-right badge */}
            <div style={{
              position: 'absolute', top: '20px', right: '20px',
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${activeTheme.primary}40`,
              padding: '5px 10px', borderRadius: '20px',
              transition: 'border-color 0.4s ease',
            }}>
              <span style={{ fontSize: '14px', lineHeight: 1 }}>{activeTheme.emoji}</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: activeTheme.primary, fontFamily: "'Poppins', sans-serif', transition: 'color 0.4s ease" }}>
                {activeCat.trips} trips
              </span>
            </div>

            {/* Bottom info */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 28px 24px' }}>
              {/* Category label chip */}
              <span style={{
                display: 'inline-block',
                fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                color: activeTheme.primary,
                fontFamily: "'Poppins', sans-serif",
                marginBottom: '10px',
                transition: 'color 0.4s ease',
              }}>✦ {activeTheme.label || activeCat.label}</span>

              <p style={{
                margin: 0,
                fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px',
                color: '#fff', fontFamily: "'Poppins', sans-serif", lineHeight: 1.15,
              }}>{activeCat.label}</p>

              <p style={{
                margin: '7px 0 18px',
                fontSize: '12px', color: 'rgba(255,255,255,0.5)',
                fontFamily: "'Poppins', sans-serif", lineHeight: 1.5,
              }}>{activeCat.tagline}</p>

              <Link href={`/packages?category=${activeCat.key}`} onClick={() => setOpen(false)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  padding: '9px 18px', borderRadius: '30px',
                  background: activeTheme.primary,
                  color: '#fff', textDecoration: 'none',
                  fontSize: '12px', fontWeight: 700,
                  fontFamily: "'Poppins', sans-serif",
                  letterSpacing: '0.02em',
                  boxShadow: `0 4px 20px ${activeTheme.primary}50`,
                  transition: 'background 0.4s ease, box-shadow 0.4s ease',
                }}>
                Explore {activeCat.label} <span style={{ fontSize: '14px' }}>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getLogoTintFilter(category) {
  const tints = {
    treks:     'sepia(1) hue-rotate(80deg) saturate(2) brightness(0.85)',
    honeymoon: 'sepia(1) hue-rotate(280deg) saturate(2) brightness(0.9)',
    beaches:   'sepia(1) hue-rotate(150deg) saturate(1.8) brightness(0.9)',
    offbeat:   'sepia(1) hue-rotate(210deg) saturate(2) brightness(0.85)',
    wildlife:  'sepia(1) hue-rotate(90deg) saturate(1.8) brightness(0.85)',
    heritage:  'sepia(1) hue-rotate(330deg) saturate(2) brightness(0.9)',
    womens:    'sepia(1) hue-rotate(270deg) saturate(2) brightness(0.9)',
    weekend:   'sepia(1) hue-rotate(310deg) saturate(2) brightness(0.9)',
  };
  return tints[category] || '';
}
