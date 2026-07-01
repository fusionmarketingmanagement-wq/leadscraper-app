import { useState } from 'react';
import { pollScrapeAndCollect } from '../lib/scrape-poll';

type Status = 'idle' | 'scraping' | 'done' | 'error';

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

const statusMeta: Record<Status, { color: string; icon: string; bg: string; border: string }> = {
  idle:     { color: '', icon: '', bg: '', border: '' },
  scraping: { color: 'text-blue-700', icon: '◌', bg: 'bg-blue-50', border: 'border-blue-200' },
  done:     { color: 'text-emerald-700', icon: '✓', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  error:    { color: 'text-red-700', icon: '✕', bg: 'bg-red-50', border: 'border-red-200' },
};

const inputClass =
  'w-full bg-white border border-[#ebebeb] text-[#171717] placeholder-[#888888] rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717]/10 disabled:opacity-40 disabled:bg-[#fafafa] transition-all';
const labelClass = 'block text-xs font-medium text-[#4d4d4d] mb-1.5';

export default function SearchForm() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [maxResults, setMaxResults] = useState(50);
  const [language, setLanguage] = useState('en');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(0);

  const isLoading = status === 'scraping';
  const meta = statusMeta[status];

  async function handleSubmit() {
    if (!keyword.trim()) return;

    setStatus('scraping');
    setMessage('Starting Google Maps scrape...');
    setCount(0);

    const searchString = location.trim()
      ? `${keyword.trim()} in ${location.trim()}`
      : keyword.trim();

    try {
      const startRes = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, location, maxResults, language }),
      });

      const startData = await startRes.json() as {
        runId?: string;
        datasetId?: string;
        searchId?: string;
        query?: string;
        error?: string;
      };

      if (!startRes.ok) {
        throw new Error(startData.error ?? 'Failed to start scrape');
      }

      const { runId, datasetId, searchId, query } = startData;
      if (!runId || !datasetId || !searchId) {
        throw new Error('Invalid scrape response from server');
      }

      const result = await pollScrapeAndCollect({
        runId,
        datasetId,
        searchId,
        source: 'google_maps',
        query: query ?? searchString,
        runningMessage: 'Scraping Google Maps...',
        onProgress: setMessage,
      });

      setCount(result.saved);
      setStatus('done');

      if (result.total === 0) {
        setMessage('No results found. Try a different keyword or location.');
      } else if (result.saved === 0) {
        setMessage(`${result.total} leads found, but all were already in your database.`);
      } else {
        setMessage(`Saved ${result.saved} new leads. Redirecting to results…`);
        setTimeout(() => { window.location.href = '/results'; }, 1500);
      }
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={(e) => { e.preventDefault(); void handleSubmit(); }} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Keyword <span className="text-[#0070f3]">*</span>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#4d4d4d]">Max Results</label>
              <span className="text-sm font-semibold text-[#171717] tabular-nums">{maxResults}</span>
            </div>
            <input
              type="range"
              min={10}
              max={500}
              step={10}
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              disabled={isLoading}
              className="w-full accent-[#171717] disabled:opacity-40 mt-2"
            />
            <div className="flex justify-between text-[10px] text-[#888888] font-mono mt-1">
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
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !keyword.trim()}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-md text-sm font-medium transition-all bg-[#171717] text-white hover:bg-[#2d2d2d] disabled:bg-[#f5f5f5] disabled:text-[#888888] disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="animate-spin text-base leading-none">◌</span>
              Scraping... please wait
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

      {status !== 'idle' && (
        <div className={`rounded-md border p-4 flex items-start gap-3 ${meta.bg} ${meta.border}`}>
          <span className={`text-lg leading-none mt-0.5 shrink-0 ${meta.color} ${isLoading ? 'animate-spin' : ''}`}>
            {meta.icon}
          </span>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${meta.color}`}>{message}</p>
            {status === 'done' && count > 0 && (
              <a
                href="/results"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#0070f3] hover:text-[#0761d1] transition-colors no-underline"
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
