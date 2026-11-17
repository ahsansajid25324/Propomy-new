import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client/react";
import { toast } from "react-toastify";
import { GET_MARKET_AREA_REPORT } from "../../../apollo/graphql/queries/Reports";
import PublicAddressAutocomplete, {
  type AddressSuggestion,
} from "../../../components/common/PublicAddressAutoComplete";
import "../../../styles/ValuationReport.css";
import type {
  GetMarketAreaReportData,
  GetMarketAreaReportVars,
} from "../../../types/Reports";
import { capitalize } from "../../../utils/StringUtils";

const PRICE = 7;

const RADIUS_OPTIONS = [
  { label: "0.5 mi", value: 0.5 },
  { label: "1 mi", value: 1 },
  { label: "2 mi", value: 2 },
  { label: "5 mi", value: 5 },
];

const INCLUDED = [
  "Median list & sale price",
  "Median $ / sq. ft.",
  "Median days on market",
  "12-month price trend",
  "Active & pending inventory",
  "Population & household count",
  "Median household income",
  "Owner- vs. renter-occupied %",
];

const ADDRESS_HAS_HOUSE_NUMBER = /^\s*\d+[\w-]*\s+\S+/;

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
    <path d="m5 13 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MarketReport: React.FC = () => {
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [selected, setSelected] = useState<AddressSuggestion | null>(null);
  const [radius, setRadius] = useState<number>(1);
  const [touched, setTouched] = useState(false);

  const [fetchReport, { loading: submitting }] = useLazyQuery<
    GetMarketAreaReportData,
    GetMarketAreaReportVars
  >(GET_MARKET_AREA_REPORT, {
    fetchPolicy: "network-only",
  });

  const trimmedAddress = address.trim();
  const isValid =
    trimmedAddress.length >= 6 &&
    (selected !== null || ADDRESS_HAS_HOUSE_NUMBER.test(trimmedAddress));
  const showError = touched && !isValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!isValid) return;

    const searchedAddress = address.trim();

    try {
      const { data } = await fetchReport({
        variables: {
          input: { address: searchedAddress, radius },
        },
      });

      const res = data?.marketAreaReport;

      if (res?.success && res?.requiresPayment && res?.stripeUrl) {
        window.location.href = res.stripeUrl;
      } else if (res?.success && res?.reportData) {
        navigate(
          `/reports/market/result?address=${encodeURIComponent(searchedAddress)}&radius=${radius}`,
          {
            state: {
              reportData: res.reportData,
              address: searchedAddress,
              radius,
              generatedAt: new Date().toISOString(),
            },
          },
        );
      } else {
        toast.error(
          capitalize(res?.message) || "Property details could not be found.",
        );
      }
    } catch (err: unknown) {
      console.error("Market report error:", err);
      toast.error((err as Error).message);
    }
  };

  return (
    <div className="vr-root">
      <section className="vr-hero">
        <div className="vr-hero-inner">
          <button
            type="button"
            className="vr-back"
            onClick={() => navigate("/reports")}
          >
            <span className="vr-back-arrow" aria-hidden="true">
              &larr;
            </span>
            All reports
          </button>

          <h1 className="vr-hero-title">Market & Area Report</h1>
          <p className="vr-hero-sub">
            Neighborhood-level pricing metrics, 12-month trends, inventory
            counts, and key demographic statistics around the subject property.
          </p>
        </div>
      </section>

      <main className="vr-main">
        <form className="vr-card" onSubmit={handleSubmit} noValidate>
          <div className="vr-field">
            <PublicAddressAutocomplete
              value={address}
              reportType="report_market_area"
              disabled={submitting}
              onChange={(next) => {
                setAddress(next);
                setSelected(null);
              }}
              onSelect={(suggestion) => setSelected(suggestion)}
              autoFocus
              error={
                showError
                  ? "Enter a complete street address so we can run the market report search."
                  : undefined
              }
            />
          </div>

          {/* Search Radius Pills */}
          <div className="vr-field">
            <label
              style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: "#6b7280",
                marginTop: "12px",
                display: "block",
              }}
            >
              SEARCH RADIUS
            </label>
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "8px",
                marginTop: "4px",
              }}
            >
              {RADIUS_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "20px",
                    border:
                      radius === opt.value
                        ? "2px solid #2563eb"
                        : "1px solid #d1d5db",
                    backgroundColor:
                      radius === opt.value ? "#eff6ff" : "#ffffff",
                    color: radius === opt.value ? "#1d4ed8" : "#374151",
                    fontWeight: radius === opt.value ? 600 : 400,
                    cursor: "pointer",
                  }}
                  onClick={() => setRadius(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
              Default is 1 mile. Wider radii return more inventory but a less
              precise local read.
            </p>
          </div>

          <section className="vr-included" aria-labelledby="vr-included-title">
            <h2 className="vr-included-title" id="vr-included-title">
              What&rsquo;s included in this report
            </h2>
            <ul className="vr-included-list">
              {INCLUDED.map((item) => (
                <li className="vr-included-item" key={item}>
                  <span className="vr-included-check" aria-hidden="true">
                    <CheckIcon />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <div className="vr-total">
            <span className="vr-total-label">Total price</span>
            <span className="vr-total-value">${PRICE}</span>
          </div>

          <button
            className="vrr-btn-is-primary vr-submit"
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-0"
                  aria-hidden="true"
                ></span>
                <span role="status">Fetching market stats…</span>
              </>
            ) : (
              <>
                Generate Report — ${PRICE}
                <span className="vr-submit-arrow ms-0" aria-hidden="true">
                  &rarr;
                </span>
              </>
            )}
          </button>
          <p className="vr-fine">Instant delivery · PDF download included</p>
        </form>
      </main>
    </div>
  );
};

export default MarketReport;
