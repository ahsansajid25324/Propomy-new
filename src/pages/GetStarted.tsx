import "../styles/GetStarted.css";

import {
  ArrowRight,
  BarChart3,
  Calculator,
  Home,
  Kanban,
  MapPin,
  MessageSquareText,
  Sparkles,
} from "lucide-react";

import Footer from "../components/pages/Footer";
import Navbar from "../components/common/Navbar";
import React from "react";
import { Link } from "react-router-dom";
import posthog from "posthog-js";

interface QuickFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Step {
  heading: string;
  body: string;
}

const quickFeatures: QuickFeature[] = [
  {
    icon: <Home className="lp-strip-icon" color="#2563eb" size={22} />,
    title: "AI Valuations",
    description: "Instant, data-driven property estimates powered by ML.",
  },
  {
    icon: <Kanban className="lp-strip-icon" color="#2563eb" size={22} />,
    title: "DealFlow",
    description: "Track active and closed deals from analysis to closing in one view.",
  },
  {
    icon: <Calculator className="lp-strip-icon" color="#2563eb" size={22} />,
    title: "6 Calculators in 1 Platform",
    description: "Model deals fast: ROI, BRRRR, Rental, DSCR, Fix & Flip, and GRM.",
  },
  {
    icon: <MapPin className="lp-strip-icon" color="#2563eb" size={22} />,
    title: "Map View Insights",
    description: "Visualize neighborhood opportunities with demographic layers.",
  },
  {
    icon: <MessageSquareText className="lp-strip-icon" color="#2563eb" size={22} />,
    title: "AI Conversational Assistant",
    description: "Query properties, compare deals, and get plain-English insights.",
  },
  {
    icon: <BarChart3 className="lp-strip-icon" color="#2563eb" size={22} />,
    title: "Investment Dashboard",
    description: "Monitor real-time portfolio performance and analytics.",
  },
];
const steps: Step[] = [
  {
    heading: "Create your free account",
    body: "Sign up in under 60 seconds — no credit card required.",
  },
  {
    heading: "Search or import properties",
    body: "Browse live MLS feeds or bulk-import addresses via CSV easily.",
  },
  {
    heading: "Analyse with AI",
    body: "Our engine surfaces valuation, ROI, and risk metrics automatically.",
  },
  {
    heading: "Close with confidence",
    body: "Generate branded offer summaries and investment briefs with one click.",
  },
];

export default function GetStarted() {
  const handleCTAClick = (location: string) => {
    posthog.capture("get_started_cta_clicked", {
      location,
      page: "get_started_ads",
    });
  };

  return (
    <>
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="lp-gs-hero">
        <div className="lp-gs-hero-bg" />
        <div className="lp-gs-hero-content">
          <div className="lp-gs-hero-badge">AI-Powered Real Estate Platform</div>
          <h1 className="lp-gs-hero-title">Make Your Next Deal Your Best Deal</h1>
          <p className="lp-gs-hero-subtitle">
            AI valuations, deal flow tracking, six investor calculators, and map-level insights — everything you need to close your next deal with confidence.
          </p>
          <a href="/free-trial" className="lp-gs-btn lp-gs-btn-primary lp-gs-btn-hero">
            Get Started for Free
          </a>
        </div>
      </section>

      {/* ── FLOATING FEATURE STRIP ── */}
      <section className="lp-features-strip-section">
        <div className="lp-features-strip-container">
          <div className="lp-features-strip">
            {quickFeatures.map((f, i) => (
              <div className="lp-strip-card" key={i}>
                <div className="lp-strip-icon-box">{f.icon}</div>
                <h3 className="lp-strip-title">{f.title}</h3>
                <p className="lp-strip-desc">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO SECTION ── */}
      <section className="lp-video-section">
        <div className="lp-video-header">
          <div className="lp-section-eyebrow">See It In Action</div>
          <h2 className="lp-section-title">What is Propomy?</h2>
          <p className="lp-video-subtitle">
            Watch how Propomy helps investors find, analyse, and close better
            real estate deals in minutes.
          </p>
        </div>
        <div className="lp-video-wrapper">
          <video controls autoPlay muted loop playsInline>
            <source
              src="https://propomy-video-bucket.s3.eu-north-1.amazonaws.com/home.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="lp-how">
        <div className="lp-section-header">
          <div className="lp-section-eyebrow">Simple Process</div>
          <h2 className="lp-section-title">Up and running in minutes</h2>
        </div>
        <div className="lp-steps">
          {steps.map((s, i) => (
            <div className="lp-step" key={i}>
              <div className="lp-step-number">{i + 1}</div>
              <div className="lp-step-body">
                <h3>{s.heading}</h3>
                <p>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="lp-cta">
        <div className="lp-cta-grid" />
        <div className="lp-cta-glow lp-cta-glow-1" />
        <div className="lp-cta-glow lp-cta-glow-2" />

        <div className="lp-cta-content">
          <div className="lp-cta-badge">
            <Sparkles size={14} />
            Start closing smarter today
          </div>

          <h2>Deals Analyzed. Satisfied Investors.</h2>
          <p>
            AI valuations, six deal calculators, and map-level insights — plus deal flow tracking from first analysis to closing. Everything you need to close with confidence.
          </p>

          <div className="lp-cta-actions">
            <Link
              to="/free-trial"
              className="lp-cta-btn lp-cta-btn-primary"
              onClick={() => handleCTAClick("bottom_cta_free_trial")}
            >
              Get Started for Free
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/free-trial"
              className="lp-cta-btn lp-cta-btn-outline"
              onClick={() => handleCTAClick("bottom_cta_pricing")}
            >
              View Pricing
            </Link>
          </div>

          <p className="lp-cta-note">
            No credit card required • Free 14-day trial • Cancel anytime
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}