import React from "react";
import { useParams } from "react-router-dom";

function ProjectDashboard() {
  const { projectId } = useParams();

  const handleViewGrade = () => {
    alert(`Viewing grades for project ID: ${projectId}`);
  };

  const handleMakeSubmission = () => {
    alert(`Making a submission for project ID: ${projectId}`);
  };

  const handleViewToDoList = () => {
    alert(`Viewing To-Do list for project ID: ${projectId}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Project Dashboard</h1>
      <h2>Project ID: {projectId}</h2>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleViewGrade}
          style={{
            padding: "10px 20px",
            margin: "10px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          View Grade
        </button>

        <button
          onClick={handleMakeSubmission}
          style={{
            padding: "10px 20px",
            margin: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Make Submission
        </button>

        <button
          onClick={handleViewToDoList}
          style={{
            padding: "10px 20px",
            margin: "10px",
            backgroundColor: "#ffc107",
            color: "#000",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Check/View To-Do List
        </button>
      </div>
    </div>
  );
}

export default ProjectDashboard;
