import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/ShowClass.css'; // Import CSS file for ClassList styling
const ClassList = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
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

  const handleCheckboxChange = (classId) => {
    setSelectedClasses(prevSelectedClasses =>
      prevSelectedClasses.includes(classId)
        ? prevSelectedClasses.filter(id => id !== classId)
        : [...prevSelectedClasses, classId]
    );
  };

  const handleDeleteClasses = async () => {
    try {
      await axios.post('http://localhost:5000/api/delete-classes', { classIds: selectedClasses });
      setClasses(classes.filter(classDetails => !selectedClasses.includes(classDetails._id)));
      setSelectedClasses([]);
    } catch (error) {
      console.error('Error deleting classes:', error);
    }
  };

  return (
    <div className="class-list-container">
      <h2>Classes</h2>
      <div className="class-list">
        {classes.map((classDetails, index) => (
          
          <div key={index} className="class-card">
            <input
              type="checkbox"
              checked={selectedClasses.includes(classDetails._id)}
              onChange={() => handleCheckboxChange(classDetails._id)}
            />
            <div onClick={() => handleClassClick(classDetails._id)}>
              <h3>{classDetails.className}</h3>
              <p><strong>Teacher:</strong> {classDetails.classTeacher}</p>
              <p><strong>Room:</strong> {classDetails.roomNo}</p>
              <p><strong>Capacity:</strong> {classDetails.capacity}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Render the "Add Class" button only if userRole is not "teacher" */}
      {userRole !== 'teacher' && (
        
        <div className="button-container">
          <button className="add-class-button" onClick={() => navigate('/add-class')}>
            Add Class
          </button>
          {selectedClasses.length > 0 && (
            <button className="delete-class-button" onClick={handleDeleteClasses}>
              Delete Selected Classes
            </button>
          )}
        </div>
      )}
    </div>
  );
};
export default ClassList;