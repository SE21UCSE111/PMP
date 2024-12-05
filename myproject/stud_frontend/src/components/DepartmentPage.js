import React from 'react';
import { Link } from 'react-router-dom';

function DepartmentPage() {
  const courses = ["CS101", "MATH204", "PHYS301", "ENG105"];
  
  return (
    <div style={{ padding: "20px" }}>
      <h1>Department Page</h1>
      <h2>Select a Course:</h2>
      <div>
        {courses.map((course, index) => (
          <Link
            key={index}
            to={`/professors/${course}`} // This passes the courseId to ProfessorList
            style={{
              display: "block",
              border: "1px solid #ccc",
              margin: "10px 0",
              padding: "10px",
              cursor: "pointer",
              textDecoration: "none", // Removes underline from link
              color: "black",
            }}
          >
            {course}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DepartmentPage;
