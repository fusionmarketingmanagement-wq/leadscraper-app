import { useState, useEffect, useMemo } from 'react';
import type { Lead } from '../lib/types';
import StatCard from './StatCard';

interface SettingsData {
  apifyConfigured: boolean;
}

export default function DashboardOverview() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/leads').then((r) => r.json()),
      fetch('/api/settings').then((r) => r.json()),
    ])
      .then(([leadsData, settingsData]) => {
        setLeads(Array.isArray(leadsData) ? (leadsData as Lead[]) : []);
        setSettings(settingsData as SettingsData);
      })
      .catch(() => {
        setLeads([]);
        setSettings({ apifyConfigured: false });
      })
      .finally(() => setLoading(false));
  }, []);

  const total = leads.length;
  const withEmail = leads.filter((l) => l.email).length;
  const withPhone = leads.filter((l) => l.phone).length;
  const withWebsite = leads.filter((l) => l.website).length;

  const pct = (n: number) => (total > 0 ? `${Math.round((n / total) * 100)}% of total` : undefined);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[#888888] text-sm py-4 mb-6">
        <span className="animate-spin text-base">◌</span>
        Loading overview...
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      {settings && !settings.apifyConfigured && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <div className="mt-0.5 text-amber-600 shrink-0">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-700 mb-1">Apify API token not configured</p>
            <p className="text-xs text-amber-600 leading-relaxed">
              Add <code className="text-amber-800 bg-amber-100 px-1 rounded">APIFY_API_TOKEN</code> to your{' '}
              <code className="text-amber-800 bg-amber-100 px-1 rounded">.env</code> file, then restart the server.{' '}
              <a href="/settings" className="text-amber-800 underline underline-offset-2 hover:text-amber-900">
                Go to settings
              </a>
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total leads" value={total.toLocaleString()} />
        <StatCard
          label="With email"
          value={withEmail.toLocaleString()}
          sub={pct(withEmail)}
          accent="text-emerald-600"
        />
        <StatCard
          label="With phone"
          value={withPhone.toLocaleString()}
          sub={pct(withPhone)}
          accent="text-blue-600"
        />
        <StatCard
          label="With website"
          value={withWebsite.toLocaleString()}
          sub={pct(withWebsite)}
          accent="text-violet-600"
        />
      </div>
    </div>
  );
}
