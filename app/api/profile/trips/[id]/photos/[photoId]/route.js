import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorized, badRequest } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

async function ownPhoto(user, tripId, photoId) {
  const { data: trip } = await supabaseAdmin.from('user_trips').select('id,cover_photo').eq('id', tripId).eq('user_id', user.id).maybeSingle();
  if (!trip) return {};
  const { data: photo } = await supabaseAdmin.from('user_trip_photos').select('*').eq('id', photoId).eq('trip_id', trip.id).maybeSingle();
  return { trip, photo };
}

// PATCH { caption } | { set_cover: true }
export async function PATCH(request, { params }) {
  const user = await getUserFromRequest(request);
  if (!user) return unauthorized();
  const { trip, photo } = await ownPhoto(user, params.id, params.photoId);
  if (!photo) return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
  const body = await request.json().catch(() => ({}));
  if (body.set_cover) {
    await supabaseAdmin.from('user_trips').update({ cover_photo: photo.url }).eq('id', trip.id);
    return NextResponse.json({ success: true, cover_photo: photo.url });
  }
  if (body.caption !== undefined) {
    const { error } = await supabaseAdmin.from('user_trip_photos').update({ caption: (body.caption || '').trim().slice(0, 200) || null }).eq('id', photo.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }
  return badRequest('Nothing to update');
}

export async function DELETE(request, { params }) {
  const user = await getUserFromRequest(request);
  if (!user) return unauthorized();
  const { trip, photo } = await ownPhoto(user, params.id, params.photoId);
  if (!photo) return NextResponse.json({ error: 'Photo not found' }, { status: 404 });

  const marker = '/travel-images/';
  const idx = photo.url.indexOf(marker);
  if (idx > -1) await supabaseAdmin.storage.from('travel-images').remove([decodeURIComponent(photo.url.slice(idx + marker.length))]);

  const { error } = await supabaseAdmin.from('user_trip_photos').delete().eq('id', photo.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (trip.cover_photo === photo.url) {
    const { data: next } = await supabaseAdmin.from('user_trip_photos').select('url').eq('trip_id', trip.id).order('sort_order').limit(1).maybeSingle();
    await supabaseAdmin.from('user_trips').update({ cover_photo: next?.url || null }).eq('id', trip.id);
  }
  return NextResponse.json({ success: true });
}
