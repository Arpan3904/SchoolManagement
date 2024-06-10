import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/AddClass.css'; // Import the CSS file

const AddClass = () => {
  const [formData, setFormData] = useState({
    className: '',
    classTeacher: '',
    roomNo: '',
    capacity: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/add-class', formData);
      // Clear form fields after successful submission
      setFormData({
        className: '',
        classTeacher: '',
        roomNo: '',
        capacity: ''
      });
      alert('Class added successfully!');
    } catch (error) {
      console.error('Error adding class:', error);
      alert('Failed to add class');
    }
  };

  return (
    <div className="addClass-container">
      <h2>Add Class</h2>
      <form onSubmit={handleSubmit}>
        <label>Class Name:</label>
        <input type="text" name="className" value={formData.className} onChange={handleChange} required />
        <label>Class Teacher:</label>
        <input type="text" name="classTeacher" value={formData.classTeacher} onChange={handleChange} required />
        <label>Room No:</label>
        <input type="text" name="roomNo" value={formData.roomNo} onChange={handleChange} required />
        <label>Capacity:</label>
        <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required />
        <button type="submit">Add Class</button>
      </form>
    </div>
  );
};

export default AddClass;
