import { useState } from 'react';
import { pollScrapeAndCollect } from '../lib/scrape-poll';
import type { LinkedInScraperMode } from '../lib/types';
import RepeatableInputList from './RepeatableInputList';

type Status = 'idle' | 'scraping' | 'done' | 'error';

const MODES: { value: LinkedInScraperMode; label: string; cost: string }[] = [
  { value: 'Short', label: 'Short', cost: '~$0.10 per search page' },
  { value: 'Full', label: 'Full', cost: '~$0.10/page + $0.004/profile' },
  { value: 'Full + email search', label: 'Full + email search', cost: '~$0.10/page + $0.01/profile' },
];

const statusMeta: Record<Status, { color: string; icon: string; bg: string; border: string }> = {
  idle: { color: '', icon: '', bg: '', border: '' },
  scraping: { color: 'text-blue-700', icon: '◌', bg: 'bg-blue-50', border: 'border-blue-200' },
  done: { color: 'text-emerald-700', icon: '✓', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  error: { color: 'text-red-700', icon: '✕', bg: 'bg-red-50', border: 'border-red-200' },
};

const inputClass =
  'w-full bg-white border border-[#ebebeb] text-[#171717] placeholder-[#888888] rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717]/10 disabled:opacity-40 disabled:bg-[#fafafa] transition-all';
const labelClass = 'block text-xs font-medium text-[#4d4d4d] mb-1.5';

export default function LinkedInSearchForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<string[]>(['']);
  const [currentCompanies, setCurrentCompanies] = useState<string[]>(['']);
  const [pastCompanies, setPastCompanies] = useState<string[]>(['']);
  const [schools, setSchools] = useState<string[]>(['']);
  const [currentJobTitles, setCurrentJobTitles] = useState<string[]>(['']);
  const [maxItems, setMaxItems] = useState(20);
  const [profileScraperMode, setProfileScraperMode] = useState<LinkedInScraperMode>('Short');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(0);

  const isLoading = status === 'scraping';
  const meta = statusMeta[status];
  const selectedMode = MODES.find((m) => m.value === profileScraperMode) ?? MODES[0];

  function cleanList(values: string[]) {
    return values.map((v) => v.trim()).filter(Boolean);
  }

  async function handleSubmit() {
    const payload = {
      searchQuery: searchQuery.trim(),
      locations: cleanList(locations),
      currentCompanies: cleanList(currentCompanies),
      pastCompanies: cleanList(pastCompanies),
      schools: cleanList(schools),
      currentJobTitles: cleanList(currentJobTitles),
      maxItems,
      profileScraperMode,
    };

    const hasFilters =
      payload.searchQuery ||
      payload.locations.length ||
      payload.currentCompanies.length ||
      payload.pastCompanies.length ||
      payload.schools.length ||
      payload.currentJobTitles.length;

    if (!hasFilters) return;

    setStatus('scraping');
    setMessage('Starting LinkedIn scrape...');
    setCount(0);

    try {
      const startRes = await fetch('/api/scrape/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
        source: 'linkedin',
        query: query ?? payload.searchQuery ?? 'LinkedIn search',
        runningMessage: 'Scraping LinkedIn profiles...',
        onProgress: setMessage,
      });

      setCount(result.saved);
      setStatus('done');

      if (result.total === 0) {
        setMessage('No profiles found. Try different filters.');
      } else if (result.saved === 0) {
        setMessage(`${result.total} profiles found, but all were already in your database.`);
      } else {
        setMessage(`Saved ${result.saved} new profiles. Redirecting to results…`);
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
        <div>
          <label className={labelClass}>Search query</label>
          <input
            type="text"
            placeholder="e.g. Marketing Manager"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Locations Filter</label>
          <RepeatableInputList values={locations} onChange={setLocations} placeholder="e.g. New York" disabled={isLoading} />
        </div>

        <div>
          <label className={labelClass}>Current Company Filter</label>
          <RepeatableInputList values={currentCompanies} onChange={setCurrentCompanies} placeholder="LinkedIn company URL" disabled={isLoading} />
        </div>

        <div>
          <label className={labelClass}>Past Company Filter</label>
          <RepeatableInputList values={pastCompanies} onChange={setPastCompanies} placeholder="LinkedIn company URL" disabled={isLoading} />
        </div>

        <div>
          <label className={labelClass}>School Filter</label>
          <RepeatableInputList values={schools} onChange={setSchools} placeholder="e.g. Stanford University" disabled={isLoading} />
        </div>

        <div>
          <label className={labelClass}>Current Job Title Filter</label>
          <RepeatableInputList values={currentJobTitles} onChange={setCurrentJobTitles} placeholder="e.g. Software Engineer" disabled={isLoading} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Maximum number of profiles to scrape</label>
            <input
              type="number"
              min={1}
              max={500}
              value={maxItems}
              onChange={(e) => setMaxItems(Number(e.target.value))}
              disabled={isLoading}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Profile Scraper Mode</label>
            <select
              value={profileScraperMode}
              onChange={(e) => setProfileScraperMode(e.target.value as LinkedInScraperMode)}
              disabled={isLoading}
              className={inputClass + ' cursor-pointer'}
            >
              {MODES.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-semibold text-amber-700 mb-1">Apify Cost Estimate</p>
          <p className="text-xs text-amber-600 leading-relaxed">
            {selectedMode.label}: {selectedMode.cost}. LinkedIn runs can take 30–90 seconds.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-md text-sm font-medium transition-all bg-[#171717] text-white hover:bg-[#2d2d2d] disabled:bg-[#f5f5f5] disabled:text-[#888888] disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="animate-spin text-base leading-none">◌</span>
              Scraping... please wait
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" />
                <path d="M8 10v7M8 7.5v.01M12 17v-4.2c0-1.2.9-2.3 2.1-2.3s2.1 1 2.1 2.2V17M12 10.8V17" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
              Search LinkedIn
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
              <a href="/results" className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#0070f3] hover:text-[#0761d1] transition-colors no-underline">
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
