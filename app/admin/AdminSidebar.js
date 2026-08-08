'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, MessageSquare, Users, Star, BookOpen, Image, CreditCard, ExternalLink } from 'lucide-react';

const navItems = [
  { href: '/admin',              label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/admin/packages',     label: 'Packages',     icon: Package },
  { href: '/admin/enquiries',    label: 'Enquiries',    icon: MessageSquare },
  { href: '/admin/transactions', label: 'Transactions', icon: CreditCard },
  { href: '/admin/users',        label: 'Users',        icon: Users },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/blogs',        label: 'Blogs',        icon: BookOpen },
  { href: '/admin/gallery',      label: 'Gallery',      icon: Image },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside style={{ width: '240px', background: '#0f1624', position: 'fixed', top: 0, left: 0, height: '100%', zIndex: 50, display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #5bc1d5, #1f77a3)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#fff', fontSize: '13px', fontWeight: 800 }}>TT</span>
          </div>
          <div>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '14px', lineHeight: 1.2 }}>Travel Teasing</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px',
              fontSize: '13px', fontWeight: isActive ? 600 : 400,
              textDecoration: 'none', transition: 'all 0.15s',
              background: isActive ? 'rgba(91,193,213,0.15)' : 'transparent',
              color: isActive ? '#5bc1d5' : 'rgba(255,255,255,0.5)',
              borderLeft: isActive ? '2px solid #5bc1d5' : '2px solid transparent',
            }}>
              <Icon size={15} strokeWidth={isActive ? 2 : 1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '14px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <Link href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.3)', fontSize: '12px', textDecoration: 'none', padding: '8px 10px', borderRadius: '6px', transition: 'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#5bc1d5'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
        >
          <ExternalLink size={12} /> View Live Site
        </Link>
      </div>
    </aside>
  );
}
