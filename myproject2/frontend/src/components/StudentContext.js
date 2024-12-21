import React, { createContext } from "react";

// Create an empty context for student data
export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  return (
    <StudentContext.Provider value={{}}>
      {children}
    </StudentContext.Provider>
  );
};
