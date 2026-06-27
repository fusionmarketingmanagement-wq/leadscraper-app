import { useState, useEffect } from 'react';

interface SettingsData {
  apifyConfigured: boolean;
  googlePlacesConfigured: boolean;
  hunterConfigured: boolean;
  zeroBounceConfigured: boolean;
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
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    iconPath: `<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>`,
  },
  {
    id: 'google',
    name: 'GOOGLE_PLACES_API_KEY',
    label: 'Google Places API Key',
    desc: 'Optional. Enriches leads with additional Google Places data.',
    docsUrl: 'console.cloud.google.com/apis',
    configuredKey: 'googlePlacesConfigured' as keyof SettingsData,
    testable: false,
    badge: 'Optional',
    badgeColor: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    iconPath: `<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`,
  },
  {
    id: 'hunter',
    name: 'HUNTER_API_KEY',
    label: 'Hunter.io API Key',
    desc: 'Optional. Finds professional email addresses for scraped leads.',
    docsUrl: 'hunter.io/api-keys',
    configuredKey: 'hunterConfigured' as keyof SettingsData,
    testable: false,
    badge: 'Optional',
    badgeColor: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    iconPath: `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>`,
  },
  {
    id: 'zerobounce',
    name: 'ZEROBOUNCE_API_KEY',
    label: 'ZeroBounce API Key',
    desc: 'Optional. Verifies email addresses to reduce bounce rates.',
    docsUrl: 'app.zerobounce.net/members/api',
    configuredKey: 'zeroBounceConfigured' as keyof SettingsData,
    testable: false,
    badge: 'Optional',
    badgeColor: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    iconPath: `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>`,
  },
];

function StatusBadge({ configured }: { configured: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
        configured
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          : 'bg-zinc-800/60 text-zinc-500 border-zinc-700/50'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${configured ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
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
        setData({ apifyConfigured: false, googlePlacesConfigured: false, hunterConfigured: false, zeroBounceConfigured: false, leadsCount: 0 })
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
      <div className="flex items-center gap-2 text-zinc-600 text-sm py-12">
        <span className="animate-spin text-base">◌</span>
        Loading settings...
      </div>
    );
  }

  const leadsCount = cleared ? 0 : data.leadsCount;

  return (
    <div className="space-y-4">

      {/* API Keys section */}
      <div className="rounded-2xl border border-white/8 bg-zinc-900/40 overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">API Keys</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Managed via your{' '}
            <code className="text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded text-[11px]">.env</code>{' '}
            file. Keys are never exposed to the browser.
          </p>
        </div>

        <div className="divide-y divide-white/5">
          {keyDefs.map((key) => {
            const configured = Boolean(data[key.configuredKey]);
            return (
              <div key={key.id} className="px-6 py-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  {/* Icon */}
                  <div className={`mt-0.5 w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                    configured ? 'border-emerald-500/20 bg-emerald-500/8' : 'border-white/8 bg-white/4'
                  }`}>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                      className={configured ? 'text-emerald-400' : 'text-zinc-500'}
                      dangerouslySetInnerHTML={{ __html: key.iconPath }}
                    />
                  </div>
                  {/* Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <code className="text-sm font-medium text-white">{key.name}</code>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${key.badgeColor}`}>
                        {key.badge}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">{key.desc}</p>
                    {!configured && (
                      <p className="text-xs text-zinc-600 mt-1">
                        Get your key at{' '}
                        <span className="text-indigo-400">{key.docsUrl}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                  <StatusBadge configured={configured} />
                  {key.testable && configured && (
                    <button
                      onClick={handleTestToken}
                      disabled={testStatus === 'testing'}
                      className="px-3 h-7 rounded-lg border border-white/8 bg-white/4 text-xs text-zinc-400 hover:text-white hover:bg-white/8 disabled:opacity-50 transition-all font-medium"
                    >
                      {testStatus === 'testing' ? (
                        <span className="flex items-center gap-1"><span className="animate-spin">◌</span> Testing...</span>
                      ) : testStatus === 'valid' ? (
                        <span className="text-emerald-400">✓ Valid</span>
                      ) : testStatus === 'invalid' ? (
                        <span className="text-red-400">✕ Invalid</span>
                      ) : (
                        'Test'
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Save button + setup instructions */}
        <div className="px-6 py-4 border-t border-white/5 bg-zinc-950/20 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1">
            {!data.apifyConfigured && (
              <div className="rounded-xl border border-white/6 bg-white/3 px-4 py-3">
                <p className="text-xs font-medium text-zinc-300 mb-2">Quick setup</p>
                <ol className="text-xs text-zinc-500 space-y-1 list-decimal list-inside">
                  <li>Copy <code className="text-zinc-400">.env.example</code> to <code className="text-zinc-400">.env</code></li>
                  <li>Add your Apify token from <span className="text-indigo-400">console.apify.com</span></li>
                  <li>Restart the dev server</li>
                </ol>
              </div>
            )}
            {saveMsg && (
              <p className="text-xs text-amber-400 flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {saveMsg}
              </p>
            )}
          </div>
          <button
            onClick={handleSaveKeys}
            className="px-4 h-9 rounded-xl bg-white text-black text-sm font-medium hover:bg-zinc-100 transition-all shrink-0"
          >
            Save settings
          </button>
        </div>
      </div>

      {/* Security note */}
      <div className="rounded-2xl border border-emerald-500/12 bg-emerald-500/4 p-4 flex items-start gap-3">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-500 shrink-0 mt-0.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <div>
          <p className="text-xs font-semibold text-emerald-400 mb-1">Keys stored server-side only</p>
          <p className="text-xs text-zinc-500 leading-relaxed">
            API keys are read from environment variables at build/startup time. They are never sent to the browser, logged, or exposed in client-side code. Your keys are safe.
          </p>
        </div>
      </div>

      {/* Local database */}
      <div className="rounded-2xl border border-white/8 bg-zinc-900/40 overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">Local Database</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Leads stored in <code className="text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded text-[11px]">data/leads.db</code> — stays on your machine.
          </p>
        </div>
        <div className="px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl border border-indigo-500/20 bg-indigo-500/8 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-indigo-400">
                <ellipse cx="12" cy="5" rx="9" ry="3"/>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {leadsCount.toLocaleString()} lead{leadsCount !== 1 ? 's' : ''} stored
              </p>
              <p className="text-xs text-zinc-500">Deduplicated by Google Maps place ID</p>
            </div>
          </div>
          <button
            onClick={handleClearLeads}
            disabled={clearing || leadsCount === 0}
            className="px-3 h-8 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-400 hover:bg-red-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-medium"
          >
            {clearing ? 'Clearing...' : 'Clear all'}
          </button>
        </div>
      </div>

      {/* Scraper config */}
      <div className="rounded-2xl border border-white/8 bg-zinc-900/40 overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5">
          <h2 className="text-sm font-semibold text-white">Scraper Configuration</h2>
        </div>
        <div className="px-6 py-4 space-y-3">
          {[
            { label: 'Apify Actor', value: 'compass/crawler-google-places' },
            { label: 'Data Source', value: 'Google Maps' },
            { label: 'Social Links', value: 'Extracted from scraped data' },
            { label: 'Email', value: 'Available when listed on Google Maps' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">{label}</span>
              <code className="text-zinc-300 bg-white/4 px-2 py-1 rounded">{value}</code>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
