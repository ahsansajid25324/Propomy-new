import { Button } from "react-bootstrap";
import logo from "../../assets/logo.png";
import "./../../styles/signup.css";
import "./../../App.css";

type PlanKey = "free" | "paid" | "premium";

type PlanSelectionProps = {
  selectedPlan: PlanKey | "";
  setSelectedPlan: (plan: PlanKey) => void;
  onContinue: (plan: PlanKey) => void;
  loading: boolean;
};

const PLANS: {
  key: PlanKey;
  name: string;
  tagline: string;
  originalPrice?: string;
  price: string;
  period: string;
  apiCalls: string;
  features: string[];
  popular?: boolean;
}[] = [
  {
    key: "free",
    name: "Free Trial",
    tagline: "1 Month Trial",
    price: "$0",
    period: "",
    apiCalls: "50 API Calls",
    features: [
      "AI Valuation",
      "Interactive Map View",
      "ROI Calculator",
      "AI Assistant (50 Credits)",
      "Add/View Property",
      "Advanced Property Details",
    ],
  },
  {
    key: "paid",
    name: "Essentials",
    tagline: "Early Bird Discount",
    originalPrice: "$79/mo",
    price: "$39",
    period: "/mo",
    apiCalls: "2000 API Calls",
    popular: true,
    features: [
      "AI Valuation",
      "Interactive Map View",
      "AI Assistant",
      "ROI Calculator",
      "Add/View Property",
      "Advanced Property Details",
    ],
  },
  {
    key: "premium",
    name: "Premium",
    tagline: "For Power Users & Teams",
    price: "$249",
    period: "/mo",
    apiCalls: "10,000 API Calls",
    features: [
      "AI Valuation",
      "Interactive Map View",
      "AI Assistant",
      "ROI Calculator",
      "Add/View Property",
      "Advanced Property Details",
    ],
  },
];

const CheckIcon = () => (
  <svg
    className="plan-check"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M20 6L9 17l-5-5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlanSelection = ({
  selectedPlan,
  setSelectedPlan,
  onContinue,
  loading = false,
}: PlanSelectionProps) => {
  return (
    <div className="formGeneric-contianer">
      <img src={logo} alt="Logo" className="formGeneric-logo" />

      <h2 className="formGeneric-title">Choose Your Plan</h2>
      <p className="formGeneric-subtitle">
        Get instant AI valuations and portfolio insights in minutes
      </p>

      <div className="formGeneric-form">
        <div className="plan-grid mb-4">
          {PLANS.map((plan) => {
            const isActive = selectedPlan === plan.key;
            return (
              <button
                key={plan.key}
                type="button"
                role="radio"
                aria-checked={isActive}
                className={`plan-card ${isActive ? "is-active" : ""} ${
                  plan.popular ? "is-popular" : ""
                }`}
                onClick={() => setSelectedPlan(plan.key)}
              >
                {plan.popular && (
                  <span className="plan-badge">Recommended</span>
                )}

                <span className="plan-selected-dot" aria-hidden="true">
                  <CheckIcon />
                </span>

                <h4 className="plan-name">{plan.name}</h4>
                <p className="plan-tagline">{plan.tagline}</p>

                <div className="plan-price d-flex align-items-baseline gap-2">
                  {plan.originalPrice && (
                    <span className="text-decoration-line-through text-muted fs-6">
                      {plan.originalPrice}
                    </span>
                  )}
                  <span className="plan-amount">{plan.price}</span>
                  {plan.period && (
                    <span className="plan-period">{plan.period}</span>
                  )}
                </div>

                <div className="plan-api-calls">{plan.apiCalls}</div>

                <ul className="plan-features">
                  {plan.features.map((f) => (
                    <li key={f}>
                      <CheckIcon />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <Button
          className="btn-custom w-100"
          disabled={!selectedPlan || loading}
          onClick={() => selectedPlan && onContinue(selectedPlan)}
        >
          {loading ? "Saving..." : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default PlanSelection;