import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './ProfessorHomePage.css';

function ProfessorHomePage() {
  const location = useLocation();
  const initialName = location.state?.name || "Professor";
  const [professorName] = useState(localStorage.getItem('professorName') || initialName);
  const navigate = useNavigate(); // Use useNavigate hook

  const [projects, setProjects] = useState([]);

  const handleProjectClick = (project) => {
    // Pass the team_id along with project details to the TeamDashboard component
    navigate("/team-dashboard", { state: { project, teamId: project.teams[0].id } }); // assuming each project has a teams array with an id
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1]
        }
      });

      if (response.ok) {
        alert('Logout successful.');
        localStorage.removeItem('professorName');
        navigate('/'); // Redirect to homepage
      } else {
        alert('Logout failed.');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/professor_teams/', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();

        if (data.status === "success") {
          setProjects(data.projects); 
        } else {
          alert("Failed to fetch projects.");
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    
    fetchProjects();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Hi {professorName}</h1>
      <button onClick={() => navigate("/project_creation")}>My Projects</button>
      <button onClick={handleLogout} style={{ padding: "10px", width: "220px" }}>
        Logout
      </button>

      <div style={{ marginTop: "20px" }}>
        {projects.length === 0 ? (
          <p>No Projects :(</p>
        ) : (
          projects.map((project, index) => (
            <div
              key={index}
              onClick={() => handleProjectClick(project)}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                cursor: "pointer",
              }}
            >
              <h3>{project.project_name}</h3>
              {project.teams.map((team, teamIndex) => (
                <div
                  key={teamIndex}
                  style={{
                    border: "1px solid #ddd",
                    padding: "5px",
                    marginBottom: "5px",
                  }}
                >
                  <p>Members: {team.members.join(", ")}</p>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProfessorHomePage;
