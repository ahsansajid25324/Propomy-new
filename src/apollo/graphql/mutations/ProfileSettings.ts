import { gql } from "@apollo/client";

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      success
      message
      logoutRequired
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($input: UpdatePasswordInput!) {
    updatePassword(input: $input) {
      success
      message
      logoutRequired
    }
  }
`;
