import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaHome,
} from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";
export const propertyDetailsConfig = [
  { label: "Bedrooms", icon: <FaBed />, key: "bedrooms" },
  { label: "Bathrooms", icon: <FaBath />, key: "bathrooms" },
  {
    label: "Living Sqft",
    icon: <FaRulerCombined />,
    key: "livingSquareFeet",
  },
  { label: "Zip Code", icon: <FaMapMarkerAlt />, key: "zipCode" },
  { label: "Year Built", icon: <MdCalendarToday />, key: "yearBuilt" },
  { label: "Property Type", icon: <FaHome />, key: "landUse" },
] as const;
