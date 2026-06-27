import type { ApifyRunResult, RunStatus } from './types';

const BASE = 'https://api.apify.com/v2';
const ACTOR_ID = 'compass~google-maps-extractor';

interface ApifyRunData {
  id: string;
  status: string;
  defaultDatasetId: string;
  stats?: { itemCount?: number };
}

function parseRunPayload(json: unknown): ApifyRunData {
  const wrapped = json as { data?: ApifyRunData };
  const data = wrapped.data ?? (json as ApifyRunData);
  if (!data?.id) {
    throw new Error('Invalid Apify run response');
  }
  return data;
}

export async function startScrape(
  searchString: string,
  maxResults: number,
  language: string,
  token: string
): Promise<ApifyRunResult> {
  const url = `${BASE}/acts/${ACTOR_ID}/runs?token=${token}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      searchStringsArray: [searchString],
      maxCrawledPlacesPerSearch: maxResults,
      language,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Apify error ${res.status}: ${text}`);
  }

  const data = parseRunPayload(await res.json());
  return {
    runId: data.id,
    datasetId: data.defaultDatasetId,
    status: data.status,
  };
}

export async function getRunStatus(runId: string, token: string): Promise<RunStatus> {
  const res = await fetch(`${BASE}/actor-runs/${runId}?token=${token}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Apify error ${res.status}: ${text}`);
  }

  const data = parseRunPayload(await res.json());
  return {
    status: data.status,
    itemCount: data.stats?.itemCount ?? 0,
    datasetId: data.defaultDatasetId,
  };
}

export async function getDatasetItems(
  datasetId: string,
  token: string
): Promise<Record<string, unknown>[]> {
  const res = await fetch(`${BASE}/datasets/${datasetId}/items?token=${token}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Apify error ${res.status}: ${text}`);
  }

  const items = await res.json();
  return Array.isArray(items) ? items : [];
}

export async function testToken(token: string): Promise<boolean> {
  const res = await fetch(`${BASE}/users/me?token=${token}`);
  return res.ok;
}
