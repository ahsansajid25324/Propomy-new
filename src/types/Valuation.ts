export type ValuationForm = {
  address: string;
};

export type PropertyData = {
  bedrooms?: number;
  bathrooms?: number;
  livingSquareFeet?: number;
  zipCode?: string;
  yearBuilt?: number;
  landUse?: string;
  estimatedValue?: number;
  isCached?: boolean;
  equity?: number;
  equityPercentage?: number;
  roundedAverageCompValue?: number;
};

export interface PropertyDetailValuationQueryResponse {
  propertyDetail: PropertyData;
}

export interface PropertyDetailValuationQueryVariables {
  id?: string;
  address?: string;
}

export type TopFeature = {
  feature: string;
  impact: string;
};

export type Prediction = {
  prediction: number;
  data_version: string;
  explanation: string;
  feature_set_version: string;
  geo_scope: string;
  high_estimate: number;
  low_estimate: number;
  model_version: string;
  quality_score: number;
  quality_tier: string;
  source: string;
  top_features: TopFeature[];
  valuation: number;
};

export type PredictPropertyResponse = {
  predictProperty: {
    success: boolean;
    message: string;
    propertyId: string;
    prediction: Prediction;
  };
};

export interface AiValuation {
  lowEstimate?: number | null;
  highEstimate?: number | null;
}

export interface ValuationNode {
  id: string;
  propertyAddress?: string | null;
  predictedValue?: number | null;
  aiValuation?: AiValuation | null;
}

export interface ValuationEdge {
  node: ValuationNode | null;
}

export interface PageInfo {
  totalCount: number;
}

export interface RecentValuationsConnection {
  edges: ValuationEdge[];
  pageInfo: PageInfo;
}

export interface RecentValuationsData {
  recentValuations: RecentValuationsConnection;
}

export interface RecentValuationsVariables {
  input: {
    limit: number;
    offset: number;
  };
}

export interface PropertyDetails {
  propertyType?: string | null;
  yearBuilt?: number | string | null;
  sqft?: number | null;
  beds?: number | null;
  baths?: number | null;
  zipCode?: string | null;
  estimatedValue?: number | null;
}

export interface AiValuation {
  lowEstimate?: number | null;
  highEstimate?: number | null;
  explanation?: string | null;
  topFeatures?: TopFeature[] | null;
}

export interface ValuationNode {
  id: string;
  propertyId?: string | null;
  propertyAddress?: string | null;
  predictedValue?: number | null;
  aiValuation?: AiValuation | null;
  propertyDetails?: PropertyDetails | null;
}

export interface ExportValuationsResponse {
  exportValuations: {
    content: string;
    filename: string;
    mimeType: string;
  };
}

export interface ExportValuationsVariables {
  startDate: string;
  endDate: string;
  format: "csv" | "pdf" | "xlsx";
}

export interface StuckUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface FunnelStep {
  stepKey: string;
  label: string;
  count: number;
  conversionRatePct: number;
  stepDropoffPct: number;
  stuckUsers: StuckUser[];
}

export interface TimeToFirstValuation {
  median: number | null;
  p90: number | null;
}

export interface CohortRow {
  cohortWeek: string;
  totalUsers: number;
  week1Pct: number | null;
  week2Pct: number | null;
  week3Pct: number | null;
  week4PlusPct: number | null;
}

export interface ActivationFunnelMetricsData {
  activationFunnelMetrics: {
    dateRangeDays: number;
    totalCohortUsers: number;
    activatedUsersCount: number;
    notYetActivatedUsersCount: number;
    activationRatePercentage: number;
    timeToFirstValuationMinutes: TimeToFirstValuation;
    cohortTable: CohortRow[];
    funnelSteps: FunnelStep[]; // NEW FIELD
    calculatedAt: string;
  };
}

export interface ActivationFunnelMetricsVars {
  dateRangeDays: number;
}
