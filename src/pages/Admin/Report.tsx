import React from "react";
import { useQuery } from "@apollo/client/react";
import "../../styles/Report.css";
import { GET_WEEKLY_REPORTS } from "../../apollo/graphql/queries/Admin";
import type { WeeklyReport } from "../../types/Admin";
import { formatCurrency, formatDate } from "../../utils/formatConversion";

interface WeeklyReportsData {
  WeeklyReports: WeeklyReport[];
}

const Report: React.FC = () => {
  const { data, loading } = useQuery<WeeklyReportsData>(GET_WEEKLY_REPORTS, {
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "inherit" }}
      >
        <span className="spinner"></span>
      </div>
    );
  }
  const reports = data?.WeeklyReports ?? [];

  return (
    <div className="reports-dashboard">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4 className="dashboard-title">Weekly Reports</h4>
      </div>

      <div className="reports-list">
        {reports.length === 0 ? (
          <div
            className="report-wrapper-card"
            style={{ textAlign: "center", padding: "40px 20px" }}
          >
            <span className="loader-text">No weekly reports found.</span>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="report-wrapper-card">
              <div className="report-card-header">
                <span className="report-id">ID: {report.id}</span>
              </div>

              <div className="date-window-banner">
                <div className="date-pill">
                  <span className="label">Window:</span>{" "}
                  {formatDate(report.windowStart)} –{" "}
                  {formatDate(report.windowEnd)}
                </div>
                <div className="computed-tag">
                  Computed: {formatDate(report.computedAt)}
                </div>
              </div>

              <div className="metrics-grid">
                <div className="metric-card primary">
                  <span className="card-label">Total Signups</span>
                  <span className="card-value">{report.signupsTotal}</span>
                </div>

                <div className="metric-card primary">
                  <span className="card-label">Activated Users</span>
                  <span className="card-value">{report.activated}</span>
                  <span className="card-subtext">
                    {report.activationRate !== null
                      ? `${(report.activationRate * 100).toFixed(1)}% Rate`
                      : "0% Rate"}
                  </span>
                </div>

                <div className="metric-card primary highlight">
                  <span className="card-label">Cohort Revenue</span>
                  <span className="card-value">
                    {formatCurrency(
                      report.cohortRevenueCents != null
                        ? report.cohortRevenueCents / 100
                        : null,
                    )}
                  </span>
                </div>

                <div className="metric-card primary highlight">
                  <span className="card-label">Net Revenue</span>
                  <span className="card-value">
                    {formatCurrency(
                      report.totalNetRevenueCents != null
                        ? report.totalNetRevenueCents / 100
                        : null,
                    )}
                  </span>
                </div>
              </div>

              <div className="report-details-section">
                <h5>Conversion & Subscriber Metrics</h5>
                <div className="metrics-grid secondary">
                  <div className="metric-card">
                    <span className="card-label">Active Paid Subs</span>
                    <span className="card-value">
                      {report.activePaidSubscribers}
                    </span>
                  </div>

                  <div className="metric-card">
                    <span className="card-label">Still Free</span>
                    <span className="card-value">{report.stillFree}</span>
                  </div>

                  <div className="metric-card">
                    <span className="card-label">Converted in Window</span>
                    <span className="card-value">
                      {report.convertedInWindow}
                    </span>
                  </div>

                  <div className="metric-card">
                    <span className="card-label">Prior Cohort Converts</span>
                    <span className="card-value">
                      {report.convertedFromPriorCohorts}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Report;
