import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Home.css";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#00C9A7" strokeWidth={2}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const HomeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 10.5L12 3l9 7.5V21h-6v-6H9v6H3z" />
  </svg>
);
const ComparablesIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 20V10M12 20V4M20 20v-7" />
  </svg>
);
const ContactIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);
const DealIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 17l5-5 4 4 8-8M21 8v6h-6" />
  </svg>
);
const MarketIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 3v18M15 3v18M3 8l6-2 6 2 6-2v14l-6 2-6-2-6 2z" />
  </svg>
);
const DebtIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 3l9 7H3l9-7z" />
  </svg>
);
/* ── Deal-analysis calculator icons ── */
const RoiIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 17l5-5 4 4 8-8M21 8v6h-6" />
  </svg>
);
const BrrrIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4v5h5M20 20v-5h-5" />
    <path d="M4.5 15a8 8 0 0013.9 3.5M19.5 9A8 8 0 005.6 5.5" />
  </svg>
);
const RentalIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v10M15 9.5c0-1.4-1.3-2.5-3-2.5s-3 1-3 2.3c0 3 6 1.4 6 4.3 0 1.4-1.3 2.4-3 2.4s-3-1-3-2.4" />
  </svg>
);
const DscrIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 21h18M4 21V10l8-6 8 6v11M9 21v-6h6v6" />
  </svg>
);
const FlipIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 3.5l6 6L9 21l-6-2 2-6z" />
    <path d="M13 5l6 6" />
  </svg>
);
const CapGrmIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 3v18" />
  </svg>
);

/* ── Property Deep Dive icon ── */
const DeepDiveIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2l9 5-9 5-9-5 9-5z" />
    <path d="M3 12l9 5 9-5" />
    <path d="M3 17l9 5 9-5" />
  </svg>
);

export default function PropomyHomeReports() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    root.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return (
    <div className="propomy-page" ref={rootRef}>
      {/* NAV */}
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

      {/* HERO */}
      <header className="hero">
        <div className="wrap">
          <span className="hero-eyebrow">
            <span className="dot" /> Pay-per-report real estate data
          </span>
          <h1>
            Real estate data,{" "}
            <span className="grad">one report at a time.</span>
          </h1>
          <p className="hero-sub">
            Enter an address and get a data-backed report in seconds —
            valuation, comps, owner contact info, deal analysis, market stats,
            property debt &amp; mortgage status, or the full property deep dive.
            No subscription, no account required, just the report.
          </p>
          <div className="hero-actions">
            <Link to="/reports" className="btn btn-primary btn-lg btn-arrow">
              Browse reports <ArrowIcon />
            </Link>
            <Link to="/sample-reports" className="btn btn-ghost btn-lg">
              See a sample report
            </Link>
          </div>
          <p className="hero-note">
            <strong>No sign-up required</strong> &nbsp;·&nbsp; Instant PDF &amp;
            on-screen results &nbsp;·&nbsp; Seven reports, buy only what you
            need
          </p>
        </div>

        {/* REPORT STRIP */}
        <div className="wrap">
          <div className="feat-strip reveal" id="reports">
            <a className="feat-box pdd-feat-box" href="#report-deepdive">
              <span className="feat-ic pdd-feat-ic">
                <DeepDiveIcon />
              </span>
              <div className="feat-t">Property Deep Dive</div>
              <div className="feat-d">All 6 reports bundled together</div>
              <span className="pdd-cta">All-in-one</span>
            </a>
            <a className="feat-box" href="#report-valuation">
              <span className="feat-ic">
                <HomeIcon />
              </span>
              <div className="feat-t">Valuation Report</div>
              <div className="feat-d">AVM estimate + confidence score</div>
            </a>
            <a className="feat-box" href="#report-comparables">
              <span className="feat-ic">
                <ComparablesIcon />
              </span>
              <div className="feat-t">Comparables Report</div>
              <div className="feat-d">
                Full comp set with similarity scoring
              </div>
            </a>
            <a className="feat-box" href="#report-owner">
              <span className="feat-ic">
                <ContactIcon />
              </span>
              <div className="feat-t">Owner &amp; Contact</div>
              <div className="feat-d">
                Owner name, mailing address, phone &amp; email
              </div>
            </a>
            <a className="feat-box" href="#report-deal">
              <span className="feat-ic">
                <DealIcon />
              </span>
              <div className="feat-t">Deal Analysis</div>
              <div className="feat-d">ROI, cap rate &amp; cash flow math</div>
            </a>
            <a className="feat-box" href="#report-market">
              <span className="feat-ic">
                <MarketIcon />
              </span>
              <div className="feat-t">Market &amp; Area</div>
              <div className="feat-d">Median price, DOM &amp; demographics</div>
            </a>
            <a className="feat-box" href="#report-debt">
              <span className="feat-ic">
                <DebtIcon />
              </span>
              <div className="feat-t">Property Debt</div>
              <div className="feat-d">
                Mortgages, pre-foreclosures &amp; liens
              </div>
            </a>
          </div>
        </div>

        {/* SIGNATURE PRODUCT MOCKUP */}
        <div className="cockpit-frame reveal">
          <div className="cockpit">
            <div className="cockpit-bar">
              <span className="dots">
                <i />
                <i />
                <i />
              </span>
              <span className="addr">
                <svg viewBox="0 0 24 24">
                  <path d="M12 21s-7-6.3-7-11a7 7 0 1114 0c0 4.7-7 11-7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                214 Maple Ave, Herndon VA
              </span>
              <span className="tag">Valuation Report</span>
            </div>
            <div className="cockpit-body">
              <div className="cockpit-left">
                <div className="val-label">Lender-Grade AVM</div>
                <div className="val-big mono">$642,500</div>
                <div className="val-conf">
                  <span className="dot" /> High confidence · 92%
                </div>
                <div className="range">
                  <div className="range-track">
                    <div className="range-fill" />
                    <div className="range-pin" />
                  </div>
                  <div className="range-legend">
                    <span>
                      Low <span className="mono">$598K</span>
                    </span>
                    <span>
                      Mid <span className="mono">$642K</span>
                    </span>
                    <span>
                      High <span className="mono">$689K</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="cockpit-right">
                <div className="rt-title">What&apos;s in the report</div>
                <div className="mini-metrics">
                  <div className="mini-metric">
                    <div className="k">Confidence score</div>
                    <div className="v pos">92%</div>
                  </div>
                  <div className="mini-metric">
                    <div className="k">Backing comps</div>
                    <div className="v mono">6</div>
                  </div>
                  <div className="mini-metric">
                    <div className="k">Delivery time</div>
                    <div className="v mono">&lt;15s</div>
                  </div>
                  <div className="mini-metric">
                    <div className="k">Format</div>
                    <div className="v mono">PDF</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* TRUST LINE */}
      <section className="trust">
        <div className="wrap">
          <p>How pay-per-report works</p>
          <div className="trust-row">
            <span className="trust-chip">
              <CheckIcon /> No subscription — pay per report
            </span>
            <span className="trust-chip">
              <CheckIcon /> No account or sign-up needed
            </span>
            <span className="trust-chip">
              <CheckIcon /> Delivered in seconds
            </span>
            <span className="trust-chip">
              <CheckIcon /> Sourced from licensed property data
            </span>
            <span className="trust-chip">
              <CheckIcon /> Seven reports, priced individually
            </span>
          </div>
        </div>
      </section>

      {/* REPORTS */}
      <div className="features wrap">
        {/* 01 VALUATION */}
        <section className="feature reveal" id="report-valuation">
          <div className="feature-copy">
            <div className="feature-num">
              01 <span className="ey">Instant PDF</span>
            </div>
            <h2>Valuation Report</h2>
            <p className="feature-desc">
              Type in any address and get a lender-grade automated valuation — a
              low, mid, and high estimate plus a confidence score, backed by the
              comparable sales that support the number. Full property
              characteristics included.
            </p>
            <ul className="feature-list">
              <li>
                <CheckIcon /> Beds, baths, sqft, lot size, year built, roof
                &amp; construction
              </li>
              <li>
                <CheckIcon /> Ownership, tax, and full sale history
              </li>
              <li>
                <CheckIcon /> Low / mid / high AVM estimate with a confidence
                score
              </li>
              <li>
                <CheckIcon /> Backing comparables that support the valuation
              </li>
            </ul>
            <div className="feature-foot">
              <Link to="/reports/valuation" className="feature-link">
                Buy a Valuation Report <ArrowIcon />
              </Link>
            </div>
          </div>
          <div className="feature-visual">
            <div className="visual">
              <div className="v-head">
                <span className="v-title">
                  <span className="ic">
                    <HomeIcon />
                  </span>{" "}
                  Valuation Report
                </span>
                <span className="v-badge">92% confidence</span>
              </div>
              <div className="vv-row">
                <span className="vv-big mono">$642,500</span>
                <span className="vv-delta">▲ 4.2% YoY</span>
              </div>
              <div className="vv-bar">
                <i />
                <b />
              </div>
              <div className="vv-legend">
                <span>Low $598K</span>
                <span>Mid $642K</span>
                <span>High $689K</span>
              </div>
            </div>
          </div>
        </section>

        {/* 02 COMPARABLES */}
        <section className="feature flip reveal" id="report-comparables">
          <div className="feature-copy">
            <div className="feature-num">
              02 <span className="ey">Instant PDF</span>
            </div>
            <h2>Comparables Report</h2>
            <p className="feature-desc">
              Get the full comp set behind any address — not just three
              cherry-picked sales. Custom comp parameters, similarity scoring,
              and fallback logic so you can trust the set even in thin markets.
            </p>
            <ul className="feature-list">
              <li>
                <CheckIcon /> Subject property baseline characteristics
              </li>
              <li>
                <CheckIcon /> Full comp set with similarity scoring
              </li>
              <li>
                <CheckIcon /> Custom radius, recency &amp; adjustment boosts
              </li>
            </ul>
            <div className="feature-foot">
              <Link to="/reports/comps" className="feature-link">
                Buy a Comparables Report <ArrowIcon />
              </Link>
            </div>
          </div>
          <div className="feature-visual">
            <div className="visual">
              <div className="v-head">
                <span className="v-title">
                  <span className="ic">
                    <ComparablesIcon />
                  </span>{" "}
                  Comparables Report
                </span>
                <span className="v-badge">6 comps found</span>
              </div>
              <div className="cmp-list">
                <div className="cmp-card win">
                  <div className="cc-a">89 Oak St</div>
                  <div className="cc-v">$635K</div>
                  <div className="cc-s">96% match</div>
                </div>
                <div className="cmp-card">
                  <div className="cc-a">42 Cedar Ct</div>
                  <div className="cc-v">$618K</div>
                  <div className="cc-s">91% match</div>
                </div>
                <div className="cmp-card">
                  <div className="cc-a">7 Birch Ln</div>
                  <div className="cc-v">$651K</div>
                  <div className="cc-s">89% match</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 OWNER & CONTACT */}
        <section className="feature reveal" id="report-owner">
          <div className="feature-copy">
            <div className="feature-num">
              03 <span className="ey">Instant PDF</span>
            </div>
            <h2>Owner &amp; Contact Report</h2>
            <p className="feature-desc">
              Find out who owns any property and how to reach them. Recorded
              owner name and mailing address, plus phone numbers, emails, and
              relatives from skip trace — with Do-Not-Call and litigator flags
              so your outreach stays compliant.
            </p>
            <ul className="feature-list">
              <li>
                <CheckIcon /> Recorded owner name(s) and mailing address
              </li>
              <li>
                <CheckIcon /> Phone numbers, emails &amp; known relatives
              </li>
              <li>
                <CheckIcon /> DNC and litigator flags included
              </li>
              <li>
                <CheckIcon /> If the owner is an LLC or entity, we identify the
                people behind it
              </li>
            </ul>
            <div className="feature-foot">
              <Link to="/reports/owner" className="feature-link">
                Buy an Owner &amp; Contact Report <ArrowIcon />
              </Link>
            </div>
          </div>
          <div className="feature-visual">
            <div className="visual">
              <div className="v-head">
                <span className="v-title">
                  <span className="ic">
                    <ContactIcon />
                  </span>{" "}
                  Owner &amp; Contact
                </span>
                <span className="v-badge">LLC identified</span>
              </div>
              <div className="calc-out">
                <div className="calc-line">
                  <span>Recorded owner</span>
                  <span className="mono">Maple Holdings LLC</span>
                </div>
                <div className="calc-line">
                  <span>Mailing address</span>
                  <span className="mono">PO Box 214</span>
                </div>
                <div className="calc-line">
                  <span>Phone on file</span>
                  <span className="mono">(571) 555-0142</span>
                </div>
                <div className="calc-line total">
                  <span>DNC / litigator flag</span>
                  <span className="mono">Clear</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04 DEAL ANALYSIS */}
        <section className="feature flip reveal" id="report-deal">
          <div className="feature-copy">
            <div className="feature-num">
              04 <span className="ey">Instant PDF</span>
            </div>
            <h2>Deal Analysis Report</h2>
            <p className="feature-desc">
              The complete underwriting picture in one report. Property
              characteristics, an AVM-backed value estimate, a comp-based sanity
              check, and ROI, cap rate, cash-on-cash, DSCR and BRRRR math
              already run for you.
            </p>
            <ul className="feature-list">
              <li>
                <CheckIcon /> Property characteristics plus tax &amp; sale
                history
              </li>
              <li>
                <CheckIcon /> AVM value estimate with a comp-based sanity check
              </li>
              <li>
                <CheckIcon /> ROI, cap rate, cash-on-cash, DSCR &amp; BRRRR math
                included
              </li>
            </ul>
            <div className="feature-foot">
              <Link to="/reports/deal-analysis" className="feature-link">
                Buy a Deal Analysis Report <ArrowIcon />
              </Link>
            </div>
          </div>
          <div className="feature-visual">
            <div className="visual">
              <div className="v-head">
                <span className="v-title">
                  <span className="ic">
                    <DealIcon />
                  </span>{" "}
                  Deal Analysis
                </span>
                <span className="v-badge">ROI + Cap Rate</span>
              </div>
              <div className="calc-grid">
                <div className="calc-chip active">
                  <span>
                    <RoiIcon />
                  </span>
                  ROI
                </div>
                <div className="calc-chip">
                  <span>
                    <BrrrIcon />
                  </span>
                  BRRRR
                </div>
                <div className="calc-chip">
                  <span>
                    <RentalIcon />
                  </span>
                  Rental
                </div>
                <div className="calc-chip">
                  <span>
                    <DscrIcon />
                  </span>
                  DSCR
                </div>
                <div className="calc-chip">
                  <span>
                    <FlipIcon />
                  </span>
                  Fix &amp; Flip
                </div>
                <div className="calc-chip">
                  <span>
                    <CapGrmIcon />
                  </span>
                  Cap/GRM
                </div>
              </div>
              <div className="calc-out">
                <div className="calc-line">
                  <span>AVM value</span>
                  <span className="mono">$642,500</span>
                </div>
                <div className="calc-line">
                  <span>Annual cash flow</span>
                  <span className="mono">$19,400</span>
                </div>
                <div className="calc-line">
                  <span>Cap rate</span>
                  <span className="mono">8.4%</span>
                </div>
                <div className="calc-line total">
                  <span>Cash-on-cash return</span>
                  <span className="mono">12.1%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 05 MARKET & AREA */}
        <section className="feature reveal" id="report-market">
          <div className="feature-copy">
            <div className="feature-num">
              05 <span className="ey">Instant PDF</span>
            </div>
            <h2>Market &amp; Area Report</h2>
            <p className="feature-desc">
              Understand the market around any address before you commit. Median
              price and $/sqft, active and pending inventory counts, days on
              market, plus population and owner-vs-renter demographics for the
              area.
            </p>
            <ul className="feature-list">
              <li>
                <CheckIcon /> Median price, $/sqft, and days on market
              </li>
              <li>
                <CheckIcon /> Active &amp; pending inventory counts
              </li>
              <li>
                <CheckIcon /> Population, income &amp; owner-vs-renter occupancy
              </li>
            </ul>
            <div className="feature-foot">
              <Link to="/reports/market" className="feature-link">
                Buy a Market &amp; Area Report <ArrowIcon />
              </Link>
            </div>
          </div>
          <div className="feature-visual">
            <div className="visual">
              <div className="v-head">
                <span className="v-title">
                  <span className="ic">
                    <MarketIcon />
                  </span>{" "}
                  Market &amp; Area
                </span>
                <span className="v-badge">Herndon, VA</span>
              </div>
              <div className="dash-tiles">
                <div className="dtile">
                  <div className="dk">Median price</div>
                  <div className="dv mono">$618K</div>
                </div>
                <div className="dtile">
                  <div className="dk">$ / sqft</div>
                  <div className="dv mono">$284</div>
                </div>
                <div className="dtile">
                  <div className="dk">Days on market</div>
                  <div className="dv pos">18</div>
                </div>
                <div className="dtile">
                  <div className="dk">Active listings</div>
                  <div className="dv mono">42</div>
                </div>
              </div>
              <div className="dchart">
                <div className="dchart-h">Median price · last 6 months</div>
                <div className="bars">
                  <i style={{ height: "46%" }} />
                  <i style={{ height: "58%" }} />
                  <i style={{ height: "52%" }} />
                  <i style={{ height: "70%" }} />
                  <i style={{ height: "64%" }} />
                  <i className="hl" style={{ height: "88%" }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 06 PROPERTY DEBT */}
        <section className="feature flip reveal" id="report-debt">
          <div className="feature-copy">
            <div className="feature-num">
              06 <span className="ey">Instant PDF</span>
            </div>
            <h2>Property Debt Report</h2>
            <p className="feature-desc">
              Mortgage and loan positions, pre-foreclosure indicators, and open
              involuntary liens tied directly to the property or its owner
              before entering negotiations.
            </p>
            <ul className="feature-list">
              <li>
                <CheckIcon /> Mortgage history, lender details &amp; balances
              </li>
              <li>
                <CheckIcon /> Pre-foreclosure status, default amounts &amp;
                dates
              </li>
              <li>
                <CheckIcon /> Involuntary liens attached to property or owner
              </li>
            </ul>
            <div className="feature-foot">
              <Link to="/reports/debt-position" className="feature-link">
                Buy a Property Debt Report <ArrowIcon />
              </Link>
            </div>
          </div>
          <div className="feature-visual">
            <div className="visual">
              <div className="v-head">
                <span className="v-title">
                  <span className="ic">
                    <DebtIcon />
                  </span>{" "}
                  Property Debt
                </span>
                <span className="v-badge">1 active lien</span>
              </div>
              <div className="mini-metrics">
                <div className="mini-metric">
                  <div className="k">Position</div>
                  <div className="v mono">1st Lien</div>
                </div>
                <div className="mini-metric">
                  <div className="k">Est. Balance</div>
                  <div className="v mono">$340,000</div>
                </div>
                <div className="mini-metric">
                  <div className="k">Lien status</div>
                  <div className="v mono">Tax Lien</div>
                </div>
                <div className="mini-metric">
                  <div className="k">Status</div>
                  <div className="v pos">Active</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 07 PROPERTY DEEP DIVE */}
        <section className="feature reveal pdd-feature" id="report-deepdive">
          <div className="feature-copy">
            <div className="feature-num">
              07 <span className="ey">Bundle · Instant PDF</span>
            </div>
            <h2>Property Deep Dive Report</h2>
            <p className="feature-desc">
              All six reports in a single bundle. One address, one PDF —
              valuation, comps, owner &amp; contact, deal analysis, market data,
              and property debt records, delivered together.
            </p>
            <ul className="feature-list">
              <li>
                <CheckIcon /> Valuation Report
              </li>
              <li>
                <CheckIcon /> Comparables Report
              </li>
              <li>
                <CheckIcon /> Owner &amp; Contact
              </li>
              <li>
                <CheckIcon /> Deal Analysis
              </li>
              <li>
                <CheckIcon /> Market &amp; Area
              </li>
              <li>
                <CheckIcon /> Property Debt
              </li>
            </ul>
            <div className="feature-foot">
              <div className="feature-stat">
                <span className="pdd-badge-inline">All-in-one</span>
                <span className="fs-lbl">6 reports, one PDF</span>
              </div>
              <Link to="/reports/deep-dive" className="feature-link">
                Get the Deep Dive Report <ArrowIcon />
              </Link>
            </div>
          </div>
          <div className="feature-visual">
            <div className="visual pdd-preview">
              <div className="v-head">
                <span className="v-title">
                  <span className="ic pdd-ic">
                    <DeepDiveIcon />
                  </span>{" "}
                  Property Deep Dive
                </span>
                <span className="v-badge">6 reports bundled</span>
              </div>
              <div className="pdd-modules">
                <div className="pdd-module-tile">
                  <span className="pdd-module-ic">
                    <HomeIcon />
                  </span>
                  <span className="pdd-module-label">Valuation Report</span>
                </div>
                <div className="pdd-module-tile">
                  <span className="pdd-module-ic">
                    <ComparablesIcon />
                  </span>
                  <span className="pdd-module-label">Comparables Report</span>
                </div>
                <div className="pdd-module-tile">
                  <span className="pdd-module-ic">
                    <ContactIcon />
                  </span>
                  <span className="pdd-module-label">Owner &amp; Contact</span>
                </div>
                <div className="pdd-module-tile">
                  <span className="pdd-module-ic">
                    <DealIcon />
                  </span>
                  <span className="pdd-module-label">Deal Analysis</span>
                </div>
                <div className="pdd-module-tile">
                  <span className="pdd-module-ic">
                    <MarketIcon />
                  </span>
                  <span className="pdd-module-label">Market &amp; Area</span>
                </div>
                <div className="pdd-module-tile">
                  <span className="pdd-module-ic">
                    <DebtIcon />
                  </span>
                  <span className="pdd-module-label">Property Debt</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* TESTIMONIALS */}
      <section className="reviews">
        <div className="wrap">
          <div className="reviews-head reveal">
            <div className="eyebrow">Loved by investors</div>
            <h2>Get the data. Skip the subscription.</h2>
          </div>
          <div className="reviews-grid">
            <div className="review reveal">
              <div className="stars">★★★★★</div>
              <p>
                &quot;I only needed a valuation and a comp set for one property.
                Paid for exactly those two reports and had both in under a
                minute — no plan to sign up for.&quot;
              </p>
              <div className="who">
                <span className="av">MR</span>
                <span>
                  <span className="nm">Marcus R.</span>
                  <br />
                  <span className="rl">Buy-and-hold investor</span>
                </span>
              </div>
            </div>
            <div className="review reveal">
              <div className="stars">★★★★★</div>
              <p>
                &quot;The Owner &amp; Contact report saved me hours of skip
                tracing myself. Owner name, mailing address, and a working phone
                number, all in one PDF.&quot;
              </p>
              <div className="who">
                <span className="av">JL</span>
                <span>
                  <span className="nm">Jenna L.</span>
                  <br />
                  <span className="rl">Fix &amp; flip</span>
                </span>
              </div>
            </div>
            <div className="review reveal">
              <div className="stars">★★★★★</div>
              <p>
                &quot;Deal Analysis is the one I keep coming back to — value,
                comps, and the ROI math already run, for less than a coffee
                run.&quot;
              </p>
              <div className="who">
                <span className="av">DP</span>
                <span>
                  <span className="nm">David P.</span>
                  <br />
                  <span className="rl">Small portfolio owner</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final">
        <div className="wrap">
          <h2>
            Buy the report.
            <br />
            Skip everything else.
          </h2>
          <p>
            Seven data-backed reports, priced individually and delivered
            instantly. No account, no subscription — just the report you need,
            when you need it.
          </p>
          <div className="hero-actions">
            <Link to="/reports" className="btn btn-primary btn-lg btn-arrow">
              Browse reports <ArrowIcon />
            </Link>
            <Link to="/sample-reports" className="btn btn-ghost btn-lg">
              See a sample report
            </Link>
          </div>
          <div className="final-badges">
            <span>
              <CheckIcon /> No subscription
            </span>
            <span>
              <CheckIcon /> No account required
            </span>
            <span>
              <CheckIcon /> Seven reports available
            </span>
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
}
