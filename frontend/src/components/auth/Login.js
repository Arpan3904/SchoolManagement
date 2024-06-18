import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css'; // Import CSS module
import logo from './logo.png';
import image from './image.svg'; // Import the SVG file
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput
} from 'mdb-react-ui-kit';

import logo2 from './erp.svg';
import image2 from './picture.png';
import logo3 from './logo3.jpeg';

const Login = ({ sendDataToParent }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
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
      <MDBContainer style={{marginLeft: '-170px'}} className={`my-3 p-3 ${styles.mainContainer}`} >
        <MDBRow className="justify-content-center align-items-center">
        <MDBCol md="6" className={`p-4 ${styles.loginContainer}`}>
          <div className="text-center mb-4">
            <img src={logo3} style={{ width: '165px' }} alt="logo" />
          </div>
         <h1 style={{fontWeight:'500px'}} className="text-center">Login</h1>
          <form onSubmit={handleLogin}>
            <MDBInput
              wrapperClass='mb-2'
              label='Email'
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <MDBInput
              wrapperClass='mb-2'
              label='Password'
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="text-center pt-1 mb-2 pb-1">
              <button className={`${styles.loginButton} btn btn-primary`}>Login</button>
            </div>
            <div className="text-center">
              {/* <Link to="/forgotpassword" className="text-muted">
                Forgot password?
              </Link> */}
              <Link to="/signup" className={styles.signupLink}>Not Having Account? Sign Up</Link>
            </div>
          </form>
        </MDBCol>
        <MDBCol md="6" className={`d-flex flex-column justify-content-center ${styles.imageContainer}`}>
          <div className="text-center">
            <img src={image2} className={styles.imageSvg} alt="illustration" />
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Login;
