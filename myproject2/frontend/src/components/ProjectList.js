import React, { useState, useContext, useEffect } from "react";
import Modal from "react-modal"; // Modal library
import { useParams, useNavigate } from "react-router-dom";
import { StudentContext } from "./StudentContext";

function ProjectList() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { studentProjects, addStudentProject } = useContext(StudentContext);

  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [teamMembers, setTeamMembers] = useState(["", "", "", ""]); // 4 fields for team members
  const [errors, setErrors] = useState(["", "", "", ""]); // To track input errors
  const [loggedInUser , setLoggedInUser ] = useState(""); // Track the logged-in user

  useEffect(() => {
    // You can pass the logged-in user's username here
    const usernameFromStorage = localStorage.getItem("username"); // Adjust according to where you get the logged-in user's username
    setLoggedInUser (usernameFromStorage || ""); // Set it to an empty string if not found

    fetch(`http://localhost:8000/api/view-projects/${username}/`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setProjects(data.projects);
        } else {
          console.error("Error fetching projects:", data.message);
        }
      })
      .catch((error) => console.error("Network error:", error));
  }, [username]);

  const openModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTeamMembers(["", "", "", ""]);
    setErrors(["", "", "", ""]); // Clear errors
  };

  const handleInputChange = (index, value) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = value;
    setTeamMembers(updatedMembers);
    setErrors((prev) => {
      const updatedErrors = [...prev];
      updatedErrors[index] = ""; // Reset the error on input change
      return updatedErrors;
    });
  };

  const validateMembers = async () => {
    const newErrors = [...errors];
    let allValid = true;

    // Validate each member via backend
    for (let i = 0; i < teamMembers.length; i++) {
      const member = teamMembers[i];
      if (member) {
        try {
          const response = await fetch(
            `http://localhost:8000/api/validate-student/?username=${member}`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          const data = await response.json();
          if (!data.exists) {
            newErrors[i] = `Student ${member} does not exist.`;
            allValid = false;
          }
        } catch (error) {
          console.error("Error validating student:", error);
        }
      }
    }

    setErrors(newErrors);
    return allValid;
  };

  const handleSubmitTeam = async () => {
    // Ensure the logged-in user is added to the team if not already included
    if (!teamMembers.includes(loggedInUser )) {
      alert("You must include your name in the team list.");
      return; // Stop the submission
    }

    const isValid = await validateMembers();

    if (!isValid) {
      alert("Please fix the errors before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("project_id", selectedProject.id);

    // Remove the logged-in user from the teamMembers array check, as it's handled by the backend.
    teamMembers.forEach((member, index) => {
      if (member) {
        formData.append(`member${index + 1}`, member);
      }
    });

    fetch("http://localhost:8000/api/create-team/", {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        "X-CSRFToken": document.cookie.match(/csrftoken=([^;]+)/)?.[1], // Include CSRF token
      },
    })
      .then((response) => response.json())
      .then((data) => {
 if (data.success) {
          alert("Team created successfully!");
          addStudentProject(selectedProject);
          closeModal(); // Close the modal after successful team creation
        } else {
          console.error("Error:", data.message);
          alert("Failed to create team.");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Projects of {username}</h1>
      <div>
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              margin: "10px 0",
              padding: "10px",
              border: "1px solid #ccc",
              backgroundColor: "white", // Set background color to white
              borderRadius: "10px", // Optional: Add border radius for rounded corners
              width: "80%",
              maxWidth: "400px", // Optional: set a max width
              borderRadius:"10px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Optional: Add a subtle shadow for depth
            }}
          >
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <button onClick={() => openModal(project)}
               style={{marginLeft:"0px"
               }}>Make Team</button>
          </div>
        ))}
      </div>

      {/* Modal for Team Input */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Create Team Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark overlay
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "white", // Modal background color
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Shadow for depth
          },
        }}
      >
        <h2>Create Team for {selectedProject?.name}</h2>
        {[0, 1, 2, 3].map((index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <label style={{ fontWeight: "bold" }}>Team Member {index + 1}:</label>
            <input
              type="text"
              value={teamMembers[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              style={{
                display: "block",
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginTop: "5px",
              }}
            />
            {errors[index] && <p style={{ color: "red" }}>{errors[index]}</p>}
          </div>
        ))}
        <button
          onClick={handleSubmitTeam}
          style={{
            marginTop: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%", // Full width for the button
          }}
        >
          Submit Team
        </button>
        <button
          onClick={closeModal}
          style={{
            marginTop: "10px",
            backgroundColor: "#dc3545", // Red color for close button
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%", // Full width for the button
          }}
        >
          Close
        </button>
      </Modal>
    </div>
  );
}

export default ProjectList;