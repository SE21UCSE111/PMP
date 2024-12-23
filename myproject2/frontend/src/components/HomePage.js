import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [studentProjects, setStudentProjects] = useState([]);
  const [studentName, setStudentName] = useState("Student");

  useEffect(() => {
    if (location.state?.username) {
      const username = location.state.username;
      setStudentName(username);
    }

    // Fetch projects dynamically based on student name
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/student-projects/", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setStudentProjects(data.projects);
        } else {
          console.error("Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [location.state]);

  const handleLogout = async () => {
    try {
      const csrfToken = document.cookie.split("; ").find((row) => row.startsWith("csrftoken=")).split("=")[1];

      const response = await fetch("http://localhost:8000/api/logout/", {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });

      if (response.ok) {
        alert("Logout successful.");
        navigate("/"); // Redirect to the homepage
      } else {
        alert("Logout failed.");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Hi {studentName}</h1>
      <button
        onClick={() => navigate("/professors")}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          width:"11.67%",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        New Project
      </button>

      <h2>Your Projects</h2>
      <div>
        {studentProjects && studentProjects.length > 0 ? (
          studentProjects.map((project, index) => (
            <div
              key={index}
              onClick={() => navigate(`/dashboard/${project.id}`)}
              style={{
                border: "1px solid #ccc",
                margin: "10px 0",
                padding: "10px",
                cursor: "pointer",
                borderRadius: "5px",
              }}
            >
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </div>
          ))
        ) : (
          <p>No projects added yet. Click "New Project" to get started!</p>
        )}
      </div>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          width: "11.67%",
          backgroundColor: "#FF6347",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default HomePage;
