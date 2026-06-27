import type { APIRoute } from 'astro';
import { getLeadsCount } from '../../lib/db';
import { testToken } from '../../lib/apify';

export const GET: APIRoute = async ({ url }) => {
  const apifyToken = import.meta.env.APIFY_API_TOKEN as string | undefined;
  const googlePlacesKey = import.meta.env.GOOGLE_PLACES_API_KEY as string | undefined;
  const hunterKey = import.meta.env.HUNTER_API_KEY as string | undefined;
  const zeroBounceKey = import.meta.env.ZEROBOUNCE_API_KEY as string | undefined;

  const apifyConfigured = Boolean(apifyToken);
  const googlePlacesConfigured = Boolean(googlePlacesKey);
  const hunterConfigured = Boolean(hunterKey);
  const zeroBounceConfigured = Boolean(zeroBounceKey);
  const leadsCount = getLeadsCount();

  const shouldTest = url.searchParams.get('test') === '1';
  if (shouldTest && apifyConfigured) {
    const apifyValid = await testToken(apifyToken!);
    return json({ apifyConfigured, apifyValid, googlePlacesConfigured, hunterConfigured, zeroBounceConfigured, leadsCount }, 200);
  }

  return json({ apifyConfigured, googlePlacesConfigured, hunterConfigured, zeroBounceConfigured, leadsCount }, 200);
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
