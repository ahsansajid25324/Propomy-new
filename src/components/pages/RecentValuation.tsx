import "../../styles/Investor.css";
import { useNavigate } from "react-router-dom";
import type { UserPropertyStatsRecentValuation } from "../../types/investor";

interface RecentValuationProps {
  recentValuations: UserPropertyStatsRecentValuation[];
  isLoading?: boolean;
}

const RecentValuation: React.FC<RecentValuationProps> = ({
  recentValuations,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const skeletonRows = Array.from({ length: 4 });

  return (
    <div className="left-Dashboard-card">
      <div className="main-header">
        <h2>Recent Valuations</h2>
        <button
          className="view-all-btn"
          onClick={() => navigate("/investor/valuations")}
        >
          View All
        </button>
      </div>

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              skeletonRows.map((_, index) => (
                <tr key={index}>
                  <td>
                    <div className="skeleton" />
                  </td>
                  <td>
                    <div className="skeleton" />
                  </td>
                </tr>
              ))
            ) : recentValuations && recentValuations.length > 0 ? (
              recentValuations.map((item, index) => (
                <tr key={`${item.propertyId}-${index}`}>
                  <td>{item.propertyAddress}</td>
                  <td>${item.predictedValue.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center" colSpan={2}>
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentValuation;