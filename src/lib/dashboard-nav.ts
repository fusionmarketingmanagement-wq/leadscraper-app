export interface NavItem {
  label: string;
  href: string;
  icon: string;
  children?: { label: string; href: string }[];
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const MAIN_NAV: NavSection[] = [
  {
    items: [
      { label: 'Overview', href: '/dashboard', icon: 'overview' },
      {
        label: 'Lead Scraper',
        href: '/dashboard/leads',
        icon: 'leads',
        children: [
          { label: 'Google Maps', href: '/dashboard/leads/google-maps' },
          { label: 'LinkedIn', href: '/dashboard/leads/linkedin' },
        ],
      },
      { label: 'Outreach', href: '/dashboard/outreach', icon: 'outreach' },
      { label: 'Conversations', href: '/dashboard/conversations', icon: 'conversations' },
      { label: 'Reach Instant', href: '/dashboard/instant', icon: 'instant' },
      { label: 'AI Agent', href: '/dashboard/ai-agent', icon: 'ai-agent' },
      { label: 'Booking', href: '/dashboard/booking', icon: 'booking' },
      { label: 'AI Calling', href: '/dashboard/calling', icon: 'calling' },
    ],
  },
];

export const INSIGHTS_NAV: NavSection[] = [
  {
    title: 'Insights',
    items: [{ label: 'Analytics', href: '/dashboard/analytics', icon: 'analytics' }],
  },
];

export const BOTTOM_NAV: NavItem[] = [
  { label: 'Settings', href: '/dashboard/settings', icon: 'settings' },
  { label: 'Billing', href: '/dashboard/billing', icon: 'billing' },
];

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/leads': 'Lead Scraper',
  '/dashboard/leads/google-maps': 'Google Maps',
  '/dashboard/leads/linkedin': 'LinkedIn',
  '/dashboard/outreach': 'Outreach',
  '/dashboard/conversations': 'Live Conversations',
  '/dashboard/instant': 'Reach Them Instant',
  '/dashboard/ai-agent': 'AI Agent Configuration',
  '/dashboard/booking': 'Booking & Calendar',
  '/dashboard/calling': 'AI Calling',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/settings': 'Settings',
  '/dashboard/billing': 'Billing',
};

export function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const sorted = Object.entries(PAGE_TITLES).sort((a, b) => b[0].length - a[0].length);
  for (const [path, title] of sorted) {
    if (path !== '/dashboard' && pathname.startsWith(path)) return title;
  }
  return 'Dashboard';
}

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isLeadScraperActive(pathname: string): boolean {
  return pathname === '/dashboard/leads' || pathname.startsWith('/dashboard/leads/');
}
