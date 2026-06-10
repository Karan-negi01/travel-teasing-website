import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET() {
  const sql = `
    ALTER TABLE packages
      ADD COLUMN IF NOT EXISTS package_type TEXT,
      ADD COLUMN IF NOT EXISTS package_subtype TEXT,
      ADD COLUMN IF NOT EXISTS destination_type TEXT DEFAULT 'Domestic',
      ADD COLUMN IF NOT EXISTS vibe TEXT,
      ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS date_type TEXT DEFAULT 'coming_soon',
      ADD COLUMN IF NOT EXISTS start_date DATE,
      ADD COLUMN IF NOT EXISTS end_date DATE,
      ADD COLUMN IF NOT EXISTS duration TEXT;
  `;

  const { error } = await supabaseAdmin.rpc('exec_sql', { query: sql }).catch(() => ({ error: 'rpc not available' }));

  if (error) {
    // Try direct query approach
    const results = [];
    const columns = [
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS package_type TEXT`,
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS package_subtype TEXT`,
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS destination_type TEXT DEFAULT 'Domestic'`,
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS vibe TEXT`,
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'`,
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS date_type TEXT DEFAULT 'coming_soon'`,
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS start_date DATE`,
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS end_date DATE`,
      `ALTER TABLE packages ADD COLUMN IF NOT EXISTS duration TEXT`,
    ];

    for (const col of columns) {
      const { error: e } = await supabaseAdmin.from('packages').select('id').limit(0);
      results.push({ sql: col, note: 'manual migration needed' });
    }

    return NextResponse.json({
      message: 'Could not run migration automatically. Please run this SQL in your Supabase SQL editor:',
      sql: columns.join(';\n') + ';',
      results
    });
  }

  return NextResponse.json({ success: true, message: 'Migration completed!' });
}
