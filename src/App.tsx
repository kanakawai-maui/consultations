/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WhereBusinessesLoseMoney } from './components/WhereBusinessesLoseMoney';
import { WhatWeDo } from './components/WhatWeDo';
import { HawaiiAdvantage } from './components/HawaiiAdvantage';
import { HowItWorks } from './components/HowItWorks';
import { CostSavingsCalculator } from './components/CostSavingsCalculator';
import { PricingSection } from './components/PricingSection';
import { InquiryForm } from './components/InquiryForm';
import { ClosingCta } from './components/ClosingCta';
import { Footer } from './components/Footer';
import { CalculatorInputs, CalculatorOutputs } from './types';

export default function App() {
  const [attachedCalculatorData, setAttachedCalculatorData] = useState<{
    inputs: CalculatorInputs;
    outputs: CalculatorOutputs;
  } | null>(null);

  const [preselectedBudgetRange, setPreselectedBudgetRange] = useState<string>('');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTransferCalculatorResults = (inputs: CalculatorInputs, outputs: CalculatorOutputs) => {
    setAttachedCalculatorData({ inputs, outputs });
    // Smooth scroll down to contact form
    scrollToSection('contact');
  };

  const handleSelectPricingTier = (tierName: string, estimatedRange: string) => {
    setPreselectedBudgetRange(`${estimatedRange} (${tierName.split('—')[0].trim()})`);
    scrollToSection('contact');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header onScheduleClick={() => scrollToSection('contact')} />

      <main className="flex-1">
        <Hero
          onCalculateClick={() => scrollToSection('calculator')}
          onConsultationClick={() => scrollToSection('contact')}
        />

        <WhereBusinessesLoseMoney />

        <WhatWeDo onConsultationClick={() => scrollToSection('contact')} />

        <HawaiiAdvantage />

        <HowItWorks onConsultationClick={() => scrollToSection('contact')} />

        <CostSavingsCalculator onTransferResults={handleTransferCalculatorResults} />

        <PricingSection
          onSelectTier={handleSelectPricingTier}
          calculatorMonthlySavings={attachedCalculatorData?.outputs.monthlySavings || 1800}
        />

        <InquiryForm
          attachedCalculatorData={attachedCalculatorData}
          onClearCalculatorData={() => setAttachedCalculatorData(null)}
          preselectedBudgetRange={preselectedBudgetRange}
        />

        <ClosingCta onConsultationClick={() => scrollToSection('contact')} />
      </main>

      <Footer />
    </div>
  );
}
