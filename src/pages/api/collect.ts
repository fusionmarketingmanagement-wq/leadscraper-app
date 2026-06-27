import type { APIRoute } from 'astro';
import { requireAuth } from '../../lib/auth';
import { getDatasetItems } from '../../lib/apify';
import { normalizePlace } from '../../lib/normalize';
import { saveLeads } from '../../lib/db';

export const GET: APIRoute = async (context) => {
  const auth = requireAuth(context);
  if ('error' in auth) return auth.error;

  const token = import.meta.env.APIFY_API_TOKEN as string | undefined;
  if (!token) {
    return json({ error: 'APIFY_API_TOKEN not configured' }, 503);
  }

  const datasetId = context.url.searchParams.get('datasetId');
  const query = context.url.searchParams.get('query') ?? 'Unknown search';

  if (!datasetId) {
    return json({ error: 'datasetId query param is required' }, 400);
  }

  try {
    const items = await getDatasetItems(datasetId, token);
    const leads = items.map((item) => normalizePlace(item, query));
    const saved = await saveLeads(auth.supabase, auth.user.id, leads);
    return json({ count: saved, total: leads.length }, 200);
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
