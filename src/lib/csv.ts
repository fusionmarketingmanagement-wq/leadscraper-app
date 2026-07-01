import type { Lead } from './types';

const HEADERS = [
  'Source',
  'Name',
  'Email',
  'Phone',
  'Website',
  'Profile URL',
  'Location',
  'Scraped At',
];

function esc(v: string | number | null | undefined): string {
  const s = String(v ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export function leadsToCSV(leads: Lead[]): string {
  const rows = leads.map((l) =>
    [
      esc(l.source),
      esc(l.name),
      esc(l.email),
      esc(l.phone),
      esc(l.website),
      esc(l.profileUrl),
      esc(l.location),
      esc(l.scrapedAt),
    ].join(',')
  );

  return [HEADERS.join(','), ...rows].join('\r\n');
}
