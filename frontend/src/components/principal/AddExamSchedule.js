import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import { useNavigate } from 'react-router-dom';
import '../../styles/Schedule.css';

const AddSchedule = () => {
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [scheduleRows, setScheduleRows] = useState([{ date: new Date(), from: '', to: '', subject: '' }]);
    const [frequency, setFrequency] = useState('yearly');
    const [customFrequency, setCustomFrequency] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/fetch-class`).then(response => setClasses(response.data));
    }, []);

    useEffect(() => {
        if (selectedClass) {
            axios.get(`${process.env.REACT_APP_API_URL}/api/subjectss?class=${selectedClass}`).then(response => setSubjects(response.data));
        }
    }, [selectedClass]);

    const handleAddRow = () => {
        setScheduleRows([...scheduleRows, { date: new Date(), from: '', to: '', subject: '' }]);
    };

    const handleChange = (index, key, value) => {
        const newScheduleRows = [...scheduleRows];
        newScheduleRows[index][key] = value;
        setScheduleRows(newScheduleRows);
    };

    const handleSubmit = () => {
        setSuccessMessage('');
        setErrorMessage('');

        const promises = scheduleRows.map(row =>
            axios.post(`${process.env.REACT_APP_API_URL}/api/add-exam-schedule`, {
                class: selectedClass,
                date: row.date,
                from: row.from,
                to: row.to,
                subject: row.subject,
                frequency: frequency === 'other' ? customFrequency : frequency
            })
        );

        Promise.all(promises)
            .then(() => {
                setSuccessMessage('Timetable successfully scheduled.');
                navigate('/show-exam-schedule');
            })
            .catch(error => {
                setErrorMessage('Failed to add schedule.');
                console.error('Error adding schedule:', error);
            });
    };

    return (
        <div className="add-schedule-container">
            <h2>Add Exam Schedule</h2>
            <div>
                <label>Select Class: </label>
                <select onChange={(e) => setSelectedClass(e.target.value)}>
                    <option value="">Select Class</option>
                    {classes.map((classItem) => (
                        <option key={classItem._id} value={classItem.className}>{classItem.className}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Select Frequency: </label>
                <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                    <option value="yearly">Yearly</option>
                    <option value="half-yearly">Half Yearly</option>
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="other">Other</option>
                </select>
                {frequency === 'other' && (
                    <input
                        type="text"
                        value={customFrequency}
                        onChange={(e) => setCustomFrequency(e.target.value)}
                        placeholder="Enter custom frequency"
                    />
                )}
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Subject</th>
                    </tr>
                </thead>
                <tbody>
                    {scheduleRows.map((row, index) => (
                        <tr key={index}>
                            <td>
                                <DatePicker
                                    selected={row.date}
                                    onChange={(date) => handleChange(index, 'date', date)}
                                    dateFormat="yyyy/MM/dd"
                                    className="custom-datepicker"
                                />
                            </td>
                            <td>
                                <TimePicker
                                    clearIcon={null}
                                    disableClock={true}
                                    value={row.from}
                                    onChange={(time) => handleChange(index, 'from', time)}
                                    className="custom-timepicker"
                                />
                            </td>
                            <td>
                                <TimePicker
                                    clearIcon={null}
                                    disableClock={true}
                                    value={row.to}
                                    onChange={(time) => handleChange(index, 'to', time)}
                                    className="custom-timepicker"
                                />
                            </td>
                            <td>
                                <select onChange={(e) => handleChange(index, 'subject', e.target.value)}>
                                    <option value="">Select Subject</option>
                                    {subjects.map((subject) => (
                                        <option key={subject._id} value={subject.subjectName}>{subject.subjectName}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br/><br/>
            <button onClick={handleAddRow} className='button-st'>Add More Rows</button>
            <br />
            <button onClick={handleSubmit} className='button-st'>Submit</button>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default AddSchedule;
