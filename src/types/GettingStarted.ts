export type SectionKey =
  | "free-trial"
  | "paid-version"
  | "dashboard"
  | "deal-flow"
  | "ai-valuation"
  | "roi-calculator"
  | "add-property"
  | "view-properties"
  | "map-view"
  | "ai-assistant"
  | "accounts"
  | "billing";
interface StepItem {
  heading: string;
  body: string;
}

interface CTAItem {
  label: string;
  href: string;
}

export interface SectionContent {
  title: string;
  subtitle: string;
  steps: StepItem[];
  tip?: string;
  cta?: CTAItem;
}

export interface NavItem {
  key: SectionKey;
  label: string;
  icon: React.ReactNode;
}
