import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import "../../styles/SkipTrace.css";
const SkipTrace = () => {
  const nav = useNavigate();
  return (
    <div className="skip-trace-container d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1 d-flex align-items-start py-5">
        <div className="container">
          <div className="text-center mb-2 mb-md-4">
            <h2 className="fw-bold mb-5">
              Find Property{" "}
              <span className="brand-text-primary">Owner Data</span> In Seconds
            </h2>
            <h2 className="fw-bold mt-2 mt-md-4 mb-0 mb-md-2">
              Search By{" "}
              <span className="brand-text-primary text-opacity-50">
                Property Address
              </span>
            </h2>
            <p className="text-secondary fs-5">
              Skip Trace Any Address Or Upload CSV For Bulk Processing
            </p>
          </div>

          <div className="row justify-content-center g-4">
            <div className="col-12 col-md-5 col-xl-5">
              <div className="trace-card p-4 h-100  shadow-sm">
                <div className="mb-3">
                  <small className="text-muted fw-medium">Version 1.0</small>
                  <h4 className="fw-bold mt-1">Single Entry</h4>
                  <p className="text-muted small">
                    Enter a property address to quickly access verified owner
                    details and insights.
                  </p>
                </div>

                <div className="d-flex justify-content-between text-center mb-4 px-2">
                  <div className="feature-label">
                    Fast
                    <br />
                    Search
                  </div>
                  <div className="feature-label">
                    Accurate
                    <br />
                    Data
                  </div>
                  <div className="feature-label">
                    Instant
                    <br />
                    Results
                  </div>
                </div>

                <button
                  onClick={() => nav("/skip-trace/single")}
                  className="btn btn-brand-primary w-100"
                >
                  Single Entry
                </button>
              </div>
            </div>

            <div className="col-12 col-md-5 col-xl-5">
              <div className="trace-card p-4 h-100 shadow-sm">
                <div className="mb-3">
                  <small className="text-muted fw-medium">Version 1.0</small>
                  <h4 className="fw-bold mt-1">Bulk Upload</h4>
                  <p className="text-muted small">
                    Upload a CSV file to process multiple addresses and unlock
                    owner data.
                  </p>
                </div>

                <div className="d-flex justify-content-between text-center mb-4 px-2">
                  <div className="feature-label">
                    Unlimited
                    <br />
                    Rows
                  </div>
                  <div className="feature-label">
                    Validated
                    <br />
                    Data
                  </div>
                  <div className="feature-label">
                    CSV
                    <br />
                    Download
                  </div>
                </div>

                <button
                  onClick={() => nav("/skip-trace/bulk")}
                  className="btn btn-brand-primary w-100"
                >
                  Bulk Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-muted border-top border-light">
        <small>© 2026 Propomy. All rights reserved.</small>
      </footer>
    </div>
  );
};

export default SkipTrace;
