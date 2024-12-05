import React, { createContext, useState } from "react";

// Create a context for student data
export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [studentProjects, setStudentProjects] = useState([]);

  // Function to add a project to the student's list
  const addStudentProject = (project) => {
    setStudentProjects((prevProjects) => [...prevProjects, project]);
  };

  return (
    <StudentContext.Provider value={{ studentProjects, addStudentProject }}>
      {children}
    </StudentContext.Provider>
  );
};
