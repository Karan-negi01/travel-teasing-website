'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Users, CheckCircle, XCircle, ChevronDown, ChevronUp, MessageCircle, Download, Calendar } from 'lucide-react';
import EnquiryModal from '@/components/EnquiryModal';
import PackageCard from '@/components/PackageCard';

const catLabel = { group: 'Group Trip', family: 'Family', sacred: 'Sacred', adventure: 'Adventure', corporate: 'Corporate', weekend: 'Weekend', fit: 'FIT' };

const TABS = [
  { id: 'itinerary', label: 'Tour Itinerary' },
  { id: 'inclusions', label: 'Inclusions' },
  { id: 'costing', label: 'Costing' },
  { id: 'overview', label: 'About the Trip' },
];

function getDayDate(startDate, dayIndex) {
  if (!startDate) return null;
  const d = new Date(startDate);
  d.setDate(d.getDate() + dayIndex);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: '2-digit' });
}

export default function PackageDetailPage({ params }) {
  const { slug } = params;
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDay, setOpenDay] = useState(0);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [similarPkgs, setSimilarPkgs] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    fetch(`/api/packages/${slug}`).then(r => r.json()).then(d => {
      setPkg(d.package);
      if (d.package?.tour_options?.length > 0) setSelectedOption(d.package.tour_options[0]);
      if (d.package?.multi_dates?.length > 0) setSelectedDate(d.package.multi_dates[0]);
      else if (d.package?.start_date) setSelectedDate({ start_date: d.package.start_date, end_date: d.package.end_date });
      setLoading(false);
      if (d.package) {
        fetch(`/api/packages?category=${d.package.category}`).then(r => r.json()).then(sd => {
          setSimilarPkgs((sd.packages || []).filter(p => p.slug !== slug).slice(0, 3));
        });
      }
    }).catch(() => setLoading(false));
  }, [slug]);

  const scrollToSection = (id) => {
    setActiveTab(id);
    setTimeout(() => {
      sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-[#E8651A] border-t-transparent rounded-full" /></div>;
  if (!pkg) return <div className="h-screen flex items-center justify-center text-gray-500">Package not found.</div>;

  const allImages = [pkg.cover_image, ...(pkg.gallery_images || [])].filter(Boolean);
  const displayPrice = selectedOption ? parseInt(selectedOption.price) : pkg.price_per_person;
  const savings = pkg.original_price && pkg.original_price > displayPrice ? pkg.original_price - displayPrice : null;

  const dateOptions = pkg.multi_dates?.length > 0
    ? pkg.multi_dates
    : pkg.start_date
    ? [{ start_date: pkg.start_date, end_date: pkg.end_date }]
    : [];

  const formatDateRange = (d) => {
    if (!d?.start_date) return 'Coming Soon';
    const s = new Date(d.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const e = d.end_date ? new Date(d.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
    return e ? `${s} - ${e}` : s;
  };

  const waText = `Hi! I'm interested in ${pkg.title}${selectedOption ? ` (${selectedOption.label})` : ''}${selectedDate ? ` - ${formatDateRange(selectedDate)}` : ''}.`;

  return (
    <div className="bg-white min-h-screen">

      {/* ── IMAGE COLLAGE ── */}
      <div className="container-max pt-2 pb-0">
        <div className={`grid gap-2 rounded-2xl overflow-hidden ${allImages.length > 1 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`} style={{ height: '480px' }}>
          {/* Main large image */}
          <div className="relative h-full">
            {allImages[0] ? (
              <Image src={allImages[0]} alt={pkg.title} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" priority />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
          {/* 4 smaller images grid — only show if more than 1 image */}
          {allImages.length > 1 && <div className="grid grid-cols-2 gap-2 h-full">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="relative overflow-hidden">
                {allImages[i] ? (
                  <Image src={allImages[i]} alt={`${pkg.title} ${i}`} fill className="object-cover" sizes="25vw" />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
                {i === 4 && allImages.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">+{allImages.length - 5} more</span>
                  </div>
                )}
              </div>
            ))}
          </div>}
        </div>
      </div>

      {/* ── TITLE + META ── */}
      <div className="container-max pt-6 pb-2">
        <h1 className="text-[48px] font-semibold text-[#1a1a1a] leading-tight mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {pkg.title}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          <span className="flex items-center gap-1.5"><Clock size={15} /> {pkg.duration_days}D/{pkg.duration_nights}N</span>
          {pkg.group_size_max > 0 && <span className="flex items-center gap-1.5"><Users size={15} /> {pkg.group_size_min}–{pkg.group_size_max} people</span>}
          {pkg.departure_city && <span className="flex items-center gap-1.5"><MapPin size={15} /> From {pkg.departure_city}</span>}
          <span className="bg-[#E8651A]/10 text-[#E8651A] px-3 py-0.5 rounded-full font-medium">{catLabel[pkg.category]}</span>
        </div>
      </div>

      {/* ── STICKY TABS ── */}
      <div className="sticky z-30 bg-white border-b border-gray-200" style={{ top: '75px' }}>
        <div className="container-max">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => scrollToSection(tab.id)}
                className={`flex-shrink-0 px-6 py-4 text-[15px] font-semibold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-[#1a1a1a] text-[#1a1a1a]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT + SIDEBAR ── */}
      <div className="container-max py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-14">

            {/* Tour Itinerary */}
            {pkg.itinerary?.length > 0 && (
              <div ref={el => sectionRefs.current['itinerary'] = el} className="scroll-mt-36">
                <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Tour Itinerary</h2>
                <div className="border border-gray-200 rounded-2xl divide-y divide-gray-200 overflow-hidden">
                  {pkg.itinerary.map((day, i) => {
                    const dayDate = getDayDate(selectedDate?.start_date || pkg.start_date, i);
                    const isOpen = openDay === i;
                    return (
                      <div key={i}>
                        <button onClick={() => setOpenDay(isOpen ? -1 : i)}
                          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="bg-gray-800 text-white text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                              style={{ fontFamily: "'Poppins', sans-serif" }}>
                              Day {day.day || i + 1}
                            </span>
                            {dayDate && <span className="text-gray-400 text-[14px]">{dayDate}</span>}
                          </div>
                          <div className="flex-1 mx-4">
                            <span className="font-semibold text-[#1a1a1a] text-[16px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              {day.title}
                            </span>
                          </div>
                          {isOpen ? <ChevronUp size={18} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-6 bg-white">
                            {day.images?.filter(Boolean).length > 0 && (
                              <div className="grid grid-cols-3 gap-2 mb-5 rounded-xl overflow-hidden">
                                {day.images.filter(Boolean).slice(0, 3).map((img, ii) => (
                                  <div key={ii} className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                                    <Image src={img} alt={`Day ${day.day || i+1}`} fill className="object-cover" sizes="200px" />
                                  </div>
                                ))}
                              </div>
                            )}
                            {day.description && (
                              <ul className="space-y-2.5 mt-2">
                                {day.description.split('.').filter(s => s.trim().length > 8).map((sentence, si) => (
                                  <li key={si} className="flex items-start gap-2.5 text-[15px] text-gray-700 leading-relaxed"
                                    style={{ fontFamily: "'Poppins', sans-serif" }}>
                                    <span className="mt-2 w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                                    {sentence.trim()}.
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Inclusions */}
            <div ref={el => sectionRefs.current['inclusions'] = el} className="scroll-mt-36">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {pkg.inclusions?.length > 0 && (
                  <div>
                    <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Includes:</h2>
                    <ul className="space-y-3">
                      {pkg.inclusions.map((inc, i) => (
                        <li key={i} className="flex items-start gap-3 text-[15px] text-gray-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          <div className="w-5 h-5 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle size={12} className="text-white" />
                          </div>
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {pkg.exclusions?.length > 0 && (
                  <div>
                    <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Excludes:</h2>
                    <ul className="space-y-3">
                      {pkg.exclusions.map((exc, i) => (
                        <li key={i} className="flex items-start gap-3 text-[15px] text-gray-700" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          <div className="w-5 h-5 rounded-full bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <XCircle size={12} className="text-white" />
                          </div>
                          {exc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Costing */}
            <div ref={el => sectionRefs.current['costing'] = el} className="scroll-mt-36">
              <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>Costing</h2>
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-[15px] font-medium text-gray-700" style={{ fontFamily: "'Poppins', sans-serif" }}>Price per person</span>
                  <span className="text-[16px] font-bold text-[#1a1a1a]" style={{ fontFamily: "'Poppins', sans-serif" }}>₹{displayPrice?.toLocaleString('en-IN')}</span>
                </div>
                {savings && (
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-green-50">
                    <span className="text-[15px] font-medium text-green-700">You Save</span>
                    <span className="text-[16px] font-bold text-green-700">₹{savings.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {pkg.tour_options?.map((opt, i) => (
                  <div key={i} className="px-5 py-4 border-b border-gray-100 last:border-b-0 flex items-center justify-between">
                    <span className="text-[15px] text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>{opt.label}</span>
                    <span className="text-[15px] font-semibold text-[#1a1a1a]">₹{parseInt(opt.price).toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="px-5 py-4 bg-gray-50">
                  <p className="text-[13px] text-gray-400">* All prices are per person and exclude applicable taxes.</p>
                </div>
              </div>
            </div>

            {/* About the Trip */}
            <div ref={el => sectionRefs.current['overview'] = el} className="scroll-mt-36">
              <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-5" style={{ fontFamily: "'Poppins', sans-serif" }}>About the Trip</h2>
              <p className="text-[16px] text-black leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {pkg.description}
              </p>
              {pkg.best_time_to_visit && (
                <div className="mt-6">
                  <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Best Time to Visit</h3>
                  <p className="text-[15px] text-gray-600">{pkg.best_time_to_visit}</p>
                </div>
              )}
              {pkg.highlights?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>Highlights</h3>
                  <ul className="space-y-2">
                    {pkg.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-[15px] text-gray-700">
                        <CheckCircle size={15} className="text-[#E8651A] mt-0.5 flex-shrink-0" />{h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div>
            <div className="lg:sticky space-y-4" style={{ top: '140px' }}>
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <p className="text-[13px] font-semibold text-gray-500 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Book This Tour</p>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-[30px] font-black text-[#1a1a1a]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      ₹{displayPrice?.toLocaleString('en-IN')}
                    </span>
                    {pkg.original_price && pkg.original_price > displayPrice && (
                      <span className="text-gray-400 text-[14px] line-through">₹{pkg.original_price?.toLocaleString('en-IN')}</span>
                    )}
                    {savings && (
                      <span className="bg-green-100 text-green-700 text-[12px] font-semibold px-2 py-0.5 rounded-full">Save ₹{savings.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-[12px] mt-1">+ tax as applicable</p>
                </div>

                <div className="p-5 space-y-4">
                  {dateOptions.length > 0 && (
                    <div>
                      <label className="block text-[13px] font-semibold text-gray-600 mb-1.5" style={{ fontFamily: "'Poppins', sans-serif" }}>Select Date</label>
                      <select value={JSON.stringify(selectedDate)} onChange={e => setSelectedDate(JSON.parse(e.target.value))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] bg-white"
                        style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {dateOptions.map((d, i) => (
                          <option key={i} value={JSON.stringify(d)}>{formatDateRange(d)}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {pkg.tour_options?.length > 0 && (
                    <div>
                      <p className="text-[13px] font-semibold text-gray-600 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Tour Option</p>
                      <div className="space-y-2">
                        {pkg.tour_options.map((opt, i) => (
                          <button key={i} type="button" onClick={() => setSelectedOption(opt)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-[14px] font-semibold transition-all ${
                              selectedOption?.label === opt.label
                                ? 'border-[#E8651A] bg-orange-50 text-[#E8651A]'
                                : 'border-gray-200 text-gray-700 hover:border-gray-300'
                            }`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                            <span>{opt.label}</span>
                            <span>₹{parseInt(opt.price).toLocaleString('en-IN')}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button onClick={() => setEnquiryOpen(true)}
                    className="w-full bg-[#1a1a1a] hover:bg-[#333] text-white py-3.5 rounded-full font-bold text-[16px] transition-colors"
                    style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Book Now
                  </button>

                  <div className="flex gap-2">
                    <a href={pkg.itinerary_pdf || '#'}
                      className={`flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 py-3 rounded-full text-[14px] font-semibold hover:border-gray-300 transition-colors ${!pkg.itinerary_pdf ? 'opacity-50 pointer-events-none' : ''}`}
                      style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <Download size={14} />
                      Download Itinerary
                    </a>
                    <a href={`https://wa.me/916396464369?text=${encodeURIComponent(waText)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="w-12 h-12 flex items-center justify-center bg-[#25D366] text-white rounded-full hover:bg-green-500 transition-colors flex-shrink-0">
                      <MessageCircle size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Packages */}
        {similarPkgs.length > 0 && (
          <div className="mt-16">
            <h2 className="text-[24px] font-bold text-[#1a1a1a] mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Similar Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarPkgs.map(p => <PackageCard key={p.id} pkg={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Mobile sticky bottom CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 shadow-xl">
        <div className="flex-1">
          <p className="text-[11px] text-gray-400">{selectedOption ? selectedOption.label : 'Price per person'}</p>
          <p className="text-[20px] font-bold text-[#1a1a1a]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            ₹{displayPrice?.toLocaleString('en-IN')}
          </p>
        </div>
        <a href={`https://wa.me/916396464369?text=${encodeURIComponent(waText)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-full text-[14px] font-semibold">
          <MessageCircle size={15} /> WhatsApp
        </a>
        <button onClick={() => setEnquiryOpen(true)}
          className="flex items-center gap-2 bg-[#1a1a1a] text-white px-4 py-2.5 rounded-full text-[14px] font-semibold">
          Book Now
        </button>
      </div>

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} packageId={pkg.id} packageTitle={pkg.title} enquiryType="package" />
    </div>
  );
}
