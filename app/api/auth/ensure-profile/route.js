import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { getUserFromRequest, unauthorized } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

// POST — make sure a user_profiles row exists (OAuth sign-ups skip /api/auth/signup).
export async function POST(request) {
  const user = await getUserFromRequest(request);
  if (!user) return unauthorized();
  const { data: existing } = await supabaseAdmin.from('user_profiles').select('id').eq('id', user.id).maybeSingle();
  if (existing) return NextResponse.json({ created: false });
  const m = user.user_metadata || {};
  const { error } = await supabaseAdmin.from('user_profiles').insert({
    id: user.id,
    full_name: m.full_name || m.name || (user.email || '').split('@')[0],
    phone: m.phone || null,
    profile_photo: m.avatar_url || m.picture || null,
    trip_style: [],
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ created: true });
}
