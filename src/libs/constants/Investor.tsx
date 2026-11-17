import { FaStar, FaDollarSign, FaChartPie, FaShieldAlt } from "react-icons/fa";
import { MdLeaderboard, MdPerson } from "react-icons/md";
import Property from "../../assets/Property.png";
import { FaChartLine, FaArrowUp } from "react-icons/fa";

export const portfolioStatCardData = [
  {
    value: "31000 $",
    label: "Overall Portfolio Value",
    subLabel: "10% Increase from last week",
    icon: (
      <FaStar
        className="stat-icon"
        color="#2150FE"
        style={{ background: "#E7EBFF", borderRadius: "50%", padding: "6px" }}
      />
    ),
  },
  {
    value: "+13.4 %",
    label: "Cap Rate",
    subLabel: "Annual ROI Growth",
    icon: (
      <FaDollarSign
        className="stat-icon"
        color="#2150FE"
        style={{ background: "#E7EBFF", borderRadius: "50%", padding: "6px" }}
      />
    ),
  },
  {
    value: "82 / 100",
    label: "Diversification Score",
    subLabel: "10% Increase from last week",
    icon: (
      <FaChartPie
        className="stat-icon"
        color="#2150FE"
        style={{ background: "#E7EBFF", borderRadius: "50%", padding: "6px" }}
      />
    ),
  },
  {
    value: "Low Index",
    label: " Stability Index",
    subLabel: "3 new listing in this week",
    icon: (
      <FaShieldAlt
        className="stat-icon"
        color="#2150FE"
        style={{ background: "#E7EBFF", borderRadius: "50%", padding: "6px" }}
      />
    ),
  },
];

export const aiValuationStatCardData = [
  {
    value: "87 / 100",
    label: "AI Valuation Score",
    subLabel: "10% Increase from last week",
    icon: (
      <MdLeaderboard
        className="stat-icon"
        color="#2150FE"
        style={{ background: "#E7EBFF", borderRadius: "50%", padding: "6px" }}
      />
    ),
  },
  {
    value: "92 %",
    label: "Predictive Accuracy",
    subLabel: "10% Increase from last week",
    icon: (
      <FaChartLine
        className="stat-icon"
        color="#2150FE"
        style={{ background: "#E7EBFF", borderRadius: "50%", padding: "6px" }}
      />
    ),
  },
  {
    value: "4 Actions",
    label: "Recomendations",
    subLabel: "10% Increase from last week",
    icon: (
      <MdPerson
        className="stat-icon"
        color="#2150FE"
        style={{ background: "#E7EBFF", borderRadius: "50%", padding: "6px" }}
      />
    ),
  },
  {
    value: "High",
    label: "Model Confidence",
    subLabel: "1 new listing in this week",
    icon: (
      <FaArrowUp
        className="stat-icon"
        color="#2150FE"
        style={{ background: "#E7EBFF", borderRadius: "50%", padding: "6px" }}
      />
    ),
  },
];

export const rentalEstimatesStatCardData = [
  {
    value: "$ 2150",
    label: "Estimated Monthly Rent",
    subLabel: "10% Increase from last week",
    icon: (
      <FaDollarSign
        className="stat-icon"
        color="#2150FE"
        style={{ background: "#E7EBFF", borderRadius: "50%", padding: "6px" }}
      />
    ),
  },
  {
    value: "89 %",
    label: "Rent Confidence",
    subLabel: "10% Increase from last week",
    icon: (
      <FaShieldAlt
        className="stat-icon"
        color="#2150FE"
        style={{ background: "#E7EBFF", borderRadius: "50%", padding: "6px" }}
      />
    ),
  },
  {
    value: "4.2 %",
    label: "Local Vacancy Rate",
    subLabel: "10% Increase from last week",
    icon: (
      <FaChartLine
        className="stat-icon"
        color="#2150FE"
        style={{ background: "#E7EBFF", borderRadius: "50%", padding: "6px" }}
      />
    ),
  },
  {
    value: "47 / 100",
    label: "Demand Score",
    subLabel: "1 new listing in this week",
    icon: (
      <MdLeaderboard
        className="stat-icon"
        color="#2150FE"
        style={{ background: "#E7EBFF", borderRadius: "50%", padding: "6px" }}
      />
    ),
  },
];

export const recentValuationsData = [
  { property: "ABC Property", result: "$420,000", date: "Aug 12, 2025" },
  { property: "XYZ Property", result: "$420,000", date: "Oct 13, 2025" },
  { property: "EFG Property", result: "$420,000", date: "Oct 13, 2025" },
  { property: "KKR Property", result: "$410,000", date: "Oct 20, 2025" },
];

export const savedPropertiesData = [
  {
    name: "Project Name",
    location: "Location",
    rating: 18,
    image: Property,
  },
  {
    name: "Project Name",
    location: "Location",
    rating: 18,
    image: Property,
  },
];

export const data = [
  { name: "Residential", value: 45 },
  { name: "Commercial", value: 30 },
  { name: "Multi-Family", value: 15 },
  { name: "Short-term Rentals", value: 10 },
];

export const COLORS = ["#7F56D9", "#5388D8", "#66D9EF", "#EEA69D"];
export const roiData = [
  { name: "2021", value: 4 },
  { name: "2022", value: 11 },
  { name: "2023", value: 14 },
];
export const portfolioGrowthData = [
  { month: "Jan", value: 120000 },
  { month: "Feb", value: 105000 },
  { month: "March", value: 70000 },
  { month: "April", value: 125000 },
  { month: "May", value: 74000 },
  { month: "June", value: 136000 },
];
