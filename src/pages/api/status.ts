import type { APIRoute } from 'astro';
import { requireAuth } from '../../lib/auth';
import { getRunStatus } from '../../lib/apify';
import { getApifyToken } from '../../lib/env';

export const GET: APIRoute = async (context) => {
  const auth = requireAuth(context);
  if ('error' in auth) return auth.error;

  const token = await getApifyToken();
  if (!token) {
    return json({ error: 'APIFY_API_TOKEN not configured' }, 503);
  }

  const runId = context.url.searchParams.get('runId');
  if (!runId) {
    return json({ error: 'runId query param is required' }, 400);
  }

  try {
    const status = await getRunStatus(runId, token);
    return json(status, 200);
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
