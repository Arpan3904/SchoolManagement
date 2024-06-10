import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TakeAttendance = ({ classId }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/fetch-students?classId=${classId}`);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [classId]);

  const handleAttendance = (studentId) => {
    // Implement your logic to mark attendance for the student with studentId
    // For example, you can send a request to your backend to update the attendance record
    console.log(`Attendance marked for student with ID ${studentId}`);
  };

  return (
    <div>
      <h1>Take Attendance</h1>
      <table>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Last Name</th>
            <th>Mark Attendance</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.rollNo}</td>
              <td>{student.firstName}</td>
              <td>{student.middleName}</td>
              <td>{student.lastName}</td>
              <td>
                <button onClick={() => handleAttendance(student._id)}>Mark</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TakeAttendance;
