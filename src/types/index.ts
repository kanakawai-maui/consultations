export interface CalculatorInputs {
  employees: number;
  hourlyCost: number;
  hoursPerWeek: number;
  automationPct: number;
  weeksPerYear: number;
  implementationCost: number;
}

export interface CalculatorOutputs {
  annualRepetitiveCost: number;
  annualSavings: number;
  monthlySavings: number;
  firstYearNetSavings: number;
  paybackPeriodMonths: number | null;
  paybackPeriodText: string;
  roiPercent: number | null;
  roiPercentText: string;
}

export interface InquiryFormData {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  island: string;
  industry: string;
  employeeCount: string;
  timeWasters: string;
  desiredImprovements: string;
  budgetRange: string;
  hp_company_field?: string;
  calculatorSummary?: {
    employees: number;
    hourlyCost: number;
    hoursPerWeek: number;
    automationPct: number;
    weeksPerYear: number;
    implementationCost: number;
    annualRepetitiveCost: number;
    annualSavings: number;
    monthlySavings: number;
    firstYearNetSavings: number;
    paybackPeriodText: string;
    roiPercentText: string;
  };
}

export type HawaiiIsland = 
  | 'Oahu'
  | 'Maui'
  | 'Hawaii Island (Big Island)'
  | 'Kauai'
  | 'Molokai'
  | 'Lanai';

export const HAWAII_ISLANDS: HawaiiIsland[] = [
  'Oahu',
  'Maui',
  'Hawaii Island (Big Island)',
  'Kauai',
  'Molokai',
  'Lanai',
];

export const BUSINESS_INDUSTRIES = [
  'Construction, Trades & Contracting',
  'Hospitality, Tourism & Vacation Rentals',
  'Healthcare, Clinics & Dental',
  'Wholesale, Logistics & Distribution',
  'Retail & E-commerce',
  'Professional Services & Accounting',
  'Agriculture, Food & Beverage Production',
  'Automotive & Marine Services',
  'Property Management & Real Estate',
  'Other Hawaii Business',
];
