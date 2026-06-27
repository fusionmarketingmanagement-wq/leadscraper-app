import { useState, useEffect } from 'react';

export default function DashboardQuickActions() {
  const [leadsCount, setLeadsCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => setLeadsCount((d as { leadsCount?: number }).leadsCount ?? 0))
      .catch(() => setLeadsCount(0));
  }, []);

  const countLabel =
    leadsCount === null ? '' : ` (${leadsCount.toLocaleString()})`;

  return (
    <div
      className="rounded-xl border border-[#ebebeb] bg-white p-4"
      style={{ boxShadow: '0px 1px 1px #00000005, 0px 2px 2px #0000000a' }}
    >
      <p className="text-xs font-semibold text-[#171717] mb-3">Quick actions</p>
      <div className="space-y-1">
        <a
          href="/results"
          className="flex items-center gap-2.5 py-2 px-2 rounded-md text-xs text-[#888888] hover:text-[#171717] hover:bg-[#fafafa] transition-all no-underline group"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#a1a1a1] group-hover:text-[#4d4d4d] transition-colors">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
          View all leads{countLabel}
        </a>
        <a
          href="/api/export"
          className="flex items-center gap-2.5 py-2 px-2 rounded-md text-xs text-[#888888] hover:text-[#171717] hover:bg-[#fafafa] transition-all no-underline group"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#a1a1a1] group-hover:text-[#4d4d4d] transition-colors">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export leads to CSV
        </a>
        <a
          href="/settings"
          className="flex items-center gap-2.5 py-2 px-2 rounded-md text-xs text-[#888888] hover:text-[#171717] hover:bg-[#fafafa] transition-all no-underline group"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#a1a1a1] group-hover:text-[#4d4d4d] transition-colors">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.07 4.93l-1.42 1.42M4.93 4.93l1.42 1.42M4.93 19.07l1.42-1.42M19.07 19.07l-1.42-1.42M12 2v2M12 20v2M2 12h2M20 12h2" />
          </svg>
          Manage API keys
        </a>
      </div>
    </div>
  );
}
