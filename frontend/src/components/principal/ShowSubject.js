import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/ShowSubject.css';
import { FaTrash, FaPlus } from 'react-icons/fa'; // Importing the trash and plus icons from React Icons

const ShowSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve userRole from localStorage
    const storedUserRole = localStorage.getItem('userRole');
    setUserRole(storedUserRole);

    // Fetch classes if user is not a student
    if (storedUserRole !== 'student') {
      fetchClasses();
    }
  }, []);

  useEffect(() => {
    // Fetch subjects based on selectedClass when it changes
    if (selectedClass) {
      fetchSubjects(selectedClass);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/fetch-class');
      setClasses(response.data);
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  const fetchSubjects = async (selectedClass) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/subjectss?class=${selectedClass}`);
      setSubjects(response.data);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    }
  };

  const navigateToAddSubject = () => {
    navigate('/add-subject');
  };

  const handleClassChange = (e) => {
    const selectedClass = e.target.value;
    setSelectedClass(selectedClass);
  };

  const handleDeleteSubject = async (subjectId) => {
    try {
      await axios.delete(`http://localhost:5000/api/delete-subject/${subjectId}`);
      setSubjects(subjects.filter(subject => subject._id !== subjectId));
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  return (
    <div className="subjects-container">
      <h2>Subjects</h2>
     

      {/* Render the dropdown menu for selecting a class */}
      {userRole !== 'student' && (
        <select value={selectedClass} onChange={handleClassChange}>
          <option value="">Select Class</option>
          {classes.map((classItem) => (
            <option key={classItem._id} value={classItem.className}>
              {classItem.className}
            </option>
          ))}
        </select>
      )}
       {/* Render the "+" button only if userRole is not "student" */}
       {userRole !== 'student' && (
        <button className="add-subject-button" onClick={navigateToAddSubject}>
          <FaPlus className="add-icon" />
        </button>
      )}
      {/* Table to display subjects */}
      <table className="subjects-table">
        <thead>
          <tr>
            <th>Subject Name</th>
            <th>Subject Code</th>
            {userRole !== 'student' && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {/* Render subjects based on selected class */}
          {subjects.map((subject) => (
            <tr key={subject._id}>
              <td>{subject.subjectName}</td>
              <td>{subject.subjectCode}</td>
              {userRole !== 'student' && (
                <td>
                  <button className="delete-buttons" onClick={() => handleDeleteSubject(subject._id)}>
                    <FaTrash className="delete-icons" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      
    </div>
  );
};

export default ShowSubjects;
