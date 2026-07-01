import type { APIRoute } from 'astro';
import { requireAuth } from '../../../lib/auth';
import { startLinkedInScrape } from '../../../lib/apify';
import { createSearch } from '../../../lib/db';
import { getApifyToken } from '../../../lib/env';
import type { LinkedInScrapeInput } from '../../../lib/types';

export const POST: APIRoute = async (context) => {
  const auth = requireAuth(context);
  if ('error' in auth) return auth.error;

  const token = await getApifyToken();
  if (!token) {
    return json({ error: 'APIFY_API_TOKEN is not configured.' }, 503);
  }

  let body: LinkedInScrapeInput;
  try {
    body = await context.request.json() as LinkedInScrapeInput;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const hasQuery =
    body.searchQuery?.trim() ||
    body.locations?.some(Boolean) ||
    body.currentCompanies?.some(Boolean) ||
    body.pastCompanies?.some(Boolean) ||
    body.schools?.some(Boolean) ||
    body.currentJobTitles?.some(Boolean);

  if (!hasQuery) {
    return json({ error: 'Provide a search query or at least one filter.' }, 400);
  }

  const maxItems = Math.min(Math.max(Number(body.maxItems) || 20, 1), 500);
  const profileScraperMode = body.profileScraperMode ?? 'Short';
  const input: LinkedInScrapeInput = {
    ...body,
    maxItems,
    profileScraperMode,
  };

  const queryLabel =
    body.searchQuery?.trim() ||
    [
      body.currentJobTitles?.filter(Boolean).join(', '),
      body.locations?.filter(Boolean).join(', '),
    ].filter(Boolean).join(' · ') ||
    'LinkedIn search';

  try {
    const run = await startLinkedInScrape(input, token);
    const search = await createSearch(
      auth.supabase,
      auth.user.id,
      'linkedin',
      queryLabel,
      input as Record<string, unknown>,
      run.runId,
      run.datasetId
    );

    return json(
      {
        runId: run.runId,
        datasetId: run.datasetId,
        searchId: search.id,
        status: run.status,
        query: queryLabel,
        source: 'linkedin',
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
