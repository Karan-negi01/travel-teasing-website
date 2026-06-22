import Link from 'next/link';
import { Mountain, LayoutDashboard, Package, MessageSquare, Users, Star, BookOpen, Image, CreditCard } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/packages', label: 'Packages', icon: Package },
  { href: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  { href: '/admin/transactions', label: 'Transactions', icon: CreditCard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/blogs', label: 'Blogs', icon: BookOpen },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
];

export const metadata = { title: 'Admin — Travel Teasing' };

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 bg-[#1a1a2e] text-white flex flex-col fixed top-0 left-0 h-full z-50">
        <div className="p-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <Mountain size={22} className="text-[#E8651A]" />
            <span className="font-bold text-sm">TT Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all">
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">← Back to Site</Link>
        </div>
      </aside>
      {/* Main */}
      <main className="ml-60 flex-1 p-8 min-h-screen">{children}</main>
    </div>
  );
}
