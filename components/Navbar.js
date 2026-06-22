'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, Mountain, Home, Layers, Users, BookOpen, MapPin,
  ChevronDown, Snowflake, Waves, TreePine, Landmark, Building2,
  Tent, Compass, Sun, Globe, ArrowRight, MoreHorizontal
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const navLinks = [
  { label: 'Explore',       href: '/packages' },
  {
    label: 'Best Sellers',
    href: '/packages?sort=popular',
    dropdown: {
      columns: [
        {
          regions: [
            {
              heading: 'HIMALAYAN PICKS',
              items: [
                { label: 'Kashmir Tour',     href: '/packages?search=kashmir',   Icon: Snowflake },
                { label: 'Leh Ladakh Tour',  href: '/packages?search=ladakh',    Icon: Mountain },
                { label: 'Spiti Valley Tour',href: '/packages?search=spiti',     Icon: Tent },
                { label: 'Manali Tour',      href: '/packages?search=manali',    Icon: TreePine },
              ],
            },
          ],
        },
        {
          regions: [
            {
              heading: 'INTERNATIONAL',
              items: [
                { label: 'Bali Tour',        href: '/packages?search=bali',      Icon: Sun },
                { label: 'Thailand Tour',    href: '/packages?search=thailand',  Icon: Compass },
                { label: 'Maldives Tour',    href: '/packages?search=maldives',  Icon: Waves },
                { label: 'Vietnam Tour',     href: '/packages?search=vietnam',   Icon: Globe },
              ],
            },
          ],
        },
      ],
      viewAll: { label: 'View All Best Sellers', href: '/packages?sort=popular' },
    },
  },
  {
    label: 'Domestic',
    href: '/packages?type=domestic',
    dropdown: {
      columns: [
        {
          regions: [
            {
              heading: 'LADAKH',
              items: [{ label: 'Leh Ladakh Tour', href: '/packages?search=ladakh', Icon: Mountain }],
            },
            {
              heading: 'HIMACHAL PRADESH',
              items: [
                { label: 'Spiti Valley Tour', href: '/packages?search=spiti',    Icon: Tent },
                { label: 'Himachal Tour',     href: '/packages?search=himachal', Icon: TreePine },
                { label: 'Manali Tour',       href: '/packages?search=manali',   Icon: Mountain },
              ],
            },
            {
              heading: 'UTTARAKHAND',
              items: [{ label: 'Uttarakhand Tour', href: '/packages?search=uttarakhand', Icon: TreePine }],
            },
          ],
        },
        {
          regions: [
            {
              heading: 'JAMMU & KASHMIR',
              items: [{ label: 'Kashmir Tour', href: '/packages?search=kashmir', Icon: Snowflake }],
            },
            {
              heading: 'RAJASTHAN',
              items: [{ label: 'Rajasthan Tour', href: '/packages?search=rajasthan', Icon: Landmark }],
            },
            {
              heading: 'UTTAR PRADESH',
              items: [{ label: 'Varanasi Tour', href: '/packages?search=varanasi', Icon: Building2 }],
            },
            {
              heading: 'GOA & SOUTH INDIA',
              items: [
                { label: 'Goa Tour',    href: '/packages?search=goa',    Icon: Sun },
                { label: 'Kerala Tour', href: '/packages?search=kerala', Icon: Waves },
              ],
            },
          ],
        },
        {
          regions: [
            {
              heading: 'MEGHALAYA',
              items: [{ label: 'Meghalaya Tour', href: '/packages?search=meghalaya', Icon: Waves }],
            },
            {
              heading: 'NORTHEAST INDIA',
              items: [
                { label: 'Mizoram Tour',          href: '/packages?search=mizoram',   Icon: Mountain },
                { label: 'Arunachal Pradesh Tour', href: '/packages?search=arunachal', Icon: TreePine },
                { label: 'Nagaland Tour',          href: '/packages?search=nagaland',  Icon: Compass },
                { label: 'Sikkim Tour',            href: '/packages?search=sikkim',    Icon: Mountain },
              ],
            },
          ],
        },
      ],
      viewAll: { label: 'View All Domestic Trips', href: '/packages?type=domestic' },
    },
  },
  {
    label: 'International',
    href: '/packages?type=international',
    dropdown: {
      columns: [
        {
          regions: [
            {
              heading: 'SOUTHEAST ASIA',
              items: [
                { label: 'Bali Tour',       href: '/packages?search=bali',      Icon: Sun },
                { label: 'Thailand Tour',   href: '/packages?search=thailand',  Icon: Compass },
                { label: 'Vietnam Tour',    href: '/packages?search=vietnam',   Icon: Globe },
                { label: 'Singapore Tour',  href: '/packages?search=singapore', Icon: Building2 },
              ],
            },
          ],
        },
        {
          regions: [
            {
              heading: 'INDIAN OCEAN',
              items: [
                { label: 'Maldives Tour',   href: '/packages?search=maldives',  Icon: Waves },
                { label: 'Sri Lanka Tour',  href: '/packages?search=sri lanka', Icon: TreePine },
              ],
            },
            {
              heading: 'EAST ASIA',
              items: [
                { label: 'Japan Tour',      href: '/packages?search=japan',       Icon: Mountain },
                { label: 'South Korea Tour',href: '/packages?search=south korea', Icon: Building2 },
              ],
            },
          ],
        },
      ],
      viewAll: { label: 'View All International Trips', href: '/packages?type=international' },
    },
  },
  { label: 'About Us',       href: '/about' },
  { label: 'Blog',           href: '/blog' },
];

const mobileLinks = [
  { href: '/',            label: 'Home',    Icon: Home },
  { href: '/packages',    label: 'Explore', Icon: Layers },
  { href: '/group-trips', label: 'Trips',   Icon: Users },
  { href: '/blog',        label: 'Blog',    Icon: BookOpen },
  { href: '/contact',     label: 'Contact', Icon: MapPin },
];

export default function Navbar() {
  const [scrolled, setScrolled]             = useState(false);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [user, setUser]                     = useState(null);
  const closeTimer                          = useRef(null);
  const pathname                            = usePathname();

  const isHeroPage = ['/', '/packages', '/about'].includes(pathname);

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

  useEffect(() => { setMobileOpen(false); setActiveDropdown(null); }, [pathname]);

  const openDropdown  = (label) => { clearTimeout(closeTimer.current); setActiveDropdown(label); };
  const scheduleClose = ()      => { closeTimer.current = setTimeout(() => setActiveDropdown(null), 150); };

  const transparent = isHeroPage && !scrolled;
  const textColor   = transparent ? 'text-white' : 'text-gray-700';

  return (
    <>
      <nav className={`transition-all duration-300 relative z-50 ${transparent ? 'bg-transparent' : 'bg-white shadow-sm border-b border-gray-100'}`}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Mountain size={22} className={transparent ? 'text-white' : 'text-[#5bc1d5]'} />
              <span className={`font-bold text-base tracking-tight ${transparent ? 'text-white' : 'text-[#1a1a1a]'}`}>
                Travel Teasing
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.dropdown && openDropdown(link.label)}
                  onMouseLeave={scheduleClose}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-base font-medium transition-colors hover:text-[#5bc1d5] ${
                      pathname === link.href || activeDropdown === link.label
                        ? 'text-[#5bc1d5]'
                        : textColor
                    }`}
                  >
                    {link.label}
                    {link.dropdown && (
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180' : ''}`}
                      />
                    )}
                  </Link>

                  {/* Dropdown panel */}
                  {link.dropdown && activeDropdown === link.label && (
                    <div
                      className="absolute top-full left-0 pt-1 z-50"
                      onMouseEnter={() => openDropdown(link.label)}
                      onMouseLeave={scheduleClose}
                    >
                      <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="flex gap-0 divide-x divide-gray-100">
                          {link.dropdown.columns.map((col, ci) => (
                            <div key={ci} className="py-5 px-5 min-w-[180px]">
                              {col.regions.map((region) => (
                                <div key={region.heading} className="mb-4 last:mb-0">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-2">
                                    {region.heading}
                                  </p>
                                  <div className="space-y-0.5">
                                    {region.items.map((item) => (
                                      <Link
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-gray-50 group transition-colors"
                                      >
                                        <item.Icon size={14} className="text-gray-400 group-hover:text-[#5bc1d5] flex-shrink-0 transition-colors" />
                                        <span className="text-sm text-gray-700 group-hover:text-[#5bc1d5] transition-colors whitespace-nowrap">
                                          {item.label}
                                        </span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                        {/* View All footer */}
                        <div className="border-t border-gray-100 px-5 py-3">
                          <Link
                            href={link.dropdown.viewAll.href}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5bc1d5] hover:underline"
                          >
                            {link.dropdown.viewAll.label}
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop right */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <Link href="/dashboard" className={`text-sm font-medium ${transparent ? 'text-white/90' : 'text-gray-600'} hover:text-[#5bc1d5] transition-colors`}>
                  My Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className={`text-sm font-medium ${transparent ? 'text-white/90' : 'text-gray-600'} hover:text-[#5bc1d5] transition-colors`}>
                    Login
                  </Link>
                  <Link href="/group-trips" className="bg-[#1a1a1a] text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#333] transition-colors whitespace-nowrap">
                    Upcoming Trips
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-lg ${transparent ? 'text-white' : 'text-gray-700'} hover:bg-black/10`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl max-h-[70vh] overflow-y-auto">
            <div className="px-5 py-5 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
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

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed right-0 bottom-0 left-0 z-40 flex justify-between bg-[#1a1a1a] rounded-t-2xl px-4 py-2 shadow-2xl">
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
