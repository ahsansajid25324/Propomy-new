import { useState } from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import Logo from "../../assets/Footerlogo.png";
import "../../styles/Footer.css";

const Footer = () => {
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
        `${import.meta.env.VITE_API_URL}/email/newsletter`,
        {
          email,
        },
      );
      toast.success(response.data.message || "Subscribed successfully!");
      setEmail("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Error subscribing to newsletter",
        );
      } else {
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer-section">
      <div className="container px-3 px-md-0 footer-main d-flex flex-wrap justify-content-between align-items-start">
        {/* Left Column: Logo & Contact */}
        <div className="footer-col">
          <div className="footer-logo">
            <span>
              <img className="footer-logo-icon" src={Logo} alt="Logo" />
            </span>
            Propomy
          </div>
          <div className="mt-2">Address</div>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>
            Propomy Inc 8 the Green Ste A Dover, DE 19901{" "}
          </div>
          <div>Live Support?</div>
          <div style={{ fontWeight: 500 }}>
            <a
              href="mailto:Support@Propomy.com"
              style={{ color: "#fff", textDecoration: "none" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#2150fe")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#fff")}
            >
              Support@Propomy.com
            </a>
          </div>
        </div>

        <div className="d-flex gap-2 flex-column align-items-start">
          <Link
            to="/faq"
            className="footer-link-item"
            style={{
              fontSize: "0.9rem",
              fontWeight: "500",
              textDecoration: "none",
              color: "#fff",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#2150fe")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#fff")}
          >
            Frequently Asked Questions
          </Link>
          <Link
            to="/documentation"
            className="footer-link-item"
            style={{
              fontSize: "0.9rem",
              fontWeight: "500",
              textDecoration: "none",
              color: "#fff",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#2150fe")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#fff")}
          >
            Documentation
          </Link>
          <Link
            to="/release"
            className="footer-link-item"
            style={{
              fontSize: "0.9rem",
              fontWeight: "500",
              textDecoration: "none",
              color: "#fff",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#2150fe")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#fff")}
          >
            Release
          </Link>
        </div>

        {/* Right Column: Newsletter */}
        <div className="footer-col">
          <div className="footer-newsletter">
            <label className="footer-newsletter-label">
              Stay in the loop and sign up for the Propomy newsletter
            </label>
            <form className="footer-newsletter-form" onSubmit={handleSubmit}>
              <input
                className="footer-newsletter-input"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
              <button
                className="footer-newsletter-btn"
                type="submit"
                aria-label="Subscribe"
                disabled={loading}
              >
                {loading ? (
                  /* Optional basic loading spinner or visual indicator inside button */
                  <span style={{ fontSize: "10px" }}>...</span>
                ) : (
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path d="M3 20L21 12L3 4V10L17 12L3 14V20Z" fill="#fff" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom mt-2 mt-md-0">
        <div className="container footer-bottom-inner">
          <div className="footer-links d-flex justify-content-center align-items-center gap-2">
            <Link to="/privacy-policy" className="footer-link-item">
              Privacy Policy
            </Link>
            <span className="footer-divider">|</span>
            <Link to="/terms-of-use" className="footer-link-item">
              Terms of Use
            </Link>
          </div>

          <div className="footer-socials">
            <span style={{ fontWeight: 500, marginRight: 6 }}>Follow Us</span>
            <a
              href="https://www.instagram.com/propomyhq"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Instagram Profile"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://www.linkedin.com/company/propomy/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="LinkedIn Profile"
            >
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
