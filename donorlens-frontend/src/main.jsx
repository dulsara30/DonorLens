import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App.jsx";
import { AuthProvider } from "./state/AuthContext.jsx";
// Redux Setup
import { Provider } from "react-redux";
import store from "./store";

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
