export interface PropertyDetailSummary {
  bedrooms: number | null;
  bathrooms: number | null;
  livingSqFt: number | null;
  zipcode: string | null;
  yearBuilt: number | null;
  propertyType: string | null;
}

export interface ReportTopFeature {
  feature: string;
  impact: number;
}

export interface PredictionData {
  valuation: number | null;
  prediction: number | null;
  low_estimate: number | null;
  high_estimate: number | null;
  explanation: string | null;
  quality_score: number | null;
  quality_tier: string | null;
  feature_set_version: string;
  model_version: string | null;
  geo_scope: string | null;
  source: string;
  top_features: ReportTopFeature[] | null;
}

export interface ValuationReportResponse {
  success: boolean;
  message?: string | null;
  requiresPayment?: boolean | null;
  stripeUrl?: string | null;
  propertyData?: PropertyDetailSummary | null;
  prediction?: PredictionData | null;
}

export interface GetValuationReportData {
  getValuationReport: ValuationReportResponse;
}

export interface GetValuationReportVars {
  input: {
    address: string;
    sessionId?: string | null;
  };
}

export interface ValuationResultState {
  address: string;
  propertyData: PropertyDetailSummary | null;
  prediction: PredictionData | null;
  generatedAt: string;
}

export interface OwnerReportInput {
  address: string;
  sessionId?: string;
}
export interface RankedPhone {
  number: string;
  type?: string;
  confidenceRank: number;
  dncFlag: boolean;
  litigatorFlag: boolean;
  complianceNotes: string[];
}

export interface RankedEmail {
  email: string;
  confidenceRank: number;
}

export interface PersonRecord {
  personId: string;
  fullName: string;
  firstName?: string | null;
  lastName?: string | null;
  age?: string | null;
  gender?: string | null;
  maritalStatus?: string | null;
  occupation?: string | null;
  isPrimaryOwnerMatch: boolean;
  currentAddress?: string | null;
  previousAddress?: string | null;
  phones: RankedPhone[];
  emails: RankedEmail[];
}

export interface OwnerContactReportData {
  ownerIdentity: {
    name: string;
    isCorporateOrLLC: boolean;
    unwoundIndividualName?: string | null;
    mailingAddress?: string | null;
    ageRange?: string | null;
    maritalStatus?: string | null;
  };
  contacts: {
    phones: RankedPhone[];
    emails: RankedEmail[];
    hasDncOrLitigatorWarning: boolean;
    hasContactData: boolean;
    identityUnverified: boolean;
  };
  persons: PersonRecord[];
  household: {
    relativesAndAssociates: string[];
    lengthOfResidence?: string | null;
  };
}

export interface OwnerContactReportResponse {
  success: boolean;
  message: string;
  requiresPayment?: boolean;
  stripeUrl?: string | null;
  reportData?: OwnerContactReportData | null;
}

export interface GetOwnerContactReportData {
  getOwnerContactReport: OwnerContactReportResponse;
}

export interface GetOwnerContactReportVars {
  input: {
    address: string;
    sessionId?: string | null;
  };
}

export interface OwnerResultState {
  address?: string;
  reportData?: OwnerContactReportData;
  generatedAt?: string;
}

export interface SubjectSnapshot {
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
}

export interface CompAdjustment {
  label: string;
  amount: number;
  reason: string;
}

export interface SimilarityBreakdown {
  total: number;
  distance: number;
  size: number;
  recency: number;
}

export interface ComparableProperty {
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
  isStale: boolean;
  similarity: SimilarityBreakdown;
  adjustments: CompAdjustment[];
  adjustedPrice: number | null;
}

export interface ComparablesSummary {
  compsFound: number;
  medianPricePerSqft: number | null;
  avgPricePerSqft: number | null;
  suggestedRangeLow: number | null;
  suggestedRangeHigh: number | null;
}

export interface ComparablesMeta {
  searchParamsUsed: {
    maxRadiusMiles: number;
    maxDaysBack: number;
  };
  fallbackApplied: boolean;
  fallbackMessage: string | null;
  matchedAddress: string;
}

export interface ComparablesReportData {
  subject: SubjectSnapshot;
  comps: ComparableProperty[];
  summary: ComparablesSummary;
  meta: ComparablesMeta;
}

export interface ComparablesReportResponse {
  success: boolean;
  message: string;
  requiresPayment?: boolean | null;
  stripeUrl?: string | null;
  reportData?: ComparablesReportData | null;
}

export interface GetComparablesReportData {
  getComparablesReport: ComparablesReportResponse;
}

export interface GetComparablesReportInput {
  address: string;
  sessionId?: string | null;
}

export interface GetComparablesReportVars {
  input: GetComparablesReportInput;
}
export interface PropertySnapshot {
  address: string;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  yearBuilt: number | null;
  lotAcres: number | null;
  lastSaleAmount: number | null;
  lastSaleDate: string | null;
  annualTax: number | null;
  latitude: number | null;
  longitude: number | null;
}

export interface AvmEstimate {
  value: number | null;
  rangeLow: number | null;
  rangeHigh: number | null;
  confidence: number | null;
}

export interface CompsSanityCheck {
  compsUsed: number;
  medianPricePerSqft: number | null;
  avmPricePerSqft: number | null;
  percentDelta: number | null;
  withinTolerancePct: number;
  isWithinTolerance: boolean;
}

export interface PurchaseTermsInput {
  purchasePrice?: number;
  downPaymentPct?: number;
  interestRatePct?: number;
  loanTermYears?: number;
  taxesInsuranceMonthly?: number;
  rentEstimateMonthly?: number;
  appreciationRatePct?: number;
}

export interface ResolvedPurchaseTerms {
  purchasePrice: number;
  downPaymentPct: number;
  interestRatePct: number;
  loanTermYears: number;
  taxesInsuranceMonthly: number | null;
  rentEstimateMonthly: number | null;
  appreciationRatePct: number;
  loanAmount: number;
  monthlyPI: number;
  estCashToClose: number;
  assumptionsUsed: string[];
}

export interface InvestmentMetrics {
  capRatePct: number | null;
  grm: number | null;
  cashOnCashPct: number | null;
  roi1yrPct: number | null;
  roi5yrPct: number | null;
  dscr: number | null;
  monthlyNoi: number | null;
  monthlyCashFlow: number | null;
  rentDependentMetricsAvailable: boolean;
  unavailableReason: string | null;
}

export interface BrrrrSnapshot {
  currentLoanBalance: number;
  refinanceLoanAmount: number;
  cashLeftInDeal: number;
  cashOutAvailable: number;
  refiClearsExistingBalance: boolean;
  note: string;
}

export interface FixFlipMargin {
  available: false;
  reason: string;
  scope: "future";
}

export interface DealAnalysisReportData {
  subject: PropertySnapshot;
  avm: AvmEstimate;
  compsSanityCheck: CompsSanityCheck;
  meta: {
    matchedAddress: string;
    dataSources: string[];
  };
}

export interface DealAnalysisReportResponse {
  success: boolean;
  message: string;
  reportData?: DealAnalysisReportData | null;
  stripeUrl?: string | null;
  requiresPayment?: boolean;
}

export interface DealAnalysisReportInput {
  address: string;
  sessionId?: string;
}

export interface GetDealAnalysisReportData {
  getDealAnalysisReport: DealAnalysisReportResponse;
}

export interface GetDealAnalysisReportVars {
  input: DealAnalysisReportInput;
}

// ==========================================
// DEBT POSITION REPORT FRONTEND TYPES
// ==========================================

export type LienType = "TAX" | "HOA" | "JUDGMENT" | "MECHANIC" | "OTHER";

export type LienStatus = "OPEN" | "RELEASED";

export interface ActiveMortgageItem {
  amount?: number | null;
  lenderName?: string | null;
  position?: string | null;
  loanType?: string | null;
}
export interface MortgagePosition {
  hasActiveMortgage: boolean;
  summaryMessage?: string | null;
  lenderOrServicer?: string | null;
  loanType?: string | null;
  originationDate?: string | null;
  originalLoanAmount?: number | null;
  estimatedCurrentBalance?: number | null;
  interestRate?: number | null;
  hasSecondLienOrHeloc: boolean;
  estimatedEquity?: number | null;
  ltv?: number | null;
  currentMortgages: ActiveMortgageItem[];
}

export interface ForeclosureStatus {
  hasDistressIndicator: boolean;
  isPreForeclosureOrNod: boolean;
  auctionDate?: string | null;
  hasAuctionPassed: boolean;
  auctionLocation?: string | null;
  defaultAmount?: number | null;
  trusteeOrAttorney?: string | null;
}

export interface InvoluntaryLien {
  id: string;
  type: LienType;
  amount?: number | null;
  filingDate?: string | null;
  holder?: string | null;
  status: LienStatus;
  isReleased: boolean;
}

export interface DebtReportMeta {
  matchedAddress: string;
  schemaVersion: string;
  generatedAt: string;
  dataSources: string[];
}

export interface DebtPositionReportData {
  subjectAddress: string;
  mortgage: MortgagePosition;
  foreclosure: ForeclosureStatus;
  liens: InvoluntaryLien[];
  distressSummaryMessage: string;
  meta: DebtReportMeta;
}

export interface DebtPositionReportResponse {
  success: boolean;
  message: string;
  requiresPayment?: boolean | null;
  stripeUrl?: string | null;
  reportData?: DebtPositionReportData | null;
}

export interface DebtPositionReportInput {
  address: string;
  sessionId?: string;
}

export interface GetDebtPositionReportVars {
  input: DebtPositionReportInput;
}

export interface GetDebtPositionReportData {
  getDebtPositionReport: DebtPositionReportResponse;
}

export type TrendDirection = "up" | "down" | "flat" | "unknown";

export interface MarketSnapshot {
  medianListPrice: number | null;
  medianSalePrice: number | null;
  medianPricePerSqft: number | null;
  medianDaysOnMarket: number | null;
  sampleSize: number | null;
  isStatisticallyThin: boolean;
}

export interface PriceTrend {
  direction: TrendDirection;
  percentChange: number | null;
  currentPeriodMedian: number | null;
  priorPeriodMedian: number | null;
  summaryMessage: string;
}

export interface InventoryCounts {
  activeListings: number | null;
  pendingListings: number | null;
  totalComparableInventory: number | null;
}

export interface AreaDemographics {
  zip: string | null;
  population: number | null;
  households: number | null;
  medianHouseholdIncome: number | null;
  ownerOccupiedPercent: number | null;
  renterOccupiedPercent: number | null;
  isAvailable: boolean;
}

export interface GeographicCentroid {
  latitude: number;
  longitude: number;
}

export interface ReportMetadata {
  matchedAddress: string;
  radiusMiles: number;
  centroid: GeographicCentroid | null;
  schemaVersion: string;
  generatedAt: string;
  dataSources: string[];
  dataGaps: string[];
}

export interface MarketAreaReportData {
  subjectAddress: string;
  snapshot: MarketSnapshot;
  trend: PriceTrend;
  inventory: InventoryCounts;
  demographics: AreaDemographics;
  meta: ReportMetadata;
}

export interface MarketAreaReportResponse {
  success: boolean;
  message: string;
  requiresPayment?: boolean | null;
  stripeUrl?: string | null;
  reportData?: MarketAreaReportData | null;
}

export interface MarketAreaReportInput {
  address: string;
  radius?: number;
  sessionId?: string;
}

export interface GetMarketAreaReportVars {
  input: MarketAreaReportInput;
}

export interface GetMarketAreaReportData {
  marketAreaReport: MarketAreaReportResponse;
}
