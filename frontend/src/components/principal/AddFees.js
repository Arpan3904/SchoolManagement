import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/AddFees.css'; // Import CSS file for styling

const AddFeesComponent = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    // Fetch classes from backend API
    axios.get(`${process.env.REACT_APP_API_URL}/api/fetch-class`)
      .then(response => {
        setClasses(response.data);
      })
      .catch(error => {
        console.error('Error fetching classes:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Make POST request to add fees
    axios.post(`${process.env.REACT_APP_API_URL}/api/add-fees`, { className: selectedClass, amount })
      .then(response => {
        // Handle success
        console.log('Fees added successfully:', response.data);
        navigate('/student-fee');
      })
      .catch(error => {
        console.error('Error adding fees:', error);
      });
  };

  return (
    <div className="add-fees-container">
      <h2 className="add-fees-heading">Add Fees</h2>
      <form onSubmit={handleSubmit} className="add-fees-form">
        <label className="form-label">Select Class:</label>
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="form-select">
          <option value="">Select Class</option>
          {classes.map((classItem, index) => (
            <option key={index} value={classItem.className}>{classItem.className}</option>
          ))}
        </select>
        <br />
        <label className="form-label">Amount:</label>
        <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} className="form-input" />
        <br />
        <button type="submit" className="button-st">Add Fees</button>
      </form>
    </div>
  );
};

export default AddFeesComponent;
