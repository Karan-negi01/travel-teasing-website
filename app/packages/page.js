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

/* ─── Destination Cards ───────────────────────────────────────── */
function DestinationCards({ destinations, catTheme }) {
  const [hovered, setHovered] = useState(null);

  // Split into featured (first 2 big) + rest (4 small)
  const featured = destinations.slice(0, 2);
  const rest = destinations.slice(2);

  return (
    <section style={{ padding: '80px 0 0', background: '#0d0d0d' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 60px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '36px' }}>
          <div>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: catTheme.primary, fontFamily: "'Poppins', sans-serif", margin: '0 0 8px' }}>Where to go</p>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', fontFamily: "'Poppins', sans-serif", margin: 0, letterSpacing: '-0.5px' }}>Popular Destinations</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}>
            <MapPin size={12} color={catTheme.primary} />
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', fontFamily: "'Poppins', sans-serif" }}>{destinations.length} destinations</span>
          </div>
        </div>

        {/* Top row — 2 large cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          {featured.map((dest, i) => {
            const isHov = hovered === i;
            return (
              <div key={dest.name} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                style={{ height: '360px', borderRadius: '24px', overflow: 'hidden', position: 'relative', cursor: 'pointer', transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)', transform: isHov ? 'scale(1.015)' : 'scale(1)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dest.img} alt={dest.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: isHov ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.6s ease', filter: 'brightness(0.75)' }} />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)` }} />
                {isHov && <div style={{ position: 'absolute', inset: 0, background: `${catTheme.primary}18`, transition: 'opacity 0.3s' }} />}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <MapPin size={11} color={catTheme.primary} />
                    <span style={{ fontSize: '10px', fontWeight: 700, color: catTheme.primary, fontFamily: "'Poppins', sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase' }}>India</span>
                  </div>
                  <p style={{ color: '#fff', fontSize: '26px', fontWeight: 800, fontFamily: "'Poppins', sans-serif", margin: 0, letterSpacing: '-0.5px', lineHeight: 1.1 }}>{dest.name}</p>
                  <div style={{ marginTop: '14px', opacity: isHov ? 1 : 0, transform: isHov ? 'translateY(0)' : 'translateY(8px)', transition: 'all 0.3s ease' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: catTheme.primary, color: '#fff', fontSize: '11px', fontWeight: 700, padding: '7px 16px', borderRadius: '999px', fontFamily: "'Poppins', sans-serif", letterSpacing: '0.05em' }}>
                      Explore packages →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom row — 4 smaller cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', paddingBottom: '80px' }}>
          {rest.map((dest, i) => {
            const idx = i + 2;
            const isHov = hovered === idx;
            return (
              <div key={dest.name} onMouseEnter={() => setHovered(idx)} onMouseLeave={() => setHovered(null)}
                style={{ height: '220px', borderRadius: '20px', overflow: 'hidden', position: 'relative', cursor: 'pointer', transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)', transform: isHov ? 'scale(1.03)' : 'scale(1)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dest.img} alt={dest.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: isHov ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.6s ease', filter: 'brightness(0.75)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 60%)' }} />
                {isHov && <div style={{ position: 'absolute', inset: 0, border: `2px solid ${catTheme.primary}`, borderRadius: '20px' }} />}
                <div style={{ position: 'absolute', bottom: '18px', left: '18px', right: '18px' }}>
                  <p style={{ color: '#fff', fontSize: '16px', fontWeight: 700, fontFamily: "'Poppins', sans-serif", margin: 0, letterSpacing: '-0.2px' }}>{dest.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', opacity: isHov ? 1 : 0, transition: 'opacity 0.2s' }}>
                    <MapPin size={9} color={catTheme.primary} />
                    <span style={{ fontSize: '10px', color: catTheme.primary, fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>View trips →</span>
                  </div>
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
    <section style={{ padding: '72px 0 0', background: '#0d0d0d' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 60px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px' }}>
          <div>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: catTheme.primary, fontFamily: "'Poppins', sans-serif", margin: '0 0 8px' }}>Day by day</p>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#fff', fontFamily: "'Poppins', sans-serif", margin: 0, letterSpacing: '-0.5px' }}>Sample Itinerary</h2>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: catTheme.primary, background: `${catTheme.primary}18`, border: `1px solid ${catTheme.primary}33`, padding: '5px 14px', borderRadius: '999px', fontFamily: "'Poppins', sans-serif", whiteSpace: 'nowrap' }}>Fully customisable</span>
        </div>

        {/* Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {itinerary.map((item, i) => {
            const isOpen = openDay === i;
            const isLast = i === itinerary.length - 1;
            return (
              <div key={i} style={{ display: 'flex', gap: '0' }}>
                {/* Left dot + line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '52px', flexShrink: 0, paddingTop: '14px' }}>
                  <div style={{
                    width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0,
                    background: isOpen ? catTheme.primary : 'rgba(255,255,255,0.15)',
                    border: `2px solid ${isOpen ? catTheme.primary : 'rgba(255,255,255,0.2)'}`,
                    boxShadow: isOpen ? `0 0 0 4px ${catTheme.primary}25` : 'none',
                    transition: 'all 0.25s ease',
                  }} />
                  {!isLast && <div style={{ width: '1px', flex: 1, minHeight: '24px', background: isOpen ? `${catTheme.primary}50` : 'rgba(255,255,255,0.08)', transition: 'background 0.25s ease', marginTop: '6px' }} />}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingBottom: isLast ? '0' : '4px' }}>
                  <button onClick={() => setOpenDay(isOpen ? null : i)} style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 18px', borderRadius: '14px', border: `1px solid ${isOpen ? catTheme.primary + '30' : 'transparent'}`,
                    background: isOpen ? `${catTheme.primary}10` : 'transparent',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { if (!isOpen) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}}
                  onMouseLeave={e => { if (!isOpen) { e.currentTarget.style.background = 'transparent'; }}}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '18px' }}>{item.icon}</span>
                      <div>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: catTheme.primary, fontFamily: "'Poppins', sans-serif", letterSpacing: '0.08em', display: 'block' }}>{item.day}</span>
                        <span style={{ fontSize: '15px', fontWeight: 600, color: isOpen ? '#fff' : 'rgba(255,255,255,0.7)', fontFamily: "'Poppins', sans-serif", transition: 'color 0.2s' }}>{item.title}</span>
                      </div>
                    </div>
                    <div style={{ color: isOpen ? catTheme.primary : 'rgba(255,255,255,0.2)', flexShrink: 0, transition: 'color 0.2s' }}>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '4px 18px 20px 48px', animation: 'expandIn 0.2s ease' }}>
                      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontFamily: "'Poppins', sans-serif", margin: 0 }}>{item.desc}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div style={{
          margin: '56px 0 0', padding: '36px 40px',
          borderRadius: '24px',
          background: `linear-gradient(135deg, ${catTheme.primary}22 0%, ${catTheme.primary}08 100%)`,
          border: `1px solid ${catTheme.primary}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap',
        }}>
          <div>
            <p style={{ fontSize: '20px', fontWeight: 800, color: '#fff', fontFamily: "'Poppins', sans-serif", margin: '0 0 6px', letterSpacing: '-0.3px' }}>Want a custom itinerary?</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontFamily: "'Poppins', sans-serif", margin: 0 }}>Tell us your dates, group size and budget — we'll craft it for you.</p>
          </div>
          <a href="https://wa.me/916396464369?text=Hi! I want a custom itinerary." target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: catTheme.primary, color: '#fff', padding: '13px 28px', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', fontFamily: "'Poppins', sans-serif", whiteSpace: 'nowrap', boxShadow: `0 8px 28px ${catTheme.primary}50`, transition: 'transform 0.15s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <MessageCircle size={16} /> Plan My Trip
          </a>
        </div>
      </div>

      <style>{`
        @keyframes expandIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
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
  const { theme, applyTheme, darkMode } = useTheme();

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

  const c = {
    pageBg:      darkMode ? '#0d0d0d'                 : '#ffffff',
    cardBg:      darkMode ? '#181818'                 : '#f5f5f5',
    textPrimary: darkMode ? '#ffffff'                 : '#111111',
    textSub:     darkMode ? 'rgba(255,255,255,0.6)'   : 'rgba(0,0,0,0.62)',
    textMuted:   darkMode ? 'rgba(255,255,255,0.4)'   : 'rgba(0,0,0,0.42)',
    textLabel:   darkMode ? 'rgba(255,255,255,0.35)'  : 'rgba(0,0,0,0.38)',
    border:      darkMode ? 'rgba(255,255,255,0.08)'  : 'rgba(0,0,0,0.1)',
    surface:     darkMode ? 'rgba(255,255,255,0.04)'  : 'rgba(0,0,0,0.04)',
    inputBg:     darkMode ? 'rgba(255,255,255,0.05)'  : 'rgba(0,0,0,0.05)',
    inputBorder: darkMode ? 'rgba(255,255,255,0.1)'   : 'rgba(0,0,0,0.12)',
    inputColor:  darkMode ? '#ffffff'                 : '#111111',
    selectBg:    darkMode ? 'rgba(255,255,255,0.05)'  : 'rgba(0,0,0,0.05)',
    emptyBg:     darkMode ? 'rgba(255,255,255,0.03)'  : 'rgba(0,0,0,0.03)',
    emptyBorder: darkMode ? 'rgba(255,255,255,0.07)'  : 'rgba(0,0,0,0.08)',
  };

  return (
    <div style={{ background: c.pageBg, minHeight: '100vh' }}>

      {/* ── HERO ── */}
      {meta ? (
        <section style={{ position: 'relative', height: '100vh', minHeight: '600px', maxHeight: '820px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={meta.img} alt={meta.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          {/* Dark gradient bottom-heavy */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.1) 100%)' }} />
          {/* Color tint from left */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(120deg, ${catTheme.accent}55 0%, transparent 55%)` }} />

          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '0 60px 70px' }}>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '20px', background: `${catTheme.primary}22`, border: `1px solid ${catTheme.primary}66`, color: catTheme.primary, padding: '5px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', fontFamily: "'Poppins', sans-serif", backdropFilter: 'blur(8px)' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: catTheme.primary, display: 'inline-block' }} />
              {meta.badge}
            </div>

            {/* Title */}
            <h1 style={{ fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 900, color: '#fff', fontFamily: "'Poppins', sans-serif", lineHeight: 1.0, marginBottom: '18px', letterSpacing: '-2px' }}>{meta.title}</h1>
            <p style={{ fontSize: 'clamp(15px, 1.8vw, 20px)', color: 'rgba(255,255,255,0.65)', fontFamily: "'Poppins', sans-serif", maxWidth: '600px', lineHeight: 1.65, marginBottom: '40px' }}>{meta.subtitle}</p>

            {/* Stats + highlights row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
              {/* Stats */}
              <div style={{ display: 'flex', gap: '28px' }}>
                {[['24+', 'Trips'], ['4.9★', 'Rating'], ['5K+', 'Travelers']].map(([val, lbl]) => (
                  <div key={lbl}>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff', fontFamily: "'Poppins', sans-serif", lineHeight: 1 }}>{val}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: "'Poppins', sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '3px' }}>{lbl}</div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.15)' }} />

              {/* Highlight pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {meta.highlights.map(h => (
                  <div key={h} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '999px', padding: '7px 16px', fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.85)', fontFamily: "'Poppins', sans-serif" }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: catTheme.primary, display: 'inline-block', flexShrink: 0 }} />
                    {h}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div style={{ position: 'absolute', bottom: '28px', right: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: 0.4 }}>
            <div style={{ width: '1px', height: '40px', background: '#fff' }} />
            <span style={{ fontSize: '9px', color: '#fff', letterSpacing: '0.15em', fontFamily: "'Poppins', sans-serif", writingMode: 'vertical-rl' }}>SCROLL</span>
          </div>
        </section>
      ) : (
        <section style={{ position: 'relative', height: '320px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80" alt="Packages" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 100%)' }} />
          <div style={{ position: 'relative', zIndex: 1, padding: '0 60px 48px', width: '100%' }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', marginBottom: '8px', fontFamily: "'Poppins', sans-serif", letterSpacing: '0.1em' }}>HOME / PACKAGES</p>
            <h1 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 800, color: '#fff', fontFamily: "'Poppins', sans-serif", letterSpacing: '-1px' }}>All Packages</h1>
          </div>
        </section>
      )}

      {/* ── DESTINATIONS SCROLL ── */}
      {meta && <DestinationCards destinations={meta.destinations} catTheme={catTheme} />}

      {/* ── PACKAGES SECTION ── */}
      <div style={{ background: c.pageBg, padding: '72px 0 80px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 60px' }}>

          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: catTheme.primary, fontFamily: "'Poppins', sans-serif", margin: '0 0 8px' }}>Our picks</p>
              <h2 style={{ fontSize: '32px', fontWeight: 800, color: c.textPrimary, fontFamily: "'Poppins', sans-serif", margin: 0, letterSpacing: '-0.5px' }}>
                {meta ? `${meta.title} Packages` : 'All Packages'}
              </h2>
            </div>

            {/* Search + Sort */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); }}
                style={{ display: 'flex', alignItems: 'center', border: `1px solid ${c.inputBorder}`, borderRadius: '12px', background: c.inputBg, overflow: 'hidden' }}>
                <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search destinations..."
                  style={{ flex: 1, padding: '10px 16px', fontSize: '13px', outline: 'none', border: 'none', background: 'transparent', fontFamily: "'Poppins', sans-serif", color: c.inputColor, width: '220px' }} />
                <button type="submit" style={{ background: catTheme.primary, color: '#fff', border: 'none', padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Search size={14} />
                </button>
              </form>
              <select value={sort} onChange={e => setSort(e.target.value)}
                style={{ border: `1px solid ${c.inputBorder}`, borderRadius: '12px', padding: '10px 14px', fontSize: '13px', outline: 'none', color: c.textSub, background: c.selectBg, fontFamily: "'Poppins', sans-serif", cursor: 'pointer' }}>
                <option value="featured">Popularity</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {[1,2,3,4,5,6].map(i => <div key={i} style={{ background: c.surface, borderRadius: '20px', height: '340px', animation: 'pulse 1.5s ease infinite' }} />)}
            </div>
          ) : packages.length > 0 ? (
            <>
              <p style={{ fontSize: '12px', color: c.textLabel, marginBottom: '32px', fontFamily: "'Poppins', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase' }}>{packages.length} package{packages.length !== 1 ? 's' : ''} found</p>

              {/* Featured first package — large horizontal card */}
              {urlCategory && (() => {
                const fp = packages[0];
                const fpImg = fp.cover_image || 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800';
                return (
                  <div style={{ display: 'flex', borderRadius: '24px', overflow: 'hidden', border: `1px solid ${c.border}`, background: c.cardBg, minHeight: '340px', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = c.inputBorder}
                    onMouseLeave={e => e.currentTarget.style.borderColor = c.border}
                    onClick={() => window.location.href = `/packages/${fp.slug}${urlCategory ? `?from=${urlCategory}` : ''}`}>
                    {/* Left: image */}
                    <div style={{ flex: '0 0 48%', position: 'relative', overflow: 'hidden' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={fpImg} alt={fp.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, transparent 60%, ${c.cardBg} 100%)` }} />
                      <div style={{ position: 'absolute', top: '20px', left: '20px', background: `${catTheme.primary}22`, border: `1px solid ${catTheme.primary}55`, color: catTheme.primary, fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', padding: '5px 12px', borderRadius: '999px', fontFamily: "'Poppins', sans-serif", backdropFilter: 'blur(8px)' }}>
                        ✦ FEATURED
                      </div>
                    </div>
                    {/* Right: details */}
                    <div style={{ flex: 1, padding: '44px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
                      <div>
                        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', color: catTheme.primary, textTransform: 'uppercase', fontFamily: "'Poppins', sans-serif", margin: '0 0 10px' }}>{meta?.title || ''}</p>
                        <h3 style={{ fontSize: '28px', fontWeight: 800, color: c.textPrimary, margin: 0, lineHeight: 1.2, fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.5px' }}>{fp.title}</h3>
                      </div>
                      {fp.description && (
                        <p style={{ color: c.textSub, fontSize: '14px', lineHeight: 1.75, fontFamily: "'Poppins', sans-serif", margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {fp.description}
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: '28px' }}>
                        {[
                          ['₹' + (fp.price_per_person?.toLocaleString('en-IN') || '—'), 'per person'],
                          [fp.duration_days ? `${fp.duration_nights || fp.duration_days - 1}N / ${fp.duration_days}D` : '—', 'duration'],
                          [fp.location || fp.state || '—', 'location'],
                        ].map(([val, lbl]) => (
                          <div key={lbl}>
                            <div style={{ fontSize: '17px', fontWeight: 700, color: c.textPrimary, fontFamily: "'Poppins', sans-serif" }}>{val}</div>
                            <div style={{ fontSize: '10px', color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Poppins', sans-serif", marginTop: '3px' }}>{lbl}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: catTheme.primary, color: '#fff', fontSize: '13px', fontWeight: 700, padding: '11px 24px', borderRadius: '999px', fontFamily: "'Poppins', sans-serif" }}>
                          View Package →
                        </div>
                        <a href={'https://wa.me/916396464369?text=' + encodeURIComponent('Hi! I\'m interested in ' + fp.title + '. Please share more details.')}
                          target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', border: `1px solid ${c.border}`, color: c.textSub, fontSize: '13px', fontWeight: 600, padding: '11px 20px', borderRadius: '999px', fontFamily: "'Poppins', sans-serif", textDecoration: 'none' }}>
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Remaining packages grid */}
              {(urlCategory ? packages.slice(1) : packages).length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                  {(urlCategory ? packages.slice(1) : packages).map(pkg => (
                    urlCategory
                      ? <PackageCard key={pkg.id} pkg={pkg} fromCategory={urlCategory} dark={darkMode} />
                      : <PackageCard key={pkg.id} pkg={pkg} dark={darkMode} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: c.emptyBg, borderRadius: '24px', border: `1px solid ${c.emptyBorder}` }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: `${catTheme.primary}20`, border: `1px solid ${catTheme.primary}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '28px' }}>{catTheme.emoji}</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: c.textPrimary, marginBottom: '8px', fontFamily: "'Poppins', sans-serif" }}>Packages coming soon</h3>
              <p style={{ color: c.textMuted, marginBottom: '32px', fontFamily: "'Poppins', sans-serif", fontSize: '14px', maxWidth: '320px', margin: '0 auto 32px', lineHeight: 1.7 }}>We're handpicking the best trips. Drop us a message for a custom package!</p>
              <a href="https://wa.me/916396464369?text=Hi! I need a custom travel package." target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: catTheme.primary, color: '#fff', padding: '13px 28px', borderRadius: '999px', textDecoration: 'none', fontWeight: 700, fontSize: '14px', fontFamily: "'Poppins', sans-serif", boxShadow: `0 8px 28px ${catTheme.primary}50` }}>
                <MessageCircle size={16} /> Chat on WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>


      <style>{`
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
        @keyframes heroFadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        @keyframes heroZoom { from { transform:scale(1.06); } to { transform:scale(1); } }
        @keyframes scrollBounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(6px); } }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); }
        ::-webkit-scrollbar-thumb { background: ${catTheme.primary}; border-radius: 999px; }
        ::-webkit-scrollbar-thumb:hover { background: ${catTheme.primary}cc; }
        * { scrollbar-width: thin; scrollbar-color: ${catTheme.primary} rgba(255,255,255,0.04); }
      `}</style>
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
