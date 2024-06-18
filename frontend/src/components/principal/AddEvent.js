import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/AddEvent.css';

const AddEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/saveEvent`, {
        title,
        description,
        startDate,
        endDate,
        location
      });

      console.log(response.data);
    } catch (err) {
      console.error('Error adding event:', err);
      setError('An error occurred while adding the event.');
    }
  };

  return (
    <div className="add-event-container">
      <h2>Add Event</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="start-date">Start Date:</label>
          <input type="datetime-local" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="end-date">End Date:</label>
          <input type="datetime-local" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>
        <button type="submit" className="submit-button">Add Event</button>
      </form>
    </div>
  );
};

export default AddEvent;
