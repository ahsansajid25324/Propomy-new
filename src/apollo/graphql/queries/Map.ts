import { gql } from "@apollo/client";

export const GET_MAP_PINS_QUERY = gql`
  query GetMapPins(
    $address: String!
    $resultIndex: Int
    $radius: Int
    $propertyTypes: [String!]
    $beds: [Int!]
    $absenteeOwner: Boolean
    $cashBuyer: Boolean
    $corporateOwned: Boolean
    $highEquity: Boolean
  ) {
    getMapPins(
      address: $address
      resultIndex: $resultIndex
      radius: $radius
      propertyTypes: $propertyTypes
      beds: $beds
      absenteeOwner: $absenteeOwner
      cashBuyer: $cashBuyer
      corporateOwned: $corporateOwned
      highEquity: $highEquity
    ) {
      resultIndex
      resultCount
      isCached
      data {
        id
        latitude
        longitude
      }
      exactMatchDetail {
        id
        estimatedValue
      }
    }
  }
`;

export const GET_COMPLETE_PROPERTY_DETAIL = gql`
  query GetCompletePropertyDetail($id: ID, $address: String) {
    propertyDetail(id: $id, address: $address) {
      id
      estimatedValue
      bathrooms
      bedrooms
      isCached
      yearBuilt
      heatingType
      basementType
      buildingSquareFeet
      livingSquareFeet
      lotInfo
      lotWidthFeet
      lotNumber
      apn
      propertyClass
      propertyUse
      zoning
      landUse
      addressLabel
      owner
      ownerSecond
      porchType
      stories
      currentMortgageAmountSum
      zipCode
      equity
      equityPercentage
      roundedAverageCompValue
      avm
      avmMin
      avmMax
      taxInfo {
        assessedImprovementValue
        assessedLandValue
        assessedValue
        assessmentYear
        estimatedValue
        marketImprovementValue
        marketLandValue
        marketValue
        propertyId
        taxAmount
        year
      }
      currentMortgages {
        amount
      }
    }
  }
`;

export const GET_VALUATION_PROPERTY_DETAIL = gql`
  query GetCompletePropertyDetail($id: ID, $address: String) {
    propertyDetail(id: $id, address: $address) {
      id
      estimatedValue
      bathrooms
      isCached
      bedrooms
      livingSquareFeet
      zipCode
      yearBuilt
      landUse
      equity
      equityPercentage
      roundedAverageCompValue
    }
  }
`;

export const GET_PROPERTY_AVM_DETAIL = gql`
  query GetPropertyAvmDetail($address: String!) {
    propertyDetail(address: $address) {
      id
      avm
      isCached
      avmMin
      avmMax
    }
  }
`;
