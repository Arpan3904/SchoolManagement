import React, { useState } from 'react';
import moment from 'moment';
import '../../styles/AttendancePage.css'; // Import CSS file for AttendancePage styling

const AttendancePage = () => {
  // Generate dummy data for attendance records
  const generateDummyData = () => {
    const currentDate = moment().format('YYYY-MM-DD');
    const students = ["John Doe", "Jane Smith", "Alex Johnson", "Emily Brown", "Michael Wilson"];
    const dummyData = students.map(student => ({
      studentName: student,
      attendanceStatus: Math.random() < 0.8 ? "Present" : "Absent", // Randomly generate attendance status
      date: currentDate
    }));
    return dummyData;
  };

  // State to manage attendance data
  const [attendanceData, setAttendanceData] = useState(generateDummyData());

  // Function to mark attendance
  const markAttendance = (index) => {
    setAttendanceData(prevAttendanceData => {
      const updatedData = [...prevAttendanceData];
      updatedData[index].attendanceStatus = updatedData[index].attendanceStatus === "Present" ? "Absent" : "Present";
      return updatedData;
    });
  };

  // Function to get formatted date
  const getFormattedDate = () => {
    return moment().format('MMMM D, YYYY');
  };

  return (
    <div className="attendance-page">
      <h2>Attendance</h2>
      <div className="date-container">
        <p>Today's Date: {getFormattedDate()}</p>
      </div>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Attendance Status</th>
            <th>Mark Attendance</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((record, index) => (
            <tr key={index}>
              <td>{record.studentName}</td>
              <td>{record.attendanceStatus}</td>
              <td>
                <button onClick={() => markAttendance(index)} className={`attendance-button ${record.attendanceStatus}`}>
                  {record.attendanceStatus === "Present" ? "Mark Absent" : "Mark Present"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendancePage;
