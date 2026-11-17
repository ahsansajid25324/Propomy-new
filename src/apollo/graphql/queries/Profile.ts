import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query Me {
    me {
      firstName
      lastName
      email
      id
      phone
      country
      state
      heardAbout
      role
      apiLimit
      chatApiLimit
      subscriptionEndDate
      plan
      subscriptionStartDate
      stripeSubscriptionId
      subscriptionStatus
      cancelAtPeriodEnd
      exportCount
      registrationStatus
    }
  }
`;
