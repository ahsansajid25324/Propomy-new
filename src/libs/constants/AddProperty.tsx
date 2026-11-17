import { type PropertyFormData } from "../../schemas/Property";

interface FieldConfig {
  label: string;
  name: keyof PropertyFormData;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  options?: { label: string; value: string }[];
}

export const PropertyFormSection = [
  {
    title: "Portfolio Property",
    fields: [
      {
        label: "Property Address*",
        name: "address",
        placeholder: "Start typing address...",
      },
      {
        label: "Status*",
        name: "status",
        options: [
          { label: "Owned", value: "Owned" },
          { label: "Under Contract", value: "UnderContract" },
          { label: "Watchlist", value: "Watchlist" },
        ],
      },
    ] as FieldConfig[],
  },
  {
    title: "Acquisition Assumptions",
    fields: [
      { label: "Purchase Price*", name: "purchasePrice", type: "number" },
      { label: "Down Payment", name: "downPayment", type: "number" },
      {
        label: "Loan Amount",
        name: "loanAmount",
        type: "number",
        disabled: true,
      },
      {
        label: "Interest Rate %",
        name: "interestRate",
        type: "number",
        placeholder: "e.g. 6.5",
      },
      {
        label: "Loan Term (Years)",
        name: "loanTermYears",
        type: "number",
        placeholder: "30",
      },
      { label: "Closing Costs", name: "closingCosts", type: "number" },
      { label: "Rehab Costs", name: "rehabCosts", type: "number" },
    ] as FieldConfig[],
  },
  {
    title: "Income & Expenses",
    fields: [
      { label: "Monthly Rent*", name: "monthlyRent", type: "number" },
      { label: "Annual Taxes", name: "taxesAnnual", type: "number" },
      {
        label: "Annual Insurance",
        name: "insuranceAnnual",
        type: "number",
      },
      { label: "HOA (Monthly)", name: "hoaMonthly", type: "number" },
      {
        label: "Maintenance (%)",
        name: "maintenancePercent",
        type: "number",
        placeholder: "5",
      },
      {
        label: "Vacancy (%)",
        name: "vacancyPercent",
        type: "number",
        placeholder: "8",
      },
      {
        label: "Property Management (%)",
        name: "propertyMgmtPercent",
        type: "number",
        placeholder: "10",
      },
      {
        label: "Utilities (Monthly)",
        name: "utilitiesMonthly",
        type: "number",
      },
    ] as FieldConfig[],
  },
  {
    title: "Valuation Snapshot",
    fields: [
      { label: "AVM Low", name: "avmLow", type: "number", disabled: true },
      { label: "AVM Mid", name: "avmMid", type: "number", disabled: true },
      {
        label: "AVM High",
        name: "avmHigh",
        type: "number",
        disabled: true,
      },
    ] as FieldConfig[],
  },
];
