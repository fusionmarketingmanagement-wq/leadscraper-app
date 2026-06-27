import type { APIContext } from 'astro';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { getServerClient } from './supabase';

export function unauthorizedResponse(): Response {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function requireUser(context: APIContext): Response | null {
  if (!context.locals.user) {
    return unauthorizedResponse();
  }
  return null;
}

export type AuthContext =
  | { error: Response }
  | { supabase: SupabaseClient; user: User };

export function requireAuth(context: APIContext): AuthContext {
  const authError = requireUser(context);
  if (authError) return { error: authError };
  const supabase = getServerClient(context.request, context.cookies);
  return { supabase, user: context.locals.user! };
}
