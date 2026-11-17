interface taxInfo {
  assessedImprovementValue?: number;
  assessedLandValue?: number;
  assessedValue?: number;
  assessmentYear?: number;
  marketImprovementValue?: number;
  marketLandValue?: number;
  marketValue?: number;
  propertyId?: number;
  taxAmount?: string;
  taxDelinquentYear?: number | null;
  year?: number;
}
interface CurrentMortgage {
  amount?: number;
  recordingDate?: string;
  lenderName?: string;
  loanType?: string;
  term?: number | string;
  termType?: string;
  granteeName?: string;
}

interface PropertyDetail {
  id: string | number;
  estimatedValue: number;
  bathrooms?: number;
  bedrooms?: number;
  latitude: number;
  owner?: string;
  longitude: number;
  buildingSquareFeet?: number;
  propertyUse?: string;
  lotNumber?: number;
  lotWidthFeet?: number;
  ownerSecond?: string;
  basementType?: string;
  zoning?: string;
  apn?: string;
  porchType?: string;
  propertyClass?: string;
  heatingType?: string;
  stories?: number;
  lotInfo?: number;
  addressLabel?: string;
  equity?: number;
  equityPercentage?: number;
  taxInfo?: taxInfo;
  currentMortgages?: CurrentMortgage[];
}
interface PropertyDetailModalProps {
  open: boolean;
  onClose: () => void;
  detail: PropertyDetail | null;
}
import "../../styles/Map.css";
import logo from "../../assets/logo.png";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
export function PropertyDetailModal({
  open,
  onClose,
  detail,
}: PropertyDetailModalProps) {
  if (!open || !detail) return null;
  const pinIcon = new L.Icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const isValidSecondOwner =
    detail.ownerSecond &&
    detail.ownerSecond.trim() !== "" &&
    detail.ownerSecond.trim().toLowerCase() !== "n/a";

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <div className="d-flex gap-2">
          <div>
            <img src={logo} className="dashboard-logo" />
          </div>
          <div className="detail-section">
            <h2>${detail.estimatedValue}</h2>
            <div className="modal-address">{detail.addressLabel}</div>
            <div className="modal-info">
              {detail?.propertyUse} {detail.bedrooms ?? 0} Beds{" "}
              {detail.bathrooms ?? 0} Baths {detail.buildingSquareFeet ?? 0}{" "}
              sqft
            </div>
          </div>
        </div>
        <div className="modal-map">
          <MapContainer
            center={[detail.latitude, detail.longitude]}
            zoom={16}
            scrollWheelZoom={false}
            dragging={false}
            doubleClickZoom={false}
            className="modal-map-container"
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker
              position={[detail.latitude, detail.longitude]}
              icon={pinIcon}
            />
          </MapContainer>
        </div>
        <div className="property-details-section">
          <h2>Ownership Information</h2>
          <table className="detail-table table-flex">
            <tbody>
              <tr>
                <th>Owner 1 Name</th>
                <td>{detail?.owner ?? "N/A"}</td>
              </tr>
              {isValidSecondOwner && (
                <tr>
                  <th>Owner 2 Name</th>
                  <td>{detail?.ownerSecond ?? "N/A"}</td>
                </tr>
              )}
              <tr>
                <th>Ownership Type</th>
                <td>
                  {(!detail.owner ||
                    detail.owner.trim().toLowerCase() === "n/a") &&
                  !isValidSecondOwner
                    ? "N/A"
                    : isValidSecondOwner
                      ? "Multiple Owners"
                      : "Sole Owner"}
                </td>{" "}
              </tr>
              <tr>
                <th>Mailing Address</th>

                <td>{detail?.addressLabel ?? "N/A"}</td>
              </tr>
            </tbody>
          </table>

          <h2 className="mt-0 mt-md-3">Property Characteristics</h2>
          <table className="detail-table table-flex">
            <tbody>
              <tr>
                <th>Bedrooms</th>
                <td>{detail?.bedrooms ?? 0}</td>
              </tr>
              <tr>
                <th>Total Bathrooms</th>
                <td>{detail?.bathrooms ?? 0}</td>
              </tr>
              <tr>
                <th>Heating Type</th>
                <td>{detail?.heatingType ?? "N/A"}</td>
              </tr>
              <tr>
                <th>Basement Type</th>
                <td>{detail?.basementType ?? "N/A"}</td>
              </tr>
              <tr>
                <th>Porch Type</th>
                <td>{detail?.porchType ?? "N/A"}</td>
              </tr>
              <tr>
                <th>Building Class Type</th>
                <td>{detail?.propertyClass ?? "N/A"}</td>
              </tr>
              <tr>
                <th>Number of Stories</th>
                <td>{detail?.stories ?? 0}</td>
              </tr>
            </tbody>
          </table>

          <h2 className="mt-0 mt-md-3">Land/Local Information</h2>
          <table className="detail-table table-flex">
            <tbody>
              <tr>
                <th>APN</th>
                <td>{detail?.apn ?? "N/A"}</td>
              </tr>
              <tr>
                <th>Building Type</th>
                <td>{detail?.propertyUse ?? "N/A"}</td>
              </tr>
              <tr>
                <th>Zoning</th>
                <td>{detail?.zoning ?? "N/A"}</td>
              </tr>
              <tr>
                <th>Lot Number</th>
                <td>{detail?.lotNumber ?? "N/A"}</td>
              </tr>
              <tr>
                <th>Lot Width</th>
                <td>{detail?.lotWidthFeet ?? "N/A"}</td>
              </tr>
            </tbody>
          </table>

          {detail.currentMortgages && detail.currentMortgages.length > 0 && (
            <>
              <h2 className="mt-0 mt-md-3">Current Mortgage Information</h2>

              {detail.currentMortgages.map((mortgage, index) => (
                <table key={index} className="detail-table table-flex">
                  <tbody>
                    <tr>
                      <th>Recording Date</th>
                      <td>{mortgage.recordingDate ?? "N/A"}</td>
                    </tr>

                    <tr>
                      <th>Term</th>
                      <td>
                        {mortgage.term
                          ? `${mortgage.term} ${mortgage.termType ?? ""}`
                          : "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <th>Term Type</th>
                      <td>{mortgage.termType ?? "N/A"}</td>
                    </tr>

                    <tr>
                      <th>Loan Type</th>
                      <td>{mortgage.loanType ?? "N/A"}</td>
                    </tr>

                    <tr>
                      <th>Mortgage #{index + 1} Amount</th>
                      <td>
                        {mortgage.amount !== undefined &&
                        mortgage.amount !== null
                          ? `$${Number(mortgage.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : "$ N/A"}
                      </td>
                    </tr>

                    <tr>
                      <th>Lender Name</th>
                      <td>{mortgage.lenderName ?? "N/A"}</td>
                    </tr>
                    <tr>
                      <th>Grantee Name</th>
                      <td>{mortgage.granteeName ?? "N/A"}</td>
                    </tr>
                  </tbody>
                </table>
              ))}
            </>
          )}

          <h2 className="mt-0 mt-md-3">Tax Assessment Information</h2>
          <table className="detail-table table-flex">
            <tbody>
              <tr>
                <th>Tax Assessed Value</th>
                <td>{detail?.taxInfo?.assessedValue ?? "N/A"}</td>
              </tr>
              <tr>
                <th> Assessed Land Value</th>
                <td>{detail?.taxInfo?.assessedLandValue ?? "N/A"}</td>
              </tr>
              <tr>
                <th> Assessed Improvement Value</th>
                <td>{detail?.taxInfo?.assessedImprovementValue ?? "N/A"}</td>
              </tr>
              <tr>
                <th> Assessment Year</th>
                <td>{detail?.taxInfo?.assessmentYear ?? "N/A"}</td>
              </tr>
              <tr>
                <th> Tax Year</th>
                <td>{detail?.taxInfo?.year ?? "N/A"}</td>
              </tr>
              <tr>
                <th> Market Total Value</th>
                <td>{detail?.taxInfo?.marketValue ?? "N/A"}</td>
              </tr>{" "}
              <tr>
                <th> Market Land Value</th>
                <td>{detail?.taxInfo?.marketLandValue ?? "N/A"}</td>
              </tr>
              <tr>
                <th> Market Improvement Value</th>
                <td>{detail?.taxInfo?.marketImprovementValue ?? "N/A"}</td>
              </tr>
              <tr>
                <th>Property Tax</th>
                <td>{detail?.taxInfo?.taxAmount ?? "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
