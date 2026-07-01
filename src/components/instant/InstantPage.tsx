import { useState } from 'react';
import StatusBadge from '../ui/StatusBadge';
import ToggleSwitch from '../ui/ToggleSwitch';

const INSTANT_CONTACTS = [
  { name: 'Sarah Johnson', source: 'Google Form', via: 'WhatsApp + Call', response: '43 seconds', status: 'Meeting Booked' },
  { name: 'Mike Chen', source: 'Landing Page', via: 'Auto Email', response: '58 seconds', status: 'Replied' },
  { name: 'Emily Rodriguez', source: 'Facebook Lead', via: 'WhatsApp', response: '31 seconds', status: 'Meeting Booked' },
  { name: 'David Park', source: 'Google Form', via: 'AI Auto-Call', response: '1m 12s', status: 'Voicemail' },
  { name: 'Lisa Thompson', source: 'Website Chat', via: 'WhatsApp + Email', response: '47 seconds', status: 'Engaged' },
];

const CARDS = [
  {
    title: 'WhatsApp Notify',
    desc: 'Instantly send a WhatsApp message when a new lead submits a form.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    title: 'Auto Email',
    desc: 'Send a personalized welcome email within 60 seconds of submission.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <path d="m22 6-10 7L2 6" />
      </svg>
    ),
  },
  {
    title: 'AI Auto-Call',
    desc: 'Trigger an AI voice call to qualify and book leads automatically.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
];

export default function InstantPage() {
  const [instantOn, setInstantOn] = useState(true);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <p className="text-sm text-[#888888]">Auto-contact new leads within 60 seconds of form submission.</p>

      <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white">
        <ToggleSwitch checked={instantOn} onChange={() => setInstantOn((v) => !v)} label="Instant Mode" />
        <div>
          <p className="text-sm font-medium text-[#171717]">Instant Mode</p>
          <p className="text-xs text-gray-500">{instantOn ? 'Active — new leads are contacted automatically' : 'Paused — manual outreach only'}</p>
        </div>
        <StatusBadge label={instantOn ? 'ON' : 'OFF'} variant={instantOn ? 'active' : 'neutral'} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CARDS.map((card) => (
          <div key={card.title} className="rounded-xl border border-gray-200 bg-white p-5" style={{ boxShadow: '0px 1px 1px #00000005' }}>
            <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3">
              {card.icon}
            </div>
            <h3 className="text-sm font-semibold text-[#171717] mb-1">{card.title}</h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">{card.desc}</p>
            <button type="button" className="px-3 h-8 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
              Configure
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-[#171717]">Recent Instant Contacts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Lead Name</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Source</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Contacted Via</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Response Time</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {INSTANT_CONTACTS.map((row) => (
                <tr key={row.name} className="border-b border-gray-50 hover:bg-gray-50/80">
                  <td className="py-3 px-4 font-medium">{row.name}</td>
                  <td className="py-3 px-4 text-gray-600">{row.source}</td>
                  <td className="py-3 px-4 text-gray-600">{row.via}</td>
                  <td className="py-3 px-4 text-cyan-600 font-medium">{row.response}</td>
                  <td className="py-3 px-4"><StatusBadge label={row.status} variant="success" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
