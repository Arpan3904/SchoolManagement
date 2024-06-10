import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/ShowSubject.css';

const ShowSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/show-subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const navigateToAddSubject = () => {
    navigate('/add-subject');
  };

  return (
    <div className="subjects-container">
      <h2>Subjects</h2>
      <button className="add-subject-button" onClick={navigateToAddSubject}>
        Add Subject
      </button>
      <table className="subjects-table">
        <thead>
          <tr>
            <th>Class</th>
            <th>Subject Name</th>
            <th>Subject Code</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject._id}>
              <td>{subject.class}</td>
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
