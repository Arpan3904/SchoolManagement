import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/ShowTimetable.css';

const ShowTimetable = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [timetable, setTimetable] = useState(null);
  const [classes, setClasses] = useState([]);
  const [studentClass, setStudentClass] = useState(null);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole'); // Retrieve user role from localStorage
  const userEmail = localStorage.getItem('email'); // Retrieve user email from localStorage

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/timetable/pt/${selectedClass}/${date}`);
        setTimetable(response.data);
      } catch (error) {
        console.error('Error fetching timetable:', error);
        setTimetable(null); // Set timetable to null in case of error
      }
    };

    if (selectedClass) {
      fetchTimetable();
    }
  }, [date, selectedClass]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch-class`);
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    if (userRole !== 'student' && userEmail) {
      fetchClasses();
    }
  }, [userRole]);

  useEffect(() => {
    const fetchStudentClassDetails = async (email) => {
      try {
        
        const studentResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetchStbyEmail?email=${email}`);
        const student = studentResponse.data;
         
        const classResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/class/${student.classId}`);
        setStudentClass(classResponse.data.className);
        
        setSelectedClass(classResponse.data.className); // Set selected class for fetching timetable
      } catch (err) {
        console.error('Error fetching student or class data:', err);
      }
    };

    if (userRole === 'student' && userEmail) {
    console.log(userEmail);

      fetchStudentClassDetails(userEmail);
    }
  }, [userRole, userEmail]);

  const handleAddTimetable = () => {
    navigate("/add-timetable");
  };

  const handlePrint = () => {
    const printableElement = document.querySelector('.show-timetable-container');
    if (printableElement) {
      const originalDisplay = printableElement.style.display;
      printableElement.style.display = 'block';
      window.print();
      printableElement.style.display = originalDisplay;
    }
  };

  return (
    <div className="show-timetable-container">
      <h2>Timetable</h2>
      <div className="input-section">
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>
      {userRole !== 'student' ? (
        <div className="class-section">
          <label>Class:</label>
          <select id="classSelect" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="">Select Class</option>
            {classes.map((classItem) => (
              <option key={classItem._id} value={classItem.className}>
                {classItem.className}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <></>
      )}
      <div className="timetable-section">
        {timetable !== null ? (
          <table>
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>From</th>
                <th>To</th>
                <th>Subject</th>
                <th>Teacher</th>
              </tr>
            </thead>
            <tbody>
              {timetable.periods.map((period, index) => (
                <tr key={index}>
                  <td>{period.srNo}</td>
                  <td>{period.from}</td>
                  <td>{period.to}</td>
                  <td>{period.subject}</td>
                  <td>{period.teacher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No timetable available for the selected date and class.</p>
        )}
      </div>
      {/* Conditionally render Add Timetable button based on user role */}
      <div className="button-container">
        {userRole !== 'student' && (
          <button className="button-st" onClick={handleAddTimetable}>Add Timetable</button>
        )}
        <button className="button-st" onClick={handlePrint}>Print</button>
      </div>
    </div>
  );
};

export default ShowTimetable;