import Footer from "../components/pages/Footer";
import Navbar from "../components/common/Navbar";
import otherHero from "../assets/SubPageHero.png";
import "../styles/Home.css";

const TermOfService = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      {/* Hero Section */}
      <section
        className="other-hero-section"
        style={{ backgroundImage: `url(${otherHero})` }}
      >
        <div className="other-hero-overlay"></div>
        <div className="other-hero-content container">
          <div className="other-hero-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              fill="currentColor"
              className="bi bi-file-earmark-text"
              viewBox="0 0 16 16"
            >
              <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" />
              <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
            </svg>
          </div>
          <h1 className="other-hero-title">Propomy Terms of Use</h1>
        </div>
      </section>

      {/* Main Legal Content */}
      <main>
        <div className="legal-container">
          <p className="last-updated-text mb-4">
            Effective Date: August 17, 2026
            <br />
            Last Updated: August 14, 2026
          </p>

          <div className="legal-text">
            <p>
              Propomy Inc, a Delaware corporation with its registered office
              at 8 The Green, Ste A, Dover, DE 19901 (&ldquo;Propomy,&rdquo;
              &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;),
              operates the website located at propomy.com and related
              services (collectively, the &ldquo;Service&rdquo;). These Terms
              of Use (&ldquo;Terms&rdquo;) govern your access to and use of
              the Service.
            </p>
            <p>
              <strong>
                By accessing or using Propomy, you agree to be bound by these
                Terms. If you do not agree, do not use the Service.
              </strong>
            </p>

            <h2 className="legal-title">1. What Propomy Is</h2>
            <p>
              Propomy provides on-demand, pay-per-report real estate data and
              analytics products, including but not limited to Valuation
              Reports, Comparables Reports, Owner &amp; Contact Reports, Deal
              Analysis Reports, Market &amp; Area Reports, and Distress &amp;
              Lien Reports (each a &ldquo;Report&rdquo;). Reports are
              generated using automated valuation models, third-party real
              estate data providers, and publicly available records.
            </p>
            <p>
              Propomy does not offer a subscription or membership plan. Each
              Report is purchased individually at the price displayed at the
              time of purchase.
            </p>

            <h2 className="legal-title">2. Eligibility</h2>
            <p>
              You must be at least 18 years old and capable of forming a
              binding contract to use the Service. By using Propomy, you
              represent that you meet these requirements and that you are
              using the Service for lawful purposes only.
            </p>

            <h2 className="legal-title">3. Accounts</h2>
            <p>
              Some features of the Service may require you to create an
              account. You are responsible for maintaining the
              confidentiality of your account credentials and for all
              activity under your account. You agree to provide accurate
              information and to notify us promptly of any unauthorized use.
            </p>

            <h2 className="legal-title">4. Purchases, Pricing &amp; Payment</h2>
            <p>
              <strong>4.1 Pricing.</strong> Prices for each Report are
              displayed at the point of purchase and are subject to change at
              any time without notice. The price in effect at the time you
              complete a purchase is the price you will be charged.
            </p>
            <p>
              <strong>4.2 Payment Processing.</strong> All payments are
              processed through Stripe. By making a purchase, you agree to
              Stripe&rsquo;s terms of service in addition to these Terms.
              Propomy does not store your full payment card information.
            </p>
            <p>
              <strong>4.3 One-Time Purchases.</strong> Each Report purchase is
              a single, one-time transaction. Purchasing a Report does not
              create a recurring charge, subscription, or membership of any
              kind.
            </p>
            <p>
              <strong>4.4 Refunds.</strong> Because Reports are digital
              products delivered instantly upon generation, all purchases are
              final and non-refundable except where required by law or at
              Propomy&rsquo;s sole discretion (for example, where a Report
              fails to generate due to a technical error on our end). Refund
              requests should be sent to{" "}
              <a
                href="mailto:Support@Propomy.com"
                style={{ color: "#007bff", textDecoration: "underline" }}
              >
                Support@Propomy.com
              </a>
              .
            </p>
            <p>
              <strong>4.5 Sales Tax.</strong> Applicable sales tax, if any,
              will be calculated and added at checkout based on your
              location.
            </p>

            <h2 className="legal-title">
              5. No Investment, Legal, or Financial Advice
            </h2>
            <p>
              <strong>
                Propomy Reports are provided for informational purposes only
                and do not constitute investment, financial, legal, tax, or
                professional advice of any kind.
              </strong>
            </p>
            <p>
              Property valuations, rental estimates, comparable sales data,
              ROI/cap rate/cash-on-cash calculations, market statistics,
              ownership and contact data, and distress/lien information are
              generated using automated models and third-party data sources
              and may contain errors, omissions, or outdated information.
            </p>
            <p>
              Estimated values (including AVM-based valuations) are
              statistical estimates, not appraisals, and should not be relied
              upon as the sole basis for any purchase, sale, financing,
              investment, or other real estate decision. You should
              independently verify all information and consult a licensed
              appraiser, real estate agent, attorney, accountant, or
              financial advisor before making any real estate or investment
              decision.
            </p>
            <p>
              <strong>
                Propomy makes no guarantee of accuracy, completeness, or
                reliability of any data, valuation, estimate, or calculation
                provided through the Service.
              </strong>
            </p>

            <h2 className="legal-title">6. Third-Party Data</h2>
            <p>
              Report data is sourced in part from third-party real estate
              data providers, public records, and county/municipal filings.
              Propomy does not independently verify all third-party data and
              is not responsible for inaccuracies, delays, or omissions
              originating from these sources. Data availability and coverage
              may vary by property and geography.
            </p>

            <h2 className="legal-title">7. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="legal-list">
              <li>
                Use the Service for any unlawful purpose, including in
                violation of the Fair Credit Reporting Act (FCRA), Telephone
                Consumer Protection Act (TCPA), Fair Housing Act, or any
                applicable state or local law
              </li>
              <li>
                Use Owner &amp; Contact Report data to harass, stalk, or make
                unsolicited contact in violation of Do-Not-Call (DNC) or
                litigator flags provided in the Report
              </li>
              <li>
                Scrape, reverse-engineer, or systematically extract data from
                the Service using automated means
              </li>
              <li>
                Resell, sublicense, or redistribute Reports or Report data as
                a standalone data product to third parties without our
                written consent
              </li>
              <li>
                Misrepresent your identity or use the Service on behalf of
                another person without authorization
              </li>
              <li>
                Interfere with or disrupt the integrity or performance of the
                Service
              </li>
            </ul>
            <p>
              You are solely responsible for ensuring your use of any Report
              — particularly Owner &amp; Contact and Distress &amp; Lien
              Reports — complies with all applicable laws governing skip
              tracing, debt collection, tenant screening, and consumer
              contact.
            </p>

            <h2 className="legal-title">8. Intellectual Property</h2>
            <p>
              The Service, including its design, software, trademarks,
              logos, and the compilation and presentation of Report data, is
              owned by Propomy Inc or its licensors and is protected by
              intellectual property laws. Purchasing a Report grants you a
              limited, non-exclusive, non-transferable license to use that
              Report for your own personal or internal business purposes. It
              does not grant you any ownership interest in the underlying
              data or the Propomy platform.
            </p>

            <h2 className="legal-title">9. Disclaimer of Warranties</h2>
            <p>
              The Service and all Reports are provided &ldquo;as is&rdquo;
              and &ldquo;as available,&rdquo; without warranties of any kind,
              whether express or implied, including but not limited to
              implied warranties of merchantability, fitness for a
              particular purpose, accuracy, or non-infringement. Propomy does
              not warrant that the Service will be uninterrupted, error-free,
              or that any Report will meet your requirements.
            </p>

            <h2 className="legal-title">10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Propomy Inc, its
              officers, employees, and affiliates shall not be liable for
              any indirect, incidental, special, consequential, or punitive
              damages, or any loss of profits, revenue, data, or business
              opportunity, arising out of or related to your use of the
              Service or any Report, even if advised of the possibility of
              such damages.
            </p>
            <p>
              <strong>
                In no event shall Propomy&rsquo;s total aggregate liability
                for any claim arising out of or related to the Service
                exceed the amount you paid to Propomy in the six (6) months
                preceding the claim.
              </strong>
            </p>
            <p>
              Some jurisdictions do not allow the exclusion or limitation of
              certain damages, so some of the above limitations may not
              apply to you.
            </p>

            <h2 className="legal-title">11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Propomy Inc, its
              officers, employees, and affiliates from any claims, damages,
              losses, liabilities, and expenses (including reasonable
              attorneys&rsquo; fees) arising out of your use of the Service,
              your violation of these Terms, or your violation of any law or
              third-party right, including any misuse of Owner &amp; Contact
              or Distress &amp; Lien Report data.
            </p>

            <h2 className="legal-title">12. Termination</h2>
            <p>
              We may suspend or terminate your access to the Service at any
              time, with or without notice, for conduct that we believe
              violates these Terms or is otherwise harmful to Propomy or
              other users. You may stop using the Service at any time.
              Sections of these Terms that by their nature should survive
              termination (including Sections 5, 8–11, and 13) will survive.
            </p>

            <h2 className="legal-title">
              13. Governing Law &amp; Dispute Resolution
            </h2>
            <p>
              These Terms are governed by the laws of the State of Delaware,
              without regard to its conflict of law principles. Any dispute
              arising out of or relating to these Terms or the Service shall
              be resolved exclusively in the state or federal courts located
              in Delaware, and you consent to the personal jurisdiction of
              such courts.
            </p>

            <h2 className="legal-title">14. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Material changes
              will be reflected by an updated &ldquo;Last Updated&rdquo; date
              above. Continued use of the Service after changes are posted
              constitutes your acceptance of the revised Terms.
            </p>

            <h2 className="legal-title">15. Contact Us</h2>
            <p>
              Questions about these Terms can be directed to:
              <br />
              <strong>Propomy Inc</strong>
              <br />
              8 The Green, Ste A
              <br />
              Dover, DE 19901
              <br />
              <a
                href="mailto:Support@Propomy.com"
                style={{ color: "#007bff", textDecoration: "underline" }}
              >
                Support@Propomy.com
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermOfService;
