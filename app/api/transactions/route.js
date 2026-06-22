import { supabaseAdmin as supabase } from '@/lib/supabase-server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const card_holder = searchParams.get('card_holder');
  const category = searchParams.get('category');
  const month = searchParams.get('month'); // YYYY-MM

  let query = supabase
    .from('company_transactions')
    .select('*')
    .order('transaction_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (card_holder) query = query.eq('card_holder', card_holder);
  if (category) query = query.eq('category', category);
  if (month) {
    query = query
      .gte('transaction_date', `${month}-01`)
      .lte('transaction_date', `${month}-31`);
  }

  const { data, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ transactions: data });
}

export async function POST(req) {
  const body = await req.json();
  const { amount, merchant, purpose, card_holder, category, transaction_date, notes } = body;

  if (!amount || !merchant || !purpose || !card_holder) {
    return Response.json({ error: 'amount, merchant, purpose, card_holder are required' }, { status: 400 });
  }

  const { data, error } = await supabase.from('company_transactions').insert([{
    amount: parseInt(amount),
    merchant,
    purpose,
    card_holder,
    category: category || 'other',
    transaction_date: transaction_date || new Date().toISOString().split('T')[0],
    notes: notes || null,
  }]).select().single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ transaction: data });
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });

  const { error } = await supabase.from('company_transactions').delete().eq('id', id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
