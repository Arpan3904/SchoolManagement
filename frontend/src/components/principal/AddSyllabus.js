import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddSyllabusComponent = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [syllabus1, setSyllabus] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/add-syllabus', { className: selectedClass, syllabus1 });
      alert('Syllabus added successfully');
    } catch (error) {
      console.error('Error adding syllabus:', error);
      alert('Failed to add syllabus');  
    }
  };

  return (
    <div>
      <h2>Add Syllabus</h2>
      <form onSubmit={handleSubmit}>
        <label>Select Class:</label>
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="">Select Class</option>
          {classes.map((classItem, index) => (
            <option key={index} value={classItem.className}>{classItem.className}</option>
          ))}
        </select>
        <br />
        <label>Syllabus:</label>
        <textarea value={syllabus1} onChange={(e) => setSyllabus(e.target.value)} rows="4" cols="50"></textarea>
        <br />
        <button type="submit">Add Syllabus</button>
      </form>
    </div>
  );
};

export default AddSyllabusComponent;
