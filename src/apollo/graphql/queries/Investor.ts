import { gql } from "@apollo/client";

export const GET_USER_PROPERTY_STATS = gql`
  query UserPropertyStats {
    userPropertyStats {
      user
      totalProperties
      avgROI
      avgCapRate
      avgCashOnCashReturn
      savedProperties {
        address
        status
      }
      recentValuations {
        propertyId
        propertyAddress
        predictedValue
      }
      analyzingDealsCount
      negotiatingDealsCount
      offerMadeDealsCount
      underContractDealsCount
      closedDealsCount
      activePipelineValue
    }
  }
`;
