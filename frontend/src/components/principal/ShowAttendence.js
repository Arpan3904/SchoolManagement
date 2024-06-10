import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/ShowAttendance.css';

const ShowAttendance = () => {
  const [currentMonthDays, setCurrentMonthDays] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    // Fetch students and attendance data here
    // Example: const studentsData = fetchStudentsData();
    //          const attendanceData = fetchAttendanceData();

    // Set fetched data
    // setStudents(studentsData);
    // setAttendance(attendanceData);

    // For demonstration, I'm using mock data
    const mockStudents = ['John', 'Alice', 'Bob', 'Emma'];
    const mockCurrentMonthDays = Array.from({ length: 31 }, (_, i) => i + 1); // Assuming 31 days in a month
    setStudents(mockStudents);
    setCurrentMonthDays(mockCurrentMonthDays);
  }, []);

  const toggleAttendance = (student, day) => {
    // Implement logic to toggle attendance for a student on a particular day
    // Example: const updatedAttendance = updateAttendance(student, day);
    //          setAttendance(updatedAttendance);

    // For demonstration, I'm updating attendance randomly
    const updatedAttendance = { ...attendance };
    updatedAttendance[student] = { ...updatedAttendance[student] };
    updatedAttendance[student][day] = updatedAttendance[student][day] === 'present' ? 'absent' : 'present';
    setAttendance(updatedAttendance);
  };

  return (
    <div className="attendance-container">
      <h1 className="attendance-title">Attendance for {new Date().toLocaleString('default', { month: 'long' })}</h1>
      <div className="attendance-grid">
        {/* Horizontal Row for Dates */}
        <div className="dates-row">
          <div className="empty-cell"></div>
          {currentMonthDays.map((day) => (
            <div key={day} className="date-cell">
              {day}
            </div>
          ))}
        </div>
        {/* Vertical Column for Students */}
        {students.map((student) => (
          <div key={student} className="student-row">
            <div className="student-name-cell">{student}</div>
            {currentMonthDays.map((day) => (
              <div key={`${student}-${day}`} className={`attendance-cell ${attendance[student]?.[day] || 'absent'}`} onClick={() => toggleAttendance(student, day)}>
                {/* You can show some icon or color based on attendance */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowAttendance;
