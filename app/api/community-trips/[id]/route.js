import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorized, forbidden, badRequest } from '@/lib/auth-server';
import { findTrip, syncTripStatus, publicMember, MEMBER_PROFILE_SELECT } from '@/lib/communityTrips-server';
import { GENDER_RULES, VIBES } from '@/lib/communityTrips';

export const dynamic = 'force-dynamic';

// GET /api/community-trips/[id or share_code] — public view; creator additionally sees pending requests
export async function GET(request, { params }) {
  let trip;
  try { trip = await findTrip(params.id); } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
  if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });

  const viewer = await getUserFromRequest(request);
  const isCreator = !!viewer && viewer.id === trip.creator_id;

  const { data: memberRows } = await supabaseAdmin
    .from('community_trip_members').select(MEMBER_PROFILE_SELECT).eq('trip_id', trip.id).order('created_at', { ascending: true });

  const all = (memberRows || []).map(publicMember);
  const members = all.filter(m => m.status === 'approved');
  const requests = isCreator ? all.filter(m => m.status === 'requested') : [];
  const history = isCreator ? all.filter(m => ['rejected', 'removed', 'left'].includes(m.status)) : [];
  const mine = viewer ? all.find(m => m.user_id === viewer.id) || null : null;

  // Hide payment status of others from non-creators
  const scrub = (m) => isCreator || (viewer && m.user_id === viewer.id) ? m : { ...m, payment_status: undefined, message: undefined };

  const { community_trip_members, ...tripOut } = trip;
  return NextResponse.json({
    trip: { ...tripOut, approved_count: members.length },
    members: members.map(scrub),
    requests,
    history,
    viewer: { logged_in: !!viewer, is_creator: isCreator, membership: mine ? { status: mine.status, payment_status: mine.payment_status } : null },
  });
}

// PATCH /api/community-trips/[id] — creator edits rules / cancels
export async function PATCH(request, { params }) {
  const user = await getUserFromRequest(request);
  if (!user) return unauthorized();
  const trip = await findTrip(params.id, '*');
  if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
  if (trip.creator_id !== user.id) return forbidden('Only the trip creator can change this trip');

  const body = await request.json().catch(() => ({}));

  if (body.action === 'cancel') {
    if (['completed', 'cancelled'].includes(trip.status)) return badRequest('This trip is already closed');
    await supabaseAdmin.from('community_trips').update({ status: 'cancelled', updated_at: new Date().toISOString() }).eq('id', trip.id);
    return NextResponse.json({ success: true, status: 'cancelled' });
  }

  if (['completed', 'cancelled'].includes(trip.status)) return badRequest('A closed trip cannot be edited');

  const updates = {};
  if (body.title !== undefined) updates.title = (body.title || '').trim().slice(0, 80) || null;
  if (body.note !== undefined) updates.note = (body.note || '').trim().slice(0, 600) || null;
  if (body.departure_city !== undefined) updates.departure_city = (body.departure_city || '').trim().slice(0, 60) || null;
  if (body.vibe_tags !== undefined) updates.vibe_tags = (Array.isArray(body.vibe_tags) ? body.vibe_tags : []).filter(v => VIBES.includes(v)).slice(0, 4);
  if (body.gender_rule !== undefined && GENDER_RULES.some(g => g.value === body.gender_rule)) updates.gender_rule = body.gender_rule;
  if (body.age_min !== undefined) updates.age_min = body.age_min ? parseInt(body.age_min, 10) : null;
  if (body.age_max !== undefined) updates.age_max = body.age_max ? parseInt(body.age_max, 10) : null;
  if (body.start_date !== undefined) {
    if (body.start_date < new Date().toISOString().slice(0, 10)) return badRequest('Start date must be in the future');
    updates.start_date = body.start_date;
  }
  if (body.end_date !== undefined) updates.end_date = body.end_date || null;
  if (body.total_spots !== undefined) {
    const spots = parseInt(body.total_spots, 10);
    const { count } = await supabaseAdmin.from('community_trip_members').select('id', { count: 'exact', head: true }).eq('trip_id', trip.id).eq('status', 'approved');
    if (!spots || spots < 2) return badRequest('A trip needs at least 2 people');
    if (spots < (count || 1)) return badRequest(`You already have ${count} approved members`);
    updates.total_spots = spots;
  }
  if ((updates.age_min ?? trip.age_min) && (updates.age_max ?? trip.age_max) && (updates.age_min ?? trip.age_min) > (updates.age_max ?? trip.age_max)) {
    return badRequest('Minimum age cannot be greater than maximum age');
  }
  if (Object.keys(updates).length === 0) return badRequest('Nothing to update');
  updates.updated_at = new Date().toISOString();

  const { error } = await supabaseAdmin.from('community_trips').update(updates).eq('id', trip.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const status = await syncTripStatus(trip.id);
  return NextResponse.json({ success: true, status });
}
