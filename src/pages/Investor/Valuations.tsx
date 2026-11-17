import { useState } from "react";
import Pagination from "../../components/common/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { useQuery } from "@apollo/client/react";
import { GET_RECENT_VALUATIONS } from "../../apollo/graphql/queries/Valuation";
import type {
  RecentValuationsData,
  RecentValuationsVariables,
  ValuationNode,
} from "../../types/Valuation";
import "../../styles/Property.css";
import { formatCurrency } from "../../utils/formatConversion";
import ValuationModal from "../../components/pages/ValuationModal";
import ExportModal from "../../components/pages/ExportModal";
import { Button } from "react-bootstrap";
import { useFeatureFlags } from "../../hooks/useFeatureFlag";
const RECORDS_PER_PAGE = 10;

const Valuations = () => {
  const { isExportLimitReached } = useFeatureFlags();

  const { currentPage, handlePageChange } = usePagination(RECORDS_PER_PAGE);

  const [selectedValuation, setSelectedValuation] =
    useState<ValuationNode | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const offset = (currentPage - 1) * RECORDS_PER_PAGE;

  const { data, loading } = useQuery<
    RecentValuationsData,
    RecentValuationsVariables
  >(GET_RECENT_VALUATIONS, {
    variables: {
      input: {
        limit: RECORDS_PER_PAGE,
        offset: offset,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  const isLoading = loading && !data;
  const valuationRecords = data?.recentValuations?.edges || [];
  const totalCount = data?.recentValuations?.pageInfo?.totalCount ?? 0;

  const handleExportConfirm = () => {
    setIsExportModalOpen(false);
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
        <h4 className="mb-0">Valuations</h4>
        <Button
          variant="primary"
          disabled={isExportLimitReached}
          onClick={() => setIsExportModalOpen(true)}
        >
          Export History
        </Button>
      </div>

      <div className="property-container">
        <div className="table-wrapper">
          <table className="property-table">
            <colgroup>
              <col style={{ width: "35%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>

            <thead>
              <tr>
                <th className="address-col">Address</th>
                <th>Predicted Value</th>
                <th>Low Estimate</th>
                <th>High Estimate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: valuationRecords.length || 5 }).map(
                    (_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <td key={j}>
                            <div className="skeleton"></div>
                          </td>
                        ))}
                      </tr>
                    ),
                  )
                : valuationRecords.map((edge, index) => {
                    const node = edge?.node;
                    if (!node) return null;

                    return (
                      <tr key={node.id || index}>
                        <td className="address-col" data-label="Address">
                          {node.propertyAddress || "N/A"}
                        </td>
                        <td data-label="Predicted Value">
                          {formatCurrency(node.predictedValue)}
                        </td>
                        <td data-label="Low Estimate">
                          {formatCurrency(node.aiValuation?.lowEstimate)}
                        </td>
                        <td data-label="High Estimate">
                          {formatCurrency(node.aiValuation?.highEstimate)}
                        </td>
                        <td
                          data-label="Actions"
                          className="d-flex align-items-center justify-content-between"
                        >
                          <Button
                            size="sm"
                            onClick={() => setSelectedValuation(node)}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          perPage={RECORDS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      </div>

      <ValuationModal
        isOpen={!!selectedValuation}
        onClose={() => setSelectedValuation(null)}
        data={selectedValuation}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onConfirm={handleExportConfirm}
      />
    </div>
  );
};

export default Valuations;
