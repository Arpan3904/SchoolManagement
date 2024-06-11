import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/ShowEvent.css';

const ShowEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/showEvents');
        setEvents(response.data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('An error occurred while fetching events.');
      }
    };

    fetchEvents();
  }, []);

  const handleCancelEvent = async (eventId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cancelEvent/${eventId}`);
      setEvents(events.filter(event => event._id !== eventId));
    } catch (err) {
      console.error('Error canceling event:', err);
      setError('An error occurred while canceling the event.');
    }
  };

  const handleAddEvent = () => {
    navigate('/add_event');
  };

  const addEventButtonStyle = {
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '5px',
  };

  return (
    <div className="events-container">
      <div className="events-header-container">
        <h1 className="events-header">Events</h1>
        <button style={addEventButtonStyle} onClick={handleAddEvent}>Add Event</button>
        </div>
      {error && <p>{error}</p>}
      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <ul className="events-list">
          {events.map((event) => (
            <li key={event._id} className="event-item">
              <h2 className="event-title">{event.title}</h2>
              <p className="event-description">{event.description}</p>
              <div className="event-details">
                <p><strong>Start Date:</strong> {new Date(event.startDate).toLocaleString()}</p>
                <p><strong>End Date:</strong> {new Date(event.endDate).toLocaleString()}</p>
                <p><strong>Location:</strong> {event.location}</p>
              </div>
              <button className="cancel-button" onClick={() => handleCancelEvent(event._id)}>Cancel Event</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShowEvents;
