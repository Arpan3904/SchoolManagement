import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/ShowClass.css'; // Import CSS file for ClassList styling

const ClassList = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Fetch classes from MongoDB Atlas
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/fetch-class');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();

    // Retrieve userRole from localStorage
    const storedUserRole = localStorage.getItem('userRole');
    setUserRole(storedUserRole);
  }, []);

  const handleClassClick = (classId) => {
    navigate(`/class/${classId}/student-management`);
  };

  return (
    <div className="class-list-container">
      <h2>Classes</h2>
      <div className="class-list">
        {classes.map((classDetails, index) => (
          <div key={index} className="class-card" onClick={() => handleClassClick(classDetails._id)}>
            
            <h3>{classDetails.className}</h3>
            <p><i className="fas fa-user icon"></i><strong>Teacher:</strong> {classDetails.classTeacher}</p>
            <p><i className="fas fa-door-open icon"></i><strong>Room:</strong> {classDetails.roomNo}</p>
            <p><i className="fas fa-users icon"></i><strong>Capacity:</strong> {classDetails.capacity}</p>
          </div>
        ))}
      </div>
      {/* Render the "Add Class" button only if userRole is not "teacher" */}
      {userRole !== 'teacher' && (
        <div className="add-class-button-container">
          <button className="add-class-button" onClick={() => navigate('/add-class')}>
            Add Class
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassList;
