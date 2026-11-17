// import "bootstrap/dist/css/bootstrap.min.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
import { HelmetProvider } from "react-helmet-async";
// import "react-toastify/dist/ReactToastify.css";
//
import App from "./App.tsx";
// import { store, persistor } from "./store/store.ts";

// 1. Recover gracefully from stale asset chunks after new deployments
window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  window.location.reload();
});

const rootElement = document.getElementById("root")!;

createRoot(rootElement).render(
  <StrictMode>
    <HelmetProvider>
      {/* <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}> */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
      {/* </PersistGate>
      </Provider> */}
    </HelmetProvider>
  </StrictMode>,
);
