import * as yup from "yup";
export const ProfileSetting = yup
  .object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
  })
  .required();

export const ChangePassword = yup
  .object({
    currentPassword: yup.string().required("Current password is required"),
    newPassword: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one digit")
      .matches(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      )
      .required("New Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "Passwords must match")
      .required("Please confirm your password"),
  })
  .required();
