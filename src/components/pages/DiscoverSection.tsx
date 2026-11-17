import "../../styles/Discover.css";

import BgRight from "../../assets/home.webp";
import logo from "../../assets/feature.svg";
import logo2 from "../../assets/feature2.svg";
import logo3 from "../../assets/feature3.svg";

const DiscoverSection = () => {
  return (
    <div className="discover-section d-flex flex-column justify-content-center ">
      <div>
        <div className="container row  text-white px-0  ">
          <div className="col-md-6 col-12  align-content-center">
            <h1 className="hero-title ">
              Find Better Deals Before Everyone Else
            </h1>
            <p className="hero-subtitle  mt-3" style={{ maxWidth: "600px" }}>
              Leverage AI to identify undervalued properties, estimate returns,
              and uncover opportunities faster than traditional investors
            </p>
            <ul className="discover-tools-list">
              <li className="discover-tool-item">
                <img src={logo} alt="Feature" className="discover-tool-icon" />
                <span className="discover-tool-text">
                  Spot hidden opportunities instantly
                </span>
              </li>
              <li className="discover-tool-item">
                <img src={logo3} alt="Feature" className="discover-tool-icon" />
                <span className="discover-tool-text">
                  Compare against real market data
                </span>
              </li>
              <li className="discover-tool-item">
                <img src={logo2} alt="Feature" className="discover-tool-icon" />
                <span className="discover-tool-text">
                  Gain an edge in competitive markets
                </span>
              </li>
            </ul>
          </div>
          <div className="col-md-6 col-12 d-flex justify-content-center align-items-center">
            <img
              src={BgRight}
              className="img-fluid start-img-right"
              alt="Background Right"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverSection;
