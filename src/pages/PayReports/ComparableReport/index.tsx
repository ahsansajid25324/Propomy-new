import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client/react";
import { toast } from "react-toastify";
import { GET_COMPARABLES_REPORT } from "../../../apollo/graphql/queries/Reports";
import PublicAddressAutocomplete, {
  type AddressSuggestion,
} from "../../../components/common/PublicAddressAutoComplete";
import "../../../styles/ValuationReport.css";
import type {
  GetComparablesReportData,
  GetComparablesReportVars,
} from "../../../types/Reports";
import { capitalize } from "../../../utils/StringUtils";

const PRICE = 9;

const INCLUDED = [
  "Recent nearby sales matched on beds, baths, sqft, and distance",
  "Nearby sold comps ranked by similarity score",
  "Per-comp value adjustments and suggested price ranges",
  "Detailed property characteristics for every comparable sale",
];

const ADDRESS_HAS_HOUSE_NUMBER = /^\s*\d+[\w-]*\s+\S+/;

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
    <path d="m5 13 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ComparablesReport: React.FC = () => {
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [selected, setSelected] = useState<AddressSuggestion | null>(null);
  const [touched, setTouched] = useState(false);

  const [fetchReport, { loading: submitting }] = useLazyQuery<
    GetComparablesReportData,
    GetComparablesReportVars
  >(GET_COMPARABLES_REPORT, {
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

      const res = data?.getComparablesReport;

      if (res?.success && res?.requiresPayment && res?.stripeUrl) {
        window.location.href = res.stripeUrl;
      } else {
        toast.error(
          capitalize(res?.message) || "Property details could not be found.",
        );
      }
    } catch (err: unknown) {
      console.error("Comparables report error:", err);
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

          <h1 className="vr-hero-title">Comparables Report</h1>
          <p className="vr-hero-sub">
            Recent nearby sales matched on beds, baths, sqft, and distance — the
            comps behind any valuation, on their own.
          </p>
        </div>
      </section>

      <main className="vr-main">
        <form className="vr-card" onSubmit={handleSubmit} noValidate>
          <div className="vr-field">
            <PublicAddressAutocomplete
              value={address}
              reportType="report_comparables"
              disabled={submitting}
              onChange={(next) => {
                setAddress(next);
                setSelected(null);
              }}
              onSelect={(suggestion) => setSelected(suggestion)}
              autoFocus
              error={
                showError
                  ? "Enter a complete street address, including house number, street, city, and state, so we can match the property."
                  : undefined
              }
            />
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
                <span role="status">Finding comps…</span>
              </>
            ) : (
              <>
                Find Comps
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

export default ComparablesReport;
