'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, Star, ChevronDown, ChevronLeft, ChevronRight,
  MessageCircle, Play, MapPin, Search, Volume2, VolumeX
} from 'lucide-react';
import PackageCard from './PackageCard';
import EnquiryModal from './EnquiryModal';
import InstagramIcon from './InstagramIcon';

/* ─── Static data ──────────────────────────────────────────────── */
const trustBadges = ['24×7 Support', '100% Personalised', '4.9+ Rated'];

const banners = [
  {
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1600&q=80',
    tag: 'Community Trips',
    title: 'Travel With Strangers,\nReturn With Friends',
    cta: 'Browse Group Trips',
    href: '/group-trips',
    gradient: 'from-black/70 via-black/30 to-transparent',
    align: 'left',
    ctaColor: 'bg-white text-[#1a1a1a] hover:bg-[#5bc1d5] hover:text-white',
    tagColor: 'text-[#5bc1d5]',
  },
  {
    image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=1600&q=80',
    tag: 'Sacred Journeys',
    title: 'Find Peace.\nFind Yourself.',
    cta: 'Explore Sacred Places',
    href: '/sacred-places',
    gradient: 'from-black/70 via-black/30 to-transparent',
    align: 'left',
    ctaColor: 'bg-white text-[#1a1a1a] hover:bg-[#fde047] hover:text-[#1a1a1a]',
    tagColor: 'text-[#fde047]',
  },
  {
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&q=80',
    tag: 'Top Destination 2025',
    title: 'Leh Ladakh &\nBike Trips 2025',
    cta: 'View Packages',
    href: '/packages?search=Ladakh',
    gradient: 'from-black/70 via-black/30 to-transparent',
    align: 'left',
    ctaColor: 'bg-[#5bc1d5] text-white hover:bg-[#4ab0c4]',
    tagColor: 'text-[#5bc1d5]',
  },
];

const worldDests = [
  { name: 'Bali',        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
  { name: 'Thailand',    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80' },
  { name: 'Vietnam',     image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80' },
  { name: 'Nepal',       image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80' },
  { name: 'Sri Lanka',   image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80' },
  { name: 'Europe',      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80' },
  { name: 'Japan',       image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80' },
  { name: 'Turkey',      image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&q=80' },
  { name: 'Dubai',       image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
  { name: 'Singapore',   image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80' },
  { name: 'Malaysia',    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&q=80' },
  { name: 'Maldives',    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80' },
  { name: 'Indonesia',   image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80' },
  { name: 'Cambodia',    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=80' },
  { name: 'Georgia',     image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=600&q=80' },
];

const domesticDests = [
  { name: 'Leh Ladakh',   image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80' },
  { name: 'Spiti Valley', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
  { name: 'Kashmir',      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
  { name: 'Himachal',     image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80' },
  { name: 'Uttarakhand',  image: 'https://images.unsplash.com/photo-1490623970972-ae8bb3da443e?w=600&q=80' },
  { name: 'Rajasthan',    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80' },
  { name: 'Varanasi',     image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80' },
  { name: 'Meghalaya',    image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80' },
  { name: 'Goa',          image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80' },
  { name: 'Kerala',       image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80' },
  { name: 'Sikkim',       image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=600&q=80' },
  { name: 'Andaman',      image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&q=80' },
  { name: 'Coorg',        image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600&q=80' },
  { name: 'Munnar',       image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80' },
];

const vibeVideos = [
  'https://assets.mixkit.co/videos/51500/51500-720.mp4',
  'https://assets.mixkit.co/videos/1214/1214-720.mp4',
  'https://assets.mixkit.co/videos/1197/1197-720.mp4',
  'https://assets.mixkit.co/videos/51501/51501-720.mp4',
  'https://assets.mixkit.co/videos/1191/1191-720.mp4',
  'https://assets.mixkit.co/videos/1170/1170-720.mp4',
];

const CATEGORY_STYLE = {
  'destination-guide': { bg: 'bg-teal-50',   text: 'text-teal-700',   label: 'Destination Guide' },
  'trek-report':       { bg: 'bg-orange-50',  text: 'text-orange-700', label: 'Trek Report' },
  'travel-tips':       { bg: 'bg-violet-50',  text: 'text-violet-700', label: 'Travel Tips' },
  'food-culture':      { bg: 'bg-rose-50',    text: 'text-rose-700',   label: 'Food & Culture' },
};

const staticBlogs = [
  { id: 'sb1', slug: 'best-time-to-visit-spiti-valley',    title: 'Best Time to Visit Spiti Valley: A Month-by-Month Guide',      category: 'destination-guide', cover_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', excerpt: 'Spiti Valley rewards different travelers in different seasons — frozen rivers, green meadows, or golden autumn. Here\'s how to pick yours.', read_time: '6 min' },
  { id: 'sb2', slug: 'solo-travel-in-ladakh',             title: 'Solo Travel in Ladakh: Everything You Need to Know',           category: 'trek-report',       cover_image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80', excerpt: 'From altitude sickness hacks to the best hidden campsites — the real insider guide to going alone in the mountains.',                       read_time: '8 min' },
  { id: 'sb3', slug: 'kashmir-great-lakes-trek-diary',    title: 'Kashmir Great Lakes Trek: A First-Timer\'s Diary',             category: 'trek-report',       cover_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', excerpt: 'Seven pristine alpine lakes, endless meadows, and one sunrise that genuinely changed the way I think about travel.',                       read_time: '10 min' },
  { id: 'sb4', slug: 'bali-budget-travel-guide',          title: 'Bali on ₹60K: A Complete 10-Day Budget Itinerary',             category: 'travel-tips',       cover_image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', excerpt: 'Yes, Bali is genuinely affordable — if you know where to look. Here\'s our tried-and-tested plan used by 200+ travelers.',                read_time: '7 min' },
  { id: 'sb5', slug: 'meghalaya-hidden-waterfalls',       title: 'Meghalaya\'s Hidden Waterfalls: Off the Beaten Track',          category: 'destination-guide', cover_image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80', excerpt: 'Beyond Cherrapunji lie waterfalls so remote that most travelers never find them. We did. Here\'s the route.',                              read_time: '5 min' },
  { id: 'sb6', slug: 'women-solo-travel-india-tips',      title: 'Women Traveling Solo in India: Tips from Our Community',        category: 'travel-tips',       cover_image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80', excerpt: 'Safety, confidence, and freedom — 50+ women in our community share what actually helped them travel alone.',                              read_time: '9 min' },
];

const faqItems = [
  { q: 'What makes your trips different from regular group tours?', a: 'We curate experiences with verified local partners, transparent pricing, and 24×7 support. Every itinerary is crafted by people who have actually traveled there — not just planned on paper.' },
  { q: 'Can I join solo and still feel included?', a: 'Absolutely! Most of our travelers join solo. The group trip format makes it easy to connect, and many solo travelers leave with lifelong friends.' },
  { q: 'Who leads the trips?', a: 'Every trip has a dedicated captain — an experienced traveler who knows the destination inside-out and keeps the group safe, engaged and having fun.' },
  { q: 'Are your itineraries customisable?', a: 'Group trips follow a fixed itinerary. For private groups and families, we build fully custom itineraries around your preferences and budget.' },
  { q: 'What is your cancellation policy?', a: 'Flexible cancellations up to 15 days before departure with a full refund or credit note. Reach us on WhatsApp for specific details.' },
  { q: 'How do you ensure comfort for women travelers?', a: 'We have female captains on select trips, strict vetting of accommodations, and 24×7 emergency support. A large part of our community is women who travel solo with us.' },
];

const footerLinks = {
  Explore:        [['All Packages', '/packages'], ['Group Trips', '/group-trips'], ['Sacred Places', '/sacred-places'], ['Blog', '/blog'], ['Upcoming Trips', '/group-trips']],
  'About Us':     [['Our Story', '/about'], ['Who Travels With Us', '/about'], ['Testimonials', '/about'], ['Careers', '/contact']],
  Support:        [['Contact Us', '/contact'], ['WhatsApp Us', 'https://wa.me/916396464369'], ['FAQ', '/#faq']],
  'Terms & Info': [['Privacy Policy', '/privacy-policy'], ['Terms of Service', '/terms'], ['Cancellation Policy', '/terms']],
};

/* ─── Vibe Video Card ──────────────────────────────────────────── */
function VibeVideoCard({ src }) {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <div className="flex-shrink-0 relative rounded-2xl overflow-hidden shadow-lg bg-black"
      style={{ width: '270px', height: '480px' }}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <button
        onClick={toggleMute}
        className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white z-10 hover:bg-black/70 transition-colors"
      >
        {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>
    </div>
  );
}

/* ─── Section Header — Playfair italic + regular, same as Recommended Trips ── */
function SectionHeader({ title, subtitle, action }) {
  // Only first word italic Playfair — keeps long headings consistent
  const words = title.trim().split(' ');
  const firstWord = words.shift();
  const rest = words.join(' ');
  return (
    <div className="relative flex flex-col items-center text-center mb-7">
      <h2 className="text-4xl font-semibold text-gray-800 md:text-5xl">
        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>{firstWord}</span>
        {rest && <span> {rest}</span>}
      </h2>
      {subtitle && <p className="text-gray-500 text-sm mt-2 max-w-lg leading-relaxed">{subtitle}</p>}
      {action && <div className="absolute right-0 top-0">{action}</div>}
    </div>
  );
}

/* ─── Destination Card ─────────────────────────────────────────── */
function DestCard({ name, image, href }) {
  return (
    <Link href={href}
      className="flex-shrink-0 snap-start group relative w-40 h-56 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Image src={image} alt={name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="160px" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white font-semibold text-base leading-tight">{name}</p>
      </div>
    </Link>
  );
}

/* ─── Carousel Nav ─────────────────────────────────────────────── */
function CarouselNav({ onLeft, onRight }) {
  return (
    <div className="flex gap-2">
      {[onLeft, onRight].map((fn, i) => (
        <button key={i} onClick={fn}
          className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-[#5bc1d5] hover:text-[#5bc1d5] transition-all shadow-sm">
          {i === 0 ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
        </button>
      ))}
    </div>
  );
}

/* ─── Promo Banner ─────────────────────────────────────────────── */
function PromoBanner({ b }) {
  const isRight = b.align === 'right';
  return (
    <div className="px-8 py-3 max-w-[1600px] mx-auto w-full">
      <Link href={b.href}
        className="group block relative w-full overflow-hidden rounded-2xl aspect-[2/1] sm:aspect-[3/1] lg:aspect-[4.5/1] shadow-md hover:shadow-xl transition-shadow duration-300">
        <Image src={b.image} alt={b.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="100vw" />
        <div className={`absolute inset-0 bg-gradient-to-${isRight ? 'l' : 'r'} ${b.gradient}`} />
        <div className={`absolute inset-0 flex flex-col justify-center ${isRight ? 'items-end pr-8 sm:pr-14 text-right' : 'items-start pl-8 sm:pl-14'}`}>
          <span className={`text-[11px] font-bold tracking-[0.15em] uppercase mb-2 ${b.tagColor}`}>{b.tag}</span>
          <h3 className="text-white text-xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4 whitespace-pre-line drop-shadow-sm">{b.title}</h3>
          <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm ${b.ctaColor}`}>
            {b.cta} <ArrowRight size={14} />
          </span>
        </div>
      </Link>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────── */
export default function HomepageClient() {
  const router = useRouter();
  const [packages, setPackages]         = useState([]);
  const [groupPackages, setGroupPackages] = useState([]);
  const [testimonials, setTestimonials]   = useState([]);
  const [blogs, setBlogs]               = useState([]);
  const [activeWorld, setActiveWorld]     = useState(7);
  const [activeDomestic, setActiveDomestic] = useState(6);
  const [enquiryOpen, setEnquiryOpen]   = useState(false);
  const [openFaq, setOpenFaq]           = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [carouselPage, setCarouselPage] = useState(0);
  const [heroSearch, setHeroSearch]     = useState('');

  const worldRef      = useRef(null);
  const domesticRef   = useRef(null);
  const upcomingRef   = useRef(null);
  const trackRef      = useRef(null);   // the flex track that slides
  const viewportRef   = useRef(null);   // overflow-x-hidden viewport

  // Slide track using transform — exact DeshVidesh behaviour
  const goToPage = (newPage) => {
    setCarouselPage(newPage);
    if (trackRef.current && viewportRef.current) {
      const vw = viewportRef.current.clientWidth;
      trackRef.current.style.transform = `translateX(-${newPage * vw}px)`;
    }
  };

  // Reset track on filter change
  const changeFilter = (filterId) => {
    setActiveFilter(filterId);
    setCarouselPage(0);
    if (trackRef.current) trackRef.current.style.transform = 'translateX(0px)';
  };

  useEffect(() => {
    fetch('/api/packages?featured=true').then(r => r.json()).then(d => setPackages(d.packages || []));
    fetch('/api/packages?category=group').then(r => r.json()).then(d => setGroupPackages((d.packages || []).slice(0, 8)));
    fetch('/api/testimonials').then(r => r.json()).then(d => setTestimonials(d.testimonials || []));
    fetch('/api/blogs').then(r => r.json()).then(d => {
      const api = (d.blogs || []).slice(0, 6);
      const apiSlugs = new Set(api.map(b => b.slug));
      const filled = [...api, ...staticBlogs.filter(b => !apiSlugs.has(b.slug))].slice(0, 6);
      setBlogs(filled);
    });
  }, []);

  const scroll = (ref, dir) => ref.current?.scrollBy({ left: dir * 200, behavior: 'smooth' });

  const priceFilters = [
    { id: 'all',    label: 'All Destinations' },
    { id: 'u50',    label: 'Under ₹50K' },
    { id: '50-150', label: '₹50K to ₹1.5L' },
    { id: '150+',   label: '₹1.5L to ₹5L' },
    { id: 'upcoming', label: 'All Upcoming Trips' },
  ];

  const filtered = (() => {
    if (activeFilter === 'all')     return packages;
    if (activeFilter === 'u50')     return packages.filter(p => (p.price_per_person || 0) < 50000);
    if (activeFilter === '50-150')  return packages.filter(p => { const pr = p.price_per_person || 0; return pr >= 50000 && pr < 150000; });
    if (activeFilter === '150+')    return packages.filter(p => (p.price_per_person || 0) >= 150000);
    if (activeFilter === 'upcoming') return packages;
    return packages;
  })();

  const CARDS_PER_PAGE = 4;
  const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
  const safePage = Math.min(carouselPage, totalPages - 1);

  return (
    <div className="flex flex-col">

      {/* ── HERO — full screen ── */}
      <div className="relative w-full h-screen overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover"
          poster="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1920&q=80">
          <source src="https://assets.mixkit.co/videos/4078/4078-720.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/4081/4081-720.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/4074/4074-720.mp4" type="video/mp4" />
        </video>

        {/* Gradient — lighter in center so video breathes */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/70" />

        {/* ── PREMIUM MINIMAL ── */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6 gap-8">

          {/* Heading block */}
          <div className="flex flex-col items-center gap-3">

            {/* Eyebrow — tiny, spaced */}
            <p className="text-white/40 text-[10px] font-semibold tracking-[0.5em] uppercase">
              India &nbsp;·&nbsp; Community Travel &nbsp;·&nbsp; Since 2019
            </p>

            {/* Main heading — outline + filled contrast */}
            <h1 className="leading-[0.9] tracking-[-2px]"
              style={{ fontSize: 'clamp(68px, 11vw, 140px)' }}>
              {/* "Travel" — outline style */}
              <span style={{
                WebkitTextStroke: '2px rgba(255,255,255,0.85)',
                color: 'transparent',
                fontWeight: 900,
              }}>Travel</span>
              {' '}
              {/* "Teasing" — solid white, heavier */}
              <span className="text-white font-black">Teasing</span>
            </h1>

            {/* Thin teal line — centered, under heading */}
            <div className="w-16 h-[2px] rounded-full bg-[#5bc1d5]" />

            {/* Tagline */}
            <p className="text-white/60 text-[15px] sm:text-lg font-light tracking-wide max-w-sm">
              Strangers today. &nbsp;<em className="not-italic text-white/80 font-normal">Legends tomorrow.</em>
            </p>
          </div>

          {/* Search */}
          <form onSubmit={e => { e.preventDefault(); if (heroSearch.trim()) router.push(`/packages?search=${encodeURIComponent(heroSearch.trim())}`); }}
            className="w-full max-w-md">
            <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-full shadow-[0_12px_60px_rgba(0,0,0,0.45)] pl-5 pr-1.5 py-1.5 gap-2">
              <MapPin size={15} className="text-[#5bc1d5] flex-shrink-0" />
              <input type="text" value={heroSearch} onChange={e => setHeroSearch(e.target.value)}
                placeholder="Where to?"
                className="flex-1 text-[14px] font-medium text-gray-700 placeholder:text-gray-400 outline-none bg-transparent py-2.5" />
              <button type="submit"
                className="bg-[#1a1a1a] hover:bg-[#5bc1d5] text-white text-[13px] font-bold px-5 py-3 rounded-full transition-all duration-200 flex-shrink-0">
                Search
              </button>
            </div>
            <div className="flex justify-center gap-4 mt-3.5">
              {['Ladakh', 'Bali', 'Kashmir', 'Spiti', 'Manali'].map(d => (
                <button key={d} type="button"
                  onClick={() => router.push(`/packages?search=${encodeURIComponent(d)}`)}
                  className="text-[11px] text-white/40 hover:text-white/80 transition-colors tracking-wide">
                  {d}
                </button>
              ))}
            </div>
          </form>

          {/* Stats — minimal inline */}
          <div className="flex items-center gap-6 text-[12px]">
            {[['10K+', 'Travelers'], ['4.9★', 'Rated'], ['150+', 'Destinations']].map(([val, label], i) => (
              <div key={label} className="flex items-center gap-4">
                {i > 0 && <span className="text-white/15 text-xs">|</span>}
                <div className="flex flex-col items-center gap-0">
                  <span className="text-white font-bold text-[15px]">{val}</span>
                  <span className="text-white/35 text-[10px] tracking-wider uppercase">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RECOMMENDED TRIPS ── */}
      <section className="relative bg-white py-12 md:py-16">
        <div className="mx-auto max-w-[1600px] px-4">

          {/* Heading — mb-8 text-center (exact DV) */}
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-semibold text-gray-800 md:text-5xl">
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>Recommended </span>
              <span>Trips</span>
            </h2>
            <p className="mt-4 text-base text-gray-600 md:text-lg">
              best suited for new explorers with a mix of popular and offbeat destinations
            </p>
          </div>

          {/* Filter tabs */}
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex flex-row scrollbar-hide items-center gap-3 overflow-x-scroll md:gap-4">
              {priceFilters.map(f => (
                <button key={f.id} onClick={() => changeFilter(f.id)}
                  className={`inline-flex whitespace-nowrap cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                    activeFilter === f.id
                      ? 'border-gray-800 bg-gray-800 text-white shadow-sm'
                      : 'border-neutral-200 bg-white text-neutral-700 shadow-sm hover:border-neutral-300 hover:text-neutral-900'
                  }`}>
                  {f.label}
                  {f.id === 'all' && <ChevronDown size={13} />}
                </button>
              ))}
            </div>
          </div>

          {/* ── CAROUSEL — exact DeshVidesh: overflow-x-hidden viewport + flex track that slides ── */}
          <div className="mt-6">
            {packages.length === 0 ? (
              /* Skeleton */
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {[1,2,3,4].map(i => (
                  <div key={i}>
                    <div className="h-[220px] md:h-80 bg-gray-100 rounded-2xl animate-pulse" />
                    <div className="py-2 space-y-3 mt-2">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                      <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                      <div className="h-5 bg-gray-100 rounded animate-pulse w-2/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Viewport clips overflow; track slides via transform */
              <div ref={viewportRef} className="overflow-x-hidden p-1">
                <div
                  ref={trackRef}
                  className="flex touch-pan-y gap-4 sm:gap-6"
                  style={{ transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
                >
                  {filtered.map(pkg => (
                    <div key={pkg.id}
                      className="flex-shrink-0 w-full
                                 md:w-[calc(50%-12px)]
                                 lg:w-[calc(33.333%-16px)]
                                 2xl:w-[calc(25%-18px)]">
                      <PackageCard pkg={pkg} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pagination — dots + Previous / Next */}
          {packages.length > 0 && (
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} onClick={() => goToPage(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === safePage ? 'w-5 h-2.5 bg-[#1a1a1a]' : 'w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300'
                    }`} />
                ))}
              </div>
              <div className="flex items-center gap-2 rounded-full px-4 py-2">
                <button
                  onClick={() => goToPage(Math.max(0, safePage - 1))}
                  disabled={safePage === 0}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft size={16} /> Previous
                </button>
                <button
                  onClick={() => goToPage(Math.min(totalPages - 1, safePage + 1))}
                  disabled={safePage === totalPages - 1}
                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* View All — exact DV pill style */}
          <div className="mt-8 flex justify-center">
            <Link href="/packages"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-neutral-300 hover:text-neutral-900">
              View All Packages <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BANNER 1 — Community Trips ── */}
      <PromoBanner b={banners[0]} />

      {/* ── EXPLORE DESTINATIONS (World + Domestic combined) ──────── */}
      <section className="py-12 bg-[#fafafa]">
        <div className="max-w-[1600px] mx-auto px-6">

          {/* Main section heading — Playfair style */}
          <SectionHeader title="Explore Destinations" subtitle="Handpicked places for every kind of traveler" />

          {/* ── International Gateways ── */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#5bc1d5] mb-1">Fly Away</p>
                <h3 className="text-2xl font-semibold text-gray-800 md:text-3xl">
                  <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>International </span>
                  <span>Gateways</span>
                </h3>
              </div>
              <CarouselNav onLeft={() => scroll(worldRef, -1)} onRight={() => scroll(worldRef, 1)} />
            </div>
            <div className="flex gap-2 h-[340px] overflow-x-auto scrollbar-hide">
              {worldDests.map((d, i) => {
                const isActive = activeWorld === i;
                return (
                  <Link key={d.name} href={`/packages?search=${d.name}`}
                    onMouseEnter={() => setActiveWorld(i)}
                    style={{ width: isActive ? '420px' : '88px', flexShrink: 0, transition: 'width 0.55s cubic-bezier(0.4,0,0.2,1)' }}
                    className="relative h-full rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl">
                    <Image src={d.image} alt={d.name} fill className="object-cover"
                      style={{ transform: isActive ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.5s ease' }} sizes="420px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    {/* Single element — rotates from vertical to horizontal */}
                    <div className="absolute inset-0">
                      <div style={{
                        position: 'absolute',
                        bottom: isActive ? '44px' : '50%',
                        left: isActive ? '20px' : '50%',
                        transform: isActive
                          ? 'translate(0, 0) rotate(0deg)'
                          : 'translate(-50%, 50%) rotate(-90deg)',
                        transition: 'all 0.55s cubic-bezier(0.4,0,0.2,1)',
                        transformOrigin: 'center center',
                        whiteSpace: 'nowrap',
                      }}>
                        <p style={{
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '14px',
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          textShadow: '0 2px 10px rgba(0,0,0,0.85)',
                        }}>{d.name}</p>
                      </div>
                      {/* Explore → fades in after rotation completes */}
                      <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '20px',
                        opacity: isActive ? 1 : 0,
                        transition: 'opacity 0.2s ease 0.4s',
                      }}>
                        <p style={{ color: '#5bc1d5', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>Explore →</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Domestic Getaways ── */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#5bc1d5] mb-1">Incredible India</p>
                <h3 className="text-2xl font-semibold text-gray-800 md:text-3xl">
                  <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>Domestic </span>
                  <span>Getaways</span>
                </h3>
              </div>
              <CarouselNav onLeft={() => scroll(domesticRef, -1)} onRight={() => scroll(domesticRef, 1)} />
            </div>
            <div className="flex gap-2 h-[340px] overflow-x-auto scrollbar-hide">
              {domesticDests.map((d, i) => {
                const isActive = activeDomestic === i;
                return (
                  <Link key={d.name} href={`/packages?search=${d.name}`}
                    onMouseEnter={() => setActiveDomestic(i)}
                    style={{ width: isActive ? '420px' : '88px', flexShrink: 0, transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)' }}
                    className="relative h-full rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl">
                    <Image src={d.image} alt={d.name} fill className="object-cover transition-transform duration-500" sizes="380px"
                      style={{ transform: isActive ? 'scale(1.05)' : 'scale(1)' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    {/* Single element — rotates from vertical to horizontal */}
                    <div className="absolute inset-0">
                      <div style={{
                        position: 'absolute',
                        bottom: isActive ? '44px' : '50%',
                        left: isActive ? '20px' : '50%',
                        transform: isActive
                          ? 'translate(0, 0) rotate(0deg)'
                          : 'translate(-50%, 50%) rotate(-90deg)',
                        transition: 'all 0.55s cubic-bezier(0.4,0,0.2,1)',
                        transformOrigin: 'center center',
                        whiteSpace: 'nowrap',
                      }}>
                        <p style={{
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '14px',
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          textShadow: '0 2px 10px rgba(0,0,0,0.85)',
                        }}>{d.name}</p>
                      </div>
                      {/* Explore → fades in after rotation completes */}
                      <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '20px',
                        opacity: isActive ? 1 : 0,
                        transition: 'opacity 0.2s ease 0.4s',
                      }}>
                        <p style={{ color: '#5bc1d5', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>Explore →</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ── BANNER 2 ─────────────────────────────────────────────── */}
      <PromoBanner b={banners[1]} />

      {/* ── BANNER 3 ─────────────────────────────────────────────── */}
      <PromoBanner b={banners[2]} />

      {/* ── UPCOMING COMMUNITY TRIPS ─────────────────────────────── */}
      <section className="py-10 px-8 bg-[#fafafa]">
        <div className="max-w-[1600px] mx-auto">
          <SectionHeader title="Upcoming Community Trips"
            subtitle="Fixed departures with confirmed dates — join now"
            action={<CarouselNav onLeft={() => scroll(upcomingRef, -1)} onRight={() => scroll(upcomingRef, 1)} />}
          />
          {groupPackages.length === 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3].map(i => (
                <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 bg-white">
                  <div className="h-48 bg-gray-100 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div ref={upcomingRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
              {groupPackages.map(pkg => (
                <div key={pkg.id} className="flex-shrink-0 snap-start w-[85vw] sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]">
                  <PackageCard pkg={pkg} />
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link href="/group-trips"
              className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-[#333] transition-all">
              View All Upcoming Trips <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRAVEL GUIDES ────────────────────────────────────────── */}
      <section className="py-12 bg-white">
        <div className="max-w-[1600px] mx-auto px-6">
          <SectionHeader title="Travel Guides & Stories"
            subtitle="Inspiration, trek reports and tips from our team"
            action={
              <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5bc1d5] border border-[#5bc1d5]/40 px-4 py-1.5 rounded-full hover:bg-[#5bc1d5] hover:text-white transition-all">
                View All <ArrowRight size={11} />
              </Link>
            }
          />
          <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-2 px-2">
            {blogs.map((b) => {
              const cat = CATEGORY_STYLE[b.category] || { bg: 'bg-gray-100', text: 'text-gray-600', label: (b.category || 'guide').replace(/-/g, ' ') };
              return (
                <Link key={b.id} href={`/blog/${b.slug}`}
                  className="group flex-shrink-0 flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                  style={{ width: '320px' }}>

                  {/* Image */}
                  <div className="relative overflow-hidden flex-shrink-0" style={{ height: '220px' }}>
                    <img
                      src={b.cover_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'}
                      alt={b.title}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'; }}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 px-4 py-4 gap-2">
                    <span className={`self-start text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${cat.bg} ${cat.text}`}>
                      {cat.label}
                    </span>
                    <h3 className="font-bold text-gray-900 text-[14px] leading-snug line-clamp-2 group-hover:text-[#5bc1d5] transition-colors">
                      {b.title}
                    </h3>
                    <p className="text-gray-400 text-[12px] leading-relaxed line-clamp-2 flex-1">{b.excerpt || ''}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                      <span className="text-[11px] text-gray-400 font-medium">{b.read_time ? `${b.read_time} read` : '5 min read'}</span>
                      <span className="text-[11px] font-semibold text-[#5bc1d5]">Read story →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section id="faq" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <SectionHeader title="Frequently Asked Questions"
            subtitle="Everything you need to know before you go"
          />
          <div className="mt-4">
            {faqItems.map((item, i) => (
              <div key={i}
                className={`border-b border-gray-100 transition-all duration-200 ${
                  openFaq === i ? 'border-l-4 border-l-[#5bc1d5] pl-4' : 'pl-0'
                }`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left group">
                  <div className="flex items-center gap-5">
                    <span className={`text-[13px] font-bold tabular-nums transition-colors flex-shrink-0 ${openFaq === i ? 'text-[#5bc1d5]' : 'text-gray-300 group-hover:text-[#5bc1d5]'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-[17px] font-semibold leading-snug transition-colors ${
                      openFaq === i ? 'text-[#5bc1d5]' : 'text-[#1a1a1a] group-hover:text-[#5bc1d5]'
                    }`}>
                      {item.q}
                    </span>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all duration-200 ${
                    openFaq === i
                      ? 'border-[#5bc1d5] bg-[#5bc1d5] text-white'
                      : 'border-gray-200 text-gray-400 group-hover:border-[#5bc1d5] group-hover:text-[#5bc1d5]'
                  }`}>
                    {openFaq === i
                      ? <span className="text-[20px] leading-none font-light mb-0.5">−</span>
                      : <span className="text-[20px] leading-none font-light mb-0.5">+</span>
                    }
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-60 pb-6' : 'max-h-0'}`}>
                  <p className="text-gray-500 text-[15px] leading-relaxed pl-11">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="py-10 px-8 bg-white">
          <div className="max-w-[1600px] mx-auto">
            <SectionHeader title="What Travelers Say" subtitle="Real trips. Real stories." align="center" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.slice(0, 3).map(t => (
                <div key={t.id} className="bg-[#fafafa] border border-gray-100 rounded-2xl p-5 flex flex-col gap-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-4 flex-1">"{t.review_text}"</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-[#5bc1d5]/15 flex items-center justify-center text-[#5bc1d5] font-bold text-sm flex-shrink-0">
                      {(t.name || 'T').charAt(0)}
                    </div>
                    <div>
                      <p className="text-[#1a1a1a] font-semibold text-sm">{t.name}</p>
                      <p className="text-gray-400 text-xs">{t.trip_destination} · {t.traveler_city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── VIBE WITH US ─────────────────────────────────────────── */}
      <section className="py-12 bg-[#fffdf7]">
        <div className="max-w-[1600px] mx-auto px-6">
          <SectionHeader title="Vibe with Us" subtitle="Real moments. Real vibes. From the road." />
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-2 px-2">
            {vibeVideos.map((src, i) => (
              <VibeVideoCard key={i} src={src} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ───────────────────────────────────────────── */}
      <section className="bg-[#1a1a1a] px-8 pt-14 pb-10 mt-2">
        <div className="max-w-[1600px] mx-auto">

          {/* CTA headline + buttons */}
          <div className="grid lg:grid-cols-2 gap-10 items-center pb-12 border-b border-white/10">
            <div>
              <p className="text-[#5bc1d5] text-xs font-bold tracking-[0.15em] uppercase mb-3">From Tourist To Traveller</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Memories are Waiting,<br />
                let's make them together!
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setEnquiryOpen(true)}
                className="flex-1 bg-[#5bc1d5] text-white py-3 px-6 rounded-full font-semibold text-sm hover:bg-[#4ab0c4] transition-colors shadow-lg shadow-[#5bc1d5]/20">
                Plan Your Trip
              </button>
              <a href="https://wa.me/916396464369?text=Hi! I want to plan a trip." target="_blank" rel="noopener noreferrer"
                className="flex-1 border border-white/20 text-white py-3 px-6 rounded-full font-semibold text-sm text-center hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                <MessageCircle size={15} /> WhatsApp Us
              </a>
            </div>
          </div>

          {/* Social + Footer nav */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pt-10">
            {/* Brand col */}
            <div className="col-span-2 md:col-span-1">
              <p className="text-white font-bold text-base mb-3">Travel Teasing</p>
              <p className="text-[#f2f2f2]/50 text-xs leading-relaxed mb-4">India's trusted travel partner for group trips, sacred journeys & adventure treks.</p>
              <div className="flex gap-3">
                <a href="https://youtube.com/@travelteasing" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#f2f2f2]/60 hover:text-[#5bc1d5] hover:bg-white/15 transition-all">
                  <Play size={13} />
                </a>
                <a href="https://instagram.com/travelteasing" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#f2f2f2]/60 hover:text-[#5bc1d5] hover:bg-white/15 transition-all">
                  <InstagramIcon size={13} />
                </a>
                <a href="https://wa.me/916396464369" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#f2f2f2]/60 hover:text-[#5bc1d5] hover:bg-white/15 transition-all">
                  <MessageCircle size={13} />
                </a>
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <h4 className="text-white font-semibold text-sm mb-3">{section}</h4>
                <ul className="space-y-2">
                  {links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-[#f2f2f2]/50 text-xs hover:text-[#5bc1d5] transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#f2f2f2]/30">
            <p>© {new Date().getFullYear()} Travel Teasing. All rights reserved.</p>
            <p>Made with ❤️ in India</p>
          </div>
        </div>
      </section>

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} enquiryType="general" />
    </div>
  );
}
