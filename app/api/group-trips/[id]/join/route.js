import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  const body = await request.json();
  const { name, phone, email, message } = body;

  if (!name || !phone) return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });

  const { error } = await supabaseAdmin.from('group_trip_requests').insert({
    group_trip_id: params.id,
    name,
    phone,
    email: email || null,
    message: message || null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
