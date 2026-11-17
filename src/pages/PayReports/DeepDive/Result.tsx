import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/client/react";
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  CircleDollarSign,
  Gavel,
  Home,
  Landmark,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Search,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { GET_PROPERTY_DEEP_DIVE_REPORT } from "../../../apollo/graphql/queries/Reports";
import "../../../styles/ValuationReport.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PropertyDeepDiveReportPDFDocument } from "./../../../components/pages/PropertyDeepDiveReportPDFDocument";
import type {
  DeepDiveResultState,
  FetchStatus,
  GetPropertyDeepDiveReportData,
  PropertyDeepDiveReportData,
  GetPropertyDeepDiveReportVars,
  DistressAndLienModule,
  MortgageLienPosition,
  OwnerContactModule,
  DealAnalysisModule,
  MarketAreaModule,
  ComparablesModule,
} from "../../../types/DeepDive";

const REQUEST_TIMEOUT_MS = 45_000;
const MAX_AUTO_RETRIES = 2;

import {
  capitalize,
  daysAgo,
  formatDate,
  formatNumber,
  formatPercent,
  normalizeAddress,
} from "../../../utils/StringUtils";
import { formatCurrency } from "../../../utils/formatConversion";

const MODULE_PRICE: Record<string, string> = {
  valuation: "Valuation Report · $10 standalone",
  comparables: "Comparables Report · $9 standalone",
  owner: "Owner & Contact Report · $8 standalone",
  mortgageLiens: "Property Debt Report · $14 standalone",
  market: "Market & Area Report · $7 standalone",
  deal: "Deal Analysis Report · $13 standalone",
};

// Sections shown in the sticky horizontal nav. `id` must match the `id`
// attribute placed on the corresponding <section> further down.
const NAV_OFFSET_PX = 64; // approx height of the sticky nav bar
const SECTIONS: { id: string; label: string; icon: IconType }[] = [
  { id: "section-overview", label: "Overview", icon: Home },
  { id: "section-valuation", label: "Valuation", icon: CircleDollarSign },
  { id: "section-comparables", label: "Comparables", icon: TrendingUp },
  { id: "section-owner", label: "Owner & Contact", icon: Users },
  { id: "section-liens", label: "Mortgage & Liens", icon: Landmark },
  { id: "section-market", label: "Market & Area", icon: Building2 },
  { id: "section-deal", label: "Deal Analysis", icon: DollarSign },
];

// Applied to any section that's a nav target so scrollIntoView doesn't
// tuck the heading underneath the sticky nav bar.
const navTargetStyle: React.CSSProperties = {
  scrollMarginTop: NAV_OFFSET_PX + 12,
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

const getToneBadgeClass = (
  tone: "green" | "red" | "amber" | "blue" | "neutral",
) => {
  switch (tone) {
    case "green":
      return "bg-success-subtle text-success";
    case "red":
      return "bg-danger-subtle text-danger";
    case "amber":
      return "bg-warning-subtle text-warning-emphasis";
    case "blue":
      return "bg-primary-subtle text-primary";
    default:
      return "bg-secondary-subtle text-secondary";
  }
};

const Badge: React.FC<{
  tone?: "green" | "red" | "amber" | "blue" | "neutral";
  children: React.ReactNode;
}> = ({ tone = "neutral", children }) => (
  <span
    className={`badge ${getToneBadgeClass(tone)}`}
    style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
  >
    {children}
  </span>
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

/* ------------------------------------------------------------------ */
/* Section nav                                                          */
/* ------------------------------------------------------------------ */
const SectionNav: React.FC<{
  activeId: string;
  onNavigate: (id: string) => void;
}> = ({ activeId, onNavigate }) => {
  const navRef = useRef<HTMLElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [justify, setJustify] = useState<"center" | "flex-start">("center");

  useEffect(() => {
    const checkOverflow = () => {
      const el = navRef.current;
      if (!el) return;
      setJustify(el.scrollWidth > el.clientWidth ? "flex-start" : "center");
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  useEffect(() => {
    const activeBtn = buttonRefs.current.get(activeId);
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeId]);

  return (
    <nav
      ref={navRef}
      aria-label="Report sections"
      className="vrr-section-nav"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "#fff",
        borderBottom: "1px solid #e2e8f0",
        overflowX: "auto",
        whiteSpace: "nowrap",
        display: "flex",
        gap: "0.25rem",
        padding: "0 1.25rem",
        justifyContent: justify,
        scrollbarWidth: "none",
      }}
    >
      {SECTIONS.map(({ id, label, icon: Icon }) => {
        const isActive = activeId === id;
        return (
          <button
            key={id}
            ref={(node) => {
              if (node) {
                buttonRefs.current.set(id, node);
              } else {
                buttonRefs.current.delete(id);
              }
            }}
            type="button"
            aria-current={isActive ? "true" : undefined}
            onClick={() => onNavigate(id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.85rem 0.9rem",
              background: "none",
              border: "none",
              borderBottom: `2px solid ${isActive ? "#1d4ed8" : "transparent"}`,
              color: isActive ? "#1d4ed8" : "#64748b",
              fontWeight: isActive ? 700 : 500,
              fontSize: "0.85rem",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Icon size={14} aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </nav>
  );
};

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */

export const PropertyDeepDiveReportResult: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useLocation() as { state: DeepDiveResultState | null };

  const rawAddress = searchParams.get("address");
  const rawSessionId = searchParams.get("sessionId");
  const cleanAddress = normalizeAddress(rawAddress);
  const storageKey = cleanAddress ? `deepdive_session_${cleanAddress}` : null;

  const resolveStoredSession = useCallback((): string | null => {
    if (storageKey) {
      const stored = localStorage.getItem(storageKey);
      if (stored) return stored;
    }
    return null;
  }, [storageKey]);

  const [sessionId, setSessionId] = useState<string | null>(
    () => rawSessionId || resolveStoredSession(),
  );
  const [reportData, setReportData] =
    useState<PropertyDeepDiveReportData | null>(state?.reportData ?? null);
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

  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);

  const [fetchReport] = useLazyQuery<
    GetPropertyDeepDiveReportData,
    GetPropertyDeepDiveReportVars
  >(GET_PROPERTY_DEEP_DIVE_REPORT, {
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

  // STEP 2: Fetch report with lifecycle guards
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

    const requestKey = `${rawAddress}::${activeSession}::${attempt}`;
    if (requestedKeyRef.current === requestKey) return;

    requestedKeyRef.current = requestKey;
    setStatus("loading");

    let finished = false;

    const timeoutId = window.setTimeout(() => {
      if (finished) return;
      finished = true;
      setErrorMessage(
        "The deep dive report timed out. Click 'Try again' to reload.",
      );
      setStatus("settled");
    }, REQUEST_TIMEOUT_MS);

    fetchReport({
      variables: { input: { address: rawAddress, sessionId: activeSession } },
    })
      .then((result) => {
        if (finished) return;
        finished = true;
        const res = result?.data?.getPropertyDeepDiveReport;

        if (res?.success && res?.reportData) {
          setReportData(res.reportData);
        } else {
          setErrorMessage(
            res?.message ||
              result?.error?.message ||
              "Failed to load the deep dive report for this address.",
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
            autoRetriesRef.current += 1;
            requestedKeyRef.current = null;
            setAttempt((n) => n + 1);
            return;
          }
          finished = true;
          setErrorMessage(
            "Something interrupted the report lookup. Click 'Try again' to reload.",
          );
          setStatus("settled");
          return;
        }

        finished = true;
        console.error("Property Deep Dive report error:", err);
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

  const handleNavigate = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    if (!reportData) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${NAV_OFFSET_PX + 8}px 0px -70% 0px`,
        threshold: 0,
      },
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [reportData]);

  const activeSession =
    sessionId || (storageKey ? localStorage.getItem(storageKey) : null);
  const shouldBounce = status === "idle" && !reportData && !activeSession;

  useEffect(() => {
    if (shouldBounce) navigate("/reports/deep-dive");
  }, [shouldBounce, navigate]);

  if (shouldBounce) return null;

  if (status === "loading") {
    return (
      <div className="vrr-root">
        <section className="vrr-hero">
          <div className="vrr-hero-inner">
            <p className="vrr-eyebrow">
              <FileText size={14} style={iconInline} />
              Property Deep Dive Report
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
              Assembling your deep dive report
            </h2>
            <p
              className="text-muted"
              style={{ margin: "0 0 1.5rem", fontSize: "0.95rem" }}
            >
              Pulling every module into one organized view — this can take a
              moment.
            </p>
            <ul
              style={{
                listStyle: "none",
                margin: "0 auto",
                padding: 0,
                maxWidth: "360px",
                textAlign: "left",
                fontSize: "0.88rem",
                color: "#64748b",
                display: "grid",
                gap: "0.4rem",
              }}
            >
              {[
                "Pulling property records & tax history",
                "Scoring comparable sales",
                "Resolving owner & contact details",
                "Checking mortgage & lien position",
                "Compiling market & area trends",
                "Running deal analysis math",
              ].map((step) => (
                <li
                  key={step}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#94a3b8",
                      flexShrink: 0,
                    }}
                  />
                  {step}
                </li>
              ))}
            </ul>
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
              onClick={() => navigate("/reports/deep-dive")}
            >
              &larr; New deep dive search
            </button>
            <p className="vrr-eyebrow">
              <FileText size={14} style={iconInline} />
              Property Deep Dive Report
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
                    onClick={() => navigate("/reports/deep-dive")}
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
    overview,
    valuation,
    comparables,
    ownerContact,
    mortgageLienPosition,
    marketArea,
    dealAnalysis,
    distressAndLien,
    meta,
  } = reportData;

  const matchedAddress =
    meta?.matchedAddress || overview?.matchedAddress || address;
  const generatedAt =
    state?.generatedAt || meta?.generatedAt || new Date().toISOString();

  const qualityScore = valuation?.prediction?.quality_score ?? null;
  const hasDistress = !!distressAndLien?.foreclosure?.hasDistressIndicator;

  return (
    <div className="vrr-root">
      <section className="vrr-hero">
        <div className="vrr-hero-inner">
          <button
            type="button"
            className="vrr-back"
            onClick={() => navigate("/reports/deep-dive")}
          >
            &larr; New deep dive search
          </button>
          <p className="vrr-eyebrow">
            <FileText size={14} style={iconInline} />
            Property Deep Dive Report
          </p>
          <h1 className="vrr-address">
            <MapPin size={20} style={{ ...iconInline, opacity: 0.7 }} />
            {matchedAddress}
          </h1>
          <p className="vrr-generated">
            <Clock size={13} style={iconInline} />
            Generated {formatDate(generatedAt)} &middot; schema{" "}
            {meta?.schemaVersion || "N/A"}
          </p>
        </div>
      </section>

      <SectionNav activeId={activeSection} onNavigate={handleNavigate} />

      <main className="vrr-main mt-5">
        {/* SUMMARY BANNER */}
        <section
          className="vrr-card"
          style={{
            background: hasDistress ? "#fefce8" : "#f0fdf4",
            borderLeft: `4px solid ${hasDistress ? "#eab308" : "#22c55e"}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
            }}
          >
            {hasDistress ? (
              <ShieldAlert
                size={24}
                style={{ color: "#ca8a04", flexShrink: 0 }}
                aria-hidden="true"
              />
            ) : (
              <CheckCircle2
                size={24}
                style={{ color: "#16a34a", flexShrink: 0 }}
                aria-hidden="true"
              />
            )}
            <div>
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  margin: 0,
                  color: hasDistress ? "#854d0e" : "#15803d",
                }}
              >
                {hasDistress
                  ? "Distress flagged on this property"
                  : "No distress flags found"}
              </h2>
              <p
                style={{
                  fontSize: "0.85rem",
                  margin: "0.15rem 0 0",
                  color: hasDistress ? "#a16207" : "#166534",
                }}
              >
                Estimated value {formatCurrency(overview?.estimatedValue)}
                {qualityScore !== null
                  ? ` · ${qualityScore} confidence score`
                  : ""}{" "}
                · Est. equity{" "}
                {formatCurrency(distressAndLien?.mortgage?.estimatedEquity)}
              </p>
            </div>
          </div>
        </section>

        {/* CORE CHARACTERISTICS */}
        <section
          id="section-overview"
          className="vrr-card"
          style={navTargetStyle}
        >
          <SectionTitle
            icon={Home}
            title="Core Characteristics"
            meta="Property Detail API"
          />
          <div style={statGrid}>
            <MetricStat
              label="Beds / Baths"
              value={`${overview?.beds ?? "N/A"} / ${overview?.baths ?? "N/A"}`}
            />
            <MetricStat label="Sqft" value={formatNumber(overview?.sqft)} />
            <MetricStat
              label="Year Built"
              value={overview?.yearBuilt ?? "N/A"}
            />
            <MetricStat
              icon={DollarSign}
              label="Estimated Value"
              value={formatCurrency(overview?.estimatedValue)}
            />
            <MetricStat
              label="Value Range"
              value={`${formatCurrency(overview?.estimatedValueRangeLow)} – ${formatCurrency(overview?.estimatedValueRangeHigh)}`}
            />
            <MetricStat
              icon={DollarSign}
              label="Last Sale"
              value={formatCurrency(overview?.lastSaleAmount)}
            />
            <MetricStat
              icon={Calendar}
              label="Last Sale Date"
              value={formatDate(overview?.lastSaleDate)}
            />
          </div>
        </section>

        {/* VALUATION */}
        {valuation?.prediction ? (
          <section
            id="section-valuation"
            className="vrr-card"
            style={navTargetStyle}
          >
            <SectionTitle
              icon={CircleDollarSign}
              title="Automated Valuation Model"
              meta={MODULE_PRICE.valuation}
            />
            <div style={statGrid}>
              <MetricStat
                icon={DollarSign}
                label="AVM Estimate"
                value={formatCurrency(
                  valuation.prediction.valuation ??
                    valuation.prediction.prediction,
                )}
              />
              <MetricStat
                icon={DollarSign}
                label="Low Estimate"
                value={formatCurrency(valuation.prediction.low_estimate)}
              />
              <MetricStat
                icon={DollarSign}
                label="High Estimate"
                value={formatCurrency(valuation.prediction.high_estimate)}
              />
              <MetricStat
                icon={CircleDollarSign}
                label="Quality Score"
                value={valuation.prediction.quality_score ?? "N/A"}
              />
            </div>
            {valuation.prediction.explanation && (
              <p
                className="text-muted"
                style={{ marginTop: "1.25rem", fontSize: "0.9rem" }}
              >
                {capitalize(valuation.prediction.explanation)}
              </p>
            )}
            {valuation.prediction.top_features &&
              valuation.prediction.top_features.length > 0 && (
                <div style={{ marginTop: "1.25rem" }}>
                  <h4
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "#334155",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Top Value Drivers
                  </h4>
                  <div style={{ display: "grid", gap: "0.5rem" }}>
                    {valuation.prediction.top_features.map((f) => (
                      <div
                        key={f.feature}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "0.6rem 0.85rem",
                          background: "#f8fafc",
                          borderRadius: "6px",
                          fontSize: "0.88rem",
                        }}
                      >
                        <span>{capitalize(f.feature)}</span>
                        <span
                          style={{
                            fontWeight: 700,
                            color: f.impact >= 0 ? "#15803d" : "#b91c1c",
                          }}
                        >
                          {f.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </section>
        ) : (
          <section
            id="section-valuation"
            className="vrr-card"
            style={navTargetStyle}
          >
            <SectionTitle
              icon={CircleDollarSign}
              title="Automated Valuation Model"
              meta={MODULE_PRICE.valuation}
            />
            <EmptyRow
              icon={AlertTriangle}
              text="Valuation data is not available for this address."
            />
          </section>
        )}

        {/* COMPARABLES */}
        <ComparablesSection comparables={comparables} />

        {/* OWNER & CONTACT */}
        <OwnerContactSection ownerContact={ownerContact} />

        {/* MORTGAGE & LIENS */}
        <MortgageLiensSection
          mortgageLienPosition={mortgageLienPosition}
          distressAndLien={distressAndLien}
        />

        {/* MARKET & AREA */}
        <MarketAreaSection marketArea={marketArea} />

        {/* DEAL ANALYSIS */}
        <DealAnalysisSection dealAnalysis={dealAnalysis} />

        <div className="vrr-actions">
          <PDFDownloadLink
            document={
              <PropertyDeepDiveReportPDFDocument
                address={matchedAddress}
                reportData={reportData}
                generatedAt={generatedAt}
              />
            }
            fileName={`Deep_Dive_Report_${matchedAddress.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`}
            className="vrr-btn is-primary"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {({ loading }) =>
              loading ? "Generating PDF..." : "Download PDF Report"
            }
          </PDFDownloadLink>

          <button
            type="button"
            className="vrr-btn"
            onClick={() => navigate("/reports/deep-dive")}
          >
            Search another property
          </button>
        </div>
      </main>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Sub-sections                                                         */
/* ------------------------------------------------------------------ */

const ComparablesSection: React.FC<{
  comparables: ComparablesModule | null;
}> = ({ comparables }) => {
  const [showAll, setShowAll] = useState(false);
  const comps = comparables?.comps || [];
  const visibleComps = showAll ? comps : comps.slice(0, 3);

  return (
    <section
      id="section-comparables"
      className="vrr-card"
      style={navTargetStyle}
    >
      <SectionTitle
        icon={TrendingUp}
        title="Comparable Sales"
        meta={MODULE_PRICE.comparables}
      />

      {comparables?.meta?.fallbackApplied &&
        comparables.meta.fallbackMessage && (
          <div
            style={{
              marginTop: "1rem",
              padding: "0.85rem 1rem",
              background: "#fefce8",
              borderLeft: "4px solid #eab308",
              borderRadius: "4px",
              display: "flex",
              gap: "0.6rem",
            }}
          >
            <AlertTriangle
              size={18}
              style={{ color: "#ca8a04", flexShrink: 0, marginTop: "0.1rem" }}
              aria-hidden="true"
            />
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#a16207" }}>
              {comparables.meta.fallbackMessage}
            </p>
          </div>
        )}

      {comps.length > 0 ? (
        <>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
            {visibleComps.map((comp) => {
              const ago = daysAgo(comp.saleDate);
              return (
                <div
                  key={comp.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        fontSize: "0.95rem",
                      }}
                    >
                      {comp.address}
                    </p>
                    <p
                      className="text-muted"
                      style={{
                        margin: "0.25rem 0 0",
                        fontSize: "0.82rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <span>
                        {comp.distanceMiles != null
                          ? `${comp.distanceMiles} mi`
                          : "N/A"}
                        {ago !== null ? ` · sold ${ago} days ago` : ""} ·{" "}
                        {comp.beds ?? "N/A"}bd/{comp.baths ?? "N/A"}ba,{" "}
                        {formatNumber(comp.sqft)} sqft
                      </span>
                      {comp.isStale && <Badge tone="amber">Stale</Badge>}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: 0, fontWeight: 700 }}>
                        {formatCurrency(comp.salePrice)}
                      </p>
                      <p
                        className="text-muted"
                        style={{ margin: 0, fontSize: "0.8rem" }}
                      >
                        {comp.pricePerSqft != null
                          ? `$${comp.pricePerSqft}/sqft`
                          : "N/A"}
                      </p>
                    </div>
                    {comp.similarity?.total != null && (
                      <Badge tone="blue">Match {comp.similarity.total}</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {comps.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              style={{
                display: "block",
                margin: "1rem auto 0",
                background: "none",
                border: "none",
                color: "#1d4ed8",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              {showAll
                ? "Show fewer comps"
                : `+ ${comps.length - 3} more comps`}
            </button>
          )}

          <div style={statGrid}>
            <MetricStat
              label="Median $/Sqft"
              value={
                comparables?.summary?.medianPricePerSqft != null
                  ? `$${comparables.summary.medianPricePerSqft}`
                  : "N/A"
              }
            />
            <MetricStat
              label="Avg $/Sqft"
              value={
                comparables?.summary?.avgPricePerSqft != null
                  ? `$${comparables.summary.avgPricePerSqft}`
                  : "N/A"
              }
            />
            <MetricStat
              label="Suggested Range"
              value={`${formatCurrency(comparables?.summary?.suggestedRangeLow)} – ${formatCurrency(comparables?.summary?.suggestedRangeHigh)}`}
            />
          </div>
        </>
      ) : (
        <EmptyRow
          icon={AlertTriangle}
          text="No comparable sales were found for this address."
        />
      )}
    </section>
  );
};

const OwnerContactSection: React.FC<{
  ownerContact: OwnerContactModule | null;
}> = ({ ownerContact }) => {
  const identity = ownerContact?.ownerIdentity;
  const contacts = ownerContact?.contacts;
  const relatives = ownerContact?.household?.relativesAndAssociates;
  const relativesList = Array.isArray(relatives)
    ? relatives
    : relatives
      ? [relatives]
      : [];

  return (
    <section id="section-owner" className="vrr-card" style={navTargetStyle}>
      <SectionTitle
        icon={Users}
        title="Owner & Contact"
        meta={MODULE_PRICE.owner}
      />

      {identity ? (
        <>
          {identity.isCorporateOrLLC && (
            <p
              className="text-muted"
              style={{ margin: "0.5rem 0 0", fontSize: "0.82rem" }}
            >
              Corporate skip — recorded owner resolved to a managing individual.
            </p>
          )}

          <div style={statGrid}>
            <MetricStat
              label="Recorded Owner (Deed of Record)"
              value={identity.name || "N/A"}
            />
            {identity.isCorporateOrLLC && identity.unwoundIndividualName && (
              <MetricStat
                label="Resolved Individual"
                value={identity.unwoundIndividualName}
              />
            )}
            <MetricStat
              label="Mailing Address"
              value={identity.mailingAddress || "N/A"}
            />
            <MetricStat label="Age Range" value={identity.ageRange || "N/A"} />
            <MetricStat
              label="Marital Status"
              value={identity.maritalStatus || "N/A"}
            />
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <h4
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#334155",
                marginBottom: "0.5rem",
              }}
            >
              Contact Details
            </h4>
            {contacts?.hasContactData ? (
              <>
                {contacts.hasDncOrLitigatorWarning && (
                  <div
                    style={{
                      padding: "0.75rem 1rem",
                      background: "#fef2f2",
                      borderLeft: "4px solid #dc2626",
                      borderRadius: "4px",
                      display: "flex",
                      gap: "0.5rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <ShieldAlert
                      size={16}
                      style={{ color: "#b91c1c", flexShrink: 0 }}
                      aria-hidden="true"
                    />
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.85rem",
                        color: "#b91c1c",
                      }}
                    >
                      One or more numbers are flagged DNC or litigator risk —
                      review compliance notes before contacting.
                    </p>
                  </div>
                )}
                {contacts.identityUnverified && (
                  <p
                    className="text-muted"
                    style={{ fontSize: "0.82rem", marginBottom: "0.6rem" }}
                  >
                    Identity for this contact data is unverified.
                  </p>
                )}
                <div style={{ display: "grid", gap: "0.5rem" }}>
                  {(contacts.phones || []).map((p, i) => (
                    <div
                      key={`${p.number}-${i}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.6rem 0.85rem",
                        background: "#f8fafc",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        flexWrap: "wrap",
                        gap: "0.4rem",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <Phone size={14} aria-hidden="true" />
                        {p.number} {p.type ? `(${p.type})` : ""}
                      </span>
                      <span style={{ display: "flex", gap: "0.4rem" }}>
                        {p.dncFlag && <Badge tone="red">DNC</Badge>}
                        {p.litigatorFlag && <Badge tone="red">Litigator</Badge>}
                        {p.confidenceRank != null && (
                          <Badge tone="neutral">Rank {p.confidenceRank}</Badge>
                        )}
                      </span>
                    </div>
                  ))}
                  {(contacts.emails || []).map((e, i) => (
                    <div
                      key={`${e.email}-${i}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.6rem 0.85rem",
                        background: "#f8fafc",
                        borderRadius: "6px",
                        fontSize: "0.85rem",
                        flexWrap: "wrap",
                        gap: "0.4rem",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <Mail size={14} aria-hidden="true" />
                        {e.email}
                      </span>
                      {e.confidenceRank != null && (
                        <Badge tone="neutral">Rank {e.confidenceRank}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyRow
                icon={AlertTriangle}
                text="No verified contact data on file."
              />
            )}
          </div>

          {(relativesList.length > 0 ||
            ownerContact?.household?.lengthOfResidence) && (
            <div style={{ marginTop: "1.5rem" }}>
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#334155",
                  marginBottom: "0.5rem",
                }}
              >
                Household
              </h4>
              <div style={statGrid}>
                {ownerContact?.household?.lengthOfResidence && (
                  <MetricStat
                    label="Length of Residence"
                    value={ownerContact.household.lengthOfResidence}
                  />
                )}
                {relativesList.length > 0 && (
                  <MetricStat
                    label="Relatives & Associates"
                    value={relativesList.join(", ")}
                  />
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyRow
          icon={AlertTriangle}
          text="Owner and contact data is not available for this address."
        />
      )}
    </section>
  );
};

const MortgageLiensSection: React.FC<{
  mortgageLienPosition: MortgageLienPosition | null;
  distressAndLien: DistressAndLienModule | null;
}> = ({ mortgageLienPosition, distressAndLien }) => {
  const mortgage = distressAndLien?.mortgage;
  const currentMortgages = mortgage?.currentMortgages || [];
  const liens = distressAndLien?.liens || [];
  const openLiens = liens.filter((l) => !l.isReleased);
  const releasedLiens = liens.filter((l) => l.isReleased);

  return (
    <>
      <section id="section-liens" className="vrr-card" style={navTargetStyle}>
        <SectionTitle
          icon={Landmark}
          title="Mortgage Position"
          meta={MODULE_PRICE.mortgageLiens}
        />
        {mortgageLienPosition?.badgeMessage && (
          <div style={{ margin: "0.75rem 0" }}></div>
        )}
        {!mortgage?.hasActiveMortgage ? (
          <EmptyRow
            icon={CheckCircle2}
            tone="positive"
            text={
              capitalize(mortgage?.summaryMessage || "") ||
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
                label="Original Loan Amount"
                value={formatCurrency(mortgage.originalLoanAmount)}
              />
              <MetricStat
                icon={DollarSign}
                label="Est. Current Balance"
                value={formatCurrency(mortgage.estimatedCurrentBalance)}
              />
              <MetricStat
                label="Interest Rate"
                value={
                  mortgage.interestRate != null
                    ? `${mortgage.interestRate}%`
                    : "N/A"
                }
              />
              <MetricStat
                icon={DollarSign}
                label="Est. Equity"
                value={formatCurrency(mortgage.estimatedEquity)}
                emphasis="positive"
              />
              <MetricStat
                label="LTV"
                value={mortgage.ltv != null ? `${mortgage.ltv}%` : "N/A"}
              />
              <MetricStat
                label="2nd Lien / HELOC"
                value={mortgage.hasSecondLienOrHeloc ? "Yes" : "No"}
                emphasis={mortgage.hasSecondLienOrHeloc ? "warn" : undefined}
              />
            </div>

            {/* List of Active Mortgages */}
            {currentMortgages.length > 0 && (
              <div style={{ marginTop: "1.5rem" }}>
                <h4
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: "0.5rem",
                  }}
                >
                  Active Mortgages & Lines ({currentMortgages.length})
                </h4>
                <div style={{ display: "grid", gap: "0.5rem" }}>
                  {currentMortgages.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.75rem 1rem",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                        fontSize: "0.88rem",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 700, color: "#1e293b" }}>
                          {item.lenderName || "Unspecified Lender"}
                        </span>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "#64748b",
                            marginTop: "0.15rem",
                          }}
                        >
                          {item.position
                            ? `Position ${item.position}`
                            : "Primary"}
                          {item.loanType ? ` · ${item.loanType}` : ""}
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, color: "#0f172a" }}>
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <section className="vrr-card">
        <SectionTitle
          icon={Gavel}
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
            text="No liens on record."
          />
        ) : (
          <div style={{ display: "grid", gap: "0.5rem", marginTop: "1rem" }}>
            {[...openLiens, ...releasedLiens].map((lien) => (
              <div
                key={lien.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.85rem 1rem",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  background: lien.isReleased ? "#f8fafc" : "#fff",
                  opacity: lien.isReleased ? 0.75 : 1,
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <p
                    style={{ margin: 0, fontWeight: 700, fontSize: "0.92rem" }}
                  >
                    {lien.type || "Lien"}
                  </p>
                  <p
                    className="text-muted"
                    style={{ margin: "0.15rem 0 0", fontSize: "0.82rem" }}
                  >
                    {lien.holder || "N/A"} &middot; filed{" "}
                    {formatDate(lien.filingDate)}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  <span style={{ fontWeight: 700 }}>
                    {formatCurrency(lien.amount)}
                  </span>
                  <Badge tone={lien.isReleased ? "green" : "amber"}>
                    {lien.isReleased ? "Released" : lien.status || "Active"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

const MarketAreaSection: React.FC<{
  marketArea: MarketAreaModule | null;
}> = ({ marketArea }) => {
  if (!marketArea?.snapshot) {
    return (
      <section id="section-market" className="vrr-card" style={navTargetStyle}>
        <SectionTitle
          icon={Building2}
          title="Market & Area"
          meta={MODULE_PRICE.market}
        />
        <EmptyRow
          icon={AlertTriangle}
          text="Market and area data is not available for this address."
        />
      </section>
    );
  }

  const { snapshot, trend, inventory, demographics, meta } = marketArea;

  return (
    <>
      {meta?.dataGaps && meta.dataGaps.length > 0 && (
        <section
          className="vrr-card"
          style={{ background: "#fefce8", borderLeft: "4px solid #eab308" }}
        >
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <AlertTriangle
              size={20}
              style={{ color: "#ca8a04", flexShrink: 0 }}
              aria-hidden="true"
            />
            <ul
              style={{
                margin: 0,
                paddingLeft: "1.1rem",
                fontSize: "0.85rem",
                color: "#a16207",
              }}
            >
              {meta.dataGaps.map((gap, i) => (
                <li key={i}>{gap}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section id="section-market" className="vrr-card" style={navTargetStyle}>
        <SectionTitle
          icon={Building2}
          title={`Market Snapshot (${meta?.radiusMiles ?? "N/A"} mi radius)`}
          meta={
            snapshot.sampleSize != null
              ? `Based on ${snapshot.sampleSize} sales`
              : MODULE_PRICE.market
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
            label="Median $/Sqft"
            value={
              snapshot.medianPricePerSqft
                ? `$${snapshot.medianPricePerSqft}`
                : "N/A"
            }
          />
          <MetricStat
            icon={Calendar}
            label="Median DOM"
            value={
              snapshot.medianDaysOnMarket != null
                ? `${snapshot.medianDaysOnMarket} days`
                : "N/A"
            }
          />
        </div>
      </section>

      <section className="vrr-card">
        <SectionTitle icon={TrendingUp} title="12-Month Price Trend" />
        {trend?.summaryMessage && (
          <p className="text-muted" style={{ margin: "0.5rem 0 1rem" }}>
            {trend.summaryMessage}
          </p>
        )}
        <div style={statGrid}>
          <MetricStat
            icon={
              trend?.percentChange && trend.percentChange > 0
                ? TrendingUp
                : TrendingDown
            }
            label="1-Year Price Change"
            value={formatPercent(trend?.percentChange)}
            emphasis={
              trend?.percentChange && trend.percentChange > 0
                ? "positive"
                : trend?.percentChange && trend.percentChange < 0
                  ? "danger"
                  : undefined
            }
          />
          <MetricStat
            icon={DollarSign}
            label="Current Period Median"
            value={formatCurrency(trend?.currentPeriodMedian)}
          />
          <MetricStat
            icon={DollarSign}
            label="Prior Period Median"
            value={formatCurrency(trend?.priorPeriodMedian)}
          />
        </div>
      </section>

      <section className="vrr-card">
        <SectionTitle icon={Home} title="Active & Pending Inventory" />
        <div style={statGrid}>
          <MetricStat
            icon={Home}
            label="Active Listings"
            value={formatNumber(inventory?.activeListings)}
          />
          <MetricStat
            icon={Clock}
            label="Pending Listings"
            value={formatNumber(inventory?.pendingListings)}
          />
          <MetricStat
            icon={Building2}
            label="Total Comparable Inventory"
            value={formatNumber(inventory?.totalComparableInventory)}
          />
        </div>
      </section>

      <section className="vrr-card">
        <SectionTitle
          icon={Users}
          title="ZIP Demographics"
          meta={demographics?.zip ? `ZIP ${demographics.zip}` : undefined}
        />
        {demographics?.isAvailable ? (
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
              label="Median HH Income"
              value={formatCurrency(demographics.medianHouseholdIncome)}
            />
          </div>
        ) : (
          <EmptyRow
            icon={AlertTriangle}
            text="Demographics unavailable for this area."
          />
        )}
      </section>
    </>
  );
};

const DealAnalysisSection: React.FC<{
  dealAnalysis: DealAnalysisModule | null;
}> = ({ dealAnalysis }) => (
  <section id="section-deal" className="vrr-card" style={navTargetStyle}>
    <SectionTitle
      icon={DollarSign}
      title="AVM & Comps Sanity Check"
      meta={MODULE_PRICE.deal}
    />
    {dealAnalysis?.avm ? (
      <>
        <div style={statGrid}>
          <MetricStat
            icon={DollarSign}
            label="AVM Value"
            value={formatCurrency(dealAnalysis.avm.value)}
          />
          <MetricStat
            label="Range"
            value={`${formatCurrency(dealAnalysis.avm.rangeLow)} – ${formatCurrency(dealAnalysis.avm.rangeHigh)}`}
          />
          <MetricStat
            icon={CircleDollarSign}
            label="Confidence"
            value={
              dealAnalysis.avm.confidence != null
                ? `${dealAnalysis.avm.confidence}%`
                : "N/A"
            }
          />
        </div>

        {dealAnalysis.compsSanityCheck && (
          <div style={{ marginTop: "1.5rem" }}>
            <h4
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#334155",
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              {dealAnalysis.compsSanityCheck.isWithinTolerance ? (
                <CheckCircle2
                  size={16}
                  style={{ color: "#15803d" }}
                  aria-hidden="true"
                />
              ) : (
                <AlertTriangle
                  size={16}
                  style={{ color: "#ca8a04" }}
                  aria-hidden="true"
                />
              )}
              Comps Sanity Check
            </h4>
            <div style={statGrid}>
              <MetricStat
                label="Comps Used"
                value={dealAnalysis.compsSanityCheck.compsUsed ?? "N/A"}
              />
              <MetricStat
                label="Median Comp $/Sqft"
                value={
                  dealAnalysis.compsSanityCheck.medianPricePerSqft != null
                    ? `$${dealAnalysis.compsSanityCheck.medianPricePerSqft}`
                    : "N/A"
                }
              />
              <MetricStat
                label="AVM $/Sqft"
                value={
                  dealAnalysis.compsSanityCheck.avmPricePerSqft != null
                    ? `$${dealAnalysis.compsSanityCheck.avmPricePerSqft}`
                    : "N/A"
                }
              />
              <MetricStat
                label="Delta"
                value={formatPercent(
                  dealAnalysis.compsSanityCheck.percentDelta,
                )}
                emphasis={
                  dealAnalysis.compsSanityCheck.isWithinTolerance
                    ? "positive"
                    : "warn"
                }
              />
            </div>
          </div>
        )}
      </>
    ) : (
      <EmptyRow
        icon={AlertTriangle}
        text="Deal analysis data is not available for this address."
      />
    )}
  </section>
);

export default PropertyDeepDiveReportResult;
