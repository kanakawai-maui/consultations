import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Analytics } from '../lib/analytics';

interface HeaderProps {
  onScheduleClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onScheduleClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (anchorId: string, label: string) => {
    setMobileMenuOpen(false);
    Analytics.ctaClicked(`Nav_${label}`, 'Header');
    const el = document.getElementById(anchorId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="/"
            className="text-xl font-bold tracking-tight text-white hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="font-extrabold tracking-tighter text-white">Olelo Honua</span>
          </a>

          {/* Zone 2: 4-5 single-line clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-300">
            <button
              onClick={() => handleNavClick('inefficiencies', 'Inefficiencies')}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Where You Lose Money
            </button>
            <button
              onClick={() => handleNavClick('capabilities', 'Capabilities')}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              What We Do
            </button>
            <button
              onClick={() => handleNavClick('hawaii-advantage', 'Hawaii')}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              The Hawaii Advantage
            </button>
            <button
              onClick={() => handleNavClick('calculator', 'Calculator')}
              className="hover:text-sky-400 text-sky-300 transition-colors cursor-pointer whitespace-nowrap shrink-0 font-semibold"
            >
              Savings Calculator
            </button>
            <button
              onClick={() => handleNavClick('pricing', 'Pricing')}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Pricing & ROI
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <button
              onClick={() => {
                Analytics.ctaClicked('Schedule Consultation', 'Header');
                onScheduleClick();
              }}
              className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-all shadow-sm hover:shadow-sky-500/20 active:scale-[0.98] whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              Free Consultation
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-neutral-800 bg-neutral-950 px-5 pt-3 pb-6 space-y-3">
          <button
            onClick={() => handleNavClick('inefficiencies', 'Inefficiencies')}
            className="block w-full text-left py-2 text-base font-medium text-neutral-300 hover:text-white"
          >
            Where You Lose Money
          </button>
          <button
            onClick={() => handleNavClick('capabilities', 'Capabilities')}
            className="block w-full text-left py-2 text-base font-medium text-neutral-300 hover:text-white"
          >
            What We Do
          </button>
          <button
            onClick={() => handleNavClick('hawaii-advantage', 'Hawaii')}
            className="block w-full text-left py-2 text-base font-medium text-neutral-300 hover:text-white"
          >
            The Hawaii Advantage
          </button>
          <button
            onClick={() => handleNavClick('calculator', 'Calculator')}
            className="block w-full text-left py-2 text-base font-semibold text-sky-400"
          >
            Savings Calculator
          </button>
          <button
            onClick={() => handleNavClick('pricing', 'Pricing')}
            className="block w-full text-left py-2 text-base font-medium text-neutral-300 hover:text-white"
          >
            Pricing & ROI
          </button>
          <div className="pt-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                Analytics.ctaClicked('Schedule Consultation', 'Mobile_Menu');
                onScheduleClick();
              }}
              className="w-full py-3 text-center text-sm font-semibold uppercase tracking-wider text-neutral-950 bg-sky-400 rounded-md"
            >
              Free Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
