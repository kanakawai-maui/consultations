import React, { useState, useEffect } from 'react';
import { 
  InquiryFormData, 
  HAWAII_ISLANDS, 
  BUSINESS_INDUSTRIES, 
  CalculatorInputs, 
  CalculatorOutputs 
} from '../types';
import { Analytics } from '../lib/analytics';
import { 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Calculator, 
  X, 
  Lock, 
  Mail,
  Loader2
} from 'lucide-react';

interface InquiryFormProps {
  attachedCalculatorData?: {
    inputs: CalculatorInputs;
    outputs: CalculatorOutputs;
  } | null;
  onClearCalculatorData?: () => void;
  preselectedBudgetRange?: string;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({
  attachedCalculatorData,
  onClearCalculatorData,
  preselectedBudgetRange,
}) => {
  const [formData, setFormData] = useState<InquiryFormData>({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    island: 'Oahu',
    industry: 'Construction, Trades & Contracting',
    employeeCount: '5–15 employees',
    timeWasters: '',
    desiredImprovements: '',
    budgetRange: preselectedBudgetRange || '$3,500 – $10,000 (Operations)',
    hp_company_field: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSimulatedNote, setIsSimulatedNote] = useState<boolean>(false);

  // Sync preselected budget range if changed by pricing configurator
  useEffect(() => {
    if (preselectedBudgetRange) {
      setFormData(prev => ({ ...prev, budgetRange: preselectedBudgetRange }));
    }
  }, [preselectedBudgetRange]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side validation checks
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!formData.businessName.trim() || formData.businessName.trim().length < 2) {
      setErrorMessage('Please provide your business name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid business email address.');
      return;
    }
    if (!formData.island) {
      setErrorMessage('Please choose your business island.');
      return;
    }
    if (!formData.industry) {
      setErrorMessage('Please select your business industry.');
      return;
    }
    if (!formData.timeWasters.trim() || formData.timeWasters.trim().length < 5) {
      setErrorMessage('Please describe what takes up too much time in your operations.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Record<string, any> = {
        fullName: formData.fullName.trim(),
        businessName: formData.businessName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        island: formData.island,
        industry: formData.industry,
        employeeCount: formData.employeeCount || undefined,
        timeWasters: formData.timeWasters.trim(),
        desiredImprovements: formData.desiredImprovements.trim() || undefined,
        budgetRange: formData.budgetRange || undefined,
        hp_company_field: formData.hp_company_field || undefined,
      };

      if (attachedCalculatorData) {
        payload.calculatorSummary = {
          employees: attachedCalculatorData.inputs.employees,
          hourlyCost: attachedCalculatorData.inputs.hourlyCost,
          hoursPerWeek: attachedCalculatorData.inputs.hoursPerWeek,
          automationPct: attachedCalculatorData.inputs.automationPct,
          weeksPerYear: attachedCalculatorData.inputs.weeksPerYear,
          implementationCost: attachedCalculatorData.inputs.implementationCost,
          annualRepetitiveCost: attachedCalculatorData.outputs.annualRepetitiveCost,
          annualSavings: attachedCalculatorData.outputs.annualSavings,
          monthlySavings: attachedCalculatorData.outputs.monthlySavings,
          firstYearNetSavings: attachedCalculatorData.outputs.firstYearNetSavings,
          paybackPeriodText: attachedCalculatorData.outputs.paybackPeriodText,
          roiPercentText: attachedCalculatorData.outputs.roiPercentText,
        };
      }

      const response = await fetch('/api/inquire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit inquiry. Please try again.');
      }

      setSubmitSuccess(true);
      setSubmissionId(result.submissionId || null);
      if (result.isSimulated) {
        setIsSimulatedNote(true);
      }

      Analytics.inquirySubmitted(
        formData.businessName,
        formData.island,
        Boolean(attachedCalculatorData)
      );
    } catch (err: any) {
      console.error('Inquiry submission error:', err);
      setErrorMessage(
        err.message || 'We encountered a connection issue submitting your inquiry. Please email rob@olelohonua.com directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmitSuccess(false);
    setSubmissionId(null);
    setFormData({
      fullName: '',
      businessName: '',
      email: '',
      phone: '',
      island: 'Oahu',
      industry: 'Construction, Trades & Contracting',
      employeeCount: '5–15 employees',
      timeWasters: '',
      desiredImprovements: '',
      budgetRange: '$3,500 – $10,000 (Operations)',
      hp_company_field: '',
    });
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-neutral-900/40 border-b border-neutral-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-widest text-sky-400 mb-3">
            Free Consultation
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 [text-wrap:balance]">
            Let&apos;s take a look at your operation.
          </h2>
          <p className="text-base text-neutral-300 leading-relaxed [text-wrap:balance]">
            We&apos;ll spend time understanding how your business works, identify where you&apos;re spending unnecessary time and money, and discuss whether there&apos;s a practical way to improve it.
          </p>
          <p className="text-xs text-neutral-400 mt-2">
            No obligation. No hard sell. If there&apos;s no meaningful opportunity to save money, we&apos;ll tell you straight.
          </p>
        </div>

        {/* Attached Calculator Results Banner */}
        {attachedCalculatorData && (
          <div className="mb-8 p-4 bg-sky-950/40 border border-sky-500/40 rounded-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calculator className="w-5 h-5 text-sky-400 shrink-0" />
              <div className="text-xs text-neutral-200">
                <span className="font-semibold text-white">Your Calculator Estimate Attached: </span>
                <span className="text-sky-300 font-mono font-bold">
                  ${attachedCalculatorData.outputs.annualSavings.toLocaleString()}/yr
                </span>{' '}
                est. savings across {attachedCalculatorData.inputs.employees} employees ({attachedCalculatorData.outputs.paybackPeriodText} est. payback).
              </div>
            </div>
            {onClearCalculatorData && (
              <button
                onClick={onClearCalculatorData}
                className="text-neutral-400 hover:text-white p-1 rounded"
                title="Remove attached numbers"
                aria-label="Remove attached calculator data"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Success Confirmation Card */}
        {submitSuccess ? (
          <div className="bg-neutral-900 border border-emerald-500/50 rounded-xl p-8 sm:p-10 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Got it. Your inquiry has been sent.
            </h3>
            <p className="text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed mb-6">
              We&apos;ll review what you shared, look at your numbers, and get back to you within one business day with practical next steps.
            </p>
            {submissionId && (
              <div className="inline-block px-3 py-1 bg-neutral-950 rounded border border-neutral-800 text-xs font-mono text-neutral-400 mb-8">
                Reference ID: {submissionId}
              </div>
            )}

            <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleResetForm}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
              >
                Submit Another Inquiry
              </button>
              <a
                href="mailto:rob@olelohonua.com"
                className="text-xs text-sky-400 hover:text-sky-300 font-medium"
              >
                Need immediate answers? Email rob@olelohonua.com
              </a>
            </div>
          </div>
        ) : (
          /* Actual Interactive Working Form */
          <form
            onSubmit={handleSubmit}
            className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-6 sm:p-10 shadow-xl"
            noValidate
          >
            {/* Honeypot field (hidden from real users, traps automated scrapers) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="hp_company_field">Leave this field blank</label>
              <input
                id="hp_company_field"
                type="text"
                name="hp_company_field"
                tabIndex={-1}
                autoComplete="off"
                value={formData.hp_company_field}
                onChange={handleChange}
              />
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 bg-rose-950/50 border border-rose-500/50 rounded-lg flex items-start gap-3 text-rose-200 text-xs sm:text-sm">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-rose-300 mb-0.5">Please check the form:</div>
                  <div>{errorMessage}</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-2">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Keanu Miller"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm text-white bg-neutral-950 border border-neutral-700 rounded-md focus:border-sky-400 focus:outline-none placeholder:text-neutral-600 transition-colors"
                />
              </div>

              {/* Business Name */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-2">
                  Business Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  required
                  placeholder="e.g. Pacific Coast Distribution LLC"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm text-white bg-neutral-950 border border-neutral-700 rounded-md focus:border-sky-400 focus:outline-none placeholder:text-neutral-600 transition-colors"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-2">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@yourcompany.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm text-white bg-neutral-950 border border-neutral-700 rounded-md focus:border-sky-400 focus:outline-none placeholder:text-neutral-600 transition-colors"
                />
              </div>

              {/* Phone Number (Optional) */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-2">
                  Phone Number <span className="text-neutral-400 lowercase">(optional)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="(808) 555-0199"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm text-white bg-neutral-950 border border-neutral-700 rounded-md focus:border-sky-400 focus:outline-none placeholder:text-neutral-600 transition-colors"
                />
              </div>

              {/* Island Location */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-2">
                  Business Location / Island <span className="text-rose-400">*</span>
                </label>
                <select
                  name="island"
                  value={formData.island}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm text-white bg-neutral-950 border border-neutral-700 rounded-md focus:border-sky-400 focus:outline-none transition-colors"
                >
                  {HAWAII_ISLANDS.map(island => (
                    <option key={island} value={island} className="bg-neutral-950 text-white">
                      {island}
                    </option>
                  ))}
                </select>
              </div>

              {/* Industry */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-2">
                  Industry / Business Type <span className="text-rose-400">*</span>
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm text-white bg-neutral-950 border border-neutral-700 rounded-md focus:border-sky-400 focus:outline-none transition-colors"
                >
                  {BUSINESS_INDUSTRIES.map(ind => (
                    <option key={ind} value={ind} className="bg-neutral-950 text-white">
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Employees (Optional) */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-2">
                  Total Team Size <span className="text-neutral-400 lowercase">(optional)</span>
                </label>
                <select
                  name="employeeCount"
                  value={formData.employeeCount}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm text-white bg-neutral-950 border border-neutral-700 rounded-md focus:border-sky-400 focus:outline-none transition-colors"
                >
                  <option value="1–4 employees">1–4 employees</option>
                  <option value="5–15 employees">5–15 employees</option>
                  <option value="16–35 employees">16–35 employees</option>
                  <option value="36–75 employees">36–75 employees</option>
                  <option value="75+ employees">75+ employees</option>
                </select>
              </div>

              {/* Budget / Investment Range */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-2">
                  Expected Investment Range <span className="text-neutral-400 lowercase">(optional)</span>
                </label>
                <select
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm text-white bg-neutral-950 border border-neutral-700 rounded-md focus:border-sky-400 focus:outline-none transition-colors"
                >
                  <option value="$1,500 – $3,500 (Starter)">$1,500 – $3,500 (Starter — Small Wins)</option>
                  <option value="$3,500 – $10,000 (Operations)">$3,500 – $10,000 (Operations — Meaningful Savings)</option>
                  <option value="$10,000+ (Custom Engineering)">$10,000+ (Custom Engineering — Bigger Problems)</option>
                  <option value="Unsure / Need Cost Analysis">Unsure / Need Cost Analysis First</option>
                </select>
              </div>
            </div>

            {/* Time Wasters (Required) */}
            <div className="mb-6">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-2">
                What takes up too much time in your business? <span className="text-rose-400">*</span>
              </label>
              <textarea
                name="timeWasters"
                required
                rows={3}
                placeholder="e.g. My office manager spends 3 hours every day copying delivery slips into QuickBooks, and our dispatcher is constantly texting drivers back and forth..."
                value={formData.timeWasters}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm text-white bg-neutral-950 border border-neutral-700 rounded-md focus:border-sky-400 focus:outline-none placeholder:text-neutral-600 transition-colors leading-relaxed"
              />
            </div>

            {/* Desired Improvements (Optional) */}
            <div className="mb-8">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-2">
                What would you most like to improve? <span className="text-neutral-400 lowercase">(optional)</span>
              </label>
              <textarea
                name="desiredImprovements"
                rows={2}
                placeholder="e.g. We want invoices sent automatically upon delivery so we get paid 2 weeks faster without hiring another clerk."
                value={formData.desiredImprovements}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm text-white bg-neutral-950 border border-neutral-700 rounded-md focus:border-sky-400 focus:outline-none placeholder:text-neutral-600 transition-colors leading-relaxed"
              />
            </div>

            {/* Submit Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-800">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <Lock className="w-3.5 h-3.5 text-neutral-500" />
                <span>Submissions route directly to Rob Brown (<span className="text-neutral-300">rob@olelohonua.com</span>). Never shared or spammed.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 text-sm font-semibold uppercase tracking-wider text-neutral-950 bg-sky-400 hover:bg-sky-300 disabled:bg-neutral-700 disabled:text-neutral-400 rounded-md transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Inquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Let&apos;s Find Your Savings</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </section>
  );
};
