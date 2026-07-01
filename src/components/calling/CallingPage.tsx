import StatCard from '../StatCard';
import StatusBadge from '../ui/StatusBadge';

const QUEUE = [
  { name: 'Robert Lee', phone: '+1 (555) ***-0142', company: 'TechFlow Inc', priority: 'High' },
  { name: 'Anna Kowalski', phone: '+1 (555) ***-0891', company: 'Growth Labs', priority: 'Medium' },
  { name: 'James Wilson', phone: '+1 (555) ***-0234', company: 'Wilson Dental', priority: 'High' },
  { name: 'Lisa Thompson', phone: '+1 (555) ***-0567', company: 'Thompson Realty', priority: 'Low' },
  { name: 'David Park', phone: '+1 (555) ***-0312', company: 'Park & Associates', priority: 'Medium' },
  { name: 'Emily Rodriguez', phone: '+1 (555) ***-0789', company: 'Rodriguez Marketing', priority: 'High' },
];

const CALL_LOG = [
  { lead: 'Sarah Johnson', duration: '4m 32s', outcome: 'Answered', recording: 'rec_001.mp3', date: 'Mar 15, 2:14 PM' },
  { lead: 'Mike Chen', duration: '0m 45s', outcome: 'Voicemail', recording: 'rec_002.mp3', date: 'Mar 15, 1:48 PM' },
  { lead: 'Emily Rodriguez', duration: '6m 12s', outcome: 'Answered', recording: 'rec_003.mp3', date: 'Mar 15, 12:30 PM' },
  { lead: 'David Park', duration: '0m 0s', outcome: 'No Answer', recording: '—', date: 'Mar 15, 11:15 AM' },
  { lead: 'Lisa Thompson', duration: '3m 08s', outcome: 'Answered', recording: 'rec_005.mp3', date: 'Mar 14, 4:22 PM' },
  { lead: 'James Wilson', duration: '1m 55s', outcome: 'Voicemail', recording: 'rec_006.mp3', date: 'Mar 14, 3:10 PM' },
  { lead: 'Anna Kowalski', duration: '5m 41s', outcome: 'Answered', recording: 'rec_007.mp3', date: 'Mar 14, 2:05 PM' },
  { lead: 'Robert Lee', duration: '0m 0s', outcome: 'No Answer', recording: '—', date: 'Mar 14, 10:30 AM' },
];

function priorityVariant(p: string) {
  switch (p) {
    case 'High': return 'error' as const;
    case 'Medium': return 'warning' as const;
    default: return 'neutral' as const;
  }
}

function outcomeVariant(o: string) {
  switch (o) {
    case 'Answered': return 'success' as const;
    case 'Voicemail': return 'warning' as const;
    default: return 'neutral' as const;
  }
}

export default function CallingPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 min-w-0">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Calls Today" value="24" accent="text-[#171717]" />
        <StatCard label="Connected" value="18" accent="text-emerald-600" />
        <StatCard label="Meetings Booked" value="6" accent="text-cyan-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5" style={{ boxShadow: '0px 1px 1px #00000005' }}>
          <h3 className="text-sm font-semibold text-[#171717] mb-4">Call Queue</h3>
          <ul className="space-y-3">
            {QUEUE.map((q) => (
              <li key={q.name} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-lg border border-gray-100">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#171717]">{q.name}</p>
                  <p className="text-xs text-gray-500">{q.phone} · {q.company}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                  <StatusBadge label={q.priority} variant={priorityVariant(q.priority)} />
                  <button type="button" className="px-3 h-8 rounded-lg bg-cyan-500 text-white text-xs font-medium hover:bg-cyan-600 cursor-pointer whitespace-nowrap">
                    Call Now
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden" style={{ boxShadow: '0px 1px 1px #00000005' }}>
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-[#171717]">Recent Call Log</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500">Lead</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500">Duration</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500">Outcome</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500">Recording</th>
                  <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {CALL_LOG.map((row) => (
                  <tr key={row.lead + row.date} className="border-b border-gray-50 hover:bg-gray-50/80">
                    <td className="py-2.5 px-3 font-medium">{row.lead}</td>
                    <td className="py-2.5 px-3 text-gray-600 tabular-nums">{row.duration}</td>
                    <td className="py-2.5 px-3"><StatusBadge label={row.outcome} variant={outcomeVariant(row.outcome)} /></td>
                    <td className="py-2.5 px-3">
                      {row.recording !== '—' ? (
                        <span className="text-cyan-600 text-xs hover:underline cursor-pointer">{row.recording}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-xs text-gray-500">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
