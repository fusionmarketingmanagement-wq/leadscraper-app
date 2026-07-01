import StatCard from '../StatCard';
import StatusBadge from '../ui/StatusBadge';

const MEETINGS = [
  { time: 'Today, 2:00 PM', name: 'Sarah Johnson', type: 'Discovery', duration: '30 min', link: 'meet.leadscraper.io/abc123' },
  { time: 'Today, 4:30 PM', name: 'Mike Chen', type: 'Follow-up', duration: '15 min', link: 'meet.leadscraper.io/def456' },
  { time: 'Tomorrow, 10:00 AM', name: 'Emily Rodriguez', type: 'Discovery', duration: '30 min', link: 'meet.leadscraper.io/ghi789' },
  { time: 'Wed, Mar 18, 11:00 AM', name: 'David Park', type: 'Demo', duration: '45 min', link: 'meet.leadscraper.io/jkl012' },
  { time: 'Thu, Mar 19, 3:00 PM', name: 'Lisa Thompson', type: 'Follow-up', duration: '15 min', link: 'meet.leadscraper.io/mno345' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MARCH_2026 = Array.from({ length: 31 }, (_, i) => i + 1);
const BOOKED = [12, 14, 18, 19, 25];
const TODAY = 15;

export default function BookingPage() {
  const startOffset = 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="grid grid-cols-2 gap-3 max-w-md">
        <StatCard label="Meetings This Week" value="8" accent="text-cyan-600" />
        <StatCard label="Pending Confirmations" value="3" accent="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5" style={{ boxShadow: '0px 1px 1px #00000005' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#171717]">March 2026</h3>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-[10px] font-semibold text-gray-400 py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {MARCH_2026.map((day) => (
              <div
                key={day}
                className={`aspect-square flex items-center justify-center text-xs rounded-lg ${
                  day === TODAY
                    ? 'bg-yellow-100 text-yellow-800 font-semibold ring-2 ring-yellow-400'
                    : BOOKED.includes(day)
                      ? 'bg-cyan-100 text-cyan-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5" style={{ boxShadow: '0px 1px 1px #00000005' }}>
          <h3 className="text-sm font-semibold text-[#171717] mb-4">Upcoming Meetings</h3>
          <ul className="space-y-3">
            {MEETINGS.map((m) => (
              <li key={m.name + m.time} className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-medium text-[#171717]">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.time} · {m.duration}</p>
                  </div>
                  <StatusBadge label={m.type} variant="cyan" />
                </div>
                <p className="text-[10px] text-gray-400 font-mono mb-2 truncate">{m.link}</p>
                <div className="flex gap-2">
                  {['Confirm', 'Reschedule', 'Cancel'].map((btn) => (
                    <button key={btn} type="button" className="px-2.5 py-1 rounded-md text-[10px] font-medium border border-gray-200 text-gray-600 hover:bg-white cursor-pointer">
                      {btn}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
