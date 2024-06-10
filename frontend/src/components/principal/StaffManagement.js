import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/StaffManagement.css'; // Import CSS file for styling

const StaffManagement = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/fetch-teachers');
        setTeachers(response.data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  // Function to send email to a teacher
  const sendEmail = async (teacher) => {
    try {
      // Use your email sending logic here, for example, using an API endpoint
      await axios.post('http://localhost:5000/api/send-email', {
        email: teacher.email,
        subject: 'Login Credentials',
        body: `Your login credentials:\nEmail: ${teacher.email}\nPassword: ${teacher.password}`,
      });
      alert('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email.');
    }
  };

  // Function to send SMS to a teacher
  const sendSMS = async (teacher) => {
    try {
      // Use your SMS sending logic here, for example, using an API endpoint
      await axios.post('http://localhost:5000/api/send-sms', {
        phoneNumber: teacher.contactNo, // assuming teacher.contactNo is in Indian format
        message: `Hello ${teacher.firstName}, your login credentials are:\nEmail: ${teacher.email}\nPassword: ${teacher.password}`,
      });
      alert('SMS sent successfully!');
    } catch (error) {
      console.error('Error sending SMS:', error);
      alert('Failed to send SMS.');
    }
  };

  return (
    <div className="staff-management-container">
      <h2>Teacher Management</h2>
      <Link to="/add-teacher" className="add-teacher-link">Add Teacher</Link>
      <table className="teacher-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Degree</th>
            <th>Subject</th>
            <th>Contact No</th>
            <th>Email</th>
            <th>Password</th>
            <th>Actions</th> {/* New column for action buttons */}
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher, index) => (
            <tr key={index}>
              <td>{teacher.firstName}</td>
              <td>{teacher.lastName}</td>
              <td>{teacher.degree}</td>
              <td>{teacher.subject}</td>
              <td>{teacher.contactNo}</td>
              <td>{teacher.email}</td>
              <td>{teacher.password}</td>
              <td>
                <button onClick={() => sendEmail(teacher)}>Send Login Email</button>
                <button onClick={() => sendSMS(teacher)}>Send Login SMS</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffManagement;
