import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Login.css'; // Import CSS file for styling

const Login = ({ sendDataToParent }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [schoolIndexId, setSchoolIndexId] = useState(''); // State for schoolIndexId
  const navigate = useNavigate();

  const handleLogin = () => {
    axios.post('http://localhost:5000/api/login', { email, password })
      .then(response => {
        console.log(response.data.user.userRole);
        var userRole = response.data.user.userRole;
        var email = response.data.user.eml;
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
    <div className="login-container"> {/* Apply CSS class to the container */}
      <h2 className="login-title">Login</h2> {/* Apply CSS class to the title */}
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
      
      <button className="login-button" onClick={handleLogin}>Login</button> {/* Apply CSS class to the button */}
    </div>
  );
};

export default Login;
