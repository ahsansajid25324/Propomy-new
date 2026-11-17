import type { RentalFormValues, RentalResults } from "../types/Calculators";

export const defaultRentalValues: RentalFormValues = {
  purchasePrice: 0,
  downPayment: 25,
  interestRate: 0,
  loanTerm: 30,
  closingCost: 2.5,
  monthlyRent: 0,
  otherIncome: 0,
  vacancyRate: 5,
  propertyTaxes: 0,
  insurance: 0,
  hoa: 0,
  propertyMgmt: 8,
  maintenance: 5,
  capexReserve: 5,
  landlordUtilities: 0,
};

const n = (val: unknown): number => {
  const num = Number(val);
  return Number.isFinite(num) ? num : 0;
};

export const calculateRentalResults = (data: RentalFormValues): RentalResults => {
  const purchasePrice = n(data.purchasePrice);
  const downPaymentPct = n(data.downPayment);
  const interestRate = n(data.interestRate);
  const loanTerm = n(data.loanTerm);
  const closingCostPct = n(data.closingCost);
  const monthlyRent = n(data.monthlyRent);
  const otherIncome = n(data.otherIncome);
  const vacancyRate = n(data.vacancyRate);
  const propertyTaxes = n(data.propertyTaxes);
  const insurance = n(data.insurance);
  const hoa = n(data.hoa);
  const propertyMgmtPct = n(data.propertyMgmt);
  const maintenancePct = n(data.maintenance);
  const capexReservePct = n(data.capexReserve);
  const landlordUtilities = n(data.landlordUtilities);

  // Purchase Calculations
  const loanAmount = purchasePrice * (1 - downPaymentPct / 100);
  const downPaymentAmount = purchasePrice * (downPaymentPct / 100);
  const closingCostsAmount = purchasePrice * (closingCostPct / 100);
  const totalCashIn = downPaymentAmount + closingCostsAmount;

  // Income Calculations
  const grossPotentialRent = monthlyRent + otherIncome;
  const vacancyLoss = grossPotentialRent * (vacancyRate / 100);
  const effectiveGrossIncome = grossPotentialRent - vacancyLoss;

  // Expenses Calculations (Monthly bases)
  const monthlyTaxes = propertyTaxes / 12;
  const monthlyInsurance = insurance / 12;
  const propMgmtCost = grossPotentialRent * (propertyMgmtPct / 100);
  const maintenanceCost = grossPotentialRent * (maintenancePct / 100);
  const capexCost = grossPotentialRent * (capexReservePct / 100);

  const totalOperatingExpenses =
    monthlyTaxes +
    monthlyInsurance +
    hoa +
    propMgmtCost +
    maintenanceCost +
    capexCost +
    landlordUtilities;

  const monthlyNoi = effectiveGrossIncome - totalOperatingExpenses;

  // Mortgage P&I (Standard Amortization)
  let monthlyMortgage = 0;
  if (loanAmount > 0 && interestRate > 0 && loanTerm > 0) {
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    monthlyMortgage =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
  }

  // Final KPIs
  const monthlyCashFlow = monthlyNoi - monthlyMortgage;
  const annualCashFlow = monthlyCashFlow * 12;

  // Cash-on-Cash Return — guard the $0-cash-in edge case instead of
  // silently collapsing it to 0 (mirrors the BRRRR calculator fix).
  let cashOnCashReturn = 0;
  if (totalCashIn > 0) {
    cashOnCashReturn = (annualCashFlow / totalCashIn) * 100;
  } else if (totalCashIn === 0 && annualCashFlow > 0) {
    cashOnCashReturn = Infinity; // no cash left in the deal, still profitable
  } else if (totalCashIn === 0 && annualCashFlow < 0) {
    cashOnCashReturn = -Infinity; // no cash left in the deal, still losing money
  }

  const capRate = purchasePrice > 0 ? ((monthlyNoi * 12) / purchasePrice) * 100 : 0;

  // Gross Rent Multiplier — 0 annual rent should read as "undefined/worst
  // case", not as the best possible (lowest) GRM.
  const annualRent = monthlyRent * 12;
  let grossRentMultiplier = 0;
  if (annualRent > 0) {
    grossRentMultiplier = purchasePrice / annualRent;
  } else if (annualRent === 0 && purchasePrice > 0) {
    grossRentMultiplier = Infinity;
  }

  // DSCR — 0 mortgage (all-cash deal) should not read as "can't cover debt".
  let dscr = 0;
  if (monthlyMortgage > 0) {
    dscr = monthlyNoi / monthlyMortgage;
  } else if (monthlyMortgage === 0 && monthlyNoi > 0) {
    dscr = Infinity; // no debt service — fully covered by definition
  } else if (monthlyMortgage === 0 && monthlyNoi < 0) {
    dscr = -Infinity;
  }

  return {
    monthlyCashFlow,
    annualCashFlow,
    cashOnCashReturn,
    capRate,
    monthlyNoi,
    monthlyMortgage,
    totalCashIn,
    loanAmount,
    grossRentMultiplier,
    dscr,
  };
};