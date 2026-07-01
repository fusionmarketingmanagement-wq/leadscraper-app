import type { APIRoute } from 'astro';
import { requireAuth } from '../../lib/auth';
import { getDatasetItems } from '../../lib/apify';
import { normalizePlace } from '../../lib/normalize';
import { normalizeLinkedInProfile } from '../../lib/normalize-linkedin';
import { saveLeads, updateSearchStatus } from '../../lib/db';
import { getApifyToken } from '../../lib/env';
import type { LeadSource } from '../../lib/types';

export const GET: APIRoute = async (context) => {
  const auth = requireAuth(context);
  if ('error' in auth) return auth.error;

  const token = await getApifyToken();
  if (!token) {
    return json({ error: 'APIFY_API_TOKEN not configured' }, 503);
  }

  const datasetId = context.url.searchParams.get('datasetId');
  const searchId = context.url.searchParams.get('searchId');
  const query = context.url.searchParams.get('query') ?? 'Unknown search';
  const source = context.url.searchParams.get('source') as LeadSource | null;

  if (!datasetId || !searchId || !source) {
    return json({ error: 'datasetId, searchId, and source query params are required' }, 400);
  }

  if (source !== 'google_maps' && source !== 'linkedin') {
    return json({ error: 'Invalid source' }, 400);
  }

  try {
    const items = await getDatasetItems(datasetId, token);
    const leads =
      source === 'linkedin'
        ? items.map((item) => normalizeLinkedInProfile(item, searchId, query))
        : items.map((item) => normalizePlace(item, searchId, query));

    const saved = await saveLeads(auth.supabase, auth.user.id, leads);
    await updateSearchStatus(auth.supabase, searchId, 'succeeded');

    return json({ count: saved, total: leads.length }, 200);
  } catch (err) {
    await updateSearchStatus(auth.supabase, searchId, 'failed').catch(() => undefined);
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
