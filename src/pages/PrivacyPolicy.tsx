import Footer from "../components/pages/Footer";
import Navbar from "../components/common/Navbar";
import otherHero from "../assets/SubPageHero.png";
import "../styles/Home.css";

const PrivacyPolicy = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <section
        className="other-hero-section"
        style={{ backgroundImage: `url(${otherHero})` }}
      >
        <div className="other-hero-overlay"></div>
        <div className="other-hero-content container text-center">
          <div className="other-hero-icon mb-3">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M12 2L4 5V11C4 16.19 7.41 21.05 12 22C16.59 21.05 20 16.19 20 11V5L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="other-hero-title">Propomy Privacy Policy</h1>
        </div>
      </section>

      <main>
        <div className="legal-container">
          <p className="last-updated-text mb-4 text-muted italic">
            <strong>Last Updated: 03 March, 2026</strong>
          </p>

          <div className="legal-text">
            <p>
              Welcome To Propomy, Inc. (“Propomy,” “Company,” “We,” “Us,” Or
              “Our”). These Terms Of Service (“Terms”) Govern Your Access To And
              Use Of The Propomy Website, Platform, APIs, Dashboards, Valuation
              Tools, Portfolio Tools, Map Features, And Related Services
              (Collectively, The “Services”). By Accessing Or Using Propomy, You
              Agree To Be Bound By These Terms. If You Do Not Agree, You May Not
              Use The Services.
            </p>

            <h2 className="legal-title mt-4">1. Eligibility</h2>
            <p>
              You Must Be At Least 18 Years Old And Legally Capable Of Entering
              Into A Binding Contract To Use The Services. By Using Propomy, You
              Represent And Warrant That:
            </p>
            <ul className="legal-list">
              <li>You Are At Least 18 Years Old</li>
              <li>You Have Authority To Bind Any Entity You Represent</li>
              <li>
                You Will Use The Services In Compliance With All Applicable Laws
              </li>
            </ul>

            <h2 className="legal-title mt-4">2. Description Of Services</h2>
            <p>
              Propomy Provides AI-Powered Real Estate Analytics Tools, Which May
              Include:
            </p>
            <ul className="legal-list">
              <li>Automated Valuation Models (AVM)</li>
              <li>AI-Driven Property Value Estimates</li>
              <li>Equity Insights</li>
              <li>Portfolio Tracking Dashboards</li>
              <li>Property Details Data</li>
              <li>Map-Based Property Visualization</li>
              <li>API-Driven Analytics</li>
              <li>Subscription-Based Investor Tools</li>
              <li>Future AI Assistant Features</li>
              <li>Rental Estimation (Future Release)</li>
            </ul>
            <p>
              Services May Evolve Over Time. We Reserve The Right To Modify Or
              Discontinue Features At Any Time.
            </p>

            <h2 className="legal-title mt-4">
              3. Important Disclaimer – Not Financial Advice
            </h2>
            <p>
              Propomy Provides Informational And Analytical Tools Only. We Are
              Not:
            </p>
            <ul className="legal-list">
              <li>A Real Estate Brokerage</li>
              <li>A Licensed Appraiser</li>
              <li>A Financial Advisor</li>
              <li>A Mortgage Lender</li>
              <li>An Investment Advisor</li>
            </ul>
            <p>
              AI Valuations And Analytics Are Estimates Based On Available Data
              And Machine Learning Models. They:
            </p>
            <ul className="legal-list">
              <li>May Contain Inaccuracies</li>
              <li>May Rely On Incomplete Or Outdated Data</li>
              <li>Are Not Guaranteed</li>
              <li>
                Should Not Be Relied Upon As Sole Basis For Investment Decisions
              </li>
            </ul>
            <p>You Assume All Risk Associated With Using The Services.</p>

            <h2 className="legal-title mt-4">4. No Appraisal Guarantee</h2>
            <ul className="legal-list">
              <li>Are Not Formal Appraisals</li>
              <li>Are Not Compliant With USPAP Standards</li>
              <li>Are Not Suitable For Loan Underwriting</li>
              <li>Should Not Be Submitted To Lenders As Official Appraisals</li>
            </ul>
            <p>
              For Certified Valuation, Consult A Licensed Real Estate Appraiser.
            </p>

            <h2 className="legal-title mt-4">5. Account Registration</h2>
            <p>
              To Access Certain Features, You Must Create An Account. You Agree
              To:
            </p>
            <ul className="legal-list">
              <li>Provide Accurate Information</li>
              <li>Keep Login Credentials Secure</li>
              <li>Notify Us Of Unauthorized Access</li>
              <li>Accept Responsibility For All Activity Under Your Account</li>
            </ul>
            <p>
              We Reserve The Right To Suspend Or Terminate Accounts At Our
              Discretion.
            </p>

            <h2 className="legal-title mt-4">
              6. Subscription Plans & Payments
            </h2>
            <p>
              Propomy Offers Subscription Tiers Including But Not Limited To:
            </p>
            <ul className="legal-list">
              <li>Free Trial</li>
              <li>Investor Tier</li>
              <li>Future Premium Tiers</li>
            </ul>
            <p>
              <strong>Payment Terms:</strong>
            </p>
            <ul className="legal-list">
              <li>Subscriptions Are Billed Monthly Unless Otherwise Stated.</li>
              <li>Fees Are Non-Refundable Except As Required By Law.</li>
              <li>
                Promotional Pricing May Be Locked In Only While Membership
                Remains Active.
              </li>
              <li>We May Change Pricing With Prior Notice.</li>
              <li>If Payment Fails, We May Suspend Or Terminate Access.</li>
            </ul>

            <h2 className="legal-title mt-4">7. API Usage & Call Limits</h2>
            <ul className="legal-list">
              <li>Unused API Calls Do Not Roll Over.</li>
              <li>Excess Usage May Incur Additional Charges Or Suspension.</li>
              <li>Abuse Or Automated Scraping Is Strictly Prohibited.</li>
            </ul>

            <h2 className="legal-title mt-4">
              8. Data Accuracy & Third-Party Sources
            </h2>
            <p>
              Propomy Relies On Third-Party Data Providers And Public Records.
              We Do Not Guarantee:
            </p>
            <ul className="legal-list">
              <li>Data Completeness</li>
              <li>Ownership Accuracy</li>
              <li>Mortgage Balance Accuracy</li>
              <li>Equity Calculations</li>
              <li>Recording Dates</li>
              <li>Lender Information</li>
            </ul>
            <p>Third-Party Data May Contain Errors Beyond Our Control.</p>

            <h2 className="legal-title mt-4">9. Acceptable Use Policy</h2>
            <p>You Agree NOT To:</p>
            <ul className="legal-list">
              <li>Reverse Engineer The Platform</li>
              <li>Scrape Data</li>
              <li>Resell Platform Outputs</li>
              <li>Use The Services For Illegal Activity</li>
              <li>Attempt To Bypass API Limits</li>
              <li>Interfere With System Security</li>
              <li>Use Automated Bots Without Authorization</li>
            </ul>
            <p>Violation May Result In Termination And Legal Action.</p>

            <h2 className="legal-title mt-4">10. Intellectual Property</h2>
            <p>
              All Platform Content Including Software, Machine Learning Models,
              UI/UX Designs, Branding, Data Aggregation, Algorithms, And Trade
              Secrets Are Owned Exclusively By Propomy, Inc. You Receive A
              Limited, Non-Transferable License To Use The Services. You May
              Not:
            </p>
            <ul className="legal-list">
              <li>
                Copy, Redistribute, Replicate, Or Commercialize Without Written
                Consent.
              </li>
            </ul>

            <h2 className="legal-title mt-4">11. AI & Model Limitations</h2>
            <ul className="legal-list">
              <li>AI Outputs May Contain Errors</li>
              <li>AI Outputs May Change Over Time</li>
              <li>
                AI Outputs May Produce Different Results For The Same Input
              </li>
              <li>AI Outputs Are Not Deterministic Guarantees</li>
            </ul>
            <p>We Reserve The Right To Update Models Without Notice.</p>

            <h2 className="legal-title mt-4">12. Limitation Of Liability</h2>
            <p>
              To The Fullest Extent Permitted By Law, Propomy Shall Not Be
              Liable For Investment Losses, Property Purchase Losses,
              Foreclosure, Loan Denial, Lost Profits, Indirect Damages,
              Consequential Damages, Or Data Inaccuracies. Our Total Liability
              Shall Not Exceed The Amount You Paid To Us In The Prior 12 Months.
            </p>

            <h2 className="legal-title mt-4">13. Indemnification</h2>
            <p>
              You Agree To Indemnify And Hold Harmless Propomy, Inc., Its
              Officers, Employees, And Affiliates From Claims Arising Out Of:
            </p>
            <ul className="legal-list">
              <li>Your Misuse Of The Services</li>
              <li>Your Violation Of These Terms</li>
              <li>Your Reliance On AI-Generated Outputs</li>
            </ul>

            <h2 className="legal-title mt-4">14. Termination</h2>
            <p>We May Suspend Or Terminate Your Account If:</p>
            <ul className="legal-list">
              <li>You Violate These Terms</li>
              <li>You Fail To Pay Fees</li>
              <li>We Suspect Fraud Or Abuse</li>
            </ul>
            <p>
              You May Cancel Your Subscription At Any Time Via Your Profile
              Page. Termination Does Not Eliminate Payment Obligations Incurred
              Prior.
            </p>

            <h2 className="legal-title mt-4">15. Governing Law</h2>
            <p>
              These Terms Shall Be Governed By The Laws Of The State Of
              Delaware, Without Regard To Conflict Of Law Principles.
            </p>

            <h2 className="legal-title mt-4">
              16. Arbitration & Dispute Resolution
            </h2>
            <p>
              Any Disputes Shall Be Resolved Through Binding Arbitration In The
              United States Under The Rules Of The American Arbitration
              Association. You Waive Your Right To Jury Trial And Class Action
              Participation.
            </p>

            <h2 className="legal-title mt-4">17. Modifications To Terms</h2>
            <p>
              We May Update These Terms At Any Time. Continued Use Of The
              Services After Updates Constitutes Acceptance.
            </p>

            <h2 className="legal-title mt-4">18. Privacy</h2>
            <p>
              Your Use Of The Services Is Also Governed By Our Privacy Policy.
            </p>

            <h2 className="legal-title mt-4">19. Contact Information</h2>
            <p>
              Propomy, Inc.
              <br />
              8 the Green Ste A Dover, DE 19901
              <br />
              Email:{" "}
              <a
                href="mailto:support@propomy.com"
                style={{
                  color: "#007bff",
                  textDecoration: "underline",
                }}
              >
                support@propomy.com
              </a>
              <br />
              Website:{" "}
              <a
                href="https://www.propomy.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#007bff",
                  textDecoration: "underline",
                }}
              >
                www.propomy.com
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
