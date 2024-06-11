import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/ShowMaterial.css'; // Import the CSS module

const ShowMaterial = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/classes');
        setClasses(response.data);
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('An error occurred while fetching classes.');
      }
    };

    fetchClasses();
  }, []);

  const handleClassClick = async (classItem) => {
    setSelectedClass(classItem);
    setSelectedSubject(null);
    setMaterials([]);

    try {
      const response = await axios.get(`http://localhost:5000/api/subjects?class=${classItem.className}`);
      setSubjects(response.data);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setError('An error occurred while fetching subjects.');
    }
  };

  const handleSubjectClick = async (subject) => {
    setSelectedSubject(subject);

    try {
      const response = await axios.get(`http://localhost:5000/api/materials?class=${selectedClass.className}&subject=${subject.subjectName}`);
      setMaterials(response.data);
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError('An error occurred while fetching materials.');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Show Materials</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div>
        <h3>Classes</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Class</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((classItem) => (
              <tr key={classItem._id} onClick={() => handleClassClick(classItem)}>
                <td>{classItem.className}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedClass && (
        <div>
          <h3>Subjects for {selectedClass.className}</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Subject</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject._id} onClick={() => handleSubjectClick(subject)}>
                  <td>{subject.subjectName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedSubject && (
        <div>
          <h3>Materials for {selectedSubject.subjectName}</h3>
          {materials.length > 0 ? (
            <ul>
              {materials.map((material, index) => (
                <li key={index}>
                  <a href={material.materialLink} target="_blank" rel="noopener noreferrer">
                    {material.materialLink}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No Material Found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowMaterial;
