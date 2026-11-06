import React from 'react';
import { 
  FileSpreadsheet, 
  ReceiptText, 
  MessageSquareWarning, 
  Unplug, 
  CalendarClock, 
  BarChart3, 
  Cog, 
  CreditCard 
} from 'lucide-react';

const INEFFICIENCIES = [
  {
    icon: FileSpreadsheet,
    title: 'Manual Data Entry & Paperwork',
    description: 'High-paid team members spending 2 to 3 hours every day typing data into spreadsheets, re-entering job logs, or updating physical binders.',
    impact: 'Costing $18,000–$32,000/yr per staff member in wasted payroll.'
  },
  {
    icon: ReceiptText,
    title: 'Manual Invoices, Orders & Requests',
    description: 'Typing PDF invoices by hand, reconciling vendor delivery slips one-by-one, and manually emailing back confirmations instead of automated pipeline triggers.',
    impact: 'Slows cash collection by 14–21 days and creates preventable errors.'
  },
  {
    icon: MessageSquareWarning,
    title: 'Repeating Answers to the Same Inquiries',
    description: 'Staff fielding 40+ phone calls and emails a day asking for business hours, booking availability, inventory status, or standard quote ranges.',
    impact: 'Diverts key personnel from revenue work to routine phone tag.'
  },
  {
    icon: Unplug,
    title: 'Copying Data Between Disconnected Apps',
    description: 'Re-entering customer details from Shopify or a contact form into QuickBooks, your scheduling app, and your project board.',
    impact: 'Triples administrative overhead and leads to customer record mismatches.'
  },
  {
    icon: CalendarClock,
    title: 'Manual Scheduling & Dispatch Coordination',
    description: 'Dispatching field crews, contractors, or delivery drivers through endless text chains, phone calls, and whiteboard shuffles every morning.',
    impact: 'Creates idle downtime, misrouted trucks, and missed appointments.'
  },
  {
    icon: BarChart3,
    title: 'Hand-Crafting Weekly & Monthly Reports',
    description: 'Managers spending all Friday pulling numbers from 4 separate software tools to paste into an Excel summary for ownership or department heads.',
    impact: 'Delays decision-making and burns 15+ hours of leadership time every month.'
  },
  {
    icon: Cog,
    title: 'Running Routine Admin Manually',
    description: 'Chasing past-due invoices, sending routine client reminders, updating job statuses, and generating compliance filings one by one.',
    impact: 'Creates administrative drag that forces you to hire another person prematurely.'
  },
  {
    icon: CreditCard,
    title: 'Paying for Software That Doesn\'t Talk',
    description: 'Paying $1,200+/month across 6 different SaaS subscriptions that don’t integrate, leaving your team as the "human glue" between them.',
    impact: 'Wasted software licensing fees on top of heavy manual labor.'
  }
];

export const WhereBusinessesLoseMoney: React.FC = () => {
  return (
    <section id="inefficiencies" className="py-20 md:py-28 bg-neutral-950 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-sky-400 mb-3">
            The Hidden Drain
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-5 [text-wrap:balance]">
            You&apos;re probably spending more than you need to.
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed [text-wrap:balance]">
            Most Hawaii business owners accept these bottlenecks as just &ldquo;part of doing business in the islands.&rdquo; But when employee wages and benefits cost $30 to $50 an hour, ten wasted hours a week across four employees quietly siphons $60,000 to $100,000 out of your bottom line every single year.
          </p>
        </div>

        {/* Inefficiencies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {INEFFICIENCIES.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="bg-neutral-900/60 border border-neutral-800 p-6 rounded-lg hover:border-neutral-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-md bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center text-sky-400 mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-neutral-800/80">
                  <span className="text-xs font-semibold text-emerald-400 block">
                    {item.impact}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Straightforward takeaway callout */}
        <div className="mt-14 p-6 sm:p-8 bg-neutral-900/40 border border-neutral-800 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h4 className="text-lg font-bold text-white mb-1">
              If a process is repetitive, there is almost certainly a better way.
            </h4>
            <p className="text-sm text-neutral-400">
              You don&apos;t need to hire another administrative assistant or buy bloated enterprise software. You just need to stop paying people to do work a computer can handle.
            </p>
          </div>
          <a
            href="#calculator"
            className="px-5 py-3 text-sm font-semibold text-neutral-950 bg-white hover:bg-neutral-100 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            Calculate Your Business Loss
          </a>
        </div>

      </div>
    </section>
  );
};
