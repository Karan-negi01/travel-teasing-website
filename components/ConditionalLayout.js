'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWhatsApp from './FloatingWhatsApp';
import AnnouncementBar from './AnnouncementBar';

// Pages where hero fills full viewport — navbar floats over them transparently
const HERO_PAGES = ['/', '/packages', '/group-trips', '/about'];

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAdmin  = pathname?.startsWith('/admin');
  const isHero   = HERO_PAGES.includes(pathname);

  if (isAdmin) return <>{children}</>;

  return (
    <>
      {/* Fixed top: announcement bar + navbar stacked */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <AnnouncementBar />
        <Navbar />
      </div>

      {/*
        Non-hero pages need a spacer to push content below the fixed header.
        Hero pages (/, /packages, etc.) have a full-screen first section
        so they don't need the spacer — the navbar floats transparently over the hero.
      */}
      {!isHero && <div className="h-[100px]" />}

      {/* pb-16 on mobile to avoid content hiding behind bottom nav */}
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      {/* Homepage has its own built-in footer — skip the standalone Footer there */}
      {pathname !== '/' && <Footer />}
      <FloatingWhatsApp />
    </>
  );
}
