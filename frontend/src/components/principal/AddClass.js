import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/AddClass.css'; // Import the CSS file

const AddClass = () => {
  const [formData, setFormData] = useState({
    className: '',
    classTeacher: '',
    roomNo: '',
    capacity: ''
  });

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetchTeacher`);
      setTeachers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setLoading(false);
      // Handle error fetching teachers
    }
  };

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
      await axios.post(`${process.env.REACT_APP_API_URL}/api/add-class`, formData);
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
        <select name="classTeacher" value={formData.classTeacher} onChange={handleChange} required>
          <option value="">Select Class Teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher._id} value={`${teacher.firstName} ${teacher.lastName}`}>
              {`${teacher.firstName} ${teacher.lastName}`}
            </option>
          ))}
        </select>

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
