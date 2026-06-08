import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const packageSlug = searchParams.get('package_slug');

  let query = supabaseAdmin
    .from('group_trips')
    .select('*, packages(cover_image, location, state)')
    .eq('status', 'open')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (packageSlug) query = query.eq('package_slug', packageSlug);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ trips: data });
}

export async function POST(request) {
  const body = await request.json();
  const { package_id, package_title, package_slug, creator_name, creator_phone, departure_city, trip_dates_from, trip_dates_to, total_spots, price_per_person, total_price, vibe_tags } = body;

  if (!creator_name || !creator_phone || !total_spots || !price_per_person) {
    return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.from('group_trips').insert({
    package_id: package_id || null,
    package_title,
    package_slug,
    creator_name,
    creator_phone,
    creator_email: body.creator_email || null,
    departure_city,
    trip_dates_from: trip_dates_from || null,
    trip_dates_to: trip_dates_to || null,
    total_spots: parseInt(total_spots),
    price_per_person: parseInt(price_per_person),
    total_price: parseInt(total_price) || parseInt(price_per_person) * parseInt(total_spots),
    vibe_tags: vibe_tags || [],
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, id: data.id });
}
