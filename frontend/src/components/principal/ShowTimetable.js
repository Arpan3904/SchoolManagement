import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../../styles/ShowTimetable.css'; // Import your CSS styles

const ShowTimetable = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Initial date in YYYY-MM-DD format
  const [selectedClass, setSelectedClass] = useState('');
  const [timetable, setTimetable] = useState(null);
  const [classes, setClasses] = useState([]);
  const [showClassSection, setShowClassSection] = useState(true); // State to toggle class section visibility
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        // Fetch timetable data from the server based on selected date and class
        const response = await axios.get(`http://localhost:5000/api/timetable/${selectedClass}/${date}`);
        setTimetable(response.data);
      } catch (error) {
        console.error('Error fetching timetable:', error);
      }
    };

    // Call fetchTimetable when either date or selectedClass changes
    fetchTimetable();
    
  }, [date, selectedClass]); // Dependency array containing date and selectedClass

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/fetch-class');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    // Fetch classes when the component mounts
    fetchClasses();
  }, []);

  // Function to handle navigation to "/add-timetable"
  const handleAddTimetable = () => {
    navigate("/add-timetable");
  };

  // Function to handle printing only the timetable container
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
      {/* Class Selection Section */}
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
      {/* Timetable Section */}
      <div className="timetable-section">
        {timetable ? (
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
      {/* Button to navigate to "/add-timetable" */}
      <button className="button-st" onClick={handleAddTimetable}>Add Timetable</button>
      {/* Print button */}
      <button className="button-st" onClick={handlePrint}>Print</button>
    </div>
  );
};

export default ShowTimetable;
