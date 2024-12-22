import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ProjectDashboard() {
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState(""); // State for project name
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]); // State for tasks (to-do list)
  const [loadingTasks, setLoadingTasks] = useState(true); // Loading state for tasks
  const [modalGrade, setModalGrade] = useState(null); // Grade to show in the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [comments, setComments] = useState([]); // State for comments
  const [newComment, setNewComment] = useState(""); // State for new comment input

  // Fetch grades, tasks, and comments
  useEffect(() => {
    const fetchGradesAndTasksAndComments = async () => {
      try {
        // Fetch grades
        const gradesResponse = await fetch(`http://localhost:8000/api/project/${projectId}/grades/`, {
          method: 'GET',
          credentials: 'include', // Include credentials (cookies) for authentication
        });
        if (gradesResponse.ok) {
          const gradesData = await gradesResponse.json();
          setProjectName(gradesData.project_name); // Set project name
          setGrades(gradesData.grades); // Set grades data
        } else {
          console.error("Failed to fetch grades.");
        }

        // Fetch to-do list
        const tasksResponse = await fetch(`http://localhost:8000/api/get_todolist/${projectId}/`, {
          method: 'GET',
          credentials: 'include', // Include credentials (cookies) for authentication
        });
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          setTasks(tasksData.tasks); // Set tasks data
        } else {
          console.error("Failed to fetch tasks.");
        }

        // Fetch comments
        const commentsResponse = await fetch(`http://localhost:8000/api/get_comments/${projectId}/`, {
          method: 'GET',
          credentials: 'include', // Include credentials (cookies) for authentication
        });
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData.comments); // Set comments data
        } else {
          console.error("Failed to fetch comments.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        setLoadingTasks(false);
      }
    };

    fetchGradesAndTasksAndComments();
  }, [projectId]);

  // Open modal to view grade
  const handleOpenModal = (grade) => {
    setModalGrade(grade || "No grade given yet!"); // Show "No grade given yet!" if grade is null or blank
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalGrade(null);
  };

  // Handle task status change
  const handleTaskChange = async (taskId, event) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, checked: event.target.checked } : task
    );
    setTasks(updatedTasks);

    // Send update to the backend
    try {
      await fetch('http://localhost:8000/api/update_todolist/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include credentials (cookies) for authentication
        body: JSON.stringify({
          team_id: projectId,
          tasks: updatedTasks,
        }),
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Handle comment input change
  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      // Get the CSRF token from the cookie
      const csrfToken = document.cookie
        .split("; ")
        .find(row => row.startsWith("csrftoken="))
        .split("=")[1];

        const response = await fetch("http://localhost:8000/api/post_comment/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,  // Include CSRF token here
          },
          credentials: 'include', // Include credentials (cookies) for authentication
          body: JSON.stringify({
            team_id: projectId,
            comment: newComment,
          }),
        });
        

      if (response.ok) {
        const commentsResponse = await fetch(`http://localhost:8000/api/get_comments/${projectId}/`, {
          method: 'GET',
          credentials: 'include', // Include credentials (cookies) for authentication
        });
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData.comments); // Set updated comments
        } else {
          console.error("Failed to fetch updated comments.");
        }
        setNewComment(""); // Clear the comment input
      } else {
        console.error("Failed to post comment.");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Project Dashboard</h1>
      <h2>Project Name: {projectName}</h2> {/* Display project name */}

      <div style={{ marginTop: "20px" }}>
        {loading ? (
          <p>Loading grades...</p>
        ) : grades.length > 0 ? (
          grades.map((team, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <button
                onClick={() => handleOpenModal(team.grade)}
                style={{
                  padding: "10px 20px",
                  marginTop: "5px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                See Grade
              </button>
            </div>
          ))
        ) : (
          <p>No grades found for this project.</p>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        {loadingTasks ? (
          <p>Loading tasks...</p>
        ) : tasks.length > 0 ? (
          <div>
            <h3>To-Do List</h3>
            <ul>
              {tasks.map((task) => (
                <li key={task.id} style={{ marginBottom: "10px" }}>
                  <input
                    type="checkbox"
                    checked={task.checked || false}
                    onChange={(event) => handleTaskChange(task.id, event)}
                  />
                  <span
                    style={{
                      textDecoration: task.checked ? "line-through" : "none", // Strike-through if checked
                      marginLeft: "10px",
                    }}
                  >
                    {task.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No tasks found for this project.</p>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Comments</h3>
        <ul>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <li key={comment.id} style={{ marginBottom: "10px" }}>
                <strong>{comment.user}:</strong> {comment.text}
                <br />
                <small>{new Date(comment.created_at).toLocaleString()}</small>
              </li>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </ul>

        <div style={{ marginTop: "10px" }}>
          <textarea
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Add a comment..."
            rows="3"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          ></textarea>
          <button
            onClick={handlePostComment}
            style={{
              padding: "10px 20px",
              marginTop: "10px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Post Comment
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
          }}
        >
          <h3>Grade</h3>
          <p>{modalGrade}</p>
          <button
            onClick={handleCloseModal}
            style={{
              padding: "10px 20px",
              marginTop: "10px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      )}

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
          onClick={handleCloseModal}
        ></div>
      )}
    </div>
  );
}

export default ProjectDashboard;
