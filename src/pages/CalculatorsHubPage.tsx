import React from "react";
import { Link } from "react-router-dom";
import { PUBLIC_CALCULATORS } from "../config/calculatorLandingConfig";
import "../styles/Calculators.css"

export const CalculatorsHubPage: React.FC = () => {
  return (
    <div className="container py-5">
      <header className="text-center mb-5">
        <h1 className="fw-bold">Free Real Estate Calculators</h1>
        <p className="text-muted lead">Professional financial tools for real estate investors.</p>
      </header>

      <div className="row g-4">
        {Object.values(PUBLIC_CALCULATORS).map((calc) => (
          <div key={calc.slug} className="col-md-6 col-lg-4">
            <div className="card h-100 p-4 border-0 shadow-sm d-flex flex-column justify-content-between">
              <div>
                <h2 className="h5 fw-bold text-primary">{calc.title}</h2>
                <p className="text-muted small">{calc.summary}</p>
              </div>
              <Link to={`/calculators/${calc.slug}`} className="btn btn-primary w-100 mt-3">
                Use Calculator &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalculatorsHubPage;