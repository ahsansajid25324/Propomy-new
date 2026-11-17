import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { FiLogOut } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/client/react";
import { LOGOUT_MUTATION } from "../../apollo/graphql/mutations/logout";
import { logout } from "../../features/auth/authSlice";
import { investorMenuItems } from "../../libs/constants/InvesterSideBarItems";
import { realtorMenuItems } from "../../libs/constants/RealtorSideBarItems";
import { adminMenuItems } from "../../libs/constants/AdminItems";
import { toast } from "react-toastify";
import { getPosthog } from "../../libs/posthog";
interface SidebarProps {
  role: "investor" | "realtor" | "admin";
}
interface LogoutResponse {
  success: boolean;
  message: string;
  logoutUrl?: string | null;
}

interface LogoutMutationData {
  logout: LogoutResponse;
}
const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [logoutMutation, { loading }] =
    useMutation<LogoutMutationData>(LOGOUT_MUTATION);

  const menu =
    role === "investor"
      ? investorMenuItems
      : role === "realtor"
        ? realtorMenuItems
        : adminMenuItems;

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { data } = await logoutMutation();

      if (data?.logout.logoutUrl) {
        dispatch(logout());
        getPosthog().then((posthog) => posthog.reset());
        toast.success(data.logout.message || "Logged out successfully");
        localStorage.removeItem("ai_session_id");
        localStorage.removeItem("ai_chat_history");
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.error("Logout failed", err);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-set-logo">
        <div className="d-flex px-2 align-items-center gap-1">
          <img src={logo} className="dashboard-logo" />
          <span className="dashboard-title">Propomy</span>
        </div>
      </div>
      <nav className="sidebar-nav mt-3 mt-md-0">
        <ul>
          {menu.map((item, index) => {
            const isActive = location.pathname === item.path;
            const isDisabled = item.disabled;
            return (
              <li
                key={index}
                className={`${isActive ? "active" : ""} ${isDisabled ? "disabled-item" : ""}`}
              >
                {isDisabled ? (
                  <div className="sidebar-link-content">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                ) : (
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <div className="logout-container">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="logout-btn"
          >
            <FiLogOut className="logout-icon" />
            <span>{loading ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
