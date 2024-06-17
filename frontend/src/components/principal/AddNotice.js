import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/AddNotice.module.css';

const AddNotice = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetClasses, setTargetClasses] = useState([]);
  const [targetAudience, setTargetAudience] = useState('students');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [message, setMessage] = useState('');
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('An error occurred while fetching classes.');
    }
  };

  const handleClassChange = (className) => {
    setTargetClasses((prevClasses) =>
      prevClasses.includes(className)
        ? prevClasses.filter((cls) => cls !== className)
        : [...prevClasses, className]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/saveNotice', {
        title,
        content,
        targetClasses,
        targetAudience,
        additionalInfo,
      });
      setMessage(response.data.message);
      clearForm();
    } catch (error) {
      console.error('Error saving notice:', error);
      setMessage('An error occurred while saving the notice.');
    }
  };

  const clearForm = () => {
    setTitle('');
    setContent('');
    setTargetClasses([]);
    setTargetAudience('students');
    setAdditionalInfo('');
  };

  return (
    <div className={styles.containerNotice}>
      <h2>Add Notice</h2>
      {message && <p className={styles.message}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className={styles['form-group']}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <label>Target Classes:</label>
          <div className={styles['class-checkboxes']}>
            {classes.map((classItem) => (
              <label key={classItem._id} className={styles['checkbox-label']}>
                <input
                  type="checkbox"
                  value={classItem.className}
                  checked={targetClasses.includes(classItem.className)}
                  onChange={() => handleClassChange(classItem.className)}
                />
                {classItem.className}
              </label>
            ))}
          </div>
        </div>
        <div className={styles['form-group']}>
          <label>Target Audience:</label>
          <select
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            required
          >
            <option value="students">Students</option>
            <option value="teachers">Teachers</option>
            <option value="both">Both</option>
          </select>
        </div>
        <div className={styles['form-group']}>
          <label>Additional Info:</label>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          />
        </div>
        <button type="submit" className={styles['button-st']}>Save Notice</button>
      </form>
    </div>
  );
};

export default AddNotice;
