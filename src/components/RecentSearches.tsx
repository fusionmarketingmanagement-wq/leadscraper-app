import { useState, useEffect } from 'react';
import type { SearchRecord } from '../lib/types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function sourceLabel(source: SearchRecord['source']): string {
  switch (source) {
    case 'google_maps':
      return 'Google Maps';
    case 'linkedin':
      return 'LinkedIn';
    default: {
      const exhaustive: never = source;
      return exhaustive;
    }
  }
}

export default function RecentSearches() {
  const [searches, setSearches] = useState<SearchRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/searches')
      .then((r) => r.json())
      .then((data) => setSearches(Array.isArray(data) ? (data as SearchRecord[]) : []))
      .catch(() => setSearches([]))
      .finally(() => setLoading(false));
  }, []);

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
          <p className="text-xs text-[#888888] mt-0.5">Your last 5 searches across all sources</p>
        </div>
        {searches.length > 0 && (
          <a
            href="/results"
            className="text-xs font-medium text-[#0070f3] hover:text-[#0761d1] transition-colors no-underline shrink-0"
          >
            View all
          </a>
        )}
      </div>

      {searches.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="text-sm text-[#888888]">No searches yet — choose a source above to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#ebebeb] bg-[#fafafa]">
                {['Source', 'Search query', 'Leads', 'Date', ''].map((h) => (
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
              {searches.map((row) => (
                <tr key={row.id} className="border-b border-[#ebebeb] last:border-0 hover:bg-[#fafafa] transition-colors">
                  <td className="py-3 px-4 text-xs text-[#888888] whitespace-nowrap">{sourceLabel(row.source)}</td>
                  <td className="py-3 px-4 font-medium text-[#171717] max-w-[240px] truncate" title={row.query}>
                    {row.query}
                  </td>
                  <td className="py-3 px-4 text-[#888888] tabular-nums text-xs">{row.leadCount ?? 0}</td>
                  <td className="py-3 px-4 text-[#888888] whitespace-nowrap text-xs">{formatDate(row.createdAt)}</td>
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
