import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

export type UserRole = "investor" | "realtor" | "admin";

export const useFeatureFlags = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const role = user?.role as UserRole;

  const isAdmin = role === "admin";
  const apiCredits = user?.apiLimit ?? 0;
  const isFreePlan = user?.plan === "free";
  const isCanceled = user?.subscriptionStatus === "canceled";
  const isPaidWithCriticallyLowCredits =
    user?.plan === "paid" && apiCredits <= 10;

  const isExportLimitReached = isFreePlan && (user?.exportCount ?? 0) >= 1;
  const isEligibleForUpgrade =
    !isAdmin && (isFreePlan || isCanceled || isPaidWithCriticallyLowCredits);

  return {
    user,
    role,
    isAdmin,
    isExportLimitReached,
    isFreePlan,
    canManageUsers: isAdmin,
    canSeeCredits: !isAdmin,
    canSeeUserMenu: !isAdmin,
    canUseAiAssistant: role === "investor",
    isLowOnCredits: apiCredits > 0 && apiCredits < 5,
    isEligibleForUpgrade,
  };
};
