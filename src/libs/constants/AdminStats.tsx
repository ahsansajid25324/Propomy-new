import { FaUsers, FaUserCheck } from "react-icons/fa";

interface AdminStatsArgs {
  totalUsers?: number;
  paidUsers?: number;
}
export const getAdminStats = ({
  totalUsers = 0,
  paidUsers = 0,
}: AdminStatsArgs = {}) => [
  {
    label: "Total Users",
    value: totalUsers,
    subLabel: "Registered",
    icon: (
      <FaUsers
        className="stat-icon"
        color="#2150FE"
        style={{
          background: "#E7EBFF",
          borderRadius: "50%",
          padding: "4px",
          fontSize: "32px",
        }}
      />
    ),
  },
  {
    label: "Paid Users",
    value: paidUsers,
    subLabel: "Premium",
    icon: (
      <FaUserCheck
        className="stat-icon"
        color="#10B981"
        style={{
          background: "#ECFDF5",
          borderRadius: "50%",
          padding: "4px",
          fontSize: "32px",
        }}
      />
    ),
  },
];
