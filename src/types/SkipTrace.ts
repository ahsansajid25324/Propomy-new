export interface Phone {
  phone: string;
  phoneType: string;
  phoneLastSeen: string;
  phoneUsage12Month: number;
  phoneFtcDnc: boolean;
}

export interface Person {
  personId: string;
  fullName: string;
  firstName: string;
  lastName: string;
  age?: number;
  gender?: string;
  occupationDescription?: string;
  emails?: string[];
  phones?: Phone[];
  address?: { address: string };
  previousAddress?: { address: string };
  lastUpdateDate?: string;
}

export interface ApiResult {
  requestId: string;
  resultCount: number;
  persons: Person[];
  requestDate?: string;
  input?: { address: string; city: string; state: string };
  match?: boolean;
  live?: boolean;
  requestExecutionTimeMS?: number;
}

export interface CreateSkipTraceCheckoutData {
  createSkipTraceCheckout: {
    success: boolean;
    stripeUrl: string | null;
    message: string;
  };
}

export interface CreateSkipTraceCheckoutVariables {
  requestId: string;
}

interface ApiName {
  personId: string;
  fullName: string;
  firstName: string;
  lastName: string;
}

interface ApiPhone {
  personId: string;
  phone: string;
  phoneType: string;
  lastSeen: string;
}

interface ApiEmail {
  personId: string;
  email: string;
}

export interface BulkapiRecord {
  requestId: string;
  match: boolean;
  input: {
    address: string;
  };
  output: {
    identity: {
      names: ApiName[];
      address: {
        formattedAddress: string;
        lastSeen: string;
      };
      addressHistory: Array<{ formattedAddress: string }>;
      phones: ApiPhone[];
      emails: ApiEmail[];
    };
  };
}

export interface ExpandedCSVRow {
  "Property Address": string;
  "Match Status": string;
  "Person Name": string;
  "Person ID": string;
  Emails: string;
  Phones: string;
  "Current Address": string;
  "Last Updated": string;
  "Request ID": string;
}

// --- Types & Interfaces ---

interface SkipTracePhone {
  phone: string;
  phoneDisplay?: string;
  phoneType?: string;
  personId?: string;
}

interface SkipTraceEmail {
  email: string;
  personId?: string;
}

interface SkipTraceName {
  fullName: string;
  personId?: string;
}

export interface SkipTraceRecord {
  requestId?: string;
  input?: {
    address?: string;
  };
  match: boolean;
  output?: {
    identity?: {
      names?: SkipTraceName[];
      emails?: SkipTraceEmail[];
      phones?: SkipTracePhone[];
      address?: {
        formattedAddress?: string;
        lastSeen?: string;
      };
    };
    phones?: SkipTracePhone[];
    emails?: string[];
  };
}

export interface LocationState {
  bulkData?: SkipTraceRecord[];
  requestId?: string;
  resultCount?: number;
  total?: number;
}

export interface CreateBulkCheckoutResponse {
  createBulkSkipTraceCheckout: {
    success: boolean;
    message: string;
    stripeUrl?: string;
  };
}

export interface CreateBulkCheckoutVariables {
  requestId: string;
}
