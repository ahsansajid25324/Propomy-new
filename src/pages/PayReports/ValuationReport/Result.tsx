import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client/react";
import { GET_VALUATION_REPORT } from "../../../apollo/graphql/queries/Reports";
import "../../../styles/ValuationReport.css";
import type {
  GetValuationReportData,
  GetValuationReportVars,
  ValuationReportResponse,
  ValuationResultState,
} from "../../../types/Reports";
import { capitalize, currency, tierClass } from "../../../utils/StringUtils";
import { pdf } from "@react-pdf/renderer";
import { ValuationPDFDocument } from "../../../components/pages/ValuationPDFDocument";
import type {
  PropertyByIdResponse,} from "../../../types/Property";

export const ValuationReportResult: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useLocation() as { state: ValuationResultState | null };

  const urlAddress = searchParams.get("address");
  const rawSessionId = searchParams.get("sessionId");
  const paymentStatus = searchParams.get("payment");

  const storageKey = urlAddress
    ? `val_session_${urlAddress.trim().toLowerCase()}`
    : null;

  const [sessionId, setSessionId] = useState<string | null>(() => {
    if (rawSessionId) return rawSessionId;
    return storageKey ? localStorage.getItem(storageKey) : null;
  });

  const [reportData, setReportData] = useState<ValuationReportResponse | null>(
    null,
  );

  const [fetchReport, { loading }] = useLazyQuery<
    GetValuationReportData,
    GetValuationReportVars
  >(GET_VALUATION_REPORT, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (rawSessionId && storageKey) {
      localStorage.setItem(storageKey, rawSessionId);
      setSessionId(rawSessionId);

      searchParams.delete("sessionId");
      setSearchParams(searchParams, { replace: true });
    }
  }, [rawSessionId, storageKey, searchParams, setSearchParams]);

  useEffect(() => {
    if (state?.propertyData || state?.prediction) {
      setReportData({
        success: true,
        propertyData: state.propertyData,
        prediction: state.prediction,
      });
      return;
    }

    if (paymentStatus === "success" && sessionId && urlAddress) {
      let attempts = 0;
      let timeoutId: NodeJS.Timeout;

      const loadReport = async () => {
        try {
          const { data } = await fetchReport({
            variables: {
              input: {
                address: urlAddress,
                sessionId,
              },
            },
          });

          const res = data?.getValuationReport;

          if (res?.success && (res.prediction || res.propertyData)) {
            setReportData(res);
          } else if (attempts < 5) {
            attempts++;
            timeoutId = setTimeout(loadReport, 2000);
          }
        } catch (err) {
          console.error("Error fetching unlocked report:", err);
        }
      };

      loadReport();

      return () => clearTimeout(timeoutId);
    }
  }, [paymentStatus, sessionId, urlAddress, state, fetchReport]);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const handleDownloadPdf = async (property: PropertyByIdResponse) => {
    setIsGeneratingPdf(true);
    try {
      const blob = await pdf(
        <ValuationPDFDocument
          property={property}
          prediction={prediction}
          propertyData={propertyData}
          generatedAt={generatedAt}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const fileName = (property.address || "Valuation_Report")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_");

      link.download = `${fileName}_report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (loading || (!reportData && paymentStatus === "success" && sessionId)) {
    return (
      <div className="vrr-root">
        <section className="vrr-hero">
          <div className="vrr-hero-inner">
            <p className="vrr-eyebrow">Valuation report</p>
            <h1 className="vrr-address">
              {urlAddress || "Preparing valuation..."}
            </h1>
          </div>
        </section>

        <main className="vrr-main">
          <section
            className="vrr-card"
            style={{
              textAlign: "center",
              padding: "3.5rem 2rem",
              marginTop: "2rem",
            }}
          >
            <div
              className="spinner-border text-primary mb-3"
              role="status"
              style={{ width: "2rem", height: "2rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <h2
              className="vrr-card-title"
              style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}
            >
              Unlocking your valuation report…
            </h2>
            <p
              className="text-muted"
              style={{ margin: 0, fontSize: "0.95rem" }}
            >
              Please wait while we prepare property details and process your
              request.
            </p>
          </section>
        </main>
      </div>
    );
  }

  if (paymentStatus === "canceled" || (!reportData && !state) || !sessionId) {
    navigate("/reports/valuation");
    return null;
  }

  const address = urlAddress || state?.address || "";
  const propertyData = reportData?.propertyData || state?.propertyData || null;
  const prediction = reportData?.prediction || state?.prediction || null;
  const generatedAt = state?.generatedAt || new Date().toISOString();

  const value = prediction?.valuation ?? prediction?.prediction ?? null;
  const low = prediction?.low_estimate ?? null;
  const high = prediction?.high_estimate ?? null;

  const markerPct =
    value !== null && low !== null && high !== null && high > low
      ? Math.min(100, Math.max(0, ((value - low) / (high - low)) * 100))
      : 50;

  const features = prediction?.top_features ?? [];
  const maxImpact = features.length
    ? Math.max(...features.map((f) => Math.abs(f.impact)))
    : 0;

  const details: Array<{ label: string; value: string }> = [
    { label: "Property Type", value: propertyData?.propertyType ?? "N/A" },
    {
      label: "Year built",
      value: propertyData?.yearBuilt?.toString() ?? "N/A",
    },
    { label: "Bedrooms", value: propertyData?.bedrooms?.toString() ?? "N/A" },
    { label: "Bathrooms", value: propertyData?.bathrooms?.toString() ?? "N/A" },
    {
      label: "Living area",
      value: propertyData?.livingSqFt
        ? `${propertyData.livingSqFt.toLocaleString()} sq ft`
        : "N/A",
    },
    { label: "Zip code", value: propertyData?.zipcode ?? "N/A" },
  ];

  const propertyForPdf: PropertyByIdResponse = {
    _id: sessionId || "VAL_REPORT",
    address: address,
    status: "Completed",
    showCalculations: false,
    avmLow: low ?? undefined,
    avmMid: value ?? undefined,
    avmHigh: high ?? undefined,
  };

  return (
    <div className="vrr-root">
      <section className="vrr-hero">
        <div className="vrr-hero-inner">
          <button
            type="button"
            className="vrr-back"
            onClick={() => navigate("/reports/valuation")}
          >
            <span aria-hidden="true">&larr;</span> New valuation
          </button>

          <p className="vrr-eyebrow">Valuation report</p>
          <h1 className="vrr-address">{address}</h1>
          {generatedAt && (
            <p className="vrr-generated">
              Generated {new Date(generatedAt).toLocaleString()}
            </p>
          )}
        </div>
      </section>

      <main className="vrr-main">
        {prediction && (
          <section className="vrr-card vrr-estimate">
            <div className="vrr-estimate-head">
              <div>
                <p className="vrr-label">Estimated value</p>
                <p className="vrr-value">{currency(value)}</p>
              </div>

              {prediction.quality_tier && (
                <span
                  className={`vrr-tier ${tierClass(prediction.quality_tier)}`}
                >
                  {capitalize(prediction.quality_tier)} Confidence
                  {typeof prediction.quality_score === "number" &&
                    ` · ${(prediction.quality_score * 100).toFixed(0)}%`}
                </span>
              )}
            </div>

            {low !== null && high !== null && (
              <div className="vrr-range">
                <div className="vrr-range-track">
                  <span
                    className="vrr-range-marker"
                    style={{ left: `${markerPct}%` }}
                    aria-hidden="true"
                  />
                </div>
                <div className="vrr-range-labels">
                  <span>
                    <em>Low</em>
                    {currency(low)}
                  </span>
                  <span className="vrr-range-high">
                    <em>High</em>
                    {currency(high)}
                  </span>
                </div>
              </div>
            )}

            {prediction.explanation && (
              <p className="vrr-explanation">
                {capitalize(prediction.explanation)}
              </p>
            )}
          </section>
        )}

        {features.length > 0 && (
          <section className="vrr-card">
            <h2 className="vrr-card-title">Key valuation drivers</h2>
            <ul className="vrr-drivers">
              {features.map((item, idx) => (
                <li className="vrr-driver" key={`${item.feature}-${idx}`}>
                  <span className="vrr-driver-name">
                    {capitalize(item.feature)}
                  </span>
                  <span className="vrr-driver-bar" aria-hidden="true">
                    <span
                      className={
                        item.impact >= 0 ? "is-positive" : "is-negative"
                      }
                      style={{
                        width: maxImpact
                          ? `${(Math.abs(item.impact) / maxImpact) * 100}%`
                          : "0%",
                      }}
                    />
                  </span>
                  <span
                    className={`vrr-driver-impact ${
                      item.impact >= 0 ? "is-positive" : "is-negative"
                    }`}
                  >
                    {item.impact}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {propertyData && (
          <section className="vrr-card">
            <h2 className="vrr-card-title">Property details</h2>
            <dl className="vrr-details">
              {details.map((row) => (
                <div className="vrr-detail" key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <div className="vrr-actions">
          <button
            type="button"
            className="vrr-btn is-primary"
            onClick={() => handleDownloadPdf(propertyForPdf)}
            disabled={isGeneratingPdf}
          >
            {isGeneratingPdf ? "Generating PDF..." : "Download PDF"}
          </button>
          <button
            type="button"
            className="vrr-btn"
            onClick={() => navigate("/reports/valuation")}
          >
            Value another property
          </button>
        </div>
      </main>
    </div>
  );
};

export default ValuationReportResult;
