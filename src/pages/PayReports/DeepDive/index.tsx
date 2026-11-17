import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client/react";
import { toast } from "react-toastify";
import { GET_PROPERTY_DEEP_DIVE_REPORT } from "../../../apollo/graphql/queries/Reports";
import PublicAddressAutocomplete, {
  type AddressSuggestion,
} from "../../../components/common/PublicAddressAutoComplete";
import "../../../styles/ValuationReport.css";

interface PropertyDeepDiveReportDataShape {
  overview?: unknown;
  [key: string]: unknown;
}

interface GetPropertyDeepDiveReportData {
  getPropertyDeepDiveReport: {
    success: boolean;
    message: string | null;
    requiresPayment: boolean | null;
    stripeUrl: string | null;
    reportData: PropertyDeepDiveReportDataShape | null;
  };
}

interface GetPropertyDeepDiveReportVars {
  input: { address: string };
}

// Pricing math based on exact standalone report definitions:
// Valuation ($10) + Comps ($9) + Owner ($8) + Deal ($13) + Market ($7) + Debt ($14) = $61
const BUNDLE_PRICE = 36;
const STANDALONE_SUM = 61;
const SAVINGS = STANDALONE_SUM - BUNDLE_PRICE;

const INCLUDED_MODULES = [
  "Valuation Report (AVM, ranges, & confidence score)",
  "Comparables Report (Ranked sold comps & adjustments)",
  "Owner & Contact Report (Phone, email, & owner details)",
  "Deal Analysis Report (Live ROI, cap rate, & cash flow math)",
  "Market & Area Report (Pricing trends, inventory, & demographics)",
  "Property Debt Report (Mortgage position, foreclosure, & lien status)",
];

const ADDRESS_HAS_HOUSE_NUMBER = /^\s*\d+[\w-]*\s+\S+/;

// Adjust these two if your router registers different paths.
const RESULT_ROUTE = "/reports/deep-dive/result";

const CheckIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
    <path d="m5 13 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PropertyDeepDiveReport: React.FC = () => {
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [selected, setSelected] = useState<AddressSuggestion | null>(null);
  const [touched, setTouched] = useState(false);

  const [fetchReport, { loading: submitting }] = useLazyQuery<
    GetPropertyDeepDiveReportData,
    GetPropertyDeepDiveReportVars
  >(GET_PROPERTY_DEEP_DIVE_REPORT, {
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
          input: { address: searchedAddress },
        },
      });

      const res = data?.getPropertyDeepDiveReport;

      if (!res?.success) {
        toast.error(res?.message || "Property details could not be found.");
        return;
      }

      if (res.requiresPayment && res.stripeUrl) {
        window.location.href = res.stripeUrl;
        return;
      }

      if (res.reportData) {
        navigate(
          `${RESULT_ROUTE}?address=${encodeURIComponent(searchedAddress)}`,
          {
            state: {
              reportData: res.reportData,
              address: searchedAddress,
            },
          },
        );
        return;
      }

      toast.error(
        res.message || "Something went wrong generating this report.",
      );
    } catch (err: unknown) {
      console.error("Property Deep Dive report error:", err);
      toast.error(
        (err as Error).message ||
          "An unexpected error occurred. Please try again.",
      );
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

          <h1 className="vr-hero-title">Property Deep Dive Report</h1>
          <p className="vr-hero-sub">
            All six reports combined into one comprehensive deliverable plus
            mortgage position, title indicators, and full deal math.
          </p>
        </div>
      </section>

      <main className="vr-main">
        <form className="vr-card" onSubmit={handleSubmit} noValidate>
          <div className="vr-field">
            <PublicAddressAutocomplete
              value={address}
              reportType="report_property_deep_dive"
              disabled={submitting}
              onChange={(next) => {
                setAddress(next);
                setSelected(null);
              }}
              onSelect={(suggestion) => setSelected(suggestion)}
              autoFocus
              error={
                showError
                  ? "Enter a complete street address, including house number, street, city, and state."
                  : undefined
              }
            />
          </div>

          <section className="vr-included" aria-labelledby="vr-included-title">
            <h2 className="vr-included-title" id="vr-included-title">
              What&rsquo;s included in this combined report
            </h2>
            <ul className="vr-included-list">
              {INCLUDED_MODULES.map((item) => (
                <li className="vr-included-item" key={item}>
                  <span className="vr-included-check" aria-hidden="true">
                    <CheckIcon />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Pricing Math Block */}
          <div
            style={{
              marginTop: "20px",
              marginBottom: "20px",
              padding: "16px",
              backgroundColor: "#f9fafb",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
                fontSize: "14px",
              }}
            >
              <span style={{ color: "#6b7280" }}>
                Standalone sum:{" "}
                <s style={{ color: "#9ca3af" }}>${STANDALONE_SUM}</s>
              </span>
              <span
                style={{
                  backgroundColor: "#dcfce7",
                  color: "#166534",
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: "12px",
                }}
              >
                Save ${SAVINGS}
              </span>
            </div>
            <div
              className="vr-total"
              style={{ margin: 0, padding: 0, border: "none" }}
            >
              <span className="vr-total-label">Bundle price</span>
              <span className="vr-total-value">${BUNDLE_PRICE}</span>
            </div>
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
                <span role="status">Generating Deep Dive…</span>
              </>
            ) : (
              <>
                Generate Deep Dive Report — ${BUNDLE_PRICE}
                <span className="vr-submit-arrow ms-0" aria-hidden="true">
                  &rarr;
                </span>
              </>
            )}
          </button>
          <p className="vr-fine">
            Instant delivery &middot; PDF download included &middot; Interactive
            deal editor
          </p>
        </form>
      </main>
    </div>
  );
};

export default PropertyDeepDiveReport;
