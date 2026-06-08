import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

function checkAdmin(request) {
  const cookieStore = cookies();
  const adminAuth = cookieStore.get('admin_auth');
  return adminAuth?.value === 'true';
}

export async function GET() {
  const { data, error } = await supabaseAdmin.from('packages').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ packages: data });
}

export async function POST(request) {
  const body = await request.json();
  const { data, error } = await supabaseAdmin.from('packages').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, package: data });
}
