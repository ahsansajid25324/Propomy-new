import "../../styles/Content.css";

import BgRight from "../../assets/Hope.webp";
import { useNavigate } from "react-router-dom";

const ContentSection = () => {
  const nav = useNavigate();
  return (
    <div className="content-section container-fluid d-flex align-items-center justify-content-center">
      <div className="container row w-100 align-items-center">
        <div className="col-md-6 col-12 mb-2 mb-md-0">
          <h1 className="dream-title mb-1">Start Finding Better Deals Today</h1>
          <p className="dream-desc mb-3">
            Join investors using Propomy to analyze properties, uncover
            opportunities, and make smarter real estate decisions with AI
          </p>
          <ul className="dream-list mb-4">
            <li>Analyze any property in seconds with AI</li>
            <li>Instantly calculate ROI, cash flows and value</li>
            <li>Identify high-potentials investment opportunities</li>
            <li>Track market trends and make data driven decisions </li>
            <li>Track market trends and investment potential effortlessly.</li>
            <li>All you real estate insights in one platform</li>
          </ul>
          <button
            onClick={() => nav("/free-trial")}
            className="btn btn-primary get-started-btn"
          >
            Start Free Trial
          </button>
        </div>
        <div className="col-md-6 col-12 d-flex justify-content-center align-items-center">
          <img
            src={BgRight}
            className="dream-img"
            loading="lazy"
            width="500"
            height="400"
            alt="Dream House"
          />
        </div>
      </div>
    </div>
  );
};

export default ContentSection;
