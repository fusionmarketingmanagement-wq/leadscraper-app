export type LeadSource = 'google_maps' | 'linkedin';

export type SearchStatus = 'running' | 'succeeded' | 'failed';

export type LinkedInScraperMode = 'Short' | 'Full' | 'Full + email search';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  profileUrl: string;
  location: string;
  source: LeadSource;
  searchId: string | null;
  rawData: Record<string, unknown>;
  scrapedAt: string;
}

export interface SearchRecord {
  id: string;
  source: LeadSource;
  query: string;
  status: SearchStatus;
  apifyRunId: string | null;
  apifyDatasetId: string | null;
  input: Record<string, unknown>;
  createdAt: string;
  completedAt: string | null;
  leadCount?: number;
}

export interface ApifyRunResult {
  runId: string;
  datasetId: string;
  status: string;
}

export interface RunStatus {
  status: string;
  itemCount: number;
  datasetId: string;
}

export interface LinkedInScrapeInput {
  searchQuery?: string;
  locations?: string[];
  currentCompanies?: string[];
  pastCompanies?: string[];
  schools?: string[];
  currentJobTitles?: string[];
  maxItems?: number;
  profileScraperMode?: LinkedInScraperMode;
}
