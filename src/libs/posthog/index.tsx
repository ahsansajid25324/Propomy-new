// src/lib/posthog.ts
let posthogPromise: Promise<typeof import("posthog-js").default> | null = null;

export function getPosthog() {
  if (!posthogPromise) {
    posthogPromise = import("posthog-js").then(({ default: posthog }) => {
      posthog.init(import.meta.env.VITE_TRACKER_API_KEY, {
        api_host: "https://us.posthog.com",
        autocapture: true,
        capture_pageview: false,
        disable_surveys: true,
        session_recording: { maskAllInputs: true },
      });
      return posthog;
    });
  }
  return posthogPromise;
}

// 1. Standardized Page Identifiers Mapping
export const PAGE_IDENTIFIERS: Record<string, string> = {
  "/": "home",
  "/reports": "reports_landing",
  "/sample-reports": "sample_reports",
  "/reports/valuation": "report_valuation",
  "/reports/comps": "report_comparables",
  "/reports/owner": "report_owner_contact",
  "/reports/deal-analysis": "report_deal_analysis",
  "/reports/market": "report_market_area",
  "/reports/debt-position": "report_distress_lien",
  "/privacy-policy": "privacy_policy",
  "/terms-of-use": "terms_of_use",
  "/Frequently-Asked-Questions": "faq",
  "/release": "release_notes",
};

// Helper function to safely execute capture calls after PostHog loads
async function captureEvent(
  eventName: string,
  properties?: Record<string, unknown>,
) {
  try {
    const posthog = await getPosthog();
    posthog.capture(eventName, properties);
  } catch (err) {
    console.warn("PostHog event capture failed:", err);
  }
}

// 2. Pageview Tracking
export function trackPageView(pathname: string) {
  const pageId = PAGE_IDENTIFIERS[pathname] || "unknown_page";
  captureEvent("$pageview", {
    page: pageId,
    path: pathname,
    url: window.location.href,
  });
}

// 3. Click-through Navigation Tracking
export function trackReportNavigation(
  sourcePage: string,
  targetReport: string,
) {
  captureEvent("report_navigation_clicked", {
    source_page: sourcePage,
    destination_report: targetReport,
  });
}

// 4. Report Funnel Actions Tracking
export function trackReportFunnelAction(
  action: "search_started" | "buy_clicked" | "checkout_completed",
  reportType: string,
  extraProperties?: Record<string, unknown>,
) {
  captureEvent(`report_${action}`, {
    report_type: reportType,
    ...extraProperties,
  });
}
