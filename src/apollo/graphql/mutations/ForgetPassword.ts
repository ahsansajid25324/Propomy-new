import { gql } from "@apollo/client";

export const SEND_FORGET_PASSWORD = gql`
  mutation SendForgetPassword($email: String!) {
    sendForgotPasswordOtp(email: $email) {
      success
      message
    }
  }
`;