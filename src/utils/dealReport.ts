import type {
  PropertySnapshot,
  AvmEstimate,
  PurchaseTermsInput,
  ResolvedPurchaseTerms,
  InvestmentMetrics,
  BrrrrSnapshot,
  FixFlipMargin,
} from "../types/Reports";

const round = (value: number, decimals = 0): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

export const DEFAULT_DOWN_PAYMENT_PCT = 20;
export const DEFAULT_INTEREST_RATE_PCT = 7.1;
export const DEFAULT_LOAN_TERM_YEARS = 30;
export const DEFAULT_INSURANCE_PCT_OF_VALUE = 0.35;
export const DEFAULT_APPRECIATION_RATE_PCT = 3.5;
export const DEFAULT_RENT_PCT_OF_PRICE = 0.8;
export const BRRRR_REFI_LTV_PCT = 75;

export const calculateMonthlyPI = (
  loanAmount: number,
  annualRatePct: number,
  termYears: number,
): number => {
  if (loanAmount <= 0 || termYears <= 0) return 0;
  const monthlyRate = annualRatePct / 100 / 12;
  const numPayments = termYears * 12;
  if (monthlyRate === 0) return loanAmount / numPayments;
  return (
    (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments))
  );
};

/** Cumulative principal paid down over `monthsElapsed` months of an amortizing loan. */
export const calculateCumulativePrincipalPaydown = (
  loanAmount: number,
  annualRatePct: number,
  termYears: number,
  monthsElapsed: number,
): number => {
  if (loanAmount <= 0 || termYears <= 0 || monthsElapsed <= 0) return 0;
  const monthlyRate = annualRatePct / 100 / 12;
  const payment = calculateMonthlyPI(loanAmount, annualRatePct, termYears);

  if (monthlyRate === 0) {
    return Math.min(payment * monthsElapsed, loanAmount);
  }

  let remainingBalance = loanAmount;
  let totalPrincipalPaid = 0;
  const totalPayments = termYears * 12;
  const months = Math.min(monthsElapsed, totalPayments);

  for (let month = 1; month <= months; month++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = payment - interestPayment;
    totalPrincipalPaid += principalPayment;
    remainingBalance -= principalPayment;
  }

  return totalPrincipalPaid;
};

export const resolvePurchaseTerms = (
  input: PurchaseTermsInput,
  avm: AvmEstimate,
  subject: PropertySnapshot,
): ResolvedPurchaseTerms => {
  const assumptionsUsed: string[] = [];

  const purchasePrice = input.purchasePrice ?? avm.value ?? 0;
  if (input.purchasePrice === undefined) {
    assumptionsUsed.push("Purchase price defaulted to AVM estimate");
  }

  const downPaymentPct = input.downPaymentPct ?? DEFAULT_DOWN_PAYMENT_PCT;
  if (input.downPaymentPct === undefined) {
    assumptionsUsed.push(`${DEFAULT_DOWN_PAYMENT_PCT}% down (default)`);
  }

  const interestRatePct = input.interestRatePct ?? DEFAULT_INTEREST_RATE_PCT;
  if (input.interestRatePct === undefined) {
    assumptionsUsed.push(
      `${DEFAULT_INTEREST_RATE_PCT}% rate — current avg 30yr (default)`,
    );
  }

  const loanTermYears = input.loanTermYears ?? DEFAULT_LOAN_TERM_YEARS;
  if (input.loanTermYears === undefined) {
    assumptionsUsed.push(`${DEFAULT_LOAN_TERM_YEARS}yr term (default)`);
  }

  const appreciationRatePct =
    input.appreciationRatePct ?? DEFAULT_APPRECIATION_RATE_PCT;
  if (input.appreciationRatePct === undefined) {
    assumptionsUsed.push(
      `${DEFAULT_APPRECIATION_RATE_PCT}% annual appreciation (default — not currently user-editable)`,
    );
  }

  // Rent estimate with fallback assumption (0.8% of purchase price)
  let rentEstimateMonthly = input.rentEstimateMonthly ?? null;
  if (rentEstimateMonthly === null && purchasePrice > 0) {
    rentEstimateMonthly = round(
      purchasePrice * (DEFAULT_RENT_PCT_OF_PRICE / 100),
    );
    assumptionsUsed.push(
      `Rent estimated at ${DEFAULT_RENT_PCT_OF_PRICE}% of purchase price/mo (default — editable)`,
    );
  }

  let taxesInsuranceMonthly = input.taxesInsuranceMonthly ?? null;
  if (taxesInsuranceMonthly === null) {
    const monthlyTax = subject.annualTax ? subject.annualTax / 12 : null;
    const monthlyInsurance = purchasePrice
      ? (purchasePrice * (DEFAULT_INSURANCE_PCT_OF_VALUE / 100)) / 12
      : null;
    if (monthlyTax !== null || monthlyInsurance !== null) {
      taxesInsuranceMonthly = round(
        (monthlyTax ?? 0) + (monthlyInsurance ?? 0),
      );
      assumptionsUsed.push(
        "Taxes + insurance estimated from property tax record + rough insurance rate (default)",
      );
    }
  }

  const loanAmount = round(purchasePrice * (1 - downPaymentPct / 100));
  const monthlyPI = round(
    calculateMonthlyPI(loanAmount, interestRatePct, loanTermYears),
  );
  const estCashToClose = round(purchasePrice - loanAmount);

  return {
    purchasePrice,
    downPaymentPct,
    interestRatePct,
    loanTermYears,
    taxesInsuranceMonthly,
    rentEstimateMonthly,
    appreciationRatePct,
    loanAmount,
    monthlyPI,
    estCashToClose,
    assumptionsUsed,
  };
};

export const buildInvestmentMetrics = (
  terms: ResolvedPurchaseTerms,
): InvestmentMetrics => {
  if (!terms.rentEstimateMonthly) {
    return {
      capRatePct: null,
      grm: null,
      cashOnCashPct: null,
      roi1yrPct: null,
      roi5yrPct: null,
      dscr: null,
      monthlyNoi: null,
      monthlyCashFlow: null,
      rentDependentMetricsAvailable: false,
      unavailableReason:
        "Rent estimate unavailable for this address — rental-dependent calculations couldn't be completed.",
    };
  }

  const monthlyRent = terms.rentEstimateMonthly;
  const monthlyTaxesInsurance = terms.taxesInsuranceMonthly ?? 0;

  const monthlyNoi = round(monthlyRent - monthlyTaxesInsurance);
  const annualNoi = monthlyNoi * 12;
  const annualRent = monthlyRent * 12;

  const capRatePct =
    terms.purchasePrice > 0
      ? round((annualNoi / terms.purchasePrice) * 100, 2)
      : null;

  const grm =
    annualRent > 0 ? round(terms.purchasePrice / annualRent, 2) : null;

  const monthlyCashFlow = round(monthlyNoi - terms.monthlyPI);
  const annualCashFlow = monthlyCashFlow * 12;

  const cashOnCashPct =
    terms.estCashToClose > 0
      ? round((annualCashFlow / terms.estCashToClose) * 100, 2)
      : null;

  const dscr =
    terms.monthlyPI > 0 ? round(monthlyNoi / terms.monthlyPI, 2) : null;

  const principalPaydown1yr = calculateCumulativePrincipalPaydown(
    terms.loanAmount,
    terms.interestRatePct,
    terms.loanTermYears,
    12,
  );
  const principalPaydown5yr = calculateCumulativePrincipalPaydown(
    terms.loanAmount,
    terms.interestRatePct,
    terms.loanTermYears,
    60,
  );

  const appreciation1yr =
    terms.purchasePrice * (terms.appreciationRatePct / 100);
  const appreciation5yr =
    terms.purchasePrice *
    (Math.pow(1 + terms.appreciationRatePct / 100, 5) - 1);

  const roi1yrPct =
    terms.estCashToClose > 0
      ? round(
          ((annualCashFlow + principalPaydown1yr + appreciation1yr) /
            terms.estCashToClose) *
            100,
          1,
        )
      : null;

  const cumulativeCashFlow5yr = annualCashFlow * 5;
  const roi5yrPct =
    terms.estCashToClose > 0
      ? round(
          ((cumulativeCashFlow5yr + principalPaydown5yr + appreciation5yr) /
            terms.estCashToClose) *
            100,
          1,
        )
      : null;

  return {
    capRatePct,
    grm,
    cashOnCashPct,
    roi1yrPct,
    roi5yrPct,
    dscr,
    monthlyNoi,
    monthlyCashFlow,
    rentDependentMetricsAvailable: true,
    unavailableReason: null,
  };
};

export const buildBrrrrSnapshot = (
  terms: ResolvedPurchaseTerms,
  arv?: number | null,
): BrrrrSnapshot => {
  const hasValidArv =
    typeof arv === "number" && Number.isFinite(arv) && arv > 0;
  const usingPurchasePriceAsBasis = !hasValidArv;
  const refiBasis = hasValidArv ? arv : terms.purchasePrice;

  const refinanceLoanAmount = refiBasis
    ? round(refiBasis * (BRRRR_REFI_LTV_PCT / 100))
    : 0;
  const refiClearsExistingBalance = refinanceLoanAmount >= terms.loanAmount;
  const cashOutAvailable = refiClearsExistingBalance
    ? round(refinanceLoanAmount - terms.loanAmount)
    : 0;
  const cashLeftInDeal = refiClearsExistingBalance
    ? round(Math.max(terms.estCashToClose - cashOutAvailable, 0))
    : terms.estCashToClose;

  const baseNote = refiClearsExistingBalance
    ? "Cash-out available at current purchase terms."
    : "No cash-out available at current purchase terms — refinance loan doesn't clear the existing balance.";

  const note = usingPurchasePriceAsBasis
    ? `${baseNote} Based on purchase price — no after-repair value entered, so rehab-driven upside isn't reflected.`
    : baseNote;

  return {
    currentLoanBalance: terms.loanAmount,
    refinanceLoanAmount,
    cashLeftInDeal,
    cashOutAvailable,
    refiClearsExistingBalance,
    note,
  };
};

export const buildFixFlipMargin = (): FixFlipMargin => ({
  available: false,
  reason:
    "Rehab-cost estimation isn't in scope for this release, so flip margin can't be calculated responsibly yet — it depends entirely on renovation budget.",
  scope: "future",
});
