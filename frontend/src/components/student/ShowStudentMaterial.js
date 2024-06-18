import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ShowMaterial.css';

const ShowStudentMaterial = () => {
  const [studentClass, setStudentClass] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [materials, setMaterials] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentClassDetails = async (email) => {
      try {
        const studentResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetchStbyEmail?email=${email}`);
        const student = studentResponse.data;
        const classResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/class/${student.classId}`);
        setStudentClass(classResponse.data);
      } catch (err) {
        console.error('Error fetching student or class data:', err);
        setError('An error occurred while fetching student class details.');
      }
    };

    const email = localStorage.getItem('email');
    if (email) {
      fetchStudentClassDetails(email);
    } else {
      setError('No email found in localStorage.');
    }
  }, []);

  useEffect(() => {
    if (studentClass) {
      const fetchSubjects = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/subjects?class=${studentClass.className}`);
          setSubjects(response.data);
        } catch (err) {
          console.error('Error fetching subjects:', err);
          setError('An error occurred while fetching subjects.');
        }
      };

      fetchSubjects();
    }
  }, [studentClass]);

  const handleSubjectChange = async (e) => {
    const selectedSubject = e.target.value;
    setSelectedSubject(selectedSubject);

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/materials?class=${studentClass.className}&subject=${selectedSubject}`);
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
      
      {studentClass && (
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
                <td colSpan="3">No Material Found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShowStudentMaterial;
