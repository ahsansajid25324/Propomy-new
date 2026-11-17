import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client/react";
import {
  AlertTriangle,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  DollarSign,
  MapPin,
  TrendingUp,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { GET_COMPARABLES_REPORT } from "../../../apollo/graphql/queries/Reports";
import "../../../styles/ValuationReport.css";
import type {
  GetComparablesReportData,
  GetComparablesReportVars,
  ComparablesReportResponse,
  ComparableProperty,
} from "../../../types/Reports";
import { ComparablesReportPDFDocument } from "../../../components/pages/ComparablesReportPDFDocument";
import { PDFDownloadLink } from "@react-pdf/renderer";

interface CompsResultState {
  reportData?: ComparablesReportResponse["reportData"];
  address?: string;
  generatedAt?: string;
}

export const ComparablesReportResult: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useLocation() as { state: CompsResultState | null };

  const urlAddress = searchParams.get("address");
  const rawSessionId = searchParams.get("sessionId");
  const paymentStatus = searchParams.get("payment");

  const storageKey = urlAddress
    ? `comps_session_${urlAddress.trim().toLowerCase()}`
    : null;

  const [sessionId, setSessionId] = useState<string | null>(() => {
    if (rawSessionId) return rawSessionId;
    return storageKey ? localStorage.getItem(storageKey) : null;
  });

  const [reportResponse, setReportResponse] =
    useState<ComparablesReportResponse | null>(null);

  const [fetchReport, { loading }] = useLazyQuery<
    GetComparablesReportData,
    GetComparablesReportVars
  >(GET_COMPARABLES_REPORT, {
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
    if (state?.reportData) {
      setReportResponse({
        success: true,
        message: "",
        reportData: state.reportData,
      });
      return;
    }

    if (paymentStatus === "success" && sessionId && urlAddress) {
      let attempts = 0;
      let timeoutId: NodeJS.Timeout;

      const loadReport = async () => {
        try {
          const { data } = await fetchReport({
            variables: { input: { address: urlAddress, sessionId } },
          });

          const res = data?.getComparablesReport;
          if (res?.success && res.reportData) {
            setReportResponse(res);
          } else if (attempts < 3) {
            attempts++;
            timeoutId = setTimeout(loadReport, 2000);
          } else if (res) {
            setReportResponse(res);
          }
        } catch (err) {
          console.error("Error fetching comparables report:", err);
        }
      };

      loadReport();
      return () => clearTimeout(timeoutId);
    }
  }, [paymentStatus, sessionId, urlAddress, state, fetchReport]);

  if (
    loading ||
    (!reportResponse && paymentStatus === "success" && sessionId)
  ) {
    return (
      <div className="vrr-root">
        <section className="vrr-hero">
          <div className="vrr-hero-inner">
            <p className="vrr-eyebrow">Comparables Report</p>
            <h1 className="vrr-address">
              {urlAddress || "Preparing report..."}
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
              Unlocking your comparables report…
            </h2>
            <p
              className="text-muted"
              style={{ margin: 0, fontSize: "0.95rem" }}
            >
              Analyzing nearby recent sales, calculating similarity scores, and
              running price adjustments...
            </p>
          </section>
        </main>
      </div>
    );
  }

  if (
    paymentStatus === "canceled" ||
    (!reportResponse && !state) ||
    !sessionId
  ) {
    navigate("/reports/comps");
    return null;
  }

  const address = urlAddress || state?.address || "";
  const reportData = reportResponse?.reportData || state?.reportData || null;
  const generatedAt = state?.generatedAt || new Date().toISOString();

  if (!reportData) {
    return (
      <div className="vrr-root">
        <section className="vrr-hero">
          <div className="vrr-hero-inner">
            <button
              type="button"
              className="vrr-back"
              onClick={() => navigate("/reports/comps")}
            >
              &larr; New comparables report
            </button>
            <p className="vrr-eyebrow">Comparables Report</p>
            <h1 className="vrr-address">{address}</h1>
          </div>
        </section>
        <main className="vrr-main">
          <section className="vrr-card" style={{ padding: "2.5rem 2rem" }}>
            <h2 className="vrr-card-title">
              We couldn&rsquo;t generate this report
            </h2>
            <p className="text-muted" style={{ margin: 0 }}>
              {reportResponse?.message ||
                "Something went wrong while generating this report."}
            </p>
          </section>
        </main>
      </div>
    );
  }

  const { subject, comps = [], summary, meta } = reportData;

  return (
    <div className="vrr-root">
      <section className="vrr-hero">
        <div className="vrr-hero-inner">
          <button
            type="button"
            className="vrr-back"
            onClick={() => navigate("/reports/comps")}
          >
            &larr; New comparables report
          </button>
          <p className="vrr-eyebrow">Comparables Report</p>
          <h1 className="vrr-address">{address}</h1>
          {generatedAt && (
            <p className="vrr-generated">
              Generated {new Date(generatedAt).toLocaleString()}
            </p>
          )}
        </div>
      </section>

      <main className="vrr-main">
        {/* FALLBACK WARNING BANNER */}
        {meta.fallbackApplied && (
          <section
            className="vrr-card"
            style={{
              borderLeft: "4px solid #eab308",
              background: "#fefce8",
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
            }}
          >
            <AlertTriangle
              size={24}
              style={{ color: "#ca8a04", flexShrink: 0, marginTop: "2px" }}
            />
            <div>
              <h2
                className="vrr-card-title"
                style={{ color: "#854d0e", marginBottom: "0.25rem" }}
              >
                Expanded Search Criteria Applied
              </h2>
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#451a03" }}>
                {meta.fallbackMessage ||
                  `Fewer than 3 comps matched default params. Radius widened to ${meta.searchParamsUsed.maxRadiusMiles} mi and timeframe to ${meta.searchParamsUsed.maxDaysBack} days.`}
              </p>
            </div>
          </section>
        )}

        {/* SUBJECT PROPERTY SNAPSHOT & SUMMARY */}
        <section className="vrr-card">
          <h2 className="vrr-card-title">Subject Property Baseline</h2>
          <dl className="vrr-details" style={{ marginTop: "1rem" }}>
            <div className="vrr-detail">
              <dt>Address</dt>
              <dd>{subject.address || address}</dd>
            </div>
            <div className="vrr-detail">
              <dt>Beds / Baths</dt>
              <dd>
                {subject.beds ?? "N/A"} bd / {subject.baths ?? "N/A"} ba
              </dd>
            </div>
            <div className="vrr-detail">
              <dt>Living Area</dt>
              <dd>
                {subject.sqft ? `${subject.sqft.toLocaleString()} sqft` : "N/A"}
              </dd>
            </div>
            <div className="vrr-detail">
              <dt>Year Built</dt>
              <dd>{subject.yearBuilt || "N/A"}</dd>
            </div>
            <div className="vrr-detail">
              <dt>Lot Size</dt>
              <dd>
                {subject.lotSqft
                  ? `${subject.lotSqft.toLocaleString()} sqft`
                  : subject.lotAcres
                    ? `${subject.lotAcres} acres`
                    : "N/A"}
              </dd>
            </div>
            <div className="vrr-detail">
              <dt>Baseline $/sqft</dt>
              <dd>
                {subject.pricePerSqftBaseline
                  ? `$${Number(subject.pricePerSqftBaseline).toFixed(2)}/sqft`
                  : "N/A"}
              </dd>
            </div>
          </dl>
        </section>

        {/* VALUATION & MARKET SUMMARY CARD */}
        <section className="vrr-card" style={{ background: "#f8fafc" }}>
          <h2 className="vrr-card-title">Comps Summary & Valuation Range</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "1rem",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            >
              <p
                className="text-muted"
                style={{ margin: 0, fontSize: "0.85rem" }}
              >
                Suggested Range
              </p>
              <p
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0.2rem 0 0",
                }}
              >
                {summary.suggestedRangeLow && summary.suggestedRangeHigh
                  ? `$${summary.suggestedRangeLow.toLocaleString()} - $${summary.suggestedRangeHigh.toLocaleString()}`
                  : "N/A"}
              </p>
            </div>

            <div
              style={{
                background: "#fff",
                padding: "1rem",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            >
              <p
                className="text-muted"
                style={{ margin: 0, fontSize: "0.85rem" }}
              >
                Median $/sqft
              </p>
              <p
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0.2rem 0 0",
                }}
              >
                {summary.medianPricePerSqft
                  ? `$${Number(summary.medianPricePerSqft).toFixed(2)}/sqft`
                  : "N/A"}
              </p>
            </div>

            <div
              style={{
                background: "#fff",
                padding: "1rem",
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
              }}
            >
              <p
                className="text-muted"
                style={{ margin: 0, fontSize: "0.85rem" }}
              >
                Comps Analyzed
              </p>
              <p
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0.2rem 0 0",
                }}
              >
                {summary.compsFound}
              </p>
            </div>
          </div>
        </section>

        {/* COMPARABLE PROPERTIES LIST */}
        <section className="vrr-card">
          <h2 className="vrr-card-title">
            Comparable Properties ({comps.length})
          </h2>
          <p
            className="text-muted"
            style={{ fontSize: "0.9rem", marginBottom: "1.25rem" }}
          >
            Ranked by multi-factor similarity score (proximity, size delta, and
            sale recency).
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {comps.map((comp, idx) => (
              <CompItemCard key={comp.id || idx} comp={comp} rank={idx + 1} />
            ))}
          </div>
        </section>

        {/* ACTION BUTTONS */}
        <div className="vrr-actions">
          <PDFDownloadLink
            document={
              <ComparablesReportPDFDocument
                address={address}
                reportResponse={reportResponse!}
                generatedAt={generatedAt}
              />
            }
            fileName={`Comparables_Report_${address.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`}
            className="vrr-btn is-primary text-center"
            style={{ textDecoration: "none" }}
          >
            {({ loading }) =>
              loading ? "Generating PDF..." : "Download PDF Report"
            }
          </PDFDownloadLink>
          <button
            type="button"
            className="vrr-btn"
            onClick={() => navigate("/reports/comps")}
          >
            Look up another property
          </button>
        </div>
      </main>
    </div>
  );
};

const CompItemCard: React.FC<{ comp: ComparableProperty; rank: number }> = ({
  comp,
  rank,
}) => {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "1.25rem",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                background: "#0d6efd",
                color: "#fff",
                padding: "0.15rem 0.45rem",
                borderRadius: "4px",
              }}
            >
              #{rank}
            </span>
            <h3
              style={{
                fontSize: "1.1rem",
                margin: 0,
                color: "#1e293b",
              }}
            >
              {comp.address}
            </h3>
            {comp.isStale && (
              <span
                style={{
                  fontSize: "0.7rem",
                  background: "#fef3c7",
                  color: "#92400e",
                  padding: "0.15rem 0.4rem",
                  borderRadius: "4px",
                  fontWeight: 600,
                }}
              >
                &gt;12 mo old
              </span>
            )}
          </div>

          <p
            className="text-muted"
            style={{
              margin: "0.4rem 0 0",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <Bed size={14} className="text-secondary" />
              {comp.beds ?? "N/A"} bd
            </span>
            ·
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <Bath size={14} className="text-secondary" />
              {comp.baths ?? "N/A"} ba
            </span>
            ·
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <Maximize2 size={14} className="text-secondary" />
              {comp.sqft ? `${comp.sqft.toLocaleString()} sqft` : "N/A"}
            </span>
            ·
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <Calendar size={14} className="text-secondary" />
              Built {comp.yearBuilt ?? "N/A"}
            </span>
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#15803d",
              background: "#dcfce7",
              padding: "0.25rem 0.6rem",
              borderRadius: "4px",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <CheckCircle2 size={14} />
            {comp.similarity.total}% Match
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "0.75rem",
          marginTop: "1rem",
          paddingTop: "0.75rem",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>
            Sale Price
          </span>
          <p
            style={{
              margin: 0,
              fontWeight: 600,
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              gap: "0.2rem",
            }}
          >
            <DollarSign size={14} className="text-muted" />
            {comp.salePrice ? comp.salePrice.toLocaleString() : "N/A"}
          </p>
        </div>

        <div>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>
            $/sqft
          </span>
          <p
            style={{
              margin: 0,
              fontWeight: 600,
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              gap: "0.2rem",
            }}
          >
            <Tag size={14} className="text-muted" />
            {comp.pricePerSqft
              ? `$${Number(comp.pricePerSqft).toFixed(2)}`
              : "N/A"}
          </p>
        </div>

        <div>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>
            Adjusted Price
          </span>
          <p
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "#0369a1",
              display: "flex",
              alignItems: "center",
              gap: "0.2rem",
            }}
          >
            <TrendingUp size={14} />
            {comp.adjustedPrice
              ? `$${comp.adjustedPrice.toLocaleString()}`
              : "N/A"}
          </p>
        </div>

        <div>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>
            Distance & Sale Date
          </span>
          <p
            style={{
              margin: 0,
              fontWeight: 500,
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <MapPin size={13} className="text-muted" />
            {comp.distanceMiles !== null
              ? `${comp.distanceMiles} mi`
              : "N/A"} · {comp.saleDate || "N/A"}
          </p>
        </div>
      </div>

      {/* SIMILARITY BREAKDOWN */}
      <div
        style={{
          marginTop: "0.75rem",
          padding: "0.5rem 0.75rem",
          background: "#fff",
          borderRadius: "4px",
          border: "1px solid #cbd5e1",
          fontSize: "0.8rem",
        }}
      >
        <strong>Similarity Score Drivers:</strong> Distance:{" "}
        {comp.similarity.distance}/40 pts · Sqft: {comp.similarity.size}/35 pts
        · Recency: {comp.similarity.recency}/25 pts
      </div>

      {/* ADJUSTMENTS LIST */}
      {comp.adjustments.length > 0 && (
        <div style={{ marginTop: "0.75rem" }}>
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#475569",
              display: "block",
              marginBottom: "0.25rem",
            }}
          >
            Value Adjustments ({comp.adjustments.length}):
          </span>
          <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.8rem" }}>
            {comp.adjustments.map((adj, i) => (
              <li
                key={i}
                style={{ color: adj.amount >= 0 ? "#166534" : "#991b1b" }}
              >
                <strong>{adj.label}:</strong>{" "}
                {adj.amount >= 0
                  ? `+$${adj.amount.toLocaleString()}`
                  : `-$${Math.abs(adj.amount).toLocaleString()}`}{" "}
                ({adj.reason})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ComparablesReportResult;
