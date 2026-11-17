import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Resolver } from "react-hook-form";
import { dscrCalculatorSchema } from "../../schemas/dscrCalculatorSchema";
import {
  calculateDscrResults,
  defaultDscrValues,
} from "../../utils/dscrCaclulatorUtils";
import type { DscrFormValues, DscrResults } from "../../types/Calculators";

const DscrCalculator = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<DscrFormValues>({
    defaultValues: defaultDscrValues,
    resolver: yupResolver(dscrCalculatorSchema) as Resolver<DscrFormValues>,
    mode: "onBlur",
  });

  const [results, setResults] = useState<DscrResults | null>(null);
  const [aiState, setAiState] = useState<{
    showSearch: boolean;
    badgeAddress: string;
  }>({
    showSearch: false,
    badgeAddress: "",
  });
  const resultsRef = useRef<HTMLDivElement>(null);

  const currentFormValues = watch();

  // Calculate runtime layout variables live for form read-only blocks
  const liveResults = calculateDscrResults(currentFormValues);

  useEffect(() => {
    if (results) {
      setResults(liveResults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFormValues]);

  const onSubmit = (data: DscrFormValues) => {
    setResults(calculateDscrResults(data));
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleManualRentChange = () => {
    if (aiState.badgeAddress) {
      setAiState((prev) => ({ ...prev, badgeAddress: "" }));
    }
  };

  const handleReset = () => {
    reset(defaultDscrValues);
    setResults(null);
    setAiState({ showSearch: false, badgeAddress: "" });
  };

  const getVerdictDetails = (dscrValue: number) => {
    if (dscrValue === Infinity) {
      return {
        text: "Infinite DSCR — No debt service/loan payments found (All-Cash Deal).",
        bg: "#e8f5e9",
        color: "#2e7d32",
        border: "#2e7d32",
      };
    }
    if (dscrValue >= 1.25) {
      return {
        text: "Strong DSCR — comfortably above the 1.0 minimum",
        bg: "#e8f5e9",
        color: "#2e7d32",
        border: "#2e7d32",
      };
    }
    if (dscrValue >= 1.0) {
      return {
        text: "Qualifies — meets the standard 1.0 DSCR minimum",
        bg: "#fff8e1",
        color: "#b78103",
        border: "#b78103",
      };
    }
    return {
      text: "Below breakeven — may still qualify as a 'no-ratio' loan at a rate/LTV penalty",
      bg: "#ffebee",
      color: "#c62828",
      border: "#c62828",
    };
  };

  return (
    <div className="roi-calculator-page">
      <form
        autoComplete="off"
        className="roi-form-container"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Card 1: Property & Loan Inputs */}
        <div className="roi-card">
          <h3>Property & Financing</h3>
          <div className="roi-row">
            <div className="roi-field">
              <label>Purchase Price ($)</label>
              <input
                {...register("purchasePrice")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.purchasePrice && (
                <span className="roi-error">
                  {errors.purchasePrice.message}
                </span>
              )}
            </div>
            <div className="roi-field">
              <label>Down Payment ($)</label>
              <input
                {...register("downPayment")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.downPayment && (
                <span className="roi-error">{errors.downPayment.message}</span>
              )}
            </div>
          </div>
          <div className="roi-row">
            <div className="roi-field">
              <label>Interest Rate (%)</label>
              <input
                {...register("interestRate")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.interestRate && (
                <span className="roi-error">{errors.interestRate.message}</span>
              )}
            </div>
            <div className="roi-field">
              <label>Loan Term (Years)</label>
              <select
                {...register("loanTerm")}
                className="roi-input roi-select"
              >
                <option value={30}>30 Years</option>
                <option value={20}>20 Years</option>
                <option value={15}>15 Years</option>
                <option value={10}>10 Years</option>
              </select>
            </div>
          </div>
          {/* Live calculation helper inside the inputs panel */}
          <div className="roi-row">
            <div className="roi-field">
              <label>Calculated Loan Amount ($ - Read Only)</label>
              <input
                value={liveResults.loanAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
                type="text"
                className="roi-input"
                readOnly
                disabled
              />
            </div>
          </div>
        </div>

        {/* Card 2: Taxes, Insurance & HOA Inputs */}
        <div className="roi-card">
          <h3>Taxes, Insurance & HOA</h3>
          <div className="roi-row">
            <div className="roi-field">
              <label>Property Taxes ($/yr)</label>
              <input
                {...register("propertyTaxes")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.propertyTaxes && (
                <span className="roi-error">
                  {errors.propertyTaxes.message}
                </span>
              )}
            </div>
            <div className="roi-field">
              <label>Insurance ($/yr)</label>
              <input
                {...register("insurance")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.insurance && (
                <span className="roi-error">{errors.insurance.message}</span>
              )}
            </div>
          </div>
          <div className="roi-row">
            <div className="roi-field">
              <label>HOA / Association Dues ($/mo)</label>
              <input
                {...register("hoa")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.hoa && (
                <span className="roi-error">{errors.hoa.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Rental Income Inputs */}
        <div className="roi-card">
          <h3>Rental Income</h3>
          <div className="roi-row">
            <div className="roi-field">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <label style={{ flexGrow: 1 }}>Monthly Market Rent ($)</label>
              </div>

              <input
                {...register("monthlyRent")}
                type="number"
                step="any"
                className="roi-input"
                style={
                  aiState.badgeAddress
                    ? {
                        border: "1px solid #0284c7",
                        backgroundColor: "#f0f9ff",
                      }
                    : {}
                }
                onInput={handleManualRentChange}
              />
              {errors.monthlyRent && (
                <span className="roi-error">{errors.monthlyRent.message}</span>
              )}
            </div>

            <div className="roi-field">
              <label>Vacancy Rate (%)</label>
              <input
                {...register("vacancyRate")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.vacancyRate && (
                <span className="roi-error">{errors.vacancyRate.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 4: Operating Expenses */}
        <div className="roi-card">
          <h3>
            Operating Expenses{" "}
            <span
              style={{ fontSize: "13px", fontWeight: "normal", color: "#666" }}
            >
              (for cash flow — not part of DSCR)
            </span>
          </h3>
          <div className="roi-row">
            <div className="roi-field">
              <label>Property Mgmt (%)</label>
              <input
                {...register("propertyMgmt")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.propertyMgmt && (
                <span className="roi-error">{errors.propertyMgmt.message}</span>
              )}
            </div>
            <div className="roi-field">
              <label>Maintenance Reserve (%)</label>
              <input
                {...register("maintenance")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.maintenance && (
                <span className="roi-error">{errors.maintenance.message}</span>
              )}
            </div>
          </div>

          <div className="roi-buttons" style={{ marginTop: "20px" }}>
            <button type="submit" className="roi-btn-primary">
              Calculate DSCR
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="roi-btn-secondary"
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      {/* Results Box Panel */}
      <div className="roi-results-card" ref={resultsRef}>
        <h3>Results</h3>

        {results && (
          <div
            style={{
              padding: "14px",
              borderRadius: "6px",
              marginBottom: "20px",
              fontWeight: "bold",
              textAlign: "center",
              backgroundColor: getVerdictDetails(results.dscr).bg,
              color: getVerdictDetails(results.dscr).color,
              border: `1px solid ${getVerdictDetails(results.dscr).border}`,
            }}
          >
            {getVerdictDetails(results.dscr).text}
          </div>
        )}

        <div className="roi-results-grid">
          <div
            className="roi-result-box"
            style={{
              borderLeft: results
                ? `6px solid ${getVerdictDetails(results.dscr).border}`
                : "none",
            }}
          >
            <div>Debt Service Coverage Ratio (DSCR)</div>
            <div className="roi-result-value">
              {results
                ? results.dscr === Infinity
                  ? "∞ (All Cash Deal)"
                  : `${results.dscr.toFixed(2)}x`
                : "0.00x"}
            </div>
          </div>
          <div className="roi-result-box">
            <div>Effective Monthly Rent</div>
            <div className="roi-result-value">
              {results
                ? `$${Math.round(results.effectiveMonthlyRent).toLocaleString()}`
                : "$0.00"}
            </div>
          </div>
          <div className="roi-result-box">
            <div>Total Monthly PITIA</div>
            <div className="roi-result-value">
              {results
                ? `$${Math.round(results.monthlyPitia).toLocaleString()}`
                : "$0.00"}
            </div>
          </div>
          <div className="roi-result-box">
            <div>Monthly Cash Flow</div>
            <div
              className="roi-result-value"
              style={
                results
                  ? {
                      color:
                        results.monthlyCashFlow >= 0 ? "#2e7d32" : "#c62828",
                    }
                  : {}
              }
            >
              {results
                ? `$${Math.round(results.monthlyCashFlow).toLocaleString()}`
                : "$0.00"}
            </div>
          </div>
          <div className="roi-result-box">
            <div>Cash Flow After Opex</div>
            <div
              className="roi-result-value"
              style={
                results
                  ? {
                      color:
                        results.cashFlowAfterOpex >= 0 ? "#2e7d32" : "#c62828",
                    }
                  : {}
              }
            >
              {results
                ? `$${Math.round(results.cashFlowAfterOpex).toLocaleString()}`
                : "$0.00"}
            </div>
          </div>
        </div>

        <div
          className="roi-results-details"
          style={{
            marginTop: "24px",
            borderTop: "1px solid #eee",
            paddingTop: "16px",
          }}
        >
          <h4 style={{ marginBottom: "12px" }}>
            Transaction & Calculation Summary
          </h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div>
              <span>Loan Amount:</span>
              <strong>
                {results
                  ? `$${Math.round(results.loanAmount).toLocaleString()}`
                  : " —"}
              </strong>
            </div>
            <div>
              <span>Mortgage Principal & Interest (P&I):</span>
              <strong>
                {results
                  ? `$${Math.round(results.monthlyPi).toLocaleString()}/mo`
                  : " —"}
              </strong>
            </div>
            <div>
              <span>Property Taxes (Monthly allotment):</span>
              <strong>
                {results
                  ? `$${Math.round(results.monthlyTaxes).toLocaleString()}/mo`
                  : " —"}
              </strong>
            </div>
            <div>
              <span>Property Insurance (Monthly allotment):</span>
              <strong>
                {results
                  ? `$${Math.round(results.monthlyInsurance).toLocaleString()}/mo`
                  : " —"}
              </strong>
            </div>
            <div>
              <span>HOA / Association Dues:</span>
              <strong>
                {results
                  ? `$${Math.round(results.monthlyHoa).toLocaleString()}/mo`
                  : " —"}
              </strong>
            </div>
            <div>
              <span>Management & Maintenance Reserves:</span>
              <strong style={{ color: "#666" }}>
                {results
                  ? `$${Math.round(results.opexAmount).toLocaleString()}/mo`
                  : " —"}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DscrCalculator;
