// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { StudentProvider } from "./components/StudentContext"; // Import the provider
import { ProjectsProvider } from "./components/ProjectsContext"; // Import ProjectsProvider

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <StudentProvider>
        <ProjectsProvider>
          <App />
        </ProjectsProvider>
      </StudentProvider>
    </Router>
  </React.StrictMode>
);