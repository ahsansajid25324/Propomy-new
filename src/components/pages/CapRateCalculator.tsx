import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Resolver } from "react-hook-form";

import { capRateGrmCalculatorSchema } from "../../schemas/caprateSchema";
import {
  calculateCapRateGrmResults,
  defaultCapRateGrmValues,
  defaultExpenseMode,
} from "../../utils/caprateUtils";
import type {
  CapRateGrmFormValues,
  CapRateGrmResults,
  ExpenseMode,
} from "../../types/Calculators";

const CapRateCalculator = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CapRateGrmFormValues>({
    defaultValues: defaultCapRateGrmValues,
    resolver: yupResolver(capRateGrmCalculatorSchema) as Resolver<CapRateGrmFormValues>,
    mode: "onBlur",
  });

  const [expenseMode, setExpenseMode] = useState<ExpenseMode>(defaultExpenseMode);
  const [results, setResults] = useState<CapRateGrmResults | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const currentFormValues = watch();
  const liveResults = calculateCapRateGrmResults(currentFormValues, expenseMode);

  useEffect(() => {
    if (results) {
      setResults(liveResults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFormValues, expenseMode]);

  const onSubmit = (data: CapRateGrmFormValues) => {
    setResults(calculateCapRateGrmResults(data, expenseMode));
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleReset = () => {
    reset(defaultCapRateGrmValues);
    setExpenseMode(defaultExpenseMode);
    setResults(null);
  };

  const getCapRateVerdict = (capRate: number) => {
    if (capRate < 0) {
      return {
        text: `Negative NOI — ${capRate.toFixed(2)}%`,
        bg: "#ffebee",
        color: "#c62828",
        border: "#c62828",
      };
    }
    if (capRate < 5) {
      return {
        text: `Thin cap rate — only ${capRate.toFixed(2)}%`,
        bg: "#ffebee",
        color: "#c62828",
        border: "#c62828",
      };
    }
    if (capRate < 8) {
      return {
        text: `Average cap rate — ${capRate.toFixed(2)}%`,
        bg: "#fff8e1",
        color: "#b78103",
        border: "#b78103",
      };
    }
    return {
      text: `Strong cap rate — ${capRate.toFixed(2)}%`,
      bg: "#e8f5e9",
      color: "#2e7d32",
      border: "#2e7d32",
    };
  };

  const getGrmVerdict = (grm: number) => {
    if (grm > 15) {
      return {
        text: `High GRM — ${grm.toFixed(2)}x gross rent, verify NOI closely`,
        bg: "#ffebee",
        color: "#c62828",
        border: "#c62828",
      };
    }
    if (grm > 10) {
      return {
        text: `Average GRM — ${grm.toFixed(2)}x gross rent`,
        bg: "#fff8e1",
        color: "#b78103",
        border: "#b78103",
      };
    }
    return {
      text: `Efficient GRM — ${grm.toFixed(2)}x gross rent`,
      bg: "#e8f5e9",
      color: "#2e7d32",
      border: "#2e7d32",
    };
  };

  return (
    <div className="roi-calculator-page">
      <form
        autoComplete="off"
        className="roi-form-container"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Card 1: Purchase & Income */}
        <div className="roi-card">
          <h3>Purchase & Income</h3>
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
                <span className="roi-error">{errors.purchasePrice.message}</span>
              )}
            </div>

            <div className="roi-field">
              <label>Monthly Gross Rent ($)</label>
              <input
                {...register("monthlyRent")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.monthlyRent && (
                <span className="roi-error">{errors.monthlyRent.message}</span>
              )}
            </div>
          </div>

          <div className="roi-row">
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

        {/* Card 2: Operating Expenses */}
        <div className="roi-card">
          <h3>Operating Expenses</h3>

          <div className="roi-buttons" style={{ marginBottom: "16px" }}>
            <button
              type="button"
              onClick={() => setExpenseMode("quick")}
              className={expenseMode === "quick" ? "roi-btn-primary" : "roi-btn-secondary"}
            >
              Quick
            </button>
            <button
              type="button"
              onClick={() => setExpenseMode("detailed")}
              className={expenseMode === "detailed" ? "roi-btn-primary" : "roi-btn-secondary"}
            >
              Detailed
            </button>
          </div>

          {expenseMode === "quick" ? (
            <div className="roi-row">
              <div className="roi-field">
                <label>Expense Ratio (% of gross rent)</label>
                <input
                  {...register("expenseRatio")}
                  type="number"
                  step="any"
                  className="roi-input"
                />
                {errors.expenseRatio && (
                  <span className="roi-error">{errors.expenseRatio.message}</span>
                )}
                <span style={{ fontSize: "12px", color: "#666", marginTop: "4px", display: "block" }}>
                  Covers taxes, insurance, management, maintenance & reserves. Vacancy is always
                  broken out separately, in both modes.
                </span>
              </div>
            </div>
          ) : (
            <>
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
                    <span className="roi-error">{errors.propertyTaxes.message}</span>
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
                  <label>Property Mgmt (% of collected rent)</label>
                  <input
                    {...register("propertyMgmtPct")}
                    type="number"
                    step="any"
                    className="roi-input"
                  />
                  {errors.propertyMgmtPct && (
                    <span className="roi-error">{errors.propertyMgmtPct.message}</span>
                  )}
                </div>
                <div className="roi-field">
                  <label>Maintenance & Reserves (% of gross rent)</label>
                  <input
                    {...register("maintenancePct")}
                    type="number"
                    step="any"
                    className="roi-input"
                  />
                  {errors.maintenancePct && (
                    <span className="roi-error">{errors.maintenancePct.message}</span>
                  )}
                </div>
              </div>
              <div className="roi-row">
                <div className="roi-field">
                  <label>HOA ($/yr)</label>
                  <input
                    {...register("hoa")}
                    type="number"
                    step="any"
                    className="roi-input"
                  />
                  {errors.hoa && <span className="roi-error">{errors.hoa.message}</span>}
                </div>
                <div className="roi-field">
                  <label>Other Expenses ($/yr)</label>
                  <input
                    {...register("otherExpenses")}
                    type="number"
                    step="any"
                    className="roi-input"
                  />
                  {errors.otherExpenses && (
                    <span className="roi-error">{errors.otherExpenses.message}</span>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="roi-buttons" style={{ marginTop: "20px" }}>
            <button type="submit" className="roi-btn-primary">
              Calculate
            </button>
            <button type="button" onClick={handleReset} className="roi-btn-secondary">
              Reset
            </button>
          </div>
        </div>
      </form>

      {/* Results Panel */}
      <div className="roi-results-card" ref={resultsRef}>
        <h3>Results</h3>

        {results && (
          <>
            <div
              style={{
                padding: "14px",
                borderRadius: "6px",
                marginBottom: "12px",
                fontWeight: "bold",
                textAlign: "center",
                backgroundColor: getCapRateVerdict(results.capRate).bg,
                color: getCapRateVerdict(results.capRate).color,
                border: `1px solid ${getCapRateVerdict(results.capRate).border}`,
              }}
            >
              {getCapRateVerdict(results.capRate).text}
            </div>

            <div
              style={{
                padding: "14px",
                borderRadius: "6px",
                marginBottom: "20px",
                fontWeight: "bold",
                textAlign: "center",
                backgroundColor: getGrmVerdict(results.grm).bg,
                color: getGrmVerdict(results.grm).color,
                border: `1px solid ${getGrmVerdict(results.grm).border}`,
              }}
            >
              {getGrmVerdict(results.grm).text}
            </div>
          </>
        )}

        <div className="roi-results-grid">
          <div
            className="roi-result-box"
            style={{
              borderLeft: results
                ? `6px solid ${getCapRateVerdict(results.capRate).border}`
                : "none",
            }}
          >
            <div>Cap Rate</div>
            <div className="roi-result-value">
              {results ? `${results.capRate.toFixed(2)}%` : "0.00%"}
            </div>
          </div>
          <div
            className="roi-result-box"
            style={{
              borderLeft: results ? `6px solid ${getGrmVerdict(results.grm).border}` : "none",
            }}
          >
            <div>GRM</div>
            <div className="roi-result-value">
              {results ? `${results.grm.toFixed(2)}x` : "0.00x"}
            </div>
          </div>
          <div className="roi-result-box">
            <div>NOI (Annual)</div>
            <div
              className="roi-result-value"
              style={results ? { color: results.noi >= 0 ? "#2e7d32" : "#c62828" } : {}}
            >
              {results ? `$${Math.round(results.noi).toLocaleString()}` : "$0.00"}
            </div>
          </div>
          <div className="roi-result-box">
            <div>Expense Ratio</div>
            <div className="roi-result-value">
              {results ? `${results.expenseRatioDisplay.toFixed(1)}%` : "0.0%"}
            </div>
          </div>
        </div>

        <div
          className="roi-results-details"
          style={{ marginTop: "24px", borderTop: "1px solid #eee", paddingTop: "16px" }}
        >
          <h4 style={{ marginBottom: "12px" }}>Income & Expense Breakdown</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>
              <span>Gross Annual Rent:</span>
              <strong>
                {results ? `$${Math.round(results.grossAnnualRent).toLocaleString()}` : " —"}
              </strong>
            </div>
            <div>
              <span>Vacancy Loss:</span>
              <strong>
                {results ? `$${Math.round(results.vacancyLoss).toLocaleString()}` : " —"}
              </strong>
            </div>
            <div>
              <span>Effective Gross Income:</span>
              <strong>
                {results ? `$${Math.round(results.effectiveGrossIncome).toLocaleString()}` : " —"}
              </strong>
            </div>
            <div>
              <span>Total Operating Expenses:</span>
              <strong>
                {results ? `$${Math.round(results.totalOperatingExpenses).toLocaleString()}` : " —"}
              </strong>
            </div>
            <div>
              <span>Expense Ratio:</span>
              <strong>
                {results ? `${results.expenseRatioDisplay.toFixed(1)}%` : " —"}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapRateCalculator;