import type { APIRoute } from 'astro';
import { requireAuth } from '../../lib/auth';
import { readRecentSearches } from '../../lib/db';

export const GET: APIRoute = async (context) => {
  const auth = requireAuth(context);
  if ('error' in auth) return auth.error;

  try {
    const searches = await readRecentSearches(auth.supabase, 5);
    return json(searches, 200);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return json({ error: message }, 500);
  }
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
