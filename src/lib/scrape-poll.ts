const TERMINAL_STATUSES = new Set(['SUCCEEDED', 'FAILED', 'ABORTED', 'TIMED-OUT']);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface ScrapePollOptions {
  runId: string;
  datasetId: string;
  searchId: string;
  source: 'google_maps' | 'linkedin';
  query: string;
  onProgress: (message: string) => void;
  runningMessage: string;
}

export interface ScrapePollResult {
  saved: number;
  total: number;
}

export async function pollScrapeAndCollect(options: ScrapePollOptions): Promise<ScrapePollResult> {
  const { runId, datasetId, searchId, source, query, onProgress, runningMessage } = options;

  let runStatus = 'RUNNING';
  let itemCount = 0;

  while (!TERMINAL_STATUSES.has(runStatus)) {
    await sleep(3000);
    const statusRes = await fetch(`/api/status?runId=${encodeURIComponent(runId)}`);
    const statusData = await statusRes.json() as {
      status?: string;
      itemCount?: number;
      error?: string;
    };

    if (!statusRes.ok) {
      throw new Error(statusData.error ?? 'Failed to check scrape status');
    }

    runStatus = statusData.status ?? 'RUNNING';
    itemCount = statusData.itemCount ?? 0;
    onProgress(
      itemCount > 0
        ? `${runningMessage} ${itemCount} results found so far.`
        : `${runningMessage} this may take 1–3 minutes, please wait.`
    );
  }

  if (runStatus !== 'SUCCEEDED') {
    throw new Error(`Scrape ${runStatus.toLowerCase().replace('_', ' ')}`);
  }

  onProgress('Saving leads to your database...');

  const params = new URLSearchParams({
    datasetId,
    searchId,
    source,
    query,
  });

  const collectRes = await fetch(`/api/collect?${params.toString()}`);
  const collectData = await collectRes.json() as { count?: number; total?: number; error?: string };

  if (!collectRes.ok) {
    throw new Error(collectData.error ?? 'Failed to save leads');
  }

  return {
    saved: collectData.count ?? 0,
    total: collectData.total ?? 0,
  };
}
