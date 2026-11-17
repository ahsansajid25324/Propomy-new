import { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

type PaidPlan = "paid" | "premium";

type PlanOption = {
  key: PaidPlan;
  name: string;
  tagline: string;
  originalPrice?: string;
  price: string;
  period: string;
  popular?: boolean;
};

const PLAN_OPTIONS: PlanOption[] = [
  {
    key: "paid",
    name: "Essentials Plan",
    tagline: "Early Bird Discount",
    originalPrice: "$79/mo",
    price: "$39",
    period: "/mo",
    popular: true,
  },
  {
    key: "premium",
    name: "Premium Plan",
    tagline: "Advanced tools & dedicated support",
    price: "$249",
    period: "/mo",
  },
];

type PlanChoiceModalProps = {
  show: boolean;
  onClose: () => void;
  onSelect: (plan: PaidPlan) => void;
  pendingPlan: PaidPlan | null;
  loading: boolean;
};

const PlanChoiceModal = ({
  show,
  onClose,
  onSelect,
  pendingPlan,
  loading,
}: PlanChoiceModalProps) => {
  // Local state to track what the user clicks *inside* the modal before hitting confirm
  const [activeSelection, setActiveSelection] = useState<PaidPlan>("paid");

  useEffect(() => {
    if (show) {
      setActiveSelection(pendingPlan || "paid");
    }
  }, [show, pendingPlan]);

  const handleConfirm = () => {
    onSelect(activeSelection);
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop={loading ? "static" : true}
    >
      <Modal.Header closeButton={!loading}>
        <Modal.Title>Choose a Plan</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex flex-column gap-3">
          {PLAN_OPTIONS.map((plan) => {
            // Highlight the card if the user has clicked it, OR if it's currently the pending plan
            const isSelected =
              activeSelection === plan.key || pendingPlan === plan.key;

            return (
              <button
                key={plan.key}
                type="button"
                className="text-start border rounded p-3 d-flex justify-content-between align-items-center bg-white"
                style={{
                  cursor: loading ? "not-allowed" : "pointer",
                  borderColor: isSelected ? "#4285f4" : "#e6e8f0",
                  borderWidth: isSelected ? 2 : 1,
                  boxShadow: isSelected ? "0 0 0 1px #4285f4" : "none",
                }}
                disabled={loading}
                onClick={() => setActiveSelection(plan.key)}
              >
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-semibold">{plan.name}</span>
                    {plan.popular && (
                      <span className="badge bg-primary">Popular</span>
                    )}
                  </div>
                  <div className="text-muted small">{plan.tagline}</div>
                </div>

                <div className="d-flex align-items-baseline gap-2">
                  {plan.originalPrice && (
                    <span className="text-decoration-line-through text-muted small">
                      {plan.originalPrice}
                    </span>
                  )}
                  <span className="fs-5 fw-bold">{plan.price}</span>
                  <span className="text-muted small">{plan.period}</span>
                </div>
              </button>
            );
          })}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={loading}
          style={{ minWidth: "140px" }}
        >
          {loading ? (
            <div className="d-flex align-items-center justify-content-center gap-2">
              <Spinner animation="border" size="sm" />
              <span>Upgrading...</span>
            </div>
          ) : (
            "Change Plan"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PlanChoiceModal;
