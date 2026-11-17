import React from "react";
import {
  FileText,
  LineChart,
  UserCheck,
  Percent,
  Building,
  Target,
  BarChart2,
  CircleDollarSign,
  Building2,
  AlertTriangle,
  Layers,
} from "lucide-react";

export interface ReportProduct {
  id: string;
  icon: React.ReactNode;
  price: string;
  title: string;
  description: string;
  ctaLabel: string;
  featured?: boolean;
  badge?: string;
  path?: string;
  iconColor?: string;
}

export interface SampleReportProduct {
  id: string;
  icon: React.ReactNode;
  price: string;
  title: string;
  description: string;
  ctaLabel: string;
  iconColor: string;
  badge?: string;
  featured?: boolean;
  path?: string;
}

export const REPORTS: ReportProduct[] = [
  {
    id: "deep-dive",
    title: "Property Deep Dive Report",
    price: "$36",
    description:
      "All six reports combined into one comprehensive deliverable plus mortgage position, title indicators, and full deal math ($86 value).",
    badge: "Best Value",
    featured: true,
    icon: <Layers size={20} />,
    iconColor: "#2563EB",
    ctaLabel: "Run deep dive",
    path: "/reports/deep-dive",
  },
  {
    id: "valuation",
    title: "Valuation Report",
    price: "$10",
    description:
      "AVM-backed value estimate with low/mid/high range, confidence score, full property characteristics, and supporting comps.",
    badge: "Most Popular",
    featured: false,
    icon: <FileText size={20} />,
    iconColor: "#4DA6FF",
    ctaLabel: "Run a valuation",
    path: "/reports/valuation",
  },
  {
    id: "comps",
    title: "Comparables Report",
    price: "$9",
    description:
      "Recent nearby sales matched on beds, baths, sqft, and distance — the comps behind any valuation, on their own.",
    icon: <LineChart size={20} />,
    iconColor: "#718096",
    ctaLabel: "Find comps",
    path: "/reports/comps",
  },
  {
    id: "owner",
    title: "Owner & Contact Report",
    price: "$8",
    description:
      "Current owner of record plus verified contact details — phone, email, and mailing address for direct outreach.",
    icon: <UserCheck size={20} />,
    iconColor: "#718096",
    ctaLabel: "Find the owner",
    path: "/reports/owner",
  },
  {
    id: "deal",
    title: "Deal Analysis Report",
    price: "$13",
    description:
      "Full investment math on one address — ROI, cap rate, cash-on-cash, and rent estimates in a single deliverable.",
    icon: <Percent size={20} />,
    iconColor: "#718096",
    ctaLabel: "Run the numbers",
    path: "/reports/deal-analysis",
  },
  {
    id: "market",
    title: "Market & Area Report",
    price: "$7",
    description:
      "Neighborhood-level trends — median price, days on market, inventory, and year-over-year movement.",
    icon: <Building size={20} />,
    iconColor: "#718096",
    ctaLabel: "Check the market",
    path: "/reports/market",
  },
  {
    id: "debt-position",
    title: "Property Debt Report",
    price: "$14",
    description:
      "Mortgage and loan position, pre-foreclosure status, and involuntary liens attached to the property or owner.",
    icon: <Target size={20} />,
    iconColor: "#718096",
    ctaLabel: "Check debt position",
    path: "/reports/debt-position",
  },
];

export const SAMPLE_REPORTS: SampleReportProduct[] = [
  {
    id: "deep-dive",
    title: "Property Deep Dive Report",
    price: "$36",
    description:
      "Full 6-module report: Valuation, Comps, Owner, Debt/Mortgage, Market, and Deal Math combined.",
    badge: "Full Bundle",
    featured: true,
    icon: <Layers size={20} />,
    iconColor: "#1A5FD4",
    ctaLabel: "View sample report",
    path: "/sample-reports/deep-dive",
  },
  {
    id: "valuation",
    title: "Valuation Report",
    price: "$10",
    description:
      "An AVM-backed value estimate with a confidence score, range, and the supporting comps behind the number.",
    icon: <FileText size={20} />,
    iconColor: "#1A5FD4",
    ctaLabel: "View sample report",
    path: "/sample-reports/valuation",
  },
  {
    id: "comps",
    title: "Comparables Report",
    price: "$9",
    description:
      "Nearby sold comps ranked by similarity score, with per-comp adjustments and a suggested value range.",
    icon: <BarChart2 size={20} />,
    iconColor: "#1A5FD4",
    ctaLabel: "View sample report",
    path: "/sample-reports/comps",
  },
  {
    id: "owner",
    title: "Owner & Contact Report",
    price: "$8",
    description:
      "Recorded owner resolved to an individual, ranked phone/email contacts, and compliance flags before you dial.",
    icon: <UserCheck size={20} />,
    iconColor: "#1A5FD4",
    ctaLabel: "View sample report",
    path: "/sample-reports/owner",
  },
  {
    id: "deal",
    title: "Deal Analysis Report",
    price: "$13",
    description:
      "Plug in your own purchase terms and get live cap rate, cash-on-cash, DSCR, ROI, and a BRRRR refinance snapshot.",
    icon: <CircleDollarSign size={20} />,
    iconColor: "#1A5FD4",
    ctaLabel: "View sample report",
    path: "/sample-reports/deal",
  },
  {
    id: "market",
    title: "Market & Area Report",
    price: "$7",
    description:
      "Local price trends, active/pending inventory, and area demographics within a radius of the subject address.",
    icon: <Building2 size={20} />,
    iconColor: "#1A5FD4",
    ctaLabel: "View sample report",
    path: "/sample-reports/market",
  },
  {
    id: "debt-position",
    title: "Property Debt Report",
    price: "$14",
    description:
      "Mortgage and loan position, foreclosure and pre-foreclosure status, plus open involuntary liens tied to the property or its owner.",
    icon: <AlertTriangle size={20} />,
    iconColor: "#D97706",
    ctaLabel: "View sample report",
    path: "/sample-reports/debt-position",
  },
];
