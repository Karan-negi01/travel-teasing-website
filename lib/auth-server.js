import { supabaseAdmin } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Resolve the logged-in traveller from a "Bearer <supabase access token>" header. Returns null when absent/invalid.
export async function getUserFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return null;
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

export function isAdminRequest() {
  try { return cookies().get('admin_auth')?.value === 'v3'; } catch { return false; }
}

export const unauthorized = (msg = 'Please log in to continue') => NextResponse.json({ error: msg }, { status: 401 });
export const forbidden = (msg = 'You are not allowed to do that') => NextResponse.json({ error: msg }, { status: 403 });
export const badRequest = (msg) => NextResponse.json({ error: msg }, { status: 400 });
