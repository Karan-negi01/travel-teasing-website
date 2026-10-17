import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorized, badRequest } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';
const MAX_FILES = 20;
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/gif'];

// POST multipart/form-data { files: File[] } — upload photos into an album
export async function POST(request, { params }) {
  const user = await getUserFromRequest(request);
  if (!user) return unauthorized();
  const { data: trip } = await supabaseAdmin.from('user_trips').select('id,cover_photo').eq('id', params.id).eq('user_id', user.id).maybeSingle();
  if (!trip) return NextResponse.json({ error: 'Album not found' }, { status: 404 });

  const form = await request.formData();
  const files = form.getAll('files').filter(f => typeof f === 'object' && f.size > 0);
  if (!files.length) return badRequest('Choose at least one photo');
  if (files.length > MAX_FILES) return badRequest(`Upload up to ${MAX_FILES} photos at a time`);

  const { count } = await supabaseAdmin.from('user_trip_photos').select('id', { count: 'exact', head: true }).eq('trip_id', trip.id);
  let order = count || 0;
  const inserted = [];
  const errors = [];

  for (const file of files) {
    if (!ALLOWED.includes(file.type)) { errors.push(`${file.name}: not an image`); continue; }
    if (file.size > MAX_BYTES) { errors.push(`${file.name}: larger than 8 MB`); continue; }
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const path = `gallery/${user.id}/${trip.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await supabaseAdmin.storage.from('travel-images').upload(path, buffer, { contentType: file.type, upsert: false });
    if (upErr) { errors.push(`${file.name}: ${upErr.message}`); continue; }
    const { data: { publicUrl } } = supabaseAdmin.storage.from('travel-images').getPublicUrl(path);
    const { data: row, error: dbErr } = await supabaseAdmin.from('user_trip_photos').insert({ trip_id: trip.id, url: publicUrl, sort_order: order++ }).select('*').single();
    if (dbErr) { errors.push(`${file.name}: ${dbErr.message}`); continue; }
    inserted.push(row);
  }

  if (inserted.length && !trip.cover_photo) {
    await supabaseAdmin.from('user_trips').update({ cover_photo: inserted[0].url }).eq('id', trip.id);
  }

  if (!inserted.length) return NextResponse.json({ error: errors[0] || 'Upload failed' }, { status: 400 });
  return NextResponse.json({ success: true, photos: inserted, errors });
}
