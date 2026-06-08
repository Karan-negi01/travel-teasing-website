import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('gallery')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ images: data });
}

export async function POST(request) {
  const body = await request.json();
  const { data, error } = await supabaseAdmin.from('gallery').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, image: data });
}
