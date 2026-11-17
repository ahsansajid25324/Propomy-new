import {
  FaListAlt,
  FaBuilding,
  FaCalculator,
  FaInfoCircle,
  FaShareAlt,
} from "react-icons/fa";

export const normalActions = [
  { label: "Add to Smart List", icon: <FaListAlt /> },
  { label: "View Rental Comps", icon: <FaBuilding /> },
  { label: "Run Valuation", icon: <FaCalculator /> },
  { label: "View Property Details", icon: <FaInfoCircle /> },
  { label: "Share Property", icon: <FaShareAlt /> },
];

export const valuationActions = [
  {
    label: "Run Re-valuation",
    icon: <FaCalculator />,
  },
  {
    label: "Generate Action Plan",
    icon: <FaListAlt />,
  },
  {
    label: "Schedule Site Visit",
    icon: <FaBuilding />,
  },
  {
    label: "Flag High-Risk Assets",
    icon: <FaInfoCircle />,
  },
];