import { useNavigate } from 'react-router-dom';
import '../../styles/PrincipalDashboard.css'; // Import the provided CSS file
import React from 'react';

const TeacherDashboard = () => {
  const navigate = useNavigate();

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
          <h2>Personal Management</h2>
          <div className="administration-setup">
            {renderSectionCard('🏫', 'Class', '/class-management')}
            {renderSectionCard('📚', 'Subject', '/subject-management')}
            {renderSectionCard('⏰', 'Timetable', '/timetable-management')}
            {renderSectionCard('📜', 'Syllabus', '/show-syllabus')}
            {renderSectionCard('📋', 'Attendance', '/show-teacher-attendance')}
            {renderSectionCard('🆔', 'Id Card', '/show-teacher-idcard')}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Student Management</h2>
          <div className="students-section">
            {renderSectionCard('➕', 'Add Student', '/class-management')}
            {renderSectionCard('👨‍🎓', 'Student List', '/student-list')}
            {renderSectionCard('📋', 'Student Attendance', '/attendance')}
            {renderSectionCard('📝', 'Homework', '/homework')}
            {renderSectionCard('🆔', 'Student Id Card', '/idcard')}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Additional Features</h2>
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

export default TeacherDashboard;
