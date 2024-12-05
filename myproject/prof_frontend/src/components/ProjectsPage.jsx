import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

function ProjectsPage({ onNavigate }) {
  const [projects, setProjects] = useState(
    (JSON.parse(localStorage.getItem("projects")) || []).map((project) => ({
      ...project,
      teamsApplying: project.teamsApplying || [],
    }))
  );
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    prerequisites: "",
    maxTeams: "",
    maxMembers: "",
    department: "",
    professorName: "",
    teamsApplying: [],
  });

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleCreateProject = () => {
    setProjects([...projects, { ...newProject, teamsApplying: [] }]);
    setNewProject({
      name: "",
      description: "",
      prerequisites: "",
      maxTeams: "",
      maxMembers: "",
      department: "",
      professorName: "",
      teamsApplying: [],
    });
    setModalOpen(false);
  };

  const handleMoreInfo = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const handleAddTeam = () => {
    if (!selectedProject) return;
    const teamName = `Team ${selectedProject.teamsApplying?.length + 1 || 1}`;
    const updatedProject = {
      ...selectedProject,
      teamsApplying: [
        ...(selectedProject.teamsApplying || []),
        { name: teamName, project: selectedProject.name },
      ],
    };
    setProjects((prev) =>
      prev.map((proj) => (proj.name === selectedProject.name ? updatedProject : proj))
    );
    setSelectedProject(updatedProject);
  };

  const handleRemoveTeam = (teamIndex) => {
    if (!selectedProject) return;
    const updatedTeams = selectedProject.teamsApplying?.filter(
      (_, index) => index !== teamIndex
    );
    const updatedProject = { ...selectedProject, teamsApplying: updatedTeams };
    setProjects((prev) =>
      prev.map((proj) => (proj.name === selectedProject.name ? updatedProject : proj))
    );
    setSelectedProject(updatedProject);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Projects</h1>
      <button onClick={() => onNavigate("home")}>Back to Home</button>
      <button onClick={() => setModalOpen(true)} style={{ marginLeft: "10px" }}>
        Create Project
      </button>
      {projects.length === 0 ? (
        <p>No projects yet</p>
      ) : (
        <ul>
          {projects.map((project, index) => (
            <li key={index}>
              {project.name}{" "}
              <button onClick={() => handleMoreInfo(project)}>More Info</button>
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
          {selectedProject ? (
            <>
              <h2>{selectedProject.name}</h2>
              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ flex: 1 }}>
                  <p><strong>Description:</strong> {selectedProject.description}</p>
                  <p><strong>Prerequisites:</strong> {selectedProject.prerequisites}</p>
                  <p><strong>Department:</strong> {selectedProject.department}</p>
                  <p><strong>Professor Name:</strong> {selectedProject.professorName}</p>
                  <p><strong>Max Teams:</strong> {selectedProject.maxTeams}</p>
                  <p><strong>Max Members:</strong> {selectedProject.maxMembers}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <h3>Teams Applying</h3>
                  {selectedProject.teamsApplying?.length === 0 ? (
                    <p>No teams have applied yet.</p>
                  ) : (
                    <ul>
                      {selectedProject.teamsApplying.map((team, index) => (
                        <li key={index}>
                          {team.name}
                          <button
                            onClick={() => handleRemoveTeam(index)}
                            style={{
                              marginLeft: "10px",
                              backgroundColor: "red",
                              color: "white",
                            }}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    onClick={handleAddTeam}
                    style={{
                      marginTop: "10px",
                      backgroundColor: "#4caf50",
                      color: "white",
                    }}
                  >
                    Add Team
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2>Create Project</h2>
              {/* Form to Create Project */}
              {Object.keys(newProject).map((key) =>
                key !== "teamsApplying" ? (
                  <div key={key}>
                    <label>{key}</label>
                    <input
                      type="text"
                      name={key}
                      value={newProject[key]}
                      onChange={handleInputChange}
                      style={{ display: "block", marginBottom: "10px", width: "100%" }}
                    />
                  </div>
                ) : null
              )}
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
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default ProjectsPage;
