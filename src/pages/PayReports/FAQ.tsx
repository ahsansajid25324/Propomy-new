import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import "../../styles/Home.css";
import "../../styles/ReportHub.css";
import "../../styles/FAQ.css";

interface FaqEntry {
  id: string;
  question: string;
  answer?: React.ReactNode;
  /** Internal note for the team — never rendered to end users. */
  internalNote?: string;
}

interface FaqCategory {
  id: string;
  label: string;
  items: FaqEntry[];
}

const CATEGORIES: FaqCategory[] = [
  {
    id: "general",
    label: "General",
    items: [
      {
        id: "what-is-propomy",
        question: "What is Propomy?",
        answer: (
          <p>
            Propomy is a pay-per-report real estate data platform. Instead of a
            subscription, you buy only the reports you need — Valuation,
            Comparables, Owner &amp; Contact, Deal Analysis, Market &amp; Area,
            or Debt Position — for a single property at a time.
          </p>
        ),
      },
      {
        id: "account-subscription",
        question: "Do I need an account or subscription to use Propomy?",
        answer: (
          <p>
            No. There's no membership or recurring fee. You can search a
            property and purchase a report directly, one at a time.
          </p>
        ),
      },
      {
        id: "six-reports-difference",
        question: "What's the difference between the six reports?",
        answer: (
          <>
            <p>Each report answers a different question:</p>
            <ul>
              <li>
                <strong>Valuation</strong> — what's this property worth?
              </li>
              <li>
                <strong>Comparables</strong> — what similar homes sold nearby?
              </li>
              <li>
                <strong>Owner &amp; Contact</strong> — who owns it, and how do I
                reach them?
              </li>
              <li>
                <strong>Deal Analysis</strong> — is this a good investment (ROI,
                cap rate, cash flow)?
              </li>
              <li>
                <strong>Market &amp; Area</strong> — what's the
                neighborhood/market like?
              </li>
              <li>
                <strong>Debt Position</strong> — what is the mortgage/loan
                position, foreclosure status, or liens attached?
              </li>
            </ul>
          </>
        ),
      },
    ],
  },
  {
    id: "pricing-payment",
    label: "Pricing & Payment",
    items: [
      {
        id: "buy-multiple-reports",
        question: "Can I buy multiple reports at once?",
        internalNote:
          "Confirm current cart/checkout behavior with Ahsan before publishing — flag as open question if bundling isn't built yet.",
      },
      {
        id: "payment-methods",
        question: "What payment methods do you accept?",
        answer: (
          <p>
            Payments are processed securely through Stripe — major credit and
            debit cards are accepted.
          </p>
        ),
      },
      {
        id: "refunds",
        question: "Do you offer refunds?",
        answer: (
          <p>
            Reports are digital products delivered instantly, so purchases are
            generally final. If a report fails to generate due to a technical
            error, contact{" "}
            <a href="mailto:Support@Propomy.com">Support@Propomy.com</a> and
            we'll make it right.
          </p>
        ),
      },
      {
        id: "free-trial-sample",
        question: "Is there a free trial or sample?",
        answer: (
          <p>
            Yes — check out our <Link to="/sample-reports">Sample Reports</Link>{" "}
            page to see real examples of each report type before you buy.
          </p>
        ),
      },
    ],
  },
  {
    id: "accuracy-data",
    label: "Accuracy & Data",
    items: [
      {
        id: "valuation-accuracy",
        question: "How accurate are the valuations?",
        answer: (
          <p>
            Valuations are generated using an AVM (automated valuation model)
            backed by real market data and comparable sales, with a confidence
            score included so you can gauge reliability. They're estimates, not
            formal appraisals — see our{" "}
            <Link to="/terms-of-use">Terms of Use</Link> for full disclaimers.
          </p>
        ),
      },
      {
        id: "data-source",
        question: "Where does your data come from?",
        answer: (
          <p>
            We source property, ownership, and market data from licensed real
            estate data providers and public records, combined with our own
            valuation and analytics models.
          </p>
        ),
      },
      {
        id: "data-freshness",
        question: "How current is the data?",
        internalNote:
          "Confirm refresh cadence with the team — likely varies by endpoint (e.g., AVM vs. public records) before publishing a specific claim.",
      },
      {
        id: "official-appraisal",
        question: "Can I use a report as an official appraisal?",
        answer: (
          <p>
            No. Reports are for informational purposes only and shouldn't
            replace a licensed appraiser, real estate agent, attorney, or
            financial advisor for major decisions.
          </p>
        ),
      },
    ],
  },
  {
    id: "report-specific",
    label: "Report-Specific",
    items: [
      {
        id: "owner-contact-includes",
        question: "What's included in the Owner & Contact Report?",
        answer: (
          <p>
            Owner name(s), mailing address, and ranked contact info (phone,
            email) where available, including Do-Not-Call and litigator flags
            for compliance.
          </p>
        ),
      },
      {
        id: "owner-contact-llc",
        question:
          "Does the Owner & Contact Report work for LLC-owned properties?",
        answer: (
          <p>
            Yes — if the property is owned by an entity, we attempt to unwind it
            to a natural person's contact info where possible.
          </p>
        ),
      },
      {
        id: "debt-position-clean",
        question:
          "What does the Debt Position Report show if there's nothing to report?",
        answer: (
          <p>
            It will clearly state "no open liens or foreclosure indicators
            found" rather than showing a blank or broken report — a clean result
            is a positive one.
          </p>
        ),
      },
      {
        id: "comparables-vs-valuation-comps",
        question:
          "What's the difference between the Comparables Report and the comps shown in a Valuation Report?",
        answer: (
          <p>
            The Valuation Report includes a few comps as backing for the AVM
            estimate. The Comparables Report is a full standalone comp set (up
            to 10 properties) with similarity scoring and adjustments.
          </p>
        ),
      },
      {
        id: "deal-analysis-assumptions",
        question:
          "What purchase assumptions does the Deal Analysis Report use if I don't enter my own numbers?",
        answer: (
          <p>
            Sensible defaults (e.g., 20% down, current average 30-year rate) are
            used and clearly labeled as assumptions, not treated as your actual
            terms.
          </p>
        ),
      },
      {
        id: "market-area-definition",
        question: 'How is "market" defined in the Market & Area Report?',
        answer: (
          <p>
            Stats are calculated within a defined radius of the subject property
            (default ~1 mile) — the report labels the exact geography used so
            you know the precision level.
          </p>
        ),
      },
    ],
  },
  {
    id: "legal-compliance",
    label: "Legal & Compliance",
    items: [
      {
        id: "owner-contact-legal-outreach",
        question: "Is it legal to use the Owner & Contact Report for outreach?",
        answer: (
          <p>
            You're responsible for complying with TCPA, DNC, and any applicable
            state contact laws when using this data — the report surfaces
            compliance flags, but usage is on you. See our{" "}
            <Link to="/terms-of-use">Terms of Use</Link>.
          </p>
        ),
      },
      {
        id: "sell-data",
        question: "Do you sell my search history or personal data?",
        answer: (
          <p>
            No. See our{" "}
            <a href="https://www.propomy.com/privacy-policy">Privacy Policy</a>{" "}
            for full details on what we collect and how it's used.
          </p>
        ),
      },
    ],
  },
];

export const PropomyFAQ: React.FC = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(
    CATEGORIES[0].id,
  );
  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set([CATEGORIES[0].items[0].id]),
  );
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id.replace("faq-cat-", ""));
          }
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    Object.values(categoryRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const registerCategory = (id: string) => (el: HTMLElement | null) => {
    categoryRefs.current[id] = el;
  };

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
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
              to="/faq"
              className={isActive("/faq") ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              FAQ
            </Link>
          </div>
        )}
      </nav>
      {/* ── HERO ── */}
      <section className="rh-hero">
        <div className="rh-hero-inner" style={{ textAlign: "center" }}>
          <div className="rh-hero-badge">
            <span className="rh-hero-badge-dot" aria-hidden="true" />
            Support
          </div>

          <h1 className="rh-hero-title faq-hero-title">
            Frequently Asked Questions
          </h1>

          <p className="rh-hero-sub faq-hero-sub">
            Answers about reports, pricing, data accuracy, and how Propomy
            works.
          </p>
        </div>
      </section>
      <section className="reports-catalog">
        <div className="reports-catalog-inner">
          <div className="faq-grid">
            {/* Category sidebar */}
            <aside className="faq-sidebar">
              <div className="faq-sidebar-header">Categories</div>
              <ul className="faq-category-list">
                {CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <a
                      href={`#faq-cat-${cat.id}`}
                      className={`faq-category-link ${
                        activeCategory === cat.id ? "active" : ""
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="faq-category-count">
                        {String(cat.items.length).padStart(2, "0")}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </aside>

            {/* FAQ content */}
            <main className="faq-content">
              {CATEGORIES.map((cat, idx) => (
                <section
                  key={cat.id}
                  id={`faq-cat-${cat.id}`}
                  ref={registerCategory(cat.id)}
                  className="faq-category-section"
                >
                  <h2 className="faq-category-title">
                    <span className="faq-category-num">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    {cat.label}
                  </h2>

                  <div className="faq-items">
                    {cat.items.map((item) => {
                      const isOpen = openItems.has(item.id);
                      return (
                        <div
                          key={item.id}
                          className={`faq-item ${isOpen ? "open" : ""}`}
                        >
                          <button
                            type="button"
                            className="faq-item-question"
                            aria-expanded={isOpen}
                            onClick={() => toggleItem(item.id)}
                          >
                            <span>{item.question}</span>
                            <span className="faq-item-icon">
                              {isOpen ? (
                                <Minus size={16} />
                              ) : (
                                <Plus size={16} />
                              )}
                            </span>
                          </button>
                          {isOpen && (
                            <div className="faq-item-answer">
                              {item.answer ? (
                                item.answer
                              ) : (
                                <p className="faq-item-pending">
                                  <span className="faq-pending-badge">
                                    Draft pending
                                  </span>
                                  This answer is still being finalized and isn't
                                  ready to publish yet.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}

              <div className="faq-contact-card">
                <h2 className="faq-contact-title">Still have questions?</h2>
                <p className="faq-contact-p">
                  Can't find what you're looking for? Our team is happy to help.
                </p>
                <a
                  href="mailto:Support@Propomy.com"
                  className="faq-contact-email"
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
      F
    </div>
  );
};

export default PropomyFAQ;
