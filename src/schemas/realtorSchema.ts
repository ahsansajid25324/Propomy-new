import * as yup from "yup";

export const realtorDetailsSchema = yup.object().shape({
  brokerageName: yup.string().required("Brokerage Name is required"),
  licenseNumber: yup.string().required("License Number is required"),
  licenseState: yup
    .array()
    .of(yup.string().required())
    .compact()
    .min(1, "Select at least one state")
    .required("Select at least one state"),
  targetPropertyTypes: yup
    .array()
    .of(yup.string())
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .optional(),
  primaryMarketsServed: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one market"),
  clientFocus: yup.string().required("Client Focus is required"),
  averagePriceRange: yup
    .string()
    .required("Average Property Price Range is required"),
  preferredPropertyTypes: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one preferred property type"),
  activeListingsCount: yup
    .number()
    .typeError("Active Listings Count must be a number"),

  yearsOfExperience: yup.string().required("Years of Experience is required"),
});

export type RealtorDetailsFormData = yup.InferType<typeof realtorDetailsSchema>;
