import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  let query = supabaseAdmin.from('blogs').select('id,slug,title,excerpt,cover_image,category,author,published_at,created_at').eq('is_published', true).order('published_at', { ascending: false });
  if (category && category !== 'all') query = query.eq('category', category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ blogs: data });
}

export async function POST(request) {
  const body = await request.json();
  const { data, error } = await supabaseAdmin.from('blogs').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, blog: data });
}
