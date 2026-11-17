import { gql } from "@apollo/client";
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      success
      message
      user {
        firstName
        lastName
        email
        phone
        country
        state
        heardAbout
        role
        registrationStatus
        plan
        stripeSubscriptionId
        apiLimit
        subscriptionStartDate
        subscriptionEndDate
        cancelAtPeriodEnd
        subscriptionStatus
      }
    }
  }
`;
