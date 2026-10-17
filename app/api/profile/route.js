import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorized } from '@/lib/auth-server';
import { TRIP_SELECT } from '@/lib/communityTrips-server';

export const dynamic = 'force-dynamic';

// GET /api/profile — everything the dashboard needs for the logged-in traveller
export async function GET(request) {
  const user = await getUserFromRequest(request);
  if (!user) return unauthorized();

  const [profileRes, tripsRes, badgesRes, memberRes] = await Promise.all([
    supabaseAdmin.from('user_profiles').select('*').eq('id', user.id).single(),
    supabaseAdmin.from('user_trips').select('*, user_trip_photos(*)').eq('user_id', user.id).order('travel_date_from', { ascending: false, nullsFirst: false }),
    supabaseAdmin.from('user_badges').select('*, badges(*)').eq('user_id', user.id),
    supabaseAdmin.from('community_trip_members').select('trip_id,status,payment_status,role').eq('user_id', user.id),
  ]);

  const memberships = memberRes.data || [];
  const tripIds = memberships.map(m => m.trip_id);
  let communityTrips = [];
  if (tripIds.length) {
    const { data } = await supabaseAdmin.from('community_trips').select(TRIP_SELECT).in('id', tripIds).order('start_date', { ascending: true });
    const byId = Object.fromEntries(memberships.map(m => [m.trip_id, m]));
    communityTrips = (data || []).map(t => {
      const mine = byId[t.id];
      const pending = (t.community_trip_members || []).filter(m => m.status === 'requested').length;
      const approved = (t.community_trip_members || []).filter(m => m.status === 'approved').length;
      return { ...t, my_role: mine?.role, my_status: mine?.status, my_payment_status: mine?.payment_status, pending_requests: t.creator_id === user.id ? pending : 0, approved_count: approved };
    });
  }

  const trips = (tripsRes.data || []).map(t => ({ ...t, photos: (t.user_trip_photos || []).sort((a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at)), user_trip_photos: undefined }));

  return NextResponse.json({
    profile: profileRes.data,
    trips,
    badges: badgesRes.data || [],
    community_trips: communityTrips,
    email: user.email,
  });
}
