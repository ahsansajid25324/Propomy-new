import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client/react";
import {
  AlertTriangle,
  Calendar,
  DollarSign,
  Percent,
  RefreshCw,
  Hammer,
  CheckCircle2,
  Bed,
  Bath,
  Ruler,
  Map,
  Receipt,
} from "lucide-react";
import { GET_DEAL_ANALYSIS_REPORT } from "../../../apollo/graphql/queries/Reports";
import "../../../styles/ValuationReport.css";
import type {
  GetDealAnalysisReportData,
  GetDealAnalysisReportVars,
  DealAnalysisReportResponse,
  PurchaseTermsInput,
} from "../../../types/Reports";
import {
  resolvePurchaseTerms,
  buildInvestmentMetrics,
  buildBrrrrSnapshot,
  buildFixFlipMargin,
} from "../../../utils/dealReport";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { DealAnalysisReportPDFDocument } from "../../../components/pages/DealReportDocument";

interface DealResultState {
  reportData?: DealAnalysisReportResponse["reportData"];
  address?: string;
  generatedAt?: string;
}

const formatCurrency = (
  value: number | null | undefined,
  opts?: Intl.NumberFormatOptions,
) => {
  if (value === null || value === undefined || Number.isNaN(value))
    return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    ...opts,
  }).format(value);
};

const formatPercent = (value: number | null | undefined, digits = 1) => {
  if (value === null || value === undefined || Number.isNaN(value))
    return "N/A";
  return `${value.toFixed(digits)}%`;
};

const parseEditableNumber = (raw: string): number | undefined => {
  if (raw.trim() === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
};

export const DealAnalysisResult: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useLocation() as { state: DealResultState | null };

  const urlAddress = searchParams.get("address");
  const rawSessionId = searchParams.get("sessionId");
  const paymentStatus = searchParams.get("payment");

  const storageKey = urlAddress
    ? `deal_session_${urlAddress.trim().toLowerCase()}`
    : null;

  const [sessionId, setSessionId] = useState<string | null>(() => {
    if (rawSessionId) return rawSessionId;
    return storageKey ? localStorage.getItem(storageKey) : null;
  });

  const [reportResponse, setReportResponse] =
    useState<DealAnalysisReportResponse | null>(null);

  const [termsInput, setTermsInput] = useState<PurchaseTermsInput>({});

  const [fetchReport, { loading }] = useLazyQuery<
    GetDealAnalysisReportData,
    GetDealAnalysisReportVars
  >(GET_DEAL_ANALYSIS_REPORT, {
    fetchPolicy: "network-only",
  });

  // Sync session ID to LocalStorage and clean up URL parameter
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

    if ((paymentStatus === "success" || sessionId) && urlAddress) {
      let attempts = 0;
      let timeoutId: NodeJS.Timeout;

      const loadReport = async () => {
        try {
          const { data } = await fetchReport({
            variables: {
              input: {
                address: urlAddress,
                sessionId: sessionId || undefined,
              },
            },
          });

          const res = data?.getDealAnalysisReport;
          if (res?.success && res.reportData) {
            setReportResponse(res);
          } else if (attempts < 3) {
            attempts++;
            timeoutId = setTimeout(loadReport, 2000);
          } else if (res) {
            setReportResponse(res);
          }
        } catch (err) {
          console.error("Error fetching deal analysis report:", err);
        }
      };

      loadReport();

      return () => clearTimeout(timeoutId);
    }
  }, [paymentStatus, sessionId, urlAddress, state, fetchReport]);

  const reportData = reportResponse?.reportData || state?.reportData || null;

  const purchaseTerms = useMemo(() => {
    if (!reportData) return null;
    return resolvePurchaseTerms(termsInput, reportData.avm, reportData.subject);
  }, [termsInput, reportData]);

  const investmentMetrics = useMemo(() => {
    if (!purchaseTerms) return null;
    return buildInvestmentMetrics(purchaseTerms);
  }, [purchaseTerms]);

  const brrrr = useMemo(() => {
    if (!purchaseTerms) return null;
    return buildBrrrrSnapshot(purchaseTerms);
  }, [purchaseTerms]);

  const fixFlipMargin = useMemo(() => buildFixFlipMargin(), []);

  const updateField =
    (field: keyof PurchaseTermsInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseEditableNumber(e.target.value);
      setTermsInput((prev) => ({ ...prev, [field]: parsed }));
    };

  if (
    loading ||
    (!reportResponse &&
      (paymentStatus === "success" || sessionId) &&
      urlAddress)
  ) {
    return (
      <div className="vrr-root">
        <section className="vrr-hero">
          <div className="vrr-hero-inner">
            <p className="vrr-eyebrow">Deal Analysis Report</p>
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
              Building your deal analysis…
            </h2>
            <p
              className="text-muted"
              style={{ margin: 0, fontSize: "0.95rem" }}
            >
              Pulling the AVM estimate, sanity-checking against nearby comps,
              and running the investment calculators...
            </p>
          </section>
        </main>
      </div>
    );
  }

  if (
    paymentStatus === "canceled" ||
    (!reportResponse && !state && !sessionId)
  ) {
    navigate("/reports/deal-analysis");
    return null;
  }

  const address = urlAddress || state?.address || "";

  if (!reportData) {
    return (
      <div className="vrr-root">
        <section className="vrr-hero">
          <div className="vrr-hero-inner">
            <button
              type="button"
              className="vrr-back"
              onClick={() => navigate("/reports/deal-analysis")}
            >
              &larr; New deal analysis
            </button>
            <p className="vrr-eyebrow">Deal Analysis Report</p>
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

  const terms = purchaseTerms!;
  const metrics = investmentMetrics!;
  const brrrrSnapshot = brrrr!;
  const { subject, avm, compsSanityCheck, meta } = reportData;
  const generatedAt = state?.generatedAt || new Date().toISOString();

  return (
    <div className="vrr-root">
      <section className="vrr-hero">
        <div className="vrr-hero-inner">
          <button
            type="button"
            className="vrr-back"
            onClick={() => navigate("/reports/deal-analysis")}
          >
            &larr; New deal analysis
          </button>
          <p className="vrr-eyebrow">Deal Analysis Report</p>
          <h1 className="vrr-address">{meta.matchedAddress || address}</h1>
          {generatedAt && (
            <p className="vrr-generated">
              Generated {new Date(generatedAt).toLocaleString()}
            </p>
          )}
        </div>
      </section>

      <main className="vrr-main">
        {/* SUBJECT PROPERTY SNAPSHOT */}
        <section className="vrr-card">
          <h2 className="vrr-card-title">Subject Property Baseline</h2>
          <dl className="vrr-details" style={{ marginTop: "1rem" }}>
            <div className="vrr-detail">
              <dt style={detailLabelStyle}>
                <Map size={14} className="text-muted" style={iconStyle} />
                Address
              </dt>
              <dd>{subject.address || address}</dd>
            </div>
            <div className="vrr-detail">
              <dt style={detailLabelStyle}>
                <Bed size={14} className="text-muted" style={iconStyle} />
                <Bath size={14} className="text-muted" style={iconStyle} />
                Beds / Baths
              </dt>
              <dd>
                {subject.beds ?? "N/A"} bd / {subject.baths ?? "N/A"} ba
              </dd>
            </div>
            <div className="vrr-detail">
              <dt style={detailLabelStyle}>
                <Ruler size={14} className="text-muted" style={iconStyle} />
                Living Area
              </dt>
              <dd>
                {subject.sqft ? `${subject.sqft.toLocaleString()} sqft` : "N/A"}
              </dd>
            </div>
            <div className="vrr-detail">
              <dt style={detailLabelStyle}>
                <Calendar size={14} className="text-muted" style={iconStyle} />
                Year Built
              </dt>
              <dd>{subject.yearBuilt || "N/A"}</dd>
            </div>
            <div className="vrr-detail">
              <dt style={detailLabelStyle}>
                <Map size={14} className="text-muted" style={iconStyle} />
                Lot Size
              </dt>
              <dd>{subject.lotAcres ? `${subject.lotAcres} acres` : "N/A"}</dd>
            </div>
            <div className="vrr-detail">
              <dt style={detailLabelStyle}>
                <Receipt size={14} className="text-muted" style={iconStyle} />
                Annual Tax
              </dt>
              <dd>{formatCurrency(subject.annualTax)}</dd>
            </div>
          </dl>
        </section>

        {/* AVM + COMPS SANITY CHECK */}
        <section className="vrr-card" style={{ background: "#f8fafc" }}>
          <h2 className="vrr-card-title">
            Lender-Grade AVM &amp; Comp Sanity Check
          </h2>
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
                Estimated Value
              </p>
              <p
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0.2rem 0 0",
                }}
              >
                {formatCurrency(avm.value)}
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
                Value Range
              </p>
              <p
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0.2rem 0 0",
                }}
              >
                {formatCurrency(avm.rangeLow)} - {formatCurrency(avm.rangeHigh)}
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
                Comps Checked
              </p>
              <p
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0.2rem 0 0",
                }}
              >
                {compsSanityCheck.compsUsed}
              </p>
            </div>
          </div>

          {compsSanityCheck.compsUsed > 0 ? (
            <p
              style={{
                marginTop: "1rem",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "0.4rem",
                color: compsSanityCheck.isWithinTolerance
                  ? "#166534"
                  : "#92400e",
              }}
            >
              {compsSanityCheck.isWithinTolerance ? (
                <CheckCircle2
                  size={16}
                  style={{ flexShrink: 0, marginTop: "2px" }}
                />
              ) : (
                <AlertTriangle
                  size={16}
                  style={{ flexShrink: 0, marginTop: "2px" }}
                />
              )}
              <span>
                Median{" "}
                {formatCurrency(compsSanityCheck.medianPricePerSqft, {
                  maximumFractionDigits: 2,
                })}
                /sqft vs. AVM{" "}
                {formatCurrency(compsSanityCheck.avmPricePerSqft, {
                  maximumFractionDigits: 2,
                })}
                /sqft
                {compsSanityCheck.percentDelta !== null && (
                  <>
                    {" "}
                    ({formatPercent(compsSanityCheck.percentDelta)} delta,{" "}
                    {compsSanityCheck.isWithinTolerance ? "within" : "outside"}{" "}
                    the {compsSanityCheck.withinTolerancePct}% tolerance)
                  </>
                )}
              </span>
            </p>
          ) : (
            <p
              className="text-muted"
              style={{ marginTop: "1rem", fontSize: "0.9rem" }}
            >
              Not enough comparable sales nearby to sanity-check this estimate.
            </p>
          )}
        </section>

        {/* PURCHASE TERMS */}
        <section className="vrr-card">
          <h2 className="vrr-card-title">Purchase Terms</h2>
          <p
            className="text-muted"
            style={{
              fontSize: "0.9rem",
              marginTop: "0.25rem",
              marginBottom: "1.25rem",
            }}
          >
            Adjust to model your own deal — figures recalculate instantly.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "1rem",
            }}
          >
            <TermField
              label="Purchase Price"
              icon={<DollarSign size={14} className="text-muted" />}
            >
              <input
                type="number"
                value={terms.purchasePrice}
                onChange={updateField("purchasePrice")}
                style={inputStyle}
              />
            </TermField>
            <TermField
              label="Down Payment"
              suffix="%"
              icon={<Percent size={14} className="text-muted" />}
            >
              <input
                type="number"
                value={terms.downPaymentPct}
                onChange={updateField("downPaymentPct")}
                style={inputStyle}
              />
            </TermField>
            <TermField
              label="Interest Rate"
              suffix="%"
              icon={<Percent size={14} className="text-muted" />}
            >
              <input
                type="number"
                step="0.1"
                value={terms.interestRatePct}
                onChange={updateField("interestRatePct")}
                style={inputStyle}
              />
            </TermField>
            <TermField
              label="Loan Term"
              suffix="yrs"
              icon={<Calendar size={14} className="text-muted" />}
            >
              <input
                type="number"
                value={terms.loanTermYears}
                onChange={updateField("loanTermYears")}
                style={inputStyle}
              />
            </TermField>
            <TermField
              label="Rent Estimate"
              suffix="/mo"
              icon={<DollarSign size={14} className="text-muted" />}
            >
              <input
                type="number"
                value={terms.rentEstimateMonthly ?? ""}
                onChange={updateField("rentEstimateMonthly")}
                style={inputStyle}
              />
            </TermField>
            <TermField
              label="Taxes + Insurance"
              suffix="/mo"
              icon={<DollarSign size={14} className="text-muted" />}
            >
              <input
                type="number"
                value={terms.taxesInsuranceMonthly ?? ""}
                onChange={updateField("taxesInsuranceMonthly")}
                style={inputStyle}
              />
            </TermField>
          </div>

          {terms.assumptionsUsed.length > 0 && (
            <div
              style={{
                marginTop: "1.25rem",
                borderLeft: "4px solid #eab308",
                background: "#fefce8",
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
                padding: "0.85rem 1rem",
                borderRadius: "4px",
              }}
            >
              <AlertTriangle
                size={18}
                style={{ color: "#ca8a04", flexShrink: 0, marginTop: "1px" }}
              />
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#451a03" }}>
                Using default assumptions — {terms.assumptionsUsed.join(", ")}.
                Not treated as user input until you edit a field.
              </p>
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "2rem",
              flexWrap: "wrap",
              marginTop: "1.25rem",
              paddingTop: "1rem",
              borderTop: "1px solid #e2e8f0",
            }}
          >
            <SummaryStat
              label="Loan Amount"
              value={formatCurrency(terms.loanAmount)}
            />
            <SummaryStat
              label="Monthly P&I"
              value={formatCurrency(terms.monthlyPI)}
            />
            <SummaryStat
              label="Est. Cash to Close"
              value={formatCurrency(terms.estCashToClose)}
            />
          </div>
        </section>

        {/* INVESTMENT METRICS */}
        <section className="vrr-card" style={{ background: "#f8fafc" }}>
          <h2 className="vrr-card-title">Investment Metrics</h2>
          {metrics.rentDependentMetricsAvailable ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <MetricStat
                label="Cap Rate"
                value={formatPercent(metrics.capRatePct, 2)}
              />
              <MetricStat label="GRM" value={metrics.grm ?? "N/A"} />
              <MetricStat
                label="Cash-on-Cash"
                value={formatPercent(metrics.cashOnCashPct, 2)}
              />
              <MetricStat label="DSCR" value={metrics.dscr ?? "N/A"} />
              <MetricStat
                label="Monthly Cash Flow"
                value={formatCurrency(metrics.monthlyCashFlow)}
              />
              <MetricStat
                label="1-yr ROI"
                value={formatPercent(metrics.roi1yrPct)}
              />
              <MetricStat
                label="5-yr ROI"
                value={formatPercent(metrics.roi5yrPct)}
              />
            </div>
          ) : (
            <p
              className="text-muted"
              style={{ marginTop: "1rem", fontSize: "0.9rem" }}
            >
              {metrics.unavailableReason}
            </p>
          )}
        </section>

        {/* BRRRR SNAPSHOT */}
        <section className="vrr-card">
          <h2
            className="vrr-card-title"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <RefreshCw size={18} className="text-secondary" />
            BRRRR Snapshot
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <MetricStat
              label="Current Loan Balance"
              value={formatCurrency(brrrrSnapshot.currentLoanBalance)}
            />
            <MetricStat
              label="Refinance Loan (75% LTV)"
              value={formatCurrency(brrrrSnapshot.refinanceLoanAmount)}
            />
            <MetricStat
              label="Cash Left in Deal"
              value={formatCurrency(brrrrSnapshot.cashLeftInDeal)}
            />
            <MetricStat
              label="Cash-Out Available"
              value={formatCurrency(brrrrSnapshot.cashOutAvailable)}
            />
          </div>
          <p
            className="text-muted"
            style={{
              marginTop: "1rem",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "0.4rem",
            }}
          >
            {brrrrSnapshot.refiClearsExistingBalance ? (
              <CheckCircle2
                size={16}
                className="text-success"
                style={{ flexShrink: 0, marginTop: "2px" }}
              />
            ) : (
              <AlertTriangle
                size={16}
                style={{ color: "#ca8a04", flexShrink: 0, marginTop: "2px" }}
              />
            )}
            <span>{brrrrSnapshot.note}</span>
          </p>
        </section>

        {/* FIX & FLIP MARGIN */}
        <section className="vrr-card">
          <h2
            className="vrr-card-title"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Hammer size={18} className="text-secondary" />
            Fix &amp; Flip Margin
          </h2>
          <p
            className="text-muted"
            style={{ marginTop: "0.75rem", fontSize: "0.9rem" }}
          >
            {fixFlipMargin.reason}
          </p>
        </section>

        <div className="vrr-actions">
          <PDFDownloadLink
            document={
              <DealAnalysisReportPDFDocument
                address={meta.matchedAddress || address}
                reportResponse={reportResponse!}
                generatedAt={generatedAt}
                termsOverride={terms}
                metricsOverride={metrics}
                brrrrOverride={brrrrSnapshot}
              />
            }
            fileName={`Deal_Analysis_Report_${(meta.matchedAddress || address).replace(/[^a-zA-Z0-9]/g, "_")}.pdf`}
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
            onClick={() => navigate("/reports/deal-analysis")}
          >
            Analyze another property
          </button>
        </div>
      </main>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  border: "none",
  outline: "none",
  width: "100%",
  fontSize: "0.95rem",
  background: "transparent",
};

const detailLabelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.35rem",
};

const iconStyle: React.CSSProperties = {
  flexShrink: 0,
};

const TermField: React.FC<{
  label: string;
  suffix?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ label, suffix, icon, children }) => (
  <div>
    <span
      className="text-muted"
      style={{
        fontSize: "0.75rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.03em",
        display: "flex",
        alignItems: "center",
        gap: "0.3rem",
        marginBottom: "0.35rem",
      }}
    >
      {icon}
      {label}
    </span>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        border: "1px solid #cbd5e1",
        borderRadius: "6px",
        padding: "0.5rem 0.75rem",
        background: "#fff",
      }}
    >
      {children}
      {suffix && (
        <span
          className="text-muted"
          style={{ fontSize: "0.85rem", marginLeft: "0.4rem" }}
        >
          {suffix}
        </span>
      )}
    </div>
  </div>
);

const SummaryStat: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div>
    <p
      className="text-muted"
      style={{
        margin: 0,
        fontSize: "0.75rem",
        textTransform: "uppercase",
        letterSpacing: "0.03em",
      }}
    >
      {label}
    </p>
    <p
      style={{
        margin: "0.2rem 0 0",
        fontSize: "1.15rem",
        fontWeight: 700,
        color: "#0f172a",
      }}
    >
      {value}
    </p>
  </div>
);

const MetricStat: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div
    style={{
      background: "#fff",
      padding: "1rem",
      borderRadius: "6px",
      border: "1px solid #e2e8f0",
    }}
  >
    <p className="text-muted" style={{ margin: 0, fontSize: "0.85rem" }}>
      {label}
    </p>
    <p
      style={{
        fontSize: "1.25rem",
        fontWeight: 700,
        color: "#0f172a",
        margin: "0.2rem 0 0",
      }}
    >
      {value}
    </p>
  </div>
);

export default DealAnalysisResult;
