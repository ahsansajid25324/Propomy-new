import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import { ACTIVATE_SUBSCRIPTION } from "../apollo/graphql/mutations/signup.gql";
import type {
  ActivateSubscriptionResponse,
  ActivateSubscriptionVars,
} from "../types/auth";

type PaidPlan = "paid" | "premium";

export const useSubscription = () => {
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [stripeUrl, setStripeUrl] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  // track which plan is mid-request so the modal can show a per-card spinner
  const [pendingPlan, setPendingPlan] = useState<PaidPlan | null>(null);

  const [activateSubscription, { loading }] = useMutation<
    ActivateSubscriptionResponse,
    ActivateSubscriptionVars
  >(ACTIVATE_SUBSCRIPTION);
  const handleActivateClick = () => {
    setShowPlanModal(true);
  };

  const closePlanModal = () => {
    if (!loading) setShowPlanModal(false);
  };

  const handleSelectPlan = async (plan: PaidPlan) => {
    setPendingPlan(plan);
    try {
      const { data } = await activateSubscription({
        variables: { input: { plan } },
      });

      if (!data?.activateSubscription.success) {
        toast.error(data?.activateSubscription.message || "Failed to activate");
        return;
      }

      if (data.activateSubscription.stripeUrl) {
        setStripeUrl(data.activateSubscription.stripeUrl);
        setShowPlanModal(false);
        setShowLeaveModal(true);
      } else {
        toast.error("Stripe session not created.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setPendingPlan(null);
    }
  };

  const confirmLeave = () => {
    if (stripeUrl) {
      setIsRedirecting(true);
      setTimeout(() => {
        window.location.href = stripeUrl;
      }, 100);
    }
  };

  const handleCancel = () => {
    if (!isRedirecting) {
      setShowLeaveModal(false);
    }
  };

  return {
    handleActivateClick,
    handleSelectPlan,
    closePlanModal,
    showPlanModal,
    pendingPlan,
    confirmLeave,
    handleCancel,
    showLeaveModal,
    isRedirecting,
    loading,
  };
};
