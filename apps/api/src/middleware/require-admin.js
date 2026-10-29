import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

export async function requireAdmin(req, res, next) {
  try {
  const token = req.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token || !env.supabaseConfigured) return res.status(401).json({ error: { code: 'AUTH_REQUIRED', message: 'Sign in with an administrator account.' } });
  const client = createClient(env.supabaseUrl, env.supabasePublishableKey, { auth: { persistSession: false, autoRefreshToken: false }, global: { headers: { Authorization: `Bearer ${token}` } } });
  const { data: { user }, error: authError } = await client.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: { code: 'INVALID_SESSION', message: 'Your session has expired. Sign in again.' } });
  const { data: profile, error } = await client.from('profiles').select('role, display_name').eq('id', user.id).maybeSingle();
  if (error) return next(error);
  if (!profile || !['admin', 'editor'].includes(profile.role)) return res.status(403).json({ error: { code: 'INSUFFICIENT_ROLE', message: 'Your account does not have access to the admin workspace.' } });
  req.admin = { client, user, profile };
  return next();
  } catch (error) {
    return next(error);
  }
}
