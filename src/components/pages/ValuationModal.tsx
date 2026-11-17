import { formatCurrency } from "../../utils/formatConversion";
import { capitalize } from "../../utils/StringUtils";
import type { ValuationNode } from "../../types/Valuation";

interface ValuationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ValuationNode | null;
}

const ValuationModal = ({ isOpen, onClose, data }: ValuationModalProps) => {
  if (!isOpen || !data) return null;

  const details = data.propertyDetails;
  const aiVal = data.aiValuation;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close"
          onClick={onClose}
          style={{ fontSize: "1.75rem", padding: 0, cursor: "pointer" }}
        >
          &times;
        </button>

        <div className="detail-section">
          <p className="modal-info">Property Valuation Details</p>
          <h2 className="modal-address">{data.propertyAddress || "N/A"}</h2>
          <span className="modal-info">
            Property ID: {data.propertyId || "N/A"}
          </span>
        </div>

        {aiVal && (
          <div className="map-popup-avm">
            <div className="avm-item low">
              <div className="avm-circle">
                {formatCurrency(aiVal.lowEstimate)}
              </div>
              <div className="avm-label">Low Estimate</div>
            </div>

            <div className="avm-line red"></div>

            <div className="avm-item mid">
              <div className="avm-circle">
                {formatCurrency(data.predictedValue)}
              </div>
              <div className="avm-label">Predicted Value</div>
            </div>

            <div className="avm-line green"></div>

            <div className="avm-item high">
              <div className="avm-circle">
                {formatCurrency(aiVal.highEstimate)}
              </div>
              <div className="avm-label">High Estimate</div>
            </div>
          </div>
        )}

        {aiVal?.explanation && (
          <div className="property-details-section">
            <h2>AI Valuation Analysis</h2>
            <p style={{ margin: 0, fontStyle: "italic", color: "#555" }}>
              "{aiVal.explanation}"
            </p>
          </div>
        )}

        {details && (
          <div className="property-details-section">
            <h2>Property Specifications</h2>
            <table className="detail-table">
              <tbody>
                <tr>
                  <th>Property Type</th>
                  <td>{details.propertyType || "N/A"}</td>
                </tr>
                <tr>
                  <th>Year Built</th>
                  <td>{details.yearBuilt || "N/A"}</td>
                </tr>
                <tr>
                  <th>Square Feet</th>
                  <td>
                    {details.sqft
                      ? `${details.sqft.toLocaleString()} sqft`
                      : "0"}
                  </td>
                </tr>
                <tr>
                  <th>Beds / Baths</th>
                  <td>
                    {details.beds ?? "N/A"} Beds | {details.baths ?? "N/A"}{" "}
                    Baths
                  </td>
                </tr>
                <tr>
                  <th>Zip Code</th>
                  <td>{details.zipCode || "N/A"}</td>
                </tr>
                <tr>
                  <th>Estimated Value</th>
                  <td>
                    {details.estimatedValue
                      ? formatCurrency(details.estimatedValue)
                      : "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {aiVal?.topFeatures && aiVal.topFeatures.length > 0 && (
          <div className="property-details-section">
            <h2>Top Value Drivers</h2>
            <table className="detail-table">
              <thead>
                <tr>
                  <th style={{ width: "60%" }}>Feature</th>
                  <th>Impact Score</th>
                </tr>
              </thead>
              <tbody>
                {aiVal.topFeatures.map((feat, index: number) => {
                  const impactStr = feat?.impact || "";
                  const isNegative = impactStr.startsWith("-");
                  return (
                    <tr key={index}>
                      <td>{capitalize(feat?.feature || "")}</td>
                      <td
                        style={{
                          fontWeight: "bold",
                          color: isNegative ? "#e53935" : "#43a047",
                        }}
                      >
                        {impactStr}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValuationModal;
