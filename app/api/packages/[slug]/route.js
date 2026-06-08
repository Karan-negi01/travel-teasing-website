import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { data, error } = await supabaseAdmin
    .from('packages')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Package not found' }, { status: 404 });
  return NextResponse.json({ package: data });
}
