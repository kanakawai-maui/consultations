import React from 'react';
import { Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 py-12 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <a href="/" className="text-base font-bold text-white tracking-tight block">
              Olelo Honua
            </a>
            <p className="text-neutral-400 max-w-md leading-relaxed">
              Business cost reduction, workflow automation, and custom software engineering built specifically for companies operating in Hawaii.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 text-neutral-300">
              <a
                href="mailto:rob@olelohonua.com"
                className="inline-flex items-center gap-1.5 hover:text-sky-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>rob@olelohonua.com</span>
              </a>
              <span className="hidden sm:inline text-neutral-700">&middot;</span>
              <div className="inline-flex items-center gap-1.5 text-neutral-400">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                <span>Serving Oahu, Maui, Big Island, Kauai, Molokai &amp; Lanai</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <span className="font-semibold text-neutral-200 uppercase tracking-wider block mb-3">
              Explore
            </span>
            <ul className="space-y-2">
              <li>
                <a href="#inefficiencies" className="hover:text-white transition-colors">
                  Where You Lose Money
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-white transition-colors">
                  What We Do
                </a>
              </li>
              <li>
                <a href="#hawaii-advantage" className="hover:text-white transition-colors">
                  The Hawaii Advantage
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-white transition-colors">
                  Savings Calculator
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing &amp; Project Tiers
                </a>
              </li>
            </ul>
          </div>

          {/* Engagement */}
          <div>
            <span className="font-semibold text-neutral-200 uppercase tracking-wider block mb-3">
              Action
            </span>
            <ul className="space-y-2">
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Schedule Free Consultation
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-white transition-colors">
                  Estimate Repetitive Labor Loss
                </a>
              </li>
              <li>
                <a href="mailto:rob@olelohonua.com" className="hover:text-white transition-colors">
                  Direct Inquiries (Rob Brown)
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 border-t border-neutral-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-400">
          <p>
            &copy; {currentYear} Olelo Honua. All rights reserved.
          </p>
          <p className="text-center sm:text-right">
            Practical AI &middot; Workflow Automation &middot; Custom Software
          </p>
        </div>
      </div>
    </footer>
  );
};
