'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, X, Check, ImageIcon } from 'lucide-react';

const CATEGORIES = [
  { key: 'treks',     label: '🏔️ Treks' },
  { key: 'honeymoon', label: '💕 Honeymoon' },
  { key: 'beaches',   label: '🏖️ Beaches' },
  { key: 'wildlife',  label: '🦁 Wildlife' },
  { key: 'heritage',  label: '🏛️ Heritage' },
  { key: 'offbeat',   label: '🌿 Offbeat' },
  { key: 'womens',    label: "👸 Women's Only" },
  { key: 'weekend',   label: '🌅 Weekend Escapes' },
];

const INPUT = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A] focus:border-transparent';
const LABEL = 'block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide';
const SECTION = 'bg-white rounded-xl border border-gray-200 p-6 space-y-4';
const SECTION_TITLE = 'text-base font-bold text-[#1a1a2e] pb-3 border-b border-gray-100 mb-2';

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

export default function EditPackagePage({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(null);
  const [itinerary, setItinerary] = useState([]);

  useEffect(() => {
    fetch(`/api/admin/packages/${params.id}`).then(r => r.json()).then(d => {
      if (d.package) {
        const p = d.package;
        p.highlights      = p.highlights?.length      ? p.highlights      : [''];
        p.inclusions      = p.inclusions?.length      ? p.inclusions      : [''];
        p.exclusions      = p.exclusions?.length      ? p.exclusions      : [''];
        p.things_to_carry = p.things_to_carry?.length ? p.things_to_carry : [''];
        p.important_notes = p.important_notes?.length ? p.important_notes : [''];
        p.tour_options    = p.tour_options?.length    ? p.tour_options    : [];
        const imgs = p.gallery_images?.length ? [...p.gallery_images] : (p.cover_image ? [p.cover_image] : []);
        while (imgs.length < 5) imgs.push('');
        p.images       = imgs;
        p.category_tag = p.vibe || '';
        p.duration_days   = p.duration_days   || 1;
        p.duration_nights = p.duration_nights || 1;
        p.date_type     = p.date_type     || 'coming_soon';
        p.multi_dates   = p.multi_dates?.length ? p.multi_dates : [{ start_date: '', end_date: '' }];
        p.start_date    = p.start_date    || '';
        p.end_date      = p.end_date      || '';
        p.about_sections = p.about_sections || [];
        setForm(p);
        setItinerary(
          p.itinerary?.length
            ? p.itinerary.map(day => ({
                day: day.day,
                title: day.title || '',
                description: day.description || '',
                images: [...(day.images || []), '', '', ''].slice(0, 3),
              }))
            : [{ day: 1, title: '', description: '', images: ['', '', ''] }]
        );
      }
      setLoading(false);
    });
  }, [params.id]);

  function setField(k, v) { setForm(f => ({ ...f, [k]: v })); }
  function toggleCategory(key) { setForm(f => ({ ...f, category_tag: f.category_tag === key ? '' : key })); }
  function updateImage(i, url) { setForm(f => ({ ...f, images: f.images.map((x, idx) => idx === i ? url : x) })); }
  function addDay() { setItinerary(d => [...d, { day: d.length + 1, title: '', description: '', images: ['', '', ''] }]); }
  function removeDay(i) { setItinerary(d => d.filter((_, idx) => idx !== i).map((x, idx) => ({ ...x, day: idx + 1 }))); }
  function setDayField(i, k, v) { setItinerary(d => d.map((x, idx) => idx === i ? { ...x, [k]: v } : x)); }
  function setDayImage(dayIdx, imgIdx, url) {
    setItinerary(d => d.map((x, idx) => idx === dayIdx
      ? { ...x, images: x.images.map((im, ii) => ii === imgIdx ? url : im) } : x));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setError('');
    const isFitLike = form.package_type === 'FIT' || (form.package_type === 'WEEKEND' && form.package_subtype === 'FIT') || !form.package_type;
    const payload = {
      title:              form.title,
      description:        form.description || '',
      location:           form.location    || '',
      state:              form.state       || form.region || '',
      duration:           `${form.duration_nights}N/${form.duration_days}D`,
      duration_days:      form.duration_days,
      duration_nights:    form.duration_nights,
      vibe:               form.category_tag || '',
      price_per_person:   parseInt(form.price_per_person) || 0,
      total_price:        parseInt(form.price_per_person) || 0,
      original_price:     parseInt(form.original_price)  || null,
      departure_city:     form.departure_city     || null,
      itinerary_pdf:      form.itinerary_pdf      || null,
      best_time_to_visit: form.best_time_to_visit || null,
      cover_image:        form.images.find(Boolean) || form.cover_image || '',
      gallery_images:     form.images.filter(Boolean),
      tour_options:       (form.tour_options || []).filter(o => o.label && o.price),
      group_size_min:     form.group_size_min || null,
      group_size_max:     form.group_size_max || null,
      date_type:          isFitLike ? null : form.date_type,
      start_date:         !isFitLike && form.date_type === 'select_dates' ? form.start_date : null,
      end_date:           !isFitLike && form.date_type === 'select_dates' ? form.end_date   : null,
      multi_dates:        form.date_type === 'multi_dates' ? (form.multi_dates || []).filter(d => d.start_date && d.end_date) : null,
      about_sections:     (form.about_sections || []).filter(s => s.content),
      highlights:         form.highlights.filter(Boolean),
      inclusions:         form.inclusions.filter(Boolean),
      exclusions:         form.exclusions.filter(Boolean),
      things_to_carry:    form.things_to_carry.filter(Boolean),
      important_notes:    form.important_notes.filter(Boolean),
      itinerary:          itinerary.map(d => ({ day: d.day, title: d.title, description: d.description, images: d.images.filter(Boolean) })),
      is_featured:        form.is_featured,
      is_active:          form.is_active,
    };
    const res = await fetch(`/api/admin/packages/${params.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) router.push('/admin/packages');
    else { setError(data.error || 'Something went wrong'); setSaving(false); }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-[#E8651A] border-t-transparent rounded-full" />
    </div>
  );
  if (!form) return <div className="text-gray-400">Package not found.</div>;

  const isGroupsLike = form.package_type === 'GROUPS' || (form.package_type === 'WEEKEND' && form.package_subtype === 'Fixed Departure');
  const isFitLike    = form.package_type === 'FIT'    || (form.package_type === 'WEEKEND' && form.package_subtype === 'FIT') || !form.package_type;
  const duration     = `${form.duration_nights}N/${form.duration_days}D`;

  return (
    <div className="max-w-3xl pb-16">
      <div className="mb-6">
        <button onClick={() => router.push('/admin/packages')}
          className="text-sm text-gray-400 hover:text-gray-600 mb-3 flex items-center gap-1">← Back to Packages</button>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Edit Package</h1>
          {form.package_type    && <span className="text-xs bg-orange-100 text-[#E8651A] font-bold px-3 py-1 rounded-full">{form.package_type}</span>}
          {form.package_subtype && <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-3 py-1 rounded-full">{form.package_subtype}</span>}
        </div>
        <p className="text-gray-400 text-sm mt-1">{form.title}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Info */}
        <div className={SECTION}>
          <div className={SECTION_TITLE}>Basic Info</div>

          <div>
            <label className={LABEL}>Package Name *</label>
            <input required value={form.title || ''} onChange={e => setField('title', e.target.value)}
              placeholder="e.g. Kashmir Great Lakes Trek 2025" className={INPUT} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Destination</label>
              <select value={form.destination_type || 'Domestic'} onChange={e => setField('destination_type', e.target.value)} className={INPUT}>
                <option>Domestic</option>
                <option>International</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Location / Country</label>
              <input value={form.location || ''} onChange={e => setField('location', e.target.value)}
                placeholder="e.g. Jammu & Kashmir" className={INPUT} />
            </div>
          </div>

          <div>
            <label className={LABEL}>Region</label>
            <input value={form.state || form.region || ''} onChange={e => setField('state', e.target.value)}
              placeholder="e.g. North India, Southeast Asia" className={INPUT} />
          </div>

          <div className="grid grid-cols-3 gap-4 items-end">
            <div>
              <label className={LABEL}>Nights</label>
              <input type="number" min="0" value={form.duration_nights}
                onChange={e => setField('duration_nights', parseInt(e.target.value) || 0)} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Days</label>
              <input type="number" min="1" value={form.duration_days}
                onChange={e => setField('duration_days', parseInt(e.target.value) || 1)} className={INPUT} />
            </div>
            <div className="pb-0.5">
              <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2.5 text-center">
                <span className="text-[#E8651A] font-bold text-sm">{duration}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Price Per Person (₹) *</label>
              <input required type="number" min="0" value={form.price_per_person || ''}
                onChange={e => setField('price_per_person', e.target.value)}
                placeholder="e.g. 169999" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Original Price (₹) <span className="text-gray-400 font-normal">(strikethrough)</span></label>
              <input type="number" min="0" value={form.original_price || ''}
                onChange={e => setField('original_price', e.target.value)}
                placeholder="e.g. 189999" className={INPUT} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Departure City</label>
              <input value={form.departure_city || ''} onChange={e => setField('departure_city', e.target.value)}
                placeholder="e.g. Delhi, Mumbai" className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Best Time to Visit</label>
              <input value={form.best_time_to_visit || ''} onChange={e => setField('best_time_to_visit', e.target.value)}
                placeholder="e.g. October to May" className={INPUT} />
            </div>
          </div>

          <div>
            <label className={LABEL}>Itinerary PDF URL</label>
            <input value={form.itinerary_pdf || ''} onChange={e => setField('itinerary_pdf', e.target.value)}
              placeholder="https://..." className={INPUT} />
          </div>

          {/* Tour Options */}
          <div>
            <label className={LABEL}>Tour Options <span className="text-gray-400 font-normal normal-case tracking-normal">(optional — multiple pricing)</span></label>
            {(form.tour_options || []).map((opt, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={opt.label || ''}
                  onChange={e => setField('tour_options', form.tour_options.map((o, idx) => idx === i ? { ...o, label: e.target.value } : o))}
                  placeholder="Option name — e.g. RE Himalayan 411 Solo"
                  className={`${INPUT} flex-[2]`} />
                <input type="number" min="0" value={opt.price || ''}
                  onChange={e => setField('tour_options', form.tour_options.map((o, idx) => idx === i ? { ...o, price: e.target.value } : o))}
                  placeholder="Price ₹" className={`${INPUT} flex-1`} />
                <button type="button"
                  onClick={() => setField('tour_options', form.tour_options.filter((_, idx) => idx !== i))}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button type="button"
              onClick={() => setField('tour_options', [...(form.tour_options || []), { label: '', price: '' }])}
              className="text-[#E8651A] text-xs font-semibold flex items-center gap-1 hover:underline">
              <Plus size={13} /> Add Tour Option
            </button>
          </div>

          {isGroupsLike && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Min Group Size</label>
                <input type="number" min="1" value={form.group_size_min || ''}
                  onChange={e => setField('group_size_min', parseInt(e.target.value) || 1)} className={INPUT} />
              </div>
              <div>
                <label className={LABEL}>Max Group Size</label>
                <input type="number" min="1" value={form.group_size_max || ''}
                  onChange={e => setField('group_size_max', parseInt(e.target.value) || 1)} className={INPUT} />
              </div>
            </div>
          )}

          {/* Category */}
          <div>
            <label className={LABEL}>Category</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {CATEGORIES.map(({ key, label }) => (
                <button key={key} type="button" onClick={() => toggleCategory(key)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                    form.category_tag === key
                      ? 'bg-[#E8651A] border-[#E8651A] text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-[#E8651A] hover:text-[#E8651A]'
                  }`}>
                  {form.category_tag === key && <Check size={11} className="inline mr-1" />}{label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
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
                className={`w-10 h-5 rounded-full transition-colors relative ${form.is_active !== false ? 'bg-[#E8651A]' : 'bg-gray-200'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_active !== false ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-gray-600">Active (visible on site)</span>
            </label>
          </div>
        </div>

        {/* Images */}
        <div className={SECTION}>
          <div className={SECTION_TITLE}>Package Images <span className="text-gray-400 font-normal text-xs ml-2">(First image becomes cover)</span></div>
          <div className="grid grid-cols-5 gap-3">
            {(form.images || ['', '', '', '', '']).map((img, i) => (
              <div key={i}>
                <div className="text-[10px] font-semibold text-gray-400 mb-1 text-center">
                  {i === 0 ? 'Cover' : `Photo ${i + 1}`}
                </div>
                <ImageUpload value={img} onChange={url => updateImage(i, url)} />
              </div>
            ))}
          </div>
        </div>

        {/* Dates */}
        {!isFitLike && (
          <div className={SECTION}>
            <div className={SECTION_TITLE}>Trip Dates</div>
            <div className="flex gap-4">
              {[
                { id: 'select_dates', label: 'Select Dates' },
                { id: 'coming_soon',  label: 'Coming Soon' },
                ...(isGroupsLike ? [{ id: 'multi_dates', label: 'Multiple Dates' }] : []),
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
                  <input type="date" value={form.start_date || ''} onChange={e => setField('start_date', e.target.value)} className={INPUT} />
                </div>
                <div>
                  <label className={LABEL}>End Date</label>
                  <input type="date" value={form.end_date || ''} onChange={e => setField('end_date', e.target.value)} className={INPUT} />
                </div>
              </div>
            )}

            {form.date_type === 'multi_dates' && (
              <div className="mt-3 space-y-3">
                {(form.multi_dates || []).map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-[#E8651A] text-xs font-bold flex items-center justify-center">{i + 1}</div>
                    <div className="grid grid-cols-2 gap-3 flex-1">
                      <div>
                        {i === 0 && <label className={LABEL}>Start Date</label>}
                        <input type="date" value={d.start_date || ''}
                          onChange={e => setField('multi_dates', form.multi_dates.map((x, idx) => idx === i ? { ...x, start_date: e.target.value } : x))}
                          className={INPUT} />
                      </div>
                      <div>
                        {i === 0 && <label className={LABEL}>End Date</label>}
                        <input type="date" value={d.end_date || ''}
                          onChange={e => setField('multi_dates', form.multi_dates.map((x, idx) => idx === i ? { ...x, end_date: e.target.value } : x))}
                          className={INPUT} />
                      </div>
                    </div>
                    {(form.multi_dates || []).length > 1 && (
                      <button type="button"
                        onClick={() => setField('multi_dates', form.multi_dates.filter((_, idx) => idx !== i))}
                        className="flex-shrink-0 p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button"
                  onClick={() => setField('multi_dates', [...(form.multi_dates || []), { start_date: '', end_date: '' }])}
                  className="text-[#E8651A] text-xs font-semibold flex items-center gap-1 hover:underline mt-1">
                  <Plus size={13} /> Add Another Date
                </button>
              </div>
            )}
          </div>
        )}

        {/* Itinerary & Details */}
        <div className={SECTION}>
          <div className={SECTION_TITLE}>Itinerary & Details</div>

          <div>
            <label className={LABEL}>About the Trip <span className="text-gray-400 font-normal normal-case tracking-normal">(main description)</span></label>
            <textarea rows={4} value={form.description || ''} onChange={e => setField('description', e.target.value)}
              placeholder="Write a compelling description about this trip…"
              className={`${INPUT} resize-none`} />
          </div>

          {/* Extra About Sections */}
          <div>
            <label className={LABEL}>Additional Sections <span className="text-gray-400 font-normal normal-case tracking-normal">(optional — e.g. "About This Bali Tour", "Why Choose Us")</span></label>
            <div className="space-y-3">
              {(form.about_sections || []).map((sec, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-2 relative">
                  <button type="button" onClick={() => setField('about_sections', form.about_sections.filter((_, idx) => idx !== i))}
                    className="absolute top-3 right-3 p-1 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={13} />
                  </button>
                  <input value={sec.heading || ''} onChange={e => setField('about_sections', form.about_sections.map((s, idx) => idx === i ? { ...s, heading: e.target.value } : s))}
                    placeholder="Section heading — e.g. About This Bali with Gili Islands Tour"
                    className={INPUT} />
                  <textarea rows={3} value={sec.content || ''} onChange={e => setField('about_sections', form.about_sections.map((s, idx) => idx === i ? { ...s, content: e.target.value } : s))}
                    placeholder="Section content…"
                    className={`${INPUT} resize-none`} />
                </div>
              ))}
              <button type="button"
                onClick={() => setField('about_sections', [...(form.about_sections || []), { heading: '', content: '' }])}
                className="text-[#E8651A] text-xs font-semibold flex items-center gap-1 hover:underline">
                <Plus size={13} /> Add Section
              </button>
            </div>
          </div>

          <DynamicList label="Highlights" items={form.highlights}
            onChange={v => setField('highlights', v)}
            placeholder="e.g. Sunrise at 4500m with panoramic Himalayan views" />

          <DynamicList label="What's Included" items={form.inclusions}
            onChange={v => setField('inclusions', v)}
            placeholder="e.g. Accommodation on triple sharing basis" />

          <DynamicList label="What's Not Included" items={form.exclusions}
            onChange={v => setField('exclusions', v)}
            placeholder="e.g. Personal travel insurance" />

          <DynamicList label="Things to Carry" items={form.things_to_carry}
            onChange={v => setField('things_to_carry', v)}
            placeholder="e.g. Warm jacket, sunscreen, comfortable shoes" />

          <DynamicList label="Important Notes" items={form.important_notes}
            onChange={v => setField('important_notes', v)}
            placeholder="e.g. Yellow Fever vaccination mandatory for Kenya" />
        </div>

        {/* Day-wise Itinerary */}
        <div className={SECTION}>
          <div className={SECTION_TITLE}>Day-wise Overview</div>
          <div className="space-y-5">
            {itinerary.map((day, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
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
                    placeholder={`Day ${day.day} title — e.g. Arrival in Srinagar`} className={INPUT} />
                  <textarea rows={3} value={day.description} onChange={e => setDayField(i, 'description', e.target.value)}
                    placeholder="Describe what happens on this day…" className={`${INPUT} resize-none`} />
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

        {error && <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}
        <div className="flex gap-3">
          <button type="button" onClick={() => router.push('/admin/packages')}
            className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 bg-[#E8651A] text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-orange-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
            {saving
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
              : <><Check size={16} /> Save Changes</>
            }
          </button>
        </div>
      </form>
    </div>
  );
}
