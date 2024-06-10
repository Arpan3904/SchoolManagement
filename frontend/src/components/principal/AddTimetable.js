import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import '../../styles/AddTimetable.css';
import { useNavigate } from 'react-router-dom';

const AddTimetable = () => {
  const navigate =useNavigate();
  const [date, setDate] = useState(new Date());
  const [periods, setPeriods] = useState([
    { srNo: 1, from: '', to: '', subject: '', teacher: '' }
  ]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
    fetchTeachers();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/fetch-class');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/show-subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/fetch-teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleChange = (index, name, value) => {
    const updatedPeriods = [...periods];
    updatedPeriods[index][name] = value;
    setPeriods(updatedPeriods);
  };

  const handleAddPeriod = () => {
    const newPeriods = [...periods, { srNo: periods.length + 1, from: '', to: '', subject: '', teacher: '' }];
    setPeriods(newPeriods);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formattedDate = date.toISOString().split('T')[0];
    const data = {
      date: formattedDate,
      periods,
      selectedClass
    };

    try {
      const response = await axios.post('http://localhost:5000/api/timetable', data);
      console.log(response.data);
      navigate('/timetable-management')
    } catch (error) {
      console.error('Error saving timetable:', error);
    }
  };

  return (
    <div className="add-timetable-container">
      <h2>Add Timetable</h2>
      <form onSubmit={handleSubmit}>
        <label>Date:</label>
        <DatePicker
          selected={date}
          onChange={date => setDate(date)}
          dateFormat="dd/MM/yyyy"
        />
        <div>
          <label htmlFor="classSelect">Class:</label>
          <select id="classSelect" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="">Select Class</option>
            {classes.map((classItem) => (
              <option key={classItem._id} value={classItem.className}>
                {classItem.className}
              </option>
            ))}
          </select>
        </div>
        <table className="timetable-table">
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
            {periods.map((period, index) => (
              <tr key={index}>
                <td>{period.srNo}</td>
                <td>
                  <input
                    type="time"
                    value={period.from}
                    onChange={(e) => handleChange(index, 'from', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="time"
                    value={period.to}
                    onChange={(e) => handleChange(index, 'to', e.target.value)}
                  />
                </td>
                <td>
                  <select value={period.subject} onChange={(e) => handleChange(index, 'subject', e.target.value)}>
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject._id} value={subject.subjectName}>
                        {subject.subjectName}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select value={period.teacher} onChange={(e) => handleChange(index, 'teacher', e.target.value)}>
                    <option value="">Select Teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.email} value={teacher.name}>
                        {`${teacher.firstName} ${teacher.lastName}`}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={handleAddPeriod}>Add More Period</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddTimetable;
