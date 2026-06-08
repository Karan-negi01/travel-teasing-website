import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

const HILL_STATES = ['Himachal Pradesh', 'Uttarakhand', 'Sikkim', 'Arunachal Pradesh', 'Meghalaya', 'Jammu & Kashmir', 'Ladakh'];

async function checkAndAwardBadges(userId) {
  const [tripsRes, badgesRes, allBadgesRes, profileRes] = await Promise.all([
    supabaseAdmin.from('user_trips').select('*').eq('user_id', userId),
    supabaseAdmin.from('user_badges').select('badge_id').eq('user_id', userId),
    supabaseAdmin.from('badges').select('*'),
    supabaseAdmin.from('user_profiles').select('is_verified').eq('id', userId).single(),
  ]);

  const trips = tripsRes.data || [];
  const earnedIds = new Set((badgesRes.data || []).map(b => b.badge_id));
  const allBadges = allBadgesRes.data || [];
  const newBadges = [];

  const tripCount = trips.length;
  const states = [...new Set(trips.map(t => t.state).filter(Boolean))];
  const hillTrips = trips.filter(t => HILL_STATES.includes(t.state)).length;
  const hasSacred = trips.some(t => t.trip_type === 'sacred');
  const hasAdventure = trips.some(t => t.trip_type === 'adventure');
  const hasFamily = trips.some(t => t.trip_type === 'family');

  for (const badge of allBadges) {
    if (earnedIds.has(badge.id)) continue;
    let shouldAward = false;
    if (badge.condition_type === 'trip_count' && tripCount >= badge.condition_value) shouldAward = true;
    if (badge.condition_type === 'state_count' && states.length >= badge.condition_value) shouldAward = true;
    if (badge.condition_type === 'hill_count' && hillTrips >= badge.condition_value) shouldAward = true;
    if (badge.condition_type === 'trip_type' && badge.name === 'Pilgrim' && hasSacred) shouldAward = true;
    if (badge.condition_type === 'trip_type' && badge.name === 'Trek Master' && hasAdventure) shouldAward = true;
    if (badge.condition_type === 'trip_type' && badge.name === 'Family Traveler' && hasFamily) shouldAward = true;
    if (badge.condition_type === 'verified' && profileRes.data?.is_verified) shouldAward = true;

    if (shouldAward) {
      const { error } = await supabaseAdmin.from('user_badges').insert({ user_id: userId, badge_id: badge.id }).select();
      if (!error) newBadges.push(badge);
    }
  }

  return newBadges;
}

export async function POST(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body.destination) return NextResponse.json({ error: 'Destination is required' }, { status: 400 });

  const { error: insertError } = await supabaseAdmin.from('user_trips').insert({
    user_id: user.id,
    package_id: body.package_id || null,
    destination: body.destination,
    state: body.state || null,
    country: body.country || 'India',
    trip_type: body.trip_type || null,
    travel_date_from: body.travel_date_from || null,
    travel_date_to: body.travel_date_to || null,
    cover_photo: body.cover_photo || null,
    caption: body.caption || null,
    booked_through_platform: body.booked_through_platform || false,
  });

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  const newBadges = await checkAndAwardBadges(user.id);
  return NextResponse.json({ success: true, new_badges: newBadges });
}
