import type { APIRoute } from 'astro';
import { requireAuth } from '../../lib/auth';
import { getLeadsCount } from '../../lib/db';
import { testToken } from '../../lib/apify';

export const GET: APIRoute = async (context) => {
  const auth = requireAuth(context);
  if ('error' in auth) return auth.error;

  const apifyToken = import.meta.env.APIFY_API_TOKEN as string | undefined;
  const apifyConfigured = Boolean(apifyToken);

  let leadsCount = 0;
  try {
    leadsCount = await getLeadsCount(auth.supabase);
  } catch {
    leadsCount = 0;
  }

  const shouldTest = context.url.searchParams.get('test') === '1';
  if (shouldTest && apifyConfigured) {
    const apifyValid = await testToken(apifyToken!);
    return json({ apifyConfigured, apifyValid, leadsCount }, 200);
  }

  return json({ apifyConfigured, leadsCount }, 200);
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
