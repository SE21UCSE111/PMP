import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StudentContext } from "./StudentContext";

function HomePage() {
  const navigate = useNavigate();
  const { studentProjects } = useContext(StudentContext);
  const [username, setUsername] = useState(""); // State to hold the username

  // Fetch the username from the backend (Django)
  useEffect(() => {
    fetch('/api/student_data/')  // Replace with your actual API endpoint for student data
      .then((response) => response.json())
      .then((data) => {
        if (data.username) {
          setUsername(data.username);  // Set the username when fetched
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleLogout = () => {
    // Send a request to the Django backend to log out the user
    fetch('/logout/', {
      method: 'POST', // or 'GET' depending on your logout method
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        // After logout, redirect to the login page
        window.location.href = '/';  // This will redirect to Django's login page
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome, {username }!</h1>  {/* Display username */}

      {/* Log Out button */}
      <button
        onClick={handleLogout}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#FF4C4C",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Log Out
      </button>

      {/* "New Project" button */}
      <button
        onClick={() => navigate("/department")}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        New Project
      </button>

      {/* My Projects Section */}
      <h2>Your Projects</h2>
      <div>
        {studentProjects.length > 0 ? (
          studentProjects.map((project, index) => (
            <div
              key={index}
              onClick={() => navigate(`/dashboard/${project.id}`)} // Navigate to dashboard
              style={{
                border: "1px solid #ccc",
                margin: "10px 0",
                padding: "10px",
                cursor: "pointer",
                borderRadius: "5px",
              }}
            >
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          ))
        ) : (
          <p>No projects added yet. Click "New Project" to get started!</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
