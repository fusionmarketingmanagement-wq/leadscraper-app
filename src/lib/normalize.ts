import { randomUUID } from 'crypto';
import type { Lead } from './types';

function extractSocialLinks(place: Record<string, unknown>): Lead['socialLinks'] {
  const social: Lead['socialLinks'] = {};
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

export function normalizePlace(place: Record<string, unknown>, searchQuery: string): Lead {
  const parsed = place.addressParsed as Record<string, string> | undefined;

  const address =
    (place.address as string) ||
    parsed?.formattedAddress ||
    [parsed?.street, parsed?.postalCode].filter(Boolean).join(', ') ||
    '';

  const emails = place.emails as string[] | undefined;
  const categories = place.categories as string[] | undefined;

  return {
    id: (place.placeId as string) || (place.cid as string) || randomUUID(),
    companyName: (place.title as string) || '',
    category: (place.categoryName as string) || categories?.[0] || '',
    website: (place.website as string) || '',
    phone: (place.phone as string) || (place.phoneUnformatted as string) || '',
    address,
    city: (place.city as string) || parsed?.city || '',
    country: (place.country as string) || (place.countryCode as string) || parsed?.countryCode || '',
    rating: typeof place.totalScore === 'number' ? place.totalScore : null,
    email: (place.email as string) || emails?.[0] || '',
    socialLinks: extractSocialLinks(place),
    sourceUrl: (place.url as string) || (place.placeUrl as string) || '',
    scrapedAt: new Date().toISOString(),
    searchQuery,
  };
}
