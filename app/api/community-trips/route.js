import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorized, badRequest } from '@/lib/auth-server';
import { TRIP_SELECT, makeShareCode } from '@/lib/communityTrips-server';
import { isFitPackage, GENDER_RULES, VIBES } from '@/lib/communityTrips';

export const dynamic = 'force-dynamic';

// GET /api/community-trips?status=open&package_id=&package_slug=&limit=&mine=created|joined|all
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status      = searchParams.get('status') || 'open';
  const packageId   = searchParams.get('package_id');
  const packageSlug = searchParams.get('package_slug');
  const limit       = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);
  const mine        = searchParams.get('mine');

  let query = supabaseAdmin.from('community_trips').select(TRIP_SELECT).order('start_date', { ascending: true }).limit(limit);

  if (mine) {
    const user = await getUserFromRequest(request);
    if (!user) return unauthorized();
    if (mine === 'created') {
      query = query.eq('creator_id', user.id);
    } else {
      const { data: rows } = await supabaseAdmin.from('community_trip_members').select('trip_id,status').eq('user_id', user.id);
      const ids = (rows || []).filter(r => ['requested', 'approved'].includes(r.status)).map(r => r.trip_id);
      if (ids.length === 0) return NextResponse.json({ trips: [] });
      query = query.in('id', ids);
    }
    if (status !== 'all') query = query.in('status', status.split(','));
  } else {
    if (status !== 'all') query = query.in('status', status.split(','));
    query = query.gte('start_date', new Date().toISOString().slice(0, 10));
  }

  if (packageId) query = query.eq('package_id', packageId);
  if (packageSlug) {
    const { data: pkg } = await supabaseAdmin.from('packages').select('id').eq('slug', packageSlug).maybeSingle();
    if (!pkg) return NextResponse.json({ trips: [] });
    query = query.eq('package_id', pkg.id);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ trips: data || [] });
}

// POST /api/community-trips — create a trip on an FIT package (login required)
export async function POST(request) {
  const user = await getUserFromRequest(request);
  if (!user) return unauthorized();

  const body = await request.json().catch(() => ({}));
  const { package_id, title, note, start_date, end_date, departure_city, total_spots, vibe_tags, gender_rule, age_min, age_max } = body;

  if (!package_id) return badRequest('Pick a package first');
  if (!start_date) return badRequest('Pick a start date');

  const { data: pkg } = await supabaseAdmin.from('packages').select('*').eq('id', package_id).eq('is_active', true).maybeSingle();
  if (!pkg) return badRequest('That package is not available');
  if (!isFitPackage(pkg)) return badRequest('Trips can only be created on FIT packages. Group departures are run by Travel Teasing.');

  const today = new Date().toISOString().slice(0, 10);
  if (start_date < today) return badRequest('Start date must be in the future');
  if (end_date && end_date < start_date) return badRequest('End date must be after the start date');

  const minSpots = Math.max(2, pkg.group_size_min || 2);
  const maxSpots = Math.max(minSpots, pkg.group_size_max || 20);
  const spots = parseInt(total_spots, 10);
  if (!spots || spots < minSpots || spots > maxSpots) return badRequest(`Group size for this package must be between ${minSpots} and ${maxSpots} people`);

  const rule = GENDER_RULES.some(g => g.value === gender_rule) ? gender_rule : 'any';
  const { data: profile } = await supabaseAdmin.from('user_profiles').select('gender,date_of_birth').eq('id', user.id).single();
  if (rule !== 'any') {
    const g = (profile?.gender || '').toLowerCase();
    if (!g) return badRequest('Set your gender in Dashboard → Settings before creating a gender-specific trip');
    if ((rule === 'female' && g !== 'female') || (rule === 'male' && g !== 'male')) return badRequest('You can only create a trip you are eligible to join yourself');
  }

  const amin = age_min ? parseInt(age_min, 10) : null;
  const amax = age_max ? parseInt(age_max, 10) : null;
  if (amin && amax && amin > amax) return badRequest('Minimum age cannot be greater than maximum age');

  const vibes = Array.isArray(vibe_tags) ? vibe_tags.filter(v => VIBES.includes(v)).slice(0, 4) : [];

  let computedEnd = end_date || null;
  if (!computedEnd && pkg.duration_days) {
    const d = new Date(start_date); d.setDate(d.getDate() + Math.max(0, pkg.duration_days - 1));
    computedEnd = d.toISOString().slice(0, 10);
  }

  // Try a few times in the unlikely event of a share-code collision.
  let created = null, lastError = null;
  for (let i = 0; i < 4 && !created; i++) {
    const { data, error } = await supabaseAdmin.from('community_trips').insert({
      share_code: makeShareCode(),
      package_id: pkg.id,
      creator_id: user.id,
      title: (title || '').trim().slice(0, 80) || null,
      note: (note || '').trim().slice(0, 600) || null,
      start_date,
      end_date: computedEnd,
      departure_city: (departure_city || '').trim().slice(0, 60) || pkg.departure_city || null,
      total_spots: spots,
      vibe_tags: vibes,
      gender_rule: rule,
      age_min: amin,
      age_max: amax,
      price_per_person: pkg.price_per_person || null,
    }).select('id, share_code').single();
    if (!error) created = data; else lastError = error;
  }
  if (!created) return NextResponse.json({ error: lastError?.message || 'Could not create trip' }, { status: 500 });

  const { error: memberError } = await supabaseAdmin.from('community_trip_members').insert({
    trip_id: created.id, user_id: user.id, role: 'creator', status: 'approved', decided_at: new Date().toISOString(),
  });
  if (memberError) {
    await supabaseAdmin.from('community_trips').delete().eq('id', created.id);
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: created.id, share_code: created.share_code });
}
