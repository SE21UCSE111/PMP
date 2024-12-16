import React from "react";
import './TeamDashboard.css';
function TeamDashboard({ onNavigate }) {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Team Dashboard</h1>
      <button onClick={() => onNavigate("home")}>Back to Home</button>
      <div style={{ marginTop: "20px" }}>
        <button>Grade</button>
        <button style={{ marginLeft: "10px" }}>View Submission</button>
        <button style={{ marginLeft: "10px" }}>Create To-Do List</button>
      </div>
    </div>
  );
}

export default TeamDashboard;
