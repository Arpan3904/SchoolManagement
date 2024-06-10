import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShowSyllabusComponent = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [syllabus, setSyllabus] = useState('');

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

  const handleClassChange = async (e) => {
    setSelectedClass(e.target.value);
    try {
      const response = await axios.get(`http://localhost:5000/api/get-syllabus?className=${e.target.value}`);
      if (response.data.syllabus) {
        setSyllabus(response.data.syllabus.syllabus1);
      } else {
        setSyllabus('');
      }
    } catch (error) {
      console.error('Error fetching syllabus:', error);
      setSyllabus('');
    }
  };

  return (
    <div>
      <h2>Show Syllabus</h2>
      <label>Select Class:</label>
      <select value={selectedClass} onChange={handleClassChange}>
        <option value="">Select Class</option>
        {classes.map((classItem, index) => (
          <option key={index} value={classItem.className}>{classItem.className}</option>
        ))}
      </select>
      <br />
      {syllabus && (
        <div>
          <h3>Syllabus for {selectedClass}</h3>
          <p>{syllabus}</p>
        </div>
      )}
    </div>
  );
};

export default ShowSyllabusComponent;
