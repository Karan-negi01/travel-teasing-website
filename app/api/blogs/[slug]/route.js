import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { data, error } = await supabaseAdmin
    .from('blogs')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single();
  if (error || !data) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
  return NextResponse.json({ blog: data });
}

export async function PUT(request, { params }) {
  const body = await request.json();
  const { data, error } = await supabaseAdmin.from('blogs').update(body).eq('slug', params.slug).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, blog: data });
}
