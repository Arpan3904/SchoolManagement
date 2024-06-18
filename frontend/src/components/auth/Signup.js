import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from 'mdb-react-ui-kit';
import styles from './Signup.module.css';  // Assuming you have imported your CSS module here
import logo3 from './logo3.jpeg';
import image2 from './picture.png';

const SignupForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [schoolIndexId, setSchoolIndexId] = useState('');
  const [userRole, setUserRole] = useState("principal");
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setUserRole("principal");
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/signup`, {
        firstName,
        lastName,
        email,
        password,
        schoolName,
        schoolIndexId,
        userRole
      });
      if (response && response.data) {
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

  const getMarginLeft = () => {
    return window.innerWidth > 600 ? '-130px' : '-40px';
  };


  return (
    <MDBContainer style={{ marginLeft: getMarginLeft() }} className={`my-3 p-3 ${styles.mainContainer}`}>
      <MDBRow className="justify-content-center align-items-center">
        <MDBCol md="6" className={`p-4 ${styles.signupContainer}`}>

          <h1 className="text-center mb-3">Sign Up</h1>
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          <form onSubmit={handleSignup}>
            <MDBRow className="mb-1">
              <MDBCol size="6">
                <div className="mb-1">
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </MDBCol>
              <MDBCol size="6">
                <div className="mb-1">
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </MDBCol>
            </MDBRow>
            <MDBRow className="mb-1">
              <MDBCol size="6">
                <div className="mb-1">
                  <label htmlFor="schoolName" className="form-label">School Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="schoolName"
                    name="schoolName"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                  />
                </div>
              </MDBCol>
              <MDBCol size="6">
                <div className="mb-1">
                  <label htmlFor="schoolIndexId" className="form-label">School Index ID</label>
                  <input
                    type="text"
                    className="form-control"
                    id="schoolIndexId"
                    name="schoolIndexId"
                    value={schoolIndexId}
                    onChange={(e) => setSchoolIndexId(e.target.value)}
                  />
                </div>
              </MDBCol>
            </MDBRow>
            <div className="mb-0.7">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-0.7">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-center pt-1 mb-0.5 pb-1">
              <button className={`${styles.signupButton} btn btn-primary`}>Sign Up</button>
            </div>
            <div className="text-center">
              <Link to="/login" className={styles.loginLink}>Already have an account? Log in</Link>
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

export default SignupForm;