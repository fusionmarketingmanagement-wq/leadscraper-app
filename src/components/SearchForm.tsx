import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'starting' | 'polling' | 'collecting' | 'done' | 'error';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'it', label: 'Italian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'nl', label: 'Dutch' },
  { code: 'pl', label: 'Polish' },
  { code: 'ja', label: 'Japanese' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ar', label: 'Arabic' },
];

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const statusMeta: Record<Status, { color: string; icon: string; bg: string; border: string }> = {
  idle:       { color: '', icon: '', bg: '', border: '' },
  starting:   { color: 'text-indigo-400', icon: '◌', bg: 'bg-indigo-500/5', border: 'border-indigo-500/15' },
  polling:    { color: 'text-indigo-400', icon: '◉', bg: 'bg-indigo-500/5', border: 'border-indigo-500/15' },
  collecting: { color: 'text-violet-400', icon: '◈', bg: 'bg-violet-500/5', border: 'border-violet-500/15' },
  done:       { color: 'text-emerald-400', icon: '✓', bg: 'bg-emerald-500/5', border: 'border-emerald-500/15' },
  error:      { color: 'text-red-400', icon: '✕', bg: 'bg-red-500/5', border: 'border-red-500/15' },
};

const inputClass = 'w-full bg-zinc-900/60 border border-white/8 text-white placeholder-zinc-600 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 disabled:opacity-40 transition-all';
const labelClass = 'block text-xs font-medium text-zinc-400 mb-1.5';

export default function SearchForm() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [maxResults, setMaxResults] = useState(50);
  const [language, setLanguage] = useState('en');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(0);

  const isLoading = status === 'starting' || status === 'polling' || status === 'collecting';
  const meta = statusMeta[status];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!keyword.trim()) return;

    setStatus('starting');
    setMessage('Connecting to Apify...');
    setCount(0);

    try {
      const startRes = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, location, maxResults, language }),
      });

      const startData = await startRes.json() as { runId?: string; datasetId?: string; error?: string };

      if (!startRes.ok) {
        throw new Error(startData.error ?? 'Failed to start scrape');
      }

      const { runId, datasetId } = startData as { runId: string; datasetId: string };
      setStatus('polling');
      setMessage('Scraping Google Maps...');

      let runStatus = 'RUNNING';
      while (runStatus === 'RUNNING' || runStatus === 'READY') {
        await sleep(4000);
        const statusRes = await fetch(`/api/status?runId=${runId}`);
        const statusData = await statusRes.json() as { status: string; itemCount: number };
        runStatus = statusData.status;
        if (statusData.itemCount > 0) {
          setMessage(`Scraping Google Maps... (${statusData.itemCount} results so far)`);
        }
      }

      if (runStatus !== 'SUCCEEDED') {
        throw new Error(`Run ended with status: ${runStatus}`);
      }

      setStatus('collecting');
      setMessage('Saving leads to database...');

      const query = location ? `${keyword} in ${location}` : keyword;
      const collectRes = await fetch(
        `/api/collect?runId=${runId}&datasetId=${encodeURIComponent(datasetId)}&query=${encodeURIComponent(query)}`
      );
      const collectData = await collectRes.json() as { count?: number; error?: string };

      if (!collectRes.ok) throw new Error(collectData.error ?? 'Failed to collect results');

      const saved = collectData.count ?? 0;
      setCount(saved);
      setStatus('done');
      setMessage(`Done! Saved ${saved} new leads to your database.`);
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Keyword + Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Keyword <span className="text-indigo-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. dentists, plumbers, restaurants"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              disabled={isLoading}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input
              type="text"
              placeholder="e.g. New York, London, Sydney"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isLoading}
              className={inputClass}
            />
          </div>
        </div>

        {/* Max results + Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClass.replace(' mb-1.5', '')}>Max Results</label>
              <span className="text-sm font-semibold text-white tabular-nums">{maxResults}</span>
            </div>
            <input
              type="range"
              min={10}
              max={500}
              step={10}
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              disabled={isLoading}
              className="w-full accent-indigo-500 disabled:opacity-40 mt-2"
            />
            <div className="flex justify-between text-[10px] text-zinc-700 font-mono mt-1">
              <span>10</span>
              <span>500</span>
            </div>
          </div>
          <div>
            <label className={labelClass}>Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isLoading}
              className={inputClass + ' cursor-pointer'}
              style={{ colorScheme: 'dark' }}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-zinc-900">
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !keyword.trim()}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-medium transition-all bg-white text-black hover:bg-zinc-100 disabled:bg-white/8 disabled:text-zinc-600 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="animate-spin text-base leading-none">◌</span>
              Processing...
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Search Google Maps
            </>
          )}
        </button>
      </form>

      {/* Status */}
      {status !== 'idle' && (
        <div className={`rounded-xl border p-4 flex items-start gap-3 ${meta.bg} ${meta.border}`}>
          <span className={`text-lg leading-none mt-0.5 shrink-0 ${meta.color} ${isLoading ? 'animate-spin' : ''}`}>
            {meta.icon}
          </span>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${meta.color}`}>{message}</p>
            {status === 'done' && count > 0 && (
              <a
                href="/results"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors no-underline"
              >
                View all leads
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
