import type { UserPropertyStats } from "../../types/investor";
import { FaStar, FaDollarSign } from "react-icons/fa";
import { MdApartment } from "react-icons/md";

export const getDynamicStats = (stats: Partial<UserPropertyStats>) => [
  {
    label: "Total Properties",
    value: stats.totalProperties ?? 0,
    subLabel: "Owned",
    icon: (
      <MdApartment
        className="stat-icon"
        color="#2150FE"
        style={{ background: "#E7EBFF", borderRadius: "50%", padding: "6px" }}
      />
    ),
  },
  {
    label: "Average ROI",
    value: stats.avgROI ? `${stats.avgROI.toFixed(2)}%` : "0%",
    subLabel: "Return on Investment",
    icon: (
      <FaStar
        className="stat-icon"
        color="#2150FE"
        style={{ background: "#E7EBFF", borderRadius: "50%", padding: "6px" }}
      />
    ),
  },
  {
    label: "Avg Cap Rate",
    value: stats.avgCapRate ? `${stats.avgCapRate.toFixed(2)}%` : "0%",
    subLabel: "Capitalization Rate",
    icon: (
      <FaStar
        className="stat-icon"
        color="#2150FE"
        style={{ background: "#E7EBFF", borderRadius: "50%", padding: "6px" }}
      />
    ),
  },
  {
    label: "Cash on Cash",
    value: stats.avgCashOnCashReturn
      ? `${stats.avgCashOnCashReturn.toFixed(2)}%`
      : "0%",
    subLabel: "Return",
    icon: (
      <FaDollarSign
        className="stat-icon"
        color="#2150FE"
        style={{ background: "#E7EBFF", borderRadius: "50%", padding: "6px" }}
      />
    ),
  },
];
