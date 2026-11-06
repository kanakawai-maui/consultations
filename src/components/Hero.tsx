import React from 'react';
import { ArrowRight, Calculator, ShieldCheck } from 'lucide-react';
import { Analytics } from '../lib/analytics';

interface HeroProps {
  onCalculateClick: () => void;
  onConsultationClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCalculateClick, onConsultationClick }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-neutral-800">
      {/* Background visual asset with gradient scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_hawaii_coastline_1793998148590.jpg"
          alt="Hawaii rugged volcanic coastline and Pacific ocean"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-20 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/90 to-neutral-950" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Unboxed editorial kicker */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-sky-400 mb-6">
          <span>Silicon Valley Engineering</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>Local Hawaii Roots</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>Measurable ROI</span>
        </div>

        {/* Primary headline with text-wrap: balance */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-tight mb-7 [text-wrap:balance]">
          Your business is spending too much money on work that shouldn&apos;t require so much work.
        </h1>

        {/* Supporting copy */}
        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-neutral-300 font-normal leading-relaxed mb-10 [text-wrap:balance]">
          Labor isn&apos;t cheap in Hawaii. Neither are operating expenses. We help Hawaii businesses cut unnecessary costs by automating repetitive work, fixing inefficient processes, and building practical software that gets more done with fewer resources.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5">
          <button
            onClick={() => {
              Analytics.ctaClicked('Calculate Your Potential Savings', 'Hero');
              onCalculateClick();
            }}
            className="w-full sm:w-auto px-7 py-4 text-base font-semibold text-neutral-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-all shadow-lg shadow-sky-500/10 active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Calculator className="w-5 h-5" />
            Calculate Your Potential Savings
          </button>

          <button
            onClick={() => {
              Analytics.ctaClicked('Get a Free Consultation', 'Hero');
              onConsultationClick();
            }}
            className="w-full sm:w-auto px-7 py-4 text-base font-medium text-white hover:text-white bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Get a Free Consultation
            <ArrowRight className="w-4 h-4 text-neutral-400" />
          </button>
        </div>

        {/* Supporting microcopy */}
        <p className="text-xs sm:text-sm text-neutral-400 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>No sales pressure. No obligation. Just an honest look at where you could save.</span>
        </p>

        {/* Quick Island operating realities banner */}
        <div className="mt-16 pt-8 border-t border-neutral-900 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="p-4 bg-neutral-900/40 border border-neutral-800/80 rounded-lg">
            <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">State Reality</div>
            <div className="text-xl font-bold text-white tabular-nums">+40% Higher</div>
            <div className="text-xs text-neutral-400 mt-1">Average commercial overhead & utility rates vs. mainland.</div>
          </div>
          <div className="p-4 bg-neutral-900/40 border border-neutral-800/80 rounded-lg">
            <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Labor Burden</div>
            <div className="text-xl font-bold text-white tabular-nums">$30–$45/hr</div>
            <div className="text-xs text-neutral-400 mt-1">True loaded cost per administrative employee hour in Hawaii.</div>
          </div>
          <div className="p-4 bg-neutral-900/40 border border-neutral-800/80 rounded-lg">
            <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Common Waste</div>
            <div className="text-xl font-bold text-sky-400 tabular-nums">12–18 hrs</div>
            <div className="text-xs text-neutral-400 mt-1">Wasted per team member each week on manual data re-entry.</div>
          </div>
          <div className="p-4 bg-neutral-900/40 border border-neutral-800/80 rounded-lg">
            <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Our Target</div>
            <div className="text-xl font-bold text-emerald-400 tabular-nums">3–6 Months</div>
            <div className="text-xs text-neutral-400 mt-1">Typical breakeven payback period for practical automation.</div>
          </div>
        </div>
      </div>
    </section>
  );
};
