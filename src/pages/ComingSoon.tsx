import logo from "../assets/logo.png";
import Send from "../assets/Send.svg";

import "../styles/Guidance.css";
import "../styles/ComingSoon.css";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const services = [
  {
    icon: "🏠",
    title: "Instant AI valuations",
    description:
      "Get real-time property value insights powered by AI-driven modeling and public data.",
  },
  {
    icon: "💵",
    title: "Rental Income Estimates",
    description:
      "Assess rental potential and market comps to make smarter investment choices.",
  },
  {
    icon: "📈",
    title: "ROI & Cap Rate Metrics",
    description:
      "Analyze cash-on-cash returns, cap rates, and more in seconds with simple dashboards.",
  },
  {
    icon: "🗺️",
    title: "Smart Property Maps",
    description:
      "Search properties with AI-guided maps, neighborhood insights, and powerful filters.",
  },
  {
    icon: "🔗",
    title: "Seamless Data Integration",
    description:
      "Unified access to property, rental, and market insights—automatically sourced, cleaned, and updated behind the scenes.",
  },
  {
    icon: "💬",
    title: "Conversational AI Assistant",
    description:
      "Search properties with AI-guided maps, neighborhood insights, and powerful filters.",
  },
];

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/email/comingsoon`,
        {
          email,
        },
      );
      toast.success(response.data.message || "Email saved successfully!");
      setEmail("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error saving email");
      } else {
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coming-soon-container">
      <div className="logo-container">
        <img src={logo} alt="Propomy Logo" className="logo" />
        <span className="company-name">Propomy</span>
      </div>
      <h1 className="main-heading">AI-Powered Real Estate Intelligence</h1>
      <h2 className="sub-heading">Launching Soon</h2>
      <p className="description">
        Propomy uses powerful AI to evaluate properties, forecast rental income,
        and calculate ROI—all in one smooth, unified platform
      </p>

      <div className="coming-grid">
        {services.map((service, idx) => (
          <div key={idx} className="coming-card">
            <div className="coming-icon">{service.icon}</div>
            <h4>{service.title}</h4>
            <p>{service.description}</p>
          </div>
        ))}
      </div>

      <div className="launch-notification-container">
        <h2 className="notification-heading">
          Be the first to know when we launch!
        </h2>
        <p className="notification-subheading">
          Are you Ready to get something new from us!
        </p>
        <form className="email-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="notify-button" disabled={loading}>
            {loading ? (
              "Submitting..."
            ) : (
              <>
                Notify me{" "}
                <img
                  style={{ marginInline: "10px" }}
                  width={24}
                  height={24}
                  src={Send}
                  alt="Send Icon"
                />
              </>
            )}
          </button>
        </form>
      </div>

      <footer className="footer">© 2025 Propomy. All rights reserved.</footer>
    </div>
  );
};

export default ComingSoon;
