import { useNavigate } from 'react-router-dom';
import '../../styles/PrincipalDashboard.css'; // Import the provided CSS file
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const SchoolDashboard = () => {
  const navigate = useNavigate();
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true); // State to track navigation bar expansion

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

    // Handle resize to adjust margin-left dynamically
    const handleResize = () => {
      setIsExpanded(window.innerWidth > 600); // Set isExpanded based on screen width
    };

    // Initial check on component mount
    handleResize();

    // Event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
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
      <div className={`school-dashboard-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
        

        <div className="dashboard-section">
          <h2>Administration Setup</h2>
          <div className="administration-setup">
            
            {renderSectionCard('📚', 'Subject', '/subject-management')}
            {renderSectionCard('⏰', 'Timetable', '/timetable-management')}
            {renderSectionCard('📝', 'Exam Schedule', '/show-exam-schedule')}
        
            
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Students</h2>
          <div className="students-section">
            {renderSectionCard('🏫', 'Class', '/class-management')}
            {renderSectionCard('👨‍🎓', 'Student List', '/student-list')}
            {renderSectionCard('📋', 'Attendance', '/showattendance')}
            {renderSectionCard('➕', 'Add Student', '/class-management')}
            {renderSectionCard('📝', 'Homework', '/homework')}
            {renderSectionCard('🆔', 'ID Card', '/idcard')}
            {renderSectionCard('💯', 'Marks', '/marks')}
            {renderSectionCard('💵', 'Fee', '/student-fee')}
            {renderSectionCard('🎂', 'Birthday', '/birthday')}
            
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Teachers</h2>
          <div className="teachers-section">
            {renderSectionCard('➕', 'Add Teacher', '/add-teacher')}
            {renderSectionCard('👨‍🏫', 'Teacher List', '/staff-management')}
            {renderSectionCard('📋', 'Attendance', '/teacher-attendance')}
            {renderSectionCard('🆔', 'Id Card', '/show-teacher-idcard')}
            {renderSectionCard('📜', 'Syllabus', '/show-syllabus')}
            {renderSectionCard('📑', 'Material', '/material')}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Others</h2>
          <div className="others-section">

            {renderSectionCard('🖼️', 'Gallery', '/gallery')}
            {renderSectionCard('🔔', 'Notice', '/notice')}
            {renderSectionCard('💬', 'Complain', '/complain')}
            {renderSectionCard('📅', 'Event', '/event')}
            {renderSectionCard('🙏', 'Prayer', '/prayer')}
            
           
            {renderSectionCard('📼', 'Video', '/video')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDashboard;
