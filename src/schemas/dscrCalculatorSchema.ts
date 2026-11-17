import * as yup from "yup";

export const dscrCalculatorSchema = yup.object().shape({
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

  interestRate: yup
    .number()
    .typeError("Interest rate must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Interest rate is required")
    .positive("Must be greater than 0")
    .positive("Must be greater than 0"),

  loanTerm: yup
    .number()
    .typeError("Loan term must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Loan term is required")
    .positive("Must be greater than 0"),

  propertyTaxes: yup
    .number()
    .typeError("Property taxes must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Property taxes are required")
    .min(0, "Cannot be negative")
    .positive("Must be greater than 0"),

  insurance: yup
    .number()
    .typeError("Insurance must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Insurance is required")
    .min(0, "Cannot be negative")
    .positive("Must be greater than 0"),

  hoa: yup
    .number()
    .typeError("HOA dues must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("HOA dues are required")
    .min(0, "Cannot be negative")
    .positive("Must be greater than 0"),

  monthlyRent: yup
    .number()
    .typeError("Monthly rent must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Monthly rent is required")
    .min(0, "Cannot be negative")
    .positive("Must be greater than 0"),

  vacancyRate: yup
    .number()
    .typeError("Vacancy rate must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Vacancy rate is required")
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100%")
    .positive("Must be greater than 0"),

  propertyMgmt: yup
    .number()
    .typeError("Property management must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Property management is required")
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100%")
    .positive("Must be greater than 0"),

  maintenance: yup
    .number()
    .typeError("Maintenance reserve must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Maintenance reserve is required")
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100%")
    .positive("Must be greater than 0"),
});
