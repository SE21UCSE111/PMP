import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StudentContext } from "./StudentContext";

// Sample projects data (per professor)
const initialProjects = {
  1: [ // Professor 1
    { id: 1, title: "Project A", description: "Description of Project A" },
    { id: 2, title: "Project B", description: "Description of Project B" },
  ],
  2: [ // Professor 2
    { id: 3, title: "Project C", description: "Description of Project C" },
    { id: 4, title: "Project D", description: "Description of Project D" },
  ],
};

function ProjectList() {
  const { courseId, professorId } = useParams();
  const navigate = useNavigate();
  const { studentProjects, addStudentProject } = useContext(StudentContext);

  // State to manage available projects for each professor
  const [projects, setProjects] = useState(initialProjects[professorId] || []);

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
      <h1>Projects for {courseId} - Professor {professorId}</h1>
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
              <h2>{project.title}</h2>
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
