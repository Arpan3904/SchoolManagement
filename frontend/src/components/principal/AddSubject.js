import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/AddSubject.css'


const AddSubject = () => {
    const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/fetch-class');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/add-subject', {
        class: selectedClass,
        subjectName,
        subjectCode
      });
      console.log('Subject added successfully');
      navigate('/subject-management');
      setSubjectName('');
      setSubjectCode('');
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  return (
    <div className="add-subject-container">
      <h2>Add Subject</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="classSelect">Class:</label>
          <select id="classSelect" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="">Select Class</option>
            {classes.map((classItem) => (
              <option key={classItem._id} value={classItem.className}>
                {classItem.className}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="subjectName">Subject Name:</label>
          <input type="text" id="subjectName" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="subjectCode">Subject Code:</label>
          <input type="text" id="subjectCode" value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} />
        </div>
        <button type="submit">Add Subject</button>
      </form>
    </div>
  );
};

export default AddSubject;
