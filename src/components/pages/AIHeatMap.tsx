import "../../styles/Investor.css";
import { FiArrowUpRight } from "react-icons/fi";
const AIHeatMap = () => {
  return (
    <div className="d-flex flex-column heat-Dashboard-card">
      <div className="main-header mb-3">
        <h2 className="portfolio-distribution-title">AI Map Insights</h2>
        <button className="view-all-btn">
          <div className="view-all-icon-wrapper">
            <FiArrowUpRight
              className="arrow-icon"
              color="white"
              aria-label="Arrow Up"
            />
          </div>
        </button>
      </div>
      <div style={{ flex: 1 }}>
        <iframe
          title="AI Map Insights"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537353153166!3d-37.81627974202195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d6f5d5d5d5d5!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sin!4v1614031234567!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0, borderRadius: "12px" }}
          allowFullScreen={false}
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default AIHeatMap;
