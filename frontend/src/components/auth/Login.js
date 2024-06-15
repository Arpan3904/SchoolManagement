import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate and Link
import '../../styles/Login.css'; // Import CSS file for styling

const Login = ({ sendDataToParent }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    axios.post('http://localhost:5000/api/login', { email, password })
      .then(response => {
        console.log(response.data.user.userRole);
        var userRole = response.data.user.userRole;
       
        localStorage.setItem('email', email);
        localStorage.setItem('userRole', userRole);
        sendDataToParent(userRole);
        navigate('/');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <input
        className="login-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="login-input" 
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <button className="login-button" onClick={handleLogin}>Login</button>
      
      {/* Signup button using Link */}
      <Link to="/signup" className="signup-link">Sign Up</Link>
    </div>
  );
};

export default Login;
