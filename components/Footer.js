import Link from 'next/link';
import { Mountain, MessageCircle, Mail } from 'lucide-react';
import InstagramIcon from './InstagramIcon';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-gray-300">
      <div className="max-w-[1600px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo + tagline */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mountain size={28} className="text-[#E8651A]" />
              <span className="text-white font-bold text-xl">
                Travel Teasing
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              India's trusted travel partner for group trips, family packages, sacred journeys, and adventure treks.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['All Packages', '/packages'],
                ['Group Trips', '/group-trips'],
                ['Sacred Places', '/sacred-places'],
                ['Blog', '/blog'],
                ['About Us', '/about'],
                ['Contact', '/contact'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-[#E8651A] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trip Types */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Trip Types</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['Group Trips', '/packages?category=group'],
                ['Family Packages', '/packages?category=family'],
                ['Sacred Journeys', '/packages?category=sacred'],
                ['Adventure & Treks', '/packages?category=adventure'],
                ['Corporate Trips', '/packages?category=corporate'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 hover:text-[#E8651A] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Destinations & Connect */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Popular Destinations</h4>
            <ul className="space-y-2 text-sm mb-6">
              {['Kasol', 'Ladakh', 'Spiti Valley', 'Kedarnath', 'Varanasi', 'Manali'].map((dest) => (
                <li key={dest}>
                  <Link
                    href={`/packages?search=${dest}`}
                    className="text-gray-400 hover:text-[#E8651A] transition-colors"
                  >
                    {dest}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Connect With Us</h4>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href="https://wa.me/916396464369"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-[#25D366] transition-colors"
              >
                <MessageCircle size={16} />
                WhatsApp Us
              </a>
              <a
                href="mailto:hello@travelteasing.com"
                className="flex items-center gap-2 text-gray-400 hover:text-[#E8651A] transition-colors"
              >
                <Mail size={16} />
                hello@travelteasing.com
              </a>
              <a
                href="https://instagram.com/travelteasing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-pink-400 transition-colors"
              >
                <InstagramIcon size={16} />
                @travelteasing
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Travel Teasing. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-[#E8651A] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#E8651A] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
