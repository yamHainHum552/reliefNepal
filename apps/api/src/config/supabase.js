import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

// The API uses the publishable key and relies on database RLS. Never put a
// Supabase secret/service-role key in this public-content request path.
export const supabase = env.supabaseConfigured
  ? createClient(env.supabaseUrl, env.supabasePublishableKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    })
  : null;
