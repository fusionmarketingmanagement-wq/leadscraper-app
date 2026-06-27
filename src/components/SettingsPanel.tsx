import { useState, useEffect } from 'react';

interface SettingsData {
  apifyConfigured: boolean;
  leadsCount: number;
}

type TestStatus = 'idle' | 'testing' | 'valid' | 'invalid';

const keyDefs = [
  {
    id: 'apify',
    name: 'APIFY_API_TOKEN',
    label: 'Apify API Token',
    desc: 'Required to run Google Maps scraping via Apify.',
    docsUrl: 'console.apify.com/account/integrations',
    configuredKey: 'apifyConfigured' as keyof SettingsData,
    testable: true,
    badge: 'Required',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    iconPath: `<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>`,
  },
];

function StatusBadge({ configured }: { configured: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
        configured
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-[#f5f5f5] text-[#888888] border-[#ebebeb]'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${configured ? 'bg-emerald-500' : 'bg-[#a1a1a1]'}`} />
      {configured ? 'Configured' : 'Not set'}
    </span>
  );
}

export default function SettingsPanel() {
  const [data, setData] = useState<SettingsData | null>(null);
  const [testStatus, setTestStatus] = useState<TestStatus>('idle');
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => setData(d as SettingsData))
      .catch(() =>
        setData({ apifyConfigured: false, leadsCount: 0 })
      );
  }, []);

  async function handleTestToken() {
    setTestStatus('testing');
    try {
      const res = await fetch('/api/settings?test=1');
      const d = await res.json() as { apifyValid?: boolean };
      setTestStatus(d.apifyValid ? 'valid' : 'invalid');
    } catch {
      setTestStatus('invalid');
    }
    setTimeout(() => setTestStatus('idle'), 4000);
  }

  async function handleClearLeads() {
    if (!confirm('Delete all stored leads? This cannot be undone.')) return;
    setClearing(true);
    try {
      await fetch('/api/leads', { method: 'DELETE' });
      setCleared(true);
      setData((prev) => (prev ? { ...prev, leadsCount: 0 } : prev));
    } catch {
      // ignore
    } finally {
      setClearing(false);
    }
  }

  function handleSaveKeys() {
    setSaveMsg('API keys are configured via your .env file. Restart the dev server after editing it.');
    setTimeout(() => setSaveMsg(''), 5000);
  }

  if (!data) {
    return (
      <div className="flex items-center gap-2 text-[#888888] text-sm py-12">
        <span className="animate-spin text-base">◌</span>
        Loading settings...
      </div>
    );
  }

  const leadsCount = cleared ? 0 : data.leadsCount;

  return (
    <div className="space-y-4">

      {/* API Keys section */}
      <div
        className="rounded-xl border border-[#ebebeb] bg-white overflow-hidden"
        style={{ boxShadow: '0px 1px 1px #00000005, 0px 2px 2px #0000000a' }}
      >
        <div className="px-6 py-5 border-b border-[#ebebeb]">
          <h2 className="text-sm font-semibold text-[#171717]">API Keys</h2>
          <p className="text-xs text-[#888888] mt-0.5">
            Managed via your{' '}
            <code className="text-[#171717] bg-[#f5f5f5] px-1.5 py-0.5 rounded text-[11px] border border-[#ebebeb]">.env</code>{' '}
            file. Keys are never exposed to the browser.
          </p>
        </div>

        <div className="divide-y divide-[#ebebeb]">
          {keyDefs.map((key) => {
            const configured = Boolean(data[key.configuredKey]);
            return (
              <div key={key.id} className="px-6 py-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <div className={`mt-0.5 w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${
                    configured ? 'border-emerald-200 bg-emerald-50' : 'border-[#ebebeb] bg-[#fafafa]'
                  }`}>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                      className={configured ? 'text-emerald-600' : 'text-[#a1a1a1]'}
                      dangerouslySetInnerHTML={{ __html: key.iconPath }}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <code className="text-sm font-medium text-[#171717]">{key.name}</code>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${key.badgeColor}`}>
                        {key.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#888888] leading-relaxed">{key.desc}</p>
                    {!configured && (
                      <p className="text-xs text-[#a1a1a1] mt-1">
                        Get your key at{' '}
                        <span className="text-[#0070f3]">{key.docsUrl}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                  <StatusBadge configured={configured} />
                  {key.testable && configured && (
                    <button
                      onClick={handleTestToken}
                      disabled={testStatus === 'testing'}
                      className="px-3 h-7 rounded-md border border-[#ebebeb] bg-white text-xs text-[#4d4d4d] hover:text-[#171717] hover:border-[#a1a1a1] disabled:opacity-50 transition-all font-medium"
                    >
                      {testStatus === 'testing' ? (
                        <span className="flex items-center gap-1"><span className="animate-spin">◌</span> Testing...</span>
                      ) : testStatus === 'valid' ? (
                        <span className="text-emerald-600">✓ Valid</span>
                      ) : testStatus === 'invalid' ? (
                        <span className="text-red-600">✕ Invalid</span>
                      ) : 'Test'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 border-t border-[#ebebeb] bg-[#fafafa] flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1">
            {!data.apifyConfigured && (
              <div className="rounded-md border border-[#ebebeb] bg-white px-4 py-3">
                <p className="text-xs font-medium text-[#171717] mb-2">Quick setup</p>
                <ol className="text-xs text-[#888888] space-y-1 list-decimal list-inside">
                  <li>Copy <code className="text-[#171717]">.env.example</code> to <code className="text-[#171717]">.env</code></li>
                  <li>Add your Apify token from <span className="text-[#0070f3]">console.apify.com</span></li>
                  <li>Restart the dev server</li>
                </ol>
              </div>
            )}
            {saveMsg && (
              <p className="text-xs text-amber-600 flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {saveMsg}
              </p>
            )}
          </div>
          <button
            onClick={handleSaveKeys}
            className="px-4 h-9 rounded-md bg-[#171717] text-white text-sm font-medium hover:bg-[#2d2d2d] transition-all shrink-0"
          >
            Save settings
          </button>
        </div>
      </div>

      {/* Security note */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-600 shrink-0 mt-0.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <div>
          <p className="text-xs font-semibold text-emerald-700 mb-1">Keys stored server-side only</p>
          <p className="text-xs text-emerald-600 leading-relaxed">
            API keys are read from environment variables at build/startup time. They are never sent to the browser, logged, or exposed in client-side code. Your keys are safe.
          </p>
        </div>
      </div>

      {/* Local storage */}
      <div
        className="rounded-xl border border-[#ebebeb] bg-white overflow-hidden"
        style={{ boxShadow: '0px 1px 1px #00000005, 0px 2px 2px #0000000a' }}
      >
        <div className="px-6 py-5 border-b border-[#ebebeb]">
          <h2 className="text-sm font-semibold text-[#171717]">Cloud Storage</h2>
          <p className="text-xs text-[#888888] mt-0.5">
            Leads stored in{' '}
            <code className="text-[#171717] bg-[#f5f5f5] px-1.5 py-0.5 rounded text-[11px] border border-[#ebebeb]">Supabase Postgres</code>{' '}
            — private to your account.
          </p>
        </div>
        <div className="px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg border border-blue-200 bg-blue-50 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-600">
                <ellipse cx="12" cy="5" rx="9" ry="3"/>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-[#171717]">
                {leadsCount.toLocaleString()} lead{leadsCount !== 1 ? 's' : ''} stored
              </p>
              <p className="text-xs text-[#888888]">Deduplicated by Google Maps place ID</p>
            </div>
          </div>
          <button
            onClick={handleClearLeads}
            disabled={clearing || leadsCount === 0}
            className="px-3 h-8 rounded-md border border-red-200 bg-red-50 text-xs text-red-600 hover:bg-red-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium"
          >
            {clearing ? 'Clearing...' : 'Clear all'}
          </button>
        </div>
      </div>

      {/* Scraper config */}
      <div
        className="rounded-xl border border-[#ebebeb] bg-white overflow-hidden"
        style={{ boxShadow: '0px 1px 1px #00000005, 0px 2px 2px #0000000a' }}
      >
        <div className="px-6 py-5 border-b border-[#ebebeb]">
          <h2 className="text-sm font-semibold text-[#171717]">Scraper Configuration</h2>
        </div>
        <div className="px-6 py-4 space-y-3">
          {[
            { label: 'Apify Actor', value: 'compass/google-maps-extractor' },
            { label: 'Data Source', value: 'Google Maps' },
            { label: 'Social Links', value: 'Extracted from scraped data' },
            { label: 'Email', value: 'Available when listed on Google Maps' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between text-xs">
              <span className="text-[#888888]">{label}</span>
              <code className="text-[#171717] bg-[#f5f5f5] px-2 py-1 rounded border border-[#ebebeb]">{value}</code>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
