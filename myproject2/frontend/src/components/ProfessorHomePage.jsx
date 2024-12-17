import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './ProfessorHomePage.css';

function ProfessorHomePage() {
  const location = useLocation(); // Get the location object
  const initialName = location.state?.name || "Professor"; // Default to "Professor" if name is not provided
  const [professorName, setProfessorName] = useState(localStorage.getItem('professorName') || initialName); // Store professor's name in state
  const navigate = useNavigate(); // Use useNavigate hook to navigate

  const [teams, setTeams] = useState([]);

  const handleTeamClick = () => {
    navigate("dashboard");
  };

  // Function to add a new team
  const addTeam = () => {
    const newTeam = { name: "Team C", project: "Project 3" }; // Example new team
    setTeams([...teams, newTeam]); // Add the new team to the list
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        credentials: 'include',  // Necessary for CSRF token
        headers: {
          'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1] // Include CSRF token from cookies
        }
      });

      if (response.ok) {
        alert('Logout successful.');
        localStorage.removeItem('professorName'); // Remove name from local storage on logout
        navigate('/');  // Redirect to the homepage
      } else {
        alert('Logout failed.');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    // Update local storage whenever professorName changes
    localStorage.setItem('professorName', professorName);
  }, [professorName]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Hi {professorName}</h1> {/* Display the username */}
      <button onClick={() => navigate("/project_creation")}>My Projects</button>
      <button onClick={handleLogout} style={{ padding: "10px", width: "220px" }}>
        Logout
      </button>

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
