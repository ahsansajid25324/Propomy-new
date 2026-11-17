import { gql } from "@apollo/client";

export const GET_MY_PROPERTIES = gql`
  query MyProperties($pagination: PropertyPaginationInput!) {
    myProperties(pagination: $pagination) {
      edges {
        _id
        address
        status
        showCalculations
        avmMid
        netOperatingIncome
        annualCashFlow
        capRate
        cashOnCashReturn
        roiYear1WithEquity
      }
      pageInfo {
        totalCount
      }
    }
  }
`;

export const GET_PROPERTY_BY_ID = gql`
  query GetPropertyById($id: ID!) {
    propertyById(id: $id) {
      _id
      address
      status
      showCalculations
      avmLow
      avmMid
      avmHigh
      purchasePrice
      downPayment
      loanAmount
      interestRate
      loanTermYears
      closingCosts
      rehabCosts
      monthlyRent
      taxesAnnual
      insuranceAnnual
      hoaMonthly
      maintenancePercent
      vacancyPercent
      propertyMgmtPercent
      utilitiesMonthly
    }
  }
`;
