import { useState } from 'react';
import StatCard from '../StatCard';

const SOURCES = [
  { source: 'Google Maps', leads: 642, contacted: 518, replied: 124, meetings: 18, cost: '$0.42' },
  { source: 'LinkedIn', leads: 384, contacted: 312, replied: 89, meetings: 11, cost: '$0.68' },
  { source: 'Google Form', leads: 158, contacted: 158, replied: 67, meetings: 8, cost: '$0.00' },
  { source: 'Apollo Enrichment', leads: 100, contacted: 95, replied: 34, meetings: 4, cost: '$1.20' },
];

const RANGES = ['7D', '30D', '90D', 'Custom'] as const;

function ChartPlaceholder({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 h-64 flex flex-col" style={{ boxShadow: '0px 1px 1px #00000005' }}>
      <h3 className="text-sm font-semibold text-[#171717] mb-4">{title}</h3>
      <div className="flex-1 rounded-lg bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center gap-2">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300">
          <path d="M3 3v18h18" />
          <path d="M18 17V9M13 17V5M8 17v-3" />
        </svg>
        <p className="text-xs text-gray-400">Chart coming soon</p>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<(typeof RANGES)[number]>('30D');

  return (
    <div className="mx-auto max-w-6xl space-y-6 min-w-0">
      <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-full sm:w-fit overflow-x-auto">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                range === r ? 'bg-white text-[#171717] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Leads Generated" value="1,284" accent="text-[#171717]" />
        <StatCard label="Outreach Sent" value="1,083" accent="text-emerald-600" />
        <StatCard label="Response Rate" value="28.4%" accent="text-blue-600" />
        <StatCard label="Conversion Rate" value="2.4%" accent="text-cyan-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartPlaceholder title="Leads by Source" />
        <ChartPlaceholder title="Weekly Activity" />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden" style={{ boxShadow: '0px 1px 1px #00000005' }}>
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-[#171717]">Top Performing Sources</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Source</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Leads</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Contacted</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Replied</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Meetings</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Cost per Lead</th>
              </tr>
            </thead>
            <tbody>
              {SOURCES.map((row) => (
                <tr key={row.source} className="border-b border-gray-50 hover:bg-gray-50/80">
                  <td className="py-3 px-4 font-medium">{row.source}</td>
                  <td className="py-3 px-4 tabular-nums">{row.leads}</td>
                  <td className="py-3 px-4 tabular-nums">{row.contacted}</td>
                  <td className="py-3 px-4 tabular-nums">{row.replied}</td>
                  <td className="py-3 px-4 tabular-nums">{row.meetings}</td>
                  <td className="py-3 px-4 text-cyan-600 font-medium">{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
