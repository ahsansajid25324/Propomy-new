import { gql } from "@apollo/client";

export const GET_MY_DEALS = gql`
  query MyDeals($pagination: DealPaginationInput!) {
    myDeals(pagination: $pagination) {
      edges {
        cursor
        node {
          id
          address
          location
          strategy
          acqCost
          status
          targetCloseDate
          contactName
          contactPhone
          contactRole
          contactEmail
          notes
          updatedAt
        }
      }
      pageInfo {
        totalCount
      }
      activeDealsCount
      underContractDealsCount
      activePipelineValue
      closedDealsCount
    }
  }
`;