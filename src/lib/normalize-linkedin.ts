import { randomUUID } from 'crypto';
import type { Lead } from './types';

export function normalizeLinkedInProfile(
  profile: Record<string, unknown>,
  searchId: string,
  searchQuery: string
): Lead {
  const firstName = (profile.firstName as string) ?? '';
  const lastName = (profile.lastName as string) ?? '';
  const currentPositions = (profile.currentPositions as Record<string, unknown>[] | undefined) ?? [];
  const current = currentPositions[0];
  const title = (current?.title as string) ?? '';
  const companyName = (current?.companyName as string) ?? '';
  const locationObj = profile.location as { linkedinText?: string } | undefined;
  const location = locationObj?.linkedinText ?? '';

  return {
    id: (profile.id as string) || randomUUID(),
    name: `${firstName} ${lastName}`.trim(),
    email: typeof profile.email === 'string' ? profile.email : '',
    phone: typeof profile.phone === 'string' ? profile.phone : '',
    website: typeof profile.website === 'string' ? profile.website : '',
    profileUrl: (profile.linkedinUrl as string) ?? '',
    location,
    source: 'linkedin',
    searchId,
    rawData: {
      headline: title,
      currentCompany: companyName,
      summary: profile.summary ?? null,
      currentPositions,
      pictureUrl: profile.pictureUrl ?? null,
      premium: profile.premium ?? null,
      openProfile: profile.openProfile ?? null,
      searchQuery,
    },
    scrapedAt: new Date().toISOString(),
  };
}
