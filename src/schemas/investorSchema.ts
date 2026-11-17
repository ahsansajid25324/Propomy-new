import type { InferType } from "yup";

import * as yup from "yup";

export const detailsSchema = yup.object().shape({
  investorType: yup.string().required("Investor type is required"),
  experienceLevel: yup.string().required("Experience level is required"),
  investmentStrategy: yup
    .array()
    .of(yup.string().required())
    .min(1, "Select at least one strategy")
    .required("Select at least one strategy"),
  targetMarkets: yup.array().of(yup.string()).optional(),
  targetPropertyType: yup
    .array()
    .of(yup.string().required())
    .min(1, "Select at least one property type")
    .required("Select at least one property type"),
  budgetRange: yup.string().optional(),
  desiredROI: yup
    .string()
    .matches(/^(\d{1,2}(–\d{1,2})?%?|\d{1,2}%\+|Not Sure)$/, {
      message: "Enter a valid ROI",
      excludeEmptyString: true,
    })
    .optional(),
  propertiesOwned: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .typeError("Enter a valid number")
    .optional(),
  collaborateWithRealtors: yup.bool().default(false).optional(),
});

export type InvestorDetailsFormData = InferType<typeof detailsSchema>;
