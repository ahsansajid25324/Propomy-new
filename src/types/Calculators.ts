export interface RoiCalculatorFormValues {
  purchasePrice: number;
  downPayment: number;
  closingCost: number;
  rehabCost: number;
  loanInterestRate: number;
  loanTerm: number;
  monthlyRentalIncome: number;
  vacancy: number;
  appreciationRate: number;
  propertyTaxes: number;
  insurance: number;
  maintenance: number;
}

export interface BrrrrFormValues {
  purchasePrice: number;
  downPayment: number;
  closingCost: number;
  rehabBudget: number;
  contingency: number;
  rehabTimeline: number;
  hardMoneyRate: number;
  monthlyHoldingCosts: number;
  monthlyRent: number;
  vacancyRate: number;
  propertyMgmt: number;
  capexReserve: number;
  insurance: number;
  propertyTaxes: number;
  arv: number;
  lenderLtv: number;
  refiInterestRate: number;
  loanTerm: number;
}

export interface BrrrrResults {
  noi: number;
  capRate: number;
  annualCashFlow: number;
  cashOnCashReturn: number;
  equityCaptured: number;
  cashLeftInDeal: number;
  totalCashInvested: number;
  cashPulledOut: number;
  newLoanAmount: number;
  monthlyMortgage: number;
  monthlyCashFlow: number;
  capitalRecycledPercent: number;
}

export interface VerdictDetails {
  label: string;
  color: string;
  bg: string;
}

export interface RentalFormValues {
  purchasePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  closingCost: number;
  monthlyRent: number;
  otherIncome: number;
  vacancyRate: number;
  propertyTaxes: number;
  insurance: number;
  hoa: number;
  propertyMgmt: number;
  maintenance: number;
  capexReserve: number;
  landlordUtilities: number;
}

export interface RentalResults {
  monthlyCashFlow: number;
  annualCashFlow: number;
  cashOnCashReturn: number;
  capRate: number;
  monthlyNoi: number;
  monthlyMortgage: number;
  totalCashIn: number;
  loanAmount: number;
  grossRentMultiplier: number;
  dscr: number;
}

export interface DscrFormValues {
  purchasePrice: number | "";
  downPayment: number | "";
  interestRate: number | "";
  loanTerm: number;
  propertyTaxes: number | "";
  insurance: number | "";
  hoa: number | "";
  monthlyRent: number | "";
  vacancyRate: number;
  propertyMgmt: number;
  maintenance: number;
}

export interface DscrResults {
  loanAmount: number;
  monthlyPi: number;
  monthlyTaxes: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  monthlyPitia: number;
  effectiveMonthlyRent: number;
  dscr: number;
  monthlyCashFlow: number;
  cashFlowAfterOpex: number;
  opexAmount: number;
}

export interface FixFlipFormValues {
  purchasePrice: number;
  downPayment: number;
  closingCosts: number;
  loanRate: number;
  loanPoints: number;
  rehabBudget: number;
  contingencyPct: number;
  rehabMonths: number;
  sellMonths: number;
  monthlyHolding: number;
  arv: number;
  sellingCostPct: number;
}

export interface FixFlipResults {
  holdMonths: number;
  rehabTotal: number;
  holdingTotal: number;
  loanAmount: number;
  financingCost: number;
  totalProjectCost: number;
  totalCashInvested: number;
  sellingCosts: number;
  totalProfit: number;
  roiPct: number;
  annualizedRoiPct: number;
  breakEvenSalePrice: number;
  mao: number;
}

export type ExpenseMode = "quick" | "detailed";

export interface CapRateGrmFormValues {
  purchasePrice: number;
  monthlyRent: number;
  vacancyRate: number;
  expenseRatio: number;
  propertyTaxes: number;
  insurance: number;
  propertyMgmtPct: number;
  maintenancePct: number;
  hoa: number;
  otherExpenses: number;
}

export interface CapRateGrmResults {
  grossAnnualRent: number;
  vacancyLoss: number;
  effectiveGrossIncome: number;
  totalOperatingExpenses: number;
  noi: number;
  capRate: number;
  grm: number;
  expenseRatioDisplay: number;
}
