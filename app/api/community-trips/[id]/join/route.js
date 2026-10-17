import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorized, badRequest } from '@/lib/auth-server';
import { findTrip, syncTripStatus } from '@/lib/communityTrips-server';
import { ageFromDob } from '@/lib/communityTrips';

export const dynamic = 'force-dynamic';

// POST — request to join
export async function POST(request, { params }) {
  const user = await getUserFromRequest(request);
  if (!user) return unauthorized('Log in to request a spot on this trip');
  const trip = await findTrip(params.id, '*');
  if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
  if (trip.creator_id === user.id) return badRequest('You created this trip');
  if (trip.status !== 'open') return badRequest('This trip is not accepting requests right now');

  const { data: profile } = await supabaseAdmin.from('user_profiles').select('gender,date_of_birth,full_name').eq('id', user.id).single();
  if (!profile) return badRequest('Complete your profile first');

  if (trip.gender_rule !== 'any') {
    const g = (profile.gender || '').toLowerCase();
    if (!g) return badRequest('This trip has a gender rule. Set your gender in Dashboard → Settings first.');
    if (g !== trip.gender_rule) return badRequest(trip.gender_rule === 'female' ? 'This trip is for women only' : 'This trip is for men only');
  }
  if (trip.age_min || trip.age_max) {
    const age = ageFromDob(profile.date_of_birth);
    if (age === null) return badRequest('This trip has an age range. Add your date of birth in Dashboard → Settings first.');
    if (trip.age_min && age < trip.age_min) return badRequest(`This trip is for travellers aged ${trip.age_min}+`);
    if (trip.age_max && age > trip.age_max) return badRequest(`This trip is for travellers up to ${trip.age_max} years`);
  }

  const body = await request.json().catch(() => ({}));
  const message = (body.message || '').trim().slice(0, 400) || null;

  const { data: existing } = await supabaseAdmin.from('community_trip_members').select('id,status').eq('trip_id', trip.id).eq('user_id', user.id).maybeSingle();
  if (existing) {
    if (existing.status === 'requested') return badRequest('Your request is already with the creator');
    if (existing.status === 'approved') return badRequest('You are already on this trip');
    if (['rejected', 'removed'].includes(existing.status)) return badRequest('The creator has closed this trip to you');
    // 'left' → allow re-request
    const { error } = await supabaseAdmin.from('community_trip_members').update({ status: 'requested', message, decided_at: null, created_at: new Date().toISOString() }).eq('id', existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, status: 'requested' });
  }

  const { error } = await supabaseAdmin.from('community_trip_members').insert({ trip_id: trip.id, user_id: user.id, role: 'member', status: 'requested', message });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, status: 'requested' });
}

// DELETE — withdraw a request or leave the trip
export async function DELETE(request, { params }) {
  const user = await getUserFromRequest(request);
  if (!user) return unauthorized();
  const trip = await findTrip(params.id, '*');
  if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
  if (trip.creator_id === user.id) return badRequest('The creator cannot leave. Cancel the trip instead.');

  const { data: existing } = await supabaseAdmin.from('community_trip_members').select('id,status').eq('trip_id', trip.id).eq('user_id', user.id).maybeSingle();
  if (!existing || !['requested', 'approved'].includes(existing.status)) return badRequest('You are not on this trip');

  const { error } = existing.status === 'requested'
    ? await supabaseAdmin.from('community_trip_members').delete().eq('id', existing.id)
    : await supabaseAdmin.from('community_trip_members').update({ status: 'left', decided_at: new Date().toISOString() }).eq('id', existing.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const status = await syncTripStatus(trip.id);
  return NextResponse.json({ success: true, status });
}
