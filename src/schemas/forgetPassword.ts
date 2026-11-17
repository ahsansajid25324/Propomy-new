import * as yup from "yup";

export const forgetPasswordSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});
