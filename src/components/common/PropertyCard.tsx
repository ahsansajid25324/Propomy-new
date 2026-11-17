import { FiHeart, FiShare2 } from "react-icons/fi";
import "../../styles/Search.css";

interface PropertyCardProps {
  price: number;
  beds: number;
  baths: number;
  size: number;
  lotSize: number;
  address: string;
  tag: "Active" | "Listed";
  images: string[];
  estEquity: number;
  avgComps: number;
  estRent: number;
  score: number; // e.g., 83 for 83%
}

const PropertyCard = ({
  price,
  beds,
  baths,
  size,
  lotSize,
  address,
  tag,
  images,
  estEquity,
  avgComps,
  estRent,
  score,
}: PropertyCardProps) => {
  return (
    <div className="search-property-card updated">
      <div className="search-property-image-wrapper">
        <img src={images[0]} alt="property" />
        <span
          className={`search-property-tag ${
            tag === "Active" ? "active" : "listed"
          }`}
        >
          {tag}
        </span>
        {images.length > 1 && (
          <span className="search-image-count">+{images.length - 1}</span>
        )}
      </div>

      <div className="search-property-content">
        <div className="search-price-row">
          <div>
            <h2 className="property-price">${price.toLocaleString()}</h2>
            <p className="property-address">{address}</p>
          </div>
          <div className="search-icons">
            <FiHeart />
            <FiShare2 />
          </div>
        </div>

        <hr className="property-divider" />

        <div className="search-property-meta-row">
          <span>🛏 {beds}</span>
          <span>🛁 {baths}</span>
          <span>📐 {size.toLocaleString()} SQFT</span>
          <span>🏡 {lotSize.toLocaleString()} LOT</span>
        </div>

        <div className="search-property-stats-row">
          <div className="property-stat">
            <span className="property-score-badge">{score}%</span>
            <div>
              <div className="property-stat-label">EST. EQUITY</div>
              <div className="property-stat-value">
                ${estEquity.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="property-stat">
            <div>
              <div className="property-stat-label">AVG. COMPS</div>
              <div className="property-stat-value">
                ${avgComps.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="property-stat">
            <div>
              <div className="property-stat-label">EST. RENT</div>
              <div className="property-stat-value">
                ${estRent.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
