import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client/react";
import {
  AlertTriangle,
  Calendar,
  DollarSign,
  Percent,
  CheckCircle2,
  MapPin,
  ShieldAlert,
  FileText,
  Building2,
  Clock,
  Briefcase,
  Gavel,
  Landmark,
  Layers,
  Search,
  RotateCcw,
} from "lucide-react";
import { GET_DEBT_POSITION_REPORT } from "../../../apollo/graphql/queries/Reports";
import "../../../styles/ValuationReport.css";
import type {
  GetDebtPositionReportData,
  GetDebtPositionReportVars,
  DebtPositionReportResponse,
  LienType,
  ActiveMortgageItem,
} from "../../../types/Reports";
import { capitalize } from "../../../utils/StringUtils";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { DebtPositionReportPDFDocument } from "../../../components/pages/DebtPositionReportDocument";

interface DebtResultState {
  reportData?: DebtPositionReportResponse["reportData"];
  address?: string;
  generatedAt?: string;
}

type FetchStatus = "idle" | "loading" | "settled";

const REQUEST_TIMEOUT_MS = 45_000;

/** Cap on automatic retries after a request is cancelled mid-flight (not a real failure). */
const MAX_AUTO_RETRIES = 2;

const normalizeAddress = (addr: string | null): string => {
  if (!addr) return "";
  try {
    return decodeURIComponent(addr.replace(/\+/g, " ")).trim().toLowerCase();
  } catch {
    return addr.trim().toLowerCase();
  }
};

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

/** Formats dates (ISO strings or timestamps) into clean local date strings. */
const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "N/A";
  try {
    const parsed = new Date(dateStr);
    if (Number.isNaN(parsed.getTime())) return dateStr;
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC", // Avoid timezone shifts on YYYY-MM-DD
    });
  } catch {
    return dateStr;
  }
};

const getLienBadgeClass = (type: LienType) => {
  switch (type) {
    case "TAX":
      return "bg-danger-subtle text-danger";
    case "HOA":
      return "bg-warning-subtle text-warning-emphasis";
    case "JUDGMENT":
      return "bg-primary-subtle text-primary";
    case "MECHANIC":
      return "bg-info-subtle text-info-emphasis";
    default:
      return "bg-secondary-subtle text-secondary";
  }
};

const getLienIcon = (type: LienType) => {
  switch (type) {
    case "TAX":
      return Landmark;
    case "HOA":
      return Building2;
    case "JUDGMENT":
      return Gavel;
    case "MECHANIC":
      return Briefcase;
    default:
      return FileText;
  }
};

export const DebtReportResult: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useLocation() as { state: DebtResultState | null };

  const rawAddress = searchParams.get("address");
  const rawSessionId = searchParams.get("sessionId");
  const paymentStatus = searchParams.get("payment");

  const cleanAddress = normalizeAddress(rawAddress);
  const storageKey = cleanAddress ? `debt_session_${cleanAddress}` : null;

  const resolveStoredSession = useCallback((): string | null => {
    if (storageKey) {
      const stored = localStorage.getItem(storageKey);
      if (stored) return stored;
    }
    if (cleanAddress) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          key.startsWith("debt_session_") &&
          key.includes(cleanAddress.slice(0, 10))
        ) {
          return localStorage.getItem(key);
        }
      }
    }
    return null;
  }, [storageKey, cleanAddress]);

  const [sessionId, setSessionId] = useState<string | null>(
    () => rawSessionId || resolveStoredSession(),
  );

  const [reportResponse, setReportResponse] =
    useState<DebtPositionReportResponse | null>(null);

  const [status, setStatus] = useState<FetchStatus>(() => {
    if (state?.reportData) return "settled";
    const initialSession = rawSessionId || resolveStoredSession();
    return rawAddress && initialSession ? "loading" : "idle";
  });

  const [attempt, setAttempt] = useState(0);

  const requestedKeyRef = useRef<string | null>(null);
  const autoRetriesRef = useRef(0);
  const persistedSessionRef = useRef<string | null>(null);

  const [fetchReport] = useLazyQuery<
    GetDebtPositionReportData,
    GetDebtPositionReportVars
  >(GET_DEBT_POSITION_REPORT, {
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  useEffect(() => {
    if (!rawSessionId || !storageKey) return;
    if (persistedSessionRef.current === rawSessionId) return;
    persistedSessionRef.current = rawSessionId;

    localStorage.setItem(storageKey, rawSessionId);
    setSessionId(rawSessionId);

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("sessionId");
        return next;
      },
      { replace: true },
    );
  }, [rawSessionId, storageKey, setSearchParams]);

  useEffect(() => {
    if (state?.reportData) {
      setReportResponse({
        success: true,
        message: "",
        reportData: state.reportData,
      });
      setStatus("settled");
      return;
    }

    const activeSession =
      rawSessionId ||
      sessionId ||
      (storageKey ? localStorage.getItem(storageKey) : null);

    if (!rawAddress || !activeSession) {
      setStatus("idle");
      return;
    }

    const requestKey = `${rawAddress}::${activeSession}::${attempt}`;
    if (requestedKeyRef.current === requestKey) return;

    requestedKeyRef.current = requestKey;
    setStatus("loading");

    let finished = false;
    let cancelledMidFlight = false;

    const settle = (response: DebtPositionReportResponse) => {
      if (finished) return;
      finished = true;
      setReportResponse(response);
      setStatus("settled");
    };

    const timeoutId = window.setTimeout(() => {
      settle({
        success: false,
        message:
          "The records lookup timed out. Your payment is safe — click 'Try again' to reload.",
        reportData: null,
      });
    }, REQUEST_TIMEOUT_MS);

    fetchReport({
      variables: {
        input: {
          address: rawAddress,
          sessionId: activeSession,
        },
      },
    })
      .then((result) => {
        const payload = result?.data?.getDebtPositionReport;

        if (payload?.success && payload?.reportData) {
          settle(payload);
          return;
        }

        settle({
          success: false,
          message:
            payload?.message ||
            result?.error?.message ||
            "The records lookup didn't return data for this address.",
          reportData: null,
        });
      })
      .catch((err: unknown) => {
        const errorObj = err as Error;
        const isAbort =
          errorObj?.name === "AbortError" ||
          errorObj?.message?.toLowerCase().includes("aborted");

        if (isAbort) {
          cancelledMidFlight = true;
          if (autoRetriesRef.current < MAX_AUTO_RETRIES) {
            autoRetriesRef.current += 1;
            requestedKeyRef.current = null;
            setAttempt((n) => n + 1);
          } else {
            settle({
              success: false,
              message:
                "Something interrupted the records lookup. Click 'Try again' to reload.",
              reportData: null,
            });
          }
          return;
        }

        console.error("Error fetching debt report:", err);
        settle({
          success: false,
          message:
            errorObj?.message ||
            "Something went wrong while generating this report.",
          reportData: null,
        });
      })
      .finally(() => {
        window.clearTimeout(timeoutId);
        if (!finished && !cancelledMidFlight) setStatus("settled");
      });

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    paymentStatus,
    sessionId,
    rawAddress,
    state?.reportData,
    attempt,
    fetchReport,
    rawSessionId,
    storageKey,
  ]);

  const handleRetry = useCallback(() => {
    requestedKeyRef.current = null;
    autoRetriesRef.current = 0;
    setReportResponse(null);
    setAttempt((n) => n + 1);
  }, []);

  const reportData = reportResponse?.reportData || state?.reportData || null;

  const activeSession =
    sessionId || (storageKey ? localStorage.getItem(storageKey) : null);
  const shouldBounce =
    paymentStatus === "canceled" ||
    (status === "idle" && !reportData && !activeSession);

  useEffect(() => {
    if (shouldBounce) navigate("/reports/debt-position");
  }, [shouldBounce, navigate]);

  if (shouldBounce) return null;

  if (status === "loading") {
    return (
      <div className="vrr-root">
        <section className="vrr-hero">
          <div className="vrr-hero-inner">
            <p className="vrr-eyebrow">
              <FileText size={14} style={iconInline} />
              Debt Position Report
            </p>
            <h1 className="vrr-address">{rawAddress || "Preparing report…"}</h1>
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
              <span className="visually-hidden">Loading…</span>
            </div>
            <h2
              className="vrr-card-title"
              style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}
            >
              Checking debt position records
            </h2>
            <p
              className="text-muted"
              style={{ margin: 0, fontSize: "0.95rem" }}
            >
              Analyzing active mortgage history, pre-foreclosure status, and
              involuntary lien filings.
            </p>
          </section>
        </main>
      </div>
    );
  }

  const address = rawAddress || state?.address || "";

  if (!reportData) {
    return (
      <div className="vrr-root">
        <section className="vrr-hero">
          <div className="vrr-hero-inner">
            <button
              type="button"
              className="vrr-back"
              onClick={() => navigate("/reports/debt-position")}
            >
              &larr; New debt search
            </button>
            <p className="vrr-eyebrow">
              <FileText size={14} style={iconInline} />
              Debt Position Report
            </p>
            <h1 className="vrr-address">{address}</h1>
          </div>
        </section>
        <main className="vrr-main">
          <section className="vrr-card" style={{ padding: "2.5rem 2rem" }}>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <AlertTriangle
                size={22}
                style={{
                  color: "#dc2626",
                  flexShrink: 0,
                  marginTop: "0.15rem",
                }}
                aria-hidden="true"
              />
              <div>
                <h2 className="vrr-card-title" style={{ marginTop: 0 }}>
                  We couldn&rsquo;t generate this report
                </h2>
                <p className="text-muted" style={{ margin: "0.35rem 0 1rem" }}>
                  {capitalize(reportResponse?.message || "") ||
                    "The records lookup didn't return data for this address. Check the address and run the search again."}
                </p>
                <div
                  style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}
                >
                  <button
                    type="button"
                    className="vrr-btn is-primary"
                    onClick={handleRetry}
                  >
                    <RotateCcw size={16} style={iconInline} />
                    Try again
                  </button>
                  <button
                    type="button"
                    className="vrr-btn"
                    onClick={() => navigate("/reports/debt-position")}
                  >
                    <Search size={16} style={iconInline} />
                    Search another address
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const {
    subjectAddress,
    mortgage,
    foreclosure,
    liens,
    distressSummaryMessage,
    meta,
  } = reportData;

  const generatedAt =
    state?.generatedAt || meta.generatedAt || new Date().toISOString();

  const openLiens = liens.filter((l) => !l.isReleased);
  const releasedLiens = liens.filter((l) => l.isReleased);
  const isDistressFree =
    !foreclosure.hasDistressIndicator && openLiens.length === 0;

  const openLienTotal = openLiens.reduce((sum, l) => sum + (l.amount || 0), 0);

  // Total active encumbrance (sum of all current mortgage amounts/HELOCs)
  const totalEncumbrance =
    mortgage.currentMortgages && mortgage.currentMortgages.length > 0
      ? mortgage.currentMortgages.reduce(
          (sum, item) => sum + (item.amount || 0),
          0,
        )
      : mortgage.estimatedCurrentBalance || 0;

  return (
    <div className="vrr-root">
      <section className="vrr-hero">
        <div className="vrr-hero-inner">
          <button
            type="button"
            className="vrr-back"
            onClick={() => navigate("/reports/debt-position")}
          >
            &larr; New debt search
          </button>
          <p className="vrr-eyebrow">
            <FileText size={14} style={iconInline} />
            Debt Position Report
          </p>
          <h1 className="vrr-address">
            <MapPin size={20} style={{ ...iconInline, opacity: 0.7 }} />
            {meta.matchedAddress || subjectAddress || address}
          </h1>
          {generatedAt && (
            <p className="vrr-generated">
              <Clock size={13} style={iconInline} />
              Generated {formatDate(generatedAt)}
            </p>
          )}
        </div>
      </section>

      <main className="vrr-main">
        {/* DISTRESS SUMMARY BANNER */}
        <section
          className="vrr-card"
          style={{
            background: isDistressFree ? "#f0fdf4" : "#fefce8",
            borderLeft: `4px solid ${isDistressFree ? "#22c55e" : "#eab308"}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
            }}
          >
            {isDistressFree ? (
              <CheckCircle2
                size={24}
                style={{ color: "#16a34a", flexShrink: 0 }}
                aria-hidden="true"
              />
            ) : (
              <ShieldAlert
                size={24}
                style={{ color: "#ca8a04", flexShrink: 0 }}
                aria-hidden="true"
              />
            )}
            <div>
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  margin: 0,
                  color: isDistressFree ? "#15803d" : "#854d0e",
                }}
              >
                {capitalize(distressSummaryMessage)}
              </h2>
              <p
                style={{
                  fontSize: "0.85rem",
                  margin: "0.15rem 0 0",
                  color: isDistressFree ? "#166534" : "#a16207",
                }}
              >
                {isDistressFree
                  ? "No open liens or pre-foreclosure filings are associated with this property."
                  : `${openLiens.length} open lien${
                      openLiens.length === 1 ? "" : "s"
                    } totaling ${formatCurrency(openLienTotal)}${
                      foreclosure.hasDistressIndicator
                        ? " and an active foreclosure flag"
                        : ""
                    }.`}
              </p>
            </div>
          </div>
        </section>

        {/* MORTGAGE POSITION */}
        <section className="vrr-card">
          <SectionTitle icon={Building2} title="Mortgage Position" />
          {!mortgage.hasActiveMortgage ? (
            <EmptyRow
              icon={CheckCircle2}
              tone="positive"
              text={
                capitalize(mortgage.summaryMessage || "") ||
                "No active mortgage on record."
              }
            />
          ) : (
            <>
              <div style={statGrid}>
                <MetricStat
                  icon={Building2}
                  label="Lender / Servicer"
                  value={mortgage.lenderOrServicer || "N/A"}
                />
                <MetricStat
                  icon={FileText}
                  label="Loan Type"
                  value={mortgage.loanType || "N/A"}
                />
                <MetricStat
                  icon={Calendar}
                  label="Origination Date"
                  value={formatDate(mortgage.originationDate)}
                />
              
                <MetricStat
                  icon={DollarSign}
                  label="Est. 1st Mortgage Balance"
                  value={formatCurrency(mortgage.estimatedCurrentBalance)}
                />
                {mortgage.hasSecondLienOrHeloc && (
                  <MetricStat
                    icon={DollarSign}
                    label="Total Active Encumbrance"
                    value={formatCurrency(totalEncumbrance)}
                  />
                )}
                <MetricStat
                  icon={Percent}
                  label="Interest Rate"
                  value={
                    mortgage.interestRate
                      ? formatPercent(mortgage.interestRate, 2)
                      : "N/A"
                  }
                />
                {mortgage.estimatedEquity !== null && (
                  <MetricStat
                    icon={DollarSign}
                    label="Estimated Equity"
                    value={formatCurrency(mortgage.estimatedEquity)}
                  />
                )}
                {mortgage.ltv !== null && (
                  <MetricStat
                    icon={Percent}
                    label={
                      mortgage.hasSecondLienOrHeloc
                        ? "Combined LTV (CLTV)"
                        : "Estimated LTV"
                    }
                    value={formatPercent(mortgage.ltv, 1)}
                  />
                )}
                <MetricStat
                  icon={Layers}
                  label="Second Lien / HELOC"
                  value={mortgage.hasSecondLienOrHeloc ? "Yes" : "No"}
                  emphasis={mortgage.hasSecondLienOrHeloc ? "warn" : undefined}
                />
              </div>

              {/* ACTIVE MORTGAGES BREAKDOWN */}
              {mortgage.currentMortgages &&
                mortgage.currentMortgages.length > 0 && (
                  <div style={{ marginTop: "1.5rem" }}>
                    <h3
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#334155",
                        marginBottom: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                      }}
                    >
                      <Layers size={16} style={{ color: "#64748b" }} />
                      Active Mortgages & Lines of Credit (
                      {mortgage.currentMortgages.length})
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.6rem",
                      }}
                    >
                      {mortgage.currentMortgages.map(
                        (item: ActiveMortgageItem, idx: number) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "0.85rem 1rem",
                              borderRadius: "6px",
                              border: "1px solid #e2e8f0",
                              background: "#f8fafc",
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "0.75rem",
                                    fontWeight: 700,
                                    padding: "0.15rem 0.45rem",
                                    borderRadius: "4px",
                                    background:
                                      item.position?.toLowerCase() === "second"
                                        ? "#fef3c7"
                                        : "#e0f2fe",
                                    color:
                                      item.position?.toLowerCase() === "second"
                                        ? "#92400e"
                                        : "#0369a1",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {item.position || `Lien #${idx + 1}`}
                                </span>
                                <strong
                                  style={{
                                    fontSize: "0.95rem",
                                    color: "#0f172a",
                                  }}
                                >
                                  {item.lenderName || "Unknown Lender"}
                                </strong>
                              </div>
                              {item.loanType && (
                                <p
                                  style={{
                                    margin: "0.25rem 0 0",
                                    fontSize: "0.8rem",
                                    color: "#64748b",
                                  }}
                                >
                                  {item.loanType}
                                </p>
                              )}
                            </div>
                            <span
                              style={{
                                fontSize: "1.1rem",
                                fontWeight: 700,
                                color: "#0f172a",
                              }}
                            >
                              {formatCurrency(item.amount)}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
            </>
          )}
        </section>

        {/* FORECLOSURE & AUCTION STATUS */}
        <section className="vrr-card">
          <SectionTitle icon={Gavel} title="Foreclosure & Auction Status" />
          {!foreclosure.hasDistressIndicator ? (
            <EmptyRow
              icon={CheckCircle2}
              tone="positive"
              text="No pre-foreclosure or auction records found for this address."
            />
          ) : (
            <div style={statGrid}>
              <MetricStat
                icon={AlertTriangle}
                label="Pre-Foreclosure / NOD"
                value={
                  foreclosure.isPreForeclosureOrNod ? "Active flag" : "None"
                }
                emphasis={
                  foreclosure.isPreForeclosureOrNod ? "danger" : undefined
                }
              />
              <MetricStat
                icon={DollarSign}
                label="Default Amount"
                value={formatCurrency(foreclosure.defaultAmount)}
                emphasis={foreclosure.defaultAmount ? "danger" : undefined}
              />
              <MetricStat
                icon={Calendar}
                label="Auction Date"
                value={
                  foreclosure.auctionDate ? (
                    <span>
                      {formatDate(foreclosure.auctionDate)}
                      {foreclosure.hasAuctionPassed && (
                        <small
                          className="text-muted"
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            marginLeft: "0.35rem",
                          }}
                        >
                          (passed)
                        </small>
                      )}
                    </span>
                  ) : (
                    "Not scheduled"
                  )
                }
              />
              <MetricStat
                icon={MapPin}
                label="Auction Location"
                value={foreclosure.auctionLocation || "N/A"}
              />
              <MetricStat
                icon={Briefcase}
                label="Trustee / Attorney"
                value={foreclosure.trusteeOrAttorney || "N/A"}
              />
            </div>
          )}
        </section>

        {/* INVOLUNTARY LIENS AUDIT */}
        <section className="vrr-card">
          <SectionTitle
            icon={FileText}
            title="Involuntary Liens Audit"
            meta={
              liens.length > 0
                ? `${openLiens.length} open · ${releasedLiens.length} released`
                : undefined
            }
          />
          {liens.length === 0 ? (
            <EmptyRow
              icon={CheckCircle2}
              tone="positive"
              text="No open or historical involuntary lien filings on record."
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                marginTop: "1rem",
              }}
            >
              {[...openLiens, ...releasedLiens].map((lien) => {
                const LienIcon = getLienIcon(lien.type);
                return (
                  <div
                    key={lien.id}
                    style={{
                      padding: "1rem",
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0",
                      background: lien.isReleased ? "#f8fafc" : "#ffffff",
                      opacity: lien.isReleased ? 0.7 : 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "0.75rem",
                    }}
                  >
                    <div style={{ display: "flex", gap: "0.85rem" }}>
                      <span
                        style={{
                          width: 38,
                          height: 38,
                          flexShrink: 0,
                          borderRadius: "8px",
                          display: "grid",
                          placeItems: "center",
                          background: lien.isReleased ? "#e2e8f0" : "#f1f5f9",
                        }}
                      >
                        <LienIcon
                          size={18}
                          style={{
                            color: lien.isReleased ? "#94a3b8" : "#475569",
                          }}
                          aria-hidden="true"
                        />
                      </span>

                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            className={`badge ${getLienBadgeClass(lien.type)}`}
                            style={{
                              fontSize: "0.75rem",
                              padding: "0.25rem 0.5rem",
                            }}
                          >
                            {lien.type} LIEN
                          </span>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              color: lien.isReleased ? "#64748b" : "#0f172a",
                              textTransform: "uppercase",
                            }}
                          >
                            {lien.isReleased ? (
                              <CheckCircle2 size={13} aria-hidden="true" />
                            ) : (
                              <AlertTriangle size={13} aria-hidden="true" />
                            )}
                            {lien.status}
                          </span>
                        </div>

                        <p
                          style={{
                            margin: "0.35rem 0 0",
                            fontSize: "0.9rem",
                            color: "#334155",
                          }}
                        >
                          <strong>Holder:</strong> {lien.holder || "N/A"}
                        </p>
                        <p
                          style={{
                            margin: "0.15rem 0 0",
                            fontSize: "0.8rem",
                            color: "#64748b",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                          }}
                        >
                          <Calendar size={12} aria-hidden="true" />
                          Filed {formatDate(lien.filingDate)}
                        </p>
                      </div>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        textAlign: "right",
                        color: lien.isReleased ? "#64748b" : "#b91c1c",
                      }}
                    >
                      {formatCurrency(lien.amount)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="vrr-actions">
          <PDFDownloadLink
            document={
              <DebtPositionReportPDFDocument
                address={meta.matchedAddress || subjectAddress || address}
                reportResponse={reportResponse!}
                generatedAt={generatedAt}
              />
            }
            fileName={`Debt_Position_Report_${(
              meta.matchedAddress ||
              subjectAddress ||
              address
            ).replace(/[^a-zA-Z0-9]/g, "_")}.pdf`}
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
            onClick={() => navigate("/reports/debt-position")}
          >
            Search another property
          </button>
        </div>
      </main>
    </div>
  );
};

type IconType = React.ComponentType<{
  size?: number | string;
  style?: React.CSSProperties;
  "aria-hidden"?: boolean | "true" | "false";
}>;

const iconInline: React.CSSProperties = {
  verticalAlign: "-0.15em",
  marginRight: "0.4rem",
};

const statGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1rem",
  marginTop: "1rem",
};

const SectionTitle: React.FC<{
  icon: IconType;
  title: string;
  meta?: string;
}> = ({ icon: Icon, title, meta }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "0.75rem",
      flexWrap: "wrap",
    }}
  >
    <h2
      className="vrr-card-title"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        margin: 0,
      }}
    >
      <Icon size={18} style={{ color: "#475569" }} aria-hidden="true" />
      {title}
    </h2>
    {meta && (
      <span className="text-muted" style={{ fontSize: "0.8rem" }}>
        {meta}
      </span>
    )}
  </div>
);

const EmptyRow: React.FC<{
  icon: IconType;
  text: string;
  tone?: "positive" | "neutral";
}> = ({ icon: Icon, text, tone = "neutral" }) => (
  <div
    style={{
      marginTop: "1rem",
      padding: "1rem",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      gap: "0.6rem",
      background: tone === "positive" ? "#f0fdf4" : "#f8fafc",
      border: `1px solid ${tone === "positive" ? "#bbf7d0" : "#e2e8f0"}`,
      color: tone === "positive" ? "#166534" : "#334155",
      fontSize: "0.9rem",
      fontWeight: 500,
    }}
  >
    <Icon
      size={18}
      style={{ color: tone === "positive" ? "#16a34a" : "#64748b" }}
      aria-hidden="true"
    />
    <span>{text}</span>
  </div>
);

const MetricStat: React.FC<{
  label: string;
  value: React.ReactNode;
  icon?: IconType;
  emphasis?: "danger" | "warn";
}> = ({ label, value, icon: Icon, emphasis }) => {
  const valueColor =
    emphasis === "danger"
      ? "#b91c1c"
      : emphasis === "warn"
        ? "#a16207"
        : "#0f172a";

  return (
    <div
      style={{
        background: "#fff",
        padding: "1rem",
        borderRadius: "6px",
        border: `1px solid ${emphasis === "danger" ? "#fecaca" : "#e2e8f0"}`,
      }}
    >
      <p
        className="text-muted"
        style={{
          margin: 0,
          fontSize: "0.85rem",
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
        }}
      >
        {Icon && <Icon size={14} aria-hidden="true" />}
        {label}
      </p>
      <p
        style={{
          fontSize: "1.15rem",
          fontWeight: 700,
          color: valueColor,
          margin: "0.2rem 0 0",
        }}
      >
        {value}
      </p>
    </div>
  );
};

export default DebtReportResult;