import React, { useState, useMemo } from 'react';
import { CalculatorInputs, CalculatorOutputs } from '../types';
import { Analytics } from '../lib/analytics';
import { 
  DollarSign, 
  Clock, 
  Users, 
  Percent, 
  ArrowRight, 
  Sparkles, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

interface CostSavingsCalculatorProps {
  onTransferResults: (inputs: CalculatorInputs, outputs: CalculatorOutputs) => void;
}

const PRESETS = [
  {
    name: 'Wholesale & Logistics',
    description: '4 admin clerks processing orders, BOLs, inventory sync',
    inputs: {
      employees: 4,
      hourlyCost: 32,
      hoursPerWeek: 16,
      automationPct: 55,
      weeksPerYear: 50,
      implementationCost: 6500,
    },
  },
  {
    name: 'Contractor & Trades',
    description: '2 office staff handling dispatch, invoice PDFs, vendor receipts',
    inputs: {
      employees: 2,
      hourlyCost: 35,
      hoursPerWeek: 14,
      automationPct: 50,
      weeksPerYear: 50,
      implementationCost: 4500,
    },
  },
  {
    name: 'Medical / Dental Clinic',
    description: '3 front-desk staff scheduling, insurance forms, repeat inquiries',
    inputs: {
      employees: 3,
      hourlyCost: 30,
      hoursPerWeek: 18,
      automationPct: 40,
      weeksPerYear: 50,
      implementationCost: 5000,
    },
  },
  {
    name: 'Small Local Business',
    description: '1 full-time administrator handling quotes, emails, QuickBooks',
    inputs: {
      employees: 1,
      hourlyCost: 28,
      hoursPerWeek: 20,
      automationPct: 60,
      weeksPerYear: 50,
      implementationCost: 2800,
    },
  },
];

export const CostSavingsCalculator: React.FC<CostSavingsCalculatorProps> = ({ onTransferResults }) => {
  // Default values
  const [inputs, setInputs] = useState<CalculatorInputs>({
    employees: 3,
    hourlyCost: 32,
    hoursPerWeek: 14,
    automationPct: 45,
    weeksPerYear: 50,
    implementationCost: 4500,
  });

  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Compute outputs dynamically
  const outputs: CalculatorOutputs = useMemo(() => {
    const {
      employees,
      hourlyCost,
      hoursPerWeek,
      automationPct,
      weeksPerYear,
      implementationCost,
    } = inputs;

    // Repetitive labor cost per year
    const annualRepetitiveCost = Math.round(employees * hourlyCost * hoursPerWeek * weeksPerYear);
    // Potential annual savings
    const annualSavings = Math.round(annualRepetitiveCost * (automationPct / 100));
    // Monthly savings
    const monthlySavings = Math.round(annualSavings / 12);
    // 1st year net savings after implementation cost
    const firstYearNetSavings = Math.round(annualSavings - implementationCost);

    // Payback period
    let paybackPeriodMonths: number | null = null;
    let paybackPeriodText = 'N/A';

    if (implementationCost <= 0) {
      paybackPeriodMonths = 0;
      paybackPeriodText = 'Immediate (0 months)';
    } else if (monthlySavings > 0) {
      const months = implementationCost / monthlySavings;
      paybackPeriodMonths = parseFloat(months.toFixed(1));
      if (paybackPeriodMonths < 1) {
        const weeks = Math.max(1, Math.round(months * 4.33));
        paybackPeriodText = `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
      } else {
        paybackPeriodText = `${paybackPeriodMonths} ${paybackPeriodMonths === 1 ? 'month' : 'months'}`;
      }
    }

    // ROI
    let roiPercent: number | null = null;
    let roiPercentText = 'N/A';

    if (implementationCost <= 0 && annualSavings > 0) {
      roiPercent = 999;
      roiPercentText = 'Infinite';
    } else if (implementationCost > 0) {
      const roi = ((annualSavings - implementationCost) / implementationCost) * 100;
      roiPercent = Math.round(roi);
      roiPercentText = `${roiPercent > 0 ? '+' : ''}${roiPercent}%`;
    }

    return {
      annualRepetitiveCost,
      annualSavings,
      monthlySavings,
      firstYearNetSavings,
      paybackPeriodMonths,
      paybackPeriodText,
      roiPercent,
      roiPercentText,
    };
  }, [inputs]);

  const handleInputChange = (field: keyof CalculatorInputs, value: number) => {
    setActivePreset(null);
    setInputs(prev => ({
      ...prev,
      [field]: Math.max(0, value),
    }));
    Analytics.calculatorInteracted(field, value);
  };

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setActivePreset(preset.name);
    setInputs({ ...preset.inputs });
    Analytics.calculatorInteracted(`preset_${preset.name}`, preset.inputs.employees);
  };

  const handleReset = () => {
    setActivePreset(null);
    setInputs({
      employees: 3,
      hourlyCost: 32,
      hoursPerWeek: 14,
      automationPct: 45,
      weeksPerYear: 50,
      implementationCost: 4500,
    });
  };

  const handleTransfer = () => {
    Analytics.calculatorCompleted(outputs.annualSavings, outputs.roiPercentText);
    Analytics.ctaClicked('Get My Free Cost Analysis', 'Calculator');
    onTransferResults(inputs, outputs);
  };

  return (
    <section id="calculator" className="py-20 md:py-28 bg-neutral-950 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-sky-400 mb-3">
            Financial Impact Tool
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 [text-wrap:balance]">
            Interactive Cost Savings Calculator
          </h2>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed [text-wrap:balance]">
            Estimate how much money your Hawaii business is spending on repetitive administrative busywork, and see what you could realistically save through practical automation.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="mb-10 p-5 bg-neutral-900/50 border border-neutral-800 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Quick Island Industry Profiles
            </span>
            <button
              onClick={handleReset}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset to Defaults
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleApplyPreset(preset)}
                className={`p-3 text-left rounded-md border text-xs transition-all cursor-pointer ${
                  activePreset === preset.name
                    ? 'bg-sky-950/40 border-sky-500 text-white shadow-sm'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white'
                }`}
              >
                <div className="font-semibold text-white mb-0.5">{preset.name}</div>
                <div className="text-[11px] text-neutral-400 leading-snug">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main 2-Column Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sliders & Controls */}
          <div className="lg:col-span-7 bg-neutral-900/70 border border-neutral-800 rounded-xl p-6 sm:p-8 space-y-7">
            <h3 className="text-lg font-bold text-white border-b border-neutral-800 pb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-400" />
              Your Team &amp; Labor Parameters
            </h3>

            {/* Slider 1: Employees */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-neutral-200">
                  Employees performing repetitive administrative tasks
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={inputs.employees}
                    onChange={(e) => handleInputChange('employees', Number(e.target.value))}
                    className="w-16 px-2.5 py-1 text-sm font-mono font-bold text-white bg-neutral-950 border border-neutral-700 rounded text-center focus:border-sky-400 focus:outline-none"
                  />
                  <span className="text-xs text-neutral-400">people</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={inputs.employees}
                onChange={(e) => handleInputChange('employees', Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                <span>1 employee</span>
                <span>15 employees</span>
                <span>30+ employees</span>
              </div>
            </div>

            {/* Slider 2: Hourly Rate (Loaded Cost) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="text-sm font-medium text-neutral-200 block">
                    Average hourly cost per employee
                  </label>
                  <span className="text-xs text-neutral-400 block">
                    Wage + payroll taxes, health insurance, and Hawaii benefits
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-neutral-400 font-mono">$</span>
                  <input
                    type="number"
                    min="15"
                    max="150"
                    value={inputs.hourlyCost}
                    onChange={(e) => handleInputChange('hourlyCost', Number(e.target.value))}
                    className="w-16 px-2.5 py-1 text-sm font-mono font-bold text-white bg-neutral-950 border border-neutral-700 rounded text-center focus:border-sky-400 focus:outline-none"
                  />
                  <span className="text-xs text-neutral-400">/hr</span>
                </div>
              </div>
              <input
                type="range"
                min="18"
                max="80"
                step="1"
                value={inputs.hourlyCost}
                onChange={(e) => handleInputChange('hourlyCost', Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                <span>$18/hr</span>
                <span>$35/hr (Typical HI average)</span>
                <span>$80/hr</span>
              </div>
            </div>

            {/* Slider 3: Hours per Week on Repetitive Work */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="text-sm font-medium text-neutral-200 block">
                    Hours spent on repetitive tasks per employee / week
                  </label>
                  <span className="text-xs text-neutral-400 block">
                    Data entry, reconciling orders, status updates, manual PDFs
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={inputs.hoursPerWeek}
                    onChange={(e) => handleInputChange('hoursPerWeek', Number(e.target.value))}
                    className="w-16 px-2.5 py-1 text-sm font-mono font-bold text-white bg-neutral-950 border border-neutral-700 rounded text-center focus:border-sky-400 focus:outline-none"
                  />
                  <span className="text-xs text-neutral-400">hrs</span>
                </div>
              </div>
              <input
                type="range"
                min="2"
                max="35"
                step="1"
                value={inputs.hoursPerWeek}
                onChange={(e) => handleInputChange('hoursPerWeek', Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                <span>2 hrs/wk</span>
                <span>14 hrs/wk (Avg)</span>
                <span>35 hrs/wk</span>
              </div>
            </div>

            {/* Slider 4: Realistic Automation Percentage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="text-sm font-medium text-neutral-200 block">
                    Realistic automation target
                  </label>
                  <span className="text-xs text-neutral-400 block">
                    Portion of repetitive work that can be handed off to software
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="10"
                    max="90"
                    value={inputs.automationPct}
                    onChange={(e) => handleInputChange('automationPct', Number(e.target.value))}
                    className="w-16 px-2.5 py-1 text-sm font-mono font-bold text-white bg-neutral-950 border border-neutral-700 rounded text-center focus:border-sky-400 focus:outline-none"
                  />
                  <span className="text-xs text-neutral-400">%</span>
                </div>
              </div>
              <input
                type="range"
                min="15"
                max="85"
                step="5"
                value={inputs.automationPct}
                onChange={(e) => handleInputChange('automationPct', Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                <span>15% (Conservative)</span>
                <span>45% (Practical)</span>
                <span>85% (High automation)</span>
              </div>
            </div>

            {/* Editable Implementation Cost & Weeks */}
            <div className="pt-4 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                  Estimated Project Investment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-neutral-400 font-mono text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={inputs.implementationCost}
                    onChange={(e) => handleInputChange('implementationCost', Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-sm font-mono font-bold text-white bg-neutral-950 border border-neutral-700 rounded focus:border-sky-400 focus:outline-none"
                  />
                </div>
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  One-time build cost (editable default)
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                  Working Weeks Per Year
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="40"
                    max="52"
                    value={inputs.weeksPerYear}
                    onChange={(e) => handleInputChange('weeksPerYear', Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-mono font-bold text-white bg-neutral-950 border border-neutral-700 rounded focus:border-sky-400 focus:outline-none"
                  />
                </div>
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Typically 50 or 52 weeks in Hawaii
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Calculated Outputs */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Primary Highlight Card */}
            <div className="bg-neutral-900 border border-sky-500/40 rounded-xl p-6 sm:p-7 shadow-xl shadow-sky-950/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />

              <span className="text-xs font-semibold uppercase tracking-widest text-sky-400 block mb-1">
                Estimated Annual Savings
              </span>
              
              {/* Prominent Large Annual Savings Display */}
              <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight tabular-nums my-2">
                ${outputs.annualSavings.toLocaleString()}
                <span className="text-base font-normal text-neutral-400 ml-1.5">/year</span>
              </div>

              <p className="text-xs text-neutral-400 mb-6">
                Direct operating capital recovered that stays in your business account rather than evaporating into manual administrative labor.
              </p>

              {/* Key Metrics Breakdown Grid */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-800">
                <div className="p-3 bg-neutral-950/80 rounded-lg border border-neutral-800/80">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 block">
                    Monthly Savings
                  </span>
                  <span className="text-lg font-bold text-emerald-400 font-mono tabular-nums">
                    ${outputs.monthlySavings.toLocaleString()}
                    <span className="text-[11px] font-normal text-neutral-400 ml-1">/mo</span>
                  </span>
                </div>

                <div className="p-3 bg-neutral-950/80 rounded-lg border border-neutral-800/80">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 block">
                    Current Annual Waste
                  </span>
                  <span className="text-lg font-bold text-rose-300 font-mono tabular-nums">
                    ${outputs.annualRepetitiveCost.toLocaleString()}
                  </span>
                </div>

                <div className="p-3 bg-neutral-950/80 rounded-lg border border-neutral-800/80">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 block">
                    Payback Timeline
                  </span>
                  <span className="text-lg font-bold text-white font-mono tabular-nums">
                    {outputs.paybackPeriodText}
                  </span>
                </div>

                <div className="p-3 bg-neutral-950/80 rounded-lg border border-neutral-800/80">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 block">
                    1st-Year ROI
                  </span>
                  <span className="text-lg font-bold text-sky-400 font-mono tabular-nums">
                    {outputs.roiPercentText}
                  </span>
                </div>
              </div>

              {/* First year net savings note */}
              <div className="mt-4 p-3 bg-sky-950/30 border border-sky-900/50 rounded-lg text-xs text-neutral-300 flex items-center justify-between">
                <span>First-Year Net Savings (After Project Cost):</span>
                <span className="font-mono font-bold text-emerald-400 tabular-nums">
                  ${outputs.firstYearNetSavings.toLocaleString()}
                </span>
              </div>

              {/* CTA Transfer to Form */}
              <div className="mt-6 pt-5 border-t border-neutral-800">
                <p className="text-xs font-semibold text-neutral-300 mb-2">
                  Want to see what your business could actually save?
                </p>
                <button
                  onClick={handleTransfer}
                  className="w-full py-3.5 px-4 text-sm font-semibold uppercase tracking-wider text-neutral-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <span>Get My Free Cost Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-neutral-400 block text-center mt-2">
                  Pre-fills your numbers into our consultation form below
                </span>
              </div>
            </div>

            {/* Clear Mandatory Disclaimer */}
            <div className="p-4 bg-neutral-900/40 border border-neutral-800/80 rounded-lg text-xs text-neutral-400 leading-relaxed">
              <span className="font-semibold text-neutral-300 block mb-1">Calculation Disclaimer:</span>
              These are estimates based on the numbers you entered, not guaranteed savings. Actual results depend on your processes, implementation costs, and the amount of work that can realistically be automated.
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
