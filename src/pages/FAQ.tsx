import Footer from "../components/pages/Footer";
import Navbar from "../components/common/Navbar";
import { SEO } from "../components/common/SEO";
import { faqSchema } from "../libs/schema";
import otherHero from "../assets/SubPageHero.png";
import "../styles/Home.css";

const FAQ = () => {
  const faqData = [
    {
      question: "What is Propomy?",
      answer:
        "Propomy is an AI-powered real estate platform that helps you analyze properties, estimate value, and evaluate investment potential in seconds.",
    },
    {
      question: "How does Propomy’s AI valuation work?",
      answer:
        "Our AI analyzes multiple data points — including property details, location, and market trends — to generate accurate, real-time property valuations.",
    },
    {
      question: "What data does Propomy use?",
      answer:
        "Propomy integrates with trusted real estate data sources and combines them with proprietary AI models to deliver accurate and up-to-date insights.",
    },
    {
      question: "How accurate are the valuations?",
      answer:
        "Our AI models are continuously trained on real-world data to provide highly reliable estimates. Each valuation includes a confidence level to help you assess reliability.",
    },
    {
      question: "Can I use Propomy to analyze rental properties?",
      answer:
        "Our rental properties analysis is coming soon and currently under development. When it does release you will be able to analyze rental income estimates, ROI and cash flow analysis.",
    },
    {
      question: "What investment metrics does Propomy provide?",
      answer:
        "You can instantly calculate key metrics like ROI, cap rate, cash-on-cash return, and overall investment potential.",
    },
    {
      question: "What can the AI Assistant do?",
      answer:
        "The AI Assistant can answer questions about properties, compare deals, estimate returns, and provide insights in real time.",
    },
    {
      question: "Who is Propomy for?",
      answer:
        "Propomy is designed for real estate investors, agents, and anyone looking to make data-driven property decisions.",
    },
  ];

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ backgroundColor: "var(--white)" }}
    >
      <SEO title="Frequently Asked Questions" jsonLd={faqSchema(faqData)} />
      <Navbar />

      {/* Hero Section */}
      <section
        className="other-hero-section position-relative text-center py-5"
        style={{
          backgroundImage: ` url(${otherHero})`,
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
            Frequently Asked Questions
          </h1>
        </div>
      </section>

      {/* FAQ Main Content - Restored to Previous Layout */}
      <main className="flex-grow-1 py-5">
        <div>
          <div
            className="faq-list"
            style={{ maxWidth: "90%", margin: "0 auto" }}
          >
            {faqData.map((item, index) => (
              <div
                key={index}
                className="faq-item mb-4 pb-3"
                style={{ borderBottom: "1px solid var(--line)" }}
              >
                <h3 className="h5 fw-bold mb-3" style={{ color: "var(--ink)" }}>
                  {item.question}
                </h3>
                <p
                  style={{
                    color: "var(--slate)",
                    lineHeight: "1.6",
                    fontSize: "15px",
                  }}
                >
                  {item.answer}
                </p>
              </div>
            ))}

            <div
              className="contact-support-box mt-5 p-4 text-center"
              style={{
                backgroundColor: "var(--canvas)",
                borderRadius: "var(--r-md)",
                border: "1px solid var(--line)",
              }}
            >
              <h5 className="fw-bold mb-2" style={{ color: "var(--ink)" }}>
                Still have questions?
              </h5>
              <p className="mb-3" style={{ color: "var(--slate)" }}>
                We're here to help you navigate your real estate journey.
              </p>
              <a
                href="mailto:Support@propomy.com"
                className="btn btn-lg"
                style={{
                  backgroundColor: "var(--blue)",
                  color: "var(--white)",
                  fontWeight: 600,
                  display: "inline-block",
                  textDecoration: "none",
                }}
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
