import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ShowTeacherTimetable.css'; // Import CSS file for styling

const ShowTimetable = () => {
  const [timetable, setTimetable] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [teacherFullName, setTeacherFullName] = useState('');

  useEffect(() => {
    // Fetch timetable for the logged-in teacher and selected date
    const fetchTimetable = async () => {
      try {
        // Retrieve teacher's email from localStorage
        const teacherEmail = localStorage.getItem('email'); // Assuming you store teacher's email as 'email' in localStorage
        
        // Fetch teacher's first and last names
        const teacherInfo = await axios.get(`${process.env.REACT_APP_API_URL}/api/teacher/${teacherEmail}`);
        
        let teachername = `${teacherInfo.data.firstName} ${teacherInfo.data.lastName}`;
        setTeacherFullName(teachername);

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/timetable/${teacherEmail}/${selectedDate}`);
        setTimetable(response.data);
      } catch (error) {
        console.error('Error fetching timetable:', error);
      }
    };

    if (selectedDate) {
      fetchTimetable();
    }
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="timetable-container">
      <h2>Timetable</h2>
      <div className="date-picker-container">
        <label htmlFor="datePicker">Select Date:</label>
        <input
          type="date"
          id="datePicker"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
      {timetable ? (
        <div className="timetable">
          <table>
            <thead>
              <tr>
                <th>Sr</th>
                <th>Class</th>
                <th>From</th>
                <th>To</th>
                <th>Subject</th>
              </tr>
            </thead>
            <tbody>
              {timetable.periods.map((period, index) => {
                if (period.teacher.trim() === teacherFullName.trim()) {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{timetable.selectedClass}</td>
                      <td>{period.from}</td>
                      <td>{period.to}</td>
                      <td>{period.subject}</td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
          {timetable.periods.length === 0 && selectedDate && (
            <div className="funny-message">
              <p>Yeah, you are free! 😄</p>
            </div>
          )}
        </div>
      ) : (
        selectedDate ? (
          <>
            <p>No timetable available for the selected date.</p>
            <div className="funny-message">
              <p>Yeah, you are free! 😄</p>
            </div>
          </>
        ) : (
          <p>Please select a date to view the timetable.</p>
        )
      )}
    </div>
  );
};

export default ShowTimetable;
