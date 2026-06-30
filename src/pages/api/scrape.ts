import type { APIRoute } from 'astro';
import { requireAuth } from '../../lib/auth';
import { startScrape } from '../../lib/apify';
import { getApifyToken } from '../../lib/env';

export const POST: APIRoute = async (context) => {
  const auth = requireAuth(context);
  if ('error' in auth) return auth.error;

  const token = await getApifyToken();
  if (!token) {
    return json({ error: 'APIFY_API_TOKEN is not configured.' }, 503);
  }

  let body: { keyword?: string; location?: string; maxResults?: number; language?: string };
  try {
    body = await context.request.json() as typeof body;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { keyword, location, maxResults = 50, language = 'en' } = body;
  if (!keyword?.trim()) {
    return json({ error: 'keyword is required' }, 400);
  }

  const searchString = location?.trim()
    ? `${keyword.trim()} in ${location.trim()}`
    : keyword.trim();

  const clampedMax = Math.min(Math.max(Number(maxResults) || 50, 1), 500);

  try {
    const run = await startScrape(searchString, clampedMax, language, token);
    return json(
      {
        runId: run.runId,
        datasetId: run.datasetId,
        status: run.status,
        query: searchString,
      },
      200
    );
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
