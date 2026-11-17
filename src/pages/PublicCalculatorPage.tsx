import React, { Suspense } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { PUBLIC_CALCULATORS } from "../config/calculatorLandingConfig";
import { SEO } from "../components/common/SEO";
import "../styles/Calculators.css"

export const PublicCalculatorPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const config = slug ? PUBLIC_CALCULATORS[slug] : undefined;

  if (!config) return <Navigate to="/calculators" replace />;

  const CalculatorComp = config.component;
  const canonicalUrl = `https://www.propomy.com/calculators/${config.slug}`;

  // Build JSON-LD Schema required by Acceptance Criteria #4
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: config.title,
    url: canonicalUrl,
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const siblingCalculators = Object.values(PUBLIC_CALCULATORS)
    .filter((c) => c.slug !== config.slug)
    .slice(0, 3);

  return (
    <>
      <SEO
        title={config.title}
        description={config.summary}
        jsonLd={[faqSchema, webAppSchema]}
      />

      <div className="container py-5">
        {/* Header (Baked into static HTML for prerendering) */}
        <header className="mb-4 text-center">
          <h1 className="fw-bold mb-2">{config.headline}</h1>
          <p className="text-muted lead">{config.summary}</p>
        </header>

        {/* Your Existing Component Hydrates Here */}
        <div className="mb-5">
          <Suspense
            fallback={
              <div className="p-5 text-center">Loading calculator...</div>
            }
          >
            <CalculatorComp />
          </Suspense>
        </div>

        {/* Pre-rendered Formula & Explanatory Copy */}
        <section className="my-5">
          <h2 className="h4 fw-bold">{config.formulaTitle}</h2>
          <p>{config.formulaExplanation}</p>
          <div className="p-3 bg-light rounded text-center my-3">
            <code>{config.formulaLaTeX}</code>
          </div>

          <h3 className="h5 fw-bold mt-4">How to Use</h3>
          <ol>
            {config.howItWorks.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>

        {/* Pre-rendered FAQ Accordion Block */}
        <section className="my-5">
          <h2 className="h4 fw-bold mb-3">Frequently Asked Questions</h2>
          {config.faqs.map((faq, i) => (
            <div key={i} className="mb-3 p-3 border rounded bg-white">
              <h3 className="h6 fw-bold">{faq.question}</h3>
              <p className="mb-0 text-muted">{faq.answer}</p>
            </div>
          ))}
        </section>

        {/* Related Calculators & Trial CTA */}
        <section className="mt-5 pt-4 border-top">
          <h3 className="h5 fw-bold mb-3">Related Calculators</h3>
          <div className="row g-3 mb-4">
            {siblingCalculators.map((sibling) => (
              <div key={sibling.slug} className="col-md-4">
                <div className="p-3 border rounded h-100 d-flex flex-column justify-content-between">
                  <div>
                    <h4 className="h6 fw-bold">{sibling.title}</h4>
                    <p className="small text-muted">{sibling.summary}</p>
                  </div>
                  <Link
                    to={`/calculators/${sibling.slug}`}
                    className="btn btn-outline-primary btn-sm mt-2"
                  >
                    Open Calculator
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-primary text-white rounded text-center">
            <h3 className="h4 fw-bold">Analyze Deals with AI</h3>
            <p className="mb-3">
              Get automated property valuations and deal tracking.
            </p>
            <a
              href={`/free-trial?utm_source=seo&utm_medium=calculator&utm_content=${config.utmContent}`}
              className="btn btn-light fw-bold px-4"
            >
              Start Free Trial
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default PublicCalculatorPage;
