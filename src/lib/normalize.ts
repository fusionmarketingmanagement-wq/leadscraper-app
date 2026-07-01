import { randomUUID } from 'crypto';
import type { Lead } from './types';

function extractSocialLinks(place: Record<string, unknown>): Record<string, string> {
  const social: Record<string, string> = {};
  const links: string[] = [
    ...((place.socialMediaLinks as string[]) ?? []),
    (place.linkedInUrl as string) ?? '',
    (place.facebookUrl as string) ?? '',
    (place.instagramUrl as string) ?? '',
    (place.twitterUrl as string) ?? '',
    (place.youtubeUrl as string) ?? '',
  ].filter(Boolean);

  for (const link of links) {
    if (link.includes('facebook.com') && !social.facebook) social.facebook = link;
    else if ((link.includes('twitter.com') || link.includes('x.com')) && !social.twitter) social.twitter = link;
    else if (link.includes('linkedin.com') && !social.linkedin) social.linkedin = link;
    else if (link.includes('instagram.com') && !social.instagram) social.instagram = link;
    else if (link.includes('youtube.com') && !social.youtube) social.youtube = link;
  }

  return social;
}

export function normalizePlace(
  place: Record<string, unknown>,
  searchId: string,
  searchQuery: string
): Lead {
  const parsed = place.addressParsed as Record<string, string> | undefined;

  const address =
    (place.address as string) ||
    parsed?.formattedAddress ||
    [parsed?.street, parsed?.postalCode].filter(Boolean).join(', ') ||
    '';

  const city = (place.city as string) || parsed?.city || '';
  const country = (place.country as string) || (place.countryCode as string) || parsed?.countryCode || '';
  const location =
    [city, country].filter(Boolean).join(', ') || address;

  const emails = place.emails as string[] | undefined;
  const categories = place.categories as string[] | undefined;
  const category = (place.categoryName as string) || categories?.[0] || '';
  const rating = typeof place.totalScore === 'number' ? place.totalScore : null;

  return {
    id: (place.placeId as string) || (place.cid as string) || randomUUID(),
    name: (place.title as string) || '',
    email: (place.email as string) || emails?.[0] || '',
    phone: (place.phone as string) || (place.phoneUnformatted as string) || '',
    website: (place.website as string) || '',
    profileUrl: (place.url as string) || (place.placeUrl as string) || '',
    location,
    source: 'google_maps',
    searchId,
    rawData: {
      category,
      rating,
      address,
      city,
      country,
      socialLinks: extractSocialLinks(place),
      searchQuery,
    },
    scrapedAt: new Date().toISOString(),
  };
}
