import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './TeamDashboard.css'; // Import the CSS file

function TeamDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const teamId = location.state?.teamId;

  const [selectedGrade, setSelectedGrade] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Fetch the to-do list
  const fetchToDoList = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/get_todolist/${teamId}/`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks.length ? data.tasks : [{ description: "", checked: false }]);
      } else {
        const errorData = await response.json();
        alert(`Failed to fetch to-do list: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error fetching to-do list:", error);
    }
  };

  // Fetch comments for the team
  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/get_comments/${teamId}/`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
      } else {
        const errorData = await response.json();
        alert(`Failed to fetch comments: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchToDoList();
    fetchComments();
  }, [teamId]);

  const handleBackToHome = () => {
    navigate("/professor");
  };

  const handleGradeChange = (event) => {
    setSelectedGrade(event.target.value);
  };

  const handleSubmitGrade = async () => {
    if (!selectedGrade) {
      alert("Please select a grade.");
      return;
    }

    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))?.split('=')[1];

    if (!csrfToken) {
      alert("CSRF token not found.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/update_grade/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          grade: selectedGrade,
          team_id: teamId,
        }),
      });

      if (response.ok) {
        alert("Grade updated successfully.");
      } else {
        const errorData = await response.json();
        alert(`Failed to update grade: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating grade:", error);
    }
  };

  const handleTaskChange = (index, event) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].description = event.target.value;
    setTasks(updatedTasks);
  };

  const handleTaskCheckedChange = async (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].checked = !updatedTasks[index].checked;
    setTasks(updatedTasks);

    // Automatically save the updated to-do list when a checkbox is toggled
    await handleCreateOrUpdateToDoList();
  };

  const handleAddTaskAtIndex = (index) => {
    const newTask = { description: "", checked: false };
    const updatedTasks = [
      ...tasks.slice(0, index), 
      newTask, 
      ...tasks.slice(index),
    ];
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, taskIndex) => taskIndex !== index);
    setTasks(updatedTasks.length ? updatedTasks : [{ description: "", checked: false }]);
  };

  const handleCreateOrUpdateToDoList = async () => {
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))?.split('=')[1];

    if (!csrfToken) {
      alert("CSRF token not found.");
 return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/manage_todolist/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          team_id: teamId,
          tasks: tasks,
        }),
      });

      if (response.ok) {
        alert("To-Do List saved successfully.");
        setIsModalOpen(false);
        fetchToDoList();
      } else {
        const errorData = await response.json();
        alert(`Failed to save to-do list: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error saving to-do list:", error);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) {
      alert("Please enter a comment.");
      return;
    }

    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))?.split('=')[1];

    if (!csrfToken) {
      alert("CSRF token not found.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/post_comment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          team_id: teamId,
          comment: newComment,
        }),
      });

      if (response.ok) {
        alert("Comment posted successfully.");
        setNewComment("");  // Clear the comment input field
        fetchComments();  // Refresh the comments list
      } else {
        const errorData = await response.json();
        alert(`Failed to post comment: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Team Dashboard</h1>
      <button onClick={handleBackToHome} style={{width:"11.67%"}}>Back to Home</button>

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

        <div className="team-buttons">
          <button onClick={handleSubmitGrade} style={{width:"11.67%"}}>Submit Grade</button>
          <button onClick={() => setIsModalOpen(true)} style={{width:"11.7%"}}>Create/Update To-Do List</button>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Comments</h3>
        <div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment"
            rows="3"
            style={{ width: "100%", marginBottom: "10px"}}
          ></textarea>
          <button onClick={handlePostComment} style={{width:"11.67%"}}>Post Comment</button>
        </div>

        <ul style={{ marginTop: "10px", listStyleType: "none", padding: 0 }}>
          {comments.map((comment) => (
            <li key={comment.id} style={{ marginBottom: "10px", border: "1px solid #ccc", padding: "10px", borderRadius: "5px",width: "300px",backgroundColor: "#f8f9fa" }}>
              <strong style={{ color: "#007BFF" }}>{comment.user}</strong>: <span style={{ fontStyle: "italic" }}>{comment.text}</span> <br />
              <small style={{ color: "#888" }}>{new Date(comment.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create/Update To-Do List</h3>
            {tasks.map((task, index) => (
              <div key={index}>
                <button
                  onClick={() => handleAddTaskAtIndex(index)}
                  style={{ marginBottom: "5px" }}
                >
                  Add Task Above
                </button>
                <input
                  type="text"
                  value={task.description}
                  onChange={(event) => handleTaskChange(index, event)}
                  placeholder={`Task ${index + 1}`}
                />
                <button onClick={() => handleDeleteTask(index)} style={{ marginLeft: "10px" }}>
                  Delete
                </button>
              </div>
            ))}
            <div style={{ marginTop: "20px" }}>
              <button onClick={() => handleAddTaskAtIndex(tasks.length)}>Add Task at the End</button>
              <button onClick={handleCreateOrUpdateToDoList} style={{ marginLeft: "10px" }}>
                Save To-Do List
              </button>
              <button onClick={() => setIsModalOpen(false)} style={{ marginLeft: "10px" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

<div style={{ marginTop: "20px" }}>
  <h3>Existing To-Do List</h3>
  <ul style={{ listStyleType: "none", padding: 0 }}> {/* Remove default list styling */}
    {tasks.map((task, index) => (
      <li key={index} style={{ 
        display: "flex", // Use flexbox for alignment
        alignItems:"flex-start", // Center items vertically
        padding: "3px", // Add some padding for readability
        border: '1px solid #ccc', // Optional: Add a border for better visibility
        borderRadius: '5px', // Rounded corners
        width:"110px",
        margin: '10px', // Space between list items
        marginTop:"1px",
        backgroundColor: '#f8f9fa', // Light background for list items
        transition: 'background-color 0.3s' // Smooth transition for hover effect
      }}>
        <input
          type="checkbox"
          checked={task.checked || false}
          onChange={() => handleTaskCheckedChange(index)}
          style={{ marginRight: '10px',marginTop:"10px" }} // Space between checkbox and text
        />
        <span style={{ textDecoration: task.checked ? "line-through" : "none" }}>
          {task.description}
        </span>
      </li>
    ))}
  </ul>
</div>
  </div>
  );
}

export default TeamDashboard;