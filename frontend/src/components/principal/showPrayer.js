import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/Prayer.module.css';

const Prayer = () => {
  const [prayers, setPrayers] = useState([]);
  const [editingDay, setEditingDay] = useState(null);
  const [newLink, setNewLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    fetchPrayers();
  }, []);

  const fetchPrayers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/prayers`);
      setPrayers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prayers:', error);
      setLoading(false);
    }
  };

  const updatePrayer = async (day) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/prayers/${day}`, { link: newLink });
      setPrayers(prayers.map(prayer => prayer.day === day ? response.data : prayer));
      setEditingDay(null);
      setNewLink('');
    } catch (error) {
      console.error('Error updating prayer:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Weekly Prayers</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Day</th>
              <th>Prayer Link</th>
              {userRole !== 'student' && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {prayers.map((prayer) => (
              <tr key={prayer.day}>
                <td>{prayer.day}</td>
                <td>
                  {editingDay === prayer.day ? (
                    <input
                      type="text"
                      value={newLink}
                      onChange={(e) => setNewLink(e.target.value)}
                      className={styles.input}
                    />
                  ) : (
                    <a href={prayer.link} target="_blank" rel="noopener noreferrer">{prayer.link}</a>
                  )}
                </td>
                {userRole !== 'student' && (
                  <td>
                    {editingDay === prayer.day ? (
                      <button onClick={() => updatePrayer(prayer.day)} className="button-st">Save</button>
                    ) : (
                      <button onClick={() => { setEditingDay(prayer.day); setNewLink(prayer.link); }} className="button-st">Update</button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Prayer;
