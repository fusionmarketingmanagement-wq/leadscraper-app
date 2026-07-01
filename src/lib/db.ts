import type { SupabaseClient } from '@supabase/supabase-js';
import type { Lead, LeadSource, SearchRecord, SearchStatus } from './types';

interface LeadRow {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  profile_url: string;
  location: string;
  source: LeadSource;
  search_id: string | null;
  raw_data: Record<string, unknown>;
  scraped_at: string;
}

interface SearchRow {
  id: string;
  user_id: string;
  source: LeadSource;
  query: string;
  status: SearchStatus;
  apify_run_id: string | null;
  apify_dataset_id: string | null;
  input: Record<string, unknown>;
  created_at: string;
  completed_at: string | null;
}

function rowToLead(row: LeadRow): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    website: row.website,
    profileUrl: row.profile_url,
    location: row.location,
    source: row.source,
    searchId: row.search_id,
    rawData: row.raw_data ?? {},
    scrapedAt: row.scraped_at,
  };
}

function leadToRow(lead: Lead, userId: string): Omit<LeadRow, 'user_id'> & { user_id: string } {
  return {
    id: lead.id,
    user_id: userId,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    website: lead.website,
    profile_url: lead.profileUrl,
    location: lead.location,
    source: lead.source,
    search_id: lead.searchId,
    raw_data: lead.rawData,
    scraped_at: lead.scrapedAt,
  };
}

function rowToSearch(row: SearchRow): SearchRecord {
  return {
    id: row.id,
    source: row.source,
    query: row.query,
    status: row.status,
    apifyRunId: row.apify_run_id,
    apifyDatasetId: row.apify_dataset_id,
    input: row.input ?? {},
    createdAt: row.created_at,
    completedAt: row.completed_at,
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

export async function createSearch(
  supabase: SupabaseClient,
  userId: string,
  source: LeadSource,
  query: string,
  input: Record<string, unknown>,
  apifyRunId: string,
  apifyDatasetId: string
): Promise<SearchRecord> {
  const { data, error } = await supabase
    .from('searches')
    .insert({
      user_id: userId,
      source,
      query,
      status: 'running',
      apify_run_id: apifyRunId,
      apify_dataset_id: apifyDatasetId,
      input,
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return rowToSearch(data as SearchRow);
}

export async function updateSearchStatus(
  supabase: SupabaseClient,
  searchId: string,
  status: SearchStatus
): Promise<void> {
  const { error } = await supabase
    .from('searches')
    .update({
      status,
      completed_at: status === 'running' ? null : new Date().toISOString(),
    })
    .eq('id', searchId);

  if (error) throw new Error(error.message);
}

export async function readRecentSearches(
  supabase: SupabaseClient,
  limit = 5
): Promise<SearchRecord[]> {
  const { data, error } = await supabase
    .from('searches')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  const searches = (data as SearchRow[]).map(rowToSearch);
  if (searches.length === 0) return searches;

  const searchIds = searches.map((s) => s.id);
  const { data: leadCounts, error: countError } = await supabase
    .from('leads')
    .select('search_id')
    .in('search_id', searchIds);

  if (countError) throw new Error(countError.message);

  const countMap = new Map<string, number>();
  for (const row of leadCounts ?? []) {
    const id = row.search_id as string;
    countMap.set(id, (countMap.get(id) ?? 0) + 1);
  }

  return searches.map((search) => ({
    ...search,
    leadCount: countMap.get(search.id) ?? 0,
  }));
}
