import type { Lead } from './types';

const HEADERS = [
  'Company Name',
  'Category',
  'Website',
  'Phone',
  'Email',
  'Address',
  'City',
  'Country',
  'Rating',
  'Facebook',
  'Twitter / X',
  'LinkedIn',
  'Instagram',
  'YouTube',
  'Source URL',
  'Scraped At',
  'Search Query',
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
      esc(l.companyName),
      esc(l.category),
      esc(l.website),
      esc(l.phone),
      esc(l.email),
      esc(l.address),
      esc(l.city),
      esc(l.country),
      l.rating !== null ? String(l.rating) : '',
      esc(l.socialLinks?.facebook ?? ''),
      esc(l.socialLinks?.twitter ?? ''),
      esc(l.socialLinks?.linkedin ?? ''),
      esc(l.socialLinks?.instagram ?? ''),
      esc(l.socialLinks?.youtube ?? ''),
      esc(l.sourceUrl),
      esc(l.scrapedAt),
      esc(l.searchQuery),
    ].join(',')
  );

  return [HEADERS.join(','), ...rows].join('\r\n');
}
