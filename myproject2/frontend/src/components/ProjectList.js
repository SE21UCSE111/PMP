import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StudentContext } from "./StudentContext";

function ProjectList() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { studentProjects, addStudentProject } = useContext(StudentContext);

  // State to manage available projects for the professor
  const [projects, setProjects] = useState([]);

  // Fetch projects for the selected professor
  useEffect(() => {
    fetch(`http://localhost:8000/api/view-projects/${username}/`)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setProjects(data.projects);
        } else {
          console.error('Error fetching projects:', data.message);
        }
      })
      .catch(error => console.error('Network error:', error));
  }, [username]);

  // Filter out projects already selected by the student
  const availableProjects = projects.filter(
    (project) => !studentProjects.some((sp) => sp.id === project.id)
  );

  const handleMakeTeam = (project) => {
    addStudentProject(project); // Add project to the student's context
    setProjects((prevProjects) =>
      prevProjects.filter((p) => p.id !== project.id) // Remove from local state
    );
    navigate("/"); // Redirect to home page
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Projects for {username}</h1>
      <div>
        {availableProjects.length > 0 ? (
          availableProjects.map((project) => (
            <div
              key={project.id}
              style={{
                margin: "10px 0",
                padding: "10px",
                border: "1px solid #ccc",
              }}
            >
              <h2>{project.name}</h2>
              <p>{project.description}</p>
              <button onClick={() => handleMakeTeam(project)}>Make Team</button>
            </div>
          ))
        ) : (
          <p>No projects available for this professor.</p>
        )}
      </div>
    </div>
  );
}

export default ProjectList;
