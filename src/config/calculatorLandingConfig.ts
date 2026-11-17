import React from "react";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CalculatorPageConfig {
  slug: string;
  title: string;
  headline: string;
  summary: string;
  utmContent: string;
  formulaTitle: string;
  formulaExplanation: string;
  formulaLaTeX: string;
  howItWorks: string[];
  faqs: FAQItem[];
  // Reference your existing calculator component directly!
  component: React.LazyExoticComponent<
    React.ComponentType<Record<string, unknown>>
  >;
}

export const PUBLIC_CALCULATORS: Record<string, CalculatorPageConfig> = {
  "cap-rate": {
    slug: "cap-rate",
    title: "Cap Rate & GRM Calculator",
    headline: "Free Cap Rate & GRM Calculator for Rental Properties",
    summary:
      "Calculate Capitalization Rate (Cap Rate) and Gross Rent Multiplier (GRM) to quickly evaluate potential rental property yields.",
    utmContent: "cap-rate-calc",
    formulaTitle: "Cap Rate & GRM Formulas",
    formulaExplanation:
      "Cap Rate measures unleveraged property yield based on Net Operating Income (NOI). GRM compares property price directly against annual gross rent.",
    formulaLaTeX:
      "$$\\text{Cap Rate} = \\frac{\\text{Net Operating Income (NOI)}}{\\text{Purchase Price}} \\times 100$$",
    howItWorks: [
      "Enter total property purchase price.",
      "Input expected gross annual rent.",
      "Subtract property taxes, insurance, management, and maintenance to determine NOI.",
      "Review your resulting Cap Rate and GRM.",
    ],
    faqs: [
      {
        question: "What is a good Cap Rate for residential rentals?",
        answer:
          "A good Cap Rate generally ranges between 5% and 10%, depending on market class and location risk.",
      },
      {
        question: "How does Cap Rate differ from Cash on Cash Return?",
        answer:
          "Cap Rate assumes an all-cash purchase, while Cash on Cash Return accounts for leverage and mortgage financing.",
      },
    ],
    component: React.lazy(
      () => import("../components/pages/CapRateCalculator"),
    ),
  },
  "cash-on-cash-roi": {
    slug: "cash-on-cash-roi",
    title: "Cash on Cash ROI Calculator",
    headline: "Free Cash on Cash Return (ROI) Calculator",
    summary:
      "Determine your exact cash yield on actual cash invested in a real estate deal.",
    utmContent: "roi-calc",
    formulaTitle: "Cash on Cash Return Formula",
    formulaExplanation:
      "Calculates annual pre-tax cash flow divided by total initial cash invested.",
    formulaLaTeX:
      "$$\\text{Cash on Cash Return} = \\frac{\\text{Annual Pre-Tax Cash Flow}}{\\text{Total Cash Out of Pocket}} \\times 100$$",
    howItWorks: [
      "Input down payment, closing costs, and initial rehab costs.",
      "Enter expected monthly rental cash flow.",
      "Analyze your annual cash yield percentage.",
    ],
    faqs: [
      {
        question: "What is included in total cash invested?",
        answer:
          "Total cash invested includes down payment, closing costs, upfront repairs, and loan fees.",
      },
    ],
    component: React.lazy(() => import("../components/pages/ROICalculator")),
  },
  brrrr: {
    slug: "brrrr",
    title: "BRRRR Calculator",
    headline: "Free BRRRR Strategy Calculator",
    summary:
      "Analyze Buy, Renovate, Rent, Refinance, Repeat deals to calculate cash left in the deal and post-refinance cash flow.",
    utmContent: "brrrr-calc",
    formulaTitle: "BRRRR Cash Left in Deal Formula",
    formulaExplanation:
      "Determines how much capital remains invested after cash-out refinancing.",
    formulaLaTeX:
      "$$\\text{Cash Left in Deal} = (\\text{Purchase} + \\text{Rehab} + \\text{Holding}) - \\text{New Loan Amount}$$",
    howItWorks: [
      "Enter purchase price and rehab budget.",
      "Set post-repair monthly rent and estimated ARV.",
      "Calculate cash recovered during refinance.",
    ],
    faqs: [
      {
        question: "What is a successful BRRRR strategy outcome?",
        answer:
          "A successful BRRRR deal recovers 100% of invested capital while maintaining positive monthly cash flow.",
      },
    ],
    component: React.lazy(() => import("../components/pages/BRRCalculator")),
  },
  "rental-property": {
    slug: "rental-property",
    title: "Rental Property Calculator",
    headline: "Free Rental Property Cash Flow Calculator",
    summary:
      "Evaluate rental cash flow, net operating income, and long-term returns.",
    utmContent: "rental-calc",
    formulaTitle: "Monthly Cash Flow Formula",
    formulaExplanation:
      "Calculates net rental revenue after subtracting operating expenses and full PITIA mortgage payment.",
    formulaLaTeX:
      "$$\\text{Monthly Cash Flow} = \\text{Gross Rent} - \\text{Operating Expenses} - \\text{PITIA}$$",
    howItWorks: [
      "Enter purchase price and financing terms.",
      "Account for vacancy, property management, maintenance, and CapEx reserves.",
      "Review monthly net cash flow.",
    ],
    faqs: [
      {
        question: "How much should I set aside for CapEx and maintenance?",
        answer:
          "Investors typically reserve 5% to 10% of gross rent for maintenance and an additional 5% to 10% for capital expenditures.",
      },
    ],
    component: React.lazy(() => import("../components/pages/RentalCalculator")),
  },
  dscr: {
    slug: "dscr",
    title: "DSCR Loan Calculator",
    headline: "Free DSCR Calculator | Debt Service Coverage Ratio",
    summary:
      "Calculate Debt Service Coverage Ratio (DSCR) for investment property loans.",
    utmContent: "dscr-calc",
    formulaTitle: "DSCR Formula",
    formulaExplanation:
      "Compares vacancy-adjusted gross rental income against full monthly debt service (PITIA).",
    formulaLaTeX:
      "$$\\text{DSCR} = \\frac{\\text{Gross Monthly Rent} \\times (1 - \\text{Vacancy Rate})}{\\text{Total Monthly PITIA}}$$ ",
    howItWorks: [
      "Enter expected monthly rent and vacancy rate.",
      "Input monthly principal, interest, taxes, insurance, and HOA dues.",
      "Check if DSCR exceeds lender requirements (usually 1.20x+).",
    ],
    faqs: [
      {
        question: "What is a good DSCR ratio?",
        answer: "Lenders typically look for a minimum DSCR of 1.20x to 1.25x.",
      },
    ],
    component: React.lazy(() => import("../components/pages/DSCRCalculator")),
  },
  "fix-and-flip": {
    slug: "fix-and-flip",
    title: "Fix & Flip Calculator",
    headline: "Free Fix and Flip Profit Calculator",
    summary:
      "Calculate net profit, ROI, and annualized returns on property flips.",
    utmContent: "fixflip-calc",
    formulaTitle: "Flip Net Profit Formula",
    formulaExplanation:
      "Subtracts purchase price, rehab costs, holding costs, and selling costs from ARV.",
    formulaLaTeX:
      "$$\\text{Net Profit} = \\text{ARV} - (\\text{Purchase Price} + \\text{Rehab} + \\text{Holding Costs} + \\text{Selling Costs})$$",
    howItWorks: [
      "Enter purchase price, ARV, and rehab budget.",
      "Input holding timeline and monthly financing costs.",
      "View net profit and return on investment.",
    ],
    faqs: [
      {
        question: "What is the 70% rule in house flipping?",
        answer:
          "The 70% rule states you should pay no more than 70% of the ARV minus estimated repair costs.",
      },
    ],
    component: React.lazy(
      () => import("../components/pages/FixFlipCalculator"),
    ),
  },
};
