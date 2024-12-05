import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfessorHomePage.css";

function ProfessorHomePage({ onNavigate }) {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [username, setUsername] = useState(""); // State to hold the username

  // Fetch the username from the backend (Django)
  useEffect(() => {
    fetch("/api/professor_data/") // Replace with your actual API endpoint for professor data
      .then((response) => response.json())
      .then((data) => {
        if (data.username) {
          setUsername(data.username); // Set the username when fetched
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleLogout = () => {
    // Send a request to the Django backend to log out the user
    fetch("/logout/", {
      method: "POST", // or 'GET' depending on your logout method
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        // After logout, redirect to the login page
        window.location.href = '/';  // This will redirect to Django's login page
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  const handleTeamClick = () => {
    onNavigate("dashboard");
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Display the professor's username */}
      <h1>Welcome, {username}!</h1>

      {/* Log Out button */}
      <button
        onClick={handleLogout}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#FF4C4C",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Log Out
      </button>

      {/* Navigation buttons */}
      <button onClick={() => onNavigate("projects")}>My Projects</button>

      {/* Team display */}
      <div style={{ marginTop: "20px" }}>
        {teams.length === 0 ? (
          <p>No Teams :(</p>
        ) : (
          teams.map((team, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                cursor: "pointer",
              }}
              onClick={handleTeamClick}
            >
              <p>Team Name: {team.name}</p>
              <p>Project Name: {team.project}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProfessorHomePage;
