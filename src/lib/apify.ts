const BASE = 'https://api.apify.com/v2';
const ACTOR_ID = 'compass~crawler-google-places';

export async function startRun(
  searchString: string,
  maxResults: number,
  language: string,
  token: string
): Promise<{ runId: string; datasetId: string; status: string }> {
  const body = {
    searchStringsArray: [searchString],
    maxCrawledPlacesPerSearch: maxResults,
    language,
    maxImages: 0,
    exportPlaceUrls: false,
    additionalInfo: false,
    scrapeDirectories: false,
  };

  const res = await fetch(`${BASE}/acts/${ACTOR_ID}/runs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Apify error ${res.status}: ${text}`);
  }

  const { data } = await res.json() as { data: { id: string; defaultDatasetId: string; status: string } };
  return { runId: data.id, datasetId: data.defaultDatasetId, status: data.status };
}

export async function getRunStatus(
  runId: string,
  token: string
): Promise<{ status: string; itemCount: number; datasetId: string }> {
  const res = await fetch(`${BASE}/actor-runs/${runId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Status check failed: ${res.status}`);
  const { data } = await res.json() as { data: { status: string; stats: { itemCount?: number }; defaultDatasetId: string } };
  return {
    status: data.status,
    itemCount: data.stats?.itemCount ?? 0,
    datasetId: data.defaultDatasetId,
  };
}

export async function getDatasetItems(datasetId: string, token: string): Promise<unknown[]> {
  const res = await fetch(
    `${BASE}/datasets/${datasetId}/items?clean=true&format=json&limit=2000`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`Dataset fetch failed: ${res.status}`);
  return res.json() as Promise<unknown[]>;
}

export async function testToken(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}
