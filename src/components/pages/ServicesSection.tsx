import "../../styles/KeyServices.css";
import Residential from "../../assets/Residential.webp";

import Property from "../../assets/Property.webp";
import Commercial from "../../assets/Commercial.webp";

const ServicesSection = () => {
  return (
    <div className="key-section d-flex flex-column justify-content-center ">
      <div>
        <div className="container row  text-white px-0  ">
          <div className="col-md-6 col-12  align-content-center">
            <h1 className="hero-title ">
              Everything You Need to Analyze and Invest
            </h1>
            <p className="hero-subtitle  mt-3" style={{ maxWidth: "600px" }}>
              From property search to ROI analysis, Propomy gives you the data
              and insights you need to make confident investment decisions:
            </p>
            <ul className="tools-list">
              <li> AI Property Valuations</li>
              <li>Rental Income Estimator</li>
              <li>Real-Time Property Data Integration</li>
              <li>ROI & Investment Analytics</li>
              <li>Interactive Property Map</li>
              <li>AI Investment Assistant</li>
            </ul>
          </div>
          <div className="col-md-6 col-12 d-flex justify-content-center align-items-center">
            <div className="services-container">
              <h1 className="service-text">KEY SERVICES</h1>

              <div className="services-images">
                <div className="service-image-container">
                  <img
                    src={Residential}
                    alt="Residential Property"
                    className="service-image"
                    loading="lazy"
                    width="266"
                    height="134"
                  />
                </div>

                <div className="service-image-container">
                  <img
                    src={Property}
                    alt=" Property"
                    className="service-image"
                    loading="lazy"
                    width="266"
                    height="134"
                  />
                </div>

                <div className="service-image-container">
                  <img
                    src={Commercial}
                    alt="Commercial"
                    loading="lazy"
                    width="266"
                    height="134"
                    className="service-image"
                  />
                </div>
              </div>
              <div className="services-description  text-center">
                <p className="hero-subtitle">
                  From single properties to full portfolios, get the insights
                  you need to maximize returns and scale your investments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
