import * as yup from "yup";

export const capRateGrmCalculatorSchema = yup.object().shape({
  purchasePrice: yup
    .number()
    .typeError("Purchase price must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Purchase price is required")
    .positive("Must be greater than 0"),

  monthlyRent: yup
    .number()
    .typeError("Monthly rent must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Monthly rent is required")
    .positive("Must be greater than 0"),

  vacancyRate: yup
    .number()
    .typeError("Vacancy rate must be a number")
    .transform((value, originalValue) => {
      const normalized = String(originalValue).trim();
      return normalized === "" ? undefined : value;
    })
    .required("Vacancy rate is required")
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100%")
    .positive("Must be greater than 0"),

  expenseRatio: yup
    .number()
    .typeError("Expense ratio must be a number")
    .transform((value, originalValue) => {
      const normalized = String(originalValue).trim();
      return normalized === "" ? undefined : value;
    })
    .required("Expense ratio is required")
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100%")
    .positive("Must be greater than 0"),

  propertyTaxes: yup
    .number()
    .typeError("Property taxes must be a number")
    .transform((value, originalValue) => {
      const normalized = String(originalValue).trim();
      return normalized === "" ? undefined : value;
    })
    .required("Property taxes are required")
    .min(0, "Cannot be negative")
    .positive("Must be greater than 0"),

  insurance: yup
    .number()
    .typeError("Insurance must be a number")
    .transform((value, originalValue) => {
      const normalized = String(originalValue).trim();
      return normalized === "" ? undefined : value;
    })
    .required("Insurance is required")
    .min(0, "Cannot be negative")
    .positive("Must be greater than 0"),

  propertyMgmtPct: yup
    .number()
    .typeError("Property management must be a number")
    .transform((value, originalValue) => {
      const normalized = String(originalValue).trim();
      return normalized === "" ? undefined : value;
    })
    .required("Property management is required")
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100%")
    .positive("Must be greater than 0"),

  maintenancePct: yup
    .number()
    .typeError("Maintenance must be a number")
    .transform((value, originalValue) => {
      const normalized = String(originalValue).trim();
      return normalized === "" ? undefined : value;
    })
    .required("Maintenance is required")
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100%")
    .positive("Must be greater than 0"),

  hoa: yup
    .number()
    .typeError("HOA dues must be a number")
    .transform((value, originalValue) => {
      const normalized = String(originalValue).trim();
      return normalized === "" ? undefined : value;
    })
    .required("HOA dues are required")
    .positive("Must be greater than 0"),

  otherExpenses: yup
    .number()
    .typeError("Other expenses must be a number")
    .transform((value, originalValue) => {
      const normalized = String(originalValue).trim();
      return normalized === "" ? undefined : value;
    })
    .required("Other expenses are required")
    .positive("Must be greater than 0"),
});
