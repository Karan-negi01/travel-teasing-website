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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> WhatsApp Us
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pt-10">
          <div className="col-span-2 md:col-span-1">
            <p className="text-white font-bold text-base mb-3">Travel Teasing</p>
            <p className="text-[#f2f2f2]/50 text-sm leading-relaxed mb-4">India's trusted travel partner for group trips, weekend escapes & adventure treks.</p>
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
              <h4 className="text-white font-semibold text-base mb-4">{section}</h4>
              <ul className="space-y-2">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href}
                      className="text-[#f2f2f2]/50 text-sm transition-colors"
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

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-[#f2f2f2]/30">
          <p>© {new Date().getFullYear()} Travel Teasing. All rights reserved.</p>
          <p>Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
}
