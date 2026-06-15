'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Users, CheckCircle, XCircle, ChevronDown, ChevronUp, MessageCircle, ArrowRight } from 'lucide-react';
import EnquiryModal from '@/components/EnquiryModal';
import PackageCard from '@/components/PackageCard';

const catLabel = { group: 'Group Trip', family: 'Family', sacred: 'Sacred', adventure: 'Adventure', corporate: 'Corporate' };

export default function PackageDetailPage({ params }) {
  const { slug } = params;
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [openDay, setOpenDay] = useState(0);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [similarPkgs, setSimilarPkgs] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAllOptions, setShowAllOptions] = useState(false);
  const stickyRef = useRef(null);

  useEffect(() => {
    fetch(`/api/packages/${slug}`).then(r => r.json()).then(d => {
      setPkg(d.package);
      if (d.package?.tour_options?.length > 0) setSelectedOption(d.package.tour_options[0]);
      setLoading(false);
      if (d.package) {
        fetch(`/api/packages?category=${d.package.category}`).then(r => r.json()).then(sd => {
          setSimilarPkgs((sd.packages || []).filter(p => p.slug !== slug).slice(0, 3));
        });
      }
    }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-[#E8651A] border-t-transparent rounded-full" /></div>;
  if (!pkg) return <div className="h-screen flex items-center justify-center text-gray-500">Package not found.</div>;

  const allImages = [pkg.cover_image, ...(pkg.gallery_images || [])].filter(Boolean);

  return (
    <div className="pt-20 pb-24 lg:pb-0">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="container-max py-3 text-sm text-gray-500 flex gap-2">
          <Link href="/" className="hover:text-[#E8651A]">Home</Link> /
          <Link href="/packages" className="hover:text-[#E8651A]">Packages</Link> /
          <span className="text-gray-700 line-clamp-1">{pkg.title}</span>
        </div>
      </div>

      <div className="container-max py-8">
        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-3">
            <Image src={allImages[activeImage] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200'} alt={pkg.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 70vw" priority />
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allImages.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`flex-shrink-0 relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${i === activeImage ? 'border-[#E8651A]' : 'border-transparent'}`}>
                  <Image src={img} alt={`Photo ${i+1}`} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title + badges */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">{pkg.title}</h1>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-[#E8651A]/10 text-[#E8651A] px-3 py-1 rounded-full text-sm font-medium">{catLabel[pkg.category]}</span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm flex items-center gap-1"><Clock size={14} /> {pkg.duration_days}D/{pkg.duration_nights}N</span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm flex items-center gap-1"><Users size={14} /> {pkg.group_size_min}–{pkg.group_size_max} people</span>
                {pkg.departure_city && <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm flex items-center gap-1"><MapPin size={14} /> From {pkg.departure_city}</span>}
              </div>
              <p className="text-gray-600 leading-relaxed">{pkg.description}</p>
            </div>

            {/* Itinerary */}
            {pkg.itinerary?.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">Day-by-Day Itinerary</h2>
                <div className="space-y-3">
                  {pkg.itinerary.map((day, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button onClick={() => setOpenDay(openDay === i ? -1 : i)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="bg-[#E8651A] text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                            {day.day || i+1}
                          </span>
                          <span className="font-semibold text-[#1a1a2e]">{day.title}</span>
                        </div>
                        {openDay === i ? <ChevronUp size={18} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
                      </button>
                      {openDay === i && (
                        <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                          {day.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions / Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pkg.inclusions?.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Inclusions</h3>
                  <ul className="space-y-2">
                    {pkg.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />{inc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pkg.exclusions?.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Exclusions</h3>
                  <ul className="space-y-2">
                    {pkg.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <XCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />{exc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {pkg.things_to_carry?.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">Things to Carry</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {pkg.things_to_carry.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 bg-[#E8651A] rounded-full flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {pkg.best_time_to_visit && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <h4 className="font-semibold text-blue-800 mb-1">📅 Best Time to Visit</h4>
                <p className="text-blue-700 text-sm">{pkg.best_time_to_visit}</p>
              </div>
            )}
          </div>

          {/* RIGHT sticky */}
          <div className="space-y-4">
            <div ref={stickyRef} className="lg:sticky lg:top-24 space-y-4">
              {/* Price card */}
              <div className="card p-6">
                <p className="text-sm text-gray-500 font-medium mb-1">Book This Tour</p>
                {pkg.tour_options?.length > 0 ? (
                  <>
                    <p className="text-[#E8651A] text-3xl font-bold mb-1">
                      ₹{parseInt(selectedOption?.price || pkg.price_per_person).toLocaleString('en-IN')}
                      <span className="text-base text-gray-500 font-normal">/person</span>
                    </p>
                    <p className="text-gray-400 text-xs mb-4">+ tax as applicable</p>

                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tour Option</p>
                    <div className="space-y-2 mb-3">
                      {(showAllOptions ? pkg.tour_options : pkg.tour_options.slice(0, 2)).map((opt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedOption(opt)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                            selectedOption?.label === opt.label
                              ? 'border-[#E8651A] bg-orange-50 text-[#E8651A]'
                              : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span>{opt.label}</span>
                          <span>₹{parseInt(opt.price).toLocaleString('en-IN')}</span>
                        </button>
                      ))}
                    </div>
                    {pkg.tour_options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setShowAllOptions(v => !v)}
                        className="w-full flex items-center justify-center gap-1 border-2 border-[#E8651A] text-[#E8651A] rounded-xl py-2.5 text-sm font-semibold hover:bg-orange-50 transition-colors mb-3"
                      >
                        {showAllOptions ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        {showAllOptions ? 'Show Less Options' : `Show ${pkg.tour_options.length - 2} More Options`}
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-[#E8651A] text-3xl font-bold mb-1">₹{pkg.price_per_person?.toLocaleString('en-IN')}<span className="text-base text-gray-500 font-normal">/person</span></p>
                    {pkg.total_price && pkg.group_size_max && (
                      <p className="text-gray-400 text-sm mb-4">Total ₹{pkg.total_price?.toLocaleString('en-IN')} for {pkg.group_size_max} people</p>
                    )}
                  </>
                )}
                <div className="space-y-3">
                  <button
                    onClick={() => setEnquiryOpen(true)}
                    className="w-full btn-primary justify-center"
                  >
                    Book Now
                  </button>
                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/916396464369?text=Hi! I'm interested in the ${encodeURIComponent(pkg.title)} package${selectedOption ? ` (${selectedOption.label})` : ''}.`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#25D366] text-white rounded-full hover:bg-green-500 transition-colors"
                    >
                      <MessageCircle size={20} />
                    </a>
                    <a
                      href={pkg.itinerary_pdf || '#'}
                      className={`flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 py-3 rounded-full text-sm font-semibold hover:border-gray-300 transition-colors ${!pkg.itinerary_pdf ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      Download Itinerary
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Similar packages */}
        {similarPkgs.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">Similar Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarPkgs.map(p => <PackageCard key={p.id} pkg={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Mobile sticky bottom CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 shadow-xl">
        <div className="flex-1">
          <p className="text-[11px] text-gray-400 leading-none">{selectedOption ? selectedOption.label : 'Price per person'}</p>
          <p className="text-xl font-bold text-[#1a1a1a]">₹{(selectedOption ? parseInt(selectedOption.price) : pkg.price_per_person)?.toLocaleString('en-IN')}</p>
        </div>
        <a href={`https://wa.me/916396464369?text=Hi! I'm interested in the ${encodeURIComponent(pkg.title)} package${selectedOption ? ` (${selectedOption.label})` : ''}.`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-full text-sm font-semibold">
          <MessageCircle size={16} /> WhatsApp
        </a>
        <button onClick={() => setEnquiryOpen(true)}
          className="flex items-center gap-2 bg-[#1a1a1a] text-white px-4 py-2.5 rounded-full text-sm font-semibold">
          Enquire
        </button>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} packageId={pkg.id} packageTitle={pkg.title} enquiryType="package" />

    </div>
  );
}
