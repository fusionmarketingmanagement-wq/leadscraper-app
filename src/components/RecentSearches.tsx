import { useState, useEffect, useMemo } from 'react';
import type { Lead } from '../lib/types';

interface SearchGroup {
  query: string;
  count: number;
  latestAt: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function groupRecentSearches(leads: Lead[]): SearchGroup[] {
  const map = new Map<string, SearchGroup>();

  for (const lead of leads) {
    const query = lead.searchQuery || 'Unknown search';
    const existing = map.get(query);
    if (!existing) {
      map.set(query, { query, count: 1, latestAt: lead.scrapedAt });
    } else {
      existing.count += 1;
      if (lead.scrapedAt > existing.latestAt) {
        existing.latestAt = lead.scrapedAt;
      }
    }
  }

  return [...map.values()]
    .sort((a, b) => b.latestAt.localeCompare(a.latestAt))
    .slice(0, 5);
}

export default function RecentSearches() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leads')
      .then((r) => r.json())
      .then((data) => setLeads(Array.isArray(data) ? (data as Lead[]) : []))
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, []);

  const recentSearches = useMemo(() => groupRecentSearches(leads), [leads]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[#888888] text-sm py-4 mt-8">
        <span className="animate-spin text-base">◌</span>
        Loading recent searches...
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border border-[#ebebeb] bg-white overflow-hidden mt-8"
      style={{ boxShadow: '0px 1px 1px #00000005, 0px 2px 2px #0000000a' }}
    >
      <div className="px-6 py-4 border-b border-[#ebebeb] flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-[#171717]">Recent searches</h2>
          <p className="text-xs text-[#888888] mt-0.5">Your last 5 search queries</p>
        </div>
        {leads.length > 0 && (
          <a
            href="/results"
            className="text-xs font-medium text-[#0070f3] hover:text-[#0761d1] transition-colors no-underline shrink-0"
          >
            View all
          </a>
        )}
      </div>

      {recentSearches.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="text-sm text-[#888888]">No searches yet — run your first search above.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#ebebeb] bg-[#fafafa]">
                {['Search query', 'Leads', 'Date', ''].map((h) => (
                  <th
                    key={h}
                    className="py-3 px-4 text-left text-[10px] font-medium text-[#888888] uppercase tracking-widest whitespace-nowrap font-mono"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentSearches.map((row) => (
                <tr key={row.query} className="border-b border-[#ebebeb] last:border-0 hover:bg-[#fafafa] transition-colors">
                  <td className="py-3 px-4 font-medium text-[#171717] max-w-[240px] truncate" title={row.query}>
                    {row.query}
                  </td>
                  <td className="py-3 px-4 text-[#888888] tabular-nums text-xs">{row.count}</td>
                  <td className="py-3 px-4 text-[#888888] whitespace-nowrap text-xs">{formatDate(row.latestAt)}</td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={`/results?q=${encodeURIComponent(row.query)}`}
                      className="text-xs font-medium text-[#0070f3] hover:text-[#0761d1] transition-colors no-underline"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
