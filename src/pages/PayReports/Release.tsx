import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, Mail } from "lucide-react";
import "../../styles/Home.css";
import "../../styles/ReportHub.css";
import "../../styles/Release.css";

interface ReleaseEntry {
  id: string;
  version: string;
  date: string;
  navLabel: string;
  navDate: string;
  title: string;
  description: string;
  reports: string[];
}

const RELEASES: ReleaseEntry[] = [
  {
    id: "reports-v1-0",
    version: "v1.0",
    date: "August 18, 2026",
    navLabel: "Reports v1.0",
    navDate: "Aug 18, 2026",
    title: "Propomy Reports v1.0",
    description:
      "Propomy launches on a pay-per-report model. Instead of a subscription, buy only the reports you need — six report types are available at launch, each generated on demand for a single property.",
    reports: [
      "Valuation Report",
      "Comparables Report",
      "Owner & Contact Report",
      "Deal Analysis Report",
      "Market & Area Report",
      "Distress & Lien Report",
    ],
  },
];

function ReleaseSection({
  release,
  registerSection,
}: {
  release: ReleaseEntry;
  registerSection: (id: string) => (el: HTMLElement | null) => void;
}) {
  return (
    <section
      id={release.id}
      ref={registerSection(release.id)}
      className="rn-release"
    >
      <div className="rn-release-meta">
        <span className="rn-version-badge">
          <span className="rn-version-dot" aria-hidden="true" />
          {release.version}
        </span>
        <span className="rn-release-date">{release.date}</span>
      </div>

      <h2 className="rn-release-title">{release.title}</h2>

      <p className="rn-release-desc">{release.description}</p>

      <div className="rn-reports-label">Reports Included</div>
      <div className="rn-reports-grid">
        {release.reports.map((report) => (
          <div className="rn-report-chip" key={report}>
            <CheckCircle2
              size={18}
              className="rn-report-check"
              aria-hidden="true"
            />
            <span>{report}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export const ReleaseNotes: React.FC = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>(RELEASES[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const registerSection = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div className="propomy-page reports-hub-root">
      {/* ── NAV — exact copy from TermsOfUse.tsx ── */}
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
      {/* ── HERO ── */}
      <section className="rh-hero">
        <div className="rh-hero-inner" style={{ textAlign: "center" }}>
          <div className="rh-hero-badge">
            <span className="rh-hero-badge-dot" aria-hidden="true" />
            Changelog
          </div>

          <h1 className="m-auto rh-hero-title rn-hero-title">Release Notes</h1>

          <p className="m-auto rh-hero-sub rn-hero-sub">
            What&apos;s new in the latest Propomy updates.
          </p>
        </div>
      </section>
      <section className="reports-catalog">
        <div className="reports-catalog-inner">
          <div className="rn-grid">
            {/* Releases list */}
            <aside className="rn-sidebar-col">
              <div className="rn-sidebar-header">Releases</div>
              <ul className="rn-sidebar-list">
                {RELEASES.map((release) => {
                  const active = activeId === release.id;
                  return (
                    <li key={release.id}>
                      <a
                        href={`#${release.id}`}
                        className={`rn-sidebar-link ${active ? "active" : ""}`}
                      >
                        <span className="rn-sidebar-link-title">
                          {release.navLabel}
                        </span>
                        <span className="rn-sidebar-link-date">
                          {release.navDate}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </aside>

            {/* Content */}
            <main className="rn-content-col">
              {RELEASES.map((release) => (
                <ReleaseSection
                  key={release.id}
                  release={release}
                  registerSection={registerSection}
                />
              ))}

              <div className="rn-divider" role="separator" />

              <div className="rn-cta-card">
                <div className="rn-cta-copy">
                  <h3 className="rn-cta-title">Questions about a release?</h3>
                  <p className="rn-cta-sub">
                    Our team is happy to help — reach out anytime.
                  </p>
                </div>
                <a href="mailto:Support@Propomy.com" className="rn-cta-btn">
                  <Mail size={16} aria-hidden="true" />
                  Support@Propomy.com
                </a>
              </div>
            </main>
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
    </div>
  );
};

export default ReleaseNotes;
