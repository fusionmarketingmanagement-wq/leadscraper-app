import type { APIRoute } from 'astro';
import { getDatasetItems } from '../../lib/apify';
import { normalizePlace } from '../../lib/normalize';
import { saveLeads } from '../../lib/db';

export const GET: APIRoute = async ({ url }) => {
  const token = import.meta.env.APIFY_API_TOKEN as string | undefined;
  if (!token) {
    return json({ error: 'APIFY_API_TOKEN not configured' }, 503);
  }

  const datasetId = url.searchParams.get('datasetId');
  const query = url.searchParams.get('query') ?? 'Unknown search';

  if (!datasetId) {
    return json({ error: 'datasetId query param is required' }, 400);
  }

  try {
    const items = await getDatasetItems(datasetId, token);
    const leads = (items as Record<string, unknown>[]).map((item) =>
      normalizePlace(item, query)
    );
    const saved = saveLeads(leads);
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
