'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWhatsApp from './FloatingWhatsApp';
import AnnouncementBar from './AnnouncementBar';
import SiteLoader from './SiteLoader';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Pages where hero fills full viewport — navbar floats over them transparently
const HERO_PAGES = ['/', '/packages', '/about'];
const AUTH_PAGES = ['/login', '/signup', '/auth/callback'];
const isHeroPath = (path) => HERO_PAGES.includes(path) || path?.startsWith('/packages/') || path === '/community-trips' || (path?.startsWith('/community-trips/') && path !== '/community-trips/new') || path?.startsWith('/profile/');

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAdmin  = pathname?.startsWith('/admin');
  const isHero   = isHeroPath(pathname);

  if (isAdmin) return <>{children}</>;
  if (AUTH_PAGES.includes(pathname)) return <ThemeProvider><SiteLoader />{children}</ThemeProvider>;

  return (
    <ThemeProvider>
      <SiteLoader />
      {/* Fixed top: navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/*
        Non-hero pages need a spacer to push content below the fixed header.
        Hero pages (/, /packages, etc.) have a full-screen first section
        so they don't need the spacer — the navbar floats transparently over the hero.
      */}
      {!isHero && <div className="h-[84px]" />}

      {/* pb-16 on mobile to avoid content hiding behind bottom nav */}
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </ThemeProvider>
  );
}
