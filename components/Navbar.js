'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Mountain, Home, Layers, Users, BookOpen, Info, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const navLinks = [
  { href: '/packages',               label: 'Explore' },
  { href: '/packages?sort=popular',  label: 'Best Sellers' },
  { href: '/packages?type=domestic', label: 'Domestic' },
  { href: '/packages?type=international', label: 'International' },
  { href: '/about',                  label: 'About Us' },
  { href: '/blog',                   label: 'Blog' },
];

const mobileLinks = [
  { href: '/',              label: 'Home',         Icon: Home },
  { href: '/packages',      label: 'Explore',      Icon: Layers },
  { href: '/group-trips',   label: 'Group',        Icon: Users },
  { href: '/blog',          label: 'Blog',         Icon: BookOpen },
  { href: '/contact',       label: 'Contact',      Icon: MapPin },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser]             = useState(null);
  const pathname = usePathname();

  const isHeroPage = ['/', '/packages', '/group-trips', '/sacred-places', '/about'].includes(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const transparent = isHeroPage && !scrolled;

  return (
    <>
      {/* Desktop / top navbar */}
      <nav
        className={`transition-all duration-300 ${
          transparent
            ? 'bg-transparent'
            : 'bg-white shadow-sm border-b border-gray-100'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Mountain size={24} className={transparent ? 'text-white' : 'text-[#5bc1d5]'} />
              <span className={`font-bold text-lg tracking-tight ${transparent ? 'text-white' : 'text-[#1a1a1a]'}`}>
                Travel Teasing
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className={`text-base font-semibold transition-colors hover:text-[#5bc1d5] ${
                    pathname === link.href
                      ? 'text-[#5bc1d5]'
                      : transparent
                      ? 'text-white'
                      : 'text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop right */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium ${transparent ? 'text-white/90' : 'text-gray-600'} hover:text-[#5bc1d5] transition-colors`}
                >
                  My Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`text-sm font-medium ${transparent ? 'text-white/90' : 'text-gray-600'} hover:text-[#5bc1d5] transition-colors`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/group-trips"
                    className="bg-[#1a1a1a] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#333] transition-colors"
                  >
                    Upcoming Trips
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger — only for sidebar (not bottom nav) */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-lg ${transparent ? 'text-white' : 'text-gray-700'} hover:bg-black/10`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile sidebar drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
            <div className="px-5 py-5 space-y-1">
              {navLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className={`block text-sm font-medium py-3 border-b border-gray-50 ${
                    pathname === link.href ? 'text-[#5bc1d5]' : 'text-gray-700'
                  } hover:text-[#5bc1d5] transition-colors`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                {user ? (
                  <Link href="/dashboard" className="w-full bg-[#1a1a1a] text-white text-center py-3 rounded-full font-semibold text-sm">
                    My Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="w-full border-2 border-[#5bc1d5] text-[#5bc1d5] text-center py-3 rounded-full font-semibold text-sm">
                      Login
                    </Link>
                    <Link href="/group-trips" className="w-full bg-[#1a1a1a] text-white text-center py-3 rounded-full font-semibold text-sm">
                      Upcoming Trips
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile bottom nav bar — fixed, dark like deshvideshtravels */}
      <nav className="md:hidden fixed right-0 bottom-0 left-0 z-40 flex justify-between bg-[#1a1a1a] rounded-t-2xl px-4 py-2 shadow-2xl">
        {mobileLinks.map(({ href, label, Icon }) => (
          <Link
            key={href + label}
            href={href}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
              pathname === href ? 'text-[#5bc1d5]' : 'text-[#f2f2f2]/70 hover:text-[#5bc1d5]'
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
