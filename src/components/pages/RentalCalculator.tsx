import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { rentalCalculatorSchema } from "../../schemas/rentalCalculatorSchema";
import type { RentalFormValues, RentalResults } from "../../types/Calculators";
import {
  calculateRentalResults,
  defaultRentalValues,
} from "../../utils/rentalCalcualtorUtils";

const RentalCalculator = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<RentalFormValues>({
    defaultValues: defaultRentalValues,
    resolver: yupResolver(rentalCalculatorSchema),
    mode: "onBlur",
  });

  const [results, setResults] = useState<RentalResults | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const currentFormValues = watch();
  const liveResults = calculateRentalResults(currentFormValues);

  useEffect(() => {
    if (results) {
      setResults(liveResults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFormValues]);

  const onSubmit = (data: RentalFormValues) => {
    setResults(calculateRentalResults(data));
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
              <label>Down Payment (%)</label>
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
              <label>Loan Term</label>
              <select
                {...register("loanTerm")}
                className="roi-input roi-select"
              >
                <option value={30}>30 Years</option>
                <option value={20}>20 Years</option>
                <option value={15}>15 Years</option>
                <option value={10}>10 Years</option>
              </select>
              {errors.loanTerm && (
                <span className="roi-error">{errors.loanTerm.message}</span>
              )}
            </div>
          </div>
          <div className="roi-row">
            <div className="roi-field">
              <label>Closing Costs (%)</label>
              <input
                {...register("closingCost")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.closingCost && (
                <span className="roi-error">{errors.closingCost.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Rental Income */}
        <div className="roi-card">
          <h3>Rental Income</h3>
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
              <label>Other Income ($/mo)</label>
              <input
                {...register("otherIncome")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.otherIncome && (
                <span className="roi-error">{errors.otherIncome.message}</span>
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

        {/* Card 3: Operating Expenses */}
        <div className="roi-card">
          <h3>Operating Expenses</h3>
          <div className="roi-row">
            <div className="roi-field">
              <label>Property Tax ($/yr)</label>
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
              <label>HOA ($/mo)</label>
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
          </div>
          <div className="roi-row">
            <div className="roi-field">
              <label>Maintenance (%)</label>
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
              <label>Landlord Utilities ($/mo)</label>
              <input
                {...register("landlordUtilities")}
                type="number"
                step="any"
                className="roi-input"
              />
              {errors.landlordUtilities && (
                <span className="roi-error">
                  {errors.landlordUtilities.message}
                </span>
              )}
            </div>
          </div>

          <div className="roi-buttons" style={{ marginTop: "20px" }}>
            <button type="submit" className="roi-btn-primary">
              Calculate Rental
            </button>
            <button
              type="button"
              onClick={() => {
                reset(defaultRentalValues);
                setResults(null);
              }}
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

        {/* Verdict Badge Layer */}
        {results && (
          <div
            style={{
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "20px",
              fontWeight: "bold",
              textAlign: "center",
              backgroundColor:
                results.monthlyCashFlow >= 0 ? "#e8f5e9" : "#ffebee",
              color: results.monthlyCashFlow >= 0 ? "#2e7d32" : "#c62828",
              border: `1px solid ${results.monthlyCashFlow >= 0 ? "#2e7d32" : "#c62828"}`,
            }}
          >
            {results.monthlyCashFlow >= 0
              ? `Cash flowing — $${Math.round(results.monthlyCashFlow).toLocaleString()}/mo positive`
              : `Negative cash flow — $${Math.round(Math.abs(results.monthlyCashFlow)).toLocaleString()}/mo`}
          </div>
        )}

        <div className="roi-results-grid">
          <div className="roi-result-box">
            <div>Monthly Cash Flow</div>
            <div className="roi-result-value">
              {results
                ? `$${Math.round(results.monthlyCashFlow).toLocaleString()}`
                : "$0.00"}
            </div>
          </div>
          <div className="roi-result-box">
            <div>Annual Cash Flow</div>
            <div className="roi-result-value">
              {results
                ? `$${Math.round(results.annualCashFlow).toLocaleString()}`
                : "$0.00"}
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
            <div>Cap Rate</div>
            <div className="roi-result-value">
              {results ? `${results.capRate.toFixed(2)}%` : "0.00%"}
            </div>
          </div>
          <div className="roi-result-box">
            <div>Net Operating Income (Monthly)</div>
            <div className="roi-result-value">
              {results
                ? `$${Math.round(results.monthlyNoi).toLocaleString()}`
                : "$0.00"}
            </div>
          </div>
          <div className="roi-result-box">
            <div>Gross Rent Multiplier</div>
            <div className="roi-result-value">
              {results ? (
                results.grossRentMultiplier === Infinity ? (
                  <span style={{ color: "#c62828" }}>∞ (No Rent Entered)</span>
                ) : (
                  results.grossRentMultiplier.toFixed(2)
                )
              ) : (
                "$0.00"
              )}
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
              Loan Amount:{" "}
              <strong>
                {results
                  ? `$${Math.round(results.loanAmount).toLocaleString()}`
                  : "—"}
              </strong>
            </div>
            <div>
              Total Cash In:{" "}
              <strong>
                {results
                  ? `$${Math.round(results.totalCashIn).toLocaleString()}`
                  : "—"}
              </strong>
            </div>
            <div>
              Mortgage Payment (P&I):{" "}
              <strong>
                {results
                  ? `$${Math.round(results.monthlyMortgage).toLocaleString()}`
                  : "—"}
              </strong>
            </div>
            <div>
              DSCR:{" "}
              <strong>
                {results ? (
                  results.dscr === Infinity ? (
                    <span style={{ color: "#2e7d32" }}>
                      ∞ (No Debt Service)
                    </span>
                  ) : results.dscr === -Infinity ? (
                    <span style={{ color: "#c62828" }}>-∞</span>
                  ) : (
                    results.dscr.toFixed(2)
                  )
                ) : (
                  "—"
                )}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalCalculator;
