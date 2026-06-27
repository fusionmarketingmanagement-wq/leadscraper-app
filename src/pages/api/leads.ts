import type { APIRoute } from 'astro';
import { requireAuth } from '../../lib/auth';
import { readLeads, clearLeads } from '../../lib/db';

export const GET: APIRoute = async (context) => {
  const auth = requireAuth(context);
  if ('error' in auth) return auth.error;

  try {
    const leads = await readLeads(auth.supabase);
    return new Response(JSON.stringify(leads), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async (context) => {
  const auth = requireAuth(context);
  if ('error' in auth) return auth.error;

  try {
    await clearLeads(auth.supabase);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
