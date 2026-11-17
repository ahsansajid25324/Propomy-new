import * as yup from "yup";
import type { ObjectSchema } from "yup";

export type Status = "Owned" | "UnderContract" | "Watchlist";

export type PropertyFormData = {
  address: string;
  status: string;
  showCalculations: boolean;
  purchasePrice: number | null;
  downPayment: number | null;
  loanAmount: number | null;
  interestRate: number | null;
  loanTermYears: number | null;
  closingCosts: number | null;
  rehabCosts: number | null;
  monthlyRent: number | null;
  taxesAnnual: number | null;
  insuranceAnnual: number | null;
  hoaMonthly: number | null;
  maintenancePercent: number | null;
  vacancyPercent: number | null;
  propertyMgmtPercent: number | null;
  utilitiesMonthly: number | null;
  avmLow?: number;
  avmMid?: number;
  avmHigh?: number;
};

const requiredIfChecked = (errorMessage: string, isPositive = true) => {
  const schema = yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .defined();

  return schema.when("showCalculations", {
    is: true,
    then: (s) => {
      const finalSchema = s.required(errorMessage);
      return isPositive
        ? finalSchema.positive("Value must be greater than 0")
        : finalSchema.min(0);
    },
    otherwise: (s) => s.notRequired(),
  });
};

export const propertySchema: ObjectSchema<PropertyFormData> = yup.object({
  address: yup.string().trim().required("Address is required"),
  status: yup
    .mixed<Status>()
    .oneOf(["Owned", "UnderContract", "Watchlist"])
    .required("Status is required"),

  showCalculations: yup.boolean().default(false),

  // --- FIELDS THAT MUST BE > 0 ---
  purchasePrice: requiredIfChecked("Purchase Price is required"),
  interestRate: requiredIfChecked("Interest Rate is required"),
  loanTermYears: requiredIfChecked("Loan Term is required"),
  monthlyRent: requiredIfChecked("Monthly Rent is required"),
  maintenancePercent: requiredIfChecked("Maintenance % is required").max(100),
  taxesAnnual: requiredIfChecked("Annual Taxes is required"),
  insuranceAnnual: requiredIfChecked("Annual Insurance is required"),

  // Note: downPayment/loanAmount usually allow 0 (for all-cash or 0-down deals)
  downPayment: requiredIfChecked("Down Payment is required", false),
  loanAmount: requiredIfChecked("Loan Amount is required", false),
  closingCosts: requiredIfChecked("Closing Costs is required", false),

  // --- THE SPECIFIC FIELDS THAT NOW ACCEPT 0 ---
  rehabCosts: requiredIfChecked("Rehab Costs is required", false),
  vacancyPercent: requiredIfChecked("Vacancy % is required", false).max(100),
  utilitiesMonthly: requiredIfChecked("Utilities is required", false),
  propertyMgmtPercent: requiredIfChecked(
    "Property Management % is required",
    false,
  ).max(100),
  hoaMonthly: requiredIfChecked("HOA is required", false),

  avmLow: yup.number().optional(),
  avmMid: yup.number().optional(),
  avmHigh: yup.number().optional(),
});
