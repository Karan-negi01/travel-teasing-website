import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { email, password } = await request.json();
  if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
  if (error) return NextResponse.json({ error: error.message }, { status: 401 });

  return NextResponse.json({ success: true, session: data.session, user: data.user });
}
