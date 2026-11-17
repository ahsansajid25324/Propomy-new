import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/Home.css";
import "../../styles/ReportHub.css";
import "../../styles/PrivacyPolicy.css";

interface TocItem {
  id: string;
  label: string;
}

const TOC_ITEMS: TocItem[] = [
  { id: "information-we-collect", label: "1. Information We Collect" },
  { id: "how-we-use-information", label: "2. How We Use Information" },
  { id: "how-we-share-information", label: "3. How We Share Information" },
  { id: "data-about-non-users", label: "4. Data About Non-Users" },
  { id: "data-retention", label: "5. Data Retention" },
  { id: "cookies", label: "6. Cookies & Tracking" },
  { id: "data-security", label: "7. Data Security" },
  { id: "your-privacy-rights", label: "8. Your Privacy Rights" },
  { id: "childrens-privacy", label: "9. Children's Privacy" },
  { id: "international-users", label: "10. International Users" },
  { id: "changes", label: "11. Changes to This Policy" },
  { id: "contact", label: "12. Contact Us" },
];

export const PropomyPrivacyPolicy: React.FC = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>(TOC_ITEMS[0].id);
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
      {/* ── NAV ── */}
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
            <Link
              to="/privacy-policy"
              className={isActive("/privacy-policy") ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              Privacy Policy
            </Link>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="rh-hero">
        <div className="rh-hero-inner" style={{ textAlign: "center" }}>
          <div className="rh-hero-badge">
            <span className="rh-hero-badge-dot" aria-hidden="true" />
            Legal
          </div>

          <h1 className="rh-hero-title pp-hero-title">Privacy Policy</h1>

          <p className="rh-hero-sub pp-hero-sub">
            How Propomy collects, uses, and protects information across the
            Service.
          </p>

          <p className="pp-hero-meta">
            Effective Date: Aug 17, 2026 &nbsp;·&nbsp; Last Updated: Aug 14,
            2026
          </p>
        </div>
      </section>

      <section className="reports-catalog">
        <div className="reports-catalog-inner">
          <div className="pp-grid">
            {/* TOC sidebar */}
            <aside className="pp-sidebar">
              <div className="pp-sidebar-header">On This Page</div>
              <ul className="pp-toc-list">
                {TOC_ITEMS.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={`pp-toc-link ${
                        activeId === item.id ? "active" : ""
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Policy content */}
            <main className="pp-content">
              <p className="pp-intro">
                Propomy Inc, a Delaware corporation with its registered office
                at 8 The Green, Ste A, Dover, DE 19901 (&ldquo;Propomy,&rdquo;
                &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;),
                respects your privacy. This Privacy Policy explains how we
                collect, use, disclose, and protect information when you use
                propomy.com and related services (the &ldquo;Service&rdquo;).
              </p>
              <p className="pp-intro">
                By using the Service, you agree to the practices described in
                this policy. If you do not agree, please do not use the Service.
              </p>

              <section
                id="information-we-collect"
                ref={registerSection("information-we-collect")}
                className="pp-section"
              >
                <h2 className="pp-section-title">
                  <span className="pp-section-num">01</span>
                  Information We Collect
                </h2>

                <h3 className="pp-subheading">1.1 Information You Provide</h3>
                <ul>
                  <li>
                    <strong>Account information:</strong> name, email address,
                    and login credentials when you create an account (via
                    Auth0).
                  </li>
                  <li>
                    <strong>Payment information:</strong> billing details
                    processed through Stripe. Propomy does not store your full
                    card number.
                  </li>
                  <li>
                    <strong>Report requests:</strong> property addresses and
                    search inputs you submit to generate a Report.
                  </li>
                  <li>
                    <strong>Communications:</strong> information you provide
                    when you contact{" "}
                    <a href="mailto:Support@Propomy.com">Support@Propomy.com</a>{" "}
                    or otherwise communicate with us.
                  </li>
                </ul>

                <h3 className="pp-subheading">
                  1.2 Information Collected Automatically
                </h3>
                <ul>
                  <li>
                    <strong>Usage data:</strong> pages visited, features used,
                    buttons clicked, and time spent on the Service, collected
                    via PostHog.
                  </li>
                  <li>
                    <strong>Device and technical data:</strong> IP address,
                    browser type, device type, and operating system.
                  </li>
                  <li>
                    <strong>Cookies and similar technologies:</strong> used to
                    operate the Service, remember preferences, and analyze usage
                    (see Section 6).
                  </li>
                </ul>

                <h3 className="pp-subheading">
                  1.3 Information From Third Parties
                </h3>
                <p>
                  To generate Reports, Propomy queries third-party real estate
                  data providers (including RealEstateAPI and its underlying
                  data sources) and public records. Depending on the Report
                  type, this may include:
                </p>
                <ul>
                  <li>
                    Property characteristics, valuation, and sales history
                  </li>
                  <li>Ownership records and mailing addresses</li>
                  <li>
                    Skip-traced contact information (phone numbers, emails,
                    relatives) for Owner &amp; Contact Reports
                  </li>
                  <li>
                    Foreclosure, lien, and public filing data for Distress &amp;
                    Lien Reports
                  </li>
                  <li>
                    Demographic and market-level statistics for Market &amp;
                    Area Reports
                  </li>
                </ul>
                <p>
                  This third-party data may pertain to individuals who are not
                  Propomy users (e.g., property owners looked up by a Propomy
                  customer). See Section 8 for more on how we handle this.
                </p>
              </section>

              <section
                id="how-we-use-information"
                ref={registerSection("how-we-use-information")}
                className="pp-section"
              >
                <h2 className="pp-section-title">
                  <span className="pp-section-num">02</span>
                  How We Use Information
                </h2>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Generate and deliver the Reports you purchase</li>
                  <li>Process payments and maintain your account</li>
                  <li>Operate, maintain, and improve the Service</li>
                  <li>
                    Monitor usage and performance through analytics (PostHog),
                    including pageviews and conversion funnels
                  </li>
                  <li>
                    Communicate with you about your account, purchases, or
                    support requests
                  </li>
                  <li>
                    Detect, investigate, and prevent fraud, abuse, or violations
                    of our Terms of Use
                  </li>
                  <li>Comply with legal obligations</li>
                </ul>
                <p>
                  We do not use the personal data you submit (e.g., account
                  info, search history) to train third-party AI models beyond
                  what is necessary to generate your requested Report.
                </p>
              </section>

              <section
                id="how-we-share-information"
                ref={registerSection("how-we-share-information")}
                className="pp-section"
              >
                <h2 className="pp-section-title">
                  <span className="pp-section-num">03</span>
                  How We Share Information
                </h2>
                <p>
                  We do not sell your personal information. We may share
                  information as follows:
                </p>
                <ul>
                  <li>
                    <strong>Service providers:</strong> vendors who help us
                    operate the Service, including Stripe (payment processing),
                    Auth0 (authentication), RealEstateAPI (property, ownership,
                    and skip-trace data), PostHog (product analytics), MongoDB
                    Atlas / AWS (data storage and infrastructure), and Vercel
                    (hosting). These providers are contractually restricted from
                    using your information for purposes other than providing
                    services to Propomy.
                  </li>
                  <li>
                    <strong>Legal requirements:</strong> if required by law,
                    subpoena, or legal process, or to protect the rights,
                    property, or safety of Propomy, our users, or the public.
                  </li>
                  <li>
                    <strong>Business transfers:</strong> in connection with a
                    merger, acquisition, financing, or sale of assets involving
                    Propomy Inc or Propomy Operations LLC, subject to standard
                    confidentiality protections.
                  </li>
                  <li>
                    <strong>With your consent:</strong> in any other
                    circumstance, with your explicit permission.
                  </li>
                </ul>
              </section>

              <section
                id="data-about-non-users"
                ref={registerSection("data-about-non-users")}
                className="pp-section"
              >
                <h2 className="pp-section-title">
                  <span className="pp-section-num">04</span>
                  Data About Non-Users (Property Owners &amp; Contacts)
                </h2>
                <p>
                  Certain Reports — particularly the Owner &amp; Contact Report
                  and Distress &amp; Lien Report — include information about
                  individuals who are not Propomy users, sourced from public
                  records, county filings, and licensed skip-trace data
                  providers. Propomy does not independently collect this data;
                  it is retrieved from third-party sources at the time a Report
                  is requested.
                </p>
                <p>
                  If you are an individual whose information appears in a Report
                  generated by a Propomy customer and would like to make an
                  inquiry about that data, please contact{" "}
                  <a href="mailto:Support@Propomy.com">Support@Propomy.com</a>.
                  Because this data originates from third-party providers, we
                  may direct you to the original source where appropriate,
                  consistent with FCRA and applicable law.
                </p>
                <p>
                  Propomy customers are solely responsible for how they use
                  Owner &amp; Contact and Distress &amp; Lien Report data,
                  including compliance with Do-Not-Call (DNC) and litigator
                  flags, TCPA, and other applicable consumer protection laws, as
                  outlined in our <Link to="/terms-of-use">Terms of Use</Link>.
                </p>
              </section>

              <section
                id="data-retention"
                ref={registerSection("data-retention")}
                className="pp-section"
              >
                <h2 className="pp-section-title">
                  <span className="pp-section-num">05</span>
                  Data Retention
                </h2>
                <ul>
                  <li>
                    Account data is retained for as long as your account is
                    active, and for a reasonable period afterward to comply with
                    legal, tax, and accounting obligations.
                  </li>
                  <li>
                    Generated Reports are retained so you can access your
                    purchase history; retention periods may vary by Report type.
                  </li>
                  <li>
                    Payment records are retained as required by financial and
                    tax regulations.
                  </li>
                  <li>
                    Analytics data collected via PostHog is retained according
                    to our standard analytics retention practices.
                  </li>
                </ul>
                <p>
                  You may request deletion of your account data at any time,
                  subject to legal retention requirements (see Section 9).
                </p>
              </section>

              <section
                id="cookies"
                ref={registerSection("cookies")}
                className="pp-section"
              >
                <h2 className="pp-section-title">
                  <span className="pp-section-num">06</span>
                  Cookies &amp; Tracking Technologies
                </h2>
                <p>We use cookies and similar technologies to:</p>
                <ul>
                  <li>Keep you logged in and remember preferences</li>
                  <li>Understand how visitors use the Service (via PostHog)</li>
                  <li>Measure the performance of pages and Reports</li>
                </ul>
                <p>
                  You can control cookies through your browser settings.
                  Disabling cookies may affect the functionality of the Service.
                </p>
              </section>

              <section
                id="data-security"
                ref={registerSection("data-security")}
                className="pp-section"
              >
                <h2 className="pp-section-title">
                  <span className="pp-section-num">07</span>
                  Data Security
                </h2>
                <p>
                  We use commercially reasonable technical and organizational
                  measures to protect your information, including encrypted
                  payment processing (Stripe), authentication safeguards
                  (Auth0), and access controls on our infrastructure (AWS,
                  MongoDB Atlas). However, no method of transmission or storage
                  is completely secure, and we cannot guarantee absolute
                  security.
                </p>
              </section>

              <section
                id="your-privacy-rights"
                ref={registerSection("your-privacy-rights")}
                className="pp-section"
              >
                <h2 className="pp-section-title">
                  <span className="pp-section-num">08</span>
                  Your Privacy Rights
                </h2>
                <p>
                  Depending on your location, you may have rights under
                  applicable privacy laws (such as the California Consumer
                  Privacy Act, CCPA/CPRA, or other state privacy laws) to:
                </p>
                <ul>
                  <li>
                    Request access to the personal information we hold about you
                  </li>
                  <li>
                    Request correction or deletion of your personal information
                  </li>
                  <li>
                    Opt out of certain data sharing or sales (Propomy does not
                    sell personal information)
                  </li>
                  <li>Request a copy of your data in a portable format</li>
                </ul>
                <p>
                  To exercise these rights, contact{" "}
                  <a href="mailto:Support@Propomy.com">Support@Propomy.com</a>.
                  We may need to verify your identity before processing your
                  request.
                </p>
              </section>

              <section
                id="childrens-privacy"
                ref={registerSection("childrens-privacy")}
                className="pp-section"
              >
                <h2 className="pp-section-title">
                  <span className="pp-section-num">09</span>
                  Children&rsquo;s Privacy
                </h2>
                <p>
                  The Service is not directed to individuals under 18. We do not
                  knowingly collect personal information from children. If you
                  believe a child has provided us with personal information,
                  please contact us at{" "}
                  <a href="mailto:Support@Propomy.com">Support@Propomy.com</a>{" "}
                  and we will take steps to delete it.
                </p>
              </section>

              <section
                id="international-users"
                ref={registerSection("international-users")}
                className="pp-section"
              >
                <h2 className="pp-section-title">
                  <span className="pp-section-num">10</span>
                  International Users
                </h2>
                <p>
                  The Service is operated in the United States. If you access
                  the Service from outside the U.S., your information will be
                  transferred to, stored, and processed in the U.S., which may
                  have different data protection laws than your country of
                  residence.
                </p>
              </section>

              <section
                id="changes"
                ref={registerSection("changes")}
                className="pp-section"
              >
                <h2 className="pp-section-title">
                  <span className="pp-section-num">11</span>
                  Changes to This Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. Material
                  changes will be reflected by an updated &ldquo;Last
                  Updated&rdquo; date above. Continued use of the Service after
                  changes are posted constitutes acceptance of the revised
                  policy.
                </p>
              </section>

              <section
                id="contact"
                ref={registerSection("contact")}
                className="pp-section"
              >
                <h2 className="pp-section-title">
                  <span className="pp-section-num">12</span>
                  Contact Us
                </h2>
                <p>
                  Questions about this Privacy Policy or your data can be
                  directed to:
                </p>
                <p className="pp-address">
                  Propomy Inc
                  <br />
                  8 The Green, Ste A
                  <br />
                  Dover, DE 19901
                  <br />
                  <a href="mailto:Support@Propomy.com">Support@Propomy.com</a>
                </p>
              </section>

              <div className="pp-contact-card">
                <h2 className="pp-contact-title">Still have questions?</h2>
                <p className="pp-contact-p">
                  Can&rsquo;t find what you&rsquo;re looking for? Our team is
                  happy to help.
                </p>
                <a
                  href="mailto:Support@Propomy.com"
                  className="pp-contact-email"
                >
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

export default PropomyPrivacyPolicy;
