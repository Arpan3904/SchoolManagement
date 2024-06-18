import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/ShowStudentBirthday.module.css';

const ShowStudentBirthday = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudentBirthdays();
  }, []);

  const fetchStudentBirthdays = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/birthdays`);
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching student birthdays:', error);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Today's Birthdays</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles.cardsContainer}>
          {students.length === 0 ? (
            <p>No birthdays today.</p>
          ) : (
            students.map((student) => (
              <div className={styles.card} key={student._id}>
                <img
                  src={student.photo || 'https://via.placeholder.com/150'}
                  alt="Student Photo"
                  className={styles.studentPhoto}
                />
                <div className={styles.studentInfo}>
                  <p className={styles.studentName}>{`${student.firstName} ${student.middleName} ${student.lastName}`}</p>
                  <p className={styles.studentClass}>{student.className}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ShowStudentBirthday;
