import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/ShowSubject.css';

const ShowSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    fetchClasses();

    // Retrieve userRole from localStorage
    const storedUserRole = localStorage.getItem('userRole');
    setUserRole(storedUserRole);
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/classes');
      setClasses(response.data);
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  const fetchSubjects = async () => {
    try {
      if (selectedClass) {
        const response = await axios.get(`http://localhost:5000/api/subjects?class=${selectedClass}`);
        setSubjects(response.data);
      } else {
        setSubjects([]); // Reset subjects if no class is selected
      }
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
    fetchSubjects();
  };

  return (
    <div className="subjects-container">
      <h2>Subjects</h2>
      {/* Render the "Add Subject" button only if userRole is not "teacher" */}
      {userRole !== 'teacher' && (
        <button className="add-subject-button" onClick={navigateToAddSubject}>
          Add Subject
        </button>
      )}
      {/* Dropdown to select class */}
      <select value={selectedClass} onChange={handleClassChange}>
        <option value="">Select Class</option>
        {classes.map((classItem) => (
          <option key={classItem._id} value={classItem.classCode}>
            {classItem.className}
          </option>
        ))}
      </select>
      
      {/* Table to display subjects */}
      <table className="subjects-table">
        <thead>
          <tr>
            <th>Subject Name</th>
            <th>Subject Code</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject._id}>
              <td>{subject.subjectName}</td>
              <td>{subject.subjectCode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowSubjects;
