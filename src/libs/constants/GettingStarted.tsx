import type {
  NavItem,
  SectionContent,
  SectionKey,
} from "../../types/GettingStarted";

export const navItems: NavItem[] = [
  {
    key: "free-trial",
    label: "Free Trial",
    icon: (
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
        <path d="M20 12v10H4V12" />
        <path d="M2 7h20v5H2z" />
        <path d="M12 22V7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
  },
  {
    key: "paid-version",
    label: "Paid Version",
    icon: (
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
        <path d="M6 3h12l4 6-10 13L2 9z" />
        <path d="M11 3 8 9l4 13" />
        <path d="M13 3l3 6-4 13" />
        <path d="M2 9h20" />
      </svg>
    ),
  },
  {
    key: "dashboard",
    label: "Dashboard",
    icon: (
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
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="10" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    ),
  },
  {
    key: "deal-flow",
    label: "Deal Flow",
    icon: (
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
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    key: "ai-valuation",
    label: "AI Valuation",
    icon: (
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
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </svg>
    ),
  },
  {
    key: "roi-calculator",
    label: "Calculators & ROI",
    icon: (
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
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 22V12h6v10" />
        <path d="M8 12h8" />
        <path d="M12 16v4" />
        <path d="M10 7h4" />
        <path d="M12 5v4" />
      </svg>
    ),
  },
  {
    key: "add-property",
    label: "Add Property",
    icon: (
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
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <path d="M12 11v4" />
        <path d="M10 13h4" />
      </svg>
    ),
  },
  {
    key: "view-properties",
    label: "View Properties",
    icon: (
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
        <path d="M3 9 12 2l9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    key: "map-view",
    label: "Map View & Property Details",
    icon: (
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
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" x2="9" y1="3" y2="18" />
        <line x1="15" x2="15" y1="6" y2="21" />
      </svg>
    ),
  },
  {
    key: "ai-assistant",
    label: "AI Assistant",
    icon: (
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
        <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10a9.96 9.96 0 0 1-4.587-1.11l-3.826 1.097a1 1 0 0 1-1.234-1.234l1.097-3.826A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2z" />
        <path d="m11 8-3 4h6l-3 4" />
      </svg>
    ),
  },
  {
    key: "accounts",
    label: "Accounts",
    icon: (
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
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    key: "billing",
    label: "Billing",
    icon: (
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
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    ),
  },
];

export const sectionContent: Record<SectionKey, SectionContent> = {
  "free-trial": {
    title: "Start Your Free Trial",
    subtitle:
      "Experience the full power of Propomy — no credit card required. Your free trial gives you complete access to all features for 14 days.",
    steps: [
      {
        heading: "Create Your Account",
        body: "Head to the sign-up page and register with your email address. You'll receive a confirmation email to verify your account. Once verified, you're ready to explore.",
      },
      {
        heading: "Complete Your Profile",
        body: "Add your investment preferences, target markets, and property criteria. This helps Propomy's AI tailor recommendations and valuations specifically for your strategy.",
      },
      {
        heading: "Explore All Features",
        body: "During your free trial, every feature is unlocked — AI Valuation, ROI Calculator, Deal Flow, Map View, AI Assistant, and more. We encourage you to test everything so you can make an informed decision.",
      },
      {
        heading: "No Commitment Required",
        body: "Your trial ends automatically after 14 days. If you love it, upgrade to a paid plan with one click. No hidden charges, no surprise billing.",
      },
    ],
    tip: "Pro tip: Add at least 3 properties during your trial to fully experience the comparison and AI valuation features.",
    cta: { label: "Start Free Trial", href: "/free-trial" },
  },
  "paid-version": {
    title: "Upgrade to Paid",
    subtitle:
      "Unlock the full Propomy experience with a paid subscription. Choose a plan that fits your investment portfolio size and analysis needs.",
    steps: [
      {
        heading: "Choose Your Plan",
        body: "Propomy offers Starter, Professional, and Enterprise tiers. Starter is ideal for individual investors managing up to 10 properties. Professional supports unlimited properties with advanced analytics and full Deal Flow tracking. Enterprise includes dedicated support and custom integrations.",
      },
      {
        heading: "Billing & Payment",
        body: "We accept all major credit cards and bank transfers. Subscriptions renew monthly or annually — annual plans come with a 20% discount. All payments are secured with 256-bit SSL encryption.",
      },
      {
        heading: "Manage Your Subscription",
        body: "Upgrade, downgrade, or cancel anytime from your Billing settings page. Changes take effect at the start of your next billing cycle. Unused days are prorated on upgrades.",
      },
      {
        heading: "Team Access",
        body: "Professional and Enterprise plans support multiple user seats. Invite your partners, agents, or analysts to collaborate on your portfolio directly within Propomy.",
      },
    ],
    tip: "Annual subscribers save 20% and get priority customer support with faster response times.",
    cta: { label: "View Pricing", href: "/pricing" },
  },
  dashboard: {
    title: "Your Dashboard",
    subtitle:
      "The Dashboard is your command center — a live overview of your entire real estate portfolio, performance metrics, active deal pipeline, and AI-powered recommendations at a glance.",
    steps: [
      {
        heading: "Portfolio Overview",
        body: "The top section of your dashboard shows aggregate stats: total portfolio value, cumulative ROI, number of active properties, and monthly net cash flow. These numbers update in real time as market data refreshes.",
      },
      {
        heading: "Deal Flow Snapshot",
        body: "Keep an eye on your active acquisition pipeline right from the dashboard. View high-level stage distributions (In Review, Underwriting, Making Offer, Under Contract) and priority alerts.",
      },
      {
        heading: "Recent Activity Feed",
        body: "The activity feed logs every action across your account — newly added properties, updated calculator models, completed valuations, saved comparisons, and AI assistant conversations.",
      },
      {
        heading: "Quick Actions",
        body: "Use the Quick Actions panel to jump directly into adding a property, running a valuation, modeling returns in the updated ROI Calculators, or opening the AI Assistant.",
      },
    ],
    tip: "Pin your top 5 most-watched properties or active pipeline deals to the dashboard for instant price and status tracking.",
  },
  "deal-flow": {
    title: "Deal Flow Pipeline",
    subtitle:
      "Streamline your acquisition workflow. Track leads, analyze target deals, organize stage progression, and collaborate with team members in one dedicated pipeline tool.",
    steps: [
      {
        heading: "Pipeline Kanban Board",
        body: "Organize prospective investment opportunities visual stages: New Lead, Initial Review, Detailed Underwriting, Offer Made, Under Contract, and Closed / Archived. Drag and drop deals as they progress.",
      },
      {
        heading: "Deal Qualification & Scoring",
        body: "Apply customized investment criteria and rule sets to score potential deals automatically. Quickly filter out properties that fail minimum cap rate or cash flow thresholds.",
      },
      {
        heading: "Calculator Integration",
        body: "Run instant underwriting checks by attaching updated ROI and Cash-on-Cash calculator scenarios directly to any deal card in your pipeline.",
      },
      {
        heading: "Document & Task Management",
        body: "Attach purchase agreements, inspection reports, and seller notes to specific deal cards. Assign follow-up tasks and due diligence dates to team members.",
      },
    ],
    tip: "Set up automated task reminders for inspection deadlines and contingency dates on deals in the 'Under Contract' stage.",
  },
  "ai-valuation": {
    title: "AI Valuation",
    subtitle:
      "Propomy's AI Valuation engine uses machine learning trained on millions of real estate transactions to deliver precise, instant property valuations you can trust.",
    steps: [
      {
        heading: "How It Works",
        body: "Our AI model analyzes over 200 property data points — including square footage, lot size, year built, recent comparable sales, neighborhood trends, school ratings, and local economic indicators — to generate a valuation range with a confidence score.",
      },
      {
        heading: "Running a Valuation",
        body: "Navigate to any property in your portfolio or search for an address. Click 'Run AI Valuation' and within seconds you'll receive a detailed valuation report including estimated market value, 12-month forecast, and comparable properties.",
      },
      {
        heading: "Interpreting Results",
        body: "The valuation report shows a low-mid-high range with the AI's most likely estimate highlighted. The confidence score (0–100) reflects data availability in that area. Scores above 80 indicate high reliability.",
      },
      {
        heading: "Valuation History",
        body: "Every valuation is saved to the property's timeline. Track how AI-estimated values have changed over time to identify trends and validate your investment thesis.",
      },
    ],
    tip: "Re-run valuations quarterly or after significant local market events to keep your portfolio data current.",
  },
  "roi-calculator": {
    title: "Enhanced Calculators & ROI",
    subtitle:
      "Model complex financial structures with our updated suite of calculators. Stress-test deals with multi-scenario projections, dynamic expense ratios, refinances, and exit strategies.",
    steps: [
      {
        heading: "Select Your Calculator",
        body: "Choose from specialized analysis models including Long-Term Rental ROI, BRRRR (Buy, Rehab, Rent, Refinance, Repeat), Short-Term / Airbnb Yield, and Commercial Cap Rate models.",
      },
      {
        heading: "Input Advanced Parameters",
        body: "Enter purchase prices, rehab budgets, financing terms, projected rents, dynamic property management fees, capital expenditure reserves (CapEx), and vacancy buffers.",
      },
      {
        heading: "Analyze Key Returns",
        body: "Get instant clarity on Cash-on-Cash (CoC) Return, Internal Rate of Return (IRR), Net Operating Income (NOI), Debt Service Coverage Ratio (DSCR), and monthly net cash flow.",
      },
      {
        heading: "Export & Attach to Deals",
        body: "Export professional PDF underwriting packets for lenders/investors, or attach calculator models directly to your Deal Flow pipeline cards.",
      },
    ],
    tip: "Always budget 5-10% for CapEx and maintenance reserves in your calculator inputs to guard against unexpected repairs.",
  },
  "add-property": {
    title: "Add a Property",
    subtitle:
      "Adding properties to Propomy is fast and flexible. Import via address search, manual entry, or bulk CSV upload for large portfolios.",
    steps: [
      {
        heading: "Search by Address",
        body: "Type any US property address in the search bar. Propomy auto-populates available public record data including bedrooms, bathrooms, square footage, lot size, year built, and last sale price. Confirm the details and click 'Add to Portfolio'.",
      },
      {
        heading: "Manual Entry",
        body: "For off-market or pre-construction properties, use manual entry to input all details yourself. You can still run AI Valuations and ROI calculations on manually entered properties.",
      },
      {
        heading: "Bulk Import",
        body: "On Professional and Enterprise plans, upload a CSV file to add hundreds of properties at once. Download our CSV template from the Add Property page to ensure correct formatting.",
      },
      {
        heading: "Organize with Tags & Lists",
        body: "After adding, tag properties with custom labels like 'Target Market', 'Under Review', or 'Active Rental'. Create lists to group properties by strategy, geography, or investment stage.",
      },
    ],
    tip: "Use the bulk import feature to migrate your existing spreadsheet portfolio into Propomy in minutes.",
  },
  "view-properties": {
    title: "View Properties",
    subtitle:
      "Browse, filter, and analyze your entire portfolio in one unified view. Switch between list, grid, and map layouts depending on how you prefer to work.",
    steps: [
      {
        heading: "List & Grid View",
        body: "The default list view shows all portfolio properties with key stats inline — estimated value, last valuation date, ROI, and tags. Switch to grid view for a card-based layout with property images when available.",
      },
      {
        heading: "Advanced Filtering",
        body: "Filter your portfolio by property type, location, ROI range, valuation confidence score, acquisition date, or custom tags. Combine multiple filters to drill down to exactly the subset you need.",
      },
      {
        heading: "Property Detail Page",
        body: "Click any property to open its full detail page. Here you'll find the complete valuation history, ROI analysis, AI assistant conversation history, comparable properties, and all stored documents.",
      },
      {
        heading: "Comparison Tool",
        body: "Select 2–4 properties and click 'Compare' to view a side-by-side breakdown of all key metrics. Ideal for deciding between investment options or presenting analysis to partners.",
      },
    ],
    tip: "Save your most-used filter combinations as presets to quickly switch between different portfolio views.",
  },
  "map-view": {
    title: "Map View & Property Details",
    subtitle:
      "Explore any property in the United States on an interactive map. Map View surfaces AI valuations, equity insights, and comparable sales at a glance — and links directly to full property records.",
    steps: [
      {
        heading: "Start with Your Location",
        body: "On a fresh session, Map View automatically geolocates and centers the map on your current area. From there, you can search any address in the United States — click 'Search' and the map navigates directly to the property you entered.",
      },
      {
        heading: "Read the Map",
        body: "The address you searched appears as a red pinpoint displaying the AI valuation of that property. Surrounding comparable properties (comps) appear as blue dots, giving you instant visual context of the neighborhood around your target property.",
      },
      {
        heading: "Open the Property Card",
        body: "Click the red pinpoint to open the Property Card. It includes the AI valuation, address, and property details such as bedrooms, bathrooms, square footage, and land area — along with the AVM (low, medium, and high range of what the property could sell for), estimated equity as a percentage, estimated equity in dollars, and average comps for the surrounding area. Please note these figures are estimates.",
      },
      {
        heading: "View Full Property Details",
        body: "Click the address on the Property Card to open the full property detail page. There you'll find the type of residence, ownership information, property characteristics, land and local information, the current mortgage in place, and tax assessment information.",
      },
    ],
    tip: "All valuation, equity, and comp figures shown on the map and property card are estimates — use them as a starting point for your analysis, not a substitute for a formal appraisal.",
  },
  "ai-assistant": {
    title: "AI Assistant",
    subtitle:
      "Your always-available real estate intelligence partner. Ask the AI Assistant anything about your properties, market conditions, investment strategies, or how to use Propomy.",
    steps: [
      {
        heading: "Ask Anything",
        body: "Type natural language questions like 'What's the average cap rate in Austin right now?' or 'Compare the ROI of my top 3 properties' or 'Should I refinance 123 Main St given current rates?'. The AI understands context and gives specific, actionable answers.",
      },
      {
        heading: "Property-Specific Analysis",
        body: "Open any property and start a conversation with the AI about that specific asset. Ask about renovation ROI potential, ideal rent pricing, market timing for sale, or financing strategies. All context about the property is automatically included.",
      },
      {
        heading: "Market Research",
        body: "The AI Assistant has access to current market data and can research neighborhoods, analyze comparable transactions, summarize local economic trends, and identify risk factors for any investment you're considering.",
      },
      {
        heading: "Conversation History",
        body: "All AI conversations are saved and searchable. Review past analysis, reference prior research, and build on previous conversations to develop your investment thesis over time.",
      },
    ],
    tip: "Be specific in your questions — the more context you give the AI, the more targeted and useful its analysis will be.",
  },
  accounts: {
    title: "Account Settings",
    subtitle:
      "Manage your personal profile, notification preferences, team members, and security settings from the Accounts page.",
    steps: [
      {
        heading: "Profile & Preferences",
        body: "Update your name, email, password, and profile photo. Set your default currency, preferred measurement units, and target markets. These preferences personalize your Propomy experience across all features.",
      },
      {
        heading: "Notification Settings",
        body: "Configure which alerts you receive and how. Choose email, in-app, or push notifications for market alerts, valuation updates, portfolio milestones, and system announcements. Set quiet hours so you're not disturbed outside business hours.",
      },
      {
        heading: "Team Management",
        body: "On Professional and Enterprise plans, invite team members and assign roles: Admin (full access), Analyst (view and analyze, no edit), or Custom (granular permission control). Manage active invitations and revoke access anytime.",
      },
      {
        heading: "Security",
        body: "Enable two-factor authentication (2FA) for enhanced account security. Review active sessions and sign out of devices you no longer use. Download your account data export anytime.",
      },
    ],
    tip: "Enable 2FA immediately after signing up — it takes 60 seconds and significantly improves your account security.",
  },
  billing: {
    title: "Billing & Payments",
    subtitle:
      "View invoices, manage your payment method, change your subscription plan, and understand exactly what you're being charged for.",
    steps: [
      {
        heading: "Current Plan & Usage",
        body: "The Billing overview shows your current plan, renewal date, and usage stats (properties added, AI valuations run, API calls if applicable). See exactly where you are relative to any plan limits.",
      },
      {
        heading: "Payment Methods",
        body: "Add, update, or remove credit/debit cards and bank accounts. Set a default payment method for automatic renewal. All payment data is tokenized and never stored directly on Propomy servers — processed by Stripe.",
      },
      {
        heading: "Invoices & History",
        body: "Download PDF invoices for any past payment. Filter invoice history by date range. Invoices include a full breakdown of charges including any add-ons or seat upgrades. Useful for expense reporting and tax purposes.",
      },
      {
        heading: "Upgrade, Downgrade & Cancel",
        body: "Change your plan anytime from the Billing page. Upgrades are prorated and take effect immediately. Downgrades take effect at the next billing cycle. Cancellation stops future charges; you retain access until the end of your paid period.",
      },
    ],
    tip: "Download and save your invoices monthly — they're useful for real estate business expense deductions at tax time.",
  },
};