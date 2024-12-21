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

  const handleDeclineTeam = async (teamId) => {
    try {
      // Send the team_id in the request body
      const response = await fetch('http://localhost:8000/api/decline_team/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1], // CSRF token
        },
        credentials: 'include',
        body: JSON.stringify({ team_id: teamId }), // Send team_id in the request body
      });
  
      if (response.ok) {
        alert('Team declined successfully.');
        window.location.reload();  // Reload the page to reflect the changes
      } else {
        alert('Failed to decline the team.');
      }
    } catch (error) {
      console.error('Error declining the team:', error);
    }
  };
  
  const handleAcceptTeam = (teamId, projectId) => {
    // Save accepted team to localStorage
    const acceptedTeams = JSON.parse(localStorage.getItem('acceptedTeams')) || [];
    const newAcceptedTeam = { teamId, projectId };
    if (!acceptedTeams.some((team) => team.teamId === teamId && team.projectId === projectId)) {
      acceptedTeams.push(newAcceptedTeam);
      localStorage.setItem('acceptedTeams', JSON.stringify(acceptedTeams));
    }

    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === projectId) { // Check for the correct project
          return {
            ...project,
            teams: project.teams.map((team) =>
              team.id === teamId ? { ...team, hideButtons: true } : team // Target specific team
            ),
          };
        }
        return project;
      })
    );
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
          const acceptedTeams = JSON.parse(localStorage.getItem('acceptedTeams')) || [];

          // Update the projects state based on accepted teams
          const updatedProjects = data.projects.map((project) => ({
            ...project,
            teams: project.teams.map((team) => {
              // Check if this team is accepted, if so hide the buttons
              const isAccepted = acceptedTeams.some((acceptedTeam) =>
                acceptedTeam.teamId === team.id && acceptedTeam.projectId === project.id
              );
              return isAccepted ? { ...team, hideButtons: true } : team;
            }),
          }));

          setProjects(updatedProjects); 
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
                  onClick={(e) => e.stopPropagation()} // Prevent parent click event
                >
                  <p>Members: {team.members.join(", ")}</p>
                  <div>
                    {/* Render buttons only if they haven't been accepted/declined */}
                    {!team.hideButtons && (
                      <>
                        <button
                          onClick={() => handleAcceptTeam(team.id, project.id)} // Pass both teamId and projectId
                          style={{ marginRight: "10px" }}
                        >
                          Accept Request
                        </button>
                        <button
                          onClick={() => handleDeclineTeam(team.id)}
                          style={{ marginRight: "10px" }}
                        >
                          Decline Request
                        </button>
                      </>
                    )}
                  </div>
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
