import { gql } from "@apollo/client";

export const GET_RECENT_VALUATIONS = gql`
  query GetRecentValuations($input: ValuationPaginationInput!) {
    recentValuations(input: $input) {
      edges {
        node {
          id
          propertyId
          propertyAddress
          predictedValue
          propertyDetails {
            address
            beds
            baths
            sqft
            zipCode
            estimatedValue
            yearBuilt
            propertyType
          }
          aiValuation {
            valuation
            lowEstimate
            highEstimate
            explanation
            featureSetVersion
            topFeatures {
              feature
              impact
            }
          }
        }
      }
      pageInfo {
        totalCount
      }
    }
  }
`;