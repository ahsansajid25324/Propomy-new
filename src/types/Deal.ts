export interface DealFormData {
  address: string;
  strategy: string;
  acqCost: number;
  status: string;
  targetCloseDate?: string | null;
  contactName: string | null;
  contactPhone: string | null;
  contactRole: string;
  contactEmail: string;
  notes: string;
}

export interface AddDealMutationVariables {
  input: DealFormData;
}

export interface AddDealMutationResponse {
  addDeal: {
    success: boolean;
    message: string;
  };
}

export interface DealNode {
  id: string;
  address: string;
  location: string;
  strategy: string;
  acqCost: number;
  status: string;
  targetCloseDate: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  contactRole: string;
  contactEmail?: string | null;
  notes?: string | null;
  updatedAt: string;
}

export interface DealEdge {
  cursor: string;
  node: DealNode;
}

export interface MyDealsData {
  myDeals: {
    edges: DealEdge[];
    pageInfo: { totalCount: number };
    activeDealsCount: number;
    underContractDealsCount: number;
    activePipelineValue: number;
    closedDealsCount: number;
  };
}

export interface DeleteDealData {
  deleteDeal: {
    success: boolean;
    message: string;
  };
}

export interface DeleteDealVars {
  id: string;
}

export interface UpdateDealMutationResponse {
  updateDeal: {
    success: boolean;
    message?: string | null;
  };
}

export interface UpdateDealMutationVariables {
  id: string;
  input: DealFormData;
}
