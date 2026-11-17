import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client/react";
import {
  AlertTriangle,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Home,
  MapPin,
  RotateCcw,
  Search,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { GET_MARKET_AREA_REPORT } from "../../../apollo/graphql/queries/Reports";
import "../../../styles/ValuationReport.css";
import type {
  GetMarketAreaReportData,
  GetMarketAreaReportVars,
  MarketAreaReportData,
} from "../../../types/Reports";
import { capitalize } from "../../../utils/StringUtils";

interface MarketResultState {
  reportData?: MarketAreaReportData;
  address?: string;
  radius?: number;
  generatedAt?: string;
}

type FetchStatus = "idle" | "loading" | "settled";

const REQUEST_TIMEOUT_MS = 45_000;
const MAX_AUTO_RETRIES = 2;

const normalizeAddress = (addr: string | null): string => {
  if (!addr) return "";
  try {
    return decodeURIComponent(addr.replace(/\+/g, " ")).trim().toLowerCase();
  } catch {
    return addr.trim().toLowerCase();
  }
};

const formatCurrency = (val: number | null | undefined) => {
  if (val === null || val === undefined || Number.isNaN(val)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);
};

const formatNumber = (val: number | null | undefined) => {
  if (val === null || val === undefined || Number.isNaN(val)) return "N/A";
  return new Intl.NumberFormat("en-US").format(val);
};

export const MarketReportResult: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useLocation() as { state: MarketResultState | null };

  const rawAddress = searchParams.get("address");
  const rawSessionId = searchParams.get("sessionId");
  const rawRadius = searchParams.get("radius")
    ? parseFloat(searchParams.get("radius")!)
    : 1;

  const cleanAddress = normalizeAddress(rawAddress);
  const storageKey = cleanAddress ? `market_session_${cleanAddress}` : null;

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
          key.startsWith("market_session_") &&
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

  const [reportData, setReportData] = useState<MarketAreaReportData | null>(
    state?.reportData ?? null,
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

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
    GetMarketAreaReportData,
    GetMarketAreaReportVars
  >(GET_MARKET_AREA_REPORT, {
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  // STEP 1: Persist Session ID and clean URL
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

  // STEP 2: Fetch Report with Lifecycle Guards
  useEffect(() => {
    if (state?.reportData) {
      setReportData(state.reportData);
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

    const requestKey = `${rawAddress}::${activeSession}::${rawRadius}::${attempt}`;
    if (requestedKeyRef.current === requestKey) return;

    requestedKeyRef.current = requestKey;
    setStatus("loading");

    // Guards against a late response landing after we've already
    // settled via the timeout below.
    let finished = false;

    const timeoutId = window.setTimeout(() => {
      if (finished) return;
      finished = true;
      setErrorMessage(
        "The market report lookup timed out. Click 'Try again' to reload.",
      );
      setStatus("settled");
    }, REQUEST_TIMEOUT_MS);

    fetchReport({
      variables: {
        input: {
          address: rawAddress,
          radius: rawRadius,
          sessionId: activeSession,
        },
      },
    })
      .then((result) => {
        if (finished) return;
        finished = true;
        const res = result?.data?.marketAreaReport;

        if (res?.success && res?.reportData) {
          setReportData(res.reportData);
        } else {
          setErrorMessage(
            res?.message ||
              result?.error?.message ||
              "Failed to load report data for this location.",
          );
        }
        setStatus("settled");
      })
      .catch((err: unknown) => {
        if (finished) return;
        const errorObj = err as Error;
        const isAbort =
          errorObj?.name === "AbortError" ||
          errorObj?.message?.toLowerCase().includes("aborted");

        if (isAbort) {
          if (autoRetriesRef.current < MAX_AUTO_RETRIES) {
            // Deliberate retry: a fresh effect run (via `attempt`) takes
            // over the loading state, so we return without touching
            // `finished` or `status` here.
            autoRetriesRef.current += 1;
            requestedKeyRef.current = null;
            setAttempt((n) => n + 1);
            return;
          }
          finished = true;
          setErrorMessage(
            "Something interrupted the records lookup. Click 'Try again' to reload.",
          );
          setStatus("settled");
          return;
        }

        finished = true;
        console.error("Market report fetch error:", err);
        setErrorMessage(
          errorObj?.message ||
            "An error occurred while retrieving your report.",
        );
        setStatus("settled");
      })
      .finally(() => {
        window.clearTimeout(timeoutId);
      });

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    sessionId,
    rawAddress,
    rawRadius,
    state?.reportData,
    attempt,
    fetchReport,
    rawSessionId,
    storageKey,
  ]);

  const handleRetry = useCallback(() => {
    requestedKeyRef.current = null;
    autoRetriesRef.current = 0;
    setReportData(null);
    setErrorMessage("");
    setAttempt((n) => n + 1);
  }, []);

  const activeSession =
    sessionId || (storageKey ? localStorage.getItem(storageKey) : null);
  const shouldBounce = status === "idle" && !reportData && !activeSession;

  useEffect(() => {
    if (shouldBounce) navigate("/reports/market");
  }, [shouldBounce, navigate]);

  if (shouldBounce) return null;

  if (status === "loading") {
    return (
      <div className="vrr-root">
        <section className="vrr-hero">
          <div className="vrr-hero-inner">
            <p className="vrr-eyebrow">
              <FileText size={14} style={iconInline} />
              Market & Area Report
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
              Analyzing market & area data
            </h2>
            <p
              className="text-muted"
              style={{ margin: 0, fontSize: "0.95rem" }}
            >
              Aggregating local price trends, active listings inventory, and
              area demographics.
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
              onClick={() => navigate("/reports/market")}
            >
              &larr; New market search
            </button>
            <p className="vrr-eyebrow">
              <FileText size={14} style={iconInline} />
              Market & Area Report
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
                  {capitalize(errorMessage) ||
                    "We couldn't load the requested report. Please try searching again."}
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
                    onClick={() => navigate("/reports/market")}
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

  const { snapshot, trend, inventory, demographics, meta } = reportData;
  const generatedAt =
    state?.generatedAt || meta.generatedAt || new Date().toISOString();

  return (
    <div className="vrr-root">
      <section className="vrr-hero">
        <div className="vrr-hero-inner">
          <button
            type="button"
            className="vrr-back"
            onClick={() => navigate("/reports/market")}
          >
            &larr; New market search
          </button>
          <p className="vrr-eyebrow">
            <FileText size={14} style={iconInline} />
            Market & Area Report
          </p>
          <h1 className="vrr-address">
            <MapPin size={20} style={{ ...iconInline, opacity: 0.7 }} />
            {reportData.subjectAddress || address}
          </h1>
          <p className="vrr-generated">
            <Clock size={13} style={iconInline} />
            Radius: {meta.radiusMiles} mi &bull; Generated{" "}
            {new Date(generatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </section>

      <main className="vrr-main">
        {/* DATA COVERAGE NOTICE BANNER */}
        {meta.dataGaps && meta.dataGaps.length > 0 && (
          <section
            className="vrr-card"
            style={{
              background: "#fefce8",
              borderLeft: "4px solid #eab308",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
              }}
            >
              <AlertTriangle
                size={22}
                style={{ color: "#ca8a04", flexShrink: 0 }}
                aria-hidden="true"
              />
              <div>
                <h2
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    margin: 0,
                    color: "#854d0e",
                  }}
                >
                  Notice regarding data coverage
                </h2>
                <ul
                  style={{
                    margin: "0.35rem 0 0",
                    paddingLeft: "1.2rem",
                    fontSize: "0.85rem",
                    color: "#a16207",
                  }}
                >
                  {meta.dataGaps.map((gap, idx) => (
                    <li key={idx}>{gap}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 1: MARKET SNAPSHOT */}
        <section className="vrr-card">
          <SectionTitle
            icon={Building2}
            title={`Market Snapshot (${meta.radiusMiles} mi radius)`}
            meta={
              snapshot.sampleSize !== null
                ? `Based on ${snapshot.sampleSize} sales`
                : undefined
            }
          />
          <div style={statGrid}>
            <MetricStat
              icon={DollarSign}
              label="Median Sale Price"
              value={formatCurrency(snapshot.medianSalePrice)}
            />
            <MetricStat
              icon={DollarSign}
              label="Median List Price"
              value={formatCurrency(snapshot.medianListPrice)}
            />
            <MetricStat
              icon={DollarSign}
              label="Median Price / Sq. Ft."
              value={
                snapshot.medianPricePerSqft
                  ? `$${snapshot.medianPricePerSqft}`
                  : "N/A"
              }
            />
            <MetricStat
              icon={Calendar}
              label="Median Days on Market"
              value={
                snapshot.medianDaysOnMarket !== null
                  ? `${snapshot.medianDaysOnMarket} days`
                  : "N/A"
              }
            />
          </div>
        </section>

        {/* SECTION 2: 12-MONTH PRICE TREND */}
        <section className="vrr-card">
          <SectionTitle icon={TrendingUp} title="12-Month Price Trend" />
          {trend.summaryMessage && (
            <p className="text-muted" style={{ margin: "0.5rem 0 1rem" }}>
              {trend.summaryMessage}
            </p>
          )}
          <div style={statGrid}>
            <MetricStat
              icon={
                trend.percentChange && trend.percentChange > 0
                  ? TrendingUp
                  : TrendingDown
              }
              label="1-Year Price Change"
              value={
                trend.percentChange !== null
                  ? `${trend.percentChange > 0 ? "+" : ""}${trend.percentChange}%`
                  : "N/A"
              }
              emphasis={
                trend.percentChange && trend.percentChange > 0
                  ? "positive"
                  : trend.percentChange && trend.percentChange < 0
                    ? "danger"
                    : undefined
              }
            />
            <MetricStat
              icon={DollarSign}
              label="Current Period Median"
              value={formatCurrency(trend.currentPeriodMedian)}
            />
            <MetricStat
              icon={DollarSign}
              label="Prior Period Median"
              value={formatCurrency(trend.priorPeriodMedian)}
            />
          </div>
        </section>

        {/* SECTION 3: INVENTORY COUNTS */}
        <section className="vrr-card">
          <SectionTitle icon={Home} title="Active & Pending Inventory" />
          <div style={statGrid}>
            <MetricStat
              icon={Home}
              label="Active Listings"
              value={formatNumber(inventory.activeListings)}
            />
            <MetricStat
              icon={Clock}
              label="Pending Listings"
              value={formatNumber(inventory.pendingListings)}
            />
            <MetricStat
              icon={Building2}
              label="Total Comparable Inventory"
              value={formatNumber(inventory.totalComparableInventory)}
            />
          </div>
        </section>

        {/* SECTION 4: AREA DEMOGRAPHICS */}
        <section className="vrr-card">
          <SectionTitle
            icon={Users}
            title="ZIP Demographics"
            meta={demographics.zip ? `ZIP ${demographics.zip}` : undefined}
          />
          {demographics.isAvailable ? (
            <>
              <div style={statGrid}>
                <MetricStat
                  icon={Users}
                  label="Population"
                  value={formatNumber(demographics.population)}
                />
                <MetricStat
                  icon={Home}
                  label="Households"
                  value={formatNumber(demographics.households)}
                />
                <MetricStat
                  icon={DollarSign}
                  label="Median Household Income"
                  value={formatCurrency(demographics.medianHouseholdIncome)}
                />
              </div>

              {(demographics.ownerOccupiedPercent !== null ||
                demographics.renterOccupiedPercent !== null) && (
                <div style={{ marginTop: "1.5rem" }}>
                  <h4
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#334155",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Housing Occupancy Split
                  </h4>
                  <div
                    style={{
                      height: "10px",
                      borderRadius: "5px",
                      backgroundColor: "#e2e8f0",
                      display: "flex",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${demographics.ownerOccupiedPercent || 0}%`,
                        backgroundColor: "#2563eb",
                      }}
                    />
                    <div
                      style={{
                        width: `${demographics.renterOccupiedPercent || 0}%`,
                        backgroundColor: "#93c5fd",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.8rem",
                      marginTop: "0.5rem",
                      color: "#475569",
                    }}
                  >
                    <span>
                      <strong style={{ color: "#2563eb" }}>
                        Owner-Occupied:
                      </strong>{" "}
                      {demographics.ownerOccupiedPercent ?? "N/A"}%
                    </span>
                    <span>
                      <strong style={{ color: "#1d4ed8" }}>
                        Renter-Occupied:
                      </strong>{" "}
                      {demographics.renterOccupiedPercent ?? "N/A"}%
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p
              className="text-muted"
              style={{ margin: "1rem 0 0", fontSize: "0.9rem" }}
            >
              Demographics unavailable for this area.
            </p>
          )}
        </section>


        {/* ACTIONS */}
        <div className="vrr-actions">
          <button
            type="button"
            className="vrr-btn is-primary"
            onClick={() => window.print()}
          >
            Download PDF Report
          </button>
          <button
            type="button"
            className="vrr-btn"
            onClick={() => navigate("/reports/market")}
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

const MetricStat: React.FC<{
  label: string;
  value: React.ReactNode;
  icon?: IconType;
  emphasis?: "danger" | "warn" | "positive";
}> = ({ label, value, icon: Icon, emphasis }) => {
  const valueColor =
    emphasis === "danger"
      ? "#b91c1c"
      : emphasis === "warn"
        ? "#a16207"
        : emphasis === "positive"
          ? "#15803d"
          : "#0f172a";

  return (
    <div
      style={{
        background: "#fff",
        padding: "1rem",
        borderRadius: "6px",
        border: `1px solid ${
          emphasis === "danger"
            ? "#fecaca"
            : emphasis === "positive"
              ? "#bbf7d0"
              : "#e2e8f0"
        }`,
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

export default MarketReportResult;
