import { useState } from 'react';
import StatCard from '../StatCard';
import StatusBadge from '../ui/StatusBadge';
import ToggleSwitch from '../ui/ToggleSwitch';

const ACTIVITY = [
  { icon: 'linkedin', text: 'New lead scraped from LinkedIn', time: '2 min ago', color: 'text-cyan-600 bg-cyan-50' },
  { icon: 'email', text: 'Email sequence started for 24 leads', time: '18 min ago', color: 'text-emerald-600 bg-emerald-50' },
  { icon: 'call', text: 'AI call completed — meeting booked', time: '1 hr ago', color: 'text-violet-600 bg-violet-50' },
  { icon: 'maps', text: 'Google Maps scrape finished — 47 new leads', time: '2 hrs ago', color: 'text-blue-600 bg-blue-50' },
  { icon: 'whatsapp', text: 'WhatsApp reply received from Sarah J.', time: '3 hrs ago', color: 'text-green-600 bg-green-50' },
  { icon: 'booking', text: 'Discovery call confirmed for tomorrow', time: '5 hrs ago', color: 'text-amber-600 bg-amber-50' },
];

const MODULES = [
  { name: 'Lead Scraper', on: true },
  { name: 'Outreach', on: true },
  { name: 'Conversations', on: true },
  { name: 'Reach Instant', on: false },
  { name: 'AI Agent', on: true },
  { name: 'Booking', on: true },
  { name: 'AI Calling', on: false },
  { name: 'Analytics', on: true },
];

function ActivityIcon({ type }: { type: string }) {
  const cls = 'w-4 h-4';
  switch (type) {
    case 'linkedin':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" fill="#0A66C2" />
          <path d="M8 10v7M8 7.5v.01M12 17v-4.2c0-1.2.9-2.3 2.1-2.3s2.1 1 2.1 2.2V17M12 10.8V17" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case 'email':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <path d="m22 6-10 7L2 6" />
        </svg>
      );
    case 'call':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case 'maps':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      );
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
  }
}

interface Props {
  userName: string;
}

export default function OverviewDashboard({ userName }: Props) {
  const [modules, setModules] = useState(MODULES);
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8 min-w-0">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-[#171717] tracking-tight mb-1">
          Welcome back, {userName}
        </h2>
        <p className="text-sm text-[#888888]">{today}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Leads" value="1,284" accent="text-[#171717]" />
        <StatCard label="Emails Sent" value="847" accent="text-emerald-600" />
        <StatCard label="Calls Made" value="203" accent="text-blue-600" />
        <StatCard label="Meetings Booked" value="31" accent="text-cyan-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div
          className="rounded-xl border border-gray-200 bg-white p-5"
          style={{ boxShadow: '0px 1px 1px #00000005, 0px 2px 2px #0000000a' }}
        >
          <h3 className="text-sm font-semibold text-[#171717] mb-4">Recent Activity</h3>
          <ul className="space-y-3">
            {ACTIVITY.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                  <ActivityIcon type={item.icon} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[#171717]">{item.text}</p>
                  <p className="text-xs text-[#a1a1a1] mt-0.5">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="rounded-xl border border-gray-200 bg-white p-5"
          style={{ boxShadow: '0px 1px 1px #00000005, 0px 2px 2px #0000000a' }}
        >
          <h3 className="text-sm font-semibold text-[#171717] mb-4">Module Status</h3>
          <ul className="space-y-3">
            {modules.map((mod, i) => (
              <li key={mod.name} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 py-2 sm:py-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#171717]">{mod.name}</span>
                  <StatusBadge label={mod.on ? 'ON' : 'OFF'} variant={mod.on ? 'active' : 'neutral'} />
                </div>
                <ToggleSwitch
                  checked={mod.on}
                  label={`Toggle ${mod.name}`}
                  onChange={() =>
                    setModules((prev) =>
                      prev.map((m, idx) => (idx === i ? { ...m, on: !m.on } : m))
                    )
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
