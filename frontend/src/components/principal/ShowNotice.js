import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/showNotice.css';

const ShowNotices = () => {
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole'); // Retrieve user role from localStorage

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/fetchNotice');
        setNotices(response.data);
      } catch (err) {
        console.error('Error fetching notices:', err);
        setError('An error occurred while fetching notices.');
      }
    };

    fetchNotices();
  }, []);

  const handleAddNotice = () => {
    navigate('/add_notice');
  };

  const handleDeleteNotice = async (noticeId) => {
    try {
      await axios.delete(`http://localhost:5000/api/deleteNotice/${noticeId}`);
      setNotices(notices.filter(notice => notice._id !== noticeId));
    } catch (err) {
      console.error('Error deleting notice:', err);
      setError('An error occurred while deleting the notice.');
    }
  };

  return (
    <div className="notices-container">
      <h1>Notices</h1>
      {error && <p className="error">{error}</p>}
      {notices.length === 0 ? (
        <p className="no-notices">No notices available.</p>
      ) : (
        <ul className="notice-list">
          {notices.map((notice) => (
            <li key={notice._id} className="notice-item">
              {userRole === 'principal' && (
                <span className="delete-icon" onClick={() => handleDeleteNotice(notice._id)}>
                  &times;
                </span>
              )}
              <h2>{notice.title}</h2>
              <p>{notice.content}</p>
              <p><strong>Target Classes:</strong> {notice.targetClasses.join(', ')}</p>
              <p><strong>Target Audience:</strong> {notice.targetAudience}</p>
              <p><strong>Additional Info:</strong> {notice.additionalInfo}</p>
              <p><strong>Date:</strong> {new Date(notice.date).toISOString().split('T')[0]}</p>
            </li>
          ))}
        </ul>
      )}
      {/* Conditionally render Add Notice button based on user role */}
      {userRole !== 'teacher' && userRole !== 'student' && (
        <button className='button-st' onClick={handleAddNotice}>Add Notice</button>
      )}
    </div>
  );
};

export default ShowNotices;
