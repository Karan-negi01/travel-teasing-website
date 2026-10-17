import { supabaseAdmin } from '@/lib/supabase-server';

export const TRIP_SELECT = `
  *,
  packages(id, slug, title, location, state, country, cover_image, price_per_person, duration_days, duration_nights, group_size_min, group_size_max, is_fit_group, package_type, category),
  creator:user_profiles!creator_id(id, full_name, profile_photo, city, is_verified),
  community_trip_members(user_id, role, status, payment_status)
`;

export const MEMBER_PROFILE_SELECT = `
  *,
  user_profiles(id, full_name, profile_photo, city, gender, date_of_birth, trip_style, is_verified, bio, instagram_handle, created_at)
`;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function findTrip(idOrCode, select = TRIP_SELECT) {
  const col = UUID_RE.test(idOrCode) ? 'id' : 'share_code';
  const { data, error } = await supabaseAdmin.from('community_trips').select(select).eq(col, idOrCode).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export function makeShareCode() {
  const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
  let s = '';
  for (let i = 0; i < 8; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}

// Recompute open / full / confirmed from the member list. Cancelled and completed are sticky.
export async function syncTripStatus(tripId) {
  const { data: trip } = await supabaseAdmin.from('community_trips').select('id,status,total_spots').eq('id', tripId).single();
  if (!trip || ['cancelled', 'completed'].includes(trip.status)) return trip?.status;
  const { data: members } = await supabaseAdmin.from('community_trip_members').select('status,payment_status').eq('trip_id', tripId);
  const approved = (members || []).filter(m => m.status === 'approved');
  let next = 'open';
  if (approved.length >= trip.total_spots) {
    next = approved.every(m => m.payment_status === 'paid') ? 'confirmed' : 'full';
  }
  if (next !== trip.status) {
    await supabaseAdmin.from('community_trips').update({ status: next, updated_at: new Date().toISOString() }).eq('id', tripId);
  }
  return next;
}

// Strip private fields from a member's profile before sending it to other travellers.
export function publicMember(m) {
  const p = m.user_profiles || {};
  const { date_of_birth, ...rest } = p;
  return {
    id: m.id,
    user_id: m.user_id,
    role: m.role,
    status: m.status,
    payment_status: m.payment_status,
    message: m.message,
    created_at: m.created_at,
    decided_at: m.decided_at,
    profile: { ...rest, age: ageFromDobServer(date_of_birth) },
  };
}

function ageFromDobServer(dob) {
  if (!dob) return null;
  const d = new Date(dob); if (isNaN(d)) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age >= 0 && age < 120 ? age : null;
}
