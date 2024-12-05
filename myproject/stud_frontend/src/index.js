import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { StudentProvider } from "./components/StudentContext"; // Import the provider

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <StudentProvider> {/* Wrap with StudentProvider */}
        <App />
      </StudentProvider>
    </Router>
  </React.StrictMode>
);
