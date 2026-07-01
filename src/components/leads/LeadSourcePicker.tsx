export default function LeadSourcePicker() {
  const activeCards = [
    {
      href: '/dashboard/leads/google-maps',
      title: 'Google Maps',
      description: 'Find local businesses by keyword and location.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      href: '/dashboard/leads/linkedin',
      title: 'LinkedIn',
      description: 'Search profiles by title, company, school, and location.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" fill="#0A66C2" />
          <path
            d="M8 10v7M8 7.5v.01M12 17v-4.2c0-1.2.9-2.3 2.1-2.3s2.1 1 2.1 2.2V17M12 10.8V17"
            stroke="white"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  const comingSoon = [
    {
      title: 'Instagram',
      description: 'Scrape business profiles and engagement data.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.75" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      title: 'Apollo',
      description: 'Enrich leads with B2B contact and company data.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {activeCards.map((card) => (
        <a
          key={card.href}
          href={card.href}
          className="group rounded-xl border border-gray-200 bg-white p-5 no-underline transition-all hover:border-cyan-300 hover:shadow-sm"
          style={{ boxShadow: '0px 1px 1px #00000005, 0px 2px 2px #0000000a' }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-600 shrink-0 group-hover:bg-white">
              {card.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-[#171717] mb-1">{card.title}</h2>
              <p className="text-xs text-[#888888] leading-relaxed">{card.description}</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-300 group-hover:text-cyan-500 shrink-0 mt-1">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </a>
      ))}

      {comingSoon.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border border-gray-200 bg-gray-50 p-5 opacity-60 cursor-not-allowed"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 shrink-0">
              {card.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-sm font-semibold text-gray-500">{card.title}</h2>
                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-gray-200 text-gray-600">
                  Soon
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{card.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
