import type { DscrFormValues, DscrResults } from "../types/Calculators";

export const defaultDscrValues: DscrFormValues = {
  purchasePrice: 0,
  downPayment: 0,
  interestRate: 0,
  loanTerm: 30,
  propertyTaxes: 0,
  insurance: 0,
  hoa: 0,
  monthlyRent: 0,
  vacancyRate: 5,
  propertyMgmt: 10,
  maintenance: 5,
};

const n = (val: unknown): number => {
  const num = Number(val);
  return Number.isFinite(num) ? num : 0;
};

export const calculateDscrResults = (data: DscrFormValues): DscrResults => {
  const purchasePrice = n(data.purchasePrice);
  const downPayment = n(data.downPayment);
  const interestRate = n(data.interestRate);
  const loanTerm = n(data.loanTerm);
  const propertyTaxes = n(data.propertyTaxes);
  const insurance = n(data.insurance);
  const hoa = n(data.hoa);
  const monthlyRent = n(data.monthlyRent);
  const vacancyRate = n(data.vacancyRate);
  const propertyMgmtPct = n(data.propertyMgmt);
  const maintenancePct = n(data.maintenance);

  const loanAmount = Math.max(0, purchasePrice - downPayment);

  let monthlyPi = 0;
  if (loanAmount > 0 && interestRate > 0 && loanTerm > 0) {
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    monthlyPi =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
  }

  const monthlyTaxes = propertyTaxes / 12;
  const monthlyInsurance = insurance / 12;
  const monthlyHoa = hoa;

  const monthlyPitia = monthlyPi + monthlyTaxes + monthlyInsurance + monthlyHoa;
  const effectiveMonthlyRent = monthlyRent * (1 - vacancyRate / 100);

  // DSCR uses gross market rent (lender underwriting convention), not vacancy-adjusted rent
  let dscr = 0;
  if (monthlyPitia > 0) {
    dscr = monthlyRent / monthlyPitia;
  } else if (monthlyPitia === 0 && monthlyRent > 0) {
    dscr = Infinity;
  }

  const monthlyCashFlow = effectiveMonthlyRent - monthlyPitia;
  // Opex reserves apply to gross market rent, matching convention used by other calculators
  const opexAmount = ((propertyMgmtPct + maintenancePct) / 100) * monthlyRent;
  const cashFlowAfterOpex = monthlyCashFlow - opexAmount;

  return {
    loanAmount,
    monthlyPi,
    monthlyTaxes,
    monthlyInsurance,
    monthlyHoa,
    monthlyPitia,
    effectiveMonthlyRent,
    dscr,
    monthlyCashFlow,
    cashFlowAfterOpex,
    opexAmount,
  };
};
