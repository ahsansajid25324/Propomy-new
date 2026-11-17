import "../../App.css";
import Logo from "../../assets/logo.png";
const AppLoader = () => {
  return (
    <div className="app-loader">
      <div className="loader-card">
        <img src={Logo} alt="Loading" className="loader-logo" />

        <div className="spinner" />
        <p className="loader-text">Loading your experience…</p>
      </div>
    </div>
  );
};

export default AppLoader;
