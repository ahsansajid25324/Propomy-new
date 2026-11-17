import type { JSX } from "react";
import {
  FiGrid,
  FiMap,
  FiCpu,
  FiHome,
  FiUser,
  FiEye,
  FiBriefcase,
  FiPlusCircle,
  FiTrendingUp,
} from "react-icons/fi";
import { LuCalculator, LuBot } from "react-icons/lu";

interface MenuItem {
  icon: JSX.Element;
  name: string;
  path: string;
  disabled?: boolean;
}

export const investorMenuItems: MenuItem[] = [
  { icon: <FiGrid />, name: "Dashboard", path: "/investor" },

  { icon: <FiCpu />, name: "AI Valuation", path: "/investor/ai-valuation" },

  { icon: <FiTrendingUp />, name: "Valuations", path: "/investor/valuations" },

    { icon: <FiBriefcase />, name: "Deal Flow", path: "/investor/deal-flow" },
  {
    icon: <LuCalculator />,
    name: "Calculators",
    path: "/investor/calculators",
  },

  {
    icon: <FiPlusCircle />,
    name: "Add Property",
    path: "/investor/add-property",
  },
  {
    icon: <FiEye />,
    name: "View Properties",
    path: "/investor/view-properties",
  },
  { icon: <FiMap />, name: "Map View", path: "/investor/map-view" },

  {
    icon: <FiUser />,
    name: "Accounts",
    path: "/investor/accounts",
  },
  {
    icon: <LuBot />,
    name: "AI Assistant",
    path: "/investor/ai-assistant",
  },
  {
    icon: <FiHome />,
    name: "Rental Estimator (Coming Soon)",
    path: "/ai-assistant",
    disabled: true,
  },
];
