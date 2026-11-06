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
  Calculator, 
  X, 
  Lock, 
  Mail,
  Loader2,
  Copy,
  Check,
  ExternalLink
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
  const [preparedMailtoUrl, setPreparedMailtoUrl] = useState<string>('');
  const [preparedBodyText, setPreparedBodyText] = useState<string>('');
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

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

  const constructEmailContent = () => {
    const subject = `Olelo Honua Inquiry: ${formData.businessName} (${formData.island})`;

    let calcText = '';
    if (attachedCalculatorData) {
      calcText = `
---
ATTACHED SAVINGS ESTIMATE:
- Repetitive Admin Staff: ${attachedCalculatorData.inputs.employees} people
- Average Loaded Hourly Rate: $${attachedCalculatorData.inputs.hourlyCost}/hr
- Hours Wasted Per Person: ${attachedCalculatorData.inputs.hoursPerWeek} hrs/week
- Target Automation: ${attachedCalculatorData.inputs.automationPct}%
- Estimated Annual Savings: $${attachedCalculatorData.outputs.annualSavings.toLocaleString()}/yr
- Estimated Monthly Savings: $${attachedCalculatorData.outputs.monthlySavings.toLocaleString()}/mo
- Estimated Payback Timeline: ${attachedCalculatorData.outputs.paybackPeriodText}
- Estimated 1st Year ROI: ${attachedCalculatorData.outputs.roiPercentText}
`;
    }

    const body = `Aloha Rob,

Here is our business operational inquiry for Olelo Honua:

CONTACT DETAILS:
- Full Name: ${formData.fullName}
- Business Name: ${formData.businessName}
- Email: ${formData.email}
- Phone: ${formData.phone || 'Not provided'}
- Island / Location: ${formData.island}
- Industry: ${formData.industry}
- Team Size: ${formData.employeeCount || 'Not specified'}
- Expected Investment Range: ${formData.budgetRange}

WHAT TAKES UP TOO MUCH TIME IN OUR BUSINESS:
${formData.timeWasters}

WHAT WE WOULD MOST LIKE TO IMPROVE:
${formData.desiredImprovements || 'Not specified'}
${calcText}
---
Looking forward to discussing where we can reduce our operating expenses.

Mahalo,
${formData.fullName}
${formData.businessName}
${formData.email} ${formData.phone ? `| ${formData.phone}` : ''}`;

    const mailto = `mailto:rob@olelohonua.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    return { subject, body, mailto };
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
      const { body, mailto } = constructEmailContent();
      setPreparedMailtoUrl(mailto);
      setPreparedBodyText(body);

      // Record in background on server as backup
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

      // Fire backup log to backend
      fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(err => console.warn('Backup logging note:', err));

      // Trigger user's default email provider with pre-filled To, Subject, and Body
      window.location.href = mailto;

      setSubmitSuccess(true);
      setSubmissionId(`oh_${Date.now().toString(36)}`);

      Analytics.inquirySubmitted(
        formData.businessName,
        formData.island,
        Boolean(attachedCalculatorData)
      );
    } catch (err: any) {
      console.error('Inquiry submission error:', err);
      setErrorMessage(
        err.message || 'We encountered an issue preparing your email. Please email rob@olelohonua.com directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(preparedBodyText);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 3000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  const handleResetForm = () => {
    setSubmitSuccess(false);
    setSubmissionId(null);
    setPreparedMailtoUrl('');
    setPreparedBodyText('');
    setCopiedToClipboard(false);
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

        {/* Success Confirmation Card with Email Client Actions */}
        {submitSuccess ? (
          <div className="bg-neutral-900 border border-sky-500/50 rounded-xl p-8 sm:p-10 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-sky-950/60 border border-sky-500/40 text-sky-400 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Opening Your Email Provider
            </h3>
            <p className="text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed mb-6">
              Your default email app has been opened with your inquiry addressed to <strong className="text-white font-mono">rob@olelohonua.com</strong> with the subject and all details pre-filled.
            </p>

            {/* Email Actions Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-8">
              <a
                href={preparedMailtoUrl}
                className="w-full sm:w-auto px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-neutral-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in Email App Again</span>
              </a>

              <button
                type="button"
                onClick={handleCopyMessage}
                className="w-full sm:w-auto px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedToClipboard ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-neutral-300" />
                    <span>Copy Text (For Webmail)</span>
                  </>
                )}
              </button>
            </div>

            {/* Message Preview Box */}
            <div className="text-left bg-neutral-950 border border-neutral-800 rounded-lg p-5 max-w-xl mx-auto mb-8 font-mono text-xs text-neutral-300 max-h-56 overflow-y-auto leading-relaxed whitespace-pre-wrap">
              <div className="text-[11px] text-sky-400 font-sans font-semibold uppercase tracking-wider pb-2 mb-2 border-b border-neutral-800">
                Pre-Filled Message Preview (To: rob@olelohonua.com)
              </div>
              {preparedBodyText}
            </div>

            <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleResetForm}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
              >
                Start Over
              </button>
              <a
                href="mailto:rob@olelohonua.com"
                className="text-xs text-sky-400 hover:text-sky-300 font-medium"
              >
                Direct Email: rob@olelohonua.com
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
                <span>Opens your email app directly addressed to <span className="text-neutral-200 font-medium">rob@olelohonua.com</span>.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 text-sm font-semibold uppercase tracking-wider text-neutral-950 bg-sky-400 hover:bg-sky-300 disabled:bg-neutral-700 disabled:text-neutral-400 rounded-md transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Preparing Email...</span>
                  </>
                ) : (
                  <>
                    <span>Let&apos;s Find Your Savings</span>
                    <Mail className="w-4 h-4" />
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
