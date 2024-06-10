import React from 'react';
import '../../styles/StudentDashboard.css'; // Import CSS file for StudentDashboard styling

const StudentDashboard = () => {
  
  return (
    <div className="student-dashboard-container">
      <h2 className="dashboard-title">Student Dashboard</h2>
      <div className="dashboard-section">
        <h3 className="section-title">Attendance</h3>
        <p className="section-content">View your attendance record here.</p>
      </div>
      <div className="dashboard-section">
        <h3 className="section-title">Assignments</h3>
        <p className="section-content">Access your assignments and submit them.</p>
      </div>
      <div className="dashboard-section">
        <h3 className="section-title">Marks</h3>
        <p className="section-content">Check your marks and grades.</p>
      </div>
      {/* Add more sections for additional dashboard features */}
    </div>
  );
};

export default StudentDashboard;
