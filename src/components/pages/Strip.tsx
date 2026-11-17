import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "../../styles/PipelineBar.css";

interface PipelineBarProps {
  analyzingCount?: number;
  negotiatingCount?: number;
  offerMadeCount?: number;
  underContractCount?: number;
  closedCount?: number;
  isLoading?: boolean;
}

const Strip = ({
  analyzingCount = 0,
  negotiatingCount = 0,
  offerMadeCount = 0,
  underContractCount = 0,
  closedCount = 0,
  isLoading = false,
}: PipelineBarProps) => {
  const [isHidden, setIsHidden] = useState(false);

  if (isLoading) {
    return (
      <div className="pipeline-container skeleton">
        <span style={{ color: "#6b7280" }}>Loading pipeline stats...</span>
      </div>
    );
  }

  if (isHidden) {
    return (
      <div className="pipeline-container pipeline-hidden-state">
        <div className="hidden-text">
          <EyeOff size={18} style={{ color: "#9ca3af" }} />
          <span>Deal flow pipeline snapshot is hidden</span>
        </div>
        <button
          className="toggle-pipeline-btn"
          onClick={() => setIsHidden(false)}
        >
          <Eye size={16} />
          <span>Show pipeline</span>
        </button>
      </div>
    );
  }

  const stages = [
    { label: "Analyzing", count: analyzingCount, color: "#8a94a6" },
    { label: "Negotiating", count: negotiatingCount, color: "#2563eb" },
    { label: "Offer Made", count: offerMadeCount, color: "#c2410c" },
    { label: "Under Contract", count: underContractCount, color: "#0d9488" },
    { label: "Closed", count: closedCount, color: "#16a34a" },
  ];

  return (
    <div className="pipeline-container pipeline-visible-state">
      <div className="pipeline-stages">
        {stages.map((stage, index) => (
          <div key={stage.label} className="pipeline-stage-item">
            <div className="stage-content">
              <span
                className="stage-dot"
                style={{ backgroundColor: stage.color }}
              />
              <span className="stage-count">{stage.count}</span>
              <span className="stage-label">{stage.label}</span>
            </div>
            {index < stages.length - 1 && <div className="stage-divider" />}
          </div>
        ))}
      </div>
      <button
        className="hide-icon-btn"
        onClick={() => setIsHidden(true)}
        title="Hide pipeline"
      >
        <EyeOff size={18} />
      </button>
    </div>
  );
};

export default Strip;
