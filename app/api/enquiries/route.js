import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ enquiries: data });
}

export async function POST(request) {
  const body = await request.json();
  const { name, phone, enquiry_type } = body;
  if (!name || !phone || !enquiry_type) {
    return NextResponse.json({ error: 'name, phone, and enquiry_type are required' }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from('enquiries').insert({
    package_id: body.package_id || null,
    package_title: body.package_title || null,
    enquiry_type,
    name,
    phone,
    email: body.email || null,
    message: body.message || null,
    destination: body.destination || null,
    travel_dates: body.travel_dates || null,
    group_size: body.group_size ? parseInt(body.group_size) : null,
    budget_per_person: body.budget_per_person || null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
