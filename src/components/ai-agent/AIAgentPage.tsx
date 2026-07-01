import { useState } from 'react';

const FAQS = [
  { q: 'What services do you offer?', a: 'We offer lead scraping, automated outreach, AI calling, and booking automation for sales teams.' },
  { q: 'How quickly can I get started?', a: 'Most customers are up and running within 15 minutes. Connect your lead source and start scraping immediately.' },
  { q: 'Do you offer a free trial?', a: 'Yes — our Starter plan includes a 14-day free trial with full access to all core features.' },
];

const PREVIEW_MESSAGES = [
  { role: 'user', text: 'What does LeadScraper do?' },
  { role: 'ai', text: 'LeadScraper is a sales automation platform that helps you find leads via Google Maps and LinkedIn, then automatically reach out via email, WhatsApp, and AI calls.' },
  { role: 'user', text: 'How much does it cost?' },
  { role: 'ai', text: 'Our Starter plan is $49/month and includes 1,000 leads, 500 emails, and AI agent access. Would you like me to walk you through the features?' },
];

export default function AIAgentPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const services = ['Lead Scraping', 'Email Outreach', 'AI Calling', 'Booking Automation'];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-5" style={{ boxShadow: '0px 1px 1px #00000005' }}>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Agent Name</label>
            <input defaultValue="LeadScraper AI" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Business Description</label>
            <textarea rows={3} defaultValue="LeadScraper helps B2B sales teams automate lead generation, outreach, and booking with AI-powered tools." className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Services Offered</label>
            <div className="flex flex-wrap gap-2">
              {services.map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-full text-xs bg-cyan-50 text-cyan-700 border border-cyan-200">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Pricing Info</label>
            <textarea rows={2} defaultValue="Starter: $49/mo — 1,000 leads, 500 emails. Pro: $149/mo — unlimited leads, AI calling included." className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-cyan-500 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">FAQs</label>
            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-left hover:bg-gray-50 cursor-pointer">
                    {faq.q}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform ${openFaq === i ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6" /></svg>
                  </button>
                  {openFaq === i && <p className="px-4 pb-3 text-xs text-gray-600 leading-relaxed">{faq.a}</p>}
                </div>
              ))}
            </div>
          </div>
          <button type="button" className="w-full h-10 rounded-lg bg-cyan-500 text-white text-sm font-medium hover:bg-cyan-600 cursor-pointer">
            Save Configuration
          </button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col" style={{ boxShadow: '0px 1px 1px #00000005' }}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Live Preview</p>
          <div className="flex-1 rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3 min-h-[320px]">
            {PREVIEW_MESSAGES.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs ${m.role === 'ai' ? 'bg-white border border-gray-200' : 'bg-cyan-500 text-white'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="mt-4 w-full h-10 rounded-lg border border-cyan-500 text-cyan-600 text-sm font-medium hover:bg-cyan-50 cursor-pointer">
            Test Agent
          </button>
        </div>
      </div>
    </div>
  );
}
