import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { StudentProvider } from "./components/StudentContext";
import { ProjectsProvider } from "./components/ProjectsContext";
import HomePage from "./components/HomePage";
import SignUpLogin from "./components/SignUpLogin"; 
import ProjectDashboard from "./components/ProjectDashboard";
import ProjectList from "./components/ProjectList";
import ProfessorHomePage from "./components/ProfessorHomePage";
import TeamDashboard from "./components/TeamDashboard";
import CombinedPage from "./components/CombinedPage"; 
import ProjectsPage from "./components/ProjectsPage"; 

import './styles.css';

function App() {
  const navigate = useNavigate();  // Get navigate function from react-router-dom

  return (
    <StudentProvider>
      <ProjectsProvider>
        <div>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<SignUpLogin />} />
            <Route path="/student" element={<HomePage />} />
            <Route path="/professor" element={<ProfessorHomePage onNavigate={navigate} />} />
            <Route path="/project_creation" element={<ProjectsPage onNavigate={navigate} />} />
            <Route path="/projects/:username" element={<ProjectList />} />
            <Route path="/dashboard/:projectId" element={<ProjectDashboard />} />
            <Route path="/team-dashboard" element={<TeamDashboard />} />
            <Route path="/professors" element={<CombinedPage />} />
          </Routes>
        </div>
      </ProjectsProvider>
    </StudentProvider>
  );
}

export default App;
