import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import '../../styles/Signup.css';

const SignupForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [schoolIndexId, setSchoolIndexId] = useState('');
  const [userRole, setUserRole] = useState("principal");
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignup = async () => {
    try {
      setUserRole("principal");
      const response = await axios.post('http://localhost:5000/api/signup', { 
        firstName, 
        lastName, 
        email, 
        password, 
        schoolName, 
        schoolIndexId,
        userRole
      });
  
      // Check if response is successful and contains data
      if (response && response.data) {
        // Handle successful signup
        console.log('Signup successful:', response.data);
        navigate('/login');
      } else {
        console.error('Signup failed: Response or response data is undefined');
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else if (error.request) {
        console.error('No response received from server.');
        setErrorMessage('Error: No response received from server.');
      } else {
        console.error('Error:', error.message);
        setErrorMessage(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign Up</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="input-container">
        <label>First Name:</label>
        <input
          type="text"
          placeholder="Enter your first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label>Last Name:</label>
        <input
          type="text"
          placeholder="Enter your last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label>Email:</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label>Password:</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label>School Name:</label>
        <input
          type="text"
          placeholder="Enter your school name"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label>School Index ID:</label>
        <input
          type="text"
          placeholder="Enter your school index ID"
          value={schoolIndexId}
          onChange={(e) => setSchoolIndexId(e.target.value)}
        />
      </div>
      <button className="signup-button" onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default SignupForm;
