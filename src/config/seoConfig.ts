export interface RouteMetaData {
  title: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  noindex?: boolean;
}

export const DEFAULT_SEO: RouteMetaData = {
  title: "Propomy – Real Estate Reports",
  description:
    "Empower your real estate strategy with Propomy. Access automated deal flow tracking, skip tracing, and AI-driven property valuations.",
  keywords: [
    "real estate analytics",
    "AI property valuation",
    "skip tracing",
    "deal flow tracking",
  ],
  ogImage: "https://www.propomy.com/og-default.png", // 1200x630 navy asset
  noindex: false,
};

export const SEO_CONFIG: Record<string, RouteMetaData> = {
  // ---------------------------------------------------------------------------
  // PUBLIC MARKETING PAGES (Indexable)
  // ---------------------------------------------------------------------------
  "/": {
    title: "AI Real Estate Investment Analytics",
    description:
      "Analyze deals in seconds, uncover off-market property valuations, and streamline your portfolio growth with AI-powered real estate analytics.",
    keywords: ["real estate AI", "property analysis", "investment software"],
  },
  "/free-trial": {
    title: "Pricing & Free Trial",
    description:
      "Start your 14-day free trial with Propomy. Access automated deal flow tracking, skip tracing, and AI valuations with transparent pricing.",
    keywords: ["free trial", "propomy pricing", "real estate trial"],
  },
  "/skip-trace": {
    title: "Real Estate Skip Tracing",
    description:
      "Uncover reliable owner contact data instantly with single and bulk real estate skip tracing tailored for investors and wholesalers.",
    keywords: ["skip trace", "owner lookups", "bulk skip tracing"],
  },
  "/demo": {
    title: "Interactive Platform Demo",
    description:
      "Explore how Propomy simplifies real estate deal flow, AI property valuations, and investor analytics in our interactive platform demo.",
    keywords: ["demo", "interactive real estate software"],
  },
  "/getting-started": {
    title: "Getting Started Guide",
    description:
      "Learn how to configure your account, set up custom search criteria, and close your first AI-assisted real estate deal on Propomy.",
    keywords: ["onboarding", "investor guide", "getting started"],
  },
  "/get-started": {
    title: "Get Started",
    description:
      "Kickstart your real estate investing journey with Propomy's intelligent platform tools.",
  },
  "/terms-of-use": {
    title: "Terms of Service",
    description:
      "Read Propomy's Terms of Service governing platform access, acceptable usage, subscription billing, and user responsibilities.",
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description:
      "Understand how Propomy collects, protects, and uses your personal information and analytical data across our platform.",
  },
  "/documentation": {
    title: "Platform Documentation",
    description:
      "Comprehensive guides, API references, and feature workflows for maximizing your returns using Propomy.",
  },
  "/FAQ": {
    title: "Frequently Asked Questions",
    description:
      "Find quick answers to common questions about Propomy's AI valuation engine, skip tracing accuracy, and account management.",
  },
  "/release": {
    title: "Release Notes & Updates",
    description:
      "Stay updated with the latest feature releases, performance upgrades, and workflow improvements on Propomy.",
  },

  // Add these entries into your SEO_CONFIG object in seoConfig.ts:

  // ---------------------------------------------------------------------------
  // PUBLIC CALCULATOR MARKETING PAGES (Indexable)
  // ---------------------------------------------------------------------------
  "/calculators": {
    title: "Free Real Estate Investment Calculators",
    description:
      "Free investment calculators for real estate investors: Cap Rate, Cash-on-Cash ROI, BRRRR, Rental Cash Flow, DSCR, and Fix & Flip calculators.",
    keywords: [
      "real estate calculators",
      "investment calculators",
      "rental property calculator",
    ],
  },
  "/calculators/cap-rate": {
    title: "Free Cap Rate Calculator for Rental Properties",
    description:
      "Calculate Capitalization Rate (Cap Rate) and Gross Rent Multiplier (GRM) for rental properties. Analyze net operating income and yield.",
    keywords: ["cap rate calculator", "grm calculator", "capitalization rate"],
  },
  "/calculators/cash-on-cash-roi": {
    title: "Free Cash on Cash Return (ROI) Calculator",
    description:
      "Calculate your cash-on-cash return on real estate deals instantly. Compare down payments, closing costs, and annual cash flow.",
    keywords: ["cash on cash return calculator", "real estate roi calculator"],
  },
  "/calculators/brrrr": {
    title: "Free BRRRR Calculator | Buy, Renovate, Rent, Refinance, Repeat",
    description:
      "Analyze BRRRR deals: calculate forced appreciation, cash left in the deal after cash-out refinance, and post-refinance cash flow.",
    keywords: [
      "brrrr calculator",
      "brrrr strategy",
      "cash out refinance calculator",
    ],
  },
  "/calculators/rental-property": {
    title: "Free Rental Property Cash Flow Calculator",
    description:
      "Calculate cash flow, Cap Rate, and ROI on residential rental properties accounting for vacancy, management, CapEx, and full PITIA.",
    keywords: [
      "rental property calculator",
      "cash flow calculator real estate",
    ],
  },
  "/calculators/dscr": {
    title: "Free DSCR Loan Calculator | Debt Service Coverage Ratio",
    description:
      "Calculate Debt Service Coverage Ratio (DSCR) for investment property loans using vacancy-adjusted gross rent and full monthly PITIA.",
    keywords: ["dscr calculator", "debt service coverage ratio"],
  },
  "/calculators/fix-and-flip": {
    title: "Free Fix and Flip Profit Calculator",
    description:
      "Calculate net profit, ROI, and annualized return on house flips using purchase price, rehab budget, holding costs, and ARV.",
    keywords: ["fix and flip calculator", "flip calculator", "arv calculator"],
  },

  "/login": { title: "Account Login", noindex: true },
  "/signup": { title: "Create an Account", noindex: true },
  "/forget-password": { title: "Reset Password", noindex: true },

  "/investor": { title: "Investor Dashboard", noindex: true },
  "/investor/ai-valuation": { title: "AI Valuation", noindex: true },
  "/investor/valuations": { title: "Saved Valuations", noindex: true },
  "/investor/accounts": { title: "Account Settings", noindex: true },
  "/investor/ai-assistant": { title: "AI Assistant", noindex: true },
  "/investor/calculators": { title: "Investment Calculators", noindex: true },
  "/investor/map-view": { title: "Map View", noindex: true },
  "/investor/add-property": { title: "Add Property", noindex: true },
  "/investor/view-properties": { title: "My Portfolio", noindex: true },
  "/investor/edit-property/:id": { title: "Edit Property", noindex: true },
  "/investor/deal-flow": { title: "Deal Flow Pipeline", noindex: true },

  "/admin": { title: "Admin Workspace", noindex: true },
  "/realtor": { title: "Realtor Workspace", noindex: true },
};
