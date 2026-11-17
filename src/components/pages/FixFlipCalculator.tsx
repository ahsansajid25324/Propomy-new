import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Resolver } from "react-hook-form";

import { fixFlipCalculatorSchema } from "../../schemas/fixflipSchema";
import {
  calculateFixFlipResults,
  defaultFixFlipValues,
} from "../../utils/fixflipUtils";
import type {
  FixFlipFormValues,
  FixFlipResults,
} from "../../types/Calculators";

const FixFlipCalculator = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FixFlipFormValues>({
    defaultValues: defaultFixFlipValues,
    resolver: yupResolver(
      fixFlipCalculatorSchema,
    ) as Resolver<FixFlipFormValues>,
    mode: "onBlur",
  });

  const [results, setResults] = useState<FixFlipResults | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const currentFormValues = watch();
  const liveResults = calculateFixFlipResults(currentFormValues);

  useEffect(() => {
    if (results) {
      setResults(liveResults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFormValues]);

  const onSubmit = (data: FixFlipFormValues) => {
    setResults(calculateFixFlipResults(data));
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleReset = () => {
    reset(defaultFixFlipValues);
    setResults(null);
  };

  const getVerdictDetails = (roiPct: number) => {
    if (roiPct >= 20) {
      return {
        text: "Strong deal — ROI comfortably above 20%",
        bg: "#e8f5e9",
        color: "#2e7d32",
        border: "#2e7d32",
      };
    }
    if (roiPct >= 10) {
      return {
        text: "Workable deal — ROI in the 10–20% range",
        bg: "#fff8e1",
        color: "#b78103",
        border: "#b78103",
      };
    }
    return {
      text: "Thin or negative margin — ROI below 10%",
      bg: "#ffebee",
      color: "#c62828",
      border: "#c62828",
    };
  };

  const getMaoDetails = (purchasePrice: number, mao: number) => {
    const delta = mao - purchasePrice;
    if (delta >= 0) {
      return {
        text: `Purchase price is $${Math.round(delta).toLocaleString()} under the 70% rule MAO`,
        bg: "#e8f5e9",
        color: "#2e7d32",
        border: "#2e7d32",
      };
    }
    return {
      text: `Purchase price is $${Math.round(Math.abs(delta)).toLocaleString()} over the 70% rule MAO`,
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
        {/* Card 1: Purchase & Financing */}
        <div className="roi-card">
          <h3>Purchase & Financing</h3>
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
              <label>Closing Costs ($)</label>
              <input
                {...register("closingCosts")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.closingCosts && (
                <span className="roi-error">{errors.closingCosts.message}</span>
              )}
            </div>
            <div className="roi-field">
              <label>Loan Rate (%)</label>
              <input
                {...register("loanRate")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.loanRate && (
                <span className="roi-error">{errors.loanRate.message}</span>
              )}
            </div>
          </div>
          <div className="roi-row">
            <div className="roi-field">
              <label>Loan Points (%)</label>
              <input
                {...register("loanPoints")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.loanPoints && (
                <span className="roi-error">{errors.loanPoints.message}</span>
              )}
            </div>
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

        {/* Card 2: Rehab & Timeline */}
        <div className="roi-card">
          <h3>Rehab & Timeline</h3>
          <div className="roi-row">
            <div className="roi-field">
              <label>Rehab Budget ($)</label>
              <input
                {...register("rehabBudget")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.rehabBudget && (
                <span className="roi-error">{errors.rehabBudget.message}</span>
              )}
            </div>
            <div className="roi-field">
              <label>Contingency (%)</label>
              <input
                {...register("contingencyPct")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.contingencyPct && (
                <span className="roi-error">
                  {errors.contingencyPct.message}
                </span>
              )}
            </div>
          </div>
          <div className="roi-row">
            <div className="roi-field">
              <label>Rehab Timeline (months)</label>
              <input
                {...register("rehabMonths")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.rehabMonths && (
                <span className="roi-error">{errors.rehabMonths.message}</span>
              )}
            </div>
            <div className="roi-field">
              <label>Time to Sell (months)</label>
              <input
                {...register("sellMonths")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.sellMonths && (
                <span className="roi-error">{errors.sellMonths.message}</span>
              )}
            </div>
          </div>
          <div className="roi-row">
            <div className="roi-field">
              <label>Monthly Holding Costs ($/mo)</label>
              <input
                {...register("monthlyHolding")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.monthlyHolding && (
                <span className="roi-error">
                  {errors.monthlyHolding.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Sale Assumptions */}
        <div className="roi-card">
          <h3>Sale Assumptions</h3>
          <div className="roi-row">
            <div className="roi-field">
              <label>After Repair Value / ARV ($)</label>
              <input
                {...register("arv")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.arv && (
                <span className="roi-error">{errors.arv.message}</span>
              )}
            </div>

            <div className="roi-field">
              <label>Selling Costs (%)</label>
              <input
                {...register("sellingCostPct")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.sellingCostPct && (
                <span className="roi-error">
                  {errors.sellingCostPct.message}
                </span>
              )}
            </div>
          </div>

          <div className="roi-buttons" style={{ marginTop: "20px" }}>
            <button type="submit" className="roi-btn-primary">
              Calculate Flip
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
                backgroundColor: getVerdictDetails(results.roiPct).bg,
                color: getVerdictDetails(results.roiPct).color,
                border: `1px solid ${getVerdictDetails(results.roiPct).border}`,
              }}
            >
              {getVerdictDetails(results.roiPct).text}
            </div>

            <div
              style={{
                padding: "14px",
                borderRadius: "6px",
                marginBottom: "20px",
                fontWeight: "bold",
                textAlign: "center",
                backgroundColor: getMaoDetails(
                  currentFormValues.purchasePrice,
                  results.mao,
                ).bg,
                color: getMaoDetails(
                  currentFormValues.purchasePrice,
                  results.mao,
                ).color,
                border: `1px solid ${getMaoDetails(currentFormValues.purchasePrice, results.mao).border}`,
              }}
            >
              {getMaoDetails(currentFormValues.purchasePrice, results.mao).text}
            </div>
          </>
        )}

        <div className="roi-results-grid">
          <div
            className="roi-result-box"
            style={{
              borderLeft: results
                ? `6px solid ${getVerdictDetails(results.roiPct).border}`
                : "none",
            }}
          >
            <div>Total Profit</div>
            <div
              className="roi-result-value"
              style={
                results
                  ? { color: results.totalProfit >= 0 ? "#2e7d32" : "#c62828" }
                  : {}
              }
            >
              {results
                ? `$${Math.round(results.totalProfit).toLocaleString()}`
                : "$0.00"}
            </div>
          </div>
          <div className="roi-result-box">
            <div>ROI %</div>
            <div className="roi-result-value">
              {results ? `${results.roiPct.toFixed(2)}%` : "0.00%"}
            </div>
          </div>
          <div className="roi-result-box">
            <div>Annualized ROI %</div>
            <div className="roi-result-value">
              {results ? `${results.annualizedRoiPct.toFixed(2)}%` : "0.00%"}
            </div>
          </div>
          <div className="roi-result-box">
            <div>Break-Even Sale Price</div>
            <div className="roi-result-value">
              {results
                ? `$${Math.round(results.breakEvenSalePrice).toLocaleString()}`
                : "$0.00"}
            </div>
          </div>
          <div className="roi-result-box">
            <div>70%-Rule Max Allowable Offer</div>
            <div className="roi-result-value">
              {results
                ? `$${Math.round(results.mao).toLocaleString()}`
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
          <h4 style={{ marginBottom: "12px" }}>Project Cost Breakdown</h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div>
              <span>Total Project Cost:</span>
              <strong>
                {results
                  ? `$${Math.round(results.totalProjectCost).toLocaleString()}`
                  : " —"}
              </strong>
            </div>
            <div>
              <span>Total Cash Invested:</span>
              <strong>
                {results
                  ? `$${Math.round(results.totalCashInvested).toLocaleString()}`
                  : " —"}
              </strong>
            </div>
            <div>
              <span>Rehab Total (incl. contingency):</span>
              <strong>
                {results
                  ? `$${Math.round(results.rehabTotal).toLocaleString()}`
                  : " —"}
              </strong>
            </div>
            <div>
              <span>Holding Costs:</span>
              <strong>
                {results
                  ? `$${Math.round(results.holdingTotal).toLocaleString()}`
                  : " —"}
              </strong>
            </div>
            <div>
              <span>Financing Cost:</span>
              <strong>
                {results
                  ? `$${Math.round(results.financingCost).toLocaleString()}`
                  : " —"}
              </strong>
            </div>
            <div>
              <span>Selling Costs:</span>
              <strong>
                {results
                  ? `$${Math.round(results.sellingCosts).toLocaleString()}`
                  : " —"}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixFlipCalculator;
