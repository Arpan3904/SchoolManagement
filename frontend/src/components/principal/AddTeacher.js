import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom
import '../../styles/AddTeacher.css';

const AddTeacher = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [degree, setDegree] = useState('');
  const [subject, setSubject] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [userRole, setUserRole] = useState('teacher');
  const [errorMessage, setErrorMessage] = useState('');
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
        const password = Math.floor(100000 + Math.random() * 900000);
       
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/add-teachers`, {
        firstName,
        lastName,
        degree,
        subject,
        contactNo,
        email,
        password,
        photo,
        userRole
      });

      console.log('Teacher added:', response.data);
      navigate('/staff-management');
        
    } catch (error) {
      console.error('Error adding teacher:', error);
      setErrorMessage('Failed to add teacher. Please try again.');
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
        setPhoto(reader.result);
    };

    if (file) {
        reader.readAsDataURL(file);
    }
};

  return (
    <div className="add-teacher-container">
      <h2>Add Teacher</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>First Name:</label>
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <label>Last Name:</label>
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        <label>Degree:</label>
        <input type="text" value={degree} onChange={(e) => setDegree(e.target.value)} required />
        <label>Subject:</label>
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
        <label>Contact No:</label>
        <input type="text" value={contactNo} onChange={(e) => setContactNo(e.target.value)} required />
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Photo: (add below 50kb image)</label>
        <input type="file" accept="image/*" onChange={handlePhotoChange} />
        <button type="submit" className='button-st'>Add Teacher</button>
      </form>
    </div>
  );
};

export default AddTeacher;
