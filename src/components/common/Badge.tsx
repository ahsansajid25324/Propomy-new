import React from "react";
import { capitalize } from "../../utils/StringUtils";
export type BadgeVariant = "success" | "danger" | "warning" | "info" | "neutral";

interface BadgeProps {
  text: string | null | undefined;
  variant?: BadgeVariant;
  fallbackText?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  text, 
  variant = "neutral", 
  fallbackText = "N/A" 
}) => {
  if (!text) {
    return <span className="status-badge badge-neutral">{fallbackText}</span>;
  }

  return (
    <span className={`status-badge badge-${variant}`}>
      {capitalize(text)}
    </span>
  );
};