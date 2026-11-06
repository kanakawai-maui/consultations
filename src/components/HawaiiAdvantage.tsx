import React from 'react';
import { Check, X, MapPin } from 'lucide-react';

export const HawaiiAdvantage: React.FC = () => {
  return (
    <section id="hawaii-advantage" className="py-20 md:py-28 bg-neutral-950 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-sky-400 mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>Island Realities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-5 [text-wrap:balance]">
            Built with Hawaii businesses in mind.
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed [text-wrap:balance]">
            Running a business in Hawaii is different. Labor costs, shipping lags, electricity rates, limited staffing pools, and geographic isolation create challenges mainland businesses never face.
          </p>
        </div>

        {/* 2-Column Split: Visual & Deep Island Context */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-16">
          
          {/* Left Column: Visual Asset with subtle caption */}
          <div className="lg:col-span-5 relative rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 min-h-[320px] flex flex-col justify-end">
            <img
              src="/src/assets/images/hawaii_work_modern_1793998161425.jpg"
              alt="Modern Hawaii workspace with view of lush mountains"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover filter brightness-90 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
            <div className="relative z-10 p-6">
              <span className="text-xs font-mono font-medium text-sky-400 block mb-1">
                Local Presence · Real Island Context
              </span>
              <p className="text-sm font-semibold text-white">
                Honolulu &amp; Neighbor Islands Operations
              </p>
            </div>
          </div>

          {/* Right Column: Grounded Arguments */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-2">
                Why Mainland Software Vendors Miss the Mark
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Mainland agencies don&apos;t understand that shipping a pallet to Kahului isn&apos;t the same as trucking it across Ohio. They don&apos;t understand Hawaii GET calculations, inter-island freight handoffs, or why recruiting three replacement office clerks in Kona can take six months.
              </p>
            </div>

            <div className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-2">
                Silicon Valley Engineering Rigor, No Silicon Valley Ego
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                We bring real production software engineering experience from high-scale tech firms, but we talk like regular people. We don&apos;t preach complex jargon or try to sell you a recurring $50,000 SaaS platform when a lightweight script or simple integration solves your problem for a fraction of that cost.
              </p>
            </div>

            <div className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-2">
                Local Understanding. Serious Engineering. Practical Results.
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Our approach is simple: identify the expensive bottlenecks, find a practical solution, and make sure the numbers work before recommending anything. If an automation won&apos;t clearly pay for itself in a few months, we will advise you not to do it.
              </p>
            </div>
          </div>

        </div>

        {/* Clear Contrast Table */}
        <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/40">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-800">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm mb-4">
                <X className="w-4 h-4 shrink-0" />
                <span>The Mainland Agency Approach</span>
              </div>
              <ul className="space-y-3 text-sm text-neutral-400">
                <li className="flex items-start gap-2">
                  <span className="text-neutral-600 mt-1">&bull;</span>
                  <span>Locks you into high monthly retainer contracts regardless of results.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-600 mt-1">&bull;</span>
                  <span>Treats Hawaii as a vacation destination instead of a tough operational market.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-600 mt-1">&bull;</span>
                  <span>Pushes complex, buzzword-heavy tools that staff abandon after two weeks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-neutral-600 mt-1">&bull;</span>
                  <span>Communicates through three layers of junior account managers.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 sm:p-8 bg-sky-950/20">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-4">
                <Check className="w-4 h-4 shrink-0" />
                <span>The Olelo Honua Standard</span>
              </div>
              <ul className="space-y-3 text-sm text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">&bull;</span>
                  <span>Every project is measured against hard labor and operating savings.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">&bull;</span>
                  <span>Deep familiarity with island business workflows, freight, and local logistics.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">&bull;</span>
                  <span>Clean, practical software that your staff actually loves using.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">&bull;</span>
                  <span>Direct contact with senior engineers who build and maintain the solution.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
