import { useEffect, useRef, useState } from "react";
import "../styles/GettingStarted.css";
import { sectionContent, navItems } from "../libs/constants/GettingStarted";
import type { SectionKey } from "../types/GettingStarted";
import Navbar from "../components/common/Navbar";
import Footer from "../components/pages/Footer";

export default function GettingStarted() {
  const [activeSection, setActiveSection] = useState<SectionKey>(
    navItems[0]?.key || ("free-trial" as SectionKey),
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainLayoutRef = useRef<HTMLDivElement>(null);

  // Ref map to keep track of individual sidebar button elements
  const itemRefs = useRef<Map<SectionKey, HTMLButtonElement | null>>(new Map());

  // Handle scrolling when section changes
  useEffect(() => {
    const isMobile = window.innerWidth < 901; // Adjust threshold if needed
    if (isMobile && mainLayoutRef.current) {
      mainLayoutRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    // 2. Center active item inside the sidebar list
    const activeEl = itemRefs.current.get(activeSection);
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "smooth",
        block: "center", // Vertical centering
        inline: "center", // Horizontal centering (if horizontal layout)
      });
    }
  }, [activeSection]);

  const section = sectionContent[activeSection] || {
    title: "",
    subtitle: "",
    steps: [],
  };

  const activeLabel =
    navItems.find((n) => n.key === activeSection)?.label || "";

  return (
    <div className="gs-root">
      <Navbar />

      <section className="gs-hero">
        <div className="gs-hero-bg" />
        <div className="gs-hero-content">
          <div className="gs-hero-badge">Getting Started Guide</div>
          <h1 className="gs-hero-title">Getting Started with Propomy</h1>
          <p className="gs-hero-subtitle">
            Welcome to Propomy. This guide walks you through every feature on
            the platform — from running your first AI Valuation to tracking your
            active deal pipeline — so you can start making smarter investment
            decisions right away.
          </p>
          <a href="/free-trial" className="gs-btn gs-btn-primary gs-btn-hero">
            Start Free Trial
          </a>
        </div>
      </section>

      {/* Mobile subnav toggle */}
      <div className="gs-mobile-subnav">
        <button
          className="gs-mobile-menu-toggle"
          onClick={() => setSidebarOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span>Topics Menu ({activeLabel})</span>
        </button>
      </div>

      {sidebarOpen && (
        <div
          className="gs-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Nav */}
      <aside className={`gs-sidebar${sidebarOpen ? " gs-sidebar--open" : ""}`}>
        <div className="gs-sidebar-inner">
          <div className="gs-sidebar-header">
            <span>Contents</span>
            <button
              className="gs-sidebar-close"
              onClick={() => setSidebarOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            </button>
          </div>

          <nav className="gs-sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.key}
                ref={(el) => {
                  if (el) itemRefs.current.set(item.key, el);
                  else itemRefs.current.delete(item.key);
                }}
                className={`gs-sidebar-item${
                  activeSection === item.key ? " gs-sidebar-item--active" : ""
                }`}
                onClick={() => {
                  setActiveSection(item.key);
                  setSidebarOpen(false);
                }}
              >
                <span className="gs-sidebar-icon">{item.icon}</span>
                <span className="gs-sidebar-label">{item.label}</span>
                {activeSection === item.key && (
                  <span className="gs-sidebar-indicator" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <div className="gs-layout" ref={mainLayoutRef}>
        <main className="gs-main">
          {/* Content header */}
          <div className="gs-content-header">
            <div className="gs-breadcrumb">
              <span>Getting Started</span>
              <span className="gs-breadcrumb-sep">›</span>
              <span>{activeLabel}</span>
            </div>
            <h2 className="gs-content-title">{section?.title}</h2>
            <p className="gs-content-subtitle">{section?.subtitle}</p>
          </div>

          {/* Steps */}
          <div className="gs-steps">
            {section?.steps?.map((step, i) => (
              <div key={i} className="gs-step">
                <div className="gs-step-number">{i + 1}</div>
                <div className="gs-step-body">
                  <h3 className="gs-step-heading">{step.heading}</h3>
                  <p className="gs-step-text">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Optional tip callout */}
          {section?.tip && (
            <div className="gs-tip">
              <span className="gs-tip-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "var(--propomy-gold)" }}
                >
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .6 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                </svg>
              </span>
              <p>{section.tip}</p>
            </div>
          )}

          {/* Optional CTA */}
          {section?.cta && (
            <div className="gs-content-cta">
              <a href={section.cta.href} className="gs-btn gs-btn-primary">
                {section.cta.label}
              </a>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
