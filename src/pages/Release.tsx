import Footer from "../components/pages/Footer";
import Navbar from "../components/common/Navbar";
import otherHero from "../assets/SubPageHero.png";
import "../styles/Home.css";

const Release = () => {
  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ backgroundColor: "var(--white)" }}
    >
      <Navbar />

      {/* Hero Section */}
      <section
        className="other-hero-section position-relative text-center py-5"
        style={{
          backgroundImage: `url(${otherHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "var(--white)",
          height: "50vh",
        }}
      >
        <div className="wrap py-4">
          <div className="other-hero-icon mb-3">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ stroke: "var(--white)" }}
            >
              <path
                d="M12 2L4 5V11C4 16.19 7.41 21.05 12 22C16.59 21.05 20 16.19 20 11V5L12 2Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1
            className="fw-bold mb-0"
            style={{
              color: "var(--white)",
              fontSize: "clamp(32px, 5vw, 48px)",
            }}
          >
            Propomy Product Release
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-5">
        <div>
          <div
            className="legal-container"
            style={{ maxWidth: "90%", margin: "0 auto" }}
          >
            <p
              className="last-updated-text mb-4"
              style={{ color: "var(--slate)", fontStyle: "italic" }}
            >
              <strong>Last Updated: July 31, 2026</strong>
            </p>

            <div className="legal-text">
              {/* Propomy MVP v1.2 Release */}
              <h2
                className="h4 fw-bold mt-4 mb-3"
                style={{ color: "var(--ink)" }}
              >
                Propomy MVP v1.2 – July 31, 2026
              </h2>
              <ul
                className="legal-list ps-3"
                style={{ color: "var(--slate)", lineHeight: "1.6" }}
              >
                <li>
                  Various upgrades to AI conversational assistant &amp; property details confidence scoring.
                </li>
              </ul>

              <hr
                className="my-5"
                style={{ borderColor: "var(--line)", opacity: 1 }}
              />

              {/* Propomy MVP v1.1 Release */}
              <h2
                className="h4 fw-bold mt-4 mb-3"
                style={{ color: "var(--ink)" }}
              >
                Propomy MVP v1.1 – July 17, 2026
              </h2>
              <ul
                className="legal-list ps-3"
                style={{ color: "var(--slate)", lineHeight: "1.6" }}
              >
                <li>
                  Ability to view 90 days worth of AI valuations in the AI valuations section.
                </li>
                <li>
                  Ability to export 90 days worth of AI valuations.
                </li>
                <li>
                  Calculators - ROI, BRRRR, Rental Estimator, Fix and Flip, Cap Rate &amp; GRM, DSCR Calculator.
                </li>
              </ul>

              <hr
                className="my-5"
                style={{ borderColor: "var(--line)", opacity: 1 }}
              />

              {/* Skip Trace Release */}
              <h2
                className="h4 fw-bold mt-4 mb-3"
                style={{ color: "var(--ink)" }}
              >
                Propomy Skip Trace V1.0 – May 15, 2026
              </h2>
              <ul
                className="legal-list ps-3"
                style={{ color: "var(--slate)", lineHeight: "1.6" }}
              >
                <li>Ability to skip trace single &amp; bulk upload</li>
              </ul>

              <hr
                className="my-5"
                style={{ borderColor: "var(--line)", opacity: 1 }}
              />

              {/* Previous MVP V1 Section */}
              <h2
                className="h4 fw-bold mt-4 mb-3"
                style={{ color: "var(--ink)" }}
              >
                Propomy MVP v1 – April 20, 2026
              </h2>
              <ul
                className="legal-list ps-3"
                style={{ color: "var(--slate)", lineHeight: "1.6" }}
              >
                <li>Dashboards for Investor profile</li>
                <li>Ability to sign up &amp; login for Investor Profile</li>
                <li>Map View with Property Details</li>
                <li>AI Conversational Assistant</li>
                <li>AI Valuation Model integrated with UI</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Release;