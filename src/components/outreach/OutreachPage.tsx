import { useState } from 'react';
import StatusBadge from '../ui/StatusBadge';

type Tab = 'email' | 'whatsapp';

const EMAIL_CAMPAIGNS = [
  { name: 'Cold Outreach — Dentists NYC', status: 'active' as const, leads: 124, opened: '38%', replied: '12%', created: 'Mar 12, 2026' },
  { name: 'Follow-up Sequence B2B', status: 'paused' as const, leads: 86, opened: '44%', replied: '18%', created: 'Mar 8, 2026' },
  { name: 'LinkedIn Reply Campaign', status: 'active' as const, leads: 52, opened: '51%', replied: '22%', created: 'Mar 5, 2026' },
  { name: 'Re-engagement Q1', status: 'draft' as const, leads: 0, opened: '—', replied: '—', created: 'Mar 1, 2026' },
];

const WA_CAMPAIGNS = [
  { name: 'WhatsApp Intro — Real Estate', status: 'active' as const, leads: 67, opened: '72%', replied: '31%', created: 'Mar 10, 2026' },
  { name: 'Appointment Reminders', status: 'active' as const, leads: 203, opened: '89%', replied: '45%', created: 'Feb 28, 2026' },
  { name: 'Event Follow-up', status: 'draft' as const, leads: 0, opened: '—', replied: '—', created: 'Feb 20, 2026' },
];

function statusVariant(s: 'active' | 'paused' | 'draft') {
  switch (s) {
    case 'active': return 'active' as const;
    case 'paused': return 'paused' as const;
    case 'draft': return 'draft' as const;
  }
}

export default function OutreachPage() {
  const [tab, setTab] = useState<Tab>('email');
  const campaigns = tab === 'email' ? EMAIL_CAMPAIGNS : WA_CAMPAIGNS;

  return (
    <div className="mx-auto max-w-6xl space-y-6 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-[#888888]">Manage email and WhatsApp outreach campaigns.</p>
        <button type="button" className="inline-flex items-center justify-center gap-2 px-4 h-9 rounded-lg bg-cyan-500 text-white text-sm font-medium hover:bg-cyan-600 transition-colors cursor-pointer w-full sm:w-auto">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
          New Campaign
        </button>
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-full sm:w-fit">
        {(['email', 'whatsapp'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer capitalize ${
              tab === t ? 'bg-white text-[#171717] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'email' ? 'Email' : 'WhatsApp'}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden" style={{ boxShadow: '0px 1px 1px #00000005' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Name</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Leads</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Opened</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Replied</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Created</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.name} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 px-4 font-medium text-[#171717]">{c.name}</td>
                  <td className="py-3 px-4"><StatusBadge label={c.status.charAt(0).toUpperCase() + c.status.slice(1)} variant={statusVariant(c.status)} /></td>
                  <td className="py-3 px-4 text-gray-600 tabular-nums">{c.leads}</td>
                  <td className="py-3 px-4 text-gray-600">{c.opened}</td>
                  <td className="py-3 px-4 text-gray-600">{c.replied}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs">{c.created}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      {['edit', 'pause', 'delete'].map((action) => (
                        <button key={action} type="button" title={action} className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer">
                          {action === 'edit' && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                          )}
                          {action === 'pause' && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                          )}
                          {action === 'delete' && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
