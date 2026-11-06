import React, { useState, useMemo } from 'react';
import { Analytics } from '../lib/analytics';
import { 
  Check, 
  ArrowRight, 
  Sliders, 
  HelpCircle,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';

interface PricingSectionProps {
  onSelectTier: (tierName: string, estimatedRange: string) => void;
  calculatorMonthlySavings?: number;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ 
  onSelectTier, 
  calculatorMonthlySavings = 1800 
}) => {
  // Interactive Pricing Configurator state
  const [processCount, setProcessCount] = useState<number>(2); // 1-2, 3-5, 6+
  const [integrationComplexity, setIntegrationComplexity] = useState<'standard' | 'complex'>('standard');
  const [customSoftwareNeeded, setCustomSoftwareNeeded] = useState<boolean>(false);
  const [aiDocumentOrSupport, setAiDocumentOrSupport] = useState<boolean>(true);
  const [supportRequirement, setSupportRequirement] = useState<'standard' | 'ongoing'>('standard');

  // Compute estimated project range dynamically
  const { minCost, maxCost, tierRecommendation, paybackEstimate } = useMemo(() => {
    let min = 1500;
    let max = 3500;

    // Process count
    if (processCount === 1) {
      min += 0;
      max += 500;
    } else if (processCount === 2) {
      min += 1000;
      max += 2500;
    } else { // 3 or more
      min += 3000;
      max += 6000;
    }

    // Integrations
    if (integrationComplexity === 'complex') {
      min += 1500;
      max += 3000;
    }

    // Custom software
    if (customSoftwareNeeded) {
      min += 4000;
      max += 8000;
    }

    // AI document / customer support
    if (aiDocumentOrSupport) {
      min += 1000;
      max += 2500;
    }

    // Support
    if (supportRequirement === 'ongoing') {
      min += 500;
      max += 1500;
    }

    let tier = 'Starter — Small Wins';
    if (min >= 10000 || max >= 15000) {
      tier = 'Custom Engineering — Bigger Problems';
    } else if (min >= 3500 || max >= 7000) {
      tier = 'Operations — Meaningful Savings';
    }

    // Payback calculation using monthly savings
    const avgCost = (min + max) / 2;
    let paybackMonths = '2–4 months';
    if (calculatorMonthlySavings > 0) {
      const pMin = Math.max(1, Math.round(min / calculatorMonthlySavings));
      const pMax = Math.max(pMin, Math.round(max / calculatorMonthlySavings));
      paybackMonths = `${pMin} to ${pMax} months`;
    }

    return {
      minCost: Math.round(min / 100) * 100,
      maxCost: Math.round(max / 100) * 100,
      tierRecommendation: tier,
      paybackEstimate: paybackMonths,
    };
  }, [processCount, integrationComplexity, customSoftwareNeeded, aiDocumentOrSupport, supportRequirement, calculatorMonthlySavings]);

  const handleTierClick = (name: string, range: string) => {
    Analytics.pricingInteracted(name, range);
    onSelectTier(name, range);
  };

  return (
    <section id="pricing" className="py-20 md:py-28 bg-neutral-950 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-sky-400 mb-3">
            Investment &amp; Payback
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-5 [text-wrap:balance]">
            The goal isn&apos;t to buy more technology. It&apos;s to spend less running your business.
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed [text-wrap:balance]">
            Every Hawaii business has different bottlenecks, systems, and scales. We quote projects with transparent fixed scopes, mathematically validated against the payroll or operating waste they eliminate.
          </p>
        </div>

        {/* 3 Indicative Project Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Tier 1: Starter */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-7 flex flex-col justify-between hover:border-neutral-700 transition-colors">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Small Wins
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                For businesses looking to eliminate a few painful, repetitive administrative tasks without a long deployment.
              </p>

              <div className="mb-6 pb-6 border-b border-neutral-800">
                <span className="text-xs text-neutral-400 block mb-1">Indicative Range</span>
                <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                  $1,500 – $3,500
                </div>
                <span className="text-xs text-emerald-400 font-medium mt-1 block">
                  Typical payback: 4 to 8 weeks
                </span>
              </div>

              <ul className="space-y-3 text-xs text-neutral-300 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>1 to 2 targeted automation flows (e.g. lead capture into CRM or auto-invoicing).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>Standard tool connection (QuickBooks, Google Workspace, Shopify, Square).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>Elimination of manual spreadsheets for primary pipeline step.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>Staff training &amp; 30-day monitoring.</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleTierClick('Starter — Small Wins', '$1,500 – $3,500')}
              className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-md transition-colors cursor-pointer"
            >
              Discuss Starter Project
            </button>
          </div>

          {/* Tier 2: Operations (Featured) */}
          <div className="bg-neutral-900 border-2 border-sky-500/70 rounded-xl p-7 flex flex-col justify-between relative shadow-xl shadow-sky-950/20">
            <div className="absolute -top-3 left-6 bg-sky-500 text-neutral-950 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded">
              Most Popular
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-2">
                Meaningful Savings
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Operations</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                For businesses needing multiple automations, integrations, and deep workflow improvements across departments.
              </p>

              <div className="mb-6 pb-6 border-b border-neutral-800">
                <span className="text-xs text-neutral-400 block mb-1">Indicative Range</span>
                <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                  $3,500 – $10,000
                </div>
                <span className="text-xs text-emerald-400 font-medium mt-1 block">
                  Typical payback: 2 to 4 months
                </span>
              </div>

              <ul className="space-y-3 text-xs text-neutral-300 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>3 to 5 multi-step workflows &amp; bi-directional system sync.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>AI document extraction (parsing vendor bills, receipts, or work orders).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>Custom dispatch, customer follow-up, or reporting dashboards.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>60-day post-launch support &amp; error recovery triggers.</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleTierClick('Operations — Meaningful Savings', '$3,500 – $10,000')}
              className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-colors cursor-pointer"
            >
              Discuss Operations Project
            </button>
          </div>

          {/* Tier 3: Custom Engineering */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-7 flex flex-col justify-between hover:border-neutral-700 transition-colors">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Bigger Problems
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Custom Engineering</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                For complex operations, custom internal applications, and multi-island logistics coordination.
              </p>

              <div className="mb-6 pb-6 border-b border-neutral-800">
                <span className="text-xs text-neutral-400 block mb-1">Indicative Range</span>
                <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                  $10,000+
                </div>
                <span className="text-xs text-emerald-400 font-medium mt-1 block">
                  Typical payback: 3 to 6 months
                </span>
              </div>

              <ul className="space-y-3 text-xs text-neutral-300 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>Full bespoke software portal or dedicated field operations web app.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>Legacy database migration &amp; enterprise warehouse/freight integration.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>End-to-end autonomous customer support &amp; quote generation pipeline.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>Full source code ownership, SLA guarantees &amp; dedicated engineer.</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleTierClick('Custom Engineering — Bigger Problems', '$10,000+')}
              className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-md transition-colors cursor-pointer"
            >
              Discuss Custom Engineering
            </button>
          </div>

        </div>

        {/* Interactive Project Estimator Tool */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-6 sm:p-8">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-1.5 mb-1.5">
              <Sliders className="w-4 h-4" />
              Interactive Project Scope Estimator
            </span>
            <h3 className="text-xl font-bold text-white mb-2">
              Estimate your project investment based on your actual operational scope
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400">
              Select your requirements below to see an instant, data-driven estimated investment bracket and estimated break-even timeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-8 border-b border-neutral-800">
            {/* Control 1: Process Count */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-2">
                1. Number of Processes to Automate
              </label>
              <div className="space-y-2">
                {[
                  { count: 1, label: '1–2 Workflows' },
                  { count: 2, label: '3–5 Workflows' },
                  { count: 3, label: '6+ Workflows (Multi-team)' },
                ].map((item) => (
                  <button
                    key={item.count}
                    onClick={() => {
                      setProcessCount(item.count);
                      Analytics.pricingInteracted('process_count', item.count);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded border transition-colors cursor-pointer ${
                      processCount === item.count
                        ? 'bg-sky-950/40 border-sky-400 text-white font-semibold'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Control 2: Integration Complexity */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-2">
                2. Integration Complexity
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIntegrationComplexity('standard');
                    Analytics.pricingInteracted('integration_complexity', 'standard');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded border transition-colors cursor-pointer ${
                    integrationComplexity === 'standard'
                      ? 'bg-sky-950/40 border-sky-400 text-white font-semibold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold text-white">Standard Modern Apps</div>
                  <div className="text-[10px] text-neutral-400">QuickBooks, Google, Slack, Shopify</div>
                </button>
                <button
                  onClick={() => {
                    setIntegrationComplexity('complex');
                    Analytics.pricingInteracted('integration_complexity', 'complex');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded border transition-colors cursor-pointer ${
                    integrationComplexity === 'complex'
                      ? 'bg-sky-950/40 border-sky-400 text-white font-semibold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold text-white">Legacy / Island Systems</div>
                  <div className="text-[10px] text-neutral-400">Custom SQL, local server databases, EDI</div>
                </button>
              </div>
            </div>

            {/* Control 3: Custom Software & AI */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-2">
                3. Software &amp; AI Capabilities
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setAiDocumentOrSupport(!aiDocumentOrSupport);
                    Analytics.pricingInteracted('ai_document_toggle', !aiDocumentOrSupport);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded border transition-colors cursor-pointer ${
                    aiDocumentOrSupport
                      ? 'bg-sky-950/40 border-sky-400 text-white font-semibold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>AI Document / Inquiries</span>
                    {aiDocumentOrSupport && <Check className="w-3.5 h-3.5 text-sky-400" />}
                  </div>
                  <div className="text-[10px] text-neutral-400">Automate PDF parsing or customer chat</div>
                </button>
                <button
                  onClick={() => {
                    setCustomSoftwareNeeded(!customSoftwareNeeded);
                    Analytics.pricingInteracted('custom_software_toggle', !customSoftwareNeeded);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded border transition-colors cursor-pointer ${
                    customSoftwareNeeded
                      ? 'bg-sky-950/40 border-sky-400 text-white font-semibold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Custom Internal Portal</span>
                    {customSoftwareNeeded && <Check className="w-3.5 h-3.5 text-sky-400" />}
                  </div>
                  <div className="text-[10px] text-neutral-400">Dedicated web application for your staff</div>
                </button>
              </div>
            </div>

            {/* Control 4: Support Requirement */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-2">
                4. Ongoing Support Model
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSupportRequirement('standard');
                    Analytics.pricingInteracted('support_model', 'standard');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded border transition-colors cursor-pointer ${
                    supportRequirement === 'standard'
                      ? 'bg-sky-950/40 border-sky-400 text-white font-semibold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold text-white">Self-Maintained (Standard)</div>
                  <div className="text-[10px] text-neutral-400">Includes 30 days post-launch support</div>
                </button>
                <button
                  onClick={() => {
                    setSupportRequirement('ongoing');
                    Analytics.pricingInteracted('support_model', 'ongoing');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded border transition-colors cursor-pointer ${
                    supportRequirement === 'ongoing'
                      ? 'bg-sky-950/40 border-sky-400 text-white font-semibold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold text-white">Ongoing Monitoring &amp; Ops</div>
                  <div className="text-[10px] text-neutral-400">Quarterly tune-ups &amp; 24/7 uptime prober</div>
                </button>
              </div>
            </div>
          </div>

          {/* Estimator Result Box */}
          <div className="mt-8 pt-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 block mb-1">
                Estimated Project Investment Bracket
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
                ${minCost.toLocaleString()} – ${maxCost.toLocaleString()}
              </div>
              <div className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
                <span>Aligned Tier: <strong className="text-neutral-200">{tierRecommendation}</strong></span>
                <span aria-hidden="true">&middot;</span>
                <span className="text-emerald-400">Est. Breakeven: {paybackEstimate}</span>
              </div>
            </div>

            <button
              onClick={() => handleTierClick(tierRecommendation, `$${minCost.toLocaleString()} – $${maxCost.toLocaleString()}`)}
              className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-all shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Request Scope Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-800 text-[11px] text-neutral-400 leading-relaxed">
            * These are illustrative starting estimates, not binding quotes. A project must make complete financial sense before moving forward. We do not guarantee a particular savings percentage or return until we review your actual numbers.
          </div>
        </div>

      </div>
    </section>
  );
};
