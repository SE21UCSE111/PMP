import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function CombinedPage() {
  const navigate = useNavigate();
  const [professorList, setProfessorList] = useState([]);
  const eventSourceRef = useRef();

  useEffect(() => {
    // Fetch initial list of professors
    fetch("http://localhost:8000/api/list-professors/")
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setProfessorList(data.professors);
        } else {
          console.error('Error fetching professors:', data.message);
        }
      })
      .catch(error => console.error('Network error:', error));
    
    // Set up SSE to listen for updates
    try {
      eventSourceRef.current = new EventSource("http://localhost:8000/api/professor-updates/");
      
      eventSourceRef.current.onmessage = (event) => {
        const updatedProfessors = JSON.parse(event.data);
        setProfessorList(updatedProfessors);
      };
      
      eventSourceRef.current.onerror = (error) => {
        console.error('Error with EventSource:', error);
        eventSourceRef.current.close();
      };
    } catch (error) {
      console.error('Failed to set up EventSource:', error);
    }

    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();  // Clean up on component unmount
    };
  }, []);  // Only run once on mount

  return (
    <div style={{ padding: "20px" }}>
      <h1>Choose your prof!</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {professorList.map((username, index) => (
          <div
            key={index}
            style={{
              margin: "10px",
              padding: "10px",
              border: "1px solid #ccc",
              width: "200px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <p>{username}</p>
            <button
              style={{
                marginTop: "10px",
                padding: "5px 10px",
                border: "none",
                backgroundColor: "#28a745",
                color: "#fff",
                cursor: "pointer",
                borderRadius: "5px",
              }}
              onClick={() => navigate(`/projects/${username}`)} // Redirect to professor's projects
            >
              View Projects
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CombinedPage;
