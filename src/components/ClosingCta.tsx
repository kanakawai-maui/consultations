import React from 'react';
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Analytics } from '../lib/analytics';

interface ClosingCtaProps {
  onConsultationClick: () => void;
}

export const ClosingCta: React.FC<ClosingCtaProps> = ({ onConsultationClick }) => {
  return (
    <section className="py-20 md:py-28 bg-neutral-950 border-b border-neutral-800 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-radial from-sky-950/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-sky-400 mb-4">
          <span>Hawaii Business Operations</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6 [text-wrap:balance]">
          You don&apos;t need more overhead. You need better systems.
        </h2>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-300 leading-relaxed mb-8 [text-wrap:balance]">
          Let&apos;s figure out where your business is spending money it doesn&apos;t have to. A straightforward conversation. Real numbers. Practical solutions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <button
            onClick={() => {
              Analytics.ctaClicked('Get Your Free Consultation', 'Closing_CTA');
              onConsultationClick();
            }}
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-neutral-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-all shadow-lg shadow-sky-500/10 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Get Your Free Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="mailto:rob@olelohonua.com"
            className="w-full sm:w-auto px-6 py-4 text-sm font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-md transition-all flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4 text-sky-400" />
            <span>Direct Email: rob@olelohonua.com</span>
          </a>
        </div>

        <p className="text-xs text-neutral-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Confidentiality respected. Zero obligation. No spam ever.</span>
        </p>
      </div>
    </section>
  );
};
