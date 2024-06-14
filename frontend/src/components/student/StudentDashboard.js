import { useNavigate } from 'react-router-dom';
import '../../styles/PrincipalDashboard.css'; // Reuse the provided CSS file
import React from 'react';

const StudentDashboard = () => {
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
          <h2>Academic Information</h2>
          <div className="administration-setup">
            {renderSectionCard('📚', 'Subject', '/subject-management')}
            {renderSectionCard('⏰', 'Timetable', '/timetable-management')}
            {renderSectionCard('📜', 'Syllabus', '/show-student-syllabus')}
           
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Student Activities</h2>
          <div className="students-section">
            {renderSectionCard('📋', 'Attendance', '/attendance')}
            {renderSectionCard('📝', 'Homework', '/homework')}
            {renderSectionCard('💵', 'Fee', '/student-fee')}
            {renderSectionCard('🆔', 'ID Card', '/idcard')}
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

export default StudentDashboard;
