import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App.jsx";
import { AuthProvider } from "./state/AuthContext.jsx";
// Redux Setup
import { Provider } from "react-redux";
import store from "./store";
import "leaflet/dist/leaflet.css";
import "react-toastify/dist/ReactToastify.css";

import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Redux Provider wraps entire app - makes store available to all components */}
    <Provider store={store}>
      {/* Auth Provider manages authentication state */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </StrictMode>,
);
