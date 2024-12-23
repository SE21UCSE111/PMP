import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './ProfessorHomePage.css';

function ProfessorHomePage() {
  const location = useLocation();
  const initialName = location.state?.name || "Professor";
  const [professorName] = useState(localStorage.getItem('professorName') || initialName);
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  const handleProjectClick = (project) => {
    navigate("/team-dashboard", { state: { project, teamId: project.teams[0].id } });
  };

  const handleDeclineTeam = async (teamId) => {
    try {
      const response = await fetch('http://localhost:8000/api/decline_team/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1],
        },
        credentials: 'include',
        body: JSON.stringify({ team_id: teamId }),
      });

      if (response.ok) {
        alert('Team declined successfully.');
        setProjects((prevProjects) =>
          prevProjects.map((project) => ({
            ...project,
            teams: project.teams.filter((team) => team.id !== teamId),
          }))
        );
      } else {
        alert('Failed to decline the team.');
      }
    } catch (error) {
      console.error('Error declining the team:', error);
    }
  };

  const handleAcceptTeam = (teamId, projectId) => {
    const acceptedTeams = JSON.parse(localStorage.getItem('acceptedTeams')) || [];
    const newAcceptedTeam = { teamId, projectId };

    if (!acceptedTeams.some((team) => team.teamId === teamId && team.projectId === projectId)) {
      acceptedTeams.push(newAcceptedTeam);
      localStorage.setItem('acceptedTeams', JSON.stringify(acceptedTeams));
    }

    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === projectId) {
          return {
            ...project,
            teams: project.teams.map((team) =>
              team.id === teamId ? { ...team, hideButtons: true } : team
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
          'X-CSRFToken': document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1],
        },
      });

      if (response.ok) {
        alert('Logout successful.');
        localStorage.removeItem('professorName');
        navigate('/');
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

          const updatedProjects = data.projects.map((project) => ({
            ...project,
            teams: project.teams.map((team) => {
              const isAccepted = acceptedTeams.some((acceptedTeam) =>
                acceptedTeam.teamId === team.id && acceptedTeam.projectId === project.id
              );
              return { ...team, hideButtons: isAccepted };
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
      <button onClick={() => navigate("/project_creation")} style={{ padding: "10px", width: "220px" }}>My Projects</button>
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
                  onClick={(e) => e.stopPropagation()}
                >
                  <p>Members: {team.members.join(", ")}</p>
                  <div>
                    {!team.hideButtons && (
                      <>
                        <button
                          onClick={() => handleAcceptTeam(team.id, project.id)}
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
