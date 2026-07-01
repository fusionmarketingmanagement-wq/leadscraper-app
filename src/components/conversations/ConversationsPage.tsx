import { useState } from 'react';
import StatusBadge from '../ui/StatusBadge';

const CONVERSATIONS = [
  { id: '1', name: 'Sarah Johnson', preview: 'Yes, I\'d love to schedule a call...', time: '2m', source: 'Email', status: 'ai' as const, initials: 'SJ' },
  { id: '2', name: 'Mike Chen', preview: 'What are your pricing options?', time: '15m', source: 'WhatsApp', status: 'waiting' as const, initials: 'MC' },
  { id: '3', name: 'Emily Rodriguez', preview: 'Can you send more details?', time: '32m', source: 'SMS', status: 'human' as const, initials: 'ER' },
  { id: '4', name: 'David Park', preview: 'Thanks for reaching out!', time: '1h', source: 'Email', status: 'ai' as const, initials: 'DP' },
  { id: '5', name: 'Lisa Thompson', preview: 'Not interested at this time.', time: '2h', source: 'WhatsApp', status: 'waiting' as const, initials: 'LT' },
  { id: '6', name: 'James Wilson', preview: 'Let\'s book for Thursday.', time: '3h', source: 'Email', status: 'ai' as const, initials: 'JW' },
  { id: '7', name: 'Anna Kowalski', preview: 'Do you integrate with HubSpot?', time: '5h', source: 'Email', status: 'human' as const, initials: 'AK' },
  { id: '8', name: 'Robert Lee', preview: 'Sounds good, send the link.', time: '6h', source: 'SMS', status: 'ai' as const, initials: 'RL' },
];

const MESSAGES = [
  { from: 'lead', text: 'Hi, I saw your outreach email. Can you tell me more about your services?' },
  { from: 'ai', text: 'Hello Sarah! We help businesses automate lead generation and outreach. We offer Google Maps scraping, LinkedIn search, and AI-powered follow-ups. Would you like to schedule a quick discovery call?' },
  { from: 'lead', text: 'That sounds interesting. What\'s the pricing like?' },
  { from: 'ai', text: 'Our Starter plan begins at $49/month and includes up to 1,000 leads and 500 outreach emails. I can send a detailed breakdown — would that help?' },
  { from: 'lead', text: 'Yes, I\'d love to schedule a call. Do you have availability this week?' },
  { from: 'ai', text: 'Absolutely! I have openings on Wednesday at 2 PM or Thursday at 10 AM. Which works better for you?' },
];

function statusDot(status: 'ai' | 'human' | 'waiting') {
  switch (status) {
    case 'ai': return 'bg-cyan-500';
    case 'human': return 'bg-yellow-400';
    case 'waiting': return 'bg-gray-300';
  }
}

function statusLabel(status: 'ai' | 'human' | 'waiting') {
  switch (status) {
    case 'ai': return 'AI Active';
    case 'human': return 'Human Takeover';
    case 'waiting': return 'Waiting';
  }
}

export default function ConversationsPage() {
  const [selected, setSelected] = useState(CONVERSATIONS[0]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden h-[calc(100vh-10rem)] min-h-[520px]" style={{ boxShadow: '0px 1px 1px #00000005' }}>
        <div className="w-80 shrink-0 border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-100">
            <input
              type="search"
              placeholder="Search conversations..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20"
            />
          </div>
          <ul className="flex-1 overflow-y-auto">
            {CONVERSATIONS.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setSelected(c)}
                  className={`w-full text-left p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                    selected.id === c.id ? 'bg-cyan-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-semibold shrink-0">
                      {c.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-medium text-[#171717] truncate">{c.name}</span>
                        <span className="text-[10px] text-gray-400 shrink-0">{c.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{c.preview}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <StatusBadge label={c.source} variant="neutral" />
                        <span className="flex items-center gap-1 text-[10px] text-gray-500">
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDot(c.status)}`} />
                          {statusLabel(c.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-semibold">
                {selected.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#171717]">{selected.name}</p>
                <StatusBadge label={selected.source} variant="cyan" />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" className="px-3 h-8 rounded-lg bg-yellow-400 text-yellow-900 text-xs font-medium hover:bg-yellow-500 cursor-pointer">
                Take Over
              </button>
              <button type="button" className="px-3 h-8 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 cursor-pointer">
                Close
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {MESSAGES.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'ai' ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    m.from === 'ai'
                      ? 'bg-white border border-gray-200 text-[#171717] rounded-bl-md'
                      : 'bg-cyan-500 text-white rounded-br-md'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100 flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500"
            />
            <button type="button" className="px-4 py-2.5 rounded-lg bg-cyan-500 text-white text-sm font-medium hover:bg-cyan-600 cursor-pointer">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
