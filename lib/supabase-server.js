import { createClient } from '@supabase/supabase-js';

// Server-only admin client — NEVER import this in client components.
// Next.js caches fetch() calls made inside route handlers by default; force no-store so API responses are always fresh.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { fetch: (url, options = {}) => fetch(url, { ...options, cache: 'no-store' }) },
  }
);
