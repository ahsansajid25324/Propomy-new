import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client/react";
import { toast } from "react-toastify";
import { GET_DEBT_POSITION_REPORT } from "../../../apollo/graphql/queries/Reports";
import PublicAddressAutocomplete, {
  type AddressSuggestion,
} from "../../../components/common/PublicAddressAutoComplete";
import "../../../styles/ValuationReport.css";
import type {
  GetDebtPositionReportData,
  GetDebtPositionReportVars,
} from "../../../types/Reports";
import { capitalize } from "../../../utils/StringUtils";

const PRICE = 14;

const INCLUDED = [
  "Mortgage position: Active lender, origination date, original amount, estimated balance, and interest rate",
  "Calculated equity and Loan-to-Value (LTV) ratio based on current estimated property value",
  "Pre-foreclosure status, Notice of Default (NOD) flags, default amounts, and auction timelines",
  "Scheduled auction dates, sale locations, and trustee/attorney of record",
  "Involuntary liens audit: Tax, HOA, Judgment, and Mechanic's liens itemized by open vs. released status",
];

const ADDRESS_HAS_HOUSE_NUMBER = /^\s*\d+[\w-]*\s+\S+/;

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
    <path d="m5 13 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DebtReport: React.FC = () => {
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [selected, setSelected] = useState<AddressSuggestion | null>(null);
  const [touched, setTouched] = useState(false);

  const [fetchReport, { loading: submitting }] = useLazyQuery<
    GetDebtPositionReportData,
    GetDebtPositionReportVars
  >(GET_DEBT_POSITION_REPORT, {
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

      const res = data?.getDebtPositionReport;

      if (res?.success && res?.requiresPayment && res?.stripeUrl) {
        window.location.href = res.stripeUrl;
      } else if (res?.success && res?.reportData) {
        navigate(
          `/reports/debt-position/result?address=${encodeURIComponent(searchedAddress)}`,
          {
            state: {
              reportData: res.reportData,
              address: searchedAddress,
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
      console.error("Debt position report error:", err);
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

          <h1 className="vr-hero-title">Debt Position Report</h1>
          <p className="vr-hero-sub">
            Comprehensive audit of active mortgage position, pre-foreclosures,
            auction listings, and involuntary liens (tax, HOA, judgment, and
            mechanic&rsquo;s) tied to the property or owner.
          </p>
        </div>
      </section>

      <main className="vr-main">
        <form className="vr-card" onSubmit={handleSubmit} noValidate>
          <div className="vr-field">
            <PublicAddressAutocomplete
              value={address}
              reportType="report_debt_position"
              disabled={submitting}
              onChange={(next) => {
                setAddress(next);
                setSelected(null);
              }}
              onSelect={(suggestion) => setSelected(suggestion)}
              autoFocus
              error={
                showError
                  ? "Enter a complete street address, including house number, street, city, and state, so we can run the debt position search."
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
                <span role="status">Checking records…</span>
              </>
            ) : (
              <>
                Run Debt Position Search
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

export default DebtReport;
