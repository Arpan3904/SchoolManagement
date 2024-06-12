import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Gallery.css'; 

const Gallery = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/showEvents');
        const currentDate = new Date();
        const pastEvents = response.data.filter(event => new Date(event.endDate) < currentDate);
        setEvents(pastEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('An error occurred while fetching events.');
      }
    };

    fetchEvents();
  }, []);

  const handleViewImages = (eventId) => {
    navigate(`/showImages/${eventId}`);
  };

  return (
    <div>
      <h2>Completed Events</h2>
    <div className="gallery-container">
      
      {error && <p>{error}</p>}
      <div className="event-grid">
        {events.map(event => (
          <div key={event._id} className="event-card" onClick={() => handleViewImages(event._id)}>
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <div className="event-details">
              <p><strong>Start Date:</strong> {new Date(event.startDate).toLocaleString()}</p>
              <p><strong>End Date:</strong> {new Date(event.endDate).toLocaleString()}</p>
              <p><strong>Location:</strong> {event.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Gallery;
