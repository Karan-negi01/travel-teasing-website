import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    await supabaseAdmin.auth.admin.signOut(token).catch(() => {});
  }
  return NextResponse.json({ success: true });
}
