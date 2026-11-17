import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { X, AlertTriangle, Info } from "lucide-react";
import "../../styles/Home.css";
import "../../styles/ReportHub.css";
import { SAMPLE_REPORTS_DETAILS } from "../../libs/constants/SampleReport";
import { SAMPLE_REPORTS } from "../../libs/constants/Reports";

interface ModalProps {
  reportId: string | null;
  onClose: () => void;
}

const SampleReportModal: React.FC<ModalProps> = ({ reportId, onClose }) => {
  if (!reportId || !SAMPLE_REPORTS_DETAILS[reportId]) return null;

  const data = SAMPLE_REPORTS_DETAILS[reportId];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "680px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                backgroundColor: "#EFF6FF",
                color: "#1A5FD4",
                padding: "2px 8px",
                borderRadius: "4px",
                textTransform: "uppercase",
              }}
            >
              {data.price} Sample Data Preview
            </span>
            <h2
              style={{
                margin: "6px 0 2px",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              {data.title}
            </h2>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748B" }}>
              {data.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#64748B",
              padding: "4px",
              borderRadius: "4px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#334155",
              marginBottom: "1.25rem",
              lineHeight: 1.5,
            }}
          >
            {data.summary}
          </p>

          {data.notice && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                padding: "0.85rem 1rem",
                borderRadius: "8px",
                border: "1px solid",
                fontSize: "0.85rem",
                marginBottom: "1.25rem",
                backgroundColor:
                  data.notice.type === "warning" ? "#FDF2F2" : "#EFF6FF",
                borderColor:
                  data.notice.type === "warning" ? "#FECACA" : "#BFDBFE",
                color: data.notice.type === "warning" ? "#991B1B" : "#1E40AF",
              }}
            >
              {data.notice.type === "warning" ? (
                <AlertTriangle
                  size={18}
                  style={{ flexShrink: 0, marginTop: "2px" }}
                />
              ) : (
                <Info size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
              )}
              <div>{data.notice.text}</div>
            </div>
          )}

          {data.groups.map((group, idx) => (
            <div key={idx} style={{ marginBottom: "1.25rem" }}>
              <h3
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#475569",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "0.6rem",
                }}
              >
                {group.sectionTitle}
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "0.6rem",
                }}
              >
                {group.fields.map((field, fIdx) => (
                  <div
                    key={fIdx}
                    style={{
                      backgroundColor: "#F8FAFC",
                      padding: "0.6rem 0.8rem",
                      borderRadius: "6px",
                      border: "1px solid #E2E8F0",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#64748B",
                        marginBottom: "2px",
                      }}
                    >
                      {field.label}
                    </span>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: field.highlight ? 700 : 600,
                        color:
                          field.status === "warning"
                            ? "#DC2626"
                            : field.status === "positive"
                              ? "#15803D"
                              : "#0F172A",
                      }}
                    >
                      {field.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            backgroundColor: "#F8FAFC",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "1px solid #CBD5E1",
              background: "#FFF",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "#334155",
            }}
          >
            Close Preview
          </button>
          <button
            onClick={() => {
              onClose();
              window.location.href = `/reports/${data.id}`;
            }}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
              background: "#1A5FD4",
              color: "#FFF",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            Order Live {data.title} ({data.price})
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   MAIN PAGE
   ========================================================================== */

export const SampleReports: React.FC = () => {
  const nav = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModalReportId, setActiveModalReportId] = useState<string | null>(
    null,
  );

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  const handleCardClick = (report: (typeof SAMPLE_REPORTS)[0]) => {
    if (SAMPLE_REPORTS_DETAILS[report.id]) {
      setActiveModalReportId(report.id);
    } else if (report.path) {
      nav(report.path);
    }
  };

  return (
    <div className="propomy-page reports-hub-root">
      <nav>
        <div className="nav-inner">
          <Link to="/" className="brand">
            <img width={36} height={36} src="/logo.png" alt="Propomy logo" />
            <span className="brand-name">Propomy</span>
          </Link>
          <ul className="nav-links">
            <li>
              <Link to="/" className={isActive("/") ? "active" : ""}>
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/reports"
                className={isActive("/reports") ? "active" : ""}
              >
                Reports
              </Link>
            </li>
            <li>
              <Link
                to="/sample-reports"
                className={isActive("/sample-reports") ? "active" : ""}
              >
                Sample Reports
              </Link>
            </li>
          </ul>
          <div className="nav-cta">
            <Link to="/reports" className="btn btn-primary">
              Browse Reports
            </Link>
            <button
              className="nav-toggle"
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="nav-mobile-menu">
            <Link
              to="/"
              className={isActive("/") ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/reports"
              className={isActive("/reports") ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Reports
            </Link>
            <Link
              to="/sample-reports"
              className={isActive("/sample-reports") ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Sample Reports
            </Link>
          </div>
        )}
      </nav>

      <section className="rh-hero">
        <div className="rh-hero-inner" style={{ textAlign: "center" }}>
          <div className="rh-hero-badge">
            <span className="rh-hero-badge-dot" aria-hidden="true" />
            Real reports, real formatting
          </div>

          <h1
            className="rh-hero-title"
            style={{ maxWidth: "100%", margin: "0 auto 20px" }}
          >
            Built on Data You{" "}
            <span className="rh-hero-highlight">Can Verify</span>
          </h1>

          <p
            className="rh-hero-sub"
            style={{ maxWidth: "620px", margin: "0 auto" }}
          >
            Every figure in a Propomy report is sourced, not guessed — down to
            the comp behind a valuation and the filing behind a lien. Click any
            report below to see a full, interactive sample built on a real
            address.
          </p>
        </div>
      </section>

      <section className="reports-catalog" aria-labelledby="reports-heading">
        <div className="reports-catalog-inner">
          <div
            className="reports-eyebrow"
            style={{
              justifyContent: "center",
              textAlign: "center",
              marginBottom: "36px",
            }}
          >
            <div>
              <span
                className="reports-eyebrow-label"
                style={{ display: "block", marginBottom: "8px" }}
              >
                SAMPLE REPORTS
              </span>
              <h2
                id="reports-heading"
                style={{
                  fontSize: "clamp(28px, 4vw, 38px)",
                  fontWeight: 800,
                  margin: "0 0 10px 0",
                  letterSpacing: "-0.025em",
                  color: "#0F172A",
                }}
              >
                Six Reports. One Price Each.
              </h2>
              <span className="reports-eyebrow-note">
                Pick exactly what you need for the deal in front of you — no
                bundle, no wasted spend.
              </span>
            </div>
          </div>

          <div className="reports-grid">
            {SAMPLE_REPORTS.map((report) => (
              <a
                key={report.id}
                href="#"
                className={`report-card${report.featured ? " featured" : ""}`}
                aria-label={`${report.title} — ${report.price}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleCardClick(report);
                }}
              >
                {report.badge && (
                  <span className="report-badge">{report.badge}</span>
                )}

                <div className="report-top">
                  <span
                    className="report-icon"
                    aria-hidden="true"
                    style={{
                      backgroundColor: `${report.iconColor}14`,
                      color: report.iconColor,
                    }}
                  >
                    {report.icon}
                  </span>
                  <span className="report-price">
                    <span className="report-price-value">{report.price}</span>
                  </span>
                </div>

                <div className="report-body">
                  <h3 className="report-title">{report.title}</h3>
                  <p className="report-desc">{report.description}</p>
                </div>

                <span className="report-cta">
                  <span className="report-cta-text">{report.ctaLabel}</span>
                  <span className="report-cta-arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="foot-top">
            <div className="foot-brand">
              <a href="/" className="brand">
                <span className="brand-mark">
                  <svg viewBox="0 0 24 24">
                    <path d="M3 10.5L12 3l9 7.5V21H15v-5h-6v5H3z" />
                  </svg>
                </span>
                <span className="brand-name">Propomy</span>
              </a>
              <p className="addr">
                Propomy Inc
                <br />8 The Green, Ste A<br />
                Dover, DE 19901
              </p>
              <p className="sup">
                Support:{" "}
                <a href="mailto:Support@Propomy.com">Support@Propomy.com</a>
              </p>
              <div className="foot-social">
                <a
                  href="https://www.instagram.com/propomyhq"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/propomy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="foot-cols">
              <div className="foot-col">
                <h4>Reports</h4>
                <Link to="/reports/deep-dive">Deep Dive — $36</Link>
                <Link to="/reports/valuation">Valuation — $10</Link>
                <Link to="/reports/comps">Comparables — $9</Link>
                <Link to="/reports/owner">Owner &amp; Contact — $8</Link>
                <Link to="/reports/deal-analysis">Deal Analysis — $13</Link>
                <Link to="/reports/market">Market &amp; Area — $7</Link>
                <Link to="/reports/debt-position">
                  Debt Position &amp; Report — $14
                </Link>
              </div>
              <div className="foot-col">
                <h4>Resources</h4>
                <Link to="/frequently-asked-questions">FAQ</Link>

                <Link to="/release">Release Notes</Link>
              </div>
              <div className="foot-col">
                <h4>Company</h4>
                <Link to="/privacy-policy">Privacy Policy</Link>
                <Link to="/terms-of-use">Terms of Use</Link>
              </div>
            </div>
          </div>
          <div className="foot-bottom">
            <p>© 2026 Propomy Inc. All rights reserved.</p>
            <div className="legal">
              <Link to="/privacy-policy">Privacy</Link>
              <Link to="/terms-of-use">Terms</Link>
            </div>
          </div>
        </div>
      </footer>

      <SampleReportModal
        reportId={activeModalReportId}
        onClose={() => setActiveModalReportId(null)}
      />
    </div>
  );
};

export default SampleReports;
