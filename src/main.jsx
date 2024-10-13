import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./redux/store";
import "../src/index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GlobalSnackbar from "./components/GlobalSnackbar";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLOUD_ID}>
    <Provider store={store}>
      <App />
      <GlobalSnackbar />
    </Provider>
  </GoogleOAuthProvider>
);
