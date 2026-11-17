export const SITE_URL = "https://www.propomy.com";

export const sanitizeJsonLd = (
  data: Record<string, unknown> | Record<string, unknown>[],
): string => {
  return JSON.stringify(data).replace(/</g, "\\u003c");
};

export const organizationSchema = (): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Propomy",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  sameAs: [
    "https://www.instagram.com/propomy",
    "https://www.linkedin.com/company/propomy",
  ],
});

export const softwareApplicationSchema = (): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Propomy",
  description:
    "AI-powered real estate valuation and investment analysis platform.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "All",
  offers: [
    {
      "@type": "Offer",
      name: "Free Trial",
      price: "0",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "Essentials Plan",
      price: "79.00",
      priceCurrency: "USD",
    },
  ],
});

export interface FAQItem {
  question: string;
  answer: string;
}

export const faqSchema = (pairs: FAQItem[]): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: pairs.map((pair) => ({
    "@type": "Question",
    name: pair.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: pair.answer,
    },
  })),
});

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export const breadcrumbSchema = (
  items: BreadcrumbItem[],
): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${
      item.path.startsWith("/") ? item.path : `/${item.path}`
    }`,
  })),
});
