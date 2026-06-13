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
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80',
    tag: 'Weekend Escapes',
    title: 'Two Days.\nInfinite Memories.',
    cta: 'View Weekend Trips',
    href: '/packages',
    gradient: 'from-black/70 via-black/30 to-transparent',
    align: 'left',
    ctaColor: 'bg-white text-[#1a1a1a] hover:bg-[#5bc1d5] hover:text-white',
    tagColor: 'text-[#5bc1d5]',
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

/* ─── Section Header — responsive: action below on mobile, absolute on sm+ ── */
function SectionHeader({ title, subtitle, action }) {
  const words = title.trim().split(' ');
  const firstWord = words.shift();
  const rest = words.join(' ');
  return (
    <div className="relative mb-7 text-center">
      {action && <div className="absolute right-0 top-0 hidden sm:block">{action}</div>}
      <h2 className="text-3xl font-semibold text-gray-800 sm:text-4xl md:text-5xl">
        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>{firstWord}</span>
        {rest && <span> {rest}</span>}
      </h2>
      {subtitle && <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto leading-relaxed">{subtitle}</p>}
      {action && <div className="mt-3 flex justify-center sm:hidden">{action}</div>}
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
    <div className="px-4 sm:px-8 py-3 max-w-[1600px] mx-auto w-full">
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

      {/* ── TRIP CATEGORIES ── */}
      <section className="py-12 bg-[#fafafa]">
        <div className="max-w-[1600px] mx-auto px-6">
          <SectionHeader title="Explore by Category" subtitle="Find the perfect trip for your travel style" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Group Trips',   tag: 'Community',  href: '/group-trips',               img: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=600&q=80' },
              { label: 'FIT Packages', tag: 'Personalised', href: '/packages?search=fit',     img: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&q=80' },
              { label: 'Family',        tag: 'Together',   href: '/packages?search=family',    img: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600&q=80' },
              { label: 'Treks',         tag: 'Adventure',  href: '/packages?search=trek',      img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80' },
              { label: "Women's Only",  tag: 'Exclusive',  href: '/packages?search=women',     img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80' },
              { label: 'Corporate',     tag: 'Offsite',    href: '/packages?search=corporate', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80' },
            ].map(cat => (
              <Link key={cat.label} href={cat.href}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <img src={cat.img} alt={cat.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-[#5bc1d5] mb-1">{cat.tag}</p>
                  <p className="text-white font-bold text-[15px] leading-tight">{cat.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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

          {/* Filter tabs + Prev/Next on same row */}
          <div className="mt-4 flex items-center justify-between gap-4">
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
            {packages.length > 0 && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => goToPage(Math.max(0, safePage - 1))}
                  disabled={safePage === 0}
                  className="flex items-center gap-1.5 rounded-full px-2.5 sm:px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-neutral-200 bg-white">
                  <ChevronLeft size={15} /> <span className="hidden sm:inline">Previous</span>
                </button>
                <button
                  onClick={() => goToPage(Math.min(totalPages - 1, safePage + 1))}
                  disabled={safePage === totalPages - 1}
                  className="flex items-center gap-1.5 rounded-full px-2.5 sm:px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-neutral-200 bg-white">
                  <span className="hidden sm:inline">Next</span> <ChevronRight size={15} />
                </button>
              </div>
            )}
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

          {/* Pagination dots */}
          {packages.length > 0 && (
            <div className="flex items-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => goToPage(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === safePage ? 'w-5 h-2.5 bg-[#1a1a1a]' : 'w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300'
                  }`} />
              ))}
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
                <h3 className="text-xl font-semibold text-gray-800 sm:text-2xl md:text-3xl">
                  <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>International </span>
                  <span>Gateways</span>
                </h3>
              </div>
              <CarouselNav onLeft={() => scroll(worldRef, -1)} onRight={() => scroll(worldRef, 1)} />
            </div>
            <div ref={worldRef} className="flex gap-2 h-[240px] sm:h-[340px] overflow-x-auto scrollbar-hide">
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
                <h3 className="text-xl font-semibold text-gray-800 sm:text-2xl md:text-3xl">
                  <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>Domestic </span>
                  <span>Getaways</span>
                </h3>
              </div>
              <CarouselNav onLeft={() => scroll(domesticRef, -1)} onRight={() => scroll(domesticRef, 1)} />
            </div>
            <div ref={domesticRef} className="flex gap-2 h-[240px] sm:h-[340px] overflow-x-auto scrollbar-hide">
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

      {/* ── WEEKEND ESCAPES ─────────────────────────────────────────── */}
      <section className="relative bg-white py-12 md:py-16">
        <div className="mx-auto max-w-[1600px] px-4">
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-semibold text-gray-800 md:text-5xl">
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>Weekend </span>
              <span>Escapes</span>
            </h2>
            <p className="mt-4 text-base text-gray-600 md:text-lg">
              Short on time? These quick getaways pack in all the fun
            </p>
          </div>
          {packages.length === 0 ? (
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
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {packages.slice(0, 8).map(pkg => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
          <div className="mt-8 flex justify-center">
            <Link href="/packages"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-neutral-300 hover:text-neutral-900">
              View All Weekend Trips <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BANNER 2 — Weekend Escapes ── */}
      <PromoBanner b={banners[1]} />

      {/* ── UPCOMING COMMUNITY TRIPS ─────────────────────────────── */}
      <section className="py-10 px-4 sm:px-8 bg-[#fafafa]">
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

      {/* ── VIBE WITH TRAVEL TEASING ─────────────────────────────── */}
      <section className="py-12 bg-[#fffdf7]">
        <div className="max-w-[1600px] mx-auto px-6">
          <SectionHeader title="Vibe with Travel Teasing" subtitle="Real moments. Real vibes. From the road." />
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-2 px-2">
            {vibeVideos.map((src, i) => (
              <VibeVideoCard key={i} src={src} />
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM MOMENTS ────────────────────────────────────── */}
      <section className="py-12 bg-white">
        <div className="max-w-[1600px] mx-auto px-6">
          <SectionHeader
            title="Instagram Moments"
            subtitle="Real trips. Real people. Real memories."
            action={
              <a href="https://instagram.com/travelteasing" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5bc1d5] border border-[#5bc1d5]/40 px-4 py-1.5 rounded-full hover:bg-[#5bc1d5] hover:text-white transition-all">
                Follow @travelteasing <ArrowRight size={11} />
              </a>
            }
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', likes: '2.4K', location: 'Kashmir' },
              { img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&q=80', likes: '1.8K', location: 'Ladakh' },
              { img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80', likes: '3.1K', location: 'Bali' },
              { img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', likes: '2.7K', location: 'Spiti' },
              { img: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&q=80', likes: '1.5K', location: 'Meghalaya' },
              { img: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=400&q=80', likes: '2.2K', location: 'Sikkim' },
              { img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80', likes: '1.9K', location: 'Rajasthan' },
              { img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80', likes: '4.2K', location: 'Himachal' },
              { img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80', likes: '2.0K', location: 'Goa' },
              { img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=80', likes: '1.6K', location: 'Kerala' },
              { img: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&q=80', likes: '3.4K', location: 'Thailand' },
              { img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80', likes: '2.8K', location: 'Maldives' },
            ].map((post, i) => (
              <a key={i} href="https://instagram.com/travelteasing" target="_blank" rel="noopener noreferrer"
                className="group relative aspect-square rounded-xl overflow-hidden">
                <img src={post.img} alt={post.location}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex flex-col items-center justify-center gap-1">
                  <span className="text-white font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">❤️ {post.likes}</span>
                  <span className="text-white/80 text-xs opacity-0 group-hover:opacity-100 transition-opacity">{post.location}</span>
                </div>
              </a>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <a href="https://instagram.com/travelteasing" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888] text-white px-7 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              Follow us on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* ── WHAT OUR TRAVEL TEASERS SAY ──────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="py-10 px-4 sm:px-8 bg-[#fafafa]">
          <div className="max-w-[1600px] mx-auto">
            <SectionHeader title="What our Travel Teasers say" subtitle="Real trips. Real stories." align="center" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.slice(0, 3).map(t => (
                <div key={t.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-3">
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

      {/* ── TRAVEL GUIDES & STORIES ───────────────────────────────── */}
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
                  <div className="relative overflow-hidden flex-shrink-0" style={{ height: '220px' }}>
                    <img
                      src={b.cover_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'}
                      alt={b.title}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'; }}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
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

      {/* ── BANNER 3 — Leh Ladakh ── */}
      <PromoBanner b={banners[2]} />

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section id="faq" className="py-16 bg-[#fafafa]">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Left: Colorful illustration + heading */}
            <div className="rounded-3xl bg-gradient-to-br from-[#e6f9fc] via-[#f0fbff] to-[#eef7f0] p-8 sm:p-10 flex flex-col justify-between min-h-[300px] sm:min-h-[500px] relative overflow-hidden">
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#5bc1d5] mb-5">Have Questions?</p>
                <h2 className="text-5xl sm:text-6xl font-black leading-[1.05] text-[#1a1a1a]">
                  Frequently<br />
                  Asked<br />
                  <span className="text-[#5bc1d5] underline decoration-[#5bc1d5]/40 underline-offset-4">Questions</span>
                </h2>
                <p className="text-gray-500 text-sm mt-6 leading-relaxed max-w-[260px]">
                  your questions matter — and together, we're solving them.
                </p>
              </div>
              {/* Decorative travel icons */}
              <div className="absolute bottom-0 right-0 pointer-events-none">
                <svg viewBox="0 0 240 240" className="w-56 h-56 opacity-75" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="70" y="105" width="100" height="80" rx="10" fill="#5bc1d5" opacity="0.25"/>
                  <rect x="87" y="93" width="66" height="16" rx="6" fill="#5bc1d5" opacity="0.35"/>
                  <line x1="120" y1="105" x2="120" y2="185" stroke="#5bc1d5" strokeWidth="2.5" opacity="0.5"/>
                  <line x1="70" y1="145" x2="170" y2="145" stroke="#5bc1d5" strokeWidth="2.5" opacity="0.5"/>
                  <rect x="108" y="175" width="24" height="12" rx="4" fill="#5bc1d5" opacity="0.4"/>
                  <rect x="18" y="42" width="60" height="46" rx="8" fill="#f97316" opacity="0.3"/>
                  <circle cx="48" cy="65" r="13" fill="#f97316" opacity="0.5"/>
                  <circle cx="48" cy="65" r="7" fill="#f97316" opacity="0.7"/>
                  <rect x="45" y="30" width="20" height="14" rx="4" fill="#f97316" opacity="0.35"/>
                  <circle cx="68" cy="52" r="4" fill="#f97316" opacity="0.6"/>
                  <path d="M155 18 L210 58 L188 65 L175 95 L162 85 L176 60 L138 68 Z" fill="#a78bfa" opacity="0.4"/>
                  <circle cx="28" cy="165" r="18" fill="#fbbf24" opacity="0.2"/>
                  <path d="M28 142 L32 158 L48 158 L35 168 L40 184 L28 174 L16 184 L21 168 L8 158 L24 158 Z" fill="#fbbf24" opacity="0.45"/>
                  <ellipse cx="205" cy="158" rx="11" ry="42" fill="#34d399" opacity="0.35" transform="rotate(-15 205 158)"/>
                  <ellipse cx="205" cy="158" rx="5" ry="18" fill="#34d399" opacity="0.2" transform="rotate(-15 205 158)"/>
                  <circle cx="145" cy="25" r="4" fill="#5bc1d5" opacity="0.4"/>
                  <circle cx="160" cy="35" r="2.5" fill="#5bc1d5" opacity="0.3"/>
                  <circle cx="55" cy="105" r="3" fill="#f97316" opacity="0.35"/>
                </svg>
              </div>
            </div>

            {/* Right: Clean accordion */}
            <div className="py-2">
              {faqItems.map((item, i) => (
                <div key={i} className={`border-b border-gray-100 transition-all duration-200 ${openFaq === i ? 'bg-white rounded-xl px-4 mb-1 shadow-sm border-b-0' : ''}`}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left group">
                    <span className={`text-[15px] font-semibold leading-snug transition-colors ${
                      openFaq === i ? 'text-[#1a1a1a]' : 'text-[#1a1a1a] group-hover:text-[#5bc1d5]'
                    }`}>
                      {item.q}
                    </span>
                    <ChevronDown size={18} className={`flex-shrink-0 transition-transform duration-200 ${
                      openFaq === i ? 'rotate-180 text-[#5bc1d5]' : 'text-gray-400 group-hover:text-[#5bc1d5]'
                    }`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-60 pb-5' : 'max-h-0'}`}>
                    <p className="text-gray-500 text-[14px] leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ───────────────────────────────────────────── */}
      <section className="bg-[#1a1a1a] px-4 sm:px-8 pt-14 pb-10 mt-2">
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
