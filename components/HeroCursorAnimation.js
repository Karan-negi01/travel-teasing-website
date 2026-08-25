'use client';
import { useEffect, useRef } from 'react';

const icons = [
  { id: 'plane1',  depth: 60,  x: 12,  y: 18, size: 54, rotate: 35,  delay: 0,    dur: 3.8, floatY: 14, opacity: 0.22,
    path: 'M58 10L6 28l14 6 6 16 8-12 12 4z M20 34l6 2-2 6',
    type: 'path' },
  { id: 'balloon', depth: 35,  x: 82,  y: 14, size: 64, rotate: 0,   delay: 0.3,  dur: 4.4, floatY: 10, opacity: 0.18,
    type: 'balloon' },
  { id: 'compass', depth: 80,  x: 88,  y: 52, size: 46, rotate: 15,  delay: 0.6,  dur: 3.5, floatY: 12, opacity: 0.18,
    type: 'compass' },
  { id: 'pin',     depth: 65,  x: 7,   y: 62, size: 36, rotate: -10, delay: 0.9,  dur: 4.1, floatY: 16, opacity: 0.24,
    path: 'M18 4C9.16 4 2 11.16 2 20c0 13.3 16 28 16 28S34 33.3 34 20C34 11.16 26.84 4 18 4z M18 25a5 5 0 1 1 0-10 5 5 0 0 1 0 10z',
    viewBox: '0 0 36 36', type: 'path' },
  { id: 'camera',  depth: 45,  x: 74,  y: 76, size: 50, rotate: -8,  delay: 1.2,  dur: 3.9, floatY: 11, opacity: 0.16,
    type: 'camera' },
  { id: 'luggage', depth: 70,  x: 20,  y: 80, size: 42, rotate: 5,   delay: 1.5,  dur: 4.2, floatY: 13, opacity: 0.17,
    type: 'luggage' },
  { id: 'plane2',  depth: 30,  x: 55,  y: 10, size: 34, rotate: 10,  delay: 1.8,  dur: 3.6, floatY: 9,  opacity: 0.15,
    path: 'M4 18L60 6l-10 12 10 12z M12 18l-5 8 5-2',
    type: 'path' },
  { id: 'globe',   depth: 25,  x: 44,  y: 84, size: 50, rotate: 0,   delay: 2.1,  dur: 5.0, floatY: 8,  opacity: 0.14,
    type: 'globe' },
];

function IconSVG({ icon }) {
  const s = icon.size;
  if (icon.type === 'path') {
    return (
      <svg width={s} height={s} viewBox={icon.viewBox || '0 0 64 64'} fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d={icon.path} fillOpacity="0.9" />
      </svg>
    );
  }
  if (icon.type === 'balloon') return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="24" rx="18" ry="20" fill="white" fillOpacity="0.85"/>
      <path d="M24 44h16l-2 8h-12z" fill="white" fillOpacity="0.65"/>
      <line x1="24" y1="44" x2="20" y2="44" stroke="white" strokeOpacity="0.5" strokeWidth="1.5"/>
      <line x1="40" y1="44" x2="44" y2="44" stroke="white" strokeOpacity="0.5" strokeWidth="1.5"/>
      <path d="M14 24 Q32 6 50 24" stroke="white" strokeOpacity="0.35" strokeWidth="1.2" fill="none"/>
      <path d="M14 24 Q32 42 50 24" stroke="white" strokeOpacity="0.35" strokeWidth="1.2" fill="none"/>
      <line x1="32" y1="4" x2="32" y2="44" stroke="white" strokeOpacity="0.3" strokeWidth="1"/>
    </svg>
  );
  if (icon.type === 'compass') return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="28" stroke="white" strokeOpacity="0.75" strokeWidth="2"/>
      <circle cx="32" cy="32" r="3" fill="white" fillOpacity="0.9"/>
      <polygon points="32,10 36,32 32,28 28,32" fill="white" fillOpacity="0.9"/>
      <polygon points="32,54 36,32 32,36 28,32" fill="white" fillOpacity="0.45"/>
      <text x="32" y="20" textAnchor="middle" fill="white" fillOpacity="0.6" fontSize="7" fontWeight="bold">N</text>
      <text x="32" y="50" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="7">S</text>
      <text x="52" y="34" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="7">E</text>
      <text x="12" y="34" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="7">W</text>
    </svg>
  );
  if (icon.type === 'camera') return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="18" width="52" height="36" rx="6" fill="white" fillOpacity="0.8"/>
      <circle cx="32" cy="36" r="12" stroke="white" strokeOpacity="0.9" strokeWidth="2.5" fill="none"/>
      <circle cx="32" cy="36" r="7" fill="white" fillOpacity="0.35"/>
      <rect x="22" y="10" width="20" height="10" rx="3" fill="white" fillOpacity="0.65"/>
      <circle cx="50" cy="26" r="3" fill="white" fillOpacity="0.55"/>
    </svg>
  );
  if (icon.type === 'luggage') return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="20" width="44" height="36" rx="5" fill="white" fillOpacity="0.8"/>
      <rect x="22" y="12" width="20" height="10" rx="4" stroke="white" strokeOpacity="0.75" strokeWidth="2" fill="none"/>
      <line x1="32" y1="20" x2="32" y2="56" stroke="white" strokeOpacity="0.3" strokeWidth="1.5"/>
      <line x1="10" y1="38" x2="54" y2="38" stroke="white" strokeOpacity="0.3" strokeWidth="1.5"/>
      <rect x="6" y="34" width="4" height="8" rx="2" fill="white" fillOpacity="0.55"/>
      <rect x="54" y="34" width="4" height="8" rx="2" fill="white" fillOpacity="0.55"/>
    </svg>
  );
  if (icon.type === 'globe') return (
    <svg width={s} height={s} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="26" stroke="white" strokeOpacity="0.75" strokeWidth="2"/>
      <ellipse cx="32" cy="32" rx="12" ry="26" stroke="white" strokeOpacity="0.45" strokeWidth="1.5"/>
      <line x1="6" y1="32" x2="58" y2="32" stroke="white" strokeOpacity="0.45" strokeWidth="1.5"/>
      <path d="M10 20 Q32 18 54 20" stroke="white" strokeOpacity="0.3" strokeWidth="1" fill="none"/>
      <path d="M10 44 Q32 46 54 44" stroke="white" strokeOpacity="0.3" strokeWidth="1" fill="none"/>
    </svg>
  );
  return null;
}

export default function HeroCursorAnimation() {
  const refs = useRef([]);
  const mouse = useRef({ x: 0, y: 0 });
  const current = useRef(icons.map(() => ({ x: 0, y: 0 })));
  const rafRef = useRef(null);

  useEffect(() => {
    const container = refs.current[0]?.closest('[data-hero-anim]');

    const onMove = (e) => {
      const rect = document.documentElement.getBoundingClientRect();
      mouse.current = {
        x: (e.clientX / window.innerWidth - 0.5),
        y: (e.clientY / window.innerHeight - 0.5),
      };
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      refs.current.forEach((el, i) => {
        if (!el) return;
        const icon = icons[i];
        const targetX = mouse.current.x * icon.depth;
        const targetY = mouse.current.y * icon.depth;
        current.current[i].x = lerp(current.current[i].x, targetX, 0.06);
        current.current[i].y = lerp(current.current[i].y, targetY, 0.06);
        el.style.transform = `rotate(${icon.rotate}deg) translate(${current.current[i].x}px, ${current.current[i].y}px)`;
      });
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes heroFloat {
          0%, 100% { margin-top: 0px; }
          50% { margin-top: var(--float-y); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; transform: scale(0.8) translateY(16px); }
          to   { opacity: var(--icon-opacity); transform: scale(1) translateY(0); }
        }
      `}</style>
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 6 }}>
        {icons.map((icon, i) => (
          <div
            key={icon.id}
            ref={el => refs.current[i] = el}
            style={{
              position: 'absolute',
              left: `${icon.x}%`,
              top: `${icon.y}%`,
              width: icon.size,
              height: icon.size,
              '--icon-opacity': icon.opacity,
              '--float-y': `-${icon.floatY}px`,
              animation: `heroFadeIn 1.2s ease forwards ${icon.delay}s, heroFloat ${icon.dur}s ease-in-out infinite ${icon.delay + 1.2}s`,
              opacity: 0,
              filter: 'drop-shadow(0 2px 12px rgba(91,193,213,0.3))',
              willChange: 'transform',
            }}
          >
            <IconSVG icon={icon} />
          </div>
        ))}
      </div>
    </>
  );
}
