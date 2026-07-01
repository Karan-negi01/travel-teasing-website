'use client';
import Link from 'next/link';
import { MessageCircle, Play } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import { useTheme } from '@/contexts/ThemeContext';

const footerLinks = {
  Explore:        [['All Packages', '/packages'], ['Upcoming Trips', '/group-trips'], ['Blog', '/blog'], ['About Us', '/about']],
  'About Us':     [['Our Story', '/about'], ['Who Travels With Us', '/about'], ['Testimonials', '/about'], ['Careers', '/contact']],
  Support:        [['Contact Us', '/contact'], ['WhatsApp Us', 'https://wa.me/916396464369'], ['FAQ', '/#faq']],
  'Terms & Info': [['Privacy Policy', '/privacy-policy'], ['Terms of Service', '/terms'], ['Cancellation Policy', '/terms']],
};

export default function Footer() {
  const { theme } = useTheme();
  const p = theme.primary;

  return (
    <footer style={{ background: '#111111', color: '#d1d5db' }}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 pt-14 pb-10">

        {/* CTA */}
        <div className="grid lg:grid-cols-2 gap-10 items-center pb-12 border-b border-white/10">
          <div>
            <p style={{ color: p, transition: 'color 0.4s ease' }}
              className="text-xs font-bold tracking-[0.15em] uppercase mb-3">
              From Tourist To Traveller
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              Memories are Waiting,<br />
              let's make them together!
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/contact"
              style={{ background: p, boxShadow: `0 8px 24px ${p}33`, transition: 'all 0.3s ease' }}
              className="flex-1 text-white py-3 px-6 rounded-full font-semibold text-sm text-center hover:opacity-90 transition-opacity">
              Plan Your Trip
            </Link>
            <a href="https://wa.me/916396464369?text=Hi! I want to plan a trip." target="_blank" rel="noopener noreferrer"
              className="flex-1 border border-white/20 text-white py-3 px-6 rounded-full font-semibold text-sm text-center hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              <MessageCircle size={15} /> WhatsApp Us
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pt-10">
          <div className="col-span-2 md:col-span-1">
            <p className="text-white font-bold text-base mb-3">Travel Teasing</p>
            <p className="text-[#f2f2f2]/50 text-xs leading-relaxed mb-4">India's trusted travel partner for group trips, weekend escapes & adventure treks.</p>
            <div className="flex gap-3">
              {[
                { href: 'https://youtube.com/@travelteasing', icon: <Play size={13} /> },
                { href: 'https://instagram.com/travelteasing', icon: <InstagramIcon size={13} /> },
                { href: 'https://wa.me/916396464369', icon: <MessageCircle size={13} /> },
              ].map(({ href, icon }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#f2f2f2]/60 transition-all"
                  style={{ transition: 'color 0.3s ease, background 0.3s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.color = p; e.currentTarget.style.background = `${p}22`; }}
                  onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm mb-3">{section}</h4>
              <ul className="space-y-2">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href}
                      className="text-[#f2f2f2]/50 text-xs transition-colors"
                      onMouseEnter={e => { e.currentTarget.style.color = p; }}
                      onMouseLeave={e => { e.currentTarget.style.color = ''; }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#f2f2f2]/30">
          <p>© {new Date().getFullYear()} Travel Teasing. All rights reserved.</p>
          <p>Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
}
