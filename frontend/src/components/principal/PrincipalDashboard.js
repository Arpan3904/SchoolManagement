
import { useNavigate } from 'react-router-dom';
import '../../styles/PrincipalDashboard.css'; // Import the provided CSS file
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const SchoolDashboard = () => {
  const navigate = useNavigate();
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);

  useEffect(() => {
    // Fetch total number of students
    axios.get('http://localhost:5000/api/fetch-students')
      .then(response => {
        setTotalStudents(response.data.length);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });

    // Fetch total number of teachers
    axios.get('http://localhost:5000/api/fetch-teachers')
      .then(response => {
        setTotalTeachers(response.data.length);
      })
      .catch(error => {
        console.error('Error fetching teachers:', error);
      });
  }, []);

  const renderSectionCard = (icon, title, route) => {
    const handleClick = () => {
      navigate(route);
    };

    return (
      <div className="section-card" onClick={handleClick}>
        <span className="custom-icon">{icon}</span>
        <p>{title}</p>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="school-dashboard-container">
        <div className="dashboard-section">
          <h2>School Overview</h2>
          <div className="box-layout">
            <div className="overview-box">
              <p>Total Students</p>
              <p>{totalStudents}</p>
            </div>
            <div className="overview-box">
              <p>Total Teachers</p>
              <p>{totalTeachers}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Administration Setup</h2>
          <div className="administration-setup">
            {renderSectionCard('🏫', 'Class', '/class-management')}
            {renderSectionCard('📚', 'Subject', '/subject-management')}
            {renderSectionCard('⏰', 'Timetable', '/timetable-management')}
            {renderSectionCard('💵', 'Fee', '/student-fee')}
            {renderSectionCard('📜', 'Syllabus', '/show-syllabus')}
            {renderSectionCard('🤳', 'QR code', '/qr-code-management')}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Students</h2>
          <div className="students-section">
            {renderSectionCard('➕', 'Add Student', '/class-management')}
            {renderSectionCard('👨‍🎓', 'Student List', '/student-list')}
            {renderSectionCard('📋', 'Attendance', '/showattendance')}
            {renderSectionCard('📝', 'Homework', '/homework')}
            {renderSectionCard('💵', 'Fee', '/student-fee')}
            {renderSectionCard('🆔', 'ID Card', '/idcard')}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Teachers</h2>
          <div className="teachers-section">
            {renderSectionCard('➕', 'Add Teacher', '/add-teacher')}
            {renderSectionCard('👨‍🏫', 'Teacher List', '/staff-management')}
            {renderSectionCard('📋', 'Attendance', '/teacher-attendance')}
            {renderSectionCard('🆔', 'Id Card', '/show-teacher-idcard')}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Others</h2>
          <div className="others-section">
            {renderSectionCard('📅', 'Examination', '/examination')}
            {renderSectionCard('🖼️', 'Gallery', '/gallery')}
            {renderSectionCard('🔔', 'Notice', '/notice')}
            {renderSectionCard('💬', 'Complain', '/complain')}
            {renderSectionCard('📅', 'Event', '/event')}
            {renderSectionCard('🙏', 'Prayer', '/prayer')}
            {renderSectionCard('📑', 'Material', '/material')}
            {renderSectionCard('🎂', 'Birthday', '/birthday')}
            {renderSectionCard('📼', 'Video', '/video')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDashboard;
