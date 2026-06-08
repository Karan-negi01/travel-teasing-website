import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const { full_name, phone, email, password, city, gender, trip_style, budget_preference, sleep_schedule, comfort_level } = body;

  if (!full_name || !phone || !email || !password) {
    return NextResponse.json({ error: 'Name, phone, email and password are required' }, { status: 400 });
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });

  const { error: profileError } = await supabaseAdmin.from('user_profiles').insert({
    id: authData.user.id,
    full_name,
    phone,
    city: city || null,
    gender: gender || null,
    trip_style: trip_style || [],
    budget_preference: budget_preference || null,
    sleep_schedule: sleep_schedule || null,
    comfort_level: comfort_level || null,
  });

  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, user: authData.user });
}
