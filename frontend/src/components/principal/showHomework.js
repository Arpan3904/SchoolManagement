import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/ShowHomework.css'; 

const ShowHomework = () => {
  const [date, setDate] = useState('');
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [homeworkDetails, setHomeworkDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [filteredHomeworkDetails, setFilteredHomeworkDetails] = useState([]);
  const [error, setError] = useState('');

  const navigate = useNavigate();

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

  const fetchStudents = async (className) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/fetchStudents?class=${className}`);
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
      setError('An error occurred while fetching students.');
    }
  };

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/subjects?class=${selectedClass}`);
      setSubjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setLoading(false);
      setError('An error occurred while fetching subjects.');
    }
  };

  const fetchHomeworkDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/homeworkDetails?studentId=${selectedStudent}&date=${date}&class=${selectedClass}`);
      setHomeworkDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching homework details:', error);
      setLoading(false);
      setError('An error occurred while fetching homework details.');
    }
  };

  const handleStudentClick = async (studentId) => {
    setSelectedStudent(studentId);
  };

  useEffect(() => {
    if (selectedStudent) {
      fetchSubjects();
      fetchHomeworkDetails();
    }
  }, [selectedStudent]); // Run when selectedStudent changes

  const handleSubjectClick = (subjectId) => {
    setSelectedSubject(subjectId);
    const filteredHomework = homeworkDetails.filter(homework => homework.subjectId === subjectId);
    setFilteredHomeworkDetails(filteredHomework);
  };

  const getSubjectCompletionStatus = (subjectId) => {
    const homework = homeworkDetails.find(homework => homework.subjectId === subjectId);
    return homework ? 'Completed' : 'Incomplete';
  };

  return (
    <div className="container">
      <h2>Show Homework</h2>
      {error && <p className="error">{error}</p>}
      <div>
        <label className="label">Date:</label>
        <input type="date" className="inputDate" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div>
        <label className="label">Class:</label>
        <select className="selectClass" value={selectedClass} onChange={(e) => {
          setSelectedClass(e.target.value);
          fetchStudents(e.target.value); // Fetch students when class changes
        }}>
          <option value="">Select Class</option>
          {classes.map((classItem) => (
            <option key={classItem._id} value={classItem.className}>
              {classItem.className}
            </option>
          ))}
        </select>
      </div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.firstName + " " + student.lastName}</td>
                  <td>
                    <button className="button-st" onClick={() => handleStudentClick(student._id)}>View Homework</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div>
        {subjects.map((subject) => (
          <div key={subject._id}>   
            <button className="subjectButton" onClick={() => handleSubjectClick(subject._id)}>
              {subject.subjectName} - {getSubjectCompletionStatus(subject._id)}
            </button>
          </div>
        ))}
      </div>
      <div>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {filteredHomeworkDetails.length === 0 ? (
              <p className="noData">No homework details available.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Question Link</th>
                    <th>Submission Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHomeworkDetails.map((assignment) => (
                    <tr key={assignment._id}>
                      <td>{assignment.title}</td>
                      <td>{assignment.description}</td>
                      <td><a href={assignment.questionLink} target="_blank" rel="noopener noreferrer">View</a></td>
                      <td>{assignment.submissions.length > 0 ? (assignment.submissions[0].isPending ? 'Pending' : 'Completed') : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
      <div>
        <button
          onClick={() => navigate('/add_homework')}
          className="button-st"
        >
          Add Homework
        </button>
      </div>
    </div>
  );
};

export default ShowHomework;
