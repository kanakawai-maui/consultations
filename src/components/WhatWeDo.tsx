import React from 'react';
import { 
  GitMerge, 
  Cpu, 
  Code2, 
  Layers, 
  TrendingDown, 
  Headphones, 
  ArrowRight 
} from 'lucide-react';

interface WhatWeDoProps {
  onConsultationClick: () => void;
}

const SERVICES = [
  {
    number: '01',
    icon: GitMerge,
    title: 'Workflow Automation',
    tagline: 'Eliminate repetitive administrative tasks and manual processes.',
    problem: 'Staff wasting 10–25 hours each week repeatedly copying data, creating quotes, sending status emails, and moving tasks through rigid steps.',
    solution: 'We build automated pipelines that instantly trigger actions across your operations whenever a form is submitted, a job is completed, or a payment arrives.',
    benefit: 'Save 15–30 hours of labor per employee per month. Zero re-typing mistakes. Immediate customer turnarounds.'
  },
  {
    number: '02',
    icon: Cpu,
    title: 'AI-Powered Business Operations',
    tagline: 'Automate document processing, customer inquiries, and routine workflows.',
    problem: 'Employees manually reading messy vendor invoices, utility receipts, or inspection logs to manually key line items into legacy accounting systems.',
    solution: 'We deploy practical local AI models that parse complex PDFs, categorize expenses, extract line items, and draft standard operational documents in seconds.',
    benefit: '80–90% reduction in document processing time. Free up senior bookkeepers and office managers for real high-value work.'
  },
  {
    number: '03',
    icon: Code2,
    title: 'Custom Business Software',
    tagline: 'Tools built for how your business runs, not generic off-the-shelf software.',
    problem: 'Paying thousands each month for rigid software that forces your team to use awkward workarounds and maintain duplicate paper records.',
    solution: 'We build lightweight, tailored web and mobile applications designed specifically around your Hawaii operational procedures and field crews.',
    benefit: 'Own software that fits your exact workflow. No recurring per-seat user taxes that bloat your monthly expenses.'
  },
  {
    number: '04',
    icon: Layers,
    title: 'Systems Integration',
    tagline: 'Connect the software you already pay for so data flows cleanly.',
    problem: 'Your inventory system doesn\'t talk to your accounting system, which doesn\'t talk to your dispatch tool. Staff spend hours bridging the gap.',
    solution: 'We build reliable custom APIs and webhooks that synchronize your databases, POS tools, and billing software in real time.',
    benefit: 'Single source of truth. Eliminate duplicate licenses. Stop paying employees to act as human copy-paste bridges.'
  },
  {
    number: '05',
    icon: TrendingDown,
    title: 'Operational Cost Analysis',
    tagline: 'Identify waste, calculate actual financial impact, and prioritize ROI.',
    problem: 'Knowing your business feels sluggish or expensive, but not having hard data on which specific bottlenecks cost the most money to fix.',
    solution: 'We conduct a comprehensive audit of your daily processes, map employee hours to specific workflows, and produce a prioritized cost-saving roadmap.',
    benefit: 'Total clarity on where you are bleeding money. Every proposed project has a mathematically validated payback timeline before you spend a dime.'
  },
  {
    number: '06',
    icon: Headphones,
    title: 'Customer Service Automation',
    tagline: 'Reduce routine support volume while keeping a seamless human escalation.',
    problem: 'Front-desk staff overwhelmed by repetitive inquiries regarding pricing, schedule availability, and order status, creating customer wait times.',
    solution: 'We configure intelligent conversational agents hooked directly to your live inventory and booking calendars, routing complex edge cases directly to your staff.',
    benefit: '24/7 instant response for customers across all time zones. 50–70% drop in phone interruptions for your office team.'
  }
];

export const WhatWeDo: React.FC<WhatWeDoProps> = ({ onConsultationClick }) => {
  return (
    <section id="capabilities" className="py-20 md:py-28 bg-neutral-900/30 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-sky-400 mb-3">
            Capabilities &amp; Services
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-5 [text-wrap:balance]">
            We find the waste. We fix it. You keep the savings.
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed [text-wrap:balance]">
            We don&apos;t build software for the sake of software. Every engagement starts with a financial question: <span className="text-white font-medium">&ldquo;How much is this inefficiency costing you every month, and how quickly does the solution pay for itself?&rdquo;</span>
          </p>
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-neutral-900/80 border border-neutral-800 p-7 rounded-lg hover:border-neutral-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-mono font-semibold text-neutral-400 tabular-nums">
                      {service.number}
                    </span>
                    <div className="w-9 h-9 rounded-md bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center text-sky-400">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1.5">
                    {service.title}
                  </h3>
                  <p className="text-xs font-medium text-sky-400/90 mb-5">
                    {service.tagline}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                        The Problem
                      </span>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {service.problem}
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                        Our Solution
                      </span>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {service.solution}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800/80">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                    Financial Benefit
                  </span>
                  <p className="text-xs font-medium text-emerald-400 leading-relaxed">
                    {service.benefit}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 text-center">
          <p className="text-sm text-neutral-400 mb-4">
            Not sure which area of your operations has the highest return on investment?
          </p>
          <button
            onClick={onConsultationClick}
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
          >
            <span>Let&apos;s evaluate your current setup together</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
