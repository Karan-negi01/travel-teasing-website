import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorized, forbidden, badRequest } from '@/lib/auth-server';
import { findTrip, syncTripStatus } from '@/lib/communityTrips-server';

export const dynamic = 'force-dynamic';

// PATCH { action: 'approve' | 'reject' | 'remove' } — creator only
export async function PATCH(request, { params }) {
  const user = await getUserFromRequest(request);
  if (!user) return unauthorized();
  const trip = await findTrip(params.id, '*');
  if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
  if (trip.creator_id !== user.id) return forbidden('Only the trip creator can manage members');
  if (params.userId === user.id) return badRequest('You cannot change your own membership');
  if (['cancelled', 'completed'].includes(trip.status)) return badRequest('This trip is closed');

  const { action } = await request.json().catch(() => ({}));
  const { data: member } = await supabaseAdmin.from('community_trip_members').select('*').eq('trip_id', trip.id).eq('user_id', params.userId).maybeSingle();
  if (!member) return NextResponse.json({ error: 'Member not found' }, { status: 404 });

  const now = new Date().toISOString();
  let update;
  if (action === 'approve') {
    if (member.status !== 'requested') return badRequest('Only pending requests can be approved');
    const { count } = await supabaseAdmin.from('community_trip_members').select('id', { count: 'exact', head: true }).eq('trip_id', trip.id).eq('status', 'approved');
    if ((count || 0) >= trip.total_spots) return badRequest('The group is already full. Increase the group size to approve more people.');
    update = { status: 'approved', decided_at: now };
  } else if (action === 'reject') {
    if (member.status !== 'requested') return badRequest('Only pending requests can be declined');
    update = { status: 'rejected', decided_at: now };
  } else if (action === 'remove') {
    if (member.status !== 'approved') return badRequest('Only approved members can be removed');
    update = { status: 'removed', decided_at: now };
  } else {
    return badRequest('Unknown action');
  }

  const { error } = await supabaseAdmin.from('community_trip_members').update(update).eq('id', member.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const status = await syncTripStatus(trip.id);
  return NextResponse.json({ success: true, member_status: update.status, status });
}
