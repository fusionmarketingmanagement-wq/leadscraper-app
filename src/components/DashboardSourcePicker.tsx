export default function DashboardSourcePicker() {
  const cards = [
    {
      href: '/dashboard/google-maps',
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
      href: '/dashboard/linkedin',
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
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((card) => (
        <a
          key={card.href}
          href={card.href}
          className="group rounded-xl border border-[#ebebeb] bg-white p-5 no-underline transition-all hover:border-[#a1a1a1] hover:shadow-sm"
          style={{ boxShadow: '0px 1px 1px #00000005, 0px 2px 2px #0000000a' }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg border border-[#ebebeb] bg-[#fafafa] flex items-center justify-center text-[#4d4d4d] shrink-0 group-hover:bg-white">
              {card.icon}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-[#171717] mb-1">{card.title}</h2>
              <p className="text-xs text-[#888888] leading-relaxed">{card.description}</p>
            </div>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-[#d4d4d4] group-hover:text-[#888888] shrink-0 mt-1"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </a>
      ))}
    </div>
  );
}
