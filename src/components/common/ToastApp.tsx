import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const AppToast = () => (
  <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />
);

export default AppToast;