export type UserPropertyStatsProperty = {
  address: string;
  status: string;
};

export type UserPropertyStatsRecentValuation = {
  propertyId: string;
  propertyAddress: string;
  predictedValue: number;
};

export type UserPropertyStats = {
  user: string;
  totalProperties: number;
  avgROI: number | null;
  avgCapRate: number | null;
  avgCashOnCashReturn: number | null;
  savedProperties: UserPropertyStatsProperty[];
  recentValuations: UserPropertyStatsRecentValuation[];
  analyzingDealsCount: number;
  negotiatingDealsCount: number;
  offerMadeDealsCount: number;
  underContractDealsCount: number;
  closedDealsCount: number;
  activePipelineValue: number;
};
