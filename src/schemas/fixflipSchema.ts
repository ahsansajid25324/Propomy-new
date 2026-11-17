import * as yup from "yup";

export const fixFlipCalculatorSchema = yup.object().shape({
  purchasePrice: yup
    .number()
    .typeError("Purchase price must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Purchase price is required")
    .positive("Must be greater than 0"),

  downPayment: yup
    .number()
    .typeError("Down payment must be a number")
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .required("Down payment is required")
    .min(0, "Cannot be negative")
    .max(
      yup.ref("purchasePrice"),
      "Down payment cannot exceed the purchase price",
    ),

  closingCosts: yup
    .number()
    .typeError("Closing costs must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Closing costs are required")
    .min(0, "Cannot be negative")
    .positive("Must be greater than 0"),

  loanRate: yup
    .number()
    .typeError("Loan rate must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Loan rate is required")
    .min(0, "Cannot be negative")
    .positive("Must be greater than 0"),

  loanPoints: yup
    .number()
    .typeError("Loan points must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Loan points are required")
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100%")
    .positive("Must be greater than 0"),

  rehabBudget: yup
    .number()
    .typeError("Rehab budget must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Rehab budget is required")
    .min(0, "Cannot be negative")
    .positive("Must be greater than 0"),

  contingencyPct: yup
    .number()
    .typeError("Contingency must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Contingency is required")
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100%")
    .positive("Must be greater than 0"),

  rehabMonths: yup
    .number()
    .typeError("Rehab timeline must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Rehab timeline is required")
    .positive("Must be greater than 0"),

  sellMonths: yup
    .number()
    .typeError("Time to sell must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Time to sell is required")
    .positive("Must be greater than 0"),

  monthlyHolding: yup
    .number()
    .typeError("Monthly holding costs must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Monthly holding costs are required")
    .min(0, "Cannot be negative")
    .positive("Must be greater than 0"),

  arv: yup
    .number()
    .typeError("ARV must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("ARV is required")
    .positive("Must be greater than 0"),
  sellingCostPct: yup
    .number()
    .typeError("Selling cost % must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Selling cost % is required")
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100%")
    .positive("Must be greater than 0"),
});
