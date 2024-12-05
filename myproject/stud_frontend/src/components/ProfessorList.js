import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Sample data for professors
const professors = {
  CS101: [
    { id: 1, name: "Dr. Smith", imageUrl: "/images/Teacher-1.png", info: "Dr. Smith is an expert in AI and Machine Learning." },
    { id: 2, name: "Prof. Johnson", imageUrl: "/images/Teacher-2.png", info: "Prof. Johnson specializes in Database Systems." },
  ],
  MATH204: [
    { id: 3, name: "Dr. Lee", imageUrl: "/images/Teacher-3.png", info: "Dr. Lee focuses on Applied Mathematics." },
    { id: 4, name: "Prof. Kim", imageUrl: "/images/Teacher-4.png", info: "Prof. Kim is a statistician and data analyst." },
  ],
  // Add other courses here
};

function ProfessorList() {
  const { courseId } = useParams(); // Retrieve courseId from URL
  const navigate = useNavigate(); // Hook to handle navigation
  const [selectedProfessor, setSelectedProfessor] = useState(null);

  // Fetch the list of professors based on courseId
  const courseProfessors = professors[courseId] || [];

  const handleProfessorClick = (professorId) => {
    navigate(`/projects/${courseId}/${professorId}`);
  };

  const openInfoModal = (professor) => {
    setSelectedProfessor(professor);
  };

  const closeModal = () => {
    setSelectedProfessor(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Professors for {courseId}</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {courseProfessors.length === 0 ? (
          <p>No professors available for this course.</p>
        ) : (
          courseProfessors.map((professor) => (
            <div
              key={professor.id}
              style={{
                margin: "10px",
                padding: "10px",
                border: "1px solid #ccc",
                width: "200px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <img
                src={professor.imageUrl}
                alt={professor.name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
                onClick={() => handleProfessorClick(professor.id)} // Navigate on image click
              />
              <p>{professor.name}</p>
              <button
                style={{
                  marginTop: "10px",
                  padding: "5px 10px",
                  border: "none",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
                onClick={() => openInfoModal(professor)} // Open info modal on button click
              >
                Info
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal for professor info */}
      {selectedProfessor && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          <h2>{selectedProfessor.name}</h2>
          <p>{selectedProfessor.info}</p>
          <button
            style={{
              marginTop: "10px",
              padding: "5px 10px",
              border: "none",
              backgroundColor: "#dc3545",
              color: "#fff",
              cursor: "pointer",
              borderRadius: "5px",
            }}
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      )}

      {/* Modal backdrop */}
      {selectedProfessor && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
          onClick={closeModal}
        ></div>
      )}
    </div>
  );
}

export default ProfessorList;
