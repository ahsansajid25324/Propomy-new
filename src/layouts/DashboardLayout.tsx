import React, { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import type { ToastOptions } from "react-toastify";

import Sidebar from "../components/pages/Sidebar";
import DashboardHeaderBar from "../components/pages/DashboardHeaderBar";
import LeaveModal from "../components/common/LeaveModal";
import PlanChoiceModal from "../components/pages/PlanChoiceModal";
import { useSubscription } from "../hooks/useSubscription";
import "../styles/DashboardLayout.css";
import { useFeatureFlags } from "../hooks/useFeatureFlag";

const TOAST_CONFIG: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const LowCreditNotification: React.FC<{ credits: number }> = ({ credits }) => (
  <div>
    <strong>Low API Credits</strong>
    <p style={{ margin: 0, fontSize: "14px" }}>
      You have {credits} credits remaining.
    </p>
  </div>
);

const DashboardLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const location = useLocation();
  const contentRef = useRef<HTMLElement>(null);

  const { role, user, isLowOnCredits } = useFeatureFlags();
  const currentApiLimit = user?.apiLimit;

  const {
    // handleActivateClick,
    handleSelectPlan,
    closePlanModal,
    showPlanModal,
    pendingPlan,
    confirmLeave,
    handleCancel,
    showLeaveModal,
    isRedirecting,
    loading,
  } = useSubscription();

  useEffect(() => {
    if (!isLowOnCredits || currentApiLimit === undefined) return;

    const TOAST_ID = "low-credit-toast";

    const triggerToast = () => {
      toast.warn(<LowCreditNotification credits={currentApiLimit} />, {
        ...TOAST_CONFIG,
        toastId: TOAST_ID,
      });
    };

    triggerToast();
    const interval = setInterval(triggerToast, 60000);

    return () => {
      clearInterval(interval);
      toast.dismiss(TOAST_ID);
    };
  }, [currentApiLimit, isLowOnCredits]);
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "auto" });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  // const isAiAssistantPage = location.pathname.includes("/ai-assistant");
  // const shouldShowUpgradeTab = isEligibleForUpgrade && !isAiAssistantPage;

  return (
    <div className="dashboard-layout">
      <DashboardHeaderBar setMobileSidebarOpen={setMobileSidebarOpen} />

      <div className="dashboard-body">
        <div className={`sidebar-wrapper ${mobileSidebarOpen ? "open" : ""}`}>
          <Sidebar role={role} />
        </div>

        {mobileSidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setMobileSidebarOpen(false)}
            role="button"
            aria-label="Close Sidebar"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Escape" && setMobileSidebarOpen(false)}
          />
        )}

        <main className="content" ref={contentRef}>
          <Outlet />
        </main>
      </div>

      {/* {shouldShowUpgradeTab && (
        <div className="upgrade-floating-tab">
          <div className="upgrade-content">
            <button
              className="upgrade-action-btn"
              onClick={handleActivateClick}
              disabled={loading}
            >
              {loading ? "Processing..." : "Upgrade"}
            </button>
          </div>
        </div>
      )} */}

      <PlanChoiceModal
        show={showPlanModal}
        onClose={closePlanModal}
        onSelect={handleSelectPlan}
        pendingPlan={pendingPlan}
        loading={loading}
      />

      <LeaveModal
        visible={showLeaveModal}
        onConfirm={confirmLeave}
        onCancel={handleCancel}
        loading={isRedirecting}
        title="Secure Checkout"
        description="You're being redirected to Stripe to complete your payment securely."
        confirmText="Continue to Stripe"
      />
    </div>
  );
};

export default DashboardLayout;
