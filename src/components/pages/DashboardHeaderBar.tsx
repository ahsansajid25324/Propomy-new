import React, { useState, useRef, useEffect } from "react";
import logo from "../../assets/logo.png";
import { FiMenu } from "react-icons/fi";
import { ProfileSettingsModal } from "../common/PropertySettingsModal";
import { ChangePasswordModal } from "../common/ChangePasswordModal";
import { useFeatureFlags } from "../../hooks/useFeatureFlag";
interface DashboardHeaderBarProps {
  setMobileSidebarOpen: (open: boolean) => void;
}

const DashboardHeaderBar: React.FC<DashboardHeaderBarProps> = ({
  setMobileSidebarOpen,
}) => {
  // Pull our user data and direct flags from the global hook
  const { user, canSeeCredits, canSeeUserMenu } = useFeatureFlags();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        (!desktopRef.current || !desktopRef.current.contains(target)) &&
        (!mobileRef.current || !mobileRef.current.contains(target))
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const apiLimit = user?.apiLimit ?? 0;
  
  const badgeClass = React.useMemo(() => {
    if (apiLimit === 0) return "credits-badge empty";
    if (apiLimit < 5) return "credits-badge low";
    return "credits-badge";
  }, [apiLimit]);

  const avatarUrl = React.useMemo(() => {
    const initials = (user?.firstName?.trim()?.[0] || "") + (user?.lastName?.trim()?.[0] || "");
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=0066ff&color=fff&size=128`;
  }, [user?.firstName, user?.lastName]);

  const Brand = () => (
    <div className="d-flex align-items-center gap-1">
      <img src={logo} className="dashboard-logo" alt="Propomy Logo" />
      <span className="dashboard-title">Propomy</span>
    </div>
  );

  const UserMenu = ({ isMobile = false, menuRef }: { isMobile?: boolean; menuRef: React.RefObject<HTMLDivElement | null> }) => (
    <div className="avatar-wrapper" ref={menuRef}>
      <img
        src={avatarUrl}
        alt="User Profile"
        className="user-avatar"
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation();
          setDropdownOpen((prev) => !prev);
        }}
      />
      {dropdownOpen && (
        <div className={`avatar-dropdown ${isMobile ? "mobile" : ""}`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setProfileModalOpen(true);
              setDropdownOpen(false);
            }}
            className="dropdown-item"
          >
            Profile Settings
          </button>
          <div className="dropdown-divider" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPasswordModalOpen(true);
              setDropdownOpen(false);
            }}
            className="dropdown-item"
          >
            Change Password
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Header */}
      <header className="header desktop-header">
        <Brand />
        <div className="header-actions">
          {canSeeCredits && (
            <div className="credits-display">
              <span className="credits-label">Credits</span>
              <div className={badgeClass}>
                <span className="credits-count">{apiLimit}</span>
              </div>
            </div>
          )}
          {canSeeUserMenu && <UserMenu menuRef={desktopRef} />}
        </div>
      </header>

      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="w-100 d-flex flex-column gap-3">
          <div className="d-flex align-items-center justify-content-between">
            <Brand />
            <div className="d-flex align-items-center gap-2">
              {canSeeUserMenu && <UserMenu isMobile menuRef={mobileRef} />}
              <button
                className="menu-btn"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Open Menu"
              >
                <FiMenu />
              </button>
            </div>
          </div>

          {canSeeCredits && (
            <div className="mobile-credits-container">
              <div className={badgeClass}>
                <span className="credits-label-sm">API Credits</span>
                <span className="credits-count">{apiLimit}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {profileModalOpen && (
        <ProfileSettingsModal open={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
      )}
      {passwordModalOpen && (
        <ChangePasswordModal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} />
      )}
    </>
  );
};

export default DashboardHeaderBar;