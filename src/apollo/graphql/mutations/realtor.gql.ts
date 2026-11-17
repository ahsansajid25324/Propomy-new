import { gql } from "@apollo/client";

export const CREATE_REALTOR_PROFILE = gql`
  mutation CreateRealtorProfile($input: RealtorProfileInput!) {
    createRealtorProfile(input: $input) {
      success
      message
    }
  }
`;
