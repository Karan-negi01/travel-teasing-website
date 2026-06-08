import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { data, error } = await supabaseAdmin.from('packages').select('*').eq('id', params.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ package: data });
}

export async function PUT(request, { params }) {
  const body = await request.json();
  body.updated_at = new Date().toISOString();
  const { data, error } = await supabaseAdmin.from('packages').update(body).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, package: data });
}

export async function PATCH(request, { params }) {
  const body = await request.json();
  const { error } = await supabaseAdmin.from('packages').update(body).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
