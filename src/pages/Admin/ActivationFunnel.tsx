import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import "../../styles/Report.css";
import { GET_ACTIVATION_FUNNEL_METRICS } from "../../apollo/graphql/queries/Admin";
import { formatDate } from "../../utils/formatConversion";
import type {
  ActivationFunnelMetricsData,
  ActivationFunnelMetricsVars,
} from "../../types/Valuation";

const DATE_RANGE_OPTIONS = [
  { label: "Past 14 Days", value: 14 },
  { label: "Past 30 Days", value: 30 },
  { label: "Past 60 Days", value: 60 },
  { label: "Past 90 Days", value: 90 },
  { label: "Past 150 Days", value: 150 },
  { label: "Past 180 Days", value: 180 },
];

const ActivationFunnel: React.FC = () => {
  const [selectedDays, setSelectedDays] = useState<number | null>(null);

  // Track which funnel step's "stuck users" are currently expanded
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const { data, loading, error } = useQuery<
    ActivationFunnelMetricsData,
    ActivationFunnelMetricsVars
  >(GET_ACTIVATION_FUNNEL_METRICS, {
    variables: { dateRangeDays: selectedDays ?? 30 },
    skip: selectedDays === null,
    fetchPolicy: "network-only",
  });

  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const val = event.target.value;
    setSelectedDays(val ? Number(val) : null);
    setExpandedStep(null); // Reset expanded step on date change
  };

  const handleReset = () => {
    setSelectedDays(null);
    setExpandedStep(null);
  };

  const toggleExpandedStep = (stepKey: string) => {
    setExpandedStep((prev) => (prev === stepKey ? null : stepKey));
  };

  const metrics = data?.activationFunnelMetrics;

  const renderCohortCell = (pct: number | null) => {
    if (pct === null) {
      return (
        <span className="badge bg-light text-muted border border-secondary border-opacity-25 fw-normal">
          pending
        </span>
      );
    }
    return `${pct.toFixed(1)}%`;
  };

  return (
    <div className="reports-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h4 className="dashboard-title m-0">Activation Funnel Metrics</h4>

        <div className="d-flex align-items-center gap-2">
          <select
            value={selectedDays ?? ""}
            onChange={handleDateChange}
            className="form-select border-1"
            style={{
              borderRadius: "8px",
              padding: "8px 12px",
              fontSize: "14px",
              cursor: "pointer",
              minWidth: "180px",
            }}
          >
            <option value="">Select Date Range</option>
            {DATE_RANGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {selectedDays !== null && (
            <button
              onClick={handleReset}
              className="btn btn-outline-secondary"
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="reports-list">
        {selectedDays === null ? (
          <div
            className="report-wrapper-card d-flex align-items-center justify-content-center text-center p-5"
            style={{
              minHeight: "300px",
              borderRadius: "12px",
              backgroundColor: "#fff",
              border: "1px solid #e9ecef",
            }}
          >
            <span className="loader-text text-muted fs-6">
              Please select a date range to view activation funnel metrics.
            </span>
          </div>
        ) : loading ? (
          <div
            className="report-wrapper-card d-flex flex-column align-items-center justify-content-center p-5"
            style={{
              minHeight: "300px",
              borderRadius: "12px",
              backgroundColor: "#fff",
              border: "1px solid #e9ecef",
            }}
          >
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "inherit" }}
            >
              <span className="spinner"></span>
            </div>
            <span className="text-muted fs-6">Fetching metrics...</span>
          </div>
        ) : error || !metrics ? (
          <div
            className="report-wrapper-card d-flex align-items-center justify-content-center text-center p-5"
            style={{
              minHeight: "300px",
              borderRadius: "12px",
              backgroundColor: "#fff",
              border: "1px solid #e9ecef",
            }}
          >
            <span className="text-danger fs-6">
              {error
                ? error.message
                : `No activation metrics found for the past ${selectedDays} days.`}
            </span>
          </div>
        ) : (
          <div className="report-wrapper-card p-4">
            {/* Timeframe Banner */}
            <div className="date-window-banner d-flex justify-content-between align-items-center mb-4">
              <div className="date-pill bg-light px-3 py-2 rounded-2">
                <span className="fw-semibold">Timeframe:</span> Past{" "}
                {metrics.dateRangeDays} Days
              </div>
              <div className="computed-tag text-muted small">
                Calculated: {formatDate(metrics.calculatedAt)}
              </div>
            </div>

            {/* Primary Metrics Grid */}
            <div className="metrics-grid mb-4">
              <div className="metric-card primary">
                <span className="card-label">Total Cohort Users</span>
                <span className="card-value">{metrics.totalCohortUsers}</span>
              </div>

              <div className="metric-card primary">
                <span className="card-label">Activated Users</span>
                <span className="card-value">
                  {metrics.activatedUsersCount}
                </span>
                <span className="card-subtext">
                  {metrics.activationRatePercentage}% Rate
                </span>
              </div>

              <div className="metric-card primary highlight">
                <span className="card-label">Not Yet Activated</span>
                <span className="card-value">
                  {metrics.notYetActivatedUsersCount}
                </span>
              </div>

              <div className="metric-card primary highlight">
                <span className="card-label">Activation Rate</span>
                <span className="card-value">
                  {metrics.activationRatePercentage}%
                </span>
              </div>
            </div>

            {/* NEW: Step-Level Activation Funnel */}
            <div className="report-details-section mb-5">
              <h5 className="mb-3 fw-bold">Step-Level Activation Funnel</h5>
              {!metrics.funnelSteps || metrics.funnelSteps.length === 0 ? (
                <div className="text-muted small">
                  No funnel data available for this date range.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle border">
                    <thead className="table-light">
                      <tr>
                        <th className="text-start">Funnel Step</th>
                        <th className="text-center">Users Reached</th>
                        <th className="text-center">Total Conversion</th>
                        <th className="text-center">Step Drop-off</th>
                        <th className="text-center">Outreach</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.funnelSteps.map((step, index) => (
                        <React.Fragment key={step.stepKey}>
                          <tr>
                            <td className="text-start fw-medium d-flex align-items-center gap-2">
                              <span className="badge bg-secondary rounded-pill">
                                {index + 1}
                              </span>
                              {step.label}
                            </td>
                            <td className="text-center fw-bold">
                              {step.count}
                            </td>
                            <td className="text-center text-primary fw-semibold">
                              {step.conversionRatePct}%
                            </td>
                            <td className="text-center">
                              {step.stepDropoffPct > 0 ? (
                                <span className="text-danger fw-semibold">
                                  -{step.stepDropoffPct}%
                                </span>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td className="text-center">
                              {step.stuckUsers && step.stuckUsers.length > 0 ? (
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() =>
                                    toggleExpandedStep(step.stepKey)
                                  }
                                >
                                  {expandedStep === step.stepKey
                                    ? "Close"
                                    : `Stuck Users (${step.stuckUsers.length})`}
                                </button>
                              ) : (
                                <span className="text-muted small">None</span>
                              )}
                            </td>
                          </tr>

                          {/* Expanded row for stuck users */}
                          {expandedStep === step.stepKey && (
                            <tr className="bg-light">
                              <td colSpan={5} className="p-3">
                                <div className="p-3 bg-white border rounded">
                                  <h6 className="fw-bold mb-3 text-danger">
                                    Users Stuck at "{step.label}"
                                  </h6>
                                  <div className="d-flex flex-wrap gap-2">
                                    {step.stuckUsers.map((user) => (
                                      <span
                                        key={user.id}
                                        className="badge bg-light text-dark border p-2"
                                        style={{ fontSize: "0.85rem" }}
                                      >
                                        {user.email}
                                        <br />
                                        <span className="text-muted small fw-normal">
                                          Since: {formatDate(user.createdAt)}
                                        </span>
                                      </span>
                                    ))}
                                  </div>
                                  {step.stuckUsers.length === 20 && (
                                    <div className="text-muted small mt-2">
                                      * Showing top 20 most recent stuck users.
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Time to First Valuation Section */}
            <div className="report-details-section mb-5">
              <h5 className="mb-3 fw-bold">
                Time to First Valuation (Minutes)
              </h5>
              <div className="metrics-grid secondary">
                <div className="metric-card">
                  <span className="card-label">Median Time (p50)</span>
                  <span className="card-value">
                    {metrics.timeToFirstValuationMinutes?.median != null
                      ? `${metrics.timeToFirstValuationMinutes.median.toFixed(1)} m`
                      : "N/A"}
                  </span>
                </div>

                <div className="metric-card">
                  <span className="card-label">90th Percentile (p90)</span>
                  <span className="card-value">
                    {metrics.timeToFirstValuationMinutes?.p90 != null
                      ? `${metrics.timeToFirstValuationMinutes.p90.toFixed(1)} m`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Cohort Conversion Table Panel */}
            <div className="report-details-section">
              <h5 className="mb-3 fw-bold">
                Paid Conversion by Week-Since-Signup
              </h5>
              {!metrics.cohortTable || metrics.cohortTable.length === 0 ? (
                <div className="text-muted small">
                  No cohort conversion data available for this date range.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle border text-center">
                    <thead className="table-light">
                      <tr>
                        <th className="text-start">Signup Cohort</th>
                        <th>Cohort Size</th>
                        <th>Week 1</th>
                        <th>Week 2</th>
                        <th>Week 3</th>
                        <th>Week 4+</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.cohortTable.map((row) => (
                        <tr key={row.cohortWeek}>
                          <td className="text-start fw-medium">
                            {row.cohortWeek}
                          </td>
                          <td>{row.totalUsers}</td>
                          <td>{renderCohortCell(row.week1Pct)}</td>
                          <td>{renderCohortCell(row.week2Pct)}</td>
                          <td>{renderCohortCell(row.week3Pct)}</td>
                          <td>{renderCohortCell(row.week4PlusPct)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivationFunnel;
