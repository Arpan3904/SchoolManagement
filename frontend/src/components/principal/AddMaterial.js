import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/AddMaterial.css'; 

const AddMaterial = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [materialLink, setMaterialLink] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {

    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/classes`);
        setClasses(response.data);
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('An error occurred while fetching classes.');
      }
    };

    fetchClasses();
  }, []);

  const handleClassChange = async (e) => {
    const selectedClass = e.target.value;
    setSelectedClass(selectedClass);

    try {
      // Fetch subjects based on the selected class
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/subjects?class=${selectedClass}`);
      setSubjects(response.data);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setError('An error occurred while fetching subjects.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Submit the form data (class, subject, material link) to the backend
      await axios.post(`${process.env.REACT_APP_API_URL}/api/saveMaterials`, {
        className: selectedClass,
        subject: selectedSubject,
        materialLink,
      });

      setSelectedClass('');
      setSelectedSubject('');
      setMaterialLink('');
    } catch (err) {
      console.error('Error adding material:', err);
      setError('An error occurred while adding the material.');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add Material</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select Class:</label>
          <select value={selectedClass} onChange={handleClassChange} required>
            <option value="">Select Class</option>
            {classes.map((classItem) => (
              <option key={classItem._id} value={classItem.className}>{classItem.className}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Select Subject:</label>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} required>
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject.subjectName}>{subject.subjectName}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Material Link:</label>
          <input type="text" value={materialLink} onChange={(e) => setMaterialLink(e.target.value)} required />
        </div>
        <button
          type="submit"
          className='button-st'
        
        >
          Add Material
        </button>
    </form>
    </div>
  );
};

export default AddMaterial;
