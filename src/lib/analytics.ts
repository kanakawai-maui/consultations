/**
 * Privacy-respecting analytics dispatcher.
 * Safely forwards custom business events to gtag or plausible if configured,
 * and logs to console in development.
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    plausible?: (eventName: string, options?: { props?: Record<string, any> }) => void;
  }
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  const isDev = import.meta.env.DEV;
  if (isDev) {
    console.log(`[ANALYTICS] ${eventName}`, properties || {});
  }

  // Google Analytics 4 (if configured)
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, properties);
  }

  // Plausible (if configured)
  if (typeof window.plausible === 'function') {
    window.plausible(eventName, { props: properties });
  }
}

export const Analytics = {
  calculatorInteracted: (field: string, value: number) => {
    trackEvent('calculator_interaction', { field, value });
  },
  calculatorCompleted: (annualSavings: number, roiText: string) => {
    trackEvent('calculator_completed', { annualSavings, roiText });
  },
  ctaClicked: (ctaName: string, location: string) => {
    trackEvent('cta_click', { ctaName, location });
  },
  pricingInteracted: (tierOrParam: string, value?: any) => {
    trackEvent('pricing_calculator_interaction', { tierOrParam, value });
  },
  inquirySubmitted: (businessName: string, island: string, hasCalculator: boolean) => {
    trackEvent('inquiry_form_submitted', { businessName, island, hasCalculator });
  },
};
