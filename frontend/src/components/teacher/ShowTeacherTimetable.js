import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ShowTimetable.css'; // Import CSS file for styling

const ShowTimetable = () => {
  const [timetable, setTimetable] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    // Fetch timetable for the logged-in teacher and selected date
    const fetchTimetable = async () => {
      try {
        // Retrieve teacher's email from localStorage
        const teacherEmail = localStorage.getItem('email'); // Assuming you store teacher's email as 'email' in localStorage
        console.log(teacherEmail);
        const response = await axios.get(`http://localhost:5000/api/timetable/${teacherEmail}/${selectedDate}`);
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
          <h3>{timetable.date}</h3>
          <table>
            <thead>
              <tr>
                <th>Sr No</th>
                <th>From</th>
                <th>To</th>
                <th>Subject</th>
                <th>Teacher</th>
              </tr>
            </thead>
            <tbody>
              {timetable.periods.map((period) => (
                <tr key={period.srNo}>
                  <td>{period.srNo}</td>
                  <td>{period.from}</td>
                  <td>{period.to}</td>
                  <td>{period.subject}</td>
                  <td>{period.teacher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No timetable available for the selected date.</p>
      )}
    </div>
  );
};

export default ShowTimetable;
