import { useState, useEffect, lazy, Suspense } from "react";
import "../../styles/Home.css";
import Navbar from "../common/Navbar";
import "../../styles/KeyServices.css";

const Lottie = lazy(() => import("lottie-react"));

function HeroSection() {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch("/Taxation.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load Lottie animation:", err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="hero-section d-flex flex-column justify-content-center">
        <div className="container row text-white">
          <div className="col-md-6 col-12 align-content-center">
            <h1 className="hero-title">
              Make Smarter Real Estate Decisions with AI
            </h1>
            <p className="hero-subtitle mt-3">
              Analyze any property, predict its value, and uncover ROI — in seconds.
            </p>
            <div className="d-flex btn-container mt-md-4 md-3">
              <div className="hero-stats-box">
                <div className="hero-stats-label">AI-Powered Property Valuations</div>
              </div>
              <div className="hero-stats-box">
                <div className="hero-stats-label">100k Properties Analyzed</div>
              </div>
              <div className="hero-stats-box">
                <div className="hero-stats-label">Instant ROI & Investment Insights</div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-12 d-flex align-items-center justify-content-end position-relative">
            <Suspense fallback={<div style={{ minHeight: "300px" }} />}>
              {animationData && (
                <Lottie
                  loop
                  animationData={animationData}
                  className="img-fluid hero-img-right"
                />
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeroSection;