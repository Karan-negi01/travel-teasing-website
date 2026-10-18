'use client';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';

/*
  Shared primitives that reproduce the homepage / package-detail design language:
  Poppins UI type, one Playfair-italic word per section heading, near-black surfaces with
  hairline borders in dark mode, white-on-black pill buttons, uppercase tracked micro-labels.
*/

export function usePalette() {
  const { darkMode, theme } = useTheme();
  const d = darkMode;
  return {
    dark: d,
    accent: theme?.primary || '#5bc1d5',
    pageBg:   d ? '#0d0d0d' : '#ffffff',
    cardBg:   d ? '#181818' : '#ffffff',
    card2:    d ? '#111111' : '#fafafa',
    text:     d ? '#ffffff' : '#111111',
    sub:      d ? 'rgba(255,255,255,0.62)' : '#333333',
    muted:    d ? 'rgba(255,255,255,0.42)' : '#666666',
    faint:    d ? 'rgba(255,255,255,0.25)' : '#9a9a9a',
    label:    d ? 'rgba(255,255,255,0.45)' : '#555555',
    border:   d ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)',
    borderMid:d ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
    surface:  d ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    surfaceHov: d ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
    inputBg:  d ? 'rgba(255,255,255,0.06)' : '#ffffff',
    btnBg:    d ? '#ffffff' : '#1a1a1a',
    btnFg:    d ? '#0d0d0d' : '#ffffff',
    ok: '#4ade80', warn: '#fbbf24', bad: '#f87171',
    font: "'Poppins', sans-serif",
    serif: "'Playfair Display', serif",
  };
}

/* Section heading exactly like the homepage: italic serif first word(s) + regular rest, centered by default */
export function SectionTitle({ italic, rest, sub, align = 'center', size = 'lg', className = '' }) {
  const h = size === 'lg' ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl';
  return (
    <div className={`${align === 'center' ? 'text-center' : ''} ${className}`}>
      <h2 className={`${h} font-semibold text-gray-800`}>
        {italic && <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>{italic} </span>}
        <span>{rest}</span>
      </h2>
      {sub && <p className={`mt-3 text-sm md:text-base text-gray-800 tracking-wide ${align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>{sub}</p>}
    </div>
  );
}

/* Tiny uppercase tracked label (package detail: 11px / .14em) */
export function Eyebrow({ children, color, size = 11, style = {}, className = '' }) {
  const p = usePalette();
  return <p className={className} style={{ fontSize: size, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: color || p.label, margin: 0, fontFamily: p.font, ...style }}>{children}</p>;
}

/* Form label (package sidebar: 12px / .08em) */
export function FieldLabel({ children, htmlFor, right }) {
  const p = usePalette();
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
      <label htmlFor={htmlFor} style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: p.label, fontFamily: p.font }}>{children}</label>
      {right}
    </div>
  );
}

export function inputStyle(p, extra = {}) {
  return { width: '100%', border: `1px solid ${p.borderMid}`, borderRadius: 8, padding: '11px 14px', fontSize: 15, color: p.text, background: p.inputBg, fontFamily: p.font, outline: 'none', boxSizing: 'border-box', ...extra };
}

/* Homepage filter pill. active = solid (white in dark, charcoal in light) */
export function Pill({ active, children, onClick, href, className = '', small }) {
  const base = `inline-flex whitespace-nowrap items-center gap-2 rounded-full border font-medium transition ${small ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} ${active ? 'border-gray-800 bg-gray-800 text-white shadow-sm' : 'border-neutral-200 bg-white text-neutral-700 shadow-sm hover:border-neutral-300 hover:text-neutral-900'} ${className}`;
  if (href) return <Link href={href} className={base}>{children}</Link>;
  return <button type="button" onClick={onClick} className={base}>{children}</button>;
}

/* Buttons. primary = white pill on dark / black pill on light (PackageCard "Details"). accent = theme colour block (package "Book Now"). outline = hairline. */
export function Button({ variant = 'primary', href, onClick, children, disabled, type = 'button', full, size = 'md', style = {}, target, rel, className = '' }) {
  const p = usePalette();
  const pad = size === 'sm' ? '8px 16px' : size === 'lg' ? '14px 28px' : '11px 22px';
  const fs = size === 'sm' ? 13 : size === 'lg' ? 15 : 14;
  const variants = {
    primary: { background: p.btnBg, color: p.btnFg, border: `1px solid ${p.btnBg}`, borderRadius: 999 },
    outline: { background: 'transparent', color: p.sub, border: `1px solid ${p.borderMid}`, borderRadius: 999 },
    accent:  { background: p.accent, color: '#fff', border: `1px solid ${p.accent}`, borderRadius: 8 },
    danger:  { background: 'transparent', color: p.bad, border: `1px solid rgba(248,113,113,.4)`, borderRadius: 999 },
    ghost:   { background: p.surface, color: p.sub, border: `1px solid transparent`, borderRadius: 8 },
    whatsapp:{ background: '#25D366', color: '#fff', border: '1px solid #25D366', borderRadius: 8 },
  };
  const s = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: pad, fontSize: fs, fontWeight: 600, fontFamily: p.font, textDecoration: 'none', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, transition: 'opacity .2s, transform .2s, background .2s', width: full ? '100%' : undefined, boxSizing: 'border-box', ...variants[variant], ...style };
  if (href && !disabled) return <Link href={href} target={target} rel={rel} style={s} className={className}>{children}</Link>;
  return <button type={type} onClick={onClick} disabled={disabled} style={s} className={className}>{children}</button>;
}

/* Surface card: #181818 with hairline border in dark, white with soft border in light */
export function Card({ children, style = {}, className = '', pad = 24, radius = 16, as: Tag = 'div', ...rest }) {
  const p = usePalette();
  return <Tag className={className} style={{ background: p.cardBg, border: `1px solid ${p.border}`, borderRadius: radius, padding: pad, ...style }} {...rest}>{children}</Tag>;
}

/* Hero stat: bold value + tiny uppercase label (homepage hero / category hero) */
export function Stat({ value, label, light = true }) {
  return (
    <div>
      <p style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, color: light ? '#fff' : undefined, fontFamily: "'Poppins', sans-serif", fontVariantNumeric: 'tabular-nums' }}>{value}</p>
      <p style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: light ? 'rgba(255,255,255,.55)' : undefined, marginTop: 4, fontFamily: "'Poppins', sans-serif" }}>{label}</p>
    </div>
  );
}

/* Small status tag, uppercase tracked */
export function Tag({ children, tone = 'neutral', style = {} }) {
  const p = usePalette();
  const tones = {
    neutral: { bg: p.surface, fg: p.sub },
    accent:  { bg: `${p.accent}22`, fg: p.accent },
    ok:      { bg: 'rgba(74,222,128,.14)', fg: p.dark ? '#86efac' : '#15803d' },
    warn:    { bg: 'rgba(251,191,36,.14)', fg: p.dark ? '#fcd34d' : '#92400e' },
    bad:     { bg: 'rgba(248,113,113,.14)', fg: p.dark ? '#fca5a5' : '#b91c1c' },
    onImage: { bg: 'rgba(255,255,255,.92)', fg: '#0d0d0d' },
  };
  const t = tones[tone] || tones.neutral;
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '5px 10px', borderRadius: 999, background: t.bg, color: t.fg, fontFamily: p.font, whiteSpace: 'nowrap', ...style }}>{children}</span>;
}

/* Full-bleed photo hero like the category listing pages */
export function PageHero({ image, eyebrow, title, subtitle, stats = [], chips = [], right, minHeight = 460 }) {
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight, background: '#0a0a0a' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {image && <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.25) 40%, rgba(0,0,0,.85) 100%)' }} />
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-col justify-end" style={{ minHeight, paddingTop: 140, paddingBottom: 36 }}>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-3xl">
            {eyebrow && <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: '#5bc1d5', fontFamily: "'Poppins', sans-serif" }}>{eyebrow}</p>}
            <h1 className="text-white font-extrabold leading-[1.02]" style={{ fontSize: 'clamp(38px, 5.2vw, 72px)', fontFamily: "'DM Sans', 'Poppins', sans-serif", letterSpacing: '-0.01em' }}>{title}</h1>
            {subtitle && <p className="text-white/80 mt-4 text-base md:text-lg max-w-xl" style={{ fontFamily: "'Poppins', sans-serif" }}>{subtitle}</p>}
            {(stats.length > 0 || chips.length > 0) && (
              <div className="flex flex-wrap items-end gap-x-8 gap-y-4 mt-7">
                {stats.length > 0 && <div className="flex gap-7">{stats.map(s => <Stat key={s.label} value={s.value} label={s.label} />)}</div>}
                {chips.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {chips.map(c => <span key={c} className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium text-white/90" style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)', backdropFilter: 'blur(6px)', fontFamily: "'Poppins', sans-serif" }}><span className="w-1 h-1 rounded-full" style={{ background: '#5bc1d5' }} /> {c}</span>)}
                  </div>
                )}
              </div>
            )}
          </div>
          {right && <div className="flex-shrink-0">{right}</div>}
        </div>
      </div>
    </section>
  );
}

/* Thin progress bar in the accent colour */
export function Progress({ value, max, height = 3 }) {
  const p = usePalette();
  const pct = Math.min(100, Math.round(((value || 0) / Math.max(1, max || 1)) * 100));
  return <div style={{ width: '100%', height, borderRadius: 999, background: p.dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.08)', overflow: 'hidden' }}><div style={{ width: `${pct}%`, height: '100%', background: p.accent, transition: 'width .6s ease' }} /></div>;
}

/* Centered page spinner */
export function Spinner() {
  return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-[3px] border-[#5bc1d5] border-t-transparent rounded-full" /></div>;
}

/* Section heading inside detail pages: uppercase, tracked, like "ABOUT THE TRIP" */
export function BlockTitle({ children, right }) {
  const p = usePalette();
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
      <h3 style={{ fontSize: 20, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: p.text, margin: 0, fontFamily: p.font }}>{children}</h3>
      {right}
    </div>
  );
}
