import { useState, useEffect } from 'react';
import StatusBadge from '../ui/StatusBadge';
import ToggleSwitch from '../ui/ToggleSwitch';

export type Tab = 'general' | 'integrations' | 'team' | 'billing';

const INTEGRATIONS = [
  { name: 'Apify', color: 'bg-green-500', connected: true },
  { name: 'Supabase', color: 'bg-emerald-500', connected: true },
  { name: 'WhatsApp Business', color: 'bg-green-600', connected: false },
  { name: 'Twilio', color: 'bg-red-500', connected: false },
  { name: 'SendGrid', color: 'bg-blue-500', connected: false },
  { name: 'Vapi.ai', color: 'bg-violet-500', connected: false },
  { name: 'Google Calendar', color: 'bg-blue-600', connected: false },
  { name: 'GoHighLevel', color: 'bg-orange-500', connected: false },
];

const TEAM = [
  { name: 'Talha Mouzzam', email: 'talhamouzzamofficial@gmail.com', role: 'Owner', status: 'Active', initials: 'TM' },
  { name: 'Sarah Johnson', email: 'sarah@leadscraper.io', role: 'Admin', status: 'Active', initials: 'SJ' },
  { name: 'Mike Chen', email: 'mike@leadscraper.io', role: 'Member', status: 'Invited', initials: 'MC' },
];

const INVOICES = [
  { id: 'INV-2026-003', date: 'Mar 1, 2026', amount: '$49.00', status: 'Paid' },
  { id: 'INV-2026-002', date: 'Feb 1, 2026', amount: '$49.00', status: 'Paid' },
  { id: 'INV-2026-001', date: 'Jan 1, 2026', amount: '$49.00', status: 'Paid' },
];

interface Props {
  initialTab?: Tab;
}

export default function SettingsPage({ initialTab = 'general' }: Props) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'team', label: 'Team' },
    { id: 'billing', label: 'Billing' },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              tab === t.id ? 'bg-white text-[#171717] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'general' && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-6 max-w-xl" style={{ boxShadow: '0px 1px 1px #00000005' }}>
          <div>
            <h3 className="text-sm font-semibold text-[#171717] mb-4">Profile</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-lg font-semibold">TM</div>
              <button type="button" className="text-xs text-cyan-600 hover:underline cursor-pointer">Change avatar</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                <input defaultValue="Talha Mouzzam" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input defaultValue="talhamouzzamofficial@gmail.com" readOnly className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#171717] mb-3">Notifications</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Email notifications</span>
                <ToggleSwitch checked={emailNotif} onChange={() => setEmailNotif((v) => !v)} label="Email notifications" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Push notifications</span>
                <ToggleSwitch checked={pushNotif} onChange={() => setPushNotif((v) => !v)} label="Push notifications" />
              </div>
            </div>
          </div>
          <button type="button" className="px-4 h-9 rounded-lg bg-cyan-500 text-white text-sm font-medium hover:bg-cyan-600 cursor-pointer">Save</button>
        </div>
      )}

      {tab === 'integrations' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INTEGRATIONS.map((int) => (
            <div key={int.name} className="rounded-xl border border-gray-200 bg-white p-4" style={{ boxShadow: '0px 1px 1px #00000005' }}>
              <div className={`w-10 h-10 rounded-lg ${int.color} flex items-center justify-center text-white text-xs font-bold mb-3`}>
                {int.name.slice(0, 2).toUpperCase()}
              </div>
              <p className="text-sm font-semibold text-[#171717] mb-1">{int.name}</p>
              <StatusBadge label={int.connected ? 'Connected ✓' : 'Not connected'} variant={int.connected ? 'success' : 'neutral'} />
              <button type="button" className={`mt-3 w-full h-8 rounded-lg text-xs font-medium cursor-pointer ${int.connected ? 'border border-gray-200 text-gray-600 hover:bg-gray-50' : 'bg-cyan-500 text-white hover:bg-cyan-600'}`}>
                {int.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'team' && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden" style={{ boxShadow: '0px 1px 1px #00000005' }}>
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#171717]">Team Members</h3>
            <button type="button" className="px-3 h-8 rounded-lg bg-cyan-500 text-white text-xs font-medium hover:bg-cyan-600 cursor-pointer">+ Invite Member</button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Member</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Email</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Role</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {TEAM.map((m) => (
                <tr key={m.email} className="border-b border-gray-50 hover:bg-gray-50/80">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-semibold">{m.initials}</div>
                      <span className="font-medium">{m.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{m.email}</td>
                  <td className="py-3 px-4 text-gray-600">{m.role}</td>
                  <td className="py-3 px-4"><StatusBadge label={m.status} variant={m.status === 'Active' ? 'success' : 'warning'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'billing' && (
        <div className="space-y-6 max-w-2xl">
          <div className="rounded-xl border border-gray-200 bg-white p-6" style={{ boxShadow: '0px 1px 1px #00000005' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-[#171717]">Starter Plan</p>
                <p className="text-2xl font-bold text-cyan-600 mt-1">$49<span className="text-sm font-normal text-gray-500">/mo</span></p>
              </div>
              <button type="button" className="px-4 h-9 rounded-lg bg-cyan-500 text-white text-sm font-medium hover:bg-cyan-600 cursor-pointer">Upgrade Plan</button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'API calls', used: 72, max: 100 },
                { label: 'Leads scraped', used: 640, max: 1000 },
                { label: 'Emails sent', used: 420, max: 500 },
              ].map((bar) => (
                <div key={bar.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{bar.label}</span>
                    <span className="text-gray-500">{bar.used} / {bar.max}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${(bar.used / bar.max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-[#171717]">Invoice History</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Invoice</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((inv) => (
                  <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50/80">
                    <td className="py-3 px-4 font-mono text-xs">{inv.id}</td>
                    <td className="py-3 px-4 text-gray-600">{inv.date}</td>
                    <td className="py-3 px-4 font-medium">{inv.amount}</td>
                    <td className="py-3 px-4"><StatusBadge label={inv.status} variant="success" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
