import React from 'react';
import { Search, Calculator, Wrench, Shield, PhoneCall } from 'lucide-react';

interface HowItWorksProps {
  onConsultationClick: () => void;
}

const STEPS = [
  {
    step: '01',
    icon: PhoneCall,
    title: 'Free Consultation',
    description: 'We spend 30–45 minutes learning how your business operates, how information moves, and where your staff spends their time. No presentations, no sales pitches—just an honest look at your current workflow.'
  },
  {
    step: '02',
    icon: Search,
    title: 'Identify the Waste',
    description: 'We pinpoint the exact repetitive tasks, manual re-entry points, and disconnected tools that eat up payroll. We map out what can realistically be automated versus what must remain human-directed.'
  },
  {
    step: '03',
    icon: Calculator,
    title: 'Calculate the Savings',
    description: 'We run the math. We present a clear breakdown of hours saved, annual dollars recovered, implementation investment, and estimated payback timeframe. If the ROI doesn\'t justify the project, we tell you immediately.'
  },
  {
    step: '04',
    icon: Wrench,
    title: 'Build and Implement',
    description: 'If the numbers make complete sense to you, we build and deploy the solution, train your team, and verify the time savings in production. You keep the recovered margins month after month.'
  }
];

export const HowItWorks: React.FC<HowItWorksProps> = ({ onConsultationClick }) => {
  return (
    <section className="py-20 md:py-28 bg-neutral-900/30 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-sky-400 mb-3">
            The Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-5 [text-wrap:balance]">
            How it works.
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed [text-wrap:balance]">
            A clear, transparent path from discovering where money is leaking to having automated systems doing the heavy lifting.
          </p>
        </div>

        {/* 4-Step Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-neutral-900/80 border border-neutral-800 p-6 rounded-lg relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-mono font-bold text-sky-400 tracking-wider">
                      STEP {item.step}
                    </span>
                    <div className="w-8 h-8 rounded-md bg-neutral-800 border border-neutral-700/60 flex items-center justify-center text-neutral-300">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Assurance Box */}
        <div className="mt-12 p-6 bg-neutral-900/50 border border-neutral-800 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-sm text-neutral-300">
              <strong className="text-white">Zero high-pressure sales tactics.</strong> You are never pressured into purchasing anything. If there is no meaningful savings opportunity, we will be upfront about it.
            </p>
          </div>
          <button
            onClick={onConsultationClick}
            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Start with Step 1
          </button>
        </div>

      </div>
    </section>
  );
};
