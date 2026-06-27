import type { APIRoute } from 'astro';
import { requireAuth } from '../../lib/auth';
import { readLeads } from '../../lib/db';
import { leadsToCSV } from '../../lib/csv';

export const GET: APIRoute = async (context) => {
  const auth = requireAuth(context);
  if ('error' in auth) return auth.error;

  try {
    const leads = await readLeads(auth.supabase);

    if (leads.length === 0) {
      return new Response('No leads to export', { status: 404 });
    }

    const csv = leadsToCSV(leads);
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `leadscraper-export-${timestamp}.csv`;

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(`Export failed: ${message}`, { status: 500 });
  }
};
