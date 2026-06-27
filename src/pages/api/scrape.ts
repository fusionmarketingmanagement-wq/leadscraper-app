import type { APIRoute } from 'astro';
import { startRun } from '../../lib/apify';

export const POST: APIRoute = async ({ request }) => {
  const token = import.meta.env.APIFY_API_TOKEN as string | undefined;
  if (!token) {
    return json({ error: 'APIFY_API_TOKEN is not configured. Add it to your .env file.' }, 503);
  }

  let body: { keyword?: string; location?: string; maxResults?: number; language?: string };
  try {
    body = await request.json() as typeof body;
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

  const clampedMax = Math.min(Math.max(Number(maxResults) || 50, 1), 1000);

  try {
    const result = await startRun(searchString, clampedMax, language, token);
    return json(result, 200);
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
