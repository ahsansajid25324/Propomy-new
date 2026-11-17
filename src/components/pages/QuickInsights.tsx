import "../../styles/Investor.css";
import { FaChevronRight } from "react-icons/fa";
const insights = [
  {
    title: "Portfolio grew 17.8 % this year",
    subtitle: "17.8 %",
  },
  {
    title: "Top Contributor this year",
    subtitle: "Commercial",
  },
  {
    title: "Most Stable segment",
    subtitle: "Residential",
  },
];

interface QuickInsightsProps {
  className?: string;
}

const QuickInsights: React.FC<QuickInsightsProps> = ({ className = "" }) => (
  <div className={`quick-insights-card ${className}`}>
    <div className="quick-insights-title">Quick Insights</div>
    <div className="quick-insights-list">
      {insights.map((item, idx) => (
        <div className="quick-insights-item" key={idx}>
          <div className="quick-insights-bar" />
          <div className="quick-insights-content">
            <div className="quick-insights-item-title">{item.title}</div>
            <div className="quick-insights-item-subtitle">{item.subtitle}</div>
          </div>
          <div className="quick-insights-arrow">
            <FaChevronRight />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default QuickInsights;
