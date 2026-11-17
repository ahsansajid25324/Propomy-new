import Footer from "../components/pages/Footer";
import Navbar from "../components/common/Navbar";
import { SEO } from "../components/common/SEO";
import { breadcrumbSchema } from "../libs/schema";
import otherHero from "../assets/SubPageHero.png";
import "../styles/Home.css";

const Documentation = () => {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Documentation", path: "/documentation" },
  ];

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ backgroundColor: "var(--white)" }}
    >
      <SEO title="Documentation" jsonLd={breadcrumbSchema(breadcrumbItems)} />
      <Navbar />

      {/* Hero Section */}
      <section
        className="other-hero-section position-relative text-center py-5"
        style={{
          backgroundImage: `url(${otherHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "var(--white)",
          height: "50vh",
        }}
      >
        <div className="wrap py-4">
          <div className="other-hero-icon mb-3">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ stroke: "var(--white)" }}
            >
              <path
                d="M12 2L4 5V11C4 16.19 7.41 21.05 12 22C16.59 21.05 20 16.19 20 11V5L12 2Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1
            className="fw-bold mb-0"
            style={{
              color: "var(--white)",
              fontSize: "clamp(32px, 5vw, 48px)",
            }}
          >
            Coming Soon
          </h1>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Documentation;
