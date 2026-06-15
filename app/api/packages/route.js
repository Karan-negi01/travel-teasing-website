import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const search = searchParams.get('search');
  const subtype = searchParams.get('subtype');
  const vibe = searchParams.get('vibe');

  let query = supabaseAdmin.from('packages').select('*').eq('is_active', true);

  if (category) query = query.eq('category', category);
  if (featured === 'true') query = query.eq('is_featured', true);
  if (search) query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%,state.ilike.%${search}%,description.ilike.%${search}%`);
  if (subtype) query = query.eq('package_subtype', subtype);
  if (vibe) query = query.ilike('vibe', `%${vibe}%`);

  query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ packages: data });
}
