import { formatPriceShort } from "../../utils/formatConversion";
import type { PropertyDetail } from "../../types/Map";

interface PropertyPopupContentProps {
  detail: PropertyDetail;
  lat: number;
  lng: number;
  onAddressClick: (detail: PropertyDetail, lat: number, lng: number) => void;
}

export function PropertyPopupContent({
  detail,
  onAddressClick,
  lat,
  lng,
}: PropertyPopupContentProps) {
  const formatLotSize = (lotInfo: string | number | undefined) => {
    if (!lotInfo) return "0 Acres";
    const numericLot =
      typeof lotInfo === "string"
        ? parseFloat(lotInfo.replace(/,/g, ""))
        : lotInfo;
    if (isNaN(numericLot)) return `${lotInfo} Acres`;
    return `${numericLot >= 100 ? (numericLot / 43560).toFixed(2) : numericLot} Acres`;
  };

  return (
    <div className="map-popup-card">
      <div className="map-popup-image-container">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
          alt="Property"
          className="map-popup-image"
        />
      </div>
      <div className="map-popup-content">
        <div className="map-popup-price">
          ${detail.estimatedValue?.toLocaleString() ?? "N/A"}
        </div>
        <div
          className="map-popup-address clickable"
          onClick={(e) => {
            e.stopPropagation();
            onAddressClick(detail, lat, lng);
          }}
        >
          {detail.addressLabel}
        </div>
        <div className="map-popup-details">
          <span>🛏 {detail.bedrooms ?? "0"}</span>
          <span>🛁 {detail.bathrooms ?? "0"}</span>
          <span>
            {detail.buildingSquareFeet ? `${detail.buildingSquareFeet} Sq Ft` : "0 Sq Ft"}
          </span>
          <span>{formatLotSize(detail.lotInfo)}</span>
        </div>

        <div className="map-popup-avm">
          <div className="avm-item low">
            <span className="avm-circle">{formatPriceShort(detail.avmMin)}</span>
            <span className="avm-label">Low</span>
          </div>
          <div className="avm-line red" />
          <div className="avm-item mid">
            <span className="avm-circle">{formatPriceShort(detail.avm)}</span>
            <span className="avm-label">Mid</span>
          </div>
          <div className="avm-line green" />
          <div className="avm-item high">
            <span className="avm-circle">{formatPriceShort(detail.avmMax)}</span>
            <span className="avm-label">High</span>
          </div>
        </div>

        <div className="map-popup-equity-row">
          <span className="map-popup-equity-badge">
            {detail.equityPercentage?.toFixed(0)}%
          </span>
          <div className="d-flex gap-2">
            <div className="d-flex flex-column justify-content-between">
              <span className="mb-1">EST EQUITY</span>
              <span><b>${detail.equity?.toLocaleString()}</b></span>
            </div>
            <div className="d-flex flex-column justify-content-between">
              <span className="mb-1">AVG COMPS</span>
              <span><b>${detail.roundedAverageCompValue?.toLocaleString()}</b></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}