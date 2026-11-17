import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import "../styles/FreeTrial.css";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const FreeTrial = () => {
  const navigate = useNavigate();

  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

  const handlePlanSelection = (planName: string) => {
    if (!isAuth) {
      navigate("/signup", { state: { from: "/free-trial", plan: planName } });
      return;
    }
    navigate("/investor", { state: { plan: planName } });
  };

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="text-center mb-2 mb-md-5">
          <h2 className="fw-bold">Choose Your Plan</h2>
          <p className="text-muted">
            Get Instant AI Valuations And Portfolio Insights In Minutes.
          </p>
        </div>

        <div className="row justify-content-center g-4">
          {/* Free Trial Card */}
          <div className="col-md-6 col-lg-4">
            <div className="card pricing-card h-100 p-2">
              <div className="card-body">
                <h4 className="fw-bold">Free Trial</h4>
                <p className="text-muted small">1 Month Trial</p>
                <div className="price-text mb-2">$0</div>
                <div className="api-calls">50 API Calls</div>

                <ul className="feature-list mb-4">
                  <li>
                    <span className="check-icon">✓</span> AI Valuation
                  </li>
                  <li>
                    <span className="check-icon">✓</span> Interactive Map View
                  </li>
                  <li>
                    <span className="check-icon">✓</span> ROI Calculator
                  </li>
                  <li>
                    <span className="check-icon">✓</span> AI Assistant (50
                    Credits)
                  </li>
                  <li>
                    <span className="check-icon">✓</span> Add/View Property
                  </li>
                  <li>
                    <span className="check-icon">✓</span> Advanced Property
                    Details
                  </li>
                </ul>

                <button
                  onClick={() => handlePlanSelection("free")}
                  className="btn btn-primary w-100 rounded-pill py-2"
                >
                  Start Free Trial
                </button>
                <p className="text-muted small text-center mt-3">
                  Trial includes 50 API calls. Upgrade anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Essentials Card */}
          <div className="col-md-6 col-lg-4">
            <div className="card pricing-card h-100 p-2 position-relative">
              <div className="recommended-badge">Recommended</div>
              <div className="card-body">
                <h4 className="fw-bold">Essentials</h4>
                <div className="d-flex align-items-center gap-2 mb-1"></div>
                <p className="text-muted small mb-2">Early Bird Discount</p>
                <div className="price-text mb-2 d-flex align-items-baseline gap-2">
                  <span className="text-decoration-line-through text-muted fs-5">
                    $79/mo
                  </span>
                  <span>$39</span>
                  <small className="fs-6">/mo</small>
                </div>
                <div className="api-calls">2000 API Calls</div>

                <ul className="feature-list mb-4">
                  <li>
                    <span className="check-icon">✓</span> AI Valuation
                  </li>
                  <li>
                    <span className="check-icon">✓</span> Interactive Map View
                  </li>
                  <li>
                    <span className="check-icon">✓</span> AI Assistant
                  </li>
                  <li>
                    <span className="check-icon">✓</span> ROI Calculator
                  </li>
                  <li>
                    <span className="check-icon">✓</span> Add/View Property
                  </li>
                  <li>
                    <span className="check-icon">✓</span> Advanced Property
                    Details
                  </li>
                </ul>

                <button
                  onClick={() => handlePlanSelection("paid")}
                  className="btn btn-primary w-100 rounded-pill py-2"
                >
                  Get Essentials
                </button>
                <p className="text-muted small text-center mt-3">
                  Includes 2000 API calls. Additional tiers coming soon.
                </p>
              </div>
            </div>
          </div>

          {/* Premium Card */}
          <div className="col-md-6 col-lg-4">
            <div className="card pricing-card h-100 p-2">
              <div className="card-body">
                <h4 className="fw-bold">Premium</h4>
                <p className="text-muted small">For Power Users & Teams</p>
                <div className="price-text mb-2">
                  $249<small className="fs-6">/mo</small>
                </div>
                <div className="api-calls">10,000 API Calls</div>

                <ul className="feature-list mb-4">
                  <li>
                    <span className="check-icon">✓</span> AI Valuation
                  </li>
                  <li>
                    <span className="check-icon">✓</span> Interactive Map View
                  </li>
                  <li>
                    <span className="check-icon">✓</span> AI Assistant
                  </li>
                  <li>
                    <span className="check-icon">✓</span> ROI Calculator
                  </li>
                  <li>
                    <span className="check-icon">✓</span> Add/View Property
                  </li>
                  <li>
                    <span className="check-icon">✓</span> Advanced Property
                    Details
                  </li>
                </ul>

                <button
                  onClick={() => handlePlanSelection("premium")}
                  className="btn btn-primary w-100 rounded-pill py-2"
                >
                  Get Premium
                </button>
                <p className="text-muted small text-center mt-3">
                  Includes 10,000 API calls. Ideal for high-volume research.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FreeTrial;
