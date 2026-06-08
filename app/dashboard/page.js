'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { MapPin, Plus, Globe, Award, CheckCircle, X } from 'lucide-react';

const INDIAN_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jammu & Kashmir','Jharkhand','Karnataka','Kerala','Ladakh','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];
const TRIP_TYPES = ['Solo', 'Group', 'Family', 'Sacred', 'Adventure', 'Corporate'];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [trips, setTrips] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [addTripOpen, setAddTripOpen] = useState(false);
  const [tripForm, setTripForm] = useState({ destination: '', state: '', country: 'India', trip_type: '', travel_date_from: '', travel_date_to: '', cover_photo: '', caption: '', booked_through_platform: false });
  const [tripLoading, setTripLoading] = useState(false);
  const [newBadges, setNewBadges] = useState([]);
  const [settingsForm, setSettingsForm] = useState({});
  const [settingsSaving, setSettingsSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data?.user) { router.push('/login'); return; }
      setUser(data.user);
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const res = await fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } });
      const d = await res.json();
      setProfile(d.profile); setTrips(d.trips || []); setBadges(d.badges || []);
      setSettingsForm(d.profile || {});
      setLoading(false);
    });
  }, [router]);

  async function addTrip(e) {
    e.preventDefault();
    setTripLoading(true);
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    const res = await fetch('/api/profile/trips/add', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(tripForm) });
    const data = await res.json();
    if (data.success) {
      if (data.new_badges?.length) setNewBadges(data.new_badges);
      const refreshed = await fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } });
      const d = await refreshed.json();
      setTrips(d.trips || []); setBadges(d.badges || []);
      setAddTripOpen(false);
      setTripForm({ destination: '', state: '', country: 'India', trip_type: '', travel_date_from: '', travel_date_to: '', cover_photo: '', caption: '', booked_through_platform: false });
    }
    setTripLoading(false);
  }

  async function saveSettings(e) {
    e.preventDefault();
    setSettingsSaving(true);
    const token = (await supabase.auth.getSession()).data.session?.access_token;
    await fetch('/api/profile/update', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(settingsForm) });
    setSettingsSaving(false);
  }

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-[#E8651A] border-t-transparent rounded-full" /></div>;

  const statesVisited = [...new Set(trips.map(t => t.state).filter(Boolean))];
  const tabClass = (t) => `px-4 py-2 text-sm font-medium rounded-full transition-all ${activeTab === t ? 'bg-[#E8651A] text-white' : 'text-gray-600 hover:bg-gray-100'}`;

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container-max py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'Traveler'}! 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
          </div>
          <button onClick={() => setAddTripOpen(true)} className="btn-primary text-sm">
            <Plus size={16} /> Add Trip
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {['overview', 'trips', 'settings'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={tabClass(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Trips Completed', value: trips.length, icon: '🗺️' },
                { label: 'States Visited', value: statesVisited.length, icon: '📍' },
                { label: 'Badges Earned', value: badges.length, icon: '🏅' },
              ].map(s => (
                <div key={s.label} className="card p-6 flex items-center gap-4">
                  <div className="text-3xl">{s.icon}</div>
                  <div>
                    <p className="text-2xl font-bold text-[#1a1a2e]">{s.value}</p>
                    <p className="text-gray-500 text-sm">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setAddTripOpen(true)} className="btn-primary text-sm"><Plus size={16} /> Add a Trip</button>
              <Link href="/packages" className="btn-outline text-sm">Browse Packages</Link>
              <Link href="/group-trips" className="btn-outline text-sm">Create Group Trip</Link>
            </div>
            {trips.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-[#1a1a2e] mb-4">Recent Trips</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {trips.slice(0, 3).map(t => (
                    <div key={t.id} className="card overflow-hidden">
                      {t.cover_photo ? (
                        <div className="relative aspect-video"><Image src={t.cover_photo} alt={t.destination} fill className="object-cover" sizes="300px" /></div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-4xl">🏔️</div>
                      )}
                      <div className="p-4">
                        <h3 className="font-bold text-[#1a1a2e]">{t.destination}</h3>
                        <p className="text-gray-400 text-xs">{t.state} · {t.trip_type}</p>
                        {t.booked_through_platform && <span className="text-green-600 text-xs font-medium flex items-center gap-1 mt-1"><CheckCircle size={12} /> Booked via Travel Teasing</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {badges.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-[#1a1a2e] mb-4">Your Badges</h2>
                <div className="flex flex-wrap gap-3">
                  {badges.map(b => (
                    <div key={b.id} className="bg-white rounded-xl shadow-sm px-4 py-3 flex items-center gap-3">
                      <span className="text-2xl">{b.badges?.icon}</span>
                      <div>
                        <p className="font-semibold text-sm text-[#1a1a2e]">{b.badges?.name}</p>
                        <p className="text-xs text-gray-400">{b.badges?.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Trips Tab */}
        {activeTab === 'trips' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1a1a2e]">My Travel Portfolio</h2>
              <button onClick={() => setAddTripOpen(true)} className="btn-primary text-sm"><Plus size={16} /> Add Trip</button>
            </div>
            <div className="flex gap-6 text-sm text-gray-500 mb-6">
              <span>✈️ {trips.length} trips</span>
              <span>📍 {statesVisited.length} states</span>
            </div>
            {statesVisited.length > 0 && (
              <div className="card p-5 mb-6">
                <h3 className="font-semibold text-[#1a1a2e] mb-3">States Visited</h3>
                <div className="flex flex-wrap gap-2">
                  {statesVisited.map(s => <span key={s} className="bg-orange-50 text-[#E8651A] text-xs px-3 py-1 rounded-full font-medium">{s}</span>)}
                </div>
              </div>
            )}
            {trips.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🗺️</div>
                <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">No trips yet</h3>
                <p className="text-gray-500 mb-5">Add your first trip to start building your travel portfolio!</p>
                <button onClick={() => setAddTripOpen(true)} className="btn-primary"><Plus size={16} /> Add Your First Trip</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {trips.map(t => (
                  <div key={t.id} className="card overflow-hidden">
                    {t.cover_photo ? (
                      <div className="relative aspect-video"><Image src={t.cover_photo} alt={t.destination} fill className="object-cover" sizes="350px" /></div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 flex items-center justify-center text-5xl">🏔️</div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-[#1a1a2e]">{t.destination}</h3>
                          <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1"><MapPin size={11} /> {t.state}{t.state && t.trip_type ? ' · ' : ''}{t.trip_type}</p>
                        </div>
                        {t.trip_type && <span className="bg-orange-100 text-[#E8651A] text-xs px-2 py-0.5 rounded-full capitalize">{t.trip_type}</span>}
                      </div>
                      {t.caption && <p className="text-gray-500 text-xs mt-2 line-clamp-2">{t.caption}</p>}
                      {(t.travel_date_from || t.travel_date_to) && (
                        <p className="text-gray-400 text-xs mt-2">
                          {t.travel_date_from ? new Date(t.travel_date_from).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : ''}
                          {t.travel_date_from && t.travel_date_to ? ' – ' : ''}
                          {t.travel_date_to ? new Date(t.travel_date_to).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : ''}
                        </p>
                      )}
                      {t.booked_through_platform && (
                        <span className="text-green-600 text-xs font-medium flex items-center gap-1 mt-2"><CheckCircle size={12} /> Booked via Travel Teasing</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <form onSubmit={saveSettings} className="max-w-xl space-y-5">
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">Profile Settings</h2>
            {[
              { label: 'Full Name', key: 'full_name', placeholder: 'Your full name' },
              { label: 'City', key: 'city', placeholder: 'Your city' },
              { label: 'Bio', key: 'bio', placeholder: 'A short bio about yourself', textarea: true },
              { label: 'Instagram Handle', key: 'instagram_handle', placeholder: '@yourusername' },
              { label: 'Profile Photo URL', key: 'profile_photo', placeholder: 'https://...' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                {field.textarea ? (
                  <textarea rows={3} value={settingsForm[field.key] || ''} onChange={e => setSettingsForm(f => ({...f, [field.key]: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A] resize-none" placeholder={field.placeholder} />
                ) : (
                  <input value={settingsForm[field.key] || ''} onChange={e => setSettingsForm(f => ({...f, [field.key]: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder={field.placeholder} />
                )}
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="flex gap-2">
                {['Male', 'Female', 'Other'].map(g => (
                  <button key={g} type="button" onClick={() => setSettingsForm(f => ({...f, gender: g}))}
                    className={`flex-1 py-2 rounded-lg text-sm border font-medium transition-all ${settingsForm.gender === g ? 'bg-[#E8651A] text-white border-[#E8651A]' : 'border-gray-300 text-gray-600'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={settingsSaving} className="btn-primary">{settingsSaving ? 'Saving...' : 'Save Changes'}</button>
          </form>
        )}
      </div>

      {/* Add Trip Modal */}
      {addTripOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60" onClick={e => e.target === e.currentTarget && setAddTripOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-[#1a1a2e]">Add a Trip</h3>
              <button onClick={() => setAddTripOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
            </div>
            <form onSubmit={addTrip} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
                <input required value={tripForm.destination} onChange={e => setTripForm(f => ({...f, destination: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="e.g. Kasol, Manali, Ladakh" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <select value={tripForm.state} onChange={e => setTripForm(f => ({...f, state: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]">
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
                  <select value={tripForm.trip_type} onChange={e => setTripForm(f => ({...f, trip_type: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]">
                    <option value="">Select type</option>
                    {TRIP_TYPES.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input type="date" value={tripForm.travel_date_from} onChange={e => setTripForm(f => ({...f, travel_date_from: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input type="date" value={tripForm.travel_date_to} onChange={e => setTripForm(f => ({...f, travel_date_to: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Photo URL</label>
                <input type="url" value={tripForm.cover_photo} onChange={e => setTripForm(f => ({...f, cover_photo: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A]" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                <textarea rows={2} value={tripForm.caption} onChange={e => setTripForm(f => ({...f, caption: e.target.value}))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8651A] resize-none" placeholder="A short caption about this trip..." />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={tripForm.booked_through_platform} onChange={e => setTripForm(f => ({...f, booked_through_platform: e.target.checked}))} className="w-4 h-4 accent-[#E8651A]" />
                <span className="text-sm text-gray-700">This trip was booked through Travel Teasing</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setAddTripOpen(false)} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-full text-sm font-semibold">Cancel</button>
                <button type="submit" disabled={tripLoading} className="flex-1 btn-primary justify-center text-sm py-2.5">{tripLoading ? 'Adding...' : 'Add Trip'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New badges celebration */}
      {newBadges.length > 0 && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-[#1a1a2e] mb-2">New Badge{newBadges.length > 1 ? 's' : ''} Earned!</h3>
            <div className="space-y-3 my-5">
              {newBadges.map(b => (
                <div key={b.id} className="flex items-center gap-3 bg-orange-50 rounded-xl p-3">
                  <span className="text-3xl">{b.icon}</span>
                  <div className="text-left">
                    <p className="font-bold text-[#1a1a2e]">{b.name}</p>
                    <p className="text-xs text-gray-500">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setNewBadges([])} className="btn-primary w-full justify-center">Awesome!</button>
          </div>
        </div>
      )}
    </div>
  );
}
