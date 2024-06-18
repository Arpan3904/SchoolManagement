import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/ShowHomework.css';

const ShowHomework = () => {
  const [date, setDate] = useState('');
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [homeworkDetails, setHomeworkDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null); // State to keep track of selected subject

  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass && date) {
      fetchHomeworkDetails();
    }
  }, [selectedClass, date]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/classes`);
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('An error occurred while fetching classes.');
    }
  };

  const fetchStudents = async (className) => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetchStudents?class=${className}`);
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
      setError('An error occurred while fetching students.');
    }
  };

  const fetchHomeworkDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/homeworkDetails?date=${date}&class=${selectedClass}`);
      setHomeworkDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching homework details:', error);
      setLoading(false);
      setError('An error occurred while fetching homework details.');
    }
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(selectedStudent && selectedStudent._id === student._id ? null : student);
  };

  const getSubjectsFromHomework = () => {
    const subjects = [];
    homeworkDetails.forEach(homework => {
      if (!subjects.some(subject => subject._id === homework.subjectId)) {
        subjects.push({
          _id: homework.subjectId,
          subjectName: homework.subjectName
        });
      }
    });
    return subjects;
  };

  const getSubjectCompletionStatus = (subjectId) => {
    const homeworkForSubject = homeworkDetails.filter(homework => homework.subjectId === subjectId);
    if (homeworkForSubject.length === 0) {
      return 'No Homework Given';
    }

    const studentSubmission = homeworkForSubject.find(homework => 
      homework.submissions.some(submission => submission.studentId._id === selectedStudent._id)
    );
    if (!studentSubmission) {
      return 'Incomplete';
    }

    const submissionStatus = studentSubmission.submissions.find(submission => submission.studentId._id === selectedStudent._id).isPending ? 'Pending' : 'Completed';
    return submissionStatus;
  };

  const handleClickSubject = (subjectId) => {
    setSelectedSubject(selectedSubject === subjectId ? null : subjectId);
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
          fetchStudents(e.target.value);
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
        ) : homeworkDetails.length === 0 ? (
          <p>No Homework Given</p>
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
                <React.Fragment key={student._id}>
                  <tr>
                    <td>{student.firstName + " " + student.lastName}</td>
                    <td>
                      <button className="button-st" onClick={() => handleStudentClick(student)}>View Homework</button>
                    </td>
                  </tr>
                  {selectedStudent && selectedStudent._id === student._id && (
                    <tr>
                      <td colSpan="2">
                        <div>
                          {getSubjectsFromHomework().map((subject) => (
                            <div key={subject._id}>
                              <button className="subjectButton" onClick={() => handleClickSubject(subject._id)}>
                                {subject.subjectName} - {getSubjectCompletionStatus(subject._id)}
                              </button>
                              {selectedSubject === subject._id && getSubjectCompletionStatus(subject._id) === 'Completed' && (
                                <div>
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
                                      {homeworkDetails.filter(homework => homework.subjectId === subject._id && homework.submissions.some(submission => submission.studentId._id === selectedStudent._id)).map((assignment) => (
                                        <tr key={assignment._id}>
                                          <td>{assignment.title}</td>
                                          <td>{assignment.description}</td>
                                          <td><a href={assignment.questionLink} target="_blank" rel="noopener noreferrer">View</a></td>
                                          <td>{assignment.submissions.find(submission => submission.studentId._id === selectedStudent._id).isPending ? 'Pending' : 'Completed'}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
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
