'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Sparkles, ArrowRight } from 'lucide-react';
import { CT, isFitPackage } from '@/lib/communityTrips';

// Shown on FIT package pages: start a trip on this package, or join one already forming.
export default function CommunityTripPrompt({ pkg, accent = '#5bc1d5', dark = false }) {
  const [trips, setTrips] = useState([]);
  const fit = isFitPackage(pkg);
  useEffect(() => {
    if (!fit || !pkg?.slug) return;
    fetch(`/api/community-trips?package_slug=${encodeURIComponent(pkg.slug)}&status=open&limit=5`).then(r => r.json()).then(d => setTrips(d.trips || [])).catch(() => {});
  }, [fit, pkg?.slug]);
  if (!fit) return null;

  const bg = dark ? 'rgba(255,255,255,0.04)' : '#f4fbfd';
  const border = dark ? 'rgba(255,255,255,0.1)' : '#d6eef3';
  const text = dark ? '#fff' : '#1a1a2e';
  const sub = dark ? 'rgba(255,255,255,0.65)' : '#5d6673';

  return (
    <div style={{ border: `1px solid ${border}`, background: bg, borderRadius: '16px', padding: '18px 20px', marginTop: '14px', fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <Sparkles size={15} color={accent} />
        <p style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: text, margin: 0 }}>{CT.label}</p>
      </div>
      <p style={{ fontSize: '14px', color: sub, margin: '0 0 12px', lineHeight: 1.55 }}>
        Travelling solo or short on company? Start a trip on this package, set your rules, and let other travellers request to join.
      </p>
      {trips.length > 0 && (
        <Link href={`${CT.base}?package=${encodeURIComponent(pkg.slug)}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: accent, fontWeight: 600, textDecoration: 'none', marginBottom: '12px' }}>
          <Users size={14} /> {trips.length} trip{trips.length > 1 ? 's' : ''} already forming on this package <ArrowRight size={13} />
        </Link>
      )}
      <Link href={`${CT.base}/new?package=${encodeURIComponent(pkg.slug)}`} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '11px', borderRadius: '10px',
        background: 'transparent', border: `1.5px solid ${accent}`, color: accent, fontWeight: 600, fontSize: '14px', textDecoration: 'none', boxSizing: 'border-box',
      }}>
        <Users size={15} /> Create a trip on this package
      </Link>
    </div>
  );
}
