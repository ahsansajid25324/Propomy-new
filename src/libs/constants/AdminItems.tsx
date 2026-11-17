import type { JSX } from "react";
import { FiGrid, FiBarChart2, FiFilter } from "react-icons/fi";

export interface MenuItem {
  icon: JSX.Element;
  name: string;
  path: string;
  disabled?: boolean;
}

export const adminMenuItems: MenuItem[] = [
  { icon: <FiGrid />, name: "Dashboard", path: "/admin" },
  { icon: <FiBarChart2 />, name: "Weekly Report", path: "/admin/report" },
  {
    icon: <FiFilter />,
    name: "Activation & Funnel",
    path: "/admin/activation-funnel",
  },
];
