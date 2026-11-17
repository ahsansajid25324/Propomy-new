export interface ReportDetailField {
  label: string;
  value: string | number;
  highlight?: boolean;
  status?: "positive" | "warning" | "neutral";
}

export interface ReportDetailGroup {
  sectionTitle: string;
  fields: ReportDetailField[];
}

export interface SampleReportDetail {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  summary: string;
  groups: ReportDetailGroup[];
  notice?: {
    type: "warning" | "info";
    text: string;
  };
}

export const SAMPLE_REPORTS_DETAILS: Record<string, SampleReportDetail> = {
  // 1. PROPERTY DEEP DIVE REPORT
  "deep-dive": {
    id: "deep-dive",
    title: "Property Deep Dive Report",
    subtitle: "Master 6-Module Property & Financial Encumbrance Audit",
    price: "$36",
    summary:
      "Consolidates Property Baseline Characteristics, AVM Valuation, Matched Sales Comps, Owner Skip-Trace, Debt & Encumbrances, Market Dynamics, and Deal Analysis into one single master deliverable.",
    groups: [
      {
        sectionTitle: "1. Core Overview",
        fields: [
          { label: "Address", value: "1042 Ocean Blvd, Miami, FL 33139" },
          { label: "Beds / Baths", value: "4 bd / 2.5 ba" },
          { label: "Sqft / Year Built", value: "2,150 sq ft / 1984" },
          {
            label: "Estimated Value",
            value: "$512,000",
            highlight: true,
            status: "positive",
          },
          { label: "Est. Low Range", value: "$485,000" },
          { label: "Est. High Range", value: "$538,000" },
          { label: "Last Sale Amount", value: "$420,000" },
          { label: "Last Sale Date", value: "2021-08-15" },
        ],
      },
      {
        sectionTitle: "2. Valuation & Property Detail",
        fields: [
          { label: "Property Type", value: "Single Family Residential" },
          { label: "Bedrooms / Bathrooms", value: "4 bd / 2.5 ba" },
          { label: "Living Area", value: "2,150 sq ft" },
          { label: "Zip Code", value: "33139" },
          { label: "Year Built", value: "1984" },
          { label: "AVM Valuation", value: "$512,000" },
          { label: "Quality Score / Tier", value: "0.91 / High" },
          {
            label: "Valuation Explanation",
            value: "High comp density and recent local sales volume.",
          },
        ],
      },
      {
        sectionTitle: "3. Comparable Sales",
        fields: [
          { label: "Subject Address", value: "1042 Ocean Blvd, Miami, FL" },
          { label: "Lot Size", value: "0.25 acres / 10,890 sqft" },
          { label: "Baseline $/Sqft", value: "$238.14 / sqft" },
          { label: "Top Comp Address", value: "1084 Ocean Blvd, Miami, FL" },
          {
            label: "Top Comp Similarity",
            value: "94% Match",
            status: "positive",
          },
          { label: "Median $/Sqft", value: "$281.00 / sqft" },
          { label: "Suggested Range", value: "$495,000 - $525,000" },
        ],
      },
      {
        sectionTitle: "4. Owner & Skip-Trace Identity",
        fields: [
          { label: "Owner Name", value: "Apex Property Holdings LLC" },
          { label: "Corporate / LLC Owner", value: "Yes" },
          {
            label: "Unwound Individual",
            value: "Michael R. Sterling",
            highlight: true,
          },
          {
            label: "Mailing Address",
            value: "1042 Ocean Blvd, Suite 400, Miami, FL 33139",
          },
          {
            label: "Compliance Warning",
            value: "DNC Flagged",
            status: "warning",
          },
          {
            label: "Primary Person / Age",
            value: "Michael R. Sterling / 52 yrs",
          },
        ],
      },
      {
        sectionTitle: "5. Debt, Mortgage & Liens Audit",
        fields: [
          { label: "Lien Status Pending", value: "No" },
          { label: "Verification Status", value: "Position Verified" },
          { label: "Lender / Servicer", value: "First National Mortgage Corp" },
          { label: "Est. Current Balance", value: "$312,400" },
          { label: "Est. Equity", value: "$199,600", status: "positive" },
          { label: "Loan-to-Value (LTV)", value: "61.0%" },
          { label: "Distress Indicator", value: "None" },
          {
            label: "Involuntary Liens",
            value: "HOA Special Assessment / $2,850.00",
            status: "warning",
          },
        ],
      },
      {
        sectionTitle: "6. Market Trends & Deal Metrics",
        fields: [
          { label: "Median Sale Price", value: "$485,000" },
          { label: "Market Growth (YoY)", value: "+6.8%", status: "positive" },
          { label: "Deal Valuation", value: "$512,000" },
          { label: "Comp Tolerance Margin", value: "10.0%" },
          { label: "Within Comp Tolerance", value: "Yes", status: "positive" },
        ],
      },
      {
        sectionTitle: "7. Sources & Pricing Savings",
        fields: [
          { label: "Standalone Module Total", value: "$86.00" },
          { label: "Bundle Package Price", value: "$36.00" },
          { label: "Total Savings ($)", value: "$50.00" },
          {
            label: "Total Savings (%)",
            value: "58% Savings",
            highlight: true,
            status: "positive",
          },
        ],
      },
    ],
    notice: {
      type: "info",
      text: "Matched Address: 1042 Ocean Blvd, Miami, FL 33139 | Schema Version: 2.1",
    },
  },  

  // 2. VALUATION REPORT
  valuation: {
    id: "valuation",
    title: "Valuation Report",
    subtitle: "Automated Valuation Model (AVM) Range & Driver Analysis",
    price: "$10",
    summary:
      "Delivers a machine-learning valuation estimate with high/low range boundaries, confidence scores, and feature impact rankings.",
    groups: [
      {
        sectionTitle: "Property Details",
        fields: [
          { label: "propertyType", value: "Single Family Residential" },
          { label: "bedrooms", value: "4" },
          { label: "bathrooms", value: "2.5" },
          { label: "livingSqFt", value: "2,150 sq ft" },
          { label: "yearBuilt", value: "1984" },
          { label: "zipcode", value: "33139" },
        ],
      },
      {
        sectionTitle: "Valuation Output",
        fields: [
          {
            label: "valuation / prediction",
            value: "$512,000",
            highlight: true,
            status: "positive",
          },
          { label: "low_estimate", value: "$485,000" },
          { label: "high_estimate", value: "$538,000" },
          { label: "quality_score", value: "0.91" },
          { label: "quality_tier", value: "High Confidence" },
          {
            label: "feature_set_version / model_version",
            value: "v2.4 / prod_v2",
          },
          { label: "geo_scope", value: "Miami-Dade County" },
          { label: "source", value: "ML_AVM_PRIMARY" },
        ],
      },
      {
        sectionTitle: "Top Feature Drivers",
        fields: [
          { label: "livingSqFt (+2,150 sqft)", value: "+$42,000" },
          { label: "geo_scope (Submarket Density)", value: "+$18,500" },
          { label: "yearBuilt (1984 Vintage)", value: "-$6,100" },
        ],
      },
    ],
    notice: {
      type: "info",
      text: "explanation: Valuation estimate supported by high regional liquidity and strong comp density.",
    },
  },

  // 3. COMPARABLES REPORT
  comps: {
    id: "comps",
    title: "Comparables Report",
    subtitle: "Ranked Nearby Sales, Similarity Scoring & Price Adjustments",
    price: "$9",
    summary:
      "Identifies top-matching recent property sales using proximity, size delta, and recency scoring to compute adjusted market valuation ranges.",
    groups: [
      {
        sectionTitle: "Subject Baseline",
        fields: [
          { label: "address", value: "1042 Ocean Blvd, Miami, FL 33139" },
          {
            label: "beds / baths / sqft",
            value: "4 bd / 2.5 ba / 2,150 sq ft",
          },
          { label: "yearBuilt", value: "1984" },
          { label: "lotAcres / lotSqft", value: "0.25 acres / 10,890 sq ft" },
          { label: "pricePerSqftBaseline", value: "$238.14 / sqft" },
          { label: "latitude / longitude", value: "25.7781 / -80.1313" },
        ],
      },
      {
        sectionTitle: "Comps Summary",
        fields: [
          { label: "compsFound", value: "5 Properties" },
          {
            label: "suggestedRangeLow - suggestedRangeHigh",
            value: "$495,000 - $525,000",
            highlight: true,
          },
          { label: "medianPricePerSqft", value: "$281.00 / sqft" },
          { label: "avgPricePerSqft", value: "$283.40 / sqft" },
        ],
      },
      {
        sectionTitle: "Top Match Details",
        fields: [
          { label: "address", value: "1084 Ocean Blvd, Miami, FL" },
          { label: "distanceMiles / daysOnMarket", value: "0.18 mi / 18 days" },
          { label: "salePrice / saleDate", value: "$510,000 / 42 days ago" },
          { label: "pricePerSqft", value: "$242.85 / sqft" },
          { label: "similarity.total", value: "94% Match", status: "positive" },
          { label: "adjustedPrice", value: "$514,500" },
          { label: "isStale", value: "false" },
        ],
      },
    ],
    notice: {
      type: "info",
      text: "meta.searchParamsUsed: maxRadiusMiles: 0.5 mi | maxDaysBack: 90 days.",
    },
  },

  // 4. OWNER & CONTACT REPORT
  owner: {
    id: "owner",
    title: "Owner & Contact Report",
    subtitle: "Verified Identity, Skip-Trace Phones & Compliance Signals",
    price: "$8",
    summary:
      "Resolves subject properties down to true individual owners, unwinds corporate entities/LLCs, and delivers ranked phone numbers, emails, and DNC/litigator compliance flags.",
    groups: [
      {
        sectionTitle: "Owner Identity",
        fields: [
          { label: "name", value: "Apex Property Holdings LLC" },
          { label: "isCorporateOrLLC", value: "true" },
          {
            label: "unwoundIndividualName",
            value: "Michael R. Sterling",
            highlight: true,
          },
          {
            label: "mailingAddress",
            value: "1042 Ocean Blvd, Suite 400, Miami, FL 33139",
          },
          { label: "ageRange / maritalStatus", value: "50-55 yrs / Married" },
        ],
      },
      {
        sectionTitle: "Contacts Overview",
        fields: [
          { label: "hasContactData", value: "true" },
          {
            label: "hasDncOrLitigatorWarning",
            value: "true",
            status: "warning",
          },
          { label: "identityUnverified", value: "false" },
          { label: "phones[0].number", value: "(305) 555-0192" },
          {
            label: "phones[0].type / confidenceRank",
            value: "Mobile / Rank 1",
          },
          { label: "phones[0].dncFlag", value: "true", status: "warning" },
          { label: "emails[0].email", value: "msterling@apexholdings.com" },
        ],
      },
      {
        sectionTitle: "Primary Person Audit",
        fields: [
          { label: "personId", value: "PER_884920" },
          { label: "fullName", value: "Michael R. Sterling" },
          {
            label: "age / gender / maritalStatus",
            value: "52 yrs / Male / Married",
          },
          { label: "occupation", value: "Real Estate Investor" },
          { label: "isPrimaryOwnerMatch", value: "true", status: "positive" },
          {
            label: "currentAddress",
            value: "1042 Ocean Blvd, Suite 400, Miami, FL",
          },
        ],
      },
      {
        sectionTitle: "Household Context",
        fields: [
          {
            label: "relativesAndAssociates",
            value: "Sarah Sterling, James Sterling",
          },
          { label: "lengthOfResidence", value: "8 Years" },
        ],
      },
    ],
    notice: {
      type: "warning",
      text: "Compliance Warning: Phone record carries active National Do-Not-Call (DNC) flag.",
    },
  },

  // 5. DEAL ANALYSIS REPORT
  "deal-analysis": {
    id: "deal-analysis",
    title: "Deal Analysis Report",
    subtitle: "Lender-Grade AVM, Purchase Terms, Investment Metrics & BRRRR",
    price: "$13",
    summary:
      "Runs automated purchase term calculations, Cash-on-Cash ROI, DSCR, Cap Rate, and BRRRR/Fix-and-Flip margin simulations against live AVM data.",
    groups: [
      {
        sectionTitle: "Subject Baseline",
        fields: [
          { label: "address", value: "1042 Ocean Blvd, Miami, FL 33139" },
          {
            label: "beds / baths / sqft",
            value: "4 bd / 2.5 ba / 2,150 sq ft",
          },
          { label: "yearBuilt / lotAcres", value: "1984 / 0.25 acres" },
          {
            label: "lastSaleAmount / lastSaleDate",
            value: "$420,000 / 2021-08-15",
          },
          { label: "annualTax", value: "$5,420 / yr" },
          { label: "latitude / longitude", value: "25.7781 / -80.1313" },
        ],
      },
      {
        sectionTitle: "AVM Estimate",
        fields: [
          {
            label: "value",
            value: "$512,000",
            highlight: true,
            status: "positive",
          },
          { label: "rangeLow", value: "$485,000" },
          { label: "rangeHigh", value: "$538,000" },
          { label: "confidence", value: "91%" },
        ],
      },
      {
        sectionTitle: "Comps Sanity Check",
        fields: [
          { label: "compsUsed", value: "5 Properties" },
          { label: "medianPricePerSqft", value: "$281.00 / sqft" },
          { label: "avmPricePerSqft", value: "$238.14 / sqft" },
          { label: "percentDelta", value: "2.1%" },
          { label: "withinTolerancePct", value: "10.0%" },
          { label: "isWithinTolerance", value: "true", status: "positive" },
        ],
      },
    ],
    notice: {
      type: "info",
      text: "meta.dataSources: Public tax records, MLS deed transfers, and regional mortgage rates.",
    },
  },

  // 6. MARKET & AREA REPORT
  market: {
    id: "market",
    title: "Market & Area Report",
    subtitle: "Local Trends, Active/Pending Inventory & Radius Demographics",
    price: "$7",
    summary:
      "Provides real-time local real estate dynamics—including median sales, price per square foot, inventory velocity, and demographics within a custom radius.",
    groups: [
      {
        sectionTitle: "Market Snapshot",
        fields: [
          { label: "medianSalePrice", value: "$485,000", highlight: true },
          { label: "medianListPrice", value: "$499,900" },
          { label: "medianPricePerSqft", value: "$284 / sqft" },
          { label: "medianDaysOnMarket", value: "24 days" },
          { label: "sampleSize", value: "42 sales" },
          { label: "isStatisticallyThin", value: "false" },
        ],
      },
      {
        sectionTitle: "12-Month Price Trend",
        fields: [
          { label: "direction", value: "UP", status: "positive" },
          {
            label: "percentChange",
            value: "+6.8%",
            status: "positive",
            highlight: true,
          },
          { label: "currentPeriodMedian", value: "$485,000" },
          { label: "priorPeriodMedian", value: "$454,000" },
          {
            label: "summaryMessage",
            value: "Steady appreciation over prior period.",
          },
        ],
      },
      {
        sectionTitle: "Inventory",
        fields: [
          { label: "activeListings", value: "14" },
          { label: "pendingListings", value: "8" },
          { label: "totalComparableInventory", value: "22" },
        ],
      },
      {
        sectionTitle: "Demographics",
        fields: [
          { label: "zip", value: "33139" },
          { label: "population", value: "32,450" },
          { label: "households", value: "14,200" },
          { label: "medianHouseholdIncome", value: "$88,500" },
          {
            label: "ownerOccupiedPercent / renterOccupiedPercent",
            value: "68% / 32%",
          },
          { label: "isAvailable", value: "true" },
        ],
      },
    ],
    notice: {
      type: "info",
      text: "meta.radiusMiles: 1.0 mi | dataGaps: None detected.",
    },
  },

  // 7. DEBT POSITION REPORT
  "debt-position": {
    id: "debt-position",
    title: "Debt Position Report",
    subtitle: "Mortgage History, Pre-Foreclosure Status & Liens Audit",
    price: "$14",
    summary:
      "Audits the full encumbrance chain of a property, covering active mortgage details, LTV estimates, pre-foreclosure flags, and involuntary liens.",
    groups: [
      {
        sectionTitle: "Mortgage Position",
        fields: [
          { label: "hasActiveMortgage", value: "true" },
          {
            label: "summaryMessage",
            value: "Active 1st mortgage recorded in 2019.",
          },
          { label: "lenderOrServicer", value: "First National Mortgage Corp" },
          {
            label: "loanType / originationDate",
            value: "Conventional / 2019-04-12",
          },
          { label: "originalLoanAmount", value: "$380,000" },
          { label: "estimatedCurrentBalance", value: "$312,400" },
          { label: "interestRate", value: "4.25%" },
          { label: "estimatedEquity", value: "$199,600", status: "positive" },
          { label: "ltv", value: "61.0%" },
          {
            label: "hasSecondLienOrHeloc",
            value: "true ($45k HELOC)",
            status: "warning",
          },
        ],
      },
      {
        sectionTitle: "Foreclosure Audit",
        fields: [
          { label: "hasDistressIndicator", value: "false" },
          { label: "isPreForeclosureOrNod", value: "false" },
          {
            label: "auctionDate / hasAuctionPassed",
            value: "Not Scheduled / false",
          },
          { label: "auctionLocation", value: "N/A" },
          { label: "defaultAmount", value: "$0.00" },
          { label: "trusteeOrAttorney", value: "N/A" },
        ],
      },
      {
        sectionTitle: "Involuntary Liens Audit",
        fields: [
          { label: "type", value: "HOA Special Assessment" },
          {
            label: "amount",
            value: "$2,850.00",
            status: "warning",
            highlight: true,
          },
          { label: "filingDate", value: "2025-10-14" },
          { label: "holder", value: "Bayside Community Association" },
          {
            label: "status / isReleased",
            value: "Active / false",
            status: "warning",
          },
        ],
      },
    ],
    notice: {
      type: "warning",
      text: "distressSummaryMessage: Property is clear of foreclosure filings but carries 1 open HOA lien.",
    },
  },
};

SAMPLE_REPORTS_DETAILS["deal"] = SAMPLE_REPORTS_DETAILS["deal-analysis"];
SAMPLE_REPORTS_DETAILS["debt"] = SAMPLE_REPORTS_DETAILS["debt-position"];
