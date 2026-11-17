import logo from "../../assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Home.css";
import "../../styles/navbar.css";

const MobileNavbar = () => {
  return (
    <>
      {/* Mobile Top Bar */}
      <nav className="mobile-navbar d-flex align-items-center justify-content-between px-3">
        <div
          className="d-flex align-items-center gap-1"
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="Propomy Logo" className="mobile-logo" />
          <span className="brand-title-text">Propomy</span>
        </div>
      </nav>
    </>
  );
};

export default MobileNavbar;
