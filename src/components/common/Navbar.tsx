import logo from "../../assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Home.css";
import "../../styles/navbar.css";
import MobileNavbar from "./MobileNavbar";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const nav = useNavigate();

  return (
    <>
      <nav className="navbar navbar-expand-lg hero-navbar hide-on-mobile">
        <div className="container d-flex align-items-center justify-content-between">
          {/* Logo Section */}
          <div
            className="brand-link"
            style={{ cursor: "pointer" }}
            onClick={() => nav("/")}
          >
            <img
              src={logo}
              alt="Propomy Logo"
              style={{ height: 36, width: 36 }}
            />
            <span className="brand-title">Propomy</span>
          </div>
        </div>
      </nav>

      <div className="show-on-mobile">
        <MobileNavbar />
      </div>
    </>
  );
};

export default Navbar;
