import type { FixFlipFormValues, FixFlipResults } from "../types/Calculators";

export const defaultFixFlipValues: FixFlipFormValues = {
  purchasePrice: 0,
  downPayment: 0,
  closingCosts: 0,
  loanRate: 0,
  loanPoints: 0,
  rehabBudget: 0,
  contingencyPct: 10,
  rehabMonths: 3,
  sellMonths: 2,
  monthlyHolding: 0,
  arv: 0,
  sellingCostPct: 8,
};

const n = (val: unknown): number => {
  const num = Number(val);
  return Number.isFinite(num) ? num : 0;
};

export const calculateFixFlipResults = (data: FixFlipFormValues): FixFlipResults => {
  const purchasePrice = n(data.purchasePrice);
  const downPayment = n(data.downPayment);
  const closingCosts = n(data.closingCosts);
  const loanRate = n(data.loanRate);
  const loanPoints = n(data.loanPoints);
  const rehabBudget = n(data.rehabBudget);
  const contingencyPct = n(data.contingencyPct);
  const rehabMonths = n(data.rehabMonths);
  const sellMonths = n(data.sellMonths);
  const monthlyHolding = n(data.monthlyHolding);
  const arv = n(data.arv);
  const sellingCostPct = n(data.sellingCostPct);

  const holdMonths = rehabMonths + sellMonths;

  const rehabTotal = rehabBudget * (1 + contingencyPct / 100);

  const holdingTotal = monthlyHolding * holdMonths;

  const loanAmount = Math.max(0, purchasePrice - downPayment);

  // Interest-only across the full hold period (standard hard-money/bridge assumption)
  const financingCost =
    loanAmount * (loanRate / 100) * (holdMonths / 12) + loanAmount * (loanPoints / 100);

  const totalProjectCost = purchasePrice + closingCosts + rehabTotal + holdingTotal + financingCost;

  const totalCashInvested = totalProjectCost - loanAmount;

  const sellingCosts = arv * (sellingCostPct / 100);

  const totalProfit = arv - totalProjectCost - sellingCosts;

  // Guard against divide-by-zero for an all-cash-back-out or zero-cash-invested edge case
  const roiPct = totalCashInvested > 0 ? (totalProfit / totalCashInvested) * 100 : 0;

  const annualizedRoiPct = holdMonths > 0 ? roiPct / (holdMonths / 12) : 0;

  // Guard against a 100%+ selling cost input, which would otherwise divide by zero or go negative
  const breakEvenSalePrice =
    sellingCostPct < 100 ? totalProjectCost / (1 - sellingCostPct / 100) : totalProjectCost;

  const mao = arv * 0.7 - rehabTotal;

  return {
    holdMonths,
    rehabTotal,
    holdingTotal,
    loanAmount,
    financingCost,
    totalProjectCost,
    totalCashInvested,
    sellingCosts,
    totalProfit,
    roiPct,
    annualizedRoiPct,
    breakEvenSalePrice,
    mao,
  };
};