import React from "react";
import { useParams } from "react-router-dom";
import "./ProfessorDetails.css";

const professorData = {
  1: { name: "Nora Balistreri", image: "/images/professor1.jpg", bio: "Expert in AI and Machine Learning" },
  2: { name: "John Doe", image: "/images/professor2.jpg", bio: "Specialist in Software Engineering" },
  3: { name: "Jane Smith", image: "/images/professor3.jpg", bio: "Researcher in Cybersecurity" },
  4: { name: "Alice Johnson", image: "/images/professor4.jpg", bio: "Database and Big Data Analyst" },
};

const ProfessorDetails = () => {
  const { id } = useParams();
  const professor = professorData[id];

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Professor Details</h1>
      <img
        src={professor.image}
        alt={professor.name}
        style={{ borderRadius: "10px", width: "200px", height: "200px" }}
      />
      <h2>{professor.name}</h2>
      <p>{professor.bio}</p>
    </div>
  );
};

export default ProfessorDetails;
