import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

function ProjectsPage({ onNavigate }) {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1];
  
        const response = await fetch("http://localhost:8000/api/professor-projects/", {
          method: "GET",
          credentials: "include",
          headers: {
            'X-CSRFToken': csrfToken // Include CSRF token in the headers
          }
        });
  
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          alert("Failed to fetch projects. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        alert("An error occurred while fetching projects.");
      }
    };
  
    fetchProjects();
  }, []);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({
      ...newProject,
      [name]: value,
    });
  };

  const handleCreateProject = async () => {
    try {
        const formData = new FormData();
        formData.append("name", newProject.name);
        formData.append("description", newProject.description);

        const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1];

        const response = await fetch("http://localhost:8000/api/create_project/", {
            method: "POST",
            body: formData,
            credentials: "include",
            headers: {
                'X-CSRFToken': csrfToken // Include CSRF token in the headers
            }
        });

        const result = await response.json();

        if (result.success) {
            setProjects([...projects, { ...newProject, id: result.project_id }]);
            setNewProject({ name: "", description: "" });
            setModalOpen(false);
        } else {
            alert("Project creation failed: " + result.error);
        }
    } catch (error) {
        console.error("Error creating project:", error);
        alert("An error occurred while creating the project.");
    }
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>Projects</h1>
      <button onClick={() => onNavigate("/professor")}>Back to Home</button>
      <button onClick={() => setModalOpen(true)} style={{ marginLeft: "10px" }}>
        Create Project
      </button>
      {projects.length === 0 ? (
        <p>No projects yet</p>
      ) : (
        <ul>
          {projects.map((project, index) => (
            <li key={index}>
              <strong>{project.name}</strong>: {project.description}
            </li>
          ))}
        </ul>
      )}
      <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
          }}
        >
          <h2>Create Project</h2>
          {/* Form to Create Project */}
          {Object.keys(newProject).map((key) => (
            <div key={key}>
              <label>{key}</label>
              <input
                type="text"
                name={key}
                value={newProject[key]}
                onChange={handleInputChange}
                style={{
                  display: "block",
                  marginBottom: "10px",
                  width: "100%",
                }}
              />
            </div>
          ))}
          <button
            onClick={handleCreateProject}
            style={{
              marginTop: "10px",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
            }}
          >
            Create Project
          </button>
        </Box>
      </Modal>
    </div>
  );
}

export default ProjectsPage;
