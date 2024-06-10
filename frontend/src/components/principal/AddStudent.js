import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment';

import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import '../../styles/AddStudent.css'; 

const AddStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [studentInfo, setStudentInfo] = useState({
    rollNo: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    contactNo: '',
    email: '',
    birthdate: '',
    childUid: '',
    principal: localStorage.getItem('principal'),
    classId: id,
    userRole : 'student'
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStudentInfo({ ...studentInfo, [name]: value });
  };

  const handleDateChange = (date) => {
    const formattedDate = moment(date).format('DD/MM/YYYY');
    setStudentInfo({ ...studentInfo, birthdate: formattedDate });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/add-student', studentInfo);
      navigate(`/class/${id}/student-management`); // Redirect to the specified route
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  return (
    <div className="add-student-container">
      <h2>Add Student</h2>
      <form className="add-student-form" onSubmit={handleSubmit}>
        <div className="horizontal-field">
          <label>Roll No:</label>
          <input type="text" name="rollNo" value={studentInfo.rollNo} onChange={handleInputChange} />
        </div>
        <div className="horizontal-fields">
          <div className="horizontal-field">
            <label>First Name:</label>
            <input type="text" name="firstName" value={studentInfo.firstName} onChange={handleInputChange} />
          </div>
          <div className="horizontal-field">
            <label>Middle Name:</label>
            <input type="text" name="middleName" value={studentInfo.middleName} onChange={handleInputChange} />
          </div>
          <div className="horizontal-field">
            <label>Last Name:</label>
            <input type="text" name="lastName" value={studentInfo.lastName} onChange={handleInputChange} />
          </div>
        </div>
        <div className="vertical-fields">
          <label>Gender:</label>
          <select name="gender" value={studentInfo.gender} onChange={handleInputChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <label>Birthdate:</label>
          <Datetime
  name="birthdate"
  value={studentInfo.birthdate}
  onChange={handleDateChange}
  inputProps={{ placeholder: 'Select Birthdate', readOnly: true }}
  dateFormat="DD/MM/YYYY"
  timeFormat={false}
/>
          <label>Contact No:</label>
          <input type="text" name="contactNo" value={studentInfo.contactNo} onChange={handleInputChange} />
          <label>Email:</label>
          <input type="email" name="email" value={studentInfo.email} onChange={handleInputChange} />
          <label>Child UID:</label>
          <input type="text" name="childUid" value={studentInfo.childUid} onChange={handleInputChange} />
        </div>
        <button type="submit">Add Student</button>
      </form>
    </div>
  );
};

export default AddStudent;
