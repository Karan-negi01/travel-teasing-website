import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorized, badRequest } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

async function ownTrip(user, id) {
  const { data } = await supabaseAdmin.from('user_trips').select('*').eq('id', id).eq('user_id', user.id).maybeSingle();
  return data;
}

// PATCH /api/profile/trips/[id] — edit album details or toggle public/private
export async function PATCH(request, { params }) {
  const user = await getUserFromRequest(request);
  if (!user) return unauthorized();
  const trip = await ownTrip(user, params.id);
  if (!trip) return NextResponse.json({ error: 'Album not found' }, { status: 404 });

  const body = await request.json().catch(() => ({}));
  const allowed = ['destination', 'state', 'country', 'trip_type', 'travel_date_from', 'travel_date_to', 'cover_photo', 'caption', 'booked_through_platform', 'is_public'];
  const updates = {};
  for (const k of allowed) if (body[k] !== undefined) updates[k] = body[k] === '' ? null : body[k];
  if (updates.destination !== undefined && !updates.destination) return badRequest('Album needs a destination name');
  if (Object.keys(updates).length === 0) return badRequest('Nothing to update');

  const { data, error } = await supabaseAdmin.from('user_trips').update(updates).eq('id', trip.id).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, trip: data });
}

// DELETE /api/profile/trips/[id] — delete album and its photos
export async function DELETE(request, { params }) {
  const user = await getUserFromRequest(request);
  if (!user) return unauthorized();
  const trip = await ownTrip(user, params.id);
  if (!trip) return NextResponse.json({ error: 'Album not found' }, { status: 404 });

  // Best-effort cleanup of stored files
  const prefix = `gallery/${user.id}/${trip.id}`;
  const { data: files } = await supabaseAdmin.storage.from('travel-images').list(prefix, { limit: 200 });
  if (files?.length) await supabaseAdmin.storage.from('travel-images').remove(files.map(f => `${prefix}/${f.name}`));

  const { error } = await supabaseAdmin.from('user_trips').delete().eq('id', trip.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
