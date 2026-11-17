import { gql } from "@apollo/client";

export const GET_USER_PROFILES = gql`
  query GetUserProfiles($pagination: ProfilePaginationInput!) {
    userProfiles(pagination: $pagination) {
      totalUsers
      paidUsers
      edges {
        cursor
        node {
          id
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
      pageInfo {
        totalCount
      }
    }
  }
`;

export const GET_WEEKLY_REPORTS = gql`
  query GetWeeklyReports {
    WeeklyReports {
      id
      windowStart
      windowEnd
      computedAt
      activated
      activationRate
      activePaidSubscribers
      cohortRevenueCents
      convertedFromPriorCohorts
      convertedInWindow
      schemaVersion
      signupsTotal
      stillFree
      totalNetRevenueCents
    }
  }
`;

export const GET_ACTIVATION_FUNNEL_METRICS = gql`
  query GetActivationFunnelMetrics($dateRangeDays: Int) {
    activationFunnelMetrics(dateRangeDays: $dateRangeDays) {
      dateRangeDays
      totalCohortUsers
      activatedUsersCount
      notYetActivatedUsersCount
      activationRatePercentage
      timeToFirstValuationMinutes {
        median
        p90
      }
      cohortTable {
        cohortWeek
        totalUsers
        week1Pct
        week2Pct
        week3Pct
        week4PlusPct
      }
      funnelSteps {
        stepKey
        label
        count
        conversionRatePct
        stepDropoffPct
        stuckUsers {
          id
          email
          createdAt
        }
      }
      calculatedAt
    }
  }
`;
