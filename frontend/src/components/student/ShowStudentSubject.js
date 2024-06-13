import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/ShowSubject.css';

const ShowSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [userRole, setUserRole] = useState('');
  const [studentClass, setStudentClass] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve userRole and email from localStorage
    const storedUserRole = localStorage.getItem('userRole');
    const email = localStorage.getItem('email');
    setUserRole(storedUserRole);

    if (storedUserRole === 'student') {
      fetchStudentClassDetails(email);
    } else {
      fetchClasses();
    }
  }, []);

  useEffect(() => {
    if (userRole === 'student' && studentClass.className) {
      fetchSubjects();
    }
  }, [studentClass.className, userRole]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/fetch-class');
      setClasses(response.data);
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  const fetchStudentClassDetails = async (email) => {
    try {
      const studentResponse = await axios.get(`http://localhost:5000/api/fetchStbyEmail?email=${email}`);
      const student = studentResponse.data;
      const classResponse = await axios.get(`http://localhost:5000/api/class/${student.classId}`);
      setStudentClass(classResponse.data);
    } catch (err) {
      console.error('Error fetching student or class data:', err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/show-subjects');
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

  return (
    <div className="subjects-container">
      <h2>Subjects</h2>
      {/* Render the "Add Subject" button only if userRole is not "student" */}
      {userRole !== 'student' && (
        <button className="add-subject-button" onClick={navigateToAddSubject}>
          Add Subject
        </button>
      )}

      {/* Display class details */}
      <div className="class-details">
        {userRole === 'student' ? (
          <h3>Class Name: {studentClass.className}</h3>
        ) : (
          <select value={selectedClass} onChange={handleClassChange}>
            <option value="">Select Class</option>
            {classes.map((classItem) => (
              <option key={classItem._id} value={classItem.className}>
                {classItem.className}
              </option>
            ))}
          </select>
        )}
        {/* Add other class details as needed */}
      </div>

      {/* Table to display subjects */}
      <table className="subjects-table">
        <thead>
          <tr>
            <th>Subject Name</th>
            <th>Subject Code</th>
          </tr>
        </thead>
        <tbody>
          {/* Filter subjects based on the selected class */}
          {subjects.filter(subject => {
            if (userRole === 'student') {
              return subject.class === studentClass.className;
            } else {
              return selectedClass === '' || subject.class === selectedClass;
            }
          }).map((subject) => (
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
