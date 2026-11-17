import React from "react";

interface StatCardProps {
  value: string | number;
  label: string;
  isLoading?: boolean;
  subLabel: string;
  icon: React.ReactNode;
}
const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  subLabel,
  isLoading = false,
  icon,
}) => (
  <div className="stat-card">
    <div className="stat-card-header">
      <div className="stat-value">
        {isLoading ? <div className="skeleton-value" /> : value}
      </div>{" "}
      <div className="stat-icon">{icon}</div>
    </div>
    <div className="stat-label">{label}</div>
    <div className="stat-sublabel">{subLabel}</div>
  </div>
);

export default StatCard;
