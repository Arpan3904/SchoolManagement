import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/ShowMaterial.css'; // Import regular CSS file

const ShowMaterial = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [materials, setMaterials] = useState([]);
  const [error, setError] = useState('');

  const navigate = useNavigate();

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

  const handleClassChange = async (e) => {
    const selectedClass = e.target.value;
    setSelectedClass(selectedClass);
    setSelectedSubject('');
    setMaterials([]);

    try {
      const response = await axios.get(`http://localhost:5000/api/subjects?class=${selectedClass}`);
      setSubjects(response.data);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setError('An error occurred while fetching subjects.');
    }
  };

  const handleSubjectChange = async (e) => {
    const selectedSubject = e.target.value;
    setSelectedSubject(selectedSubject);

    try {
      const response = await axios.get(`http://localhost:5000/api/materials?class=${selectedClass}&subject=${selectedSubject}`);
      console.log(response);
      setMaterials(response.data);
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError('An error occurred while fetching materials.');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="show-material-container">
      <h2>Show Materials</h2>
      {error && <p className="error">{error}</p>}
      <div className="form-group">
        <label htmlFor="class-select">Select Class:</label>
        <select id="class-select" value={selectedClass} onChange={handleClassChange} required>
          <option value="">Select Class</option>
          {classes.map((classItem) => (
            <option key={classItem._id} value={classItem.className}>{classItem.className}</option>
          ))}
        </select>
      </div>
      {selectedClass && (
        <div className="form-group">
          <label htmlFor="subject-select">Select Subject:</label>
          <select id="subject-select" value={selectedSubject} onChange={handleSubjectChange} required>
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject.subjectName}>{subject.subjectName}</option>
            ))}
          </select>
        </div>
      )}
      {selectedSubject && (
        <table className="materials-table">
          <thead>
            <tr>
              <th>Uploaded At</th>
              <th>Material Link</th>
            </tr>
          </thead>
          <tbody>
            {materials.length > 0 ? (
              materials.map((material, index) => (
                <tr key={index}>
                  <td>{formatDate(material.uploadedAt)}</td>
                  <td><a href={material.materialLink} target="_blank" rel="noopener noreferrer">View Material</a></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No Material Found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      <button 
        className='button-st'
        onClick={() => navigate('/add_material')}
      >
        Add Material
      </button>
    </div>
  );
};

export default ShowMaterial;
