'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, MessageCircle, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import PackageCard from '@/components/PackageCard';
import { useTheme, CATEGORY_THEMES } from '@/contexts/ThemeContext';

/* ─── Category meta data ──────────────────────────────────────── */
const CATEGORY_META = {
  treks: {
    title: 'Adventure Treks', subtitle: 'Conquer peaks, cross rivers, breathe mountains.',
    description: 'From Himalayan giants to hidden valley trails — curated treks for every fitness level.',
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80',
    highlights: ['Expert Trek Leaders', 'Safety Gear Included', 'Scenic Campsites', 'All Fitness Levels'],
    badge: 'ADVENTURE',
    destinations: [
      { name: 'Kedarnath',      img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
      { name: 'Spiti Valley',   img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
      { name: 'Hampta Pass',    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80' },
      { name: 'Chadar Trek',    img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80' },
      { name: 'Roopkund',       img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80' },
      { name: 'Valley of Flowers', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80' },
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrival & Base Camp', icon: '🏕️', desc: 'Reach the starting point, meet your trek leader, gear check and acclimatization walk. Overnight at base camp.' },
      { day: 'Day 2', title: 'Trail Begins', icon: '🥾', desc: 'Early morning start. Trek through dense forests and meadows. Lunch by a mountain stream. Camp at altitude.' },
      { day: 'Day 3', title: 'High Altitude Push', icon: '⛰️', desc: 'The most challenging day. Cross ridges and switchbacks. Stunning panoramic views at the top. Bonfire night.' },
      { day: 'Day 4', title: 'Summit & Descent', icon: '🏔️', desc: 'Early morning summit attempt. Celebrate at the top. Begin descent. Hot meal at base and stories shared.' },
      { day: 'Day 5', title: 'Departure', icon: '🚌', desc: 'Morning stretch, breakfast and final group photo. Drop-off at nearest town/railway station.' },
    ],
  },
  honeymoon: {
    title: 'Honeymoon Escapes', subtitle: 'Begin forever in the most beautiful places on Earth.',
    description: 'Handcrafted romantic getaways with private experiences, luxury stays and unforgettable moments.',
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80',
    highlights: ['Couples-Only Experiences', 'Candlelight Dinners', 'Private Villas', 'Surprise Arrangements'],
    badge: 'ROMANTIC',
    destinations: [
      { name: 'Maldives',   img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80' },
      { name: 'Bali',       img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
      { name: 'Kashmir',    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
      { name: 'Andaman',    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80' },
      { name: 'Coorg',      img: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80' },
      { name: 'Santorini',  img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80' },
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrival & Welcome', icon: '💐', desc: 'Airport pickup in a decorated car. Check-in to your private villa with rose petals and a champagne welcome.' },
      { day: 'Day 2', title: 'Explore Together', icon: '🗺️', desc: 'Private guided tour of local gems. Couples\' spa session in the afternoon. Sunset cocktails by the water.' },
      { day: 'Day 3', title: 'Beach & Leisure', icon: '🏖️', desc: 'Private beach access. Water sports if you wish. Candlelit dinner under the stars arranged exclusively for you.' },
      { day: 'Day 4', title: 'Surprise Day', icon: '🎁', desc: 'Our signature surprise experience — curated specifically for your partner\'s personality. A memory for a lifetime.' },
      { day: 'Day 5', title: 'Departure', icon: '✈️', desc: 'Leisurely breakfast in bed. Check-out with gift hamper. Transfer to airport with memories to last forever.' },
    ],
  },
  beaches: {
    title: 'Beach Getaways', subtitle: 'Sun, sand and the sound of waves.',
    description: 'India and beyond — pristine beaches, water sports, seafood and sunsets that steal your heart.',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80',
    highlights: ['Water Sports', 'Beachside Stays', 'Island Hopping', 'Sunset Cruises'],
    badge: 'COASTAL',
    destinations: [
      { name: 'Goa',          img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80' },
      { name: 'Andaman',      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80' },
      { name: 'Lakshadweep',  img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80' },
      { name: 'Pondicherry',  img: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=80' },
      { name: 'Gokarna',      img: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=600&q=80' },
      { name: 'Kerala',       img: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80' },
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrival & First Dip', icon: '🌊', desc: 'Land, freshen up and head straight to the beach. Evening seafood dinner at a shack with your feet in the sand.' },
      { day: 'Day 2', title: 'Water Sports Day', icon: '🤿', desc: 'Scuba diving, snorkelling, parasailing or kayaking — pick your adventure. Afternoon sunbathing and beach volleyball.' },
      { day: 'Day 3', title: 'Island Hopping', icon: '🏝️', desc: 'Morning boat trip to nearby islands. Explore, swim, and have a BBQ lunch on a secluded beach.' },
      { day: 'Day 4', title: 'Leisure & Local', icon: '🦞', desc: 'Local market in the morning. Afternoon spa or hammock time. Sunset cruise with cocktails.' },
      { day: 'Day 5', title: 'Departure', icon: '🐚', desc: 'One last swim. Breakfast with a view. Pack your sand and your memories and head back home.' },
    ],
  },
  offbeat: {
    title: 'Offbeat Destinations', subtitle: "Go where Google Maps hasn't been updated.",
    description: 'Hidden valleys, forgotten villages and roads less travelled. For the curious and the bold.',
    img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80',
    highlights: ['Unexplored Routes', 'Local Homestays', 'Authentic Culture', 'No Crowds'],
    badge: 'HIDDEN GEM',
    destinations: [
      { name: 'Ziro Valley',   img: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80' },
      { name: 'Chitkul',       img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
      { name: 'Tawang',        img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80' },
      { name: 'Chopta',        img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80' },
      { name: 'Majuli Island', img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80' },
      { name: 'Dzukou Valley', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80' },
    ],
    itinerary: [
      { day: 'Day 1', title: 'Journey Begins', icon: '🛤️', desc: 'The drive itself is the destination. Winding roads through untouched landscapes. Arrive at a local homestay.' },
      { day: 'Day 2', title: 'Village Walk', icon: '🏘️', desc: 'Morning walk through local villages. Chat with residents. Experience daily life that most tourists never see.' },
      { day: 'Day 3', title: 'Nature & Solitude', icon: '🌿', desc: 'A full day in nature — no phones, no noise. Guided nature walk, bird spotting and a picnic in the wild.' },
      { day: 'Day 4', title: 'Cultural Immersion', icon: '🎭', desc: 'Local festival, craft workshop or cooking class. Evening bonfire with folk stories from your host family.' },
      { day: 'Day 5', title: 'Back to the World', icon: '🌍', desc: 'Reluctant goodbyes. The journey home with a changed perspective and a full camera roll.' },
    ],
  },
  wildlife: {
    title: 'Wildlife Safaris', subtitle: 'Into the wild, where every moment is a story.',
    description: "Experience India's magnificent wildlife in their natural habitat — tigers, elephants, and more.",
    img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=80',
    highlights: ['Expert Naturalists', 'Jeep Safaris', 'Best National Parks', 'Ethical Wildlife Tourism'],
    badge: 'SAFARI',
    destinations: [
      { name: 'Jim Corbett',  img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80' },
      { name: 'Ranthambore', img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80' },
      { name: 'Kaziranga',   img: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80' },
      { name: 'Bandipur',    img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80' },
      { name: 'Sundarbans',  img: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80' },
      { name: 'Pench',       img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80' },
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrival at the Wild', icon: '🌳', desc: 'Check in to your jungle lodge. Briefing by your expert naturalist. Evening nature walk around the resort.' },
      { day: 'Day 2', title: 'Morning Safari', icon: '🐯', desc: 'Pre-dawn jeep safari into the core zone. Peak tiger activity hours. Breakfast back at camp with stories.' },
      { day: 'Day 3', title: 'Zone Explorer', icon: '🦌', desc: 'Different zone safari — elephants, leopards and diverse birdlife. Afternoon nature documentary screening.' },
      { day: 'Day 4', title: 'Canoe & Walk Safari', icon: '🚣', desc: 'River safari by canoe (where available) or walking safari with armed guard. Sunset from a watchtower.' },
      { day: 'Day 5', title: 'Departure', icon: '🌅', desc: 'One last morning safari. Depart with tiger sighting stories and a new respect for the wild.' },
    ],
  },
  heritage: {
    title: 'Heritage & Culture', subtitle: 'Walk through history. Feel the soul of India.',
    description: "Forts, temples, ancient bazaars and living traditions — India's glorious past comes alive.",
    img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=80',
    highlights: ['UNESCO Sites', 'Expert Local Guides', 'Cultural Workshops', 'Heritage Hotels'],
    badge: 'CULTURAL',
    destinations: [
      { name: 'Rajasthan', img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80' },
      { name: 'Hampi',     img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80' },
      { name: 'Varanasi',  img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80' },
      { name: 'Khajuraho', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
      { name: 'Madurai',   img: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=80' },
      { name: 'Agra',      img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
    ],
    itinerary: [
      { day: 'Day 1', title: 'Step Back in Time', icon: '🏰', desc: 'Arrive and check into a heritage haveli. Evening guided walk through the old city lanes with local storyteller.' },
      { day: 'Day 2', title: 'Forts & Palaces', icon: '👑', desc: 'Full day at UNESCO heritage sites with an expert historian guide. Stories behind every stone.' },
      { day: 'Day 3', title: 'Living Traditions', icon: '🎨', desc: 'Morning cooking class or craft workshop. Afternoon at the weekly local market — textiles, spices, antiques.' },
      { day: 'Day 4', title: 'Spiritual Morning', icon: '🕌', desc: 'Sunrise at the most sacred local site. Temple run, aarti ceremony and a traditional breakfast.' },
      { day: 'Day 5', title: 'Departure', icon: '📜', desc: 'Final museum visit or souvenir shopping. Depart with a deeper understanding of India\'s incredible heritage.' },
    ],
  },
  womens: {
    title: "Women's Only Trips", subtitle: 'Travel freely. Travel safely. Travel together.',
    description: 'Safe, curated group trips designed exclusively for women — solo travelers welcome and celebrated.',
    img: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1600&q=80',
    highlights: ['Women-Led Groups', 'Verified Safe Stays', 'Bonding Activities', 'Solo-Friendly'],
    badge: 'EXCLUSIVE',
    destinations: [
      { name: 'Spiti Valley', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
      { name: 'Rajasthan',    img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80' },
      { name: 'Bali',         img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
      { name: 'Ladakh',       img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80' },
      { name: 'Coorg',        img: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80' },
      { name: 'Sri Lanka',    img: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80' },
    ],
    itinerary: [
      { day: 'Day 1', title: 'Meet Your Tribe', icon: '👯', desc: 'Airport pickup and introductions. Icebreaker dinner where strangers become friends. Safety briefing by your women trip leader.' },
      { day: 'Day 2', title: 'Explore & Discover', icon: '🗺️', desc: 'First full day of adventures together. Group activities curated to build bonds while exploring local gems.' },
      { day: 'Day 3', title: 'Empowerment Day', icon: '💪', desc: 'A special activity unique to our women\'s trips — cooking class with local women, craft workshop or wellness session.' },
      { day: 'Day 4', title: 'Free & Fearless', icon: '🌸', desc: 'Semi-free day. Explore at your own pace with your new friends. Option for solo walks, journaling or spa.' },
      { day: 'Day 5', title: 'Until Next Time', icon: '🤝', desc: 'Final group breakfast. Exchange numbers. You came as strangers, you leave as a sisterhood.' },
    ],
  },
  weekend: {
    title: 'Weekend Escapes', subtitle: 'Two days. Infinite memories.',
    description: 'Quick getaways from your city — perfectly packed for the weekend warrior with a wandering soul.',
    img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80',
    highlights: ['Friday Night Departure', 'Back by Monday', 'Curated Itinerary', 'Group & Solo Options'],
    badge: 'QUICK TRIP',
    destinations: [
      { name: 'Rishikesh',   img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80' },
      { name: 'Manali',      img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80' },
      { name: 'Coorg',       img: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80' },
      { name: 'Bir Billing', img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80' },
      { name: 'Lansdowne',   img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80' },
      { name: 'Kasol',       img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
    ],
    itinerary: [
      { day: 'Fri Night', title: 'Depart After Work', icon: '🚌', desc: 'Board your overnight bus/train after office. No leaves needed. Sleep on the way and wake up at the destination.' },
      { day: 'Saturday', title: 'Full Adventure Day', icon: '⚡', desc: 'Packed day — trekking, rafting, sightseeing or chilling. Every minute planned so you don\'t waste a second.' },
      { day: 'Sunday', title: 'Explore & Head Back', icon: '🌄', desc: 'Morning activity, local breakfast, last-minute exploring. Depart by afternoon. Back home Sunday night.' },
    ],
  },
};

/* ─── Destination Cards (horizontal parallax scroll) ─────────── */
function DestinationCards({ destinations, catTheme }) {
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({});

  const handleMouseMove = (e, idx) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    setMousePos(prev => ({ ...prev, [idx]: { x, y } }));
  };

  return (
    <section style={{ padding: '60px 0 40px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '28px' }}>
          <h2 style={{
            fontSize: '26px', fontWeight: 700, color: '#1a1a1a',
            fontFamily: "'Poppins', sans-serif", margin: 0,
          }}>Popular Destinations</h2>
          <span style={{ fontSize: '13px', color: '#9ca3af', fontFamily: "'Poppins', sans-serif" }}>scroll to explore →</span>
        </div>
      </div>

      {/* Scrollable row — full width with side padding fade */}
      <div style={{ position: 'relative' }}>
        {/* Left fade */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '60px', background: 'linear-gradient(to right, white, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        {/* Right fade */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '60px', background: 'linear-gradient(to left, white, transparent)', zIndex: 2, pointerEvents: 'none' }} />

        <div style={{
          display: 'flex', gap: '16px', overflowX: 'auto', padding: '12px 60px 24px',
          scrollbarWidth: 'none', msOverflowStyle: 'none',
        }}
        className="hide-scrollbar">
          {destinations.map((dest, i) => {
            const pos = mousePos[i] || { x: 0, y: 0 };
            const isHov = hovered === i;
            return (
              <div
                key={dest.name}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => { setHovered(null); setMousePos(prev => ({ ...prev, [i]: { x: 0, y: 0 } })); }}
                onMouseMove={e => handleMouseMove(e, i)}
                style={{
                  flexShrink: 0, width: '220px', height: '300px',
                  borderRadius: '20px', overflow: 'hidden',
                  position: 'relative', cursor: 'pointer',
                  transform: isHov ? 'translateY(-8px) scale(1.03)' : 'translateY(0) scale(1)',
                  transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                  boxShadow: isHov
                    ? `0 20px 48px rgba(0,0,0,0.22), 0 0 0 2px ${catTheme.primary}`
                    : '0 4px 16px rgba(0,0,0,0.12)',
                }}
              >
                {/* Image with parallax */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dest.img} alt={dest.name}
                  style={{
                    position: 'absolute', inset: '-12px',
                    width: 'calc(100% + 24px)', height: 'calc(100% + 24px)',
                    objectFit: 'cover', display: 'block',
                    transform: isHov ? `translate(${-pos.x}px, ${-pos.y}px) scale(1.08)` : 'translate(0,0) scale(1)',
                    transition: isHov ? 'transform 0.1s ease' : 'transform 0.5s ease',
                  }}
                />
                {/* Gradient */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: isHov
                    ? `linear-gradient(to top, ${catTheme.accent}ee 0%, rgba(0,0,0,0.1) 60%, transparent 100%)`
                    : 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 60%)',
                  transition: 'background 0.35s ease',
                }} />
                {/* Name */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 18px' }}>
                  {isHov && (
                    <div style={{
                      display: 'inline-block', background: catTheme.primary, color: '#fff',
                      fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em',
                      padding: '3px 10px', borderRadius: '999px', marginBottom: '6px',
                      fontFamily: "'Poppins', sans-serif",
                    }}>EXPLORE</div>
                  )}
                  <p style={{
                    color: '#fff', fontSize: '18px', fontWeight: 700,
                    fontFamily: "'Poppins', sans-serif", margin: 0, lineHeight: 1.2,
                  }}>{dest.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Itinerary Teaser ────────────────────────────────────────── */
function ItineraryTeaser({ itinerary, catTheme }) {
  const [openDay, setOpenDay] = useState(null);

  return (
    <section style={{ padding: '20px 0 60px', background: 'transparent' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#1a1a1a', fontFamily: "'Poppins', sans-serif", margin: '0 0 4px' }}>
              Sample Itinerary
            </h2>
            <p style={{ fontSize: '14px', color: '#9ca3af', fontFamily: "'Poppins', sans-serif", margin: 0 }}>
              A glimpse of what your trip could look like
            </p>
          </div>
          <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
          <div style={{
            background: catTheme.pill, color: catTheme.pillText,
            padding: '6px 14px', borderRadius: '999px',
            fontSize: '12px', fontWeight: 600, fontFamily: "'Poppins', sans-serif",
            whiteSpace: 'nowrap',
          }}>Customisable for you</div>
        </div>

        {/* Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {itinerary.map((item, i) => {
            const isOpen = openDay === i;
            const isLast = i === itinerary.length - 1;
            return (
              <div key={i} style={{ display: 'flex', gap: '0' }}>
                {/* Left: timeline */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '56px', flexShrink: 0 }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: isOpen ? catTheme.primary : catTheme.pill,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', flexShrink: 0,
                    transition: 'background 0.25s ease',
                    boxShadow: isOpen ? `0 0 0 4px ${catTheme.primary}33` : 'none',
                  }}>{item.icon}</div>
                  {!isLast && (
                    <div style={{ width: '2px', flex: 1, minHeight: '20px', background: isOpen ? catTheme.primary : '#e5e7eb', transition: 'background 0.25s ease' }} />
                  )}
                </div>

                {/* Right: content */}
                <div style={{ flex: 1, paddingBottom: isLast ? '0' : '4px', paddingLeft: '16px' }}>
                  <button
                    onClick={() => setOpenDay(isOpen ? null : i)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 20px', borderRadius: '14px',
                      background: isOpen ? catTheme.soft : 'transparent',
                      border: `1px solid ${isOpen ? catTheme.primary + '44' : 'transparent'}`,
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = catTheme.soft; }}
                    onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{
                        fontSize: '11px', fontWeight: 700, color: catTheme.pillText,
                        fontFamily: "'Poppins', sans-serif", letterSpacing: '0.08em',
                        background: catTheme.pill, padding: '3px 10px', borderRadius: '999px',
                        whiteSpace: 'nowrap',
                      }}>{item.day}</span>
                      <span style={{
                        fontSize: '15px', fontWeight: 600, color: '#1a1a1a',
                        fontFamily: "'Poppins', sans-serif",
                      }}>{item.title}</span>
                    </div>
                    <div style={{ color: catTheme.primary, flexShrink: 0 }}>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  {/* Expanded content */}
                  {isOpen && (
                    <div style={{
                      padding: '12px 20px 20px',
                      animation: 'expandIn 0.2s ease',
                    }}>
                      <p style={{
                        fontSize: '14px', color: '#6b7280', lineHeight: 1.75,
                        fontFamily: "'Poppins', sans-serif", margin: 0,
                      }}>{item.desc}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: '32px', padding: '24px 28px',
          borderRadius: '20px', background: catTheme.soft,
          border: `1px solid ${catTheme.primary}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '16px',
        }}>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a1a', fontFamily: "'Poppins', sans-serif", margin: '0 0 4px' }}>
              Want a custom itinerary?
            </p>
            <p style={{ fontSize: '13px', color: '#9ca3af', fontFamily: "'Poppins', sans-serif", margin: 0 }}>
              Tell us your dates, group size and budget — we'll build it for you.
            </p>
          </div>
          <a href="https://wa.me/916396464369?text=Hi! I want a custom itinerary."
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: catTheme.primary, color: '#fff',
              padding: '12px 24px', borderRadius: '999px',
              textDecoration: 'none', fontWeight: 600, fontSize: '14px',
              fontFamily: "'Poppins', sans-serif", whiteSpace: 'nowrap',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            <MessageCircle size={16} /> Plan My Trip
          </a>
        </div>
      </div>

      <style>{`
        @keyframes expandIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}

// Maps theme category keys → actual DB query params
const CATEGORY_QUERY_MAP = {
  treks:     { vibe: 'Treks' },
  honeymoon: { search: 'honeymoon' },
  beaches:   { search: 'beach' },
  offbeat:   { search: 'offbeat' },
  wildlife:  { search: 'wildlife' },
  heritage:  { search: 'heritage' },
  womens:    { subtype: "Women's Only Group" },
  weekend:   { category: 'weekend' },
};

/* ─── Main packages content ───────────────────────────────────── */
function PackagesContent() {
  const searchParams = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('featured');
  const urlCategory = searchParams.get('category') || '';
  const { theme, applyTheme } = useTheme();

  useEffect(() => {
    if (urlCategory && CATEGORY_THEMES[urlCategory]) {
      applyTheme(urlCategory);
    } else {
      applyTheme('default');
    }
    return () => applyTheme('default');
  }, [urlCategory]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();

    // Map theme category to actual DB query
    const mapped = CATEGORY_QUERY_MAP[urlCategory];
    if (mapped) {
      Object.entries(mapped).forEach(([k, v]) => params.set(k, v));
    } else if (urlCategory) {
      params.set('category', urlCategory);
    }

    if (search) params.set('search', search);
    fetch(`/api/packages?${params}`)
      .then(r => r.json())
      .then(d => {
        let pkgs = d.packages || [];
        if (sort === 'price-asc') pkgs = [...pkgs].sort((a, b) => a.price_per_person - b.price_per_person);
        if (sort === 'price-desc') pkgs = [...pkgs].sort((a, b) => b.price_per_person - a.price_per_person);
        if (sort === 'duration') pkgs = [...pkgs].sort((a, b) => a.duration_days - b.duration_days);
        setPackages(pkgs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [urlCategory, search, sort]);

  const meta = CATEGORY_META[urlCategory];
  const catTheme = CATEGORY_THEMES[urlCategory] || CATEGORY_THEMES.default;

  return (
    <div style={{ background: theme.bg, transition: 'background 0.5s ease' }}>

      {/* ── HERO ── */}
      {meta ? (
        <section style={{ position: 'relative', minHeight: '520px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={meta.img} alt={meta.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.15) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${catTheme.accent}33 0%, transparent 60%)` }} />
          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '100px 40px 60px' }}>
            <div style={{ display: 'inline-block', marginBottom: '16px', background: catTheme.primary, color: '#fff', padding: '4px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', fontFamily: "'Poppins', sans-serif" }}>{meta.badge}</div>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, color: '#fff', fontFamily: "'Poppins', sans-serif", lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-1px' }}>{meta.title}</h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', fontFamily: "'Poppins', sans-serif", marginBottom: '12px', fontStyle: 'italic' }}>{meta.subtitle}</p>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', fontFamily: "'Poppins', sans-serif", maxWidth: '560px', lineHeight: 1.7, marginBottom: '36px' }}>{meta.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {meta.highlights.map(h => (
                <div key={h} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: `1px solid ${catTheme.primary}55`, borderRadius: '999px', padding: '8px 18px', fontSize: '13px', fontWeight: 600, color: '#fff', fontFamily: "'Poppins', sans-serif" }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: catTheme.primary, display: 'inline-block', flexShrink: 0 }} />
                  {h}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section style={{ position: 'relative', height: '260px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200" alt="Packages" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />
          <div style={{ position: 'relative', zIndex: 1, padding: '0 40px' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '8px', fontFamily: "'Poppins', sans-serif" }}>Home / Packages</p>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#fff', fontFamily: "'Poppins', sans-serif" }}>All Packages</h1>
          </div>
        </section>
      )}


      {/* ── PACKAGES ── */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 48px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a1a', fontFamily: "'Poppins', sans-serif", marginBottom: '6px' }}>
            {meta ? `${meta.title} Packages` : 'All Packages'}
          </h2>
          <div style={{ width: '40px', height: '3px', borderRadius: '2px', background: catTheme.primary }} />
        </div>

        {/* Search + Sort */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); }}
            style={{ display: 'flex', flex: 1, minWidth: '200px', borderRadius: '999px', overflow: 'hidden', border: '1.5px solid #e5e7eb', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="Search destinations..."
              style={{ flex: 1, padding: '12px 20px', fontSize: '14px', outline: 'none', border: 'none', background: 'transparent', fontFamily: "'Poppins', sans-serif" }} />
            <button type="submit" style={{ background: catTheme.primary, color: '#fff', border: 'none', padding: '12px 20px', cursor: 'pointer' }}>
              <Search size={17} />
            </button>
          </form>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ border: '1.5px solid #e5e7eb', borderRadius: '999px', padding: '12px 20px', fontSize: '14px', outline: 'none', color: '#374151', background: '#fff', fontFamily: "'Poppins', sans-serif", cursor: 'pointer' }}>
            <option value="featured">Sort: Popularity</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="duration">Duration</option>
          </select>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {[1,2,3,4,5,6].map(i => <div key={i} style={{ background: '#f3f4f6', borderRadius: '16px', height: '320px' }} className="animate-pulse" />)}
          </div>
        ) : packages.length > 0 ? (
          <>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '20px', fontFamily: "'Poppins', sans-serif" }}>{packages.length} package{packages.length !== 1 ? 's' : ''} found</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {packages.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🗺️</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px', fontFamily: "'Poppins', sans-serif" }}>No packages right now</h3>
            <p style={{ color: '#9ca3af', marginBottom: '28px', fontFamily: "'Poppins', sans-serif" }}>We're crafting the perfect trip. Contact us for a custom package!</p>
            <a href="https://wa.me/916396464369?text=Hi! I need a custom travel package." target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: catTheme.primary, color: '#fff', padding: '12px 28px', borderRadius: '999px', textDecoration: 'none', fontWeight: 600, fontSize: '14px', fontFamily: "'Poppins', sans-serif" }}>
              <MessageCircle size={18} /> WhatsApp Us
            </a>
          </div>
        )}
      </div>

    </div>
  );
}

export default function PackagesPage() {
  return (
    <Suspense fallback={
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '36px', height: '36px', border: '4px solid #e5e7eb', borderTopColor: '#5bc1d5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <PackagesContent />
    </Suspense>
  );
}
