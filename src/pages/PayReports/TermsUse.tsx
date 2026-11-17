import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import "../../styles/Home.css";
import "../../styles/ReportHub.css";
import "../../styles/TermsUse.css";

interface TocItem {
  id: string;
  label: string;
}

const TOC_ITEMS: TocItem[] = [
  { id: "what-propomy-is", label: "1. What Propomy Is" },
  { id: "eligibility", label: "2. Eligibility" },
  { id: "accounts", label: "3. Accounts" },
  { id: "purchases-pricing-payment", label: "4. Purchases, Pricing & Payment" },
  { id: "no-advice", label: "5. No Investment, Legal, or Financial Advice" },
  { id: "third-party-data", label: "6. Third-Party Data" },
  { id: "acceptable-use", label: "7. Acceptable Use" },
  { id: "intellectual-property", label: "8. Intellectual Property" },
  { id: "disclaimer-of-warranties", label: "9. Disclaimer of Warranties" },
  { id: "limitation-of-liability", label: "10. Limitation of Liability" },
  { id: "indemnification", label: "11. Indemnification" },
  { id: "termination", label: "12. Termination" },
  { id: "governing-law", label: "13. Governing Law & Dispute Resolution" },
  { id: "changes", label: "14. Changes to These Terms" },
  { id: "contact", label: "15. Contact Us" },
];

function Section({
  id,
  num,
  title,
  registerSection,
  children,
}: {
  id: string;
  num: string;
  title: string;
  registerSection: (id: string) => (el: HTMLElement | null) => void;
  children: React.ReactNode;
}) {
  return (
    <section id={id} ref={registerSection(id)} className="tou-section">
      <h2 className="tou-h2">
        <span className="tou-num">{num}</span> {title}
      </h2>
      {children}
    </section>
  );
}

export const TermsOfUse: React.FC = () => {
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
      {/* ── NAV — exact copy from SampleReports.tsx ── */}
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
            Legal
          </div>

          <h1 className="rh-hero-title tou-hero-title">Terms of Use</h1>

          <p className="rh-hero-sub tou-hero-sub">
            Effective Aug 17, 2026 &nbsp;·&nbsp; Last updated Aug 14, 2026
          </p>
        </div>
      </section>

      <section className="reports-catalog">
        <div className="reports-catalog-inner">
          {/* Agreement banner */}
          <div className="tou-agreement-banner">
            <span className="tou-banner-icon" aria-hidden="true">
              <ShieldCheck size={18} />
            </span>
            <p className="tou-banner-p">
              By accessing or using Propomy, you agree to be bound by these
              Terms. If you do not agree, do not use the Service.
            </p>
          </div>

          <div className="tou-grid">
            {/* TOC */}
            <aside className="tou-toc-col">
              <div className="tou-toc-header">On this page</div>
              <ul className="tou-toc-list">
                {TOC_ITEMS.map((item) => {
                  const active = activeId === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={`tou-toc-link ${active ? "active" : ""}`}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </aside>

            {/* Content */}
            <main className="tou-content-col">
              <p className="tou-intro-box">
                Propomy Inc, a Delaware corporation with its registered office
                at <strong>8 The Green, Ste A, Dover, DE 19901</strong>{" "}
                ("Propomy," "we," "us," or "our"), operates the website located
                at propomy.com and related services (collectively, the
                "Service"). These Terms of Use ("Terms") govern your access to
                and use of the Service.
              </p>

              <Section
                id="what-propomy-is"
                num="01"
                title="What Propomy Is"
                registerSection={registerSection}
              >
                <p className="tou-p">
                  Propomy provides on-demand, pay-per-report real estate data
                  and analytics products, including but not limited to Valuation
                  Reports, Comparables Reports, Owner & Contact Reports, Deal
                  Analysis Reports, Market & Area Reports, and Distress & Lien
                  Reports (each a "Report"). Reports are generated using
                  automated valuation models, third-party real estate data
                  providers, and publicly available records.
                </p>
                <p className="tou-p tou-p-no-margin">
                  Propomy does not offer a subscription or membership plan. Each
                  Report is purchased individually at the price displayed at the
                  time of purchase.
                </p>
              </Section>

              <Section
                id="eligibility"
                num="02"
                title="Eligibility"
                registerSection={registerSection}
              >
                <p className="tou-p tou-p-no-margin">
                  You must be at least 18 years old and capable of forming a
                  binding contract to use the Service. By using Propomy, you
                  represent that you meet these requirements and that you are
                  using the Service for lawful purposes only.
                </p>
              </Section>

              <Section
                id="accounts"
                num="03"
                title="Accounts"
                registerSection={registerSection}
              >
                <p className="tou-p tou-p-no-margin">
                  Some features of the Service may require you to create an
                  account. You are responsible for maintaining the
                  confidentiality of your account credentials and for all
                  activity under your account. You agree to provide accurate
                  information and to notify us promptly of any unauthorized use.
                </p>
              </Section>

              <Section
                id="purchases-pricing-payment"
                num="04"
                title="Purchases, Pricing & Payment"
                registerSection={registerSection}
              >
                <h3 className="tou-h3">4.1 Pricing</h3>
                <p className="tou-p">
                  Prices for each Report are displayed at the point of purchase
                  and are subject to change at any time without notice. The
                  price in effect at the time you complete a purchase is the
                  price you will be charged.
                </p>

                <h3 className="tou-h3">4.2 Payment Processing</h3>
                <p className="tou-p">
                  All payments are processed through Stripe. By making a
                  purchase, you agree to Stripe's terms of service in addition
                  to these Terms. Propomy does not store your full payment card
                  information.
                </p>

                <h3 className="tou-h3">4.3 One-Time Purchases</h3>
                <p className="tou-p">
                  Each Report purchase is a single, one-time transaction.
                  Purchasing a Report does not create a recurring charge,
                  subscription, or membership of any kind.
                </p>

                <h3 className="tou-h3">4.4 Refunds</h3>
                <p className="tou-p">
                  Because Reports are digital products delivered instantly upon
                  generation, all purchases are final and non-refundable except
                  where required by law or at Propomy's sole discretion (for
                  example, where a Report fails to generate due to a technical
                  error on our end). Refund requests should be sent to
                  Support@Propomy.com.
                </p>

                <h3 className="tou-h3">4.5 Sales Tax</h3>
                <p className="tou-p tou-p-no-margin">
                  Applicable sales tax, if any, will be calculated and added at
                  checkout based on your location.
                </p>
              </Section>

              <Section
                id="no-advice"
                num="05"
                title="No Investment, Legal, or Financial Advice"
                registerSection={registerSection}
              >
                <div className="tou-callout">
                  <p className="tou-callout-p">
                    PROPOMY REPORTS ARE PROVIDED FOR INFORMATIONAL PURPOSES ONLY
                    AND DO NOT CONSTITUTE INVESTMENT, FINANCIAL, LEGAL, TAX, OR
                    PROFESSIONAL ADVICE OF ANY KIND.
                  </p>
                  <p className="tou-callout-p tou-p-no-margin">
                    PROPOMY MAKES NO GUARANTEE OF ACCURACY, COMPLETENESS, OR
                    RELIABILITY OF ANY DATA, VALUATION, ESTIMATE, OR CALCULATION
                    PROVIDED THROUGH THE SERVICE.
                  </p>
                </div>
                <p className="tou-p">
                  Property valuations, rental estimates, comparable sales data,
                  ROI/cap rate/cash-on-cash calculations, market statistics,
                  ownership and contact data, and distress/lien information are
                  generated using automated models and third-party data sources
                  and may contain errors, omissions, or outdated information.
                </p>
                <p className="tou-p tou-p-no-margin">
                  Estimated values (including AVM-based valuations) are
                  statistical estimates, not appraisals, and should not be
                  relied upon as the sole basis for any purchase, sale,
                  financing, investment, or other real estate decision. You
                  should independently verify all information and consult a
                  licensed appraiser, real estate agent, attorney, accountant,
                  or financial advisor before making any real estate or
                  investment decision.
                </p>
              </Section>

              <Section
                id="third-party-data"
                num="06"
                title="Third-Party Data"
                registerSection={registerSection}
              >
                <p className="tou-p tou-p-no-margin">
                  Report data is sourced in part from third-party real estate
                  data providers, public records, and county/municipal filings.
                  Propomy does not independently verify all third-party data and
                  is not responsible for inaccuracies, delays, or omissions
                  originating from these sources. Data availability and coverage
                  may vary by property and geography.
                </p>
              </Section>

              <Section
                id="acceptable-use"
                num="07"
                title="Acceptable Use"
                registerSection={registerSection}
              >
                <p className="tou-p">You agree not to:</p>
                <ul className="tou-ul">
                  <li className="tou-li">
                    Use the Service for any unlawful purpose, including in
                    violation of the Fair Credit Reporting Act (FCRA), Telephone
                    Consumer Protection Act (TCPA), Fair Housing Act, or any
                    applicable state or local law
                  </li>
                  <li className="tou-li">
                    Use Owner & Contact Report data to harass, stalk, or make
                    unsolicited contact in violation of Do-Not-Call (DNC) or
                    litigator flags provided in the Report
                  </li>
                  <li className="tou-li">
                    Scrape, reverse-engineer, or systematically extract data
                    from the Service using automated means
                  </li>
                  <li className="tou-li">
                    Resell, sublicense, or redistribute Reports or Report data
                    as a standalone data product to third parties without our
                    written consent
                  </li>
                  <li className="tou-li">
                    Misrepresent your identity or use the Service on behalf of
                    another person without authorization
                  </li>
                  <li className="tou-li tou-li-last">
                    Interfere with or disrupt the integrity or performance of
                    the Service
                  </li>
                </ul>
                <p className="tou-p tou-p-no-margin">
                  You are solely responsible for ensuring your use of any Report
                  — particularly Owner & Contact and Distress & Lien Reports —
                  complies with all applicable laws governing skip tracing, debt
                  collection, tenant screening, and consumer contact.
                </p>
              </Section>

              <Section
                id="intellectual-property"
                num="08"
                title="Intellectual Property"
                registerSection={registerSection}
              >
                <p className="tou-p tou-p-no-margin">
                  The Service, including its design, software, trademarks,
                  logos, and the compilation and presentation of Report data, is
                  owned by Propomy Inc or its licensors and is protected by
                  intellectual property laws. Purchasing a Report grants you a
                  limited, non-exclusive, non-transferable license to use that
                  Report for your own personal or internal business purposes. It
                  does not grant you any ownership interest in the underlying
                  data or the Propomy platform.
                </p>
              </Section>

              <Section
                id="disclaimer-of-warranties"
                num="09"
                title="Disclaimer of Warranties"
                registerSection={registerSection}
              >
                <div className="tou-callout tou-callout-no-margin">
                  <p className="tou-callout-p tou-p-no-margin">
                    THE SERVICE AND ALL REPORTS ARE PROVIDED "AS IS" AND "AS
                    AVAILABLE," WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS
                    OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES
                    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
                    ACCURACY, OR NON-INFRINGEMENT. PROPOMY DOES NOT WARRANT THAT
                    THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT ANY
                    REPORT WILL MEET YOUR REQUIREMENTS.
                  </p>
                </div>
              </Section>

              <Section
                id="limitation-of-liability"
                num="10"
                title="Limitation of Liability"
                registerSection={registerSection}
              >
                <div className="tou-callout">
                  <p className="tou-callout-p">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, PROPOMY INC, ITS
                    OFFICERS, EMPLOYEES, AND AFFILIATES SHALL NOT BE LIABLE FOR
                    ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                    PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR
                    BUSINESS OPPORTUNITY, ARISING OUT OF OR RELATED TO YOUR USE
                    OF THE SERVICE OR ANY REPORT, EVEN IF ADVISED OF THE
                    POSSIBILITY OF SUCH DAMAGES.
                  </p>
                  <p className="tou-callout-p tou-p-no-margin">
                    IN NO EVENT SHALL PROPOMY'S TOTAL AGGREGATE LIABILITY FOR
                    ANY CLAIM ARISING OUT OF OR RELATED TO THE SERVICE EXCEED
                    THE AMOUNT YOU PAID TO PROPOMY IN THE SIX (6) MONTHS
                    PRECEDING THE CLAIM.
                  </p>
                </div>
                <p className="tou-p tou-p-no-margin">
                  Some jurisdictions do not allow the exclusion or limitation of
                  certain damages, so some of the above limitations may not
                  apply to you.
                </p>
              </Section>

              <Section
                id="indemnification"
                num="11"
                title="Indemnification"
                registerSection={registerSection}
              >
                <p className="tou-p tou-p-no-margin">
                  You agree to indemnify and hold harmless Propomy Inc, its
                  officers, employees, and affiliates from any claims, damages,
                  losses, liabilities, and expenses (including reasonable
                  attorneys' fees) arising out of your use of the Service, your
                  violation of these Terms, or your violation of any law or
                  third-party right, including any misuse of Owner & Contact or
                  Distress & Lien Report data.
                </p>
              </Section>

              <Section
                id="termination"
                num="12"
                title="Termination"
                registerSection={registerSection}
              >
                <p className="tou-p tou-p-no-margin">
                  We may suspend or terminate your access to the Service at any
                  time, with or without notice, for conduct that we believe
                  violates these Terms or is otherwise harmful to Propomy or
                  other users. You may stop using the Service at any time.
                  Sections of these Terms that by their nature should survive
                  termination (including Sections 5, 8–11, and 13) will survive.
                </p>
              </Section>

              <Section
                id="governing-law"
                num="13"
                title="Governing Law & Dispute Resolution"
                registerSection={registerSection}
              >
                <p className="tou-p tou-p-no-margin">
                  These Terms are governed by the laws of the State of Delaware,
                  without regard to its conflict of law principles. Any dispute
                  arising out of or relating to these Terms or the Service shall
                  be resolved exclusively in the state or federal courts located
                  in Delaware, and you consent to the personal jurisdiction of
                  such courts.
                </p>
              </Section>

              <Section
                id="changes"
                num="14"
                title="Changes to These Terms"
                registerSection={registerSection}
              >
                <p className="tou-p tou-p-no-margin">
                  We may update these Terms from time to time. Material changes
                  will be reflected by an updated "Last Updated" date above.
                  Continued use of the Service after changes are posted
                  constitutes your acceptance of the revised Terms.
                </p>
              </Section>

              <Section
                id="contact"
                num="15"
                title="Contact Us"
                registerSection={registerSection}
              >
                <p className="tou-p tou-p-no-margin">
                  Questions about these Terms can be directed to:
                </p>
              </Section>

              <div className="tou-contact-card">
                <h2 className="tou-contact-title">Get in touch</h2>
                <p className="tou-contact-company">Propomy Inc</p>
                <p className="tou-contact-address">8 The Green, Ste A</p>
                <p className="tou-contact-address">Dover, DE 19901</p>
                <p className="tou-contact-email-wrapper">
                  <a
                    href="mailto:Support@Propomy.com"
                    className="tou-contact-email"
                  >
                    Support@Propomy.com
                  </a>
                </p>
              </div>

              <p className="tou-footer-disclaimer">
                This page reflects Propomy Inc's current Terms of Use as of the
                date above and is subject to change. For questions about how
                these Terms apply to your use of the Service, reach out using
                the contact details above.
              </p>
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
                <Link to="/privacy-policy">
                  Privacy Policy
                </Link>
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

export default TermsOfUse;
