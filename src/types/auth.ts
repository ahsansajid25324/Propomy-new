export interface SignupFormDataInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string | null;
  country: string;
  state: string;
  heardAbout?: string | null;
  role: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  user?: {
    user_id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  } | null;
}

export interface InvestorProfileInput {
  auth0Id: string;
  investorType: string;
  experienceLevel: string;
  investmentStrategy: string[];
  targetMarkets?: string[];
  targetPropertyType: string[];
  budgetRange?: string;
  desiredROI?: string;
  propertiesOwned?: number;
  collaborateWithRealtors?: boolean;
}

export interface InvestorProfileResponse {
  success: boolean;
  message: string;
}

export interface RealtorProfileInput {
  auth0Id: string;
  brokerageName: string;
  licenseNumber: string;
  licenseState: string[];
  yearsOfExperience: string;
  primaryMarketsServed: string[];
  targetPropertyTypes?: string[];
  clientFocus: string;
  averagePriceRange: string;
  preferredPropertyTypes?: string[];
  activeListingsCount?: number;
}

export interface RealtorProfileResponse {
  success: boolean;
  message: string;
}

export interface LoggedInUser {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country: string;
  state: string;
  heardAbout?: string;
  id: string;
  role: string;
  registrationStatus?: string;
  plan: string;
  chatApiLimit: number;
  stripeSubscriptionId: string;
  apiLimit: number;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  cancelAtPeriodEnd?: boolean;
  subscriptionStatus?: string;
  exportCount: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: LoggedInUser | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ResendVerificationEmailInput {
  email: string;
}
export interface ResendVerificationEmailResponse {
  success: boolean;
  message: string;
}

export interface PlanSelectionResponse {
  updatePlanSelection: {
    success: boolean;
    message: string;
    stripeUrl: string | null;
  };
}

export interface ActivateSubscriptionResponse {
  activateSubscription: {
    success: boolean;
    message: string;
    stripeUrl: string | null;
  };
}

export interface PlanSelectionVars {
  input: {
    auth0Id: string;
    plan: string;
  };
}

export interface ActivateSubscriptionVars {
  input: {
    plan: string;
  };
}

export type QueryResult = {
  me: {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
    exportCount: number;
    phone?: string;
    country: string;
    state: string;
    heardAbout?: string;
    role: "investor" | "realtor";
    apiLimit: number;
    chatApiLimit: number;
    plan: "free" | "paid";
    subscriptionStartDate?: string;
    subscriptionEndDate?: string;
    stripeSubscriptionId?: string;
    subscriptionStatus?: string;
    cancelAtPeriodEnd?: boolean;
    registrationStatus?: string;
  };
};
