import type { SupabaseClient } from '@supabase/supabase-js';
import type { Lead } from './types';

interface LeadRow {
  id: string;
  user_id: string;
  company_name: string;
  category: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  rating: number | null;
  social_links: Lead['socialLinks'];
  source_url: string;
  scraped_at: string;
  search_query: string;
}

function rowToLead(row: LeadRow): Lead {
  return {
    id: row.id,
    companyName: row.company_name,
    category: row.category,
    website: row.website,
    phone: row.phone,
    email: row.email,
    address: row.address,
    city: row.city,
    country: row.country,
    rating: row.rating !== null ? Number(row.rating) : null,
    socialLinks: row.social_links ?? {},
    sourceUrl: row.source_url,
    scrapedAt: row.scraped_at,
    searchQuery: row.search_query,
  };
}

function leadToRow(lead: Lead, userId: string): Omit<LeadRow, 'user_id'> & { user_id: string } {
  return {
    id: lead.id,
    user_id: userId,
    company_name: lead.companyName,
    category: lead.category,
    website: lead.website,
    phone: lead.phone,
    email: lead.email,
    address: lead.address,
    city: lead.city,
    country: lead.country,
    rating: lead.rating,
    social_links: lead.socialLinks,
    source_url: lead.sourceUrl,
    scraped_at: lead.scrapedAt,
    search_query: lead.searchQuery,
  };
}

export async function readLeads(supabase: SupabaseClient): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('scraped_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as LeadRow[]).map(rowToLead);
}

export async function saveLeads(
  supabase: SupabaseClient,
  userId: string,
  newLeads: Lead[]
): Promise<number> {
  if (newLeads.length === 0) return 0;

  const { data: existing, error: readError } = await supabase
    .from('leads')
    .select('id')
    .eq('user_id', userId);

  if (readError) throw new Error(readError.message);

  const existingIds = new Set((existing ?? []).map((r) => r.id as string));
  const fresh = newLeads.filter((l) => !existingIds.has(l.id));
  if (fresh.length === 0) return 0;

  const rows = fresh.map((lead) => leadToRow(lead, userId));
  const { error: insertError } = await supabase.from('leads').insert(rows);
  if (insertError) throw new Error(insertError.message);

  return fresh.length;
}

export async function clearLeads(supabase: SupabaseClient): Promise<void> {
  const { error } = await supabase.from('leads').delete().neq('id', '');
  if (error) throw new Error(error.message);
}

export async function getLeadsCount(supabase: SupabaseClient): Promise<number> {
  const { count, error } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true });

  if (error) throw new Error(error.message);
  return count ?? 0;
}
