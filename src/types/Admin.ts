export interface UserProfiles {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country: string;
  id: string;
  state: string;
  heardAbout?: string;
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
}
export interface UserProfileEdge {
  cursor: string;
  node: UserProfiles  ;
}

export interface UserProfilesData {
  userProfiles: {
    totalUsers: number;
    paidUsers: number;
    edges: UserProfileEdge[];
    pageInfo: {
      totalCount: number;
    };
  };
}

export interface UserProfilesVars {
  pagination: {
    limit: number;
    offset: number;
  };
}

export interface AdminActionResponse {
  success: boolean;
  message: string;
}

export interface UpdateUserApiLimitData {
  updateUserApiLimit: {
    success: boolean;
    message: string;
    id: string;
    apiLimit: number;
  };
}

export interface UpdateUserApiLimitVars {
  input: {
    targetUserId: string;
    newApiLimit: number;
  };
}
export interface DeleteUserData {
  deleteUser: {
    success: boolean;
    message: string;
  };
}

export interface DeleteUserVars {
  input: {
    targetUserId: string;
  };
}


export interface WeeklyReport {
  id: string;
  windowStart: string | null;
  windowEnd: string | null;
  computedAt: string | null;
  signupsTotal: number;
  activated: number;
  activationRate: number | null;
  activePaidSubscribers: number;
  stillFree: number;
  convertedInWindow: number;
  convertedFromPriorCohorts: number;
  cohortRevenueCents: number;
  totalNetRevenueCents: number;
  schemaVersion: number;
}
