export interface RoiInputValues {
  purchasePrice: number;
  downPayment: number;
  closingCost: number;
  rehabCost: number;
  loanInterestRate: number;
  loanTerm: number;
  monthlyRentalIncome: number;
  vacancy: number;
  propertyTaxes: number;
  insurance: number;
  appreciationRate: number; // in percent
  maintenance: number;
}

export interface RoiResults {
  loanAmount: number;
  monthlyDebtService: number;
  annualDebtService: number;
  effectiveGrossIncome: number;
  totalOperatingExpenses: number;
  netOperatingIncome: number;
  capRate: number;
  annualCashFlow: number;
  monthlyCashFlow: number;
  grossRentAnnual: number;
  totalCashInvested: number;
  cashOnCashReturn: number;
  principalPaydownYear1: number;
  equityGainYear1: number;
  roiYear1WithEquity: number;
}

// Monthly mortgage (P&I) calculation
export const calculateMonthlyDebtService = (
  loanAmount: number,
  annualRate: number,
  termYears: number,
) => {
  const r = annualRate / 100 / 12; // monthly rate
  const n = termYears * 12; // total months
  if (r === 0) return loanAmount / n;
  return (loanAmount * r) / (1 - Math.pow(1 + r, -n));
};

// Principal paydown for the first year
export const calculatePrincipalPaydownYear1 = (
  loanAmount: number,
  annualRate: number,
  termYears: number,
) => {
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  const monthlyPayment =
    r === 0 ? loanAmount / n : (loanAmount * r) / (1 - Math.pow(1 + r, -n));

  let remainingBalance = loanAmount;
  let totalPrincipalPaid = 0;

  for (let month = 1; month <= 12; month++) {
    const interestPayment = remainingBalance * r;
    const principalPayment = monthlyPayment - interestPayment;
    totalPrincipalPaid += principalPayment;
    remainingBalance -= principalPayment;
  }

  return totalPrincipalPaid;
};

export const calculateRoi = (values: RoiInputValues): RoiResults => {
  const {
    purchasePrice,
    downPayment,
    closingCost,
    rehabCost = 0,
    loanInterestRate,
    loanTerm,
    monthlyRentalIncome,
    vacancy,
    propertyTaxes,
    insurance,
    maintenance,
    appreciationRate,
  } = values;

  // Loan calculations
  const loanAmount = purchasePrice - downPayment;
  const monthlyDebtService = calculateMonthlyDebtService(
    loanAmount,
    loanInterestRate,
    loanTerm,
  );
  const annualDebtService = monthlyDebtService * 12;

  // Effective Gross Income
  const grossRentAnnual = monthlyRentalIncome * 12;
  const vacancyLoss = (vacancy / 100) * grossRentAnnual;
  const EGI = grossRentAnnual - vacancyLoss;

  // Operating Expenses
  const managementFee = 0.08 * EGI; // property management 8%
  const totalOpEx = managementFee + propertyTaxes + insurance + maintenance;

  // NOI
  const NOI = EGI - totalOpEx;

  // Cap Rate
  const capRate = (NOI / purchasePrice) * 100;

  // Annual & Monthly Cash Flow
  const annualCashFlow = NOI - annualDebtService;
  const monthlyCashFlow = annualCashFlow / 12;

  // Total Cash Invested
  const totalCashInvested = downPayment + closingCost + rehabCost;

  // Cash-on-Cash Return
  const cashOnCashReturn = (annualCashFlow / totalCashInvested) * 100;

  // Principal paydown Year 1
  const principalPaydownYear1 = calculatePrincipalPaydownYear1(
    loanAmount,
    loanInterestRate,
    loanTerm,
  );

  const appreciationGain = purchasePrice * (appreciationRate / 100);
  const equityGainYear1 = principalPaydownYear1 + appreciationGain;

  // 1-Year ROI including equity gain
  const roiYear1WithEquity =
    ((annualCashFlow + equityGainYear1) / totalCashInvested) * 100;

  return {
    loanAmount,
    monthlyDebtService,
    annualDebtService,
    effectiveGrossIncome: EGI,
    totalOperatingExpenses: totalOpEx,
    netOperatingIncome: NOI,
    capRate,
    annualCashFlow,
    monthlyCashFlow,
    grossRentAnnual,
    totalCashInvested,
    cashOnCashReturn,
    principalPaydownYear1,
    equityGainYear1,
    roiYear1WithEquity,
  };
};
