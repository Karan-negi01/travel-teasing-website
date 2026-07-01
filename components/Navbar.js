'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Home, Layers, Users, BookOpen, MapPin, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useTheme, CATEGORY_THEMES } from '@/contexts/ThemeContext';


const menuItems = [
  { label: 'Best Sellers',  sub: 'Our top picks',             href: '/packages?sort=popular',       img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80' },
  { label: 'Domestic',      sub: 'Incredible India',          href: '/packages?type=domestic',      img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
  { label: 'International', sub: 'Beyond borders',            href: '/packages?type=international', img: 'https://images.unsplash.com/photo-1537519646099-335112f03225?w=800&q=80' },
  { label: 'About Us',      sub: 'Our story since 2019',      href: '/about',                       img: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=80' },
  { label: 'Blog',          sub: 'Travel stories & tips',     href: '/blog',                        img: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=80' },
];

const mobileLinks = [
  { href: '/',            label: 'Home',    Icon: Home },
  { href: '/packages',    label: 'Explore', Icon: Layers },
  { href: '/group-trips', label: 'Trips',   Icon: Users },
  { href: '/blog',        label: 'Blog',    Icon: BookOpen },
  { href: '/contact',     label: 'Contact', Icon: MapPin },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen]         = useState(false);
  const [hoveredIdx, setHoveredIdx]     = useState(0);
  const [scrolled, setScrolled]         = useState(false);
  const [user, setUser]                 = useState(null);
  const pathname                        = usePathname();
  const { theme, category, applyTheme, darkMode, toggleDarkMode } = useTheme();
  const isHeroPage = ['/', '/packages', '/about'].includes(pathname);

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
      {/* ── FLOATING PILL NAVBAR ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        display: 'flex', justifyContent: 'center',
        padding: menuOpen ? '16px 24px' : (scrolled ? '10px 24px' : '16px 24px'),
        transition: 'padding 0.4s ease',
        pointerEvents: 'none',
      }}>
        <nav style={{
          pointerEvents: 'auto',
          display: 'flex', alignItems: 'center',
          gap: '0',
          height: '62px',
          background: menuOpen
            ? 'rgba(10,10,10,0.92)'
            : 'rgba(10,10,10,0.78)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '999px',
          padding: '0 6px 0 16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
          overflow: 'visible',
          minWidth: 0,
        }}>

          {/* ── LOGO ── */}
          <Link href="/" onClick={() => { setMenuOpen(false); applyTheme('default'); }} style={{
            display: 'flex', alignItems: 'center',
            textDecoration: 'none', flexShrink: 0, marginRight: '4px',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Travel Teasing"
              style={{
                height: '50px',
                width: 'auto',
                filter: `brightness(0) invert(1) ${category === 'default' ? '' : getLogoTintFilter(category)}`,
                transition: 'filter 0.5s ease',
                objectFit: 'contain',
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback text logo */}
            <span style={{
              display: 'none', alignItems: 'center', gap: '6px',
              fontSize: '14px', fontWeight: 700,
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: '-0.2px', color: '#fff',
              whiteSpace: 'nowrap',
            }}>
              <span style={{ fontSize: '18px' }}>{theme.emoji}</span>
              Travel Teasing
            </span>
          </Link>

          {/* Divider */}
          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.12)', margin: '0 14px', flexShrink: 0 }} />

          {/* ── DESKTOP QUICK LINKS ── */}
          <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '2px' }}>
            {/* EXPLORE with category dropdown */}
            <ExploreDropdown theme={theme} pathname={pathname} />
            {[
              { label: 'FIT',    href: '/packages?category=fit' },
              { label: 'GROUPS', href: '/group-trips' },
            ].map(({ label, href }) => (
              <Link key={label} href={href} style={{
                fontSize: '14px', fontWeight: 500, padding: '6px 14px',
                borderRadius: '999px', textDecoration: 'none',
                fontFamily: "'Poppins', sans-serif",
                color: pathname === href ? '#fff' : 'rgba(255,255,255,0.52)',
                background: pathname === href ? 'rgba(255,255,255,0.1)' : 'transparent',
                transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => {
                const active = pathname === href;
                e.currentTarget.style.color = active ? '#fff' : 'rgba(255,255,255,0.52)';
                e.currentTarget.style.background = active ? 'rgba(255,255,255,0.1)' : 'transparent';
              }}
              >{label}</Link>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden lg:block" style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.12)', margin: '0 14px', flexShrink: 0 }} />

          {/* ── RIGHT ACTIONS ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {/* Dark / Light toggle */}
            <button
              onClick={toggleDarkMode}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '36px', height: '36px', borderRadius: '50%',
                background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.15)',
                cursor: 'pointer', transition: 'all 0.2s ease',
                color: darkMode ? '#fbbf24' : '#e5e7eb',
                flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.15)'; }}
            >
              {darkMode ? <Sun size={15} strokeWidth={2} /> : <Moon size={15} strokeWidth={2} />}
            </button>
            {!menuOpen && !user && (
              <Link href="/group-trips" className="hidden lg:flex" style={{
                fontSize: '14px', fontWeight: 600, color: theme.primary,
                textDecoration: 'none', padding: '7px 16px', borderRadius: '999px',
                border: `1px solid ${theme.primary}55`,
                background: `${theme.primary}18`,
                fontFamily: "'Poppins', sans-serif",
                whiteSpace: 'nowrap', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${theme.primary}30`; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${theme.primary}18`; }}
              >Upcoming Trips</Link>
            )}

            {/* Menu button */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                background: menuOpen ? '#fff' : theme.primary,
                border: 'none', borderRadius: '999px',
                padding: '8px 16px', cursor: 'pointer',
                color: menuOpen ? '#1a1a1a' : '#fff',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '14px', fontWeight: 700,
                transition: 'all 0.25s', whiteSpace: 'nowrap',
                letterSpacing: '0.01em',
              }}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <><X size={13} strokeWidth={2.5} /> Close</>
              ) : (
                <>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '3.5px' }}>
                    <span style={{ display: 'block', width: '13px', height: '1.5px', background: 'currentColor', borderRadius: '2px' }} />
                    <span style={{ display: 'block', width: '9px', height: '1.5px', background: 'currentColor', borderRadius: '2px' }} />
                  </span>
                  Menu
                </>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* ── FULL SCREEN OVERLAY MENU ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: '#0d0d0d',
        display: 'flex',
        pointerEvents: menuOpen ? 'auto' : 'none',
        opacity: menuOpen ? 1 : 0,
        transition: 'opacity 0.45s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Left: Nav items */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '80px 60px',
        }}>
          <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '40px', fontFamily: "'Poppins', sans-serif" }}>
            Navigation
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {menuItems.map((item, i) => (
              <Link key={item.href} href={item.href}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 20px 14px 0', textDecoration: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  transition: 'padding 0.2s ease',
                  animation: menuOpen ? `fadeInUp 0.5s ${i * 0.07}s both` : 'none',
                }}
                onMouseEnter={e => { setHoveredIdx(i); e.currentTarget.style.paddingLeft = '12px'; }}
                onMouseLeave={e => { e.currentTarget.style.paddingLeft = '0'; }}
              >
                <div>
                  <span style={{
                    display: 'block',
                    fontSize: 'clamp(28px, 4vw, 48px)',
                    fontWeight: 700, letterSpacing: '-1px',
                    fontFamily: "'Poppins', sans-serif",
                    color: hoveredIdx === i ? '#fff' : 'rgba(255,255,255,0.38)',
                    transition: 'color 0.2s ease',
                    lineHeight: 1.15,
                  }}>
                    {item.label}
                  </span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.28)', fontFamily: "'Poppins', sans-serif", display: hoveredIdx === i ? 'block' : 'none', marginTop: '2px' }}>
                    {item.sub}
                  </span>
                </div>
                <ArrowUpRight size={20} style={{ color: hoveredIdx === i ? theme.primary : 'transparent', transition: 'color 0.2s', flexShrink: 0 }} />
              </Link>
            ))}
          </div>

          {/* Category pills inside the full menu */}
          <div style={{ marginTop: '32px', animation: menuOpen ? 'fadeInUp 0.5s 0.35s both' : 'none' }}>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '14px', fontFamily: "'Poppins', sans-serif" }}>
              Explore by Category
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {Object.entries(CATEGORY_THEMES).filter(([k]) => k !== 'default').map(([key, catTheme]) => {
                const isActive = category === key;
                return (
                  <Link key={key} href={`/packages?category=${key}`}
                    onClick={() => { applyTheme(key); setMenuOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '6px 14px', borderRadius: '999px', textDecoration: 'none',
                      border: `1px solid ${isActive ? catTheme.primary : 'rgba(255,255,255,0.12)'}`,
                      background: isActive ? `${catTheme.primary}20` : 'transparent',
                      transition: 'all 0.18s',
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '12px', fontWeight: 500,
                      color: isActive ? catTheme.primary : 'rgba(255,255,255,0.5)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = catTheme.primary; e.currentTarget.style.color = catTheme.primary; }}
                    onMouseLeave={e => {
                      if (!isActive) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }
                    }}
                  >
                    <span>{catTheme.emoji}</span> {catTheme.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom links */}
          <div style={{ display: 'flex', gap: '24px', marginTop: '32px', animation: menuOpen ? 'fadeInUp 0.5s 0.5s both' : 'none' }}>
            {user ? (
              <Link href="/dashboard" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontFamily: "'Poppins', sans-serif" }}>Dashboard</Link>
            ) : (
              <Link href="/login" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontFamily: "'Poppins', sans-serif" }}>Login</Link>
            )}
            <Link href="/contact" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontFamily: "'Poppins', sans-serif" }}>Contact</Link>
            <Link href="/group-trips" style={{ fontSize: '13px', color: theme.primary, fontWeight: 600, textDecoration: 'none', fontFamily: "'Poppins', sans-serif" }}>Upcoming Trips →</Link>
          </div>
        </div>

        {/* Right: Featured destination image */}
        <div className="hidden lg:block" style={{ width: '38%', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          {menuItems.map((item, i) => (
            <div key={i} style={{
              position: 'absolute', inset: 0,
              opacity: hoveredIdx === i ? 1 : 0,
              transition: 'opacity 0.55s cubic-bezier(0.4,0,0.2,1)',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.75)' }} />
            </div>
          ))}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0d0d0d 0%, transparent 30%)' }} />
          <div style={{ position: 'absolute', bottom: '40px', left: '40px' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '6px', fontFamily: "'Poppins', sans-serif" }}>
              {menuItems[hoveredIdx]?.sub}
            </p>
            <p style={{ fontSize: '20px', fontWeight: 700, color: '#fff', fontFamily: "'Poppins', sans-serif", lineHeight: 1.2 }}>
              {menuItems[hoveredIdx]?.label}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
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
  ];

  const activeIdx = hoveredCat !== null ? hoveredCat : 0;
  const activeCat = categories[activeIdx];
  const activeTheme = CATEGORY_THEMES[activeCat.key];

  return (
    <div ref={ref} style={{ position: 'relative' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}>

      {/* Trigger button */}
      <button style={{
        fontSize: '14px', fontWeight: 500, padding: '6px 14px',
        borderRadius: '999px', border: 'none', cursor: 'pointer',
        fontFamily: "'Poppins', sans-serif",
        color: open ? '#fff' : 'rgba(255,255,255,0.52)',
        background: open ? 'rgba(255,255,255,0.1)' : 'transparent',
        transition: 'all 0.15s', whiteSpace: 'nowrap',
        display: 'flex', alignItems: 'center', gap: '5px',
      }}>
        EXPLORE
        <span style={{
          display: 'inline-block', fontSize: '8px', opacity: 0.45,
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease', marginTop: '1px',
        }}>▾</span>
      </button>

      {/* Invisible bridge — keeps hover alive between button and panel */}
      <div
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          position: 'fixed', top: '62px', left: '50%',
          transform: 'translateX(-50%)',
          width: '800px', height: '14px',
          pointerEvents: open ? 'auto' : 'none',
          zIndex: 201,
        }} />

      {/* Dropdown panel */}
      <div
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          position: 'fixed', top: '76px', left: '50%',
          width: '800px',
          background: '#0c0c0c',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '24px',
          overflow: 'hidden',
          zIndex: 200,
          boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
          pointerEvents: open ? 'auto' : 'none',
          opacity: open ? 1 : 0,
          transform: open ? 'translateX(-50%) translateY(0px)' : 'translateX(-50%) translateY(-12px)',
          transition: 'opacity 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}>

        {/* Thin top color accent strip */}
        <div style={{
          height: '2px',
          background: `linear-gradient(90deg, transparent 0%, ${activeTheme.primary} 50%, transparent 100%)`,
          transition: 'background 0.4s ease',
        }} />

        <div style={{ display: 'flex', height: '400px' }}>

          {/* ── LEFT: category list ── */}
          <div style={{
            width: '320px', flexShrink: 0,
            display: 'flex', flexDirection: 'column',
            padding: '18px 8px 16px',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(255,255,255,0.01)',
          }}>
            <p style={{
              fontSize: '9px', fontWeight: 700,
              color: 'rgba(255,255,255,0.18)',
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: '0.18em', textTransform: 'uppercase',
              padding: '0 14px 12px', margin: 0,
            }}>Browse Categories</p>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1px', overflowY: 'auto' }}>
              {categories.map((cat, i) => {
                const ct = CATEGORY_THEMES[cat.key];
                const isHov = (hoveredCat === null ? i === 0 : hoveredCat === i);
                return (
                  <Link key={cat.key} href={`/packages?category=${cat.key}`}
                    onClick={() => setOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '7px 14px', borderRadius: '10px',
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
                          fontSize: '13px', fontWeight: 600,
                          color: isHov ? '#fff' : 'rgba(255,255,255,0.5)',
                          fontFamily: "'Poppins', sans-serif",
                          transition: 'color 0.18s ease',
                          lineHeight: 1.3,
                        }}>{cat.label}</span>
                      </div>
                      {/* Tagline only visible on hover */}
                      <span style={{
                        fontSize: '10px',
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
