import { MdAdd } from "react-icons/md";
import { FiArrowRightCircle } from "react-icons/fi";
import "../../styles/Investor.css";
import "../../styles/Property.css";
import type { UserPropertyStatsProperty } from "../../types/investor";
import { useNavigate } from "react-router-dom";

type SavedPropertiesProps = {
  properties: UserPropertyStatsProperty[];
  isLoading?: boolean; // add loading state
};

const SavedProperties = ({
  properties = [],
  isLoading = false,
}: SavedPropertiesProps) => {
  const slots = [0, 1];
  const navigate = useNavigate();

  return (
    <div className="right-Dashboard-card">
      <div className="main-header d-flex justify-content-between align-items-center">
        <h2>Saved Properties</h2>
        <button className="view-all-btn"></button>
      </div>

      <div className="d-flex flex-column gap-3 mt-3">
        {slots.map((index) => {
          // Show skeleton if loading
          if (isLoading) {
            return (
              <div
                className="property-card skeleton-card"
                key={`skeleton-${index}`}
              >
                <div className="skeleton skeleton-address" />
                <div className="skeleton skeleton-status" />
                <div className="skeleton skeleton-button" />
              </div>
            );
          }

          const property = properties[index];

          if (property) {
            return (
              <div className="property-card" key={index}>
                <div className="property-details">
                  <div className="d-flex justify-content-between align-items-start w-100">
                    <div>
                      <p className="property-label-text">Address</p>
                      <h3 className="property-address-text">
                        {property.address}
                      </h3>
                    </div>

                    <div className="status-badge-container">
                      <span
                        className={`status-badge ${property.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {property.status}
                      </span>
                    </div>
                  </div>

                  <div className="property-action-row mt-2">
                    <button
                      className="get-reviews-btn"
                      onClick={() => navigate("/investor/view-properties")}
                    >
                      View More
                      <FiArrowRightCircle className="review-arrow-icon" />
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          // fallback empty state
          return (
            <div
              className="property-card empty-state-card"
              key={`empty-${index}`}
            >
              <div className="empty-card-content">
                <div className="add-icon-container">
                  <MdAdd size={24} />
                </div>
                <div className="empty-text-container">
                  <p className="no-record-label">No property record found</p>
                  <button
                    className="add-property-link-btn"
                    onClick={() => navigate("/investor/add-property")}
                  >
                    + Add New Property
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedProperties;
