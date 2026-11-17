import {
  FaListUl,
  FaCheckCircle,
  FaDollarSign,
  FaTrophy,
} from "react-icons/fa";
import { formatCompactCurrency } from "../../utils/formatConversion";

export interface DealStatsArgs {
  activeDealsCount: number;
  underContractDealsCount: number;
  activePipelineValue: number;
  closedDealsCount: number;
}

export interface DealStatItem {
  label: string;
  value: string | number;
  subLabel: string;
  icon: React.ReactNode;
}

const iconStyle: React.CSSProperties = {
  background: "#E7EBFF",
  borderRadius: "50%",
  padding: "6px",
  fontSize: "32px",
};

export const getDealStats = ({
  activeDealsCount,
  underContractDealsCount,
  activePipelineValue,
  closedDealsCount,
}: DealStatsArgs): DealStatItem[] => [
  {
    label: "Active Deals",
    value: activeDealsCount,
    subLabel: "Not closed or dead",
    icon: <FaListUl className="stat-icon" color="#2150FE" style={iconStyle} />,
  },
  {
    label: "Under Contract",
    value: underContractDealsCount,
    subLabel: "In closing process",
    icon: (
      <FaCheckCircle className="stat-icon" color="#2150FE" style={iconStyle} />
    ),
  },
  {
    label: "Active Pipeline Value",
    value: formatCompactCurrency(activePipelineValue),
    subLabel: "Sum of active acquisition costs",
    icon: (
      <FaDollarSign className="stat-icon" color="#2150FE" style={iconStyle} />
    ),
  },
  {
    label: "Closed Deals",
    value: closedDealsCount,
    subLabel: "All time",
    icon: <FaTrophy className="stat-icon" color="#2150FE" style={iconStyle} />,
  },
];
