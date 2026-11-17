import "../../styles/Accounts.css";
import bound from "../../assets/bound.png";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

import LeaveModal from "../../components/common/LeaveModal";
import PlanChoiceModal from "../../components/pages/PlanChoiceModal";
import { Spinner } from "react-bootstrap";
import { useSubscription } from "../../hooks/useSubscription";
import { useCancelSubscription } from "../../hooks/useCancelSubscription";
import { capitalize } from "../../utils/StringUtils";

const PLAN_TOTAL_CALLS: Record<string, number> = {
  free: 50,
  paid: 2000,
  premium: 10000, 
};

const Accounts = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const isPaid = user?.plan === "paid" || user?.plan === "premium";
  const totalCalls = PLAN_TOTAL_CALLS[user?.plan ?? "free"] ?? 50;
  const remainingCalls = user?.apiLimit ?? 0;
  const percentage =
    totalCalls > 0 ? Math.round((remainingCalls / totalCalls) * 100) : 0;

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 14;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const formattedEndDate = user?.subscriptionEndDate
    ? new Date(user.subscriptionEndDate).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
    : "00/00/0000";

  const daysRemaining = user?.subscriptionEndDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(user.subscriptionEndDate).getTime() -
            new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  const {
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
  } = useSubscription();

  const {
    showModal,
    openModal,
    closeModal,
    confirmCancel,
    loading: canceling,
  } = useCancelSubscription();

  const canActivateSubscription =
    !isPaid ||
    user?.subscriptionStatus === "canceled" ||
    (isPaid && user?.apiLimit === 0);

  return (
    <div className="account-container">
      <div className="account-content">
        <div className="section-group">
          <h5 className="section-title">Account Details</h5>
          <div className="custom-card">
            <div className="details-grid">
              <div className="d-flex align-items-center gap-3">
                <img src={bound} alt="Plan" />
                <span className="plan-name">
                  {capitalize(user?.plan || "Free")} Plan
                </span>
              </div>
              <div className="detail-item border-left">
                <label>TYPE</label>
                <span className="blue-text">Monthly</span>
              </div>
            </div>
          </div>
        </div>

        <div className="section-group">
          <div className="section-header-row">
            <h5 className="section-title">Usage</h5>
            <div className="header-meta ">
              {isPaid && (
                <>
                  <span className="reset-text">
                    Subscription Status:{" "}
                    {user?.subscriptionStatus?.toUpperCase()}
                  </span>
                  {user?.subscriptionStatus === "active" &&
                  user?.cancelAtPeriodEnd === false ? (
                    <span className="reset-text">
                      RESETS IN: {daysRemaining} DAYS | {formattedEndDate}
                    </span>
                  ) : user?.cancelAtPeriodEnd === true &&
                    user?.subscriptionStatus === "canceled" ? null : (
                    <span className="reset-text">
                      ENDED IN {daysRemaining} DAYS | {formattedEndDate}
                    </span>
                  )}
                  {user.cancelAtPeriodEnd === false && (
                    <button
                      className="activate-link btn btn-link p-0"
                      onClick={openModal}
                    >
                      Cancel Subscription
                    </button>
                  )}
                </>
              )}
              {canActivateSubscription && (
                <button
                  className="activate-link btn btn-link p-2"
                  onClick={handleActivateClick}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Activating...
                    </>
                  ) : (
                    "Activate Subscription"
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="custom-card usage-card">
            <div className="usage-body">
              {/* Left Side Info */}
              <div className="usage-info">
                <p className="usage-label">Remaining Calls</p>
                <h1 className="usage-number">{remainingCalls}</h1>
                <p className="usage-subtext">
                  <span className="fw-bold">Total Calls {totalCalls}</span>
                </p>
              </div>

              <div className="vertical-divider"></div>

              <div className="usage-chart">
                <div className="chart-wrapper">
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      className="circle-bg"
                      stroke="#e6e6e6"
                      strokeWidth={strokeWidth}
                      fill="none"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      className="circle-progress"
                      stroke="#1677ff"
                      strokeWidth={strokeWidth}
                      fill="none"
                      strokeLinecap="round"
                      style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: strokeDashoffset,
                        transition: "stroke-dashoffset 0.5s",
                      }}
                    />
                  </svg>
                  <div className="chart-text">
                    {" "}
                    <span className="fw-bold">{percentage}</span>%
                  </div>
                </div>
              </div>

              <div className="vertical-divider"></div>
            </div>

            <div className="alert-banner">
              <div className="info-icon">!</div>
              IF YOU WANT TO ADD ANY TEXT HERE YOU CAN ADD
            </div>
          </div>

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
          <LeaveModal
            visible={showModal}
            onConfirm={confirmCancel}
            onCancel={closeModal}
            loading={canceling}
            title="Cancel Subscription"
            description={`If you cancel your subscription, it will remain active until the end of your billing period (${formattedEndDate}). 
To purchase a new subscription after cancellation, contact support at Support@Propomy.com.`}
            confirmText="Confirm Cancellation"
            cancelText="Keep Subscription"
          />
        </div>
      </div>
    </div>
  );
};

export default Accounts;