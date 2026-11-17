import React from "react";
import { Placeholder } from "react-bootstrap";

interface DetailBoxProps {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
  loading?: boolean;
}

export const DetailBox: React.FC<DetailBoxProps> = ({
  icon,
  label,
  value,
  loading,
}) => (
  <div className="detail-box">
    <div className="detail-header">
      <span className="icon">{icon}</span>
      <span className="label">{label}</span>
    </div>
    <div className="value">
      {loading ? (
        <Placeholder as="span" animation="glow">
          <Placeholder xs={6} />
        </Placeholder>
      ) : (
        (value ?? "-")
      )}
    </div>
  </div>
);

interface ValuationItemProps {
  label: string;
  value?: number | string;
  isCurrency?: boolean;
  loading?: boolean;
}

export const ValuationItem: React.FC<ValuationItemProps> = ({
  label,
  value,
  isCurrency = false,
  loading = false,
}) => (
  <div className="valuation-estimate-item mt-3">
    <span>{label}</span>
    <span>
      {loading ? (
        <Placeholder as="span" animation="wave">
          <Placeholder xs={4} />
        </Placeholder>
      ) : value === undefined || value === null || value === "" ? (
        "N/A"
      ) : isCurrency && typeof value === "number" ? (
        `$${value.toLocaleString()}`
      ) : (
        value
      )}
    </span>
  </div>
);
