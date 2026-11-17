import RegistrationForm from "../components/pages/RegistrationForm";
import InvestorForm from "../components/pages/InvestorForm";
import RealtorForm from "../components/pages/RealtorForm";
import WelcomeForm from "../components/pages/WelcomeForm";
import "../styles/signup.css";
import "../App.css";
import { useState, useEffect } from "react";
import PlanSelection from "../components/pages/PlanSelection";
import { toast } from "react-toastify";
import { UPDATE_PLAN_SELECTION } from "../apollo/graphql/mutations/signup.gql";
import { useMutation } from "@apollo/client/react";
import type { PlanSelectionResponse, PlanSelectionVars } from "../types/auth";
import LeaveModal from "../components/common/LeaveModal";

const ProgressBar = ({ currentStep }: { currentStep: number }) => {
  const steps = ["Account Info", "Plan Selection", "Role Details", "Complete"];
  return (
    <div className="progressbar-container">
      <div className="progressbar-labels">
        {steps.map((label, idx) => (
          <span
            key={label}
            className={`progressbar-label${
              currentStep === idx + 1 ? " active" : ""
            }`}
          >
            <span className="progressbar-step">{idx + 1}</span>
            {label}
          </span>
        ))}
      </div>
      <div className="progressbar-track">
        <div
          className="progressbar-fill"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

const Signup = () => {
  const [step, setStep] = useState<number>(() => {
    const savedStep = localStorage.getItem("temp_signup_step");
    return savedStep ? parseInt(savedStep, 10) : 1;
  });

  const [selectedRole, setSelectedRole] = useState<string>(() => {
    return localStorage.getItem("temp_signup_role") || "";
  });

  const [auth0Id, setAuth0Id] = useState<string | undefined>(() => {
    return localStorage.getItem("temp_signup_id") || undefined;
  });

  // Updated state type to accept "premium"
  const [selectedPlan, setSelectedPlan] = useState<
    "free" | "paid" | "premium" | ""
  >("");
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [stripeUrl, setStripeUrl] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [updatePlanSelection, { loading }] = useMutation<
    PlanSelectionResponse,
    PlanSelectionVars
  >(UPDATE_PLAN_SELECTION);

  const resetSignupFlow = () => {
    localStorage.removeItem("temp_signup_step");
    localStorage.removeItem("temp_signup_id");
    localStorage.removeItem("temp_signup_role");

    setAuth0Id(undefined);
    setSelectedRole("");
    setSelectedPlan("");
    setStep(1);
  };

  useEffect(() => {
    if (step > 1 && !auth0Id) {
      resetSignupFlow();
      return;
    }

    const persistedRole = localStorage.getItem("temp_signup_role");

    if (step === 3) {
      if (
        !persistedRole ||
        (persistedRole !== "investor" && persistedRole !== "realtor")
      ) {
        toast.error("Registration role context missing. Restarting process.");
        resetSignupFlow();
      }
    }
  }, [step, auth0Id]);

  useEffect(() => {
    localStorage.setItem("temp_signup_step", step.toString());
  }, [step]);

  useEffect(() => {
    if (step === 4) {
      localStorage.removeItem("temp_signup_step");
      localStorage.removeItem("temp_signup_id");
      localStorage.removeItem("temp_signup_role");
    }
  }, [step]);

  const handlePlanContinue = async (plan: "free" | "paid" | "premium") => {
    if (!auth0Id) {
      toast.error("User context missing. Please complete registration first.");
      resetSignupFlow();
      return;
    }

    try {
      const { data } = await updatePlanSelection({
        variables: { input: { auth0Id, plan } },
      });

      if (!data || !data.updatePlanSelection.success) {
        const backendMessage =
          data?.updatePlanSelection?.message || "Failed to select plan";
        toast.error(backendMessage);

        if (backendMessage.toLowerCase().includes("user not found")) {
          resetSignupFlow();
        }
        return;
      }

      if (plan === "free") {
        setStep(3);
        toast.success("Free plan selected. Continue to role details.");
      } else if (plan === "paid" || plan === "premium") {
        // Both paid paths direct users to checkout
        if (data.updatePlanSelection.stripeUrl) {
          setStripeUrl(data.updatePlanSelection.stripeUrl);
          setShowLeaveModal(true);
        } else {
          toast.error("Stripe session not created.");
        }
      }
    } catch (error: unknown) {
      let errorMessage = "An error occurred during plan selection.";
      if (error instanceof Error) {
        errorMessage = error.message;

        if (errorMessage.toLowerCase().includes("not found")) {
          toast.error("Account registration no longer valid. Starting over.");
          resetSignupFlow();
          return;
        }
      }
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (step > 1 && step < 4 && !isRedirecting) {
        e.preventDefault();
        e.returnValue =
          "Are you sure you want to leave? Your progress will be lost.";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [step, isRedirecting]);

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setIsRedirecting(false);
        setShowLeaveModal(false);
      }
    };

    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      setShowLeaveModal(false);
      setIsRedirecting(false);
    };
  }, []);

  const confirmLeave = () => {
    if (stripeUrl) {
      setIsRedirecting(true);
      setShowLeaveModal(false);

      setTimeout(() => {
        window.location.href = stripeUrl;
      }, 100);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get("session_id");

    if (sessionId) {
      setStep(3);
      toast.success("Payment successful!");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div>
      <ProgressBar currentStep={step} />
      <div>
        {step === 1 && (
          <RegistrationForm
            onSuccess={(data, id) => {
              const role = data.role?.trim().toLowerCase() || "";
              setSelectedRole(role);
              setAuth0Id(id);
              localStorage.setItem("temp_signup_id", id || "");
              localStorage.setItem("temp_signup_role", role);
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <PlanSelection
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            onContinue={(plan) => handlePlanContinue(plan)}
            loading={loading}
          />
        )}

        {step === 3 &&
          (selectedRole === "investor" ? (
            <InvestorForm
              auth0Id={auth0Id}
              onSuccess={() => setStep(4)}
              onReset={resetSignupFlow}
            />
          ) : selectedRole === "realtor" ? (
            <RealtorForm
              auth0Id={auth0Id}
              onSuccess={() => setStep(4)}
              onReset={resetSignupFlow}
            />
          ) : null)}

        {step === 4 && <WelcomeForm />}

        <LeaveModal
          visible={showLeaveModal}
          onConfirm={confirmLeave}
          onCancel={() => setShowLeaveModal(false)}
          loading={isRedirecting}
          title="Secure Checkout"
          description="You’re being redirected to Stripe to complete your payment securely."
          confirmText="Continue to Stripe"
        />
      </div>
    </div>
  );
};

export default Signup;
