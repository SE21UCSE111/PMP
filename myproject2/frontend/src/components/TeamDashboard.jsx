import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './TeamDashboard.css';

function TeamDashboard() {
  const navigate = useNavigate(); // Use useNavigate directly here
  const location = useLocation(); // Get the location from React Router
  const teamId = location.state?.teamId; // Access teamId from the passed state
  
  const [selectedGrade, setSelectedGrade] = useState(""); // State for storing the selected grade

  const handleBackToHome = () => {
    navigate("/professor"); // Navigate to the professor home page
  };

  const handleGradeChange = (event) => {
    setSelectedGrade(event.target.value); // Update the state with the selected grade
  };

  const handleSubmitGrade = async () => {
    if (!selectedGrade) {
      alert("Please select a grade.");
      return;
    }

    // Get the CSRF token from the cookies
    const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
    if (!csrfToken) {
      console.error('CSRF token not found in cookies.');
    } else {
      console.log('CSRF token:', csrfToken.split('=')[1]);
    }
    
    try {
      const response = await fetch('http://localhost:8000/api/update_grade/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,  // Include CSRF token in the request headers
        },
        body: JSON.stringify({
          grade: selectedGrade,
          team_id: teamId, // Use dynamic team_id from the passed state
        }),
        credentials: 'include',  // Include credentials (cookies) with the request
        withCredentials: true,    // Set withCredentials explicitly

      });

      if (response.ok) {
        alert("Grade updated successfully.");
      } else {
        alert("Failed to update grade.");
      }
    } catch (error) {
      console.error("Error updating grade:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Team Dashboard</h1>
      <button onClick={handleBackToHome}>Back to Home</button>

      <div style={{ marginTop: "20px" }}>
        <label>Assign Grade: </label>
        <select value={selectedGrade} onChange={handleGradeChange}>
          <option value="">Select Grade</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="F">F</option>
        </select>

        <button
          onClick={handleSubmitGrade}
          style={{ marginLeft: "10px" }}
        >
          Submit Grade
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button style={{ marginLeft: "10px" }}>Add Comment</button>
        <button style={{ marginLeft: "10px" }}>Create To-Do List</button>
      </div>
    </div>
  );
}

export default TeamDashboard;
