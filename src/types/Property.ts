export interface PropertyCalculationResults {
  loanAmount: number;
  monthlyMortgage: number;
  annualMortgage: number;

  grossRentAnnual: number;
  effectiveGrossIncome: number;

  totalOperatingExpenses: number;
  netOperatingIncome: number;

  capRate: number;
  annualCashFlow: number;
  monthlyCashFlow: number;

  cashInvested: number;
  cashOnCashReturn: number;
  principalPaydownYear1: number;
  equityGainYear1: number;
  roiYear1WithEquity: number;
}

export interface PropertyInput {
  address: string;
  status: string;
  showCalculations: boolean;
  purchasePrice?: number;
  downPayment?: number;
  loanAmount?: number;
  interestRate?: number;
  loanTermYears?: number;
  closingCosts?: number;
  rehabCosts?: number;
  monthlyRent?: number;
  taxesAnnual?: number;
  insuranceAnnual?: number;
  hoaMonthly?: number;
  maintenancePercent?: number;
  vacancyPercent?: number;
  propertyMgmtPercent?: number;
  utilitiesMonthly?: number;
  avmLow?: number;
  avmMid?: number;
  avmHigh?: number;
}

export interface PropertyByIdResponse {
  _id: string;
  address: string;
  status: string;
  showCalculations: boolean;
  purchasePrice?: number;
  downPayment?: number;
  loanAmount?: number;
  interestRate?: number;
  loanTermYears?: number;
  closingCosts?: number;
  rehabCosts?: number;
  monthlyRent?: number;
  taxesAnnual?: number;
  insuranceAnnual?: number;
  hoaMonthly?: number;
  maintenancePercent?: number;
  vacancyPercent?: number;
  propertyMgmtPercent?: number;
  utilitiesMonthly?: number;
  avmLow?: number;
  avmMid?: number;
  avmHigh?: number;
  __typename?: string;
}
export interface GetPropertyByIdResult {
  propertyById: PropertyByIdResponse | null;
}
export interface PropertyResponse {
  success: boolean;
  message: string;
}

export interface MyProperty {
  _id: string;
  address: string;
  status: string;
  showCalculations: boolean;
  avmMid?: number;
  netOperatingIncome?: number;
  annualCashFlow?: number;
  capRate?: number;
  cashOnCashReturn?: number;
  roiYear1WithEquity?: number;
}

export interface MyPropertiesData {
  myProperties: {
    edges: MyProperty[];
    pageInfo: {
      totalCount: number;
    };
  };
}

export interface PropertyAvmQueryResponse {
  propertyDetail: {
    id: string;
    avm: number;
    avmMin?: number;
    avmMax?: number;
    isCached?: boolean;
  } | null;
}

export interface PropertyAvmQueryVariables {
  address: string;
}
