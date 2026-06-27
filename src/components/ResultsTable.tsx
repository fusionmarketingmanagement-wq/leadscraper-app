import { useState, useEffect } from 'react';
import type { Lead } from '../lib/types';

const PAGE_SIZE = 25;

function StatCard({ label, value, sub, accent }: { label: string; value: number | string; sub?: string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-zinc-900/40 p-4">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className={`text-2xl font-semibold tabular-nums ${accent ?? 'text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>}
    </div>
  );
}

function RatingBadge({ rating }: { rating: number | null }) {
  if (rating === null) return <span className="text-zinc-700">—</span>;
  const color = rating >= 4.5 ? 'text-emerald-400' : rating >= 3.5 ? 'text-yellow-400' : 'text-red-400';
  return <span className={`font-medium tabular-nums text-sm ${color}`}>★ {rating.toFixed(1)}</span>;
}

function FilterPill({
  label,
  active,
  count,
  onClick,
}: {
  label: string;
  active: boolean;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-xs font-medium border transition-all ${
        active
          ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
          : 'bg-white/4 border-white/8 text-zinc-400 hover:text-white hover:border-white/15'
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${active ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/8 text-zinc-500'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function SocialIcon({ href, label }: { href: string | undefined; label: string }) {
  if (!href) return null;
  const abbr: Record<string, string> = {
    facebook: 'f', twitter: 'x', linkedin: 'in', instagram: 'ig', youtube: 'yt',
  };
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      className="inline-flex items-center justify-center w-5 h-5 rounded text-[9px] font-bold bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-zinc-300 transition-all no-underline border border-white/5"
    >
      {abbr[label] ?? label[0]}
    </a>
  );
}

export default function ResultsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [hasEmail, setHasEmail] = useState(false);
  const [hasPhone, setHasPhone] = useState(false);
  const [hasWebsite, setHasWebsite] = useState(false);
  const [highRating, setHighRating] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch('/api/leads')
      .then((r) => r.json())
      .then((data) => {
        setLeads(Array.isArray(data) ? (data as Lead[]) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = leads.filter((l) => {
    if (hasEmail && !l.email) return false;
    if (hasPhone && !l.phone) return false;
    if (hasWebsite && !l.website) return false;
    if (highRating && (l.rating === null || l.rating < 4.0)) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      l.companyName.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q) ||
      l.country.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q) ||
      l.searchQuery.toLowerCase().includes(q)
    );
  });

  const withEmail = leads.filter((l) => l.email).length;
  const withPhone = leads.filter((l) => l.phone).length;
  const withWebsite = leads.filter((l) => l.website).length;
  const highRatingCount = leads.filter((l) => l.rating !== null && l.rating >= 4.0).length;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleSearchChange(v: string) {
    setSearch(v);
    setPage(1);
  }

  function toggleFilter(setter: (v: boolean) => void, val: boolean) {
    setter(!val);
    setPage(1);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-zinc-600 text-sm gap-2">
        <span className="animate-spin text-lg">◌</span>
        Loading leads...
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-16 h-16 rounded-2xl border border-white/8 bg-zinc-900/40 flex items-center justify-center mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-600">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <p className="text-base font-semibold text-white mb-1">No leads yet.</p>
        <p className="text-sm text-zinc-500 mb-6 max-w-sm">
          Run a search from the dashboard to start collecting business leads from Google Maps.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 h-9 rounded-xl bg-white text-black text-sm font-medium hover:bg-zinc-100 transition-all no-underline"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          Go to dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total leads" value={leads.length.toLocaleString()} />
        <StatCard
          label="With email"
          value={withEmail.toLocaleString()}
          sub={`${Math.round((withEmail / leads.length) * 100)}% of total`}
          accent="text-emerald-400"
        />
        <StatCard
          label="With phone"
          value={withPhone.toLocaleString()}
          sub={`${Math.round((withPhone / leads.length) * 100)}% of total`}
          accent="text-indigo-400"
        />
        <StatCard
          label="With website"
          value={withWebsite.toLocaleString()}
          sub={`${Math.round((withWebsite / leads.length) * 100)}% of total`}
          accent="text-violet-400"
        />
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
            width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 h-8 bg-zinc-900/60 border border-white/8 text-white placeholder-zinc-600 rounded-xl text-xs focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/10 transition-all"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <FilterPill label="Has email" active={hasEmail} count={withEmail} onClick={() => toggleFilter(setHasEmail, hasEmail)} />
          <FilterPill label="Has phone" active={hasPhone} count={withPhone} onClick={() => toggleFilter(setHasPhone, hasPhone)} />
          <FilterPill label="Has website" active={hasWebsite} count={withWebsite} onClick={() => toggleFilter(setHasWebsite, hasWebsite)} />
          <FilterPill label="Rating ≥ 4.0" active={highRating} count={highRatingCount} onClick={() => toggleFilter(setHighRating, highRating)} />
        </div>

        {/* Result count */}
        <span className="text-xs text-zinc-600 ml-auto whitespace-nowrap">
          {filtered.length.toLocaleString()} {filtered.length === 1 ? 'result' : 'results'}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-zinc-950/40">
                {['Company', 'Category', 'Rating', 'Phone', 'Email', 'Website', 'Location', 'Social', 'Source'].map((h) => (
                  <th
                    key={h}
                    className="py-3 px-4 text-left text-[10px] font-medium text-zinc-600 uppercase tracking-widest whitespace-nowrap font-mono"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-sm text-zinc-600">
                    No leads match your current filters.
                  </td>
                </tr>
              ) : (
                paginated.map((lead, i) => (
                  <tr
                    key={lead.id}
                    className={`border-b border-white/4 hover:bg-white/3 transition-colors ${i % 2 === 1 ? 'bg-zinc-950/20' : ''}`}
                  >
                    <td className="py-3 px-4 font-medium text-white max-w-[180px] truncate" title={lead.companyName}>
                      {lead.companyName || <span className="text-zinc-700">—</span>}
                    </td>
                    <td className="py-3 px-4 text-zinc-500 max-w-[130px] truncate text-xs" title={lead.category}>
                      {lead.category || <span className="text-zinc-700">—</span>}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <RatingBadge rating={lead.rating} />
                    </td>
                    <td className="py-3 px-4 text-zinc-400 whitespace-nowrap text-xs">
                      {lead.phone ? (
                        <a href={`tel:${lead.phone}`} className="hover:text-white transition-colors no-underline">
                          {lead.phone}
                        </a>
                      ) : (
                        <span className="text-zinc-700">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-zinc-400 max-w-[160px] truncate text-xs">
                      {lead.email ? (
                        <a href={`mailto:${lead.email}`} className="hover:text-white transition-colors no-underline" title={lead.email}>
                          {lead.email}
                        </a>
                      ) : (
                        <span className="text-zinc-700">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-[160px] truncate text-xs">
                      {lead.website ? (
                        <a
                          href={lead.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 transition-colors no-underline"
                          title={lead.website}
                        >
                          {lead.website.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      ) : (
                        <span className="text-zinc-700">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-zinc-500 whitespace-nowrap text-xs">
                      {[lead.city, lead.country].filter(Boolean).join(', ') || <span className="text-zinc-700">—</span>}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <SocialIcon href={lead.socialLinks?.facebook} label="facebook" />
                        <SocialIcon href={lead.socialLinks?.twitter} label="twitter" />
                        <SocialIcon href={lead.socialLinks?.linkedin} label="linkedin" />
                        <SocialIcon href={lead.socialLinks?.instagram} label="instagram" />
                        <SocialIcon href={lead.socialLinks?.youtube} label="youtube" />
                        {!Object.values(lead.socialLinks ?? {}).some(Boolean) && (
                          <span className="text-zinc-700 text-xs">—</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {lead.sourceUrl ? (
                        <a
                          href={lead.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-600 hover:text-zinc-300 transition-colors no-underline"
                          title="View on Google Maps"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      ) : (
                        <span className="text-zinc-700 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-600 font-mono">
            Page {safePage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex items-center gap-1.5 px-3 h-8 rounded-xl border border-white/8 bg-white/4 text-xs text-zinc-400 hover:text-white hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex items-center gap-1.5 px-3 h-8 rounded-xl border border-white/8 bg-white/4 text-xs text-zinc-400 hover:text-white hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
