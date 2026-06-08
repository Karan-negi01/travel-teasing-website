import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ testimonials: data });
}

export async function POST(request) {
  const body = await request.json();
  const { data, error } = await supabaseAdmin.from('testimonials').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, testimonial: data });
}
