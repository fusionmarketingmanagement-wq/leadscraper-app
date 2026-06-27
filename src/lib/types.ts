export interface Lead {
  id: string;
  companyName: string;
  category: string;
  website: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  rating: number | null;
  email: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  sourceUrl: string;
  scrapedAt: string;
  searchQuery: string;
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
