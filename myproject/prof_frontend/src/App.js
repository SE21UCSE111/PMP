import React, { useState } from "react";
import { ProjectsProvider } from "./components/ProjectsContext";  // Import ProjectsProvider
import ProjectsPage from "./components/ProjectsPage";
import ProfessorHomePage from "./components/ProfessorHomePage";
import TeamDashboard from "./components/TeamDashboard";
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  return (
    <ProjectsProvider>
      <div>
        {currentPage === "home" && <ProfessorHomePage onNavigate={handleNavigation} />}
        {currentPage === "projects" && (
          <ProjectsPage onNavigate={handleNavigation} />
        )}
        {currentPage === "dashboard" && <TeamDashboard onNavigate={handleNavigation} />}
      </div>
    </ProjectsProvider>
  );
}

export default App;
