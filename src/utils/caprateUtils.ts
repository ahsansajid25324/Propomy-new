import type {
  CapRateGrmFormValues,
  CapRateGrmResults,
  ExpenseMode,
} from "../types/Calculators";

export const defaultCapRateGrmValues: CapRateGrmFormValues = {
  purchasePrice: 0,
  monthlyRent: 0,
  vacancyRate: 5,
  expenseRatio: 40,
  propertyTaxes: 0,
  insurance: 0,
  propertyMgmtPct: 8,
  maintenancePct: 5,
  hoa: 0,
  otherExpenses: 0,
};

export const defaultExpenseMode: ExpenseMode = "quick";

const n = (val: unknown): number => {
  const num = Number(val);
  return Number.isFinite(num) ? num : 0;
};

export const calculateCapRateGrmResults = (
  data: CapRateGrmFormValues,
  expenseMode: ExpenseMode,
): CapRateGrmResults => {
  const purchasePrice = n(data.purchasePrice);
  const monthlyRent = n(data.monthlyRent);
  const vacancyRate = n(data.vacancyRate);
  const expenseRatio = n(data.expenseRatio);
  const propertyTaxes = n(data.propertyTaxes);
  const insurance = n(data.insurance);
  const propertyMgmtPct = n(data.propertyMgmtPct);
  const maintenancePct = n(data.maintenancePct);
  const hoa = n(data.hoa);
  const otherExpenses = n(data.otherExpenses);

  const grossAnnualRent = monthlyRent * 12;
  const vacancyLoss = grossAnnualRent * (vacancyRate / 100);
  const effectiveGrossIncome = grossAnnualRent - vacancyLoss;

  let totalOperatingExpenses: number;

  if (expenseMode === "quick") {
    totalOperatingExpenses = grossAnnualRent * (expenseRatio / 100);
  } else {
    const propertyMgmtAmount = effectiveGrossIncome * (propertyMgmtPct / 100);
    const maintenanceAmount = grossAnnualRent * (maintenancePct / 100);
    totalOperatingExpenses =
      propertyTaxes +
      insurance +
      hoa +
      otherExpenses +
      propertyMgmtAmount +
      maintenanceAmount;
  }

  const noi = effectiveGrossIncome - totalOperatingExpenses;

  const capRate = purchasePrice > 0 ? (noi / purchasePrice) * 100 : 0;
  const grm = grossAnnualRent > 0 ? purchasePrice / grossAnnualRent : 0;
  const expenseRatioDisplay =
    grossAnnualRent > 0 ? (totalOperatingExpenses / grossAnnualRent) * 100 : 0;

  return {
    grossAnnualRent,
    vacancyLoss,
    effectiveGrossIncome,
    totalOperatingExpenses,
    noi,
    capRate,
    grm,
    expenseRatioDisplay,
  };
};
