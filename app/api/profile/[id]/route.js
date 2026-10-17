import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { ageFromDob } from '@/lib/communityTrips';
import { TRIP_SELECT } from '@/lib/communityTrips-server';

export const dynamic = 'force-dynamic';

// GET /api/profile/[id] — public profile: only public albums, age (never DOB), open trips they are hosting
export async function GET(request, { params }) {
  const [profileRes, tripsRes, badgesRes, hostingRes] = await Promise.all([
    supabaseAdmin.from('user_profiles').select('id,full_name,city,gender,date_of_birth,bio,profile_photo,is_verified,trip_style,budget_preference,instagram_handle,created_at').eq('id', params.id).single(),
    supabaseAdmin.from('user_trips').select('*, user_trip_photos(*)').eq('user_id', params.id).eq('is_public', true).order('travel_date_from', { ascending: false, nullsFirst: false }),
    supabaseAdmin.from('user_badges').select('*, badges(*)').eq('user_id', params.id),
    supabaseAdmin.from('community_trips').select(TRIP_SELECT).eq('creator_id', params.id).in('status', ['open', 'full', 'confirmed']).gte('start_date', new Date().toISOString().slice(0, 10)).order('start_date'),
  ]);

  if (!profileRes.data) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  const { date_of_birth, ...profile } = profileRes.data;

  const trips = (tripsRes.data || []).map(t => ({ ...t, photos: (t.user_trip_photos || []).sort((a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at)), user_trip_photos: undefined }));

  return NextResponse.json({
    profile: { ...profile, age: ageFromDob(date_of_birth) },
    trips,
    badges: badgesRes.data || [],
    hosting: hostingRes.data || [],
  });
}
