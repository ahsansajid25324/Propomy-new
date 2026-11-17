import { gql } from "@apollo/client";

export const GET_VALUATION_REPORT = gql`
  query GetValuationReport($input: ValuationReportInput!) {
    getValuationReport(input: $input) {
      success
      message
      requiresPayment
      stripeUrl
      propertyData {
        bedrooms
        bathrooms
        livingSqFt
        zipcode
        yearBuilt
        propertyType
      }
      prediction {
        valuation
        prediction
        low_estimate
        high_estimate
        explanation
        quality_score
        quality_tier
        feature_set_version
        model_version
        geo_scope
        source
        top_features {
          feature
          impact
        }
      }
    }
  }
`;

export const GET_OWNER_CONTACT_REPORT = gql`
  query GetOwnerContactReport($input: OwnerReportInput!) {
    getOwnerContactReport(input: $input) {
      success
      message
      requiresPayment
      stripeUrl
      reportData {
        ownerIdentity {
          name
          isCorporateOrLLC
          unwoundIndividualName
          mailingAddress
          ageRange
          maritalStatus
        }
        contacts {
          hasContactData
          hasDncOrLitigatorWarning
          identityUnverified
          phones {
            number
            type
            confidenceRank
            dncFlag
            litigatorFlag
            complianceNotes
          }
          emails {
            email
            confidenceRank
          }
        }
        persons {
          personId
          fullName
          firstName
          lastName
          age
          gender
          maritalStatus
          occupation
          isPrimaryOwnerMatch
          currentAddress
          previousAddress
          phones {
            number
            type
            confidenceRank
            dncFlag
            litigatorFlag
            complianceNotes
          }
          emails {
            email
            confidenceRank
          }
        }
        household {
          relativesAndAssociates
          lengthOfResidence
        }
      }
    }
  }
`;

export const GET_COMPARABLES_REPORT = gql`
  query GetComparablesReport($input: GetComparablesReportInput!) {
    getComparablesReport(input: $input) {
      success
      message
      requiresPayment
      stripeUrl
      reportData {
        subject {
          address
          beds
          baths
          sqft
          yearBuilt
          lotAcres
          lotSqft
          pricePerSqftBaseline
          latitude
          longitude
        }
        comps {
          id
          address
          distanceMiles
          saleDate
          salePrice
          pricePerSqft
          beds
          baths
          sqft
          yearBuilt
          daysOnMarket
          isStale
          similarity {
            total
            distance
            size
            recency
          }
          adjustments {
            label
            amount
            reason
          }
          adjustedPrice
        }
        summary {
          compsFound
          medianPricePerSqft
          avgPricePerSqft
          suggestedRangeLow
          suggestedRangeHigh
        }
        meta {
          searchParamsUsed {
            maxRadiusMiles
            maxDaysBack
          }
          fallbackApplied
          fallbackMessage
          matchedAddress
        }
      }
    }
  }
`;

export const GET_DEAL_ANALYSIS_REPORT = gql`
  query GetDealAnalysisReport($input: DealAnalysisReportInput!) {
    getDealAnalysisReport(input: $input) {
      success
      message
      requiresPayment
      stripeUrl
      reportData {
        subject {
          address
          beds
          baths
          sqft
          yearBuilt
          lotAcres
          lastSaleAmount
          lastSaleDate
          annualTax
          latitude
          longitude
        }
        avm {
          value
          rangeLow
          rangeHigh
          confidence
        }
        compsSanityCheck {
          compsUsed
          medianPricePerSqft
          avmPricePerSqft
          percentDelta
          withinTolerancePct
          isWithinTolerance
        }
        meta {
          matchedAddress
          dataSources
        }
      }
    }
  }
`;

export const GET_DEBT_POSITION_REPORT = gql`
  query GetDebtPositionReport($input: DebtPositionReportInput!) {
    getDebtPositionReport(input: $input) {
      success
      message
      requiresPayment
      stripeUrl
      reportData {
        subjectAddress
        distressSummaryMessage
        mortgage {
          hasActiveMortgage
          summaryMessage
          lenderOrServicer
          loanType
          originationDate
          originalLoanAmount
          estimatedCurrentBalance
          interestRate
          hasSecondLienOrHeloc
          estimatedEquity
          ltv
          currentMortgages {
            amount
            lenderName
            position
            loanType
          }
        }
        foreclosure {
          hasDistressIndicator
          isPreForeclosureOrNod
          auctionDate
          hasAuctionPassed
          auctionLocation
          defaultAmount
          trusteeOrAttorney
        }
        liens {
          id
          type
          amount
          filingDate
          holder
          status
          isReleased
        }
        meta {
          matchedAddress
          schemaVersion
          generatedAt
          dataSources
        }
      }
    }
  }
`;
export const GET_MARKET_AREA_REPORT = gql`
  query GetMarketAreaReport($input: MarketAreaReportInput!) {
    marketAreaReport(input: $input) {
      success
      message
      requiresPayment
      stripeUrl
      reportData {
        subjectAddress
        snapshot {
          medianListPrice
          medianSalePrice
          medianPricePerSqft
          medianDaysOnMarket
          sampleSize
          isStatisticallyThin
        }
        trend {
          direction
          percentChange
          currentPeriodMedian
          priorPeriodMedian
          summaryMessage
        }
        inventory {
          activeListings
          pendingListings
          totalComparableInventory
        }
        demographics {
          zip
          population
          households
          medianHouseholdIncome
          ownerOccupiedPercent
          renterOccupiedPercent
          isAvailable
        }
        meta {
          matchedAddress
          radiusMiles
          centroid {
            latitude
            longitude
          }
          schemaVersion
          generatedAt
          dataSources
          dataGaps
        }
      }
    }
  }
`;

export const GET_PROPERTY_DEEP_DIVE_REPORT = gql`
  query GetPropertyDeepDiveReport($input: PropertyDeepDiveReportInput!) {
    getPropertyDeepDiveReport(input: $input) {
      success
      message
      requiresPayment
      stripeUrl
      reportData {
        overview {
          matchedAddress
          beds
          baths
          sqft
          yearBuilt
          estimatedValue
          estimatedValueRangeLow
          estimatedValueRangeHigh
          lastSaleAmount
          lastSaleDate
        }
        valuation {
          propertyData {
            bedrooms
            bathrooms
            livingSqFt
            zipcode
            yearBuilt
            propertyType
          }
          prediction {
            valuation
            prediction
            low_estimate
            high_estimate
            explanation
            quality_score
            quality_tier
            feature_set_version
            model_version
            geo_scope
            source
            top_features {
              feature
              impact
            }
          }
        }
        comparables {
          subject {
            address
            beds
            baths
            sqft
            yearBuilt
            lotAcres
            lotSqft
            pricePerSqftBaseline
            latitude
            longitude
          }
          comps {
            id
            address
            distanceMiles
            saleDate
            salePrice
            pricePerSqft
            beds
            baths
            sqft
            yearBuilt
            daysOnMarket
            isStale
            similarity {
              total
              distance
              size
              recency
            }
            adjustments {
              label
              amount
              reason
            }
            adjustedPrice
          }
          summary {
            compsFound
            medianPricePerSqft
            avgPricePerSqft
            suggestedRangeLow
            suggestedRangeHigh
          }
          meta {
            searchParamsUsed {
              maxRadiusMiles
              maxDaysBack
            }
            fallbackApplied
            fallbackMessage
            matchedAddress
          }
        }
        ownerContact {
          ownerIdentity {
            name
            isCorporateOrLLC
            unwoundIndividualName
            mailingAddress
            ageRange
            maritalStatus
          }
          contacts {
            hasContactData
            hasDncOrLitigatorWarning
            identityUnverified
            phones {
              number
              type
              confidenceRank
              dncFlag
              litigatorFlag
              complianceNotes
            }
            emails {
              email
              confidenceRank
            }
          }
          persons {
            personId
            fullName
            firstName
            lastName
            age
            gender
            maritalStatus
            occupation
            isPrimaryOwnerMatch
            currentAddress
            previousAddress
            phones {
              number
              type
              confidenceRank
              dncFlag
              litigatorFlag
              complianceNotes
            }
            emails {
              email
              confidenceRank
            }
          }
          household {
            relativesAndAssociates
            lengthOfResidence
          }
        }
        mortgageLienPosition {
          isPending
          badgeMessage
          note
        }
        marketArea {
          subjectAddress
          snapshot {
            medianListPrice
            medianSalePrice
            medianPricePerSqft
            medianDaysOnMarket
            sampleSize
            isStatisticallyThin
          }
          trend {
            direction
            percentChange
            currentPeriodMedian
            priorPeriodMedian
            summaryMessage
          }
          inventory {
            activeListings
            pendingListings
            totalComparableInventory
          }
          demographics {
            zip
            population
            households
            medianHouseholdIncome
            ownerOccupiedPercent
            renterOccupiedPercent
            isAvailable
          }
          meta {
            matchedAddress
            radiusMiles
            centroid {
              latitude
              longitude
            }
            schemaVersion
            generatedAt
            dataSources
            dataGaps
          }
        }
        dealAnalysis {
          subject {
            address
            beds
            baths
            sqft
            yearBuilt
            lotAcres
            lastSaleAmount
            lastSaleDate
            annualTax
            latitude
            longitude
          }
          avm {
            value
            rangeLow
            rangeHigh
            confidence
          }
          compsSanityCheck {
            compsUsed
            medianPricePerSqft
            avmPricePerSqft
            percentDelta
            withinTolerancePct
            isWithinTolerance
          }
          meta {
            matchedAddress
            dataSources
          }
        }
        distressAndLien {
          subjectAddress
          distressSummaryMessage
          mortgage {
            hasActiveMortgage
            summaryMessage
            lenderOrServicer
            loanType
            originationDate
            originalLoanAmount
            estimatedCurrentBalance
            interestRate
            hasSecondLienOrHeloc
            estimatedEquity
            ltv
            currentMortgages {
              amount
              lenderName
              position
              loanType
            }
          }
          foreclosure {
            hasDistressIndicator
            isPreForeclosureOrNod
            auctionDate
            hasAuctionPassed
            auctionLocation
            defaultAmount
            trusteeOrAttorney
          }
          liens {
            id
            type
            amount
            filingDate
            holder
            status
            isReleased
          }
          meta {
            matchedAddress
            schemaVersion
            generatedAt
            dataSources
          }
        }
        sources {
          entries {
            endpoint
            module
            status
            note
          }
          pricing {
            standaloneTotalCents
            bundlePriceCents
            savingsCents
            savingsPercent
          }
        }
        meta {
          matchedAddress
          schemaVersion
          generatedAt
        }
      }
    }
  }
`;
