import type {
  BrrrrFormValues,
  BrrrrResults,
  VerdictDetails,
} from "../types/Calculators";

export const defaultValues: BrrrrFormValues = {
  purchasePrice: 0,
  downPayment: 0,
  closingCost: 0,
  rehabBudget: 0,
  contingency: 0,
  rehabTimeline: 0,
  hardMoneyRate: 0,
  monthlyHoldingCosts: 0,
  monthlyRent: 0,
  vacancyRate: 0,
  propertyMgmt: 0,
  capexReserve: 0,
  insurance: 0,
  propertyTaxes: 0,
  arv: 0,
  lenderLtv: 75,
  refiInterestRate: 0,
  loanTerm: 30,
};

// Small helper: coerce anything (string, undefined, NaN) into a safe number
const n = (val: unknown): number => {
  const num = Number(val);
  return Number.isFinite(num) ? num : 0;
};

export const calculateMonthlyMortgage = (
  loanAmount: number,
  annualInterestRate: number,
  termYears: number,
): number => {
  loanAmount = n(loanAmount);
  annualInterestRate = n(annualInterestRate);
  termYears = n(termYears);

  if (loanAmount <= 0 || annualInterestRate <= 0 || termYears <= 0) return 0;

  const monthlyRate = annualInterestRate / 100 / 12;
  const totalPayments = termYears * 12;

  return (
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1)
  );
};

export const calculateNewLoanAmount = (
  arv: number,
  lenderLtv: number,
): number => {
  return (n(arv) * n(lenderLtv)) / 100;
};

export const calculateTotalHoldingCosts = (
  monthlyHoldingCosts: number,
  rehabTimeline: number,
): number => {
  return n(monthlyHoldingCosts) * n(rehabTimeline);
};

export const calculateBrrrrResults = (data: BrrrrFormValues): BrrrrResults => {
  // Coerce every field up front so downstream math never sees a string/NaN
  const purchasePrice = n(data.purchasePrice);
  const downPayment = n(data.downPayment);
  const closingCost = n(data.closingCost);
  const rehabBudget = n(data.rehabBudget);
  const contingency = n(data.contingency);
  const rehabTimeline = n(data.rehabTimeline);
  const monthlyHoldingCosts = n(data.monthlyHoldingCosts);
  const monthlyRent = n(data.monthlyRent);
  const vacancyRate = n(data.vacancyRate);
  const propertyMgmt = n(data.propertyMgmt);
  const capexReserve = n(data.capexReserve);
  const insurance = n(data.insurance);
  const propertyTaxes = n(data.propertyTaxes);
  const arv = n(data.arv);
  const lenderLtv = n(data.lenderLtv);
  const refiInterestRate = n(data.refiInterestRate);
  const loanTerm = n(data.loanTerm);

  // 1. Cash Invested Phase
  const rehabWithContingency = rehabBudget * (1 + contingency / 100);
  const totalHolding = calculateTotalHoldingCosts(
    monthlyHoldingCosts,
    rehabTimeline,
  );
  const totalCashInvested =
    downPayment + closingCost + rehabWithContingency + totalHolding;

  // 2. Refinance Proceeds Phase
  const cashPulledOut = calculateNewLoanAmount(arv, lenderLtv);
  const cashLeftInDeal = Math.max(0, totalCashInvested - cashPulledOut);

  // 3. Operations, Income & Expenses
  const annualGrossRent = monthlyRent * 12;
  const vacancyLoss = annualGrossRent * (vacancyRate / 100);
  const propMgmtCost = annualGrossRent * (propertyMgmt / 100);
  const capexCost = annualGrossRent * (capexReserve / 100);

  const totalOperatingExpenses =
    vacancyLoss + propMgmtCost + capexCost + insurance + propertyTaxes;

  // NOI can legitimately be negative (expenses > rent) — don't floor it at 0,
  // flooring was hiding real "this deal loses money" signals.
  const noi = annualGrossRent - totalOperatingExpenses;

  const totalAllInCost =
    purchasePrice + closingCost + rehabWithContingency + totalHolding;
  const equityCaptured = arv - totalAllInCost;
  const capRate = purchasePrice > 0 ? (noi / purchasePrice) * 100 : 0;

  // 4. Monthly Financing Obligations
  const monthlyMortgage = calculateMonthlyMortgage(
    cashPulledOut,
    refiInterestRate,
    loanTerm,
  );

  const monthlyOperatingIncome = monthlyRent - totalOperatingExpenses / 12;
  const monthlyCashFlow = monthlyOperatingIncome - monthlyMortgage;
  const annualCashFlow = monthlyCashFlow * 12;
  let cashOnCashReturn = 0;
  if (cashLeftInDeal > 0) {
    cashOnCashReturn = (annualCashFlow / cashLeftInDeal) * 100;
  } else if (cashLeftInDeal === 0 && annualCashFlow > 0) {
    cashOnCashReturn = Infinity; // Infinite return on $0 remaining capital
  } else if (cashLeftInDeal === 0 && annualCashFlow < 0) {
    cashOnCashReturn = -Infinity; // Infinite loss if operations lose money
  } else {
    cashOnCashReturn = 0;
  }
  const capitalRecycledPercent =
    totalCashInvested > 0 ? (cashPulledOut / totalCashInvested) * 100 : 0;

  return {
    noi,
    capRate,
    annualCashFlow,
    cashOnCashReturn,
    equityCaptured,
    cashLeftInDeal,
    totalCashInvested,
    cashPulledOut,
    newLoanAmount: cashPulledOut,
    monthlyMortgage,
    monthlyCashFlow,
    capitalRecycledPercent,
  };
};

export const getVerdictDetails = (percent: number): VerdictDetails => {
  if (percent >= 80)
    return {
      label: "Excellent (80%+ Capital Recycled)",
      color: "#2e7d32",
      bg: "#e8f5e9",
    };
  if (percent >= 60)
    return {
      label: "Moderate (60-79% Capital Recycled)",
      color: "#f57c00",
      bg: "#fff3e0",
    };
  return {
    label: "High Risk (Under 60% Capital Recycled)",
    color: "#c62828",
    bg: "#ffebee",
  };
};
