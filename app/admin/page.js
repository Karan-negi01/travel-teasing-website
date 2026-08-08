'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, MessageSquare, Users, TrendingUp, ArrowRight, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ packages: 0, enquiries: 0, users: 0 });
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/packages').then(r => r.json()),
      fetch('/api/enquiries').then(r => r.json()),
    ]).then(([pkgs, enq]) => {
      setStats({
        packages: pkgs.packages?.length || 0,
        enquiries: (enq.enquiries || []).filter(e => e.status === 'new').length,
        users: 0,
      });
      setEnquiries((enq.enquiries || []).slice(0, 6));
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid #5bc1d5', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  const statCards = [
    { label: 'Total Packages', value: stats.packages, icon: Package, href: '/admin/packages', color: '#5bc1d5', bg: '#e8f8fb' },
    { label: 'New Enquiries', value: stats.enquiries, icon: MessageSquare, href: '/admin/enquiries', color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Total Users', value: stats.users, icon: Users, href: '/admin/users', color: '#8b5cf6', bg: '#ede9fe' },
    { label: 'Active Today', value: '—', icon: TrendingUp, href: '/admin/enquiries', color: '#10b981', bg: '#d1fae5' },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f1624', marginBottom: '4px' }}>Dashboard</h1>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>Welcome back — here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {statCards.map(s => (
          <Link key={s.label} href={s.href} style={{ textDecoration: 'none', background: '#fff', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid #f0f0f0', transition: 'box-shadow 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', background: s.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={18} color={s.color} />
              </div>
              <ArrowRight size={14} color="#d1d5db" />
            </div>
            <div>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#0f1624', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
        <Link href="/admin/packages/new" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #5bc1d5, #1f77a3)', borderRadius: '14px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>Quick Action</p>
            <p style={{ color: '#fff', fontSize: '16px', fontWeight: 700 }}>+ Add New Package</p>
          </div>
          <Package size={28} color="rgba(255,255,255,0.5)" />
        </Link>
        <Link href="/admin/enquiries" style={{ textDecoration: 'none', background: '#fff', borderRadius: '14px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #f0f0f0' }}>
          <div>
            <p style={{ color: '#6b7280', fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>Pending</p>
            <p style={{ color: '#0f1624', fontSize: '16px', fontWeight: 700 }}>Review Enquiries →</p>
          </div>
          <div style={{ background: '#fef3c7', borderRadius: '10px', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#f59e0b' }}>{stats.enquiries}</span>
          </div>
        </Link>
      </div>

      {/* Recent Enquiries */}
      <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={15} color="#6b7280" />
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#0f1624' }}>Recent Enquiries</h2>
          </div>
          <Link href="/admin/enquiries" style={{ fontSize: '13px', color: '#5bc1d5', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {['Name', 'Phone', 'Package', 'Type', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', color: '#9ca3af', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {enquiries.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}>No enquiries yet</td></tr>
              ) : enquiries.map((e, i) => (
                <tr key={e.id} style={{ borderTop: '1px solid #f5f5f5', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1a1a2e' }}>{e.name}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>{e.phone}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.package_title || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: '#e8f8fb', color: '#1f77a3', fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '20px', textTransform: 'capitalize' }}>{e.enquiry_type}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: e.status === 'new' ? '#d1fae5' : '#f3f4f6', color: e.status === 'new' ? '#059669' : '#6b7280', fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '20px' }}>{e.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#9ca3af', fontSize: '12px' }}>{new Date(e.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
