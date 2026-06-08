import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const allowed = ['full_name', 'city', 'gender', 'bio', 'trip_style', 'budget_preference', 'sleep_schedule', 'comfort_level', 'instagram_handle', 'profile_photo', 'date_of_birth'];
  const updates = {};
  for (const key of allowed) { if (body[key] !== undefined) updates[key] = body[key]; }
  updates.updated_at = new Date().toISOString();

  const { error } = await supabaseAdmin.from('user_profiles').update(updates).eq('id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
