import type { ReactNode } from "react";
import { FiArrowUpRight } from "react-icons/fi";

interface QuickAction {
  label: string;
  icon: ReactNode;
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  className = "",
}) => {
  return (
    <div className={`right-Dashboard-card ${className}`}>
      <div className="main-header">
        <h2>Quick Actions</h2>
        <button className="view-all-btn">
          <div className="view-all-icon-wrapper">
            <FiArrowUpRight
              className="arrow-icon"
              color="white"
              aria-label="Arrow Up"
            />
          </div>
        </button>
      </div>
      <div className="quick-actions-list">
        {actions.map(({ label, icon }) => (
          <button
            className="d-flex justify-content-between quick-action-btn"
            key={label}
          >
            <span>{label}</span>
            <span>{icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
