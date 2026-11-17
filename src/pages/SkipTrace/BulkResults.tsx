import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import { useBulkResults } from "../../hooks/useBulkResults";

const BulkResults: React.FC = () => {
  const nav = useNavigate();

  const {
    records,
    requestId,
    resultCount,
    total,
    isUnlocked,
    loading,
    isRedirecting,
    handleUnlock,
    handleDownload,
  } = useBulkResults();

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Processing records...</p>
      </div>
    );
  }

  const displayRecords = isUnlocked ? records : records.slice(0, 5);

  if (!records || records.length === 0)
    return (
      <div className="text-center mt-5">
        <button onClick={() => nav("/skip-trace")} className="btn btn-primary">
          Go Back
        </button>
      </div>
    );

  return (
    <div className="skip-trace-container d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      <main className="flex-grow-1 py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="fw-bold">
              {isUnlocked ? "Bulk Owner Report" : "Bulk Preview"}
            </h1>
            <p className="text-muted">Batch ID: {requestId}</p>
          </div>

          <div className="results-main-card shadow-lg bg-white rounded-4 overflow-hidden position-relative">
            {!isUnlocked && (
              <div className="unlock-overlay-container">
                <div className="unlock-card shadow-lg border">
                  <div className="d-flex flex-column align-items-center gap-3">
                    <h4 className="fw-bold mb-1">
                      {resultCount} matches found out of {total}
                    </h4>
                    <div className="h3 fw-bold mb-0 text-dark">
                      ${(resultCount * 0.50).toFixed(2)}
                    </div>
                    <button
                      onClick={handleUnlock}
                      disabled={isRedirecting}
                      className="btn btn-primary px-4 py-2 rounded-pill fw-bold"
                    >
                      {isRedirecting ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        "Unlock All Records"
                      )}
                    </button>
                    <p className="text-muted small mb-0 mt-1">
                      Note: We charge $0.50 for each record found.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className={`p-4 ${!isUnlocked ? "blur-content" : ""}`}>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Input Address</th>
                      <th>Owner Name</th>
                      <th>Phones</th>
                      <th>Emails</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayRecords.map((record, idx) => (
                      <tr key={idx}>
                        <td>{record.input?.address || "N/A"}</td>
                        <td>
                          {record.match
                            ? record.output?.identity?.names?.[0]?.fullName ||
                              "No Name Found"
                            : "No Match"}
                        </td>
                        <td className="text-primary">
                          {isUnlocked
                            ? record.output?.identity?.phones
                                ?.slice(0, 2)
                                .map((p) => p.phoneDisplay || p.phone)
                                .join(", ") || "N/A"
                            : "XXX-XXX-XXXX"}
                        </td>
                        <td className="text-primary">
                          {isUnlocked
                            ? record.output?.identity?.emails
                                ?.slice(0, 2)
                                .map((e) => e.email)
                                .join(", ") || "N/A"
                            : "••••@••••.com"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {isUnlocked && (
            <div className="d-flex justify-content-center gap-2 mt-4">
              <button
                onClick={handleDownload}
                className="btn btn-success rounded-pill px-4"
              >
                Download Full CSV
              </button>
              <button
                onClick={() => nav("/skip-trace/bulk")}
                className="btn btn-primary rounded-pill px-4"
              >
                New Bulk Upload
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BulkResults;
