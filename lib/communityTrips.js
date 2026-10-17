// Shared (client + server safe) constants and helpers for user-created trips on FIT packages.
// The feature name is still being decided — change CT.label / CT.singular here and it updates everywhere.
export const CT = {
  label: 'Community Trips',
  singular: 'Community Trip',
  base: '/community-trips',
  tagline: 'Trips planned by travellers like you. Pick a package, set the rules, find your people.',
};

export const VIBES = ['Chill', 'Adventure', 'Party', 'Cultural', 'Spiritual', 'Photography', 'Trekking', 'Backpacking', 'Luxury', 'Road Trip'];

export const GENDER_RULES = [
  { value: 'any',    label: 'Everyone welcome', short: 'Mixed group' },
  { value: 'female', label: 'Women only',       short: 'Women only' },
  { value: 'male',   label: 'Men only',         short: 'Men only' },
];

export const TRIP_STATUS = {
  open:      { label: 'Open',          bg: '#e0f4f8', fg: '#1f77a3', hint: 'Accepting join requests' },
  full:      { label: 'Group full',    bg: '#fff4d6', fg: '#8a5d00', hint: 'All spots filled — payment pending' },
  confirmed: { label: 'Confirmed',     bg: '#e6f6ee', fg: '#1f7a4d', hint: 'Everyone has paid. Pack your bags!' },
  completed: { label: 'Completed',     bg: '#eef0f3', fg: '#5d6673', hint: 'This trip is done' },
  cancelled: { label: 'Cancelled',     bg: '#fdecec', fg: '#b3261e', hint: 'This trip was cancelled' },
};

export const MEMBER_STATUS = {
  requested: { label: 'Requested', bg: '#fff4d6', fg: '#8a5d00' },
  approved:  { label: 'Approved',  bg: '#e6f6ee', fg: '#1f7a4d' },
  rejected:  { label: 'Declined',  bg: '#fdecec', fg: '#b3261e' },
  removed:   { label: 'Removed',   bg: '#fdecec', fg: '#b3261e' },
  left:      { label: 'Left',      bg: '#eef0f3', fg: '#5d6673' },
};

export function isFitPackage(pkg) {
  if (!pkg) return false;
  if (pkg.is_fit_group) return true;
  if ((pkg.package_type || '').toUpperCase() === 'FIT') return true;
  return pkg.category === 'fit';
}

export function ageFromDob(dob) {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d)) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age >= 0 && age < 120 ? age : null;
}

export function fmtDate(d, opts = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!d) return '';
  const dt = new Date(d);
  return isNaN(dt) ? '' : dt.toLocaleDateString('en-IN', opts);
}

export function fmtRange(from, to) {
  if (!from) return 'Dates TBD';
  if (!to) return fmtDate(from);
  const a = new Date(from), b = new Date(to);
  const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  return sameMonth
    ? `${a.getDate()} – ${fmtDate(to)}`
    : `${fmtDate(from, { day: 'numeric', month: 'short' })} – ${fmtDate(to)}`;
}

export function tripTitle(trip) {
  return trip?.title || trip?.packages?.title || 'Trip';
}

export function approvedCount(trip) {
  return (trip?.community_trip_members || trip?.members || []).filter(m => m.status === 'approved').length;
}

export function spotsLeft(trip) {
  return Math.max(0, (trip?.total_spots || 0) - approvedCount(trip));
}

export function shareUrl(trip) {
  if (typeof window === 'undefined') return `${CT.base}/${trip.share_code || trip.id}`;
  return `${window.location.origin}${CT.base}/${trip.share_code || trip.id}`;
}

export function daysUntil(d) {
  if (!d) return null;
  const diff = Math.ceil((new Date(d).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / 86400000);
  return diff;
}
