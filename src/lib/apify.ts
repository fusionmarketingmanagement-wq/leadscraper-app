import type { ApifyRunResult, LinkedInScrapeInput, RunStatus } from './types';

const BASE = 'https://api.apify.com/v2';
const GOOGLE_MAPS_ACTOR_ID = 'compass~google-maps-extractor';
const LINKEDIN_TASK_ID = 'fusion_marketing~linkedin-profile-search-task';

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

async function startActorRun(
  endpoint: string,
  input: Record<string, unknown>,
  token: string
): Promise<ApifyRunResult> {
  const res = await fetch(`${endpoint}?token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
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

export async function startScrape(
  searchString: string,
  maxResults: number,
  language: string,
  token: string
): Promise<ApifyRunResult> {
  return startActorRun(
    `${BASE}/acts/${GOOGLE_MAPS_ACTOR_ID}/runs`,
    {
      searchStringsArray: [searchString],
      maxCrawledPlacesPerSearch: maxResults,
      language,
    },
    token
  );
}

export async function startLinkedInScrape(
  input: LinkedInScrapeInput,
  token: string
): Promise<ApifyRunResult> {
  const body: Record<string, unknown> = {
    profileScraperMode: input.profileScraperMode ?? 'Short',
    maxItems: input.maxItems ?? 20,
  };

  if (input.searchQuery?.trim()) body.searchQuery = input.searchQuery.trim();
  if (input.locations?.length) body.locations = input.locations.filter(Boolean);
  if (input.currentCompanies?.length) body.currentCompanies = input.currentCompanies.filter(Boolean);
  if (input.pastCompanies?.length) body.pastCompanies = input.pastCompanies.filter(Boolean);
  if (input.schools?.length) body.schools = input.schools.filter(Boolean);
  if (input.currentJobTitles?.length) body.currentJobTitles = input.currentJobTitles.filter(Boolean);

  return startActorRun(`${BASE}/actor-tasks/${LINKEDIN_TASK_ID}/runs`, body, token);
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
