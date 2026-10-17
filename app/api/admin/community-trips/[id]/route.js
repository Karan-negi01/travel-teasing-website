import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { isAdminRequest, unauthorized, badRequest } from '@/lib/auth-server';
import { findTrip, syncTripStatus, publicMember, MEMBER_PROFILE_SELECT } from '@/lib/communityTrips-server';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  if (!isAdminRequest()) return unauthorized('Admin login required');
  const trip = await findTrip(params.id);
  if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
  const { data: rows } = await supabaseAdmin.from('community_trip_members').select(MEMBER_PROFILE_SELECT).eq('trip_id', trip.id).order('created_at');
  const members = (rows || []).map(publicMember);
  // Admin also needs phone numbers to collect payment
  const ids = members.map(m => m.user_id);
  const { data: phones } = ids.length ? await supabaseAdmin.from('user_profiles').select('id,phone').in('id', ids) : { data: [] };
  const phoneMap = Object.fromEntries((phones || []).map(p => [p.id, p.phone]));
  return NextResponse.json({ trip, members: members.map(m => ({ ...m, phone: phoneMap[m.user_id] || null })) });
}

// PATCH { status } | { member_user_id, payment_status }
export async function PATCH(request, { params }) {
  if (!isAdminRequest()) return unauthorized('Admin login required');
  const trip = await findTrip(params.id, '*');
  if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
  const body = await request.json().catch(() => ({}));

  if (body.member_user_id && body.payment_status) {
    if (!['pending', 'paid', 'refunded'].includes(body.payment_status)) return badRequest('Invalid payment status');
    const { error } = await supabaseAdmin.from('community_trip_members').update({ payment_status: body.payment_status }).eq('trip_id', trip.id).eq('user_id', body.member_user_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const status = await syncTripStatus(trip.id);
    return NextResponse.json({ success: true, status });
  }

  if (body.status) {
    if (!['open', 'full', 'confirmed', 'completed', 'cancelled'].includes(body.status)) return badRequest('Invalid status');
    const { error } = await supabaseAdmin.from('community_trips').update({ status: body.status, updated_at: new Date().toISOString() }).eq('id', trip.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    // Completed trips seed an album in every approved member's gallery
    if (body.status === 'completed') {
      const { data: members } = await supabaseAdmin.from('community_trip_members').select('user_id').eq('trip_id', trip.id).eq('status', 'approved');
      const { data: pkg } = await supabaseAdmin.from('packages').select('title,location,state,country,cover_image').eq('id', trip.package_id).single();
      for (const m of members || []) {
        const { data: existing } = await supabaseAdmin.from('user_trips').select('id').eq('user_id', m.user_id).eq('community_trip_id', trip.id).maybeSingle();
        if (existing) continue;
        await supabaseAdmin.from('user_trips').insert({
          user_id: m.user_id, package_id: trip.package_id, community_trip_id: trip.id,
          destination: pkg?.location || pkg?.title || 'Trip', state: pkg?.state || null, country: pkg?.country || 'India',
          trip_type: 'group', travel_date_from: trip.start_date, travel_date_to: trip.end_date,
          cover_photo: pkg?.cover_image || null, caption: `Travelled with Travel Teasing: ${pkg?.title || ''}`.trim(),
          booked_through_platform: true, is_public: true,
        });
      }
    }
    return NextResponse.json({ success: true, status: body.status });
  }
  return badRequest('Nothing to update');
}
