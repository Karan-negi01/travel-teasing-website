'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Upload, X, ChevronRight, Check, ImageIcon } from 'lucide-react';

/* ── Config ──────────────────────────────────────────────── */
const TYPES = [
  { id: 'FIT',       label: 'FIT',       desc: 'Fixed Individual Tours — solo & couple travelers' },
  { id: 'GROUPS',    label: 'Groups',    desc: 'Community group trips with fixed departures' },
  { id: 'CORPORATE', label: 'Corporate', desc: 'Corporate offsite & team outing packages' },
];

const SUBTYPES = {
  FIT:       ['Normal FIT', 'Exclusive FIT'],
  GROUPS:    ["Women's Only Group", 'Travel with Pets Group', 'Normal Group', 'Sacred Places Group', 'Exclusive Trips'],
  CORPORATE: ['Team Outing', 'Corporate Retreat', 'MICE'],
};

const VIBES = ['Adventure', 'Moody', 'Cultural', 'Spiritual', 'Romantic', 'Honeymoon', 'Family', 'Wildlife', 'Beach', 'Mountain', 'Treks', 'Budget', 'Luxury', 'Offbeat'];

const INPUT = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A] focus:border-transparent';
const LABEL = 'block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide';
const SECTION = 'bg-white rounded-xl border border-gray-200 p-6 space-y-4';
const SECTION_TITLE = 'text-base font-bold text-[#1a1a2e] pb-3 border-b border-gray-100 mb-2';

/* ── Image Upload Component ──────────────────────────────── */
function ImageUpload({ value, onChange, small = false }) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef(null);

  async function handleFile(file) {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) onChange(data.url);
      else alert('Upload failed: ' + (data.error || 'Unknown error'));
    } catch {
      alert('Upload failed. Please try again.');
    }
    setUploading(false);
  }

  const h = small ? 'h-24' : 'h-36';

  if (value) return (
    <div className={`relative rounded-lg overflow-hidden ${h}`}>
      <img src={value} alt="upload" className="w-full h-full object-cover" />
      <button type="button" onClick={() => onChange('')}
        className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow hover:bg-red-600 transition-colors">
        <X size={12} />
      </button>
    </div>
  );

  return (
    <div onClick={() => !uploading && ref.current?.click()}
      className={`${h} border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#E8651A] hover:bg-orange-50 transition-all group`}>
      {uploading
        ? <div className="flex flex-col items-center gap-1"><div className="w-5 h-5 border-2 border-[#E8651A] border-t-transparent rounded-full animate-spin" /><span className="text-xs text-gray-400">Uploading…</span></div>
        : <div className="flex flex-col items-center gap-1"><ImageIcon size={small ? 16 : 20} className="text-gray-300 group-hover:text-[#E8651A] transition-colors" /><span className="text-xs text-gray-400 group-hover:text-[#E8651A]">{small ? 'Add' : 'Click to upload'}</span></div>
      }
      <input ref={ref} type="file" accept="image/*" className="hidden"
        onChange={e => handleFile(e.target.files?.[0])} />
    </div>
  );
}

/* ── Dynamic List ──────────────────────────────────────────── */
function DynamicList({ label, items, onChange, placeholder }) {
  function update(i, v) { onChange(items.map((x, idx) => idx === i ? v : x)); }
  function add() { onChange([...items, '']); }
  function remove(i) { onChange(items.filter((_, idx) => idx !== i)); }
  return (
    <div className="space-y-2">
      <label className={LABEL}>{label}</label>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input value={item} onChange={e => update(i, e.target.value)}
            placeholder={placeholder || `Item ${i + 1}`}
            className={INPUT} />
          <button type="button" onClick={() => remove(i)}
            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button type="button" onClick={add}
        className="text-[#E8651A] text-xs font-semibold flex items-center gap-1 hover:underline">
        <Plus size={13} /> Add {label}
      </button>
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function NewPackagePage() {
  const router = useRouter();

  // Step state
  const [step, setStep]       = useState(1); // 1=type, 2=subtype, 3=form
  const [type, setType]       = useState('');
  const [subtype, setSubtype] = useState('');

  // Form state
  const [form, setForm] = useState({
    title: '',
    destination_type: 'Domestic',
    location: '',
    region: '',
    duration_days: 1,
    duration_nights: 1,
    vibes: [],
    price_per_person: '',
    group_size_min: 8,
    group_size_max: 15,
    date_type: 'coming_soon',
    start_date: '',
    end_date: '',
    multi_dates: [{ start_date: '', end_date: '' }],
    about_trip: '',
    inclusions: [''],
    exclusions: [''],
    highlights: [''],
    images: ['', '', '', '', ''],
    is_featured: false,
    is_active: true,
  });

  const [itinerary, setItinerary] = useState([
    { day: 1, title: '', description: '', images: ['', '', ''] },
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  function setField(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function toggleVibe(v) {
    setForm(f => ({
      ...f,
      vibes: f.vibes.includes(v) ? f.vibes.filter(x => x !== v) : [...f.vibes, v],
    }));
  }

  function updateImage(i, url) {
    setForm(f => ({ ...f, images: f.images.map((x, idx) => idx === i ? url : x) }));
  }

  // Itinerary helpers
  function addDay() {
    setItinerary(d => [...d, { day: d.length + 1, title: '', description: '', images: ['', '', ''] }]);
  }
  function removeDay(i) {
    setItinerary(d => d.filter((_, idx) => idx !== i).map((x, idx) => ({ ...x, day: idx + 1 })));
  }
  function setDayField(i, k, v) {
    setItinerary(d => d.map((x, idx) => idx === i ? { ...x, [k]: v } : x));
  }
  function setDayImage(dayIdx, imgIdx, url) {
    setItinerary(d => d.map((x, idx) => idx === dayIdx
      ? { ...x, images: x.images.map((im, ii) => ii === imgIdx ? url : im) }
      : x));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setError('');
    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const duration = `${form.duration_nights}N/${form.duration_days}D`;
    const category = type === 'GROUPS' ? 'group' : type === 'FIT' ? 'fit' : 'corporate';

    const payload = {
      slug,
      title: form.title,
      category,
      package_type: type,
      package_subtype: subtype,
      destination_type: form.destination_type,
      location: form.location,
      state: form.region,
      duration: duration,
      duration_days: form.duration_days,
      duration_nights: form.duration_nights,
      vibe: form.vibes.join(', '),
      price_per_person: parseInt(form.price_per_person) || 0,
      total_price: parseInt(form.price_per_person) || 0,
      group_size_min: form.group_size_min,
      group_size_max: form.group_size_max,
      cover_image: form.images.find(Boolean) || '',
      images: form.images.filter(Boolean),
      date_type: type === 'FIT' ? null : form.date_type,
      start_date: type !== 'FIT' && form.date_type === 'select_dates' ? form.start_date : null,
      end_date: type !== 'FIT' && form.date_type === 'select_dates' ? form.end_date : null,
      multi_dates: form.date_type === 'multi_dates' ? form.multi_dates.filter(d => d.start_date && d.end_date) : null,
      description: form.about_trip,
      highlights: form.highlights.filter(Boolean),
      inclusions: form.inclusions.filter(Boolean),
      exclusions: form.exclusions.filter(Boolean),
      itinerary: itinerary.map(d => ({
        day: d.day,
        title: d.title,
        description: d.description,
        images: d.images.filter(Boolean),
      })),
      is_featured: form.is_featured,
      is_active: form.is_active,
    };

    const res = await fetch('/api/admin/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) router.push('/admin/packages');
    else { setError(data.error || 'Something went wrong'); setSaving(false); }
  }

  /* ── STEP 1: Type ── */
  if (step === 1) return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">New Package</h1>
      <p className="text-gray-400 text-sm mb-8">Step 1 of 3 — Choose package type</p>
      <div className="grid gap-4">
        {TYPES.map(t => (
          <button key={t.id} type="button"
            onClick={() => { setType(t.id); setSubtype(''); setStep(2); }}
            className="flex items-center justify-between p-5 bg-white border-2 border-gray-100 rounded-xl hover:border-[#E8651A] hover:shadow-md transition-all text-left group">
            <div>
              <div className="font-bold text-[#1a1a2e] text-base mb-1">{t.label}</div>
              <div className="text-gray-400 text-sm">{t.desc}</div>
            </div>
            <ChevronRight size={20} className="text-gray-300 group-hover:text-[#E8651A] transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );

  /* ── STEP 2: Subtype ── */
  if (step === 2) return (
    <div className="max-w-2xl">
      <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1">← Back</button>
      <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">New {type} Package</h1>
      <p className="text-gray-400 text-sm mb-8">Step 2 of 3 — Choose subtype</p>
      <div className="grid gap-3">
        {SUBTYPES[type].map(st => (
          <button key={st} type="button"
            onClick={() => { setSubtype(st); setStep(3); }}
            className="flex items-center justify-between px-5 py-4 bg-white border-2 border-gray-100 rounded-xl hover:border-[#E8651A] hover:shadow-md transition-all text-left group">
            <span className="font-semibold text-[#1a1a2e]">{st}</span>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-[#E8651A] transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );

  /* ── STEP 3: Full Form ── */
  const duration = `${form.duration_nights}N/${form.duration_days}D`;

  return (
    <div className="max-w-3xl pb-16">
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => setStep(2)} className="text-sm text-gray-400 hover:text-gray-600 mb-3 flex items-center gap-1">← Back</button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#1a1a2e]">New Package</h1>
          <span className="text-xs bg-orange-100 text-[#E8651A] font-bold px-3 py-1 rounded-full">{type}</span>
          <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-3 py-1 rounded-full">{subtype}</span>
        </div>
        <p className="text-gray-400 text-sm mt-1">Step 3 of 3 — Fill in the package details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Basic Info ── */}
        <div className={SECTION}>
          <div className={SECTION_TITLE}>Basic Info</div>

          <div>
            <label className={LABEL}>Package Name *</label>
            <input required value={form.title} onChange={e => setField('title', e.target.value)}
              placeholder="e.g. Kashmir Great Lakes Trek 2025"
              className={INPUT} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Destination</label>
              <select value={form.destination_type} onChange={e => setField('destination_type', e.target.value)} className={INPUT}>
                <option>Domestic</option>
                <option>International</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Location / Country</label>
              <input value={form.location} onChange={e => setField('location', e.target.value)}
                placeholder={form.destination_type === 'Domestic' ? 'e.g. Jammu & Kashmir' : 'e.g. Indonesia'}
                className={INPUT} />
            </div>
          </div>

          <div>
            <label className={LABEL}>Region</label>
            <input value={form.region} onChange={e => setField('region', e.target.value)}
              placeholder="e.g. North India, Southeast Asia, South India"
              className={INPUT} />
          </div>

          <div className="grid grid-cols-3 gap-4 items-end">
            <div>
              <label className={LABEL}>Nights</label>
              <input type="number" min="0" value={form.duration_nights}
                onChange={e => setField('duration_nights', parseInt(e.target.value) || 0)}
                className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Days</label>
              <input type="number" min="1" value={form.duration_days}
                onChange={e => setField('duration_days', parseInt(e.target.value) || 1)}
                className={INPUT} />
            </div>
            <div className="pb-0.5">
              <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2.5 text-center">
                <span className="text-[#E8651A] font-bold text-sm">{duration}</span>
              </div>
            </div>
          </div>

          <div>
            <label className={LABEL}>Price Per Person (₹) *</label>
            <input required type="number" min="0" value={form.price_per_person}
              onChange={e => setField('price_per_person', e.target.value)}
              placeholder="e.g. 18500"
              className={INPUT} />
          </div>

          {type === 'GROUPS' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Min Group Size</label>
                <input type="number" min="1" value={form.group_size_min}
                  onChange={e => setField('group_size_min', parseInt(e.target.value) || 1)}
                  className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Max Group Size</label>
                <input type="number" min="1" value={form.group_size_max}
                  onChange={e => setField('group_size_max', parseInt(e.target.value) || 1)}
                  className={INPUT} />
              </div>
            </div>
          )}

          <div>
            <label className={LABEL}>Vibe / Tags</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {VIBES.map(v => (
                <button key={v} type="button" onClick={() => toggleVibe(v)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                    form.vibes.includes(v)
                      ? 'bg-[#E8651A] border-[#E8651A] text-white'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-[#E8651A] hover:text-[#E8651A]'
                  }`}>
                  {form.vibes.includes(v) && <Check size={10} className="inline mr-1" />}{v}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div onClick={() => setField('is_featured', !form.is_featured)}
                className={`w-10 h-5 rounded-full transition-colors relative ${form.is_featured ? 'bg-[#E8651A]' : 'bg-gray-200'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-gray-600">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div onClick={() => setField('is_active', !form.is_active)}
                className={`w-10 h-5 rounded-full transition-colors relative ${form.is_active ? 'bg-[#E8651A]' : 'bg-gray-200'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-gray-600">Active (visible on site)</span>
            </label>
          </div>
        </div>

        {/* ── Images ── */}
        <div className={SECTION}>
          <div className={SECTION_TITLE}>Package Images <span className="text-gray-400 font-normal text-xs ml-2">(Upload 5 images — first one becomes cover)</span></div>
          <div className="grid grid-cols-5 gap-3">
            {form.images.map((img, i) => (
              <div key={i}>
                <div className="text-[10px] font-semibold text-gray-400 mb-1 text-center">
                  {i === 0 ? 'Cover' : `Photo ${i + 1}`}
                </div>
                <ImageUpload value={img} onChange={url => updateImage(i, url)} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Dates (hidden for FIT packages) ── */}
        {type !== 'FIT' && (
          <div className={SECTION}>
            <div className={SECTION_TITLE}>Trip Dates</div>
            <div className="flex gap-4">
              {[
                { id: 'select_dates', label: 'Select Dates' },
                { id: 'coming_soon', label: 'Coming Soon' },
                ...(type === 'GROUPS' ? [{ id: 'multi_dates', label: 'Multiple Dates' }] : []),
              ].map(opt => (
                <label key={opt.id}
                  className={`flex-1 flex items-center gap-3 border-2 rounded-xl px-4 py-3 cursor-pointer transition-all ${
                    form.date_type === opt.id ? 'border-[#E8651A] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <input type="radio" name="date_type" value={opt.id} checked={form.date_type === opt.id}
                    onChange={() => setField('date_type', opt.id)} className="accent-[#E8651A]" />
                  <span className={`text-sm font-semibold ${form.date_type === opt.id ? 'text-[#E8651A]' : 'text-gray-600'}`}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>

            {form.date_type === 'select_dates' && (
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label className={LABEL}>Start Date</label>
                  <input type="date" value={form.start_date} onChange={e => setField('start_date', e.target.value)}
                    className={INPUT} />
                </div>
                <div>
                  <label className={LABEL}>End Date</label>
                  <input type="date" value={form.end_date} onChange={e => setField('end_date', e.target.value)}
                    className={INPUT} />
                </div>
              </div>
            )}

            {form.date_type === 'multi_dates' && (
              <div className="mt-3 space-y-3">
                {form.multi_dates.map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-[#E8651A] text-xs font-bold flex items-center justify-center">{i + 1}</div>
                    <div className="grid grid-cols-2 gap-3 flex-1">
                      <div>
                        {i === 0 && <label className={LABEL}>Start Date</label>}
                        <input type="date" value={d.start_date}
                          onChange={e => setField('multi_dates', form.multi_dates.map((x, idx) => idx === i ? { ...x, start_date: e.target.value } : x))}
                          className={INPUT} />
                      </div>
                      <div>
                        {i === 0 && <label className={LABEL}>End Date</label>}
                        <input type="date" value={d.end_date}
                          onChange={e => setField('multi_dates', form.multi_dates.map((x, idx) => idx === i ? { ...x, end_date: e.target.value } : x))}
                          className={INPUT} />
                      </div>
                    </div>
                    {form.multi_dates.length > 1 && (
                      <button type="button"
                        onClick={() => setField('multi_dates', form.multi_dates.filter((_, idx) => idx !== i))}
                        className="flex-shrink-0 p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button"
                  onClick={() => setField('multi_dates', [...form.multi_dates, { start_date: '', end_date: '' }])}
                  className="text-[#E8651A] text-xs font-semibold flex items-center gap-1 hover:underline mt-1">
                  <Plus size={13} /> Add Another Date
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Itinerary ── */}
        <div className={SECTION}>
          <div className={SECTION_TITLE}>Itinerary & Details</div>

          {/* About the trip */}
          <div>
            <label className={LABEL}>About the Trip</label>
            <textarea rows={4} value={form.about_trip} onChange={e => setField('about_trip', e.target.value)}
              placeholder="Write a compelling description about this trip — who it's for, what makes it special..."
              className={`${INPUT} resize-none`} />
          </div>

          {/* Highlights */}
          <DynamicList
            label="Highlights"
            items={form.highlights}
            onChange={v => setField('highlights', v)}
            placeholder="e.g. Sunrise at 4500m with panoramic Himalayan views"
          />

          {/* What's Included */}
          <DynamicList
            label="What's Included"
            items={form.inclusions}
            onChange={v => setField('inclusions', v)}
            placeholder="e.g. Accommodation on triple sharing basis"
          />

          {/* What's Not Included */}
          <DynamicList
            label="What's Not Included"
            items={form.exclusions}
            onChange={v => setField('exclusions', v)}
            placeholder="e.g. Personal travel insurance"
          />
        </div>

        {/* ── Day-wise Itinerary ── */}
        <div className={SECTION}>
          <div className={SECTION_TITLE}>Day-wise Overview</div>
          <div className="space-y-5">
            {itinerary.map((day, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                {/* Day header */}
                <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-100">
                  <span className="font-bold text-[#E8651A] text-sm">Day {day.day}</span>
                  {itinerary.length > 1 && (
                    <button type="button" onClick={() => removeDay(i)}
                      className="p-1 text-red-400 hover:bg-red-50 rounded transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <input value={day.title} onChange={e => setDayField(i, 'title', e.target.value)}
                    placeholder={`Day ${day.day} title — e.g. Arrival in Srinagar`}
                    className={INPUT} />
                  <textarea rows={3} value={day.description} onChange={e => setDayField(i, 'description', e.target.value)}
                    placeholder="Describe what happens on this day..."
                    className={`${INPUT} resize-none`} />
                  {/* Day images */}
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Day Photos (3)</div>
                    <div className="grid grid-cols-3 gap-2">
                      {day.images.map((img, ii) => (
                        <ImageUpload key={ii} value={img} onChange={url => setDayImage(i, ii, url)} small />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addDay}
            className="mt-3 text-[#E8651A] text-sm font-semibold flex items-center gap-1.5 hover:underline">
            <Plus size={15} /> Add Day
          </button>
        </div>

        {/* ── Submit ── */}
        {error && <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}
        <div className="flex gap-3">
          <button type="button" onClick={() => router.push('/admin/packages')}
            className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 bg-[#E8651A] text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-orange-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving Package…</>
            ) : (
              <><Check size={16} /> Create Package</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
