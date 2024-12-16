import React, { createContext, useContext, useState } from "react";

// Create context
const ProjectsContext = createContext();

// Custom hook to use the context
export const useProjects = () => {
  return useContext(ProjectsContext);
};

// Provider component to wrap around your app or component tree
export const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);

  const addProject = (project) => {
    setProjects((prevProjects) => [...prevProjects, project]);
  };

  return (
    <ProjectsContext.Provider value={{ projects, addProject }}>
      {children}
    </ProjectsContext.Provider>
  );
};
