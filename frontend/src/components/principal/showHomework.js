import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/ShowHomework.module.css';

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
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/fetchStudents?class=${selectedClass}`);
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
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
    }
  };

  const fetchHomeworkDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/homeworkDetails?studentId=${selectedStudent}&date=${date}&class=${selectedClass}`);
      console.log(response);
      setHomeworkDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching homework details:', error);
      setLoading(false);
    }
  };

  const handleStudentClick = async (studentId) => {
    setSelectedStudent(studentId);
    await fetchSubjects();
    await fetchHomeworkDetails();
  };

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
    <div className={styles.container}>
      <h2>Show Homework</h2>
      <div>
        <label className={styles.label}>Date:</label>
        <input type="date" className={styles.inputDate} value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div>
        <label className={styles.label}>Class:</label>
        <select className={styles.selectClass} value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          <option value="">Select Class</option>
          {classes.map((classItem) => (
            <option key={classItem._id} value={classItem.className}>
              {classItem.className}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button className={styles.button} onClick={fetchStudents}>Fetch Students</button>
      </div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className={styles.table}>
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
                    <button className={styles.button} onClick={() => handleStudentClick(student._id)}>View Homework</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div>
        <h3>Subjects</h3>
        {subjects.map((subject) => (
          <div key={subject._id}>
            <button className={styles.subjectButton} onClick={() => handleSubjectClick(subject._id)}>
              {subject.subjectName} - {getSubjectCompletionStatus(subject._id)}
            </button>
          </div>
        ))}
      </div>
      <div>
        <h3>Homework Details</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {filteredHomeworkDetails.length === 0 ? (
              <p className={styles.noData}>No homework details available.</p>
            ) : (
              <table className={styles.table}>
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
                      {/* <td>{assignment.submissions.length > 0 ? 'Submitted' : 'Not Submitted'}</td> */}
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
          className={styles.button}
        >
          Add Homework
        </button>
      </div>
    </div>
  );
};

export default ShowHomework;
