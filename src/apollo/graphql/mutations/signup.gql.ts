import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupFormDataInput!) {
    signup(input: $input) {
      success
      message
      user {
        user_id
        email
        firstName
        lastName
        role
      }
    }
  }
`;
export const UPDATE_PLAN_SELECTION = gql`
  mutation UpdatePlanSelection($input: UpdatePlanSelectionInput!) {
    updatePlanSelection(input: $input) {
      success
      message
      stripeUrl
    }
  }
`;

export const ACTIVATE_SUBSCRIPTION = gql`
  mutation ActivateSubscription($input: ActivateSubscriptionInput!) {
    activateSubscription(input: $input) {
      success
      message
      stripeUrl
    }
  }
`;

export const CANCEL_SUBSCRIPTION = gql`
  mutation CancelSubscription {
    cancelSubscription {
      success
      message
    }
  }
`;