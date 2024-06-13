import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ShowStudentHomework.css'; // Make sure the path is correct

const ShowStudentHomework = () => {
  const [date, setDate] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [homeworkList, setHomeworkList] = useState([]);
  const [selectedHomeworkId, setSelectedHomeworkId] = useState(null);
  const [submissionLink, setSubmissionLink] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudentClass();
  }, []);

  const fetchStudentClass = async () => {
    try {
      const email = localStorage.getItem('email');
      const response = await axios.get(`http://localhost:5000/api/fetchStudentClass?email=${email}`);
      setStudentClass(response.data.classId);
    } catch (error) {
      console.error('Error fetching student class:', error);
    }
  };

  const fetchHomework = async () => {
    try {
      const email = localStorage.getItem('email');
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/fetchStudentHomework?date=${date}&classId=${studentClass}&email=${email}`);
      const homeworkData = Array.isArray(response.data.homework) ? response.data.homework : [];
      setHomeworkList(homeworkData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching homework:', error);
      setLoading(false);
    }
  };

  const handleSubmissionUpload = async (homeworkId) => {
    try {
      const email = localStorage.getItem('email');
      const response = await axios.post('http://localhost:5000/api/submitHomework', {
        homeworkId,
        submissionLink,
        email
      });
      if (response.data.success) {
        alert('Homework submitted successfully!');
        setSubmissionLink('');
        setSelectedHomeworkId(null);
        fetchHomework(); // Refresh the homework list to reflect the new submission status
      }
    } catch (error) {
      console.error('Error submitting homework:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="header">Show Homework</h2>
      <div className="inputContainer">
        <label className="label">Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input"
        />
        <button onClick={fetchHomework} className="button">Fetch Homework</button>
      </div>
      <div>
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <div>
            {homeworkList.length === 0 ? (
              <p>No homework assigned for this date and class.</p>
            ) : (
              <ul className="homeworkList">
                {homeworkList.map((homework) => (
                  <li key={homework._id} className="homeworkItem">
                    <p className="subjectName">{homework.subjectName}</p>
                    <h3 className="title">{homework.title}</h3>
                    <p className="description">{homework.description}</p>
                    <p className="questionsLink">Questions Link: <a href={homework.questionLink}>{homework.questionLink}</a></p>
                    <p className="status">
                      Status: {homework.isPending ? 'Pending' : 'Completed'}
                    </p>
                    {homework.isPending && (
                      <div className="submissionContainer">
                        <label className="label">Submission Link:</label>
                        <input
                          type="text"
                          value={selectedHomeworkId === homework._id ? submissionLink : ''}
                          onChange={(e) => setSubmissionLink(e.target.value)}
                          onFocus={() => setSelectedHomeworkId(homework._id)}
                          className="submissionInput"
                        />
                        <button onClick={() => handleSubmissionUpload(homework._id)} className="submissionButton">Upload</button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowStudentHomework;
