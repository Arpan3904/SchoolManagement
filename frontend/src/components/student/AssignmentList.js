import React from 'react';
import '../../styles/AssignmentList.css'; // Import CSS file for AssignmentList styling

const AssignmentList = () => {
  const assignments = [
    {
      title: "Math Assignment",
      dueDate: "2024-04-15",
      status: "Pending",
      link: "https://example.com/math-assignment"
    },
    {
      title: "Science Assignment",
      dueDate: "2024-04-20",
      status: "Completed",
      link: "https://example.com/science-assignment"
    },
    // Add more assignments as needed
  ];
  return (
    <div className="assignment-list-container">
      <h2 className="list-title">Assignments</h2>
      <div className="assignment-items">
        {assignments.map((assignment, index) => (
          <div key={index} className="assignment-item">
            <h3 className="assignment-title">{assignment.title}</h3>
            <p className="assignment-details">Due Date: {assignment.dueDate}</p>
            <p className="assignment-details">Status: {assignment.status}</p>
            <a href={assignment.link} className="assignment-link" target="_blank" rel="noopener noreferrer">View Assignment</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentList;
