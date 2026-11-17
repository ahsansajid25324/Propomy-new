import { gql } from "@apollo/client";

export const RESEND_VERIFICATION_EMAIL_MUTATION = gql`
  mutation ResendVerificationEmail($email: String!) {
    resendVerificationEmail(email: $email) {
      success
      message
    }
  }
`;
