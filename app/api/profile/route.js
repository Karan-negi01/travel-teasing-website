import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [profileRes, tripsRes, badgesRes] = await Promise.all([
    supabaseAdmin.from('user_profiles').select('*').eq('id', user.id).single(),
    supabaseAdmin.from('user_trips').select('*').eq('user_id', user.id).order('travel_date_from', { ascending: false }),
    supabaseAdmin.from('user_badges').select('*, badges(*)').eq('user_id', user.id),
  ]);

  return NextResponse.json({
    profile: profileRes.data,
    trips: tripsRes.data || [],
    badges: badgesRes.data || [],
    email: user.email,
  });
}
