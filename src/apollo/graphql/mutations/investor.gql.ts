import { gql } from "@apollo/client";

export const CREATE_INVESTOR_PROFILE = gql`
  mutation CreateInvestorProfile($input: InvestorProfileInput!) {
    createInvestorProfile(input: $input) {
      success
      message
    }
  }
`;
