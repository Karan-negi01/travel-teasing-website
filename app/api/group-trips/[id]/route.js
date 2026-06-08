import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { data, error } = await supabaseAdmin
    .from('group_trips')
    .select('*, packages(*)')
    .eq('id', params.id)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
  return NextResponse.json({ trip: data });
}
