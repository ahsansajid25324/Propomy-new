// schemas/roiCalculatorSchema.ts
import * as yup from "yup";

export const roiCalculatorSchema = yup.object().shape({
  purchasePrice: yup
    .number()
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
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Closing cost is required")
    .lessThan(
      yup.ref("purchasePrice"),
      "Closing cost must be less than purchase price",
    ),

  rehabCost: yup
    .number()
    .typeError("Rehab cost must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Rehab cost is required")
    .positive("Must be greater than 0"),

  loanInterestRate: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Interest rate is required")
    .positive("Must be greater than 0"),

  appreciationRate: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Appreciation rate is required")
    .positive("Must be greater than 0"),

  loanTerm: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Loan term is required")
    .positive("Must be greater than 0"),

  monthlyRentalIncome: yup
    .number()
    .typeError("Monthly rental income must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Monthly rental income is required")
    .positive("Must be greater than 0"),

  vacancy: yup
    .number()
    .typeError("Vacancy rate must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Vacancy rate is required")
    .positive("Must be greater than 0"),

  propertyTaxes: yup
    .number()
    .typeError("Property taxes must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Property taxes are required")
    .positive("Must be greater than 0"),

  insurance: yup
    .number()
    .typeError("Insurance must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Insurance is required")
    .positive("Must be greater than 0"),

  maintenance: yup
    .number()
    .typeError("Maintenance must be a number")
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === 0 ? undefined : value,
    )
    .required("Maintenance is required")
    .positive("Must be greater than 0"),
});
