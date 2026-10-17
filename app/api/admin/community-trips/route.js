import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { isAdminRequest, unauthorized } from '@/lib/auth-server';
import { TRIP_SELECT } from '@/lib/communityTrips-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isAdminRequest()) return unauthorized('Admin login required');
  const { data, error } = await supabaseAdmin.from('community_trips').select(TRIP_SELECT).order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ trips: data || [] });
}
