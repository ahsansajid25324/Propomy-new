import "./../../styles/signup.css";
import "../../App.css";
import logo from "../../assets/logo.png";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const WelcomeForm = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/login");
  };

  return (
    <div>
      <div className="formGeneric-contianer">
        <img src={logo} alt="Logo" className="formGeneric-logo" />

        <h2 className="formGeneric-title">Welcome to Propomy</h2>

        <p className="formGeneric-subtitle">
          Your account has been created successfully.
          <br />
          Please login to continue to your dashboard.
        </p>

        <div className="welcome-btn">
          <Button
            type="button"
            className="btn-welcome"
            onClick={handleRedirect}
          >
            Go to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeForm;
