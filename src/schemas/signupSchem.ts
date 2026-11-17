import type { InferType } from "yup";

import * as yup from "yup";

export const signupSchema = yup.object({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),

  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one digit")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    )
    .required("Password is required"),
  phone: yup
    .string()
    .notRequired()
    .matches(
      /^(\+1\s?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
      {
        message: "Enter a valid US/Canada phone number",
        excludeEmptyString: true,
      },
    ),
  role: yup.string().required("Please select a role"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State/Region is required"),
  heardAbout: yup.string().notRequired(),
  terms: yup
    .bool()
    .oneOf([true], "You must agree to the Terms of Service")
    .required(),
});

export type SignupFormData = InferType<typeof signupSchema>;
