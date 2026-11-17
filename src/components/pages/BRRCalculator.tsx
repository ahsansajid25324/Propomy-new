import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  defaultValues,
  calculateMonthlyMortgage,
  calculateNewLoanAmount,
  calculateTotalHoldingCosts,
  calculateBrrrrResults,
  getVerdictDetails,
} from "../../utils/brrCalculatorUtils";
import { brrrrCalculatorSchema } from "../../schemas/brrCalculatorSchema";
import type { BrrrrFormValues, BrrrrResults } from "../../types/Calculators";

const BRRRRCalculator = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<BrrrrFormValues>({
    defaultValues,
    resolver: yupResolver(brrrrCalculatorSchema),
    mode: "onBlur",
  });

  const [results, setResults] = useState<BrrrrResults | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // 1. Watch all form fields live
  const currentFormValues = watch();

  // Individual live variables for form read-only fields
  const watchedTimeline = currentFormValues.rehabTimeline || 0;
  const watchedHoldingCost = currentFormValues.monthlyHoldingCosts || 0;
  const totalHoldingCostsCalculated = calculateTotalHoldingCosts(
    watchedHoldingCost,
    watchedTimeline,
  );

  const watchedArv = currentFormValues.arv || 0;
  const watchedLtv = currentFormValues.lenderLtv || 0;
  const newLoanAmountCalculated = calculateNewLoanAmount(
    watchedArv,
    watchedLtv,
  );

  const watchedRefiRate = currentFormValues.refiInterestRate || 0;
  const watchedTerm = currentFormValues.loanTerm || 0;

  const liveMonthlyMortgage = calculateMonthlyMortgage(
    newLoanAmountCalculated,
    watchedRefiRate,
    watchedTerm,
  );

  // 2. Generate the full live calculation results object
  const liveResults = calculateBrrrrResults(currentFormValues);

  // 3. Update the main results panel live once it has been initially calculated
  useEffect(() => {
    if (results) {
      setResults(liveResults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFormValues]);

  const onSubmit = (data: BrrrrFormValues) => {
    setResults(calculateBrrrrResults(data));
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="roi-calculator-page">
      <form
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="roi-form-container"
      >
        {/* Card 1: Buy & Rehab Inputs */}
        <div className="roi-card">
          <h3>Buy & Rehab</h3>
          <div className="roi-row">
            <div className="roi-field">
              <label>Purchase Price ($)</label>
              <input
                {...register("purchasePrice")}
                type="number"
                step="any"
                className="roi-input"
                onChange={(e) => {
                  register("purchasePrice").onChange(e);
                  trigger(["purchasePrice", "downPayment", "closingCost"]);
                }}
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
                onChange={(e) => {
                  register("downPayment").onChange(e);
                  trigger(["purchasePrice", "downPayment"]);
                }}
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
                {...register("closingCost")}
                type="number"
                step="any"
                className="roi-input"
                onChange={(e) => {
                  register("closingCost").onChange(e);
                  trigger(["purchasePrice", "downPayment", "closingCost"]);
                }}
              />
              {errors.closingCost && (
                <span className="roi-error">{errors.closingCost.message}</span>
              )}
            </div>
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
          </div>
          <div className="roi-row">
            <div className="roi-field">
              <label>Contingency (%)</label>
              <input
                {...register("contingency")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.contingency && (
                <span className="roi-error">{errors.contingency.message}</span>
              )}
            </div>
            <div className="roi-field">
              <label>Rehab Timeline (months)</label>
              <input
                {...register("rehabTimeline")}
                type="number"
                className="roi-input"
              />
              {errors.rehabTimeline && (
                <span className="roi-error">
                  {errors.rehabTimeline.message}
                </span>
              )}
            </div>
          </div>
          <div className="roi-row">
            <div className="roi-field">
              <label>Hard Money Rate (%)</label>
              <input
                {...register("hardMoneyRate")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.hardMoneyRate && (
                <span className="roi-error">
                  {errors.hardMoneyRate.message}
                </span>
              )}
            </div>
            <div className="roi-field">
              <label>Monthly Holding Costs ($)</label>
              <input
                {...register("monthlyHoldingCosts")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.monthlyHoldingCosts && (
                <span className="roi-error">
                  {errors.monthlyHoldingCosts.message}
                </span>
              )}
            </div>
          </div>
          <div className="roi-row">
            <div className="roi-field">
              <label>Total Holding Costs Calc ($ - Read Only)</label>
              <input
                value={totalHoldingCostsCalculated.toFixed(2)}
                type="text"
                className="roi-input"
                readOnly
                disabled
              />
            </div>
          </div>
        </div>

        {/* Card 2: Rent & Expenses Inputs */}
        <div className="roi-card">
          <h3>Rent & Expenses</h3>
          <div className="roi-row">
            <div className="roi-field">
              <label>Monthly Rent ($)</label>
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
          <div className="roi-row">
            <div className="roi-field">
              <label>Property Management (%)</label>
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
              <label>CapEx Reserve (%)</label>
              <input
                {...register("capexReserve")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.capexReserve && (
                <span className="roi-error">{errors.capexReserve.message}</span>
              )}
            </div>
          </div>
          <div className="roi-row">
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
          </div>
        </div>

        {/* Card 3: Refinance Strategy Inputs */}
        <div className="roi-card">
          <h3>Refinance</h3>
          <div className="roi-row">
            <div className="roi-field">
              <label>After Repair Value (ARV) ($)</label>
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
              <label>Lender LTV (%)</label>
              <input
                {...register("lenderLtv")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.lenderLtv && (
                <span className="roi-error">{errors.lenderLtv.message}</span>
              )}
            </div>
          </div>
          <div className="roi-row">
            <div className="roi-field">
              <label>Refi Interest Rate (%)</label>
              <input
                {...register("refiInterestRate")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.refiInterestRate && (
                <span className="roi-error">
                  {errors.refiInterestRate.message}
                </span>
              )}
            </div>
            <div className="roi-field">
              <label>Loan Term (years)</label>
              <input
                {...register("loanTerm")}
                type="number"
                className="roi-input"
              />
              {errors.loanTerm && (
                <span className="roi-error">{errors.loanTerm.message}</span>
              )}
            </div>
          </div>
          <div className="roi-row">
            <div className="roi-field">
              <label>New Loan Amt Calc ($ - Read Only)</label>
              <input
                value={newLoanAmountCalculated.toFixed(2)}
                type="text"
                className="roi-input"
                readOnly
                disabled
              />
            </div>
            <div className="roi-field">
              <label>Est. Monthly P&I ($ - Read Only)</label>
              <input
                value={liveMonthlyMortgage.toFixed(2)}
                type="text"
                className="roi-input"
                readOnly
                disabled
              />
            </div>
          </div>

          <div className="roi-buttons" style={{ marginTop: "20px" }}>
            <button type="submit" className="roi-btn-primary">
              Calculate BRRRR
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                setResults(null);
              }}
              className="roi-btn-secondary"
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      <div className="roi-results-card" ref={resultsRef}>
        <h3>Results</h3>

        {results && (
          <div
            style={{
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "20px",
              fontWeight: "bold",
              textAlign: "center",
              backgroundColor: getVerdictDetails(results.capitalRecycledPercent)
                .bg,
              color: getVerdictDetails(results.capitalRecycledPercent).color,
              border: `1px solid ${getVerdictDetails(results.capitalRecycledPercent).color}`,
            }}
          >
            Verdict: {getVerdictDetails(results.capitalRecycledPercent).label} (
            {results.capitalRecycledPercent.toFixed(1)}%)
          </div>
        )}

        <div className="roi-results-grid">
          <div className="roi-result-box">
            <div>Net Operating Income (Annual)</div>
            <div className="roi-result-value">
              $
              {results
                ? results.noi.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "0.00"}
            </div>
          </div>
          <div className="roi-result-box">
            <div>Cap Rate</div>
            <div className="roi-result-value">
              {results ? `${results.capRate.toFixed(2)}%` : "0.00%"}
            </div>
          </div>
          <div className="roi-result-box">
            <div>Annual Cash Flow</div>
            <div className="roi-result-value">
              $
              {results
                ? results.annualCashFlow.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "0.00"}
            </div>
          </div>
          <div className="roi-result-box">
            <div>Cash-on-Cash Return</div>
            <div className="roi-result-value">
              {results ? (
                results.cashOnCashReturn === Infinity ? (
                  <span style={{ color: "#2e7d32" }}>∞ (Infinite Return)</span>
                ) : results.cashOnCashReturn === -Infinity ? (
                  <span style={{ color: "#c62828" }}>-∞ (Infinite Loss)</span>
                ) : (
                  `${results.cashOnCashReturn.toFixed(2)}%`
                )
              ) : (
                "0.00%"
              )}
            </div>
          </div>
          <div className="roi-result-box">
            <div>Equity Captured</div>
            <div className="roi-result-value">
              $
              {results
                ? results.equityCaptured.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "0.00"}
            </div>
          </div>
          <div className="roi-result-box">
            <div>Cash Left in Deal</div>
            <div className="roi-result-value">
              $
              {results
                ? results.cashLeftInDeal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "0.00"}
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
          <h4 style={{ marginBottom: "12px" }}>Financial Metrics Summary</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div>
              Total Cash Invested:{" "}
              <strong>
                {results
                  ? results.totalCashInvested.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })
                  : "—"}
              </strong>
            </div>
            <div>
              Cash Pulled Out (Refi):{" "}
              <strong>
                {results
                  ? results.cashPulledOut.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })
                  : "—"}
              </strong>
            </div>
            <div>
              New Loan Amount:{" "}
              <strong>
                {results
                  ? results.newLoanAmount.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })
                  : "—"}
              </strong>
            </div>
            <div>
              Monthly Mortgage (P&I):{" "}
              <strong>
                {results
                  ? results.monthlyMortgage.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "—"}
              </strong>
            </div>
            <div>
              Monthly Cash Flow:{" "}
              <strong>
                {results
                  ? results.monthlyCashFlow.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "—"}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BRRRRCalculator;