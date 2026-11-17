import type { JSX } from "react";
import {
  FiGrid,
  FiHome,
  FiUsers,
  FiMessageSquare,
  FiPlusCircle,
} from "react-icons/fi";

export interface MenuItem {
  icon: JSX.Element;
  name: string;
  path: string;
  disabled?: boolean;
}
export const realtorMenuItems: MenuItem[] = [
  { icon: <FiGrid />, name: "Dashboard", path: "/realtor" },
  {
    icon: <FiHome />,
    name: "My Listings",
    path: "/realtor/listings",
  },
  {
    icon: <FiUsers />,
    name: "Leads",
    path: "/realtor/leads",
  },
  {
    icon: <FiPlusCircle />,
    name: "Add Listing",
    path: "/realtor/add-listing",
  },
  {
    icon: <FiMessageSquare />,
    name: "Messages",
    path: "/realtor/messages",
  },
];
