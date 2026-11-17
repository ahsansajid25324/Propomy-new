import * as yup from "yup";

export const rentalCalculatorSchema = yup.object().shape({
  purchasePrice: yup
    .number()
    .typeError("Purchase price must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Purchase price is required"),

  downPayment: yup
    .number()
    .typeError("Down payment must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .min(0, "Down payment cannot be negative")
    .max(75, "Down payment cannot exceed 75%")
    .required("Down payment is required"),

  interestRate: yup
    .number()
    .typeError("Interest rate must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Interest rate is required")
    .positive("Must be greater than 0"),

  loanTerm: yup
    .number()
    .typeError("Loan term must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Loan term is required")
    .positive("Must be greater than 0"),

  closingCost: yup
    .number()
    .typeError("Closing cost must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Closing cost is required")
    .positive("Must be greater than 0"),

  monthlyRent: yup
    .number()
    .typeError("Monthly rent must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Monthly rent is required")
    .positive("Must be greater than 0"),

  otherIncome: yup
    .number()
    .typeError("Other income must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Other income field is required")
    .positive("Must be greater than 0"),

  vacancyRate: yup
    .number()
    .typeError("Vacancy rate must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .min(0, "Vacancy rate cannot be negative")
    .max(100, "Vacancy rate cannot exceed 100%")
    .required("Vacancy rate is required")
    .positive("Must be greater than 0"),

  propertyTaxes: yup
    .number()
    .typeError("Property tax must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Property tax is required")
    .positive("Must be greater than 0"),

  insurance: yup
    .number()
    .typeError("Insurance must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Insurance is required")
    .positive("Must be greater than 0"),

  hoa: yup
    .number()
    .typeError("HOA must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("HOA field is required")
    .positive("Must be greater than 0"),

  propertyMgmt: yup
    .number()
    .typeError("Property management must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .min(0, "Property management cannot be negative")
    .max(100, "Property management cannot exceed 100%")
    .required("Property management is required")
    .positive("Must be greater than 0"),

  maintenance: yup
    .number()
    .typeError("Maintenance must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .min(0, "Maintenance cannot be negative")
    .max(100, "Maintenance cannot exceed 100%")
    .required("Maintenance is required")
    .positive("Must be greater than 0"),

  capexReserve: yup
    .number()
    .typeError("CapEx reserve must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .min(0, "CapEx reserve cannot be negative")
    .max(100, "CapEx reserve cannot exceed 100%")
    .required("CapEx reserve is required")
    .positive("Must be greater than 0"),

  landlordUtilities: yup
    .number()
    .typeError("Landlord utilities must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Landlord utilities field is required")
    .positive("Must be greater than 0"),
});
