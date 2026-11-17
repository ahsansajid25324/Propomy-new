import * as yup from "yup";

export const validationSchema = yup.object().shape({
  address: yup
    .string()
    .required("Property address is required")
    .min(5, "Address seems too short"),
  strategy: yup.string().required("Deal type is required"),
  acqCost: yup
    .number()
    .typeError("Acquisition cost must be a number")
    .required("Acquisition cost is required")
    .positive("Must be a positive amount"),
  status: yup.string().required(),
  targetCloseDate: yup.string().nullable(),
  contactName: yup.string().notRequired(),
  contactPhone: yup.string().notRequired(),
  contactRole: yup.string().required(),
  contactEmail: yup
    .string()
    .email("Enter a valid email address")
    .required("Contact email is required"),
  notes: yup
    .string()
    .required("Notes are required")
    .min(10, "Notes should be at least 10 characters"),
});
