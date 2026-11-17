import React from "react";
import "../../styles/Guidance.css";
import RightImage from "../../assets/Green.webp";
const services = [
  {
    icon: "🏠",
    title: "Accurate Property Valuations",
    bullets: [
      "AI-driven estimates in seconds",
      "Powered by real market data",
      "Confidence scoring for better decisions",
    ],
  },
  {
    icon: "💵",
    title: "Rental Income Insights",
    bullets: [
      "Estimate monthly rental potential",
      "Compare against market trends",
      "Identify high-cash-flow opportunities",
    ],
  },
  {
    icon: "📈",
    title: "Investment Analytics",
    bullets: [
      " ROI, cap rate, cash-on-cash",
      "Evaluate deals instantly",
      "Spot underperforming assets",
    ],
  },
  {
    icon: "🗺️",
    title: " Interactive Property Search",
    bullets: [
      "Visualize opportunities on a map",
      "Explore neighborhoods in real time",
      "Identify investment hotspots",
    ],
  },
  {
    icon: "🔗",
    title: "🔗 Real-Time Data Integration",
    bullets: [
      "Connected to trusted data sources",
      "Always up-to-date property insights",
      "No manual research required",
    ],
  },
  {
    icon: "💬",
    title: "AI Investment Assistant",
    bullets: [
      "Ask questions about any property",
      "Compare deals instantly",
      "Get insights in plain English",
    ],
  },
];

const GuidanceSection: React.FC = () => (
  <section className="guidance-section">
    <div className="container">
      <div className="header-section">
        <div>
          <h1 className="hero-title text-dark ">
            Decisions Powered by AI & Data
          </h1>

          <p style={{ maxWidth: 600 }} className=" mt-3">
            Leverage real-time data, AI-powered insights, and predictive
            analytics to evaluate properties, minimize risk, and maximize
            returns.
          </p>
        </div>
        <div className="img-section">
          <img
            width={280}
            height={250}
            src={RightImage}
            alt="Guidance Illustration"
            loading="lazy"
          />
        </div>{" "}
      </div>
      <div className="services-grid">
        {services.map((service, idx) => (
          <div key={idx} className="service-card">
            <div className="service-icon">{service.icon}</div>
            <h4>{service.title}</h4>
            <ul>
              {service.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default GuidanceSection;
