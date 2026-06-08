import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const [profileRes, tripsRes, badgesRes] = await Promise.all([
    supabaseAdmin.from('user_profiles').select('id,full_name,city,gender,bio,profile_photo,is_verified,trip_style,budget_preference,instagram_handle,created_at').eq('id', params.id).single(),
    supabaseAdmin.from('user_trips').select('*').eq('user_id', params.id).order('travel_date_from', { ascending: false }),
    supabaseAdmin.from('user_badges').select('*, badges(*)').eq('user_id', params.id),
  ]);

  if (!profileRes.data) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  return NextResponse.json({
    profile: profileRes.data,
    trips: tripsRes.data || [],
    badges: badgesRes.data || [],
  });
}
