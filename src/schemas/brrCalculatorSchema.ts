import * as yup from "yup";

export const brrrrCalculatorSchema = yup.object().shape({
  purchasePrice: yup
    .number()
    .typeError("Purchase price must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Purchase price is required")
    .moreThan(
      yup.ref("downPayment"),
      "Purchase price must be greater than down payment",
    ),

  downPayment: yup
    .number()
    .typeError("Down payment must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Down payment is required")
    .lessThan(
      yup.ref("purchasePrice"),
      "Down payment must be less than purchase price",
    ),

  closingCost: yup
    .number()
    .typeError("Closing cost must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Closing cost is required")
    .lessThan(
      yup.ref("purchasePrice"),
      "Closing cost must be less than purchase price",
    ),

  rehabBudget: yup
    .number()
    .typeError("Rehab budget must be a number")
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .required("Rehab budget is required")
    .positive("Must be greater than 0"),

  contingency: yup
    .number()
    .typeError("Contingency must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Contingency is required")
    .min(0, "Contingency cannot be negative")
    .max(100, "Contingency cannot exceed 100%")
    .positive("Must be greater than 0"),

  rehabTimeline: yup
    .number()
    .typeError("Rehab timeline must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Rehab timeline is required")
    .positive("Rehab timeline must be greater than 0")
    .positive("Must be greater than 0"),

  hardMoneyRate: yup
    .number()
    .typeError("Hard money rate must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Hard money rate is required")
    .positive("Must be greater than 0"),

  monthlyHoldingCosts: yup
    .number()
    .typeError("Monthly holding costs must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Monthly holding costs are required")
    .positive("Must be greater than 0"),

  // Rent & Expenses
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
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Vacancy rate is required")
    .min(0, "Vacancy rate cannot be negative")
    .max(100, "Vacancy rate cannot exceed 100%")
    .positive("Must be greater than 0"),

  propertyMgmt: yup
    .number()
    .typeError("Property management must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Property management is required")
    .min(0, "Property management cannot be negative")
    .max(100, "Property management cannot exceed 100%")
    .positive("Must be greater than 0"),

  capexReserve: yup
    .number()
    .typeError("CapEx reserve must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("CapEx reserve is required")
    .min(0, "CapEx reserve cannot be negative")
    .max(100, "CapEx reserve cannot exceed 100%")
    .positive("Must be greater than 0"),

  insurance: yup
    .number()
    .typeError("Insurance must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Insurance is required")
    .positive("Must be greater than 0"),

  propertyTaxes: yup
    .number()
    .typeError("Property taxes must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Property taxes are required")
    .positive("Must be greater than 0"),

  // Refinance
  arv: yup
    .number()
    .typeError("ARV must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("After repair value (ARV) is required")
    .positive("Must be greater than 0"),

  lenderLtv: yup
    .number()
    .typeError("Lender LTV must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Lender LTV is required")
    .min(0, "LTV cannot be negative")
    .max(100, "LTV cannot exceed 100%")
    .positive("Must be greater than 0"),

  refiInterestRate: yup
    .number()
    .typeError("Refi interest rate must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Refinance interest rate is required")
    .positive("Must be greater than 0"),

  loanTerm: yup
    .number()
    .typeError("Loan term must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Loan term is required")
    .positive("Must be greater than 0"),
});
