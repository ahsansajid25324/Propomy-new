export interface RouteMetaData {
  title: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  noindex?: boolean;
}

export interface AppRouteConfig extends RouteMetaData {
  path: string;
  isPublic: boolean;
  lastmod?: string; // YYYY-MM-DD
}

// Keep in sync with the routes actually mounted in src/App.tsx.
export const APP_ROUTES: AppRouteConfig[] = [
  {
    path: "/",
    title: "Propomy – Real Estate Reports",
    description:
      "Instant, pay-per-report real estate insights: valuations, comps, ownership, debt position, market trends, and deal analysis.",
    keywords: ["real estate reports", "property valuation", "deal analysis"],
    isPublic: true,
    lastmod: "2026-08-20",
  },
  {
    path: "/terms-of-use",
    title: "Terms of Use",
    description: "Read Propomy's Terms of Use governing platform access, purchases, and user responsibilities.",
    isPublic: true,
    lastmod: "2026-08-20",
  },
  {
    path: "/calculators",
    title: "Free Real Estate Investment Calculators",
    description:
      "Free investment calculators for real estate investors: Cap Rate, Cash-on-Cash ROI, BRRRR, Rental Cash Flow, DSCR, and Fix & Flip calculators.",
    keywords: ["real estate calculators", "investment calculators", "rental property calculator"],
    isPublic: true,
    lastmod: "2026-08-20",
  },
  // Dynamic calculator pages (/calculators/:slug) set their own title via PublicCalculatorPage.
  {
    path: "/calculators/:tool/:city",
    title: "Local Real Estate Calculator",
    isPublic: false,
    noindex: true,
  },
  {
    path: "/reports",
    title: "Property Reports",
    description:
      "Pull exactly the data you need on any property — valuations, comps, ownership, debt position, market trends, and deal math.",
    isPublic: true,
    lastmod: "2026-08-20",
  },
  {
    path: "/sample-reports",
    title: "Sample Reports",
    description: "Preview real Propomy report formatting before you buy.",
    isPublic: true,
    lastmod: "2026-08-20",
  },
  {
    path: "/reports/valuation",
    title: "Valuation Report",
    isPublic: true,
    lastmod: "2026-08-20",
  },
  {
    path: "/reports/valuation/result",
    title: "Valuation Report Results",
    isPublic: false,
    noindex: true,
  },
  {
    path: "/reports/owner",
    title: "Owner & Contact Report",
    isPublic: true,
    lastmod: "2026-08-20",
  },
  {
    path: "/reports/owner/result",
    title: "Owner & Contact Report Results",
    isPublic: false,
    noindex: true,
  },
  {
    path: "/reports/comps",
    title: "Comparables Report",
    isPublic: true,
    lastmod: "2026-08-20",
  },
  {
    path: "/reports/comps/result",
    title: "Comparables Report Results",
    isPublic: false,
    noindex: true,
  },
  {
    path: "/reports/deal-analysis",
    title: "Deal Analysis Report",
    isPublic: true,
    lastmod: "2026-08-20",
  },
  {
    path: "/reports/deal-analysis/result",
    title: "Deal Analysis Report Results",
    isPublic: false,
    noindex: true,
  },
  {
    path: "/reports/debt-position",
    title: "Debt Position Report",
    isPublic: true,
    lastmod: "2026-08-20",
  },
  {
    path: "/reports/debt-position/result",
    title: "Debt Position Report Results",
    isPublic: false,
    noindex: true,
  },
  {
    path: "/reports/market",
    title: "Market & Area Report",
    isPublic: true,
    lastmod: "2026-08-20",
  },
  {
    path: "/reports/market/result",
    title: "Market & Area Report Results",
    isPublic: false,
    noindex: true,
  },
  {
    path: "/reports/deep-dive",
    title: "Deep Dive Report",
    isPublic: true,
    lastmod: "2026-08-20",
  },
];
