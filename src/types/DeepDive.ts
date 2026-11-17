export interface Overview {
  matchedAddress: string;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  yearBuilt: number | null;
  estimatedValue: number | null;
  estimatedValueRangeLow: number | null;
  estimatedValueRangeHigh: number | null;
  lastSaleAmount: number | null;
  lastSaleDate: string | null;
}

export interface ValuationModule {
  propertyData: {
    bedrooms: number | null;
    bathrooms: number | null;
    livingSqFt: number | null;
    zipcode: string | null;
    yearBuilt: number | null;
    propertyType: string | null;
  } | null;
  prediction: {
    valuation: number | null;
    prediction: number | null;
    low_estimate: number | null;
    high_estimate: number | null;
    explanation: string | null;
    quality_score: number | null;
    quality_tier: string | null;
    feature_set_version: string | null;
    model_version: string | null;
    geo_scope: string | null;
    source: string | null;
    top_features: { feature: string; impact: number }[] | null;
  } | null;
}

interface ComparableEntry {
  id: string;
  address: string;
  distanceMiles: number | null;
  saleDate: string | null;
  salePrice: number | null;
  pricePerSqft: number | null;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  yearBuilt: number | null;
  daysOnMarket: number | null;
  isStale: boolean | null;
  similarity: {
    total: number | null;
    distance: number | null;
    size: number | null;
    recency: number | null;
  } | null;
  adjustments: { label: string; amount: number; reason: string }[] | null;
  adjustedPrice: number | null;
}

export interface ComparablesModule {
  subject: {
    address: string;
    beds: number | null;
    baths: number | null;
    sqft: number | null;
    yearBuilt: number | null;
    lotAcres: number | null;
    lotSqft: number | null;
    pricePerSqftBaseline: number | null;
    latitude: number | null;
    longitude: number | null;
  } | null;
  comps: ComparableEntry[] | null;
  summary: {
    compsFound: number | null;
    medianPricePerSqft: number | null;
    avgPricePerSqft: number | null;
    suggestedRangeLow: number | null;
    suggestedRangeHigh: number | null;
  } | null;
  meta: {
    searchParamsUsed: {
      maxRadiusMiles: number | null;
      maxDaysBack: number | null;
    } | null;
    fallbackApplied: boolean | null;
    fallbackMessage: string | null;
    matchedAddress: string | null;
  } | null;
}

interface ContactPhone {
  number: string;
  type: string | null;
  confidenceRank: number | null;
  dncFlag: boolean | null;
  litigatorFlag: boolean | null;
  complianceNotes: string | null;
}

interface ContactEmail {
  email: string;
  confidenceRank: number | null;
}

interface PersonEntry {
  personId: string;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  age: number | null;
  gender: string | null;
  maritalStatus: string | null;
  occupation: string | null;
  isPrimaryOwnerMatch: boolean | null;
  currentAddress: string | null;
  previousAddress: string | null;
  phones: ContactPhone[] | null;
  emails: ContactEmail[] | null;
}

export interface OwnerContactModule {
  ownerIdentity: {
    name: string | null;
    isCorporateOrLLC: boolean | null;
    unwoundIndividualName: string | null;
    mailingAddress: string | null;
    ageRange: string | null;
    maritalStatus: string | null;
  } | null;
  contacts: {
    hasContactData: boolean | null;
    hasDncOrLitigatorWarning: boolean | null;
    identityUnverified: boolean | null;
    phones: ContactPhone[] | null;
    emails: ContactEmail[] | null;
  } | null;
  persons: PersonEntry[] | null;
  household: {
    relativesAndAssociates: string[] | string | null;
    lengthOfResidence: string | null;
  } | null;
}

export interface MortgageLienPosition {
  isPending: boolean | null;
  badgeMessage: string | null;
  note: string | null;
}

export interface MarketAreaModule {
  subjectAddress: string | null;
  snapshot: {
    medianListPrice: number | null;
    medianSalePrice: number | null;
    medianPricePerSqft: number | null;
    medianDaysOnMarket: number | null;
    sampleSize: number | null;
    isStatisticallyThin: boolean | null;
  } | null;
  trend: {
    direction: string | null;
    percentChange: number | null;
    currentPeriodMedian: number | null;
    priorPeriodMedian: number | null;
    summaryMessage: string | null;
  } | null;
  inventory: {
    activeListings: number | null;
    pendingListings: number | null;
    totalComparableInventory: number | null;
  } | null;
  demographics: {
    zip: string | null;
    population: number | null;
    households: number | null;
    medianHouseholdIncome: number | null;
    ownerOccupiedPercent: number | null;
    renterOccupiedPercent: number | null;
    isAvailable: boolean | null;
  } | null;
  meta: {
    matchedAddress: string | null;
    radiusMiles: number | null;
    schemaVersion: string | null;
    generatedAt: string | null;
    dataSources: string[] | null;
    dataGaps: string[] | null;
  } | null;
}

export interface DealAnalysisModule {
  subject: {
    address: string;
    beds: number | null;
    baths: number | null;
    sqft: number | null;
    yearBuilt: number | null;
    lotAcres: number | null;
    lastSaleAmount: number | null;
    lastSaleDate: string | null;
    annualTax: number | null;
  } | null;
  avm: {
    value: number | null;
    rangeLow: number | null;
    rangeHigh: number | null;
    confidence: number | null;
  } | null;
  compsSanityCheck: {
    compsUsed: number | null;
    medianPricePerSqft: number | null;
    avmPricePerSqft: number | null;
    percentDelta: number | null;
    withinTolerancePct: number | null;
    isWithinTolerance: boolean | null;
  } | null;
  meta: { matchedAddress: string | null; dataSources: string[] | null } | null;
}

export interface LienEntry {
  id: string;
  type: string | null;
  amount: number | null;
  filingDate: string | null;
  holder: string | null;
  status: string | null;
  isReleased: boolean | null;
}

export interface ActiveMortgageItem {
  amount: number | null;
  lenderName: string | null;
  position: string | null;
  loanType: string | null;
}
export interface DistressAndLienModule {
  subjectAddress: string | null;
  distressSummaryMessage: string | null;
  mortgage: {
    hasActiveMortgage: boolean | null;
    summaryMessage: string | null;
    lenderOrServicer: string | null;
    loanType: string | null;
    originationDate: string | null;
    originalLoanAmount: number | null;
    estimatedCurrentBalance: number | null;
    interestRate: number | null;
    hasSecondLienOrHeloc: boolean | null;
    estimatedEquity: number | null;
    ltv: number | null;
    currentMortgages: ActiveMortgageItem[] | null;
  } | null;
  foreclosure: {
    hasDistressIndicator: boolean | null;
    isPreForeclosureOrNod: boolean | null;
    auctionDate: string | null;
    hasAuctionPassed: boolean | null;
    auctionLocation: string | null;
    defaultAmount: number | null;
    trusteeOrAttorney: string | null;
  } | null;
  liens: LienEntry[] | null;
  meta: {
    matchedAddress: string | null;
    schemaVersion: string | null;
    generatedAt: string | null;
    dataSources: string[] | null;
  } | null;
}

export interface SourcesModule {
  entries:
    | {
        endpoint: string;
        module: string;
        status: string;
        note: string | null;
      }[]
    | null;
  pricing: {
    standaloneTotalCents: number | null;
    bundlePriceCents: number | null;
    savingsCents: number | null;
    savingsPercent: number | null;
  } | null;
}

export interface PropertyDeepDiveReportData {
  overview: Overview | null;
  valuation: ValuationModule | null;
  comparables: ComparablesModule | null;
  ownerContact: OwnerContactModule | null;
  mortgageLienPosition: MortgageLienPosition | null;
  marketArea: MarketAreaModule | null;
  dealAnalysis: DealAnalysisModule | null;
  distressAndLien: DistressAndLienModule | null;
  sources: SourcesModule | null;
  meta: {
    matchedAddress: string | null;
    schemaVersion: string | null;
    generatedAt: string | null;
  };
}

export interface GetPropertyDeepDiveReportData {
  getPropertyDeepDiveReport: {
    success: boolean;
    message: string | null;
    requiresPayment: boolean | null;
    stripeUrl: string | null;
    reportData: PropertyDeepDiveReportData | null;
  };
}

export interface GetPropertyDeepDiveReportVars {
  input: { address: string; sessionId: string };
}

export interface DeepDiveResultState {
  reportData?: PropertyDeepDiveReportData;
  address?: string;
  generatedAt?: string;
}

export type FetchStatus = "idle" | "loading" | "settled";
