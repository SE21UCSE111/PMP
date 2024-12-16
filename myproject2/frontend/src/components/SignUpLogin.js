import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpLogin = () => {
  const [role, setRole] = useState('student'); // Default role
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: ''
  });
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();
  const currentPath = window.location.pathname; // Get current pathname

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', signupData.username);
      formData.append('email', signupData.email);
      formData.append('password1', signupData.password1);
      formData.append('password2', signupData.password2);
      formData.append('signup', 'true'); // Identify this as a signup request
      formData.append('role', role);
  
      const response = await fetch('http://localhost:8000/api/sign_up_and_login/', {
        method: 'POST',
        body: formData
      });
  
      if (response.ok) {
        const data = await response.json();
        alert('Sign up successful! You can now log in.');
  
        // Navigate back to the same page to log in
        navigate(currentPath);
  
        // Reset form fields after successful signup
        setSignupData({ username: '', email: '', password1: '', password2: '' });
        setRole('student'); // Reset role to default 'student'
      } else {
        const errorData = await response.json();
        alert(errorData.errors || 'Sign up failed.');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Something went wrong. Please try again.');
    }
  };
  

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (loginData.username && loginData.password) {
      try {
        const formData = new FormData();
        formData.append('username', loginData.username);
        formData.append('password', loginData.password);
        formData.append('login', 'true'); // Identify this as a login request

        const response = await fetch('http://localhost:8000/api/sign_up_and_login/', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          alert(data.message);

          // Redirect based on role from the signup form
          if (data.role === 'student') {
            navigate('/student', { state: { username: loginData.username } }); // Redirect to student interface with username in state
          } else {
            navigate('/professor', { state: { name: loginData.username } }); // Pass the username to the ProfessorHomePage
          }
        } else {
          const errorData = await response.json();
          alert(errorData.errors || 'Login failed.');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        alert('Something went wrong. Please try again.');
      }
    } else {
      alert('Please enter your username and password.');
    }
  };

  return (
    <div className="sign-up-login-container">
      <div className="form-container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSignUp}>
          <div>
            <label>
              <input
                type="radio"
                value="student"
                checked={role === 'student'}
                onChange={() => setRole('student')}
              />
              Student
            </label>
            <label>
              <input
                type="radio"
                value="professor"
                checked={role === 'professor'}
                onChange={() => setRole('professor')}
              />
              Professor
            </label>
          </div>
          <input
            type="text"
            placeholder="Username"
            value={signupData.username}
            onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
            required
            style={{ marginBottom: "10px", padding: "10px", width: "200px" }}
          />
          <br />
          <input
            type="email"
            placeholder="Email ID"
            value={signupData.email}
            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
            required
            style={{ marginBottom: "10px", padding: "10px", width: "200px" }}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={signupData.password1}
            onChange={(e) => setSignupData({ ...signupData, password1: e.target.value })}
            required
            style={{ marginBottom: "10px", padding: "10px", width: "200px" }}
          />
          <br />
          <input
            type="password"
            placeholder="Confirm Password"
            value={signupData.password2}
            onChange={(e) => setSignupData({ ...signupData, password2: e.target.value })}
            required
            style={{ marginBottom: "10px", padding: "10px", width: "200px" }}
          />
          <br />
          <button type="submit">Sign Up</button>
        </form>
      </div>

      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={loginData.username}
            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
            required
            style={{ marginBottom: "10px", padding: "10px", width: "200px" }}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            required
            style={{ marginBottom: "10px", padding: "10px", width: "200px" }}
          />
          <br />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default SignUpLogin;
