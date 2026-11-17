import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { roiCalculatorSchema } from "../../schemas/roiCalculatorSchema";
import { calculateRoi } from "../../utils/roiCalculatorUtils";

import type { RoiInputValues, RoiResults } from "../../utils/roiCalculatorUtils";
import type { RoiCalculatorFormValues } from "../../types/Calculators";
import "../../styles/Calculators.css";

const defaultValues: RoiCalculatorFormValues = {
  purchasePrice: 0,
  downPayment: 0,
  closingCost: 0,
  appreciationRate: 3,
  rehabCost: 0,
  loanInterestRate: 4.5,
  loanTerm: 10,
  monthlyRentalIncome: 0,
  vacancy: 5,
  propertyTaxes: 0,
  insurance: 0,
  maintenance: 0,
};


const toNumericValues = (v: RoiCalculatorFormValues): RoiInputValues => ({
  purchasePrice: Number(v.purchasePrice) || 0,
  downPayment: Number(v.downPayment) || 0,
  closingCost: Number(v.closingCost) || 0,
  rehabCost: Number(v.rehabCost) || 0,
  loanInterestRate: Number(v.loanInterestRate) || 0,
  loanTerm: Number(v.loanTerm) || 0,
  monthlyRentalIncome: Number(v.monthlyRentalIncome) || 0,
  vacancy: Number(v.vacancy) || 0,
  propertyTaxes: Number(v.propertyTaxes) || 0,
  insurance: Number(v.insurance) || 0,
  appreciationRate: Number(v.appreciationRate) || 0,
  maintenance: Number(v.maintenance) || 0,
});

const ROICalculator = () => {
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
    reset,
  } = useForm<RoiCalculatorFormValues>({
    defaultValues,
    resolver: yupResolver(roiCalculatorSchema),
  });

  // Only need a flag — results are derived fresh every render, not stored in state
  const [hasCalculated, setHasCalculated] = useState(false);

  const currentFormValues = watch();
  const purchasePrice = Number(currentFormValues.purchasePrice) || 0;
  const downPayment = Number(currentFormValues.downPayment) || 0;
  const loanAmount = Math.max(0, purchasePrice - downPayment);

  let liveResults: RoiResults | null = null;
  try {
    liveResults = calculateRoi(toNumericValues(currentFormValues));
  } catch (err) {
    console.error("Live ROI calc skipped (invalid input):", err);
  }
  const displayResults = hasCalculated ? liveResults : null;

  const onSubmit = () => {
    setHasCalculated(true);
    console.log("ROI Results:", liveResults);
  };

  return (
    <div className="roi-calculator-page">
      <form
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="roi-form-container"
      >
        {/* Card 1: Property & Financing */}
        <div className="roi-card">
          <h3>Property & Financing</h3>

          <div className="roi-row">
            <div className="roi-field">
              <label>Purchase Price ($)</label>
              <input
                {...register("purchasePrice")}
                type="number"
                min="0"
                className="roi-input"
                onChange={(e) => {
                  register("purchasePrice").onChange(e);
                  trigger(["purchasePrice", "downPayment", "closingCost"]);
                }}
              />
              {errors.purchasePrice && (
                <span className="roi-error">{errors.purchasePrice.message}</span>
              )}
            </div>

            <div className="roi-field">
              <label>
                Down Payment ($)
                {purchasePrice > 0 && (
                  <span className="roi-down-payment-percent">
                    {" "}({((downPayment / purchasePrice) * 100).toFixed(2)}%)
                  </span>
                )}
              </label>
              <input
                {...register("downPayment")}
                type="number"
                min="0"
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
              <label>Loan Amount ($)</label>
              <input
                value={loanAmount}
                type="number"
                min="0"
                className="roi-input"
                readOnly
              />
            </div>
          </div>

          <div className="roi-row">
            <div className="roi-field">
              <label>Closing Cost ($)</label>
              <input
                {...register("closingCost")}
                type="number"
                min="0"
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
              <label>Rehab Cost ($)</label>
              <input
                {...register("rehabCost")}
                type="number"
                min="0"
                className="roi-input"
              />
              {errors.rehabCost && (
                <span className="roi-error">{errors.rehabCost.message}</span>
              )}
            </div>
          </div>

          <div className="roi-row">
            <div className="roi-field">
              <label>Loan Interest Rate (%)</label>
              <input
                {...register("loanInterestRate")}
                type="number"
                min="0"
                step="0.01"
                className="roi-input"
                
              />
              {errors.loanInterestRate && (
                <span className="roi-error">{errors.loanInterestRate.message}</span>
              )}
            </div>
            <div className="roi-field">
              <label>Loan Term (yrs)</label>
              <input
                {...register("loanTerm")}
                type="number"
                min="0"
                className="roi-input"
              />
              {errors.loanTerm && (
                <span className="roi-error">{errors.loanTerm.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Income and Expenses */}
        <div className="roi-card">
          <h3>Income and Expenses</h3>

          <div className="roi-row">
            <div className="roi-field">
              <label>Property Taxes ($/year)</label>
              <input
                {...register("propertyTaxes")}
                type="number"
                min="0"
                className="roi-input"
              />
              {errors.propertyTaxes && (
                <span className="roi-error">{errors.propertyTaxes.message}</span>
              )}
            </div>
            <div className="roi-field">
              <label>Insurance ($/year)</label>
              <input
                {...register("insurance")}
                type="number"
                min="0"
                className="roi-input"
              />
              {errors.insurance && (
                <span className="roi-error">{errors.insurance.message}</span>
              )}
            </div>
          </div>

          <div className="roi-row">
            <div className="roi-field">
              <label>Maintenance ($/year)</label>
              <input
                {...register("maintenance")}
                type="number"
                min="0"
                className="roi-input"
              />
              {errors.maintenance && (
                <span className="roi-error">{errors.maintenance.message}</span>
              )}
            </div>

            <div className="roi-field">
              <label>Appreciation Rate (%)</label>
              <input
                {...register("appreciationRate")}
                type="number"
                min="0"
                className="roi-input"
              />
              {errors.appreciationRate && (
                <span className="roi-error">{errors.appreciationRate.message}</span>
              )}
            </div>
          </div>

          <div className="roi-row">
            <div className="roi-field">
              <label>Monthly Rental Income ($)</label>
              <input
                {...register("monthlyRentalIncome")}
                type="number"
                min="0"
                className="roi-input"
              />
              {errors.monthlyRentalIncome && (
                <span className="roi-error">{errors.monthlyRentalIncome.message}</span>
              )}
            </div>
            <div className="roi-field">
              <label>Vacancy Rate (%)</label>
              <input
                {...register("vacancy")}
                type="number"
                min="0"
                max="100"
                className="roi-input"
              />
              {errors.vacancy && (
                <span className="roi-error">{errors.vacancy.message}</span>
              )}
            </div>
          </div>

          <div className="roi-buttons">
            <button type="submit" className="roi-btn-primary">
              Calculate ROI
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
                setHasCalculated(false);
              }}
              className="roi-btn-secondary"
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      {/* Right Column Canvas: Output Values View Panel */}
      <div className="roi-results-card">
        <h3>Results</h3>
        <div className="roi-results-grid">
          <div className="roi-result-box">
            <div>Net Operating Income (Annual)</div>
            <div className="roi-result-value">
              $ {displayResults
                ? displayResults.netOperatingIncome.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "0.00"}
            </div>
          </div>
          <div className="roi-result-box">
            <div>Cap Rate</div>
            <div className="roi-result-value">
              {displayResults ? displayResults.capRate.toFixed(2) : "0.00"} %
            </div>
          </div>
          <div className="roi-result-box">
            <div>Annual Cash Flow</div>
            <div className="roi-result-value">
              $ {displayResults ? displayResults.annualCashFlow.toFixed(2) : "0.00"}
            </div>
          </div>
          <div className="roi-result-box">
            <div>Cash-on-Cash Return</div>
            <div className="roi-result-value">
              {displayResults ? displayResults.cashOnCashReturn.toFixed(2) : "0.00"} %
            </div>
          </div>
          <div className="roi-result-box">
            <div>ROI (Including Equity Gain)</div>
            <div className="roi-result-value">
              {displayResults ? displayResults.roiYear1WithEquity.toFixed(2) : "0.00"} %
            </div>
          </div>
        </div>
        <div className="roi-results-details">
          <div>
            Loan Payment (monthly): $
            {displayResults ? displayResults.monthlyDebtService.toFixed(2) : "0.00"}
          </div>
          <div>
            Total Investment (Downpayment + Closing Cost + Rehab): $
            {displayResults ? displayResults.totalCashInvested.toFixed(2) : "0.00"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;