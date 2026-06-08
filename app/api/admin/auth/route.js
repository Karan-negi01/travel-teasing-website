import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  const { password } = await request.json();
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_auth', 'true', { httpOnly: true, maxAge: 86400, path: '/', sameSite: 'lax' });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_auth');
  return response;
}
